
import useAppointmentStore from "../store/appointmentStore.js";

function PatientProfile() {
  const appointments = useAppointmentStore(
    (state) => state.appointments
  );

  if (appointments.length === 0) {
    return (
      <div className="patient-profile">
        <div className="patient-avatar"></div>
        <h1>Patient Profile</h1>
        <p>No appointment has been booked yet.</p>
      </div>
    );
  }

  return (
    <div className="patient-profile">
      <div className="patient-avatar"></div>

      <h1>Patient Profiles</h1>

      <p className="profile-description">
        Booked patient and appointment information
      </p>

      <div className="patient-list">
        {appointments.map((appointment) => {
          const patient = appointment.patient || {};

          return (
            <div className="patient-card" key={appointment.id}>
              <div className="patient-header">
                <div className="patient-avatar-small"></div>

                <div>
                  <h2>
                    {appointment.name ||
                      appointment.patientName ||
                      patient.name ||
                      "Patient"}
                  </h2>
                  <p>Patient Information</p>
                </div>
              </div>

              <div className="patient-details">
                <p>
                  <strong>Age:</strong>{" "}
                  {appointment.age || "Not provided"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {appointment.phone || patient.phone || "Not provided"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {appointment.email || patient.email || "Not provided"}
                </p>

                <p>
                  <strong>Doctor:</strong>{" "}
                  {appointment.doctorName ||
                    appointment.doctor ||
                    "Not provided"}
                </p>

                <p>
                  <strong>Specialty:</strong>{" "}
                  {appointment.specialty || "Not provided"}
                </p>

                <p>
                  <strong>Hospital:</strong>{" "}
                  {appointment.hospital || "Not provided"}
                </p>

                <p>
                  <strong>Appointment Date:</strong>{" "}
                  {appointment.date || "Not provided"}
                </p>

                <p>
                  <strong>Appointment Time:</strong>{" "}
                  {appointment.time || "Not provided"}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {appointment.duration || "Not provided"}
                </p>

                <p>
                  <strong>Reason:</strong>{" "}
                  {appointment.reason || "Not specified"}
                </p>

                <p>
                  <strong>Consultation Fee:</strong>{" "}
                  ₹{appointment.fee ?? "Not provided"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {appointment.status || "Booked"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PatientProfile;
