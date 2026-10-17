
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="header">
      <h2 className="logo">MediCare</h2>

      <nav>
        {isAuthenticated ? (
          <>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/doctors">Doctors</NavLink>
            <NavLink to="/appointments">Appointments</NavLink>
            <NavLink to="/patient">Patient</NavLink>

            <button
              type="button"
              className="primary-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
    </header>
  );
}

export default Header;
