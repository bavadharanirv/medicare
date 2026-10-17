
const appointmentMiddleware = (config) => (set, get, api) => {
  const trackedSet = (partial, replace) => {
    const previousState = get();

    set(partial, replace);

    const nextState = get();
    const previousAppointments = previousState.appointments || [];
    const nextAppointments = nextState.appointments || [];

    if (nextAppointments.length > previousAppointments.length) {
      console.log("[Middleware] Appointment booked");
    }

    const statusChanged = nextAppointments.some((appointment) => {
      const previous = previousAppointments.find(
        (item) => item.id === appointment.id
      );

      return previous && previous.status !== appointment.status;
    });

    if (statusChanged) {
      console.log("[Middleware] Appointment status changed");
    }

    console.log("[Middleware] State updated:", nextState);
  };

  return config(trackedSet, get, api);
};

export default appointmentMiddleware;
