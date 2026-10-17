import { Link, useParams } from "react-router-dom";
import { doctors } from "../data/doctors.js";

function DoctorDetailsRoute() {
  const { id } = useParams();
  const doctor = doctors.find((item) => item.id === Number(id));

  if (!doctor) {
    return <h2>Doctor not found.</h2>;
  }

  return (
    <section className="profile-card">
      <h2>{doctor.name}</h2>
      <p>Specialty: {doctor.specialty}</p>
      <p>Qualification: {doctor.qualification}</p>
      <p>Experience: {doctor.experience} years</p>
      <p>Rating: {doctor.rating}</p>
      <p>Consultation Fee: ₹{doctor.fee}</p>
      <p>Hospital: {doctor.hospital}</p>
      <p>Available Days: {doctor.availableDays.join(", ")}</p>
      <p>Time Slots: {doctor.timeSlots.join(", ")}</p>

      {doctor.available ? (
        <Link
          className="primary-btn"
          to={`/book-appointment?doctorId=${doctor.id}`}
        >
          Book Appointment
        </Link>
      ) : (
        <p>This doctor is currently unavailable.</p>
      )}
    </section>
  );
}

export default DoctorDetailsRoute;