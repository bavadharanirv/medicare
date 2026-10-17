
import {
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";

export default function useAppointments() {
  const [appointments, setAppointments] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  // Synchronize appointment data with browser storage
  useEffect(() => {
    localStorage.setItem(
      "appointments",
      JSON.stringify(appointments)
    );
  }, [appointments]);

  // Remind the user about appointments scheduled for today
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");

    appointments.forEach((appointment) => {
      if (
        appointment.date === today &&
        appointment.status === "Booked"
      ) {
        const key = `reminder_${appointment.id}`;

        if (!localStorage.getItem(key)) {
          alert(
            `Reminder: Appointment with ${appointment.doctor} at ${appointment.time}`
          );
          localStorage.setItem(key, "shown");
        }
      }
    });
  }, [appointments]);

  const bookAppointment = useCallback((appointment) => {
    setAppointments((previous) => [
      ...previous,
      { ...appointment, status: "Booked" }
    ]);

    setMessage("Appointment booked successfully!");
  }, []);

  const rescheduleAppointment = useCallback((appointment) => {
    const date = prompt(
      "Enter new date (YYYY-MM-DD):",
      appointment.date
    );

    if (!date) return;

    const time = prompt(
      "Enter new time:",
      appointment.time
    );

    if (!time) return;

    setAppointments((previous) =>
      previous.map((item) =>
        item.id === appointment.id
          ? { ...item, date, time }
          : item
      )
    );

    setMessage("Appointment rescheduled successfully!");
  }, []);

  const cancelAppointment = useCallback((id) => {
    setAppointments((previous) =>
      previous.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "Cancelled" }
          : appointment
      )
    );

    setMessage("Appointment cancelled");
  }, []);

  const selectTimeSlot = useCallback((slot) => {
    setSelectedTimeSlot(slot);
  }, []);

  const clearAppointment = useCallback((id) => {
    setAppointments((previous) =>
      previous.filter((appointment) => appointment.id !== id)
    );

    setMessage("Appointment removed successfully.");
  }, []);

  const appointmentCount = useMemo(
    () => appointments.length,
    [appointments]
  );

  const upcomingAppointments = useMemo(() => {
    const today = new Date().toLocaleDateString("en-CA");

    return appointments.filter(
      (appointment) =>
        appointment.date >= today &&
        appointment.status === "Booked"
    );
  }, [appointments]);

  const appointmentHistory = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.status === "Cancelled" ||
          appointment.status === "Completed"
      ),
    [appointments]
  );

  return {
    appointments,
    setAppointments,
    selectedTimeSlot,
    selectTimeSlot,
    message,
    setMessage,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
    clearAppointment,
    appointmentCount,
    upcomingAppointments,
    appointmentHistory
  };
}
