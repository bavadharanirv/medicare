
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchDoctors } from "../services/doctorApi.js";
import useAppointmentStore from "../store/appointmentStore.js";

function AppointmentBooking() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const doctorId = params.get("doctorId");

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const setPatientDetails = useAppointmentStore(
    (state) => state.setPatientDetails
  );
  const storeError = useAppointmentStore((state) => state.error);
  const clearError = useAppointmentStore((state) => state.clearError);

  useEffect(() => {
    let active = true;

    async function loadDoctors() {
      try {
        setLoading(true);
        setApiError("");

        const data = await fetchDoctors();

        if (active) setDoctors(data);
      } catch (err) {
        if (active) {
          setApiError(err.message || "Failed to load doctors.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDoctors();

    return () => {
      active = false;
    };
  }, []);

  const doctor = doctors.find(
    (item) => String(item.id) === String(doctorId)
  );

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    clearError();

    const numericAge = Number(age);

    if (
      !date ||
      !time ||
      !name.trim() ||
      !age ||
      !Number.isInteger(numericAge) ||
      numericAge < 1 ||
      numericAge > 120 ||
      !/^\d{10}$/.test(phone)
    ) {
      setError(
        "Enter a valid name, age (1-120), date, time and 10-digit phone number."
      );
      return;
    }

    if (!doctor || !doctor.available) {
      setError("Please select an available doctor.");
      return;
    }

    if (!(doctor.slots || []).includes(time)) {
      setError("Please select a valid time slot.");
      return;
    }

    const store = useAppointmentStore.getState();

    store.selectDoctor(doctor);
    store.selectDate(date);
    store.selectTimeSlot(time);

    setPatientDetails({
      name: name.trim(),
      age: numericAge,
      phone,
      email: "",
    });

    const appointment = useAppointmentStore.getState().bookAppointment();

    if (!appointment) {
      setError(
        useAppointmentStore.getState().error ||
          "Unable to book appointment."
      );
      return;
    }

    const completeAppointment = {
      ...appointment,
      doctor: doctor.name,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      fee: doctor.fee,
      name: name.trim(),
      age: numericAge,
      phone,
      patient: {
        ...(appointment.patient || {}),
        name: name.trim(),
        age: numericAge,
        phone,
      },
      status: "Booked",
    };

    navigate(`/appointment/${appointment.id}`, {
      state: { appointment: completeAppointment },
    });
  }

  if (loading) {
    return (
      <section className="booking-container">
        <p>Loading doctor details...</p>
      </section>
    );
  }

  if (apiError) {
    return (
      <section className="booking-container">
        <h2>Unable to load doctor details</h2>
        <p role="alert">{apiError}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
        <p>
          <Link to="/doctors">Back to Doctors</Link>
        </p>
      </section>
    );
  }

  if (!doctor || !doctor.available) {
    return (
      <section className="booking-container">
        <h2>Please select an available doctor.</h2>
        <Link to="/doctors">Find Doctors</Link>
      </section>
    );
  }

  return (
    <section className="booking-container">
      <form className="booking-form" onSubmit={handleSubmit}>
        <h2>Book Appointment</h2>

        <p>Doctor: {doctor.name}</p>
        <p>Specialty: {doctor.specialty}</p>
        <p>Consultation Fee: ₹{doctor.fee}</p>

        {(error || storeError) && (
          <p className="field-error" role="alert">
            {error || storeError}
          </p>
        )}

        <label htmlFor="appointment-date">Appointment Date</label>
        <input
          id="appointment-date"
          type="date"
          min={new Date().toLocaleDateString("en-CA")}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />

        <label htmlFor="appointment-time">Time Slot</label>
        <select
          id="appointment-time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          required
        >
          <option value="">Select a time</option>
          {(doctor.slots || []).map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <label htmlFor="patient-name">Patient Name</label>
        <input
          id="patient-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="patient-age">Patient Age</label>
        <input
          id="patient-age"
          type="number"
          min="1"
          max="120"
          step="1"
          placeholder="Enter age"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          required
        />

        <label htmlFor="patient-phone">Phone Number</label>
        <input
          id="patient-phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit phone number"
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value.replace(/\D/g, ""))
          }
          required
        />

        <button type="submit">Confirm Appointment</button>
      </form>
    </section>
  );
}

export default AppointmentBooking;
