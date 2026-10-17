
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 3000;
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "medicare-demo-secret-change-before-production";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());

async function readDB() {
  const content = await readFile(DB_FILE, "utf8");
  return JSON.parse(content);
}

async function writeDB(db) {
  await writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

function createToken(patient) {
  return jwt.sign(
    {
      patientId: patient.id,
      email: patient.email,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function authenticateToken(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Please log in to continue.",
    });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Session expired. Please log in again."
          : "Invalid token. Please log in again.",
    });
  }
}

// REGISTER: create a new patient account
app.post("/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: "Enter a valid email address.",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const db = await readDB();

    if (!Array.isArray(db.users)) {
      db.users = [];
    }

    const existingUser = db.users.find(
      (user) => user.email.toLowerCase() === cleanEmail
    );

    if (existingUser) {
      return res.status(409).json({
        message: "This email is already registered. Please log in.",
      });
    }

    const patient = {
      id: `PAT-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: await bcrypt.hash(password, 10),
    };

    db.users.push(patient);
    await writeDB(db);

    const token = createToken(patient);

    return res.status(201).json({
      message: "Account created successfully.",
      token,
      expiresIn: 3600,
      patient: {
        patientId: patient.id,
        name: patient.name,
        email: patient.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// LOGIN: verify email and password
app.post("/auth/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const db = await readDB();

    const user = (db.users || []).find(
      (item) => item.email.toLowerCase() === email
    );

    if (
      !user ||
      !user.passwordHash ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.json({
      message: "Login successful.",
      token,
      expiresIn: 3600,
      patient: {
        patientId: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Check current login
app.get("/auth/me", authenticateToken, async (req, res, next) => {
  try {
    const db = await readDB();

    const user = (db.users || []).find(
      (item) => item.id === req.user.patientId
    );

    if (!user) {
      return res.status(401).json({
        message: "Patient account not found.",
      });
    }

    res.json({
      patient: {
        patientId: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUBLIC: doctors
app.get("/doctors", async (req, res, next) => {
  try {
    const db = await readDB();
    res.json(db.doctors || []);
  } catch (error) {
    next(error);
  }
});

app.get("/doctors/:id", async (req, res, next) => {
  try {
    const db = await readDB();

    const doctor = (db.doctors || []).find(
      (item) => String(item.id) === String(req.params.id)
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    res.json(doctor);
  } catch (error) {
    next(error);
  }
});

// PUBLIC: availability
app.get("/availability", async (req, res, next) => {
  try {
    const db = await readDB();
    let items = db.availability || [];

    if (req.query.doctorId) {
      items = items.filter(
        (item) =>
          String(item.doctorId) === String(req.query.doctorId)
      );
    }

    if (req.query.date) {
      items = items.filter(
        (item) => item.date === req.query.date
      );
    }

    res.json(items);
  } catch (error) {
    next(error);
  }
});

// PUBLIC: time slots
app.get("/slots", async (req, res, next) => {
  try {
    const db = await readDB();
    let items = db.slots || [];

    if (req.query.doctorId) {
      items = items.filter(
        (item) =>
          String(item.doctorId) === String(req.query.doctorId)
      );
    }

    if (req.query.date) {
      items = items.filter(
        (item) => item.date === req.query.date
      );
    }

    res.json(items);
  } catch (error) {
    next(error);
  }
});

// PROTECTED: patient's appointment history
app.get("/appointments", authenticateToken, async (req, res, next) => {
  try {
    const db = await readDB();

    const items = (db.appointments || []).filter(
      (item) => item.patientId === req.user.patientId
    );

    res.json(items);
  } catch (error) {
    next(error);
  }
});

// PROTECTED: get one appointment
app.get("/appointments/:id", authenticateToken, async (req, res, next) => {
  try {
    const db = await readDB();

    const appointment = (db.appointments || []).find(
      (item) =>
        String(item.id) === String(req.params.id) &&
        item.patientId === req.user.patientId
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

// PROTECTED: book appointment
app.post("/appointments", authenticateToken, async (req, res, next) => {
  try {
    const db = await readDB();

    if (!Array.isArray(db.appointments)) {
      db.appointments = [];
    }

    const appointment = {
      ...req.body,
      id: String(Date.now()),
      patientId: req.user.patientId,
      status: "Booked",
    };

    db.appointments.push(appointment);
    await writeDB(db);

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
});

// PROTECTED: reschedule appointment
app.patch("/appointments/:id", authenticateToken, async (req, res, next) => {
  try {
    const db = await readDB();
    const items = db.appointments || [];

    const index = items.findIndex(
      (item) =>
        String(item.id) === String(req.params.id) &&
        item.patientId === req.user.patientId
    );

    if (index === -1) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    items[index] = {
      ...items[index],
      ...req.body,
      id: items[index].id,
      patientId: items[index].patientId,
    };

    db.appointments = items;
    await writeDB(db);

    res.json(items[index]);
  } catch (error) {
    next(error);
  }
});

// PROTECTED: cancel appointment
app.delete("/appointments/:id", authenticateToken, async (req, res, next) => {
  try {
    const db = await readDB();
    const items = db.appointments || [];

    const appointment = items.find(
      (item) =>
        String(item.id) === String(req.params.id) &&
        item.patientId === req.user.patientId
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    db.appointments = items.filter(
      (item) => String(item.id) !== String(req.params.id)
    );

    await writeDB(db);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    message: "Internal server error.",
  });
});

app.listen(PORT, () => {
  console.log(`MediCare API running at http://localhost:${PORT}`);
  console.log("Registration, JWT login and protected APIs enabled.");
});
