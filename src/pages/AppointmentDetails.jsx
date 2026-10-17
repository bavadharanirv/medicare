
import { Link, useLocation, useParams } from "react-router-dom";
import useAppointmentStore from "../store/appointmentStore.js";

function AppointmentDetails() {
  const { id } = useParams();
  const location = useLocation();

  const appointments = useAppointmentStore(
    (state) => state.appointments
  );

  const storedAppointment = appointments.find(
    (item) => String(item.id) === String(id)
  );

  let appointment =
    storedAppointment || location.state?.appointment || null;

  if (!appointment) {
    try {
      const savedAppointments = JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );

      appointment = savedAppointments.find(
        (item) => String(item.id) === String(id)
      ) || null;
    } catch {
      appointment = null;
    }
  }

  if (!appointment) {
    return (
      <section>
        <h2>Appointment not found.</h2>
        <Link to="/patient/appointments">View Appointments</Link>
      </section>
    );
  }

  const patientName =
    appointment.patient?.name ||
    appointment.patientName ||
    appointment.name ||
    "Not provided";

  const doctorName =
    appointment.doctorName ||
    appointment.doctor?.name ||
    appointment.doctor ||
    "Not provided";

  const specialty =
    appointment.specialty ||
    appointment.doctor?.specialty ||
    "Not provided";

  const fee = appointment.fee ?? appointment.doctor?.fee;

  return (
    <section className="summary-card">
      <h2>Booking Confirmation</h2>
      <p>Appointment ID: {appointment.id}</p>
      <p>Patient: {patientName}</p>
      <p>Doctor: {doctorName}</p>
      <p>Specialty: {specialty}</p>
      <p>Date: {appointment.date}</p>
      <p>Time: {appointment.time}</p>
      <p>
        Consultation Fee:{" "}
        {fee != null ? `₹${fee}` : "Not available"}
      </p>
      <p>Status: {appointment.status}</p>
      <Link to="/patient/appointments">View Appointments</Link>
    </section>
  );
}

export default AppointmentDetails;
