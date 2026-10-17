
export default function TimeSlot({
  time,
  selected,
  disabled = false,
  onSelect,
}) {
  return (
    <button
      type="button"
      className={`time-slot ${selected ? "selected" : ""}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(time)}
    >
      {time}
    </button>
  );
}
