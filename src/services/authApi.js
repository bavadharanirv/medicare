
import { saveToken, clearToken } from "./authToken";

const API_URL = "http://localhost:3000";

async function postAuth(path, body) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Cannot connect to the server. Please start the backend."
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Invalid server response. Check server.js and restart the backend."
    );
  }

  if (!response.ok) {
    // Keep server internals out of the UI; return only a bounded, expected message.
    const message = typeof data.message === "string" ? data.message : "";
    const safeMessages = new Set([
      "Invalid email or password.",
      "Email already registered.",
      "Email and password are required.",
      "Password must contain at least 8 characters.",
      "Invalid email address.",
    ]);
    throw new Error(safeMessages.has(message) ? message : "Authentication failed. Please check your details and try again.");
  }

  if (!data.token || !data.patient) {
    throw new Error(
      "Authentication token or patient details were not returned."
    );
  }

  saveToken(data.token);
  return data.patient;
}

export function loginWithAPI(email, password) {
  return postAuth("/auth/login", { email, password });
}

export function registerWithAPI(name, email, password) {
  return postAuth("/auth/register", {
    name,
    email,
    password,
  });
}

export function logoutFromAPI() {
  clearToken();
}
