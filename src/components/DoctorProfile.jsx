
import { Link, useParams } from "react-router-dom";
import { doctors } from "../data/doctors.js";

export default function DoctorProfile() {
  const { id } = useParams();

  const doctor = doctors.find(
    (item) => String(item.id) === String(id)
  );

  if (!doctor) {
    return (
      <section className="doctor-profile">
        <h2>Doctor not found</h2>
        <Link to="/doctors">Back to Doctors</Link>
      </section>
    );
  }

  return (
    <section className="doctor-profile">
      <h2>{doctor.name}</h2>
      <p>Specialty: {doctor.specialty}</p>
      <p>Experience: {doctor.experience} years</p>
      <p>Rating: {doctor.rating}</p>
      <p>Consultation Fee: ₹{doctor.fee}</p>
      <p>Hospital: {doctor.hospital}</p>
      <p>Status: {doctor.available ? "Available" : "Unavailable"}</p>

      <h3>Available Time Slots</h3>

      {doctor.available ? (
        <div className="doctor-time-slots">
          {doctor.slots.map((slot) => (
            <span className="time-slot" key={slot}>
              {slot}
            </span>
          ))}
        </div>
      ) : (
        <p>Currently unavailable for booking.</p>
      )}

      {doctor.available && (
        <Link
          to={`/book-appointment?doctorId=${doctor.id}`}
          className="btn btn-primary"
        >
          Book Appointment
        </Link>
      )}

      <p>
        <Link to="/doctors">Back to Doctors</Link>
      </p>
    </section>
  );
}
