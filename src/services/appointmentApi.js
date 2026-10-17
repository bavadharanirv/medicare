
import { getToken, clearToken } from "./authToken";

const API_URL = "http://localhost:3000";

async function request(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Attach JWT token to appointment API requests
  if (url.includes("/appointments") && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && url.includes("/appointments")) {
    clearToken();

    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }

    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // Keep the default error message
    }

    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
}

export const fetchAppointments = () =>
  request(`${API_URL}/appointments`);

export const fetchAppointmentById = (id) =>
  request(`${API_URL}/appointments/${id}`);

export const createAppointment = (appointment) =>
  request(`${API_URL}/appointments`, {
    method: "POST",
    body: JSON.stringify(appointment),
  });

export const updateAppointment = (id, changes) =>
  request(`${API_URL}/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });

export const deleteAppointment = (id) =>
  request(`${API_URL}/appointments/${id}`, {
    method: "DELETE",
  });

export const fetchDoctorsFromAPI = () =>
  request(`${API_URL}/doctors`);

export const fetchAppointmentHistory = () =>
  request(`${API_URL}/appointments`);
