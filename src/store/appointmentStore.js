
import { create } from "zustand";
import appointmentMiddleware from "./appointmentMiddleware.js";
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/appointmentApi.js";

const useAppointmentStore = create(
  appointmentMiddleware((set, get) => ({
    appointments: [],
    selectedDoctor: null,
    selectedDate: "",
    selectedTimeSlot: "",
    patientDetails: {
      name: "",
      age: "",
      phone: "",
      email: "",
    },
    loading: false,
    error: null,

    selectDoctor: (doctor) =>
      set({
        selectedDoctor: doctor,
        selectedDate: "",
        selectedTimeSlot: "",
        error: null,
      }),

    selectDate: (date) =>
      set({
        selectedDate: date,
        selectedTimeSlot: "",
      }),

    selectTimeSlot: (slot) =>
      set({ selectedTimeSlot: slot }),

    setPatientDetails: (details) =>
      set((state) => ({
        patientDetails: {
          ...state.patientDetails,
          ...details,
        },
      })),

    loadAppointments: async () => {
      set({ loading: true, error: null });

      try {
        const appointments = await fetchAppointments();

        set({
          appointments: Array.isArray(appointments)
            ? appointments
            : [],
          loading: false,
        });

        return appointments;
      } catch (error) {
        set({
          loading: false,
          error: error.message || "Failed to load appointments.",
        });
        return null;
      }
    },

    bookAppointment: async () => {
      const state = get();
      const age = Number(state.patientDetails.age);

      if (
        !state.selectedDoctor ||
        !state.selectedDate ||
        !state.selectedTimeSlot ||
        !state.patientDetails.name.trim() ||
        !state.patientDetails.phone.trim() ||
        !state.patientDetails.age ||
        !Number.isInteger(age) ||
        age < 1 ||
        age > 120
      ) {
        set({
          error:
            "Please enter the patient name, valid age, phone number, date and time slot.",
        });
        return null;
      }

      const appointment = {
        doctorId: state.selectedDoctor.id,
        doctorName: state.selectedDoctor.name,
        specialty: state.selectedDoctor.specialty,
        fee: state.selectedDoctor.fee,
        date: state.selectedDate,
        time: state.selectedTimeSlot,
        patient: {
          ...state.patientDetails,
          age,
        },
        status: "Booked",
      };

      set({ loading: true, error: null });

      try {
        const savedAppointment =
          await createAppointment(appointment);

        set((current) => ({
          appointments: [
            ...current.appointments,
            savedAppointment,
          ],
          loading: false,
          error: null,
        }));

        return savedAppointment;
      } catch (error) {
        set({
          loading: false,
          error:
            error.message || "Failed to book appointment.",
        });
        return null;
      }
    },

    rescheduleAppointment: async (id, date, time) => {
      const appointment = get().appointments.find(
        (item) => String(item.id) === String(id)
      );

      if (
        !appointment ||
        !["Booked", "Rescheduled"].includes(appointment.status)
      ) {
        set({ error: "Appointment cannot be rescheduled." });
        return false;
      }

      set({ loading: true, error: null });

      try {
        const updatedAppointment = await updateAppointment(id, {
          date,
          time,
          status: "Rescheduled",
        });

        set((state) => ({
          appointments: state.appointments.map((item) =>
            String(item.id) === String(id)
              ? { ...item, ...updatedAppointment }
              : item
          ),
          loading: false,
          error: null,
        }));

        return true;
      } catch (error) {
        set({
          loading: false,
          error: error.message || "Failed to reschedule.",
        });
        return false;
      }
    },

    cancelAppointment: async (id) => {
      const appointment = get().appointments.find(
        (item) => String(item.id) === String(id)
      );

      if (!appointment) {
        set({ error: "Appointment not found." });
        return false;
      }

      set({ loading: true, error: null });

      try {
        await deleteAppointment(id);

        set((state) => ({
          appointments: state.appointments.filter(
            (item) => String(item.id) !== String(id)
          ),
          loading: false,
          error: null,
        }));

        return true;
      } catch (error) {
        set({
          loading: false,
          error: error.message || "Failed to cancel appointment.",
        });
        return false;
      }
    },

    clearError: () => set({ error: null }),
  }))
);

export default useAppointmentStore;
