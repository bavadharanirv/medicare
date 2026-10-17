
export default function Button({
  children,
  type = "button",
  variant = "btn-primary",
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={type}
      className={`btn ${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
