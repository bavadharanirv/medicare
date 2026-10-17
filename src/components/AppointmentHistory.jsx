
import { Link } from "react-router-dom";
import useAppointmentStore from "../store/appointmentStore.js";

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function AppointmentHistory() {
  const appointments = useAppointmentStore(
    (state) => state.appointments
  );

  const cancelAppointment = useAppointmentStore(
    (state) => state.cancelAppointment
  );

  const today = getToday();

  const upcoming = appointments.filter(
    (item) =>
      (item.status === "Booked" || item.status === "Rescheduled") &&
      item.date >= today
  );

  const pastOrCancelled = appointments.filter(
    (item) =>
      item.status === "Cancelled" ||
      item.status === "Completed" ||
      item.date < today
  );

  return (
    <section className="history">
      <h2>Appointment History</h2>

      <p>Total appointments: {appointments.length}</p>
      <p>Upcoming appointments: {upcoming.length}</p>
      <p>Past or cancelled appointments: {pastOrCancelled.length}</p>

      {appointments.length === 0 ? (
        <div className="appointment-empty">
          No appointments available. Please book an appointment first.
        </div>
      ) : (
        appointments.map((item) => (
          <article className="appointment-card" key={item.id}>
            <h3>
              {item.doctorName ||
                item.doctor ||
                item.patient?.doctorName ||
                "Doctor"}
            </h3>

            <p>
              Patient: {item.name || item.patient?.name || "Patient"}
            </p>

            <p>
              Date: {item.date} | Time: {item.time}
            </p>

            <p>Status: {item.status}</p>

            <Link to={`/appointment/${item.id}`}>
              View Details
            </Link>

            {(item.status === "Booked" ||
              item.status === "Rescheduled") &&
              item.date >= today && (
                <button
                  type="button"
                  onClick={() => cancelAppointment(item.id)}
                >
                  Cancel Appointment
                </button>
              )}
          </article>
        ))
      )}
    </section>
  );
}

export default AppointmentHistory;
