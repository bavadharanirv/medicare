
import { useState, useMemo } from "react";
import { doctors as doctorData } from "../data/doctors.js";

export default function useDoctors() {
  const [doctors, setDoctors] = useState(doctorData);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [maxFee, setMaxFee] = useState(2000);
  const [minRating, setMinRating] = useState(0);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const term = search.trim().toLowerCase();

      const matchesSearch =
        doctor.name.toLowerCase().includes(term) ||
        doctor.specialty.toLowerCase().includes(term);

      const matchesSpecialty =
        specialty === "All" || doctor.specialty === specialty;

      const matchesAvailability =
        availability === "All" ||
        (availability === "Available" && doctor.available) ||
        (availability === "Unavailable" && !doctor.available);

      return (
        matchesSearch &&
        matchesSpecialty &&
        matchesAvailability &&
        doctor.fee <= Number(maxFee) &&
        doctor.rating >= Number(minRating)
      );
    });
  }, [doctors, search, specialty, availability, maxFee, minRating]);

  const availableDoctors = useMemo(
    () => filteredDoctors.filter((doctor) => doctor.available),
    [filteredDoctors]
  );

  return {
    doctors,
    setDoctors,
    search,
    setSearch,
    specialty,
    setSpecialty,
    availability,
    setAvailability,
    maxFee,
    setMaxFee,
    minRating,
    setMinRating,
    filteredDoctors,
    availableDoctors,
  };
}
