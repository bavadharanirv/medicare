
function FilterPanel({
  specialty,
  setSpecialty,
  availability = "All",
  setAvailability = () => {},
  maxFee = 2000,
  setMaxFee = () => {},
  minRating = 0,
  setMinRating = () => {},
}) {
  return (
    <div className="filter-panel">
      <label htmlFor="specialty">Specialty</label>
      <select
        id="specialty"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
      >
        <option value="All">All Doctors</option>
        <option value="Cardiologist">Cardiologist</option>
        <option value="Dermatologist">Dermatologist</option>
        <option value="Orthopedic">Orthopedic</option>
        <option value="Pediatrician">Pediatrician</option>
        <option value="Neurologist">Neurologist</option>
        <option value="General Physician">General Physician</option>
      </select>

      <label htmlFor="availability">Availability</label>
      <select
        id="availability"
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}
      >
        <option value="All">All Availability</option>
        <option value="Available">Available</option>
        <option value="Unavailable">Unavailable</option>
      </select>

      <label htmlFor="maxFee">Maximum Fee</label>
      <select
        id="maxFee"
        value={maxFee}
        onChange={(e) => setMaxFee(Number(e.target.value))}
      >
        <option value={2000}>All Fees</option>
        <option value={500}>Up to ₹500</option>
        <option value={700}>Up to ₹700</option>
        <option value={1000}>Up to ₹1000</option>
      </select>

      <label htmlFor="minRating">Minimum Rating</label>
      <select
        id="minRating"
        value={minRating}
        onChange={(e) => setMinRating(Number(e.target.value))}
      >
        <option value={0}>All Ratings</option>
        <option value={3}>3+ Stars</option>
        <option value={4}>4+ Stars</option>
        <option value={4.5}>4.5+ Stars</option>
      </select>
    </div>
  );
}

export default FilterPanel;
