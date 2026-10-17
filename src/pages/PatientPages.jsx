
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAppointmentStore from "../store/appointmentStore.js";
import { fetchTimeSlots } from "../services/doctorApi.js";

function useLoadAppointments() {
  const loadAppointments = useAppointmentStore(
    (state) => state.loadAppointments
  );

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);
}

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPatientName(item) {
  return (
    item.patient?.name ||
    item.patientName ||
    item.name ||
    "Patient"
  );
}

function getDoctorName(item) {
  return (
    item.doctorName ||
    item.doctor?.name ||
    item.doctor ||
    "Doctor"
  );
}

function getAvailableSlotTimes(data) {
  const list = Array.isArray(data) ? data : data?.slots || [];

  return list
    .filter((slot) => {
      if (typeof slot === "string") return true;
      return slot.available === true;
    })
    .map((slot) =>
      typeof slot === "string" ? slot : slot.time
    )
    .filter(Boolean);
}

function AppointmentCard({ item }) {
  const rescheduleAppointment = useAppointmentStore(
    (state) => state.rescheduleAppointment
  );

  const [editing, setEditing] = useState(false);
  const [newDate, setNewDate] = useState(item.date || "");
  const [newTime, setNewTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing || !item.doctorId || !newDate) {
      setSlots([]);
      setNewTime("");
      return;
    }

    let active = true;

    async function loadSlots() {
      setLoadingSlots(true);
      setError("");
      setSlots([]);
      setNewTime("");

      try {
        const data = await fetchTimeSlots(
          item.doctorId,
          newDate
        );

        if (active) {
          const availableTimes = getAvailableSlotTimes(data);
          setSlots(availableTimes);

          if (availableTimes.length === 0) {
            setError(
              "No available slots for this doctor on the selected date."
            );
          }
        }
      } catch (err) {
        console.error("Unable to load slots:", err);

        if (active) {
          setError("Unable to load available time slots.");
        }
      } finally {
        if (active) {
          setLoadingSlots(false);
        }
      }
    }

    loadSlots();

    return () => {
      active = false;
    };
  }, [editing, item.doctorId, newDate]);

  async function handleReschedule() {
    setError("");

    if (!newDate || !newTime) {
      setError("Please select a date and available time.");
      return;
    }

    if (newDate < getToday()) {
      setError("Please select today or a future date.");
      return;
    }

    if (!slots.includes(newTime)) {
      setError("Please select a time from the available slots.");
      return;
    }

    try {
      const success = await rescheduleAppointment(
        item.id,
        newDate,
        newTime
      );

      if (success) {
        setEditing(false);
        setError("");
      } else {
        const storeError = useAppointmentStore.getState().error;
        setError(
          storeError || "Rescheduling failed. Please try again."
        );
      }
    } catch (err) {
      console.error("Reschedule failed:", err);
      setError("Unable to reschedule. Please try again.");
    }
  }

  const canReschedule = ["Booked", "Rescheduled"].includes(
    item.status
  );

  return (
    <article className="appointment-card">
      <h4>{getDoctorName(item)}</h4>
      <p>Patient: {getPatientName(item)}</p>
      <p>Date: {item.date}</p>
      <p>Time: {item.time}</p>
      <p>Status: {item.status}</p>

      <Link to={`/appointment/${item.id}`}>View Details</Link>

      {canReschedule && (
        <div style={{ marginTop: "20px" }}>
          {!editing ? (
            <button
              type="button"
              onClick={() => {
                setNewDate(item.date || "");
                setNewTime("");
                setError("");
                setEditing(true);
              }}
            >
              Reschedule
            </button>
          ) : (
            <div
              style={{
                marginTop: "14px",
                padding: "20px",
                maxWidth: "520px",
                width: "100%",
                boxSizing: "border-box",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "18px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    minWidth: 0,
                  }}
                >
                  <span>New Date</span>
                  <input
                    type="date"
                    min={getToday()}
                    value={newDate}
                    onChange={(event) =>
                      setNewDate(event.target.value)
                    }
                    style={{
                      width: "100%",
                      minWidth: 0,
                      boxSizing: "border-box",
                      padding: "10px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                    }}
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    minWidth: 0,
                  }}
                >
                  <span>Available Time</span>
                  <select
                    value={newTime}
                    onChange={(event) =>
                      setNewTime(event.target.value)
                    }
                    disabled={loadingSlots || slots.length === 0}
                    style={{
                      width: "100%",
                      minWidth: 0,
                      boxSizing: "border-box",
                      padding: "10px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      background: "#fff",
                    }}
                  >
                    <option value="">
                      {loadingSlots
                        ? "Loading slots..."
                        : slots.length > 0
                          ? "Select a time"
                          : "No slots available"}
                    </option>

                    {slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {error && (
                <p
                  style={{
                    color: "#dc2626",
                    marginTop: "12px",
                  }}
                  role="alert"
                >
                  {error}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={handleReschedule}
                  disabled={loadingSlots || slots.length === 0}
                >
                  Confirm Reschedule
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setError("");
                    setNewDate(item.date || "");
                    setNewTime("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function PatientAppointments() {
  useLoadAppointments();

  const appointments = useAppointmentStore(
    (state) => state.appointments
  );
  const loading = useAppointmentStore((state) => state.loading);
  const error = useAppointmentStore((state) => state.error);

  return (
    <section>
      <h3>My Appointments</h3>
      <p>Total Appointments: {appointments.length}</p>

      {loading && <p>Loading appointments...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && appointments.length === 0 ? (
        <p>No appointments available.</p>
      ) : (
        appointments.map((item) => (
          <AppointmentCard key={item.id} item={item} />
        ))
      )}
    </section>
  );
}

export function UpcomingAppointments() {
  useLoadAppointments();

  const appointments = useAppointmentStore(
    (state) => state.appointments
  );
  const loading = useAppointmentStore((state) => state.loading);
  const error = useAppointmentStore((state) => state.error);
  const today = getToday();

  const upcoming = appointments.filter(
    (item) =>
      ["Booked", "Rescheduled"].includes(item.status) &&
      item.date >= today
  );

  return (
    <section>
      <h3>Upcoming Appointments</h3>
      <p>Upcoming: {upcoming.length}</p>

      {loading && <p>Loading appointments...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && upcoming.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        upcoming.map((item) => (
          <AppointmentCard key={item.id} item={item} />
        ))
      )}
    </section>
  );
}

export function PatientHistory() {
  useLoadAppointments();

  const appointments = useAppointmentStore(
    (state) => state.appointments
  );
  const loading = useAppointmentStore((state) => state.loading);
  const error = useAppointmentStore((state) => state.error);
  const today = getToday();

  const history = appointments.filter(
    (item) =>
      item.status === "Cancelled" ||
      item.status === "Completed" ||
      item.date < today
  );

  return (
    <section>
      <h3>Appointment History</h3>
      <p>Past or Cancelled: {history.length}</p>

      {loading && <p>Loading appointments...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && history.length === 0 ? (
        <p>No appointment history available.</p>
      ) : (
        history.map((item) => (
          <AppointmentCard key={item.id} item={item} />
        ))
      )}
    </section>
  );
}

export function PatientProfilePage() {
  useLoadAppointments();

  const appointments = useAppointmentStore(
    (state) => state.appointments
  );
  const loading = useAppointmentStore((state) => state.loading);
  const error = useAppointmentStore((state) => state.error);

  const latestAppointment = appointments.length
    ? appointments[appointments.length - 1]
    : null;

  return (
    <section>
      <h3>Patient Profile</h3>

      {loading && <p>Loading appointments...</p>}
      {error && <p role="alert">{error}</p>}

      {latestAppointment ? (
        <>
          <p>
            Patient Name: {getPatientName(latestAppointment)}
          </p>
          <p>
            Age: {latestAppointment.patient?.age ?? "Not provided"}
          </p>
          <p>
            Phone:{" "}
            {latestAppointment.patient?.phone ||
              latestAppointment.phone ||
              "Not provided"}
          </p>
          <p>Total Appointments: {appointments.length}</p>
        </>
      ) : (
        !loading && <p>Welcome! No appointments have been booked yet.</p>
      )}

      <Link to="/doctors">Find Doctors</Link>
    </section>
  );
}
