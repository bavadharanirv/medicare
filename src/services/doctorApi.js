
import { fetchWithCache } from "../store/doctorCache.js";

const API_URL = "http://localhost:3000";

export async function fetchDoctors() {
  return fetchWithCache(`${API_URL}/doctors`);
}

export async function fetchDoctorById(id) {
  return fetchWithCache(`${API_URL}/doctors/${id}`);
}

export async function fetchDoctorAvailability(id) {
  return fetchWithCache(
    `${API_URL}/availability?doctorId=${encodeURIComponent(String(id))}`
  );
}

export async function fetchTimeSlots(id, date) {
  const response = await fetch(`${API_URL}/slots`);

  if (!response.ok) {
    throw new Error("Failed to fetch available time slots");
  }

  const allSlots = await response.json();

  return allSlots.filter(
    (slot) =>
      String(slot.doctorId) === String(id) &&
      slot.date === date &&
      slot.available === true
  );
}
