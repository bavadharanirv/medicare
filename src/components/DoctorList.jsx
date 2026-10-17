
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch("http://localhost:3000/doctors");
        if (!response.ok) {
          throw new Error("Failed to load doctors");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      doctor.name.toLowerCase().includes(searchText) ||
      doctor.specialty.toLowerCase().includes(searchText);

    const matchesSpecialty =
      specialty === "All" || doctor.specialty === specialty;

    const matchesAvailability =
      availability === "All" ||
      (availability === "Available" && doctor.available) ||
      (availability === "Unavailable" && !doctor.available);

    const matchesMinFee =
      minFee === "" || doctor.fee >= Number(minFee);

    const matchesMaxFee =
      maxFee === "" || doctor.fee <= Number(maxFee);

    return (
      matchesSearch &&
      matchesSpecialty &&
      matchesAvailability &&
      matchesMinFee &&
      matchesMaxFee
    );
  });

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  if (error) {
    return (
      <section>
        <h2>Unable to load doctors</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section>
      <h2>Our Doctors</h2>

      <div className="filter-panel">
        <input
          className="search-box"
          type="search"
          placeholder="Search doctor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        >
          <option value="All">All Specialties</option>
          {[...new Set(doctors.map((doctor) => doctor.specialty))].map(
            (item) => (
              <option key={item} value={item}>
                {item}
              </option>
            )
          )}
        </select>

        <input
          type="number"
          min="0"
          placeholder="Minimum Fee (₹)"
          value={minFee}
          onChange={(e) => setMinFee(e.target.value)}
        />

        <input
          type="number"
          min="0"
          placeholder="Maximum Fee (₹)"
          value={maxFee}
          onChange={(e) => setMaxFee(e.target.value)}
        />

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="All">All Doctors</option>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setSpecialty("All");
            setAvailability("All");
            setMinFee("");
            setMaxFee("");
          }}
        >
          Reset Filters
        </button>
      </div>

      <div className="doctor-list">
        {filteredDoctors.length === 0 ? (
          <p>No doctors match your filters.</p>
        ) : (
          filteredDoctors.map((doctor) => (
            <article className="doctor-card" key={doctor.id}>
              <h3>{doctor.name}</h3>
              <p>{doctor.specialty}</p>
              <p>Consultation Fee: ₹{doctor.fee}</p>
              <Link to={`/doctor/${doctor.id}`}>View Details</Link>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default DoctorList;
