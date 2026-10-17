
export default function FilterPanel({
  specialty,
  setSpecialty,
  availability,
  setAvailability,
  minRating,
  setMinRating,
  maxFee,
  setMaxFee,
  specialties = [],
}) {
  return (
    <section className="filter-panel">
      <label>
        <span className="sr-only">Search by specialty</span>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        >
          <option value="All Specialties">All Specialties</option>
          {specialties
            .filter((item) => item !== "All Specialties")
            .map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
        </select>
      </label>

      <label>
        <span className="sr-only">Availability</span>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="All Doctors">All Doctors</option>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      </label>

      <label>
        <span className="sr-only">Minimum rating</span>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="0">Any Rating</option>
          <option value="3">3+ Rating</option>
          <option value="4">4+ Rating</option>
          <option value="4.5">4.5+ Rating</option>
          <option value="4.8">4.8+ Rating</option>
        </select>
      </label>

      <label>
        <span className="sr-only">Maximum consultation fee</span>
        <select
          value={maxFee}
          onChange={(e) => setMaxFee(e.target.value)}
        >
          <option value="2000">Any Fee</option>
          <option value="400">Up to ₹400</option>
          <option value="500">Up to ₹500</option>
          <option value="600">Up to ₹600</option>
          <option value="800">Up to ₹800</option>
          <option value="1000">Up to ₹1000</option>
        </select>
      </label>
    </section>
  );
}
