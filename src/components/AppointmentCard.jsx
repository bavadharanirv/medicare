
function AppointmentCard({ item }) {
  const rescheduleAppointment = useAppointmentStore(
    (state) => state.rescheduleAppointment
  );

  const cancelAppointment = useAppointmentStore(
    (state) => state.cancelAppointment
  );

  const [editing, setEditing] = useState(false);
  const [newDate, setNewDate] = useState(item.date || "");
  const [newTime, setNewTime] = useState(item.time || "");
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing || !item.doctorId || !newDate) {
      setSlots([]);
      return;
    }

    let active = true;

    async function loadSlots() {
      setLoadingSlots(true);
      setError("");
      setSlots([]);

      try {
        const data = await fetchTimeSlots(item.doctorId, newDate);
        const slotList = Array.isArray(data)
          ? data
          : data?.slots || [];

        if (active) {
          const availableSlots = slotList.filter(
            (slot) =>
              typeof slot === "string" || slot.available === true
          );

          setSlots(availableSlots);

          setNewTime((currentTime) =>
            availableSlots.some(
              (slot) =>
                (typeof slot === "string" ? slot : slot.time) ===
                currentTime
            )
              ? currentTime
              : ""
          );

          if (availableSlots.length === 0) {
            setError("No available slots for this date.");
          }
        }
      } catch (err) {
        if (active) {
          setSlots([]);
          setError("Unable to load available time slots.");
        }
      } finally {
        if (active) setLoadingSlots(false);
      }
    }

    loadSlots();

    return () => {
      active = false;
    };
  }, [editing, item.doctorId, newDate]);

  async function handleReschedule() {
    setError("");

    if (!newDate || !newTime) {
      setError("Please select an available date and time.");
      return;
    }

    if (newDate < getToday()) {
      setError("Please select today or a future date.");
      return;
    }

    const selectedSlotExists = slots.some(
      (slot) =>
        (typeof slot === "string" ? slot : slot.time) === newTime
    );

    if (!selectedSlotExists) {
      setError("Please select a valid available time slot.");
      return;
    }

    setSaving(true);

    try {
      const success = await rescheduleAppointment(
        item.id,
        newDate,
        newTime
      );

      if (success) {
        setEditing(false);
        setError("");
      } else {
        setError(
          useAppointmentStore.getState().error ||
            "Rescheduling failed. Please try again."
        );
      }
    } catch (err) {
      setError("Unable to reschedule. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancelAppointment() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    setError("");
    setSaving(true);

    try {
      const success = await cancelAppointment(item.id);

      if (!success) {
        setError(
          useAppointmentStore.getState().error ||
            "Unable to cancel appointment."
        );
      }
    } catch (err) {
      setError("Unable to cancel appointment. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const canReschedule = ["Booked", "Rescheduled"].includes(
    item.status
  );

  return (
    <article className="appointment-card">
      <h4>{getDoctorName(item)}</h4>
      <p>Patient: {getPatientName(item)}</p>
      <p>Date: {item.date}</p>
      <p>Time: {item.time}</p>
      <p>Status: {item.status}</p>

      <Link to={`/appointment/${item.id}`}>View Details</Link>

      {error && (
        <p role="alert" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      {canReschedule && (
        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          {!editing ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setNewDate(item.date || "");
                setNewTime(item.time || "");
                setError("");
                setEditing(true);
              }}
            >
              Reschedule
            </button>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                maxWidth: "520px",
                marginTop: "12px",
              }}
            >
              <label style={{ display: "grid", gap: "7px" }}>
                New Date
                <input
                  type="date"
                  min={getToday()}
                  value={newDate}
                  onChange={(event) =>
                    setNewDate(event.target.value)
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "10px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: "7px" }}>
                Available Time
                <select
                  value={newTime}
                  onChange={(event) =>
                    setNewTime(event.target.value)
                  }
                  disabled={loadingSlots || slots.length === 0}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "10px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    background: "#fff",
                  }}
                >
                  <option value="">
                    {loadingSlots
                      ? "Loading slots..."
                      : slots.length
                        ? "Select a time"
                        : "No slots available"}
                  </option>

                  {slots.map((slot) => {
                    const time =
                      typeof slot === "string" ? slot : slot.time;
                    const key =
                      typeof slot === "string"
                        ? slot
                        : slot.id || slot.time;

                    return (
                      <option key={key} value={time}>
                        {time}
                      </option>
                    );
                  })}
                </select>
              </label>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  gridColumn: "1 / -1",
                }}
              >
                <button
                  type="button"
                  onClick={handleReschedule}
                  disabled={loadingSlots || saving || slots.length === 0}
                >
                  {saving ? "Saving..." : "Confirm Reschedule"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setEditing(false);
                    setError("");
                    setNewDate(item.date || "");
                    setNewTime(item.time || "");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {canReschedule && (
        <button
          type="button"
          onClick={handleCancelAppointment}
          disabled={saving}
          style={{
            marginTop: "12px",
            marginLeft: "10px",
            padding: "10px 16px",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {saving ? "Please wait..." : "Cancel Appointment"}
        </button>
      )}
    </article>
  );
}
