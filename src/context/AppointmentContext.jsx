
import {
  createContext,
  useContext,
  useMemo,
  useState
} from "react";

import useDoctors from "../hooks/useDoctors.js";
import useAppointments from "../hooks/useAppointments.js";

const AppointmentContext = createContext(null);

export function AppointmentProvider({ children }) {
  const doctorData = useDoctors();
  const appointmentData = useAppointments();
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const availableSlots = useMemo(() => {
    if (!selectedDoctor || !selectedDoctor.available) {
      return [];
    }

    return selectedDoctor.slots || [];
  }, [selectedDoctor]);

  const value = useMemo(
    () => ({
      ...doctorData,
      ...appointmentData,
      selectedDoctor,
      setSelectedDoctor,
      availableSlots
    }),
    [doctorData, appointmentData, selectedDoctor, availableSlots]
  );

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointmentContext() {
  const context = useContext(AppointmentContext);

  if (!context) {
    throw new Error(
      "useAppointmentContext must be used inside AppointmentProvider"
    );
  }

  return context;
}
