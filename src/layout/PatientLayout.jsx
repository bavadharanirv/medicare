import { NavLink, Outlet } from "react-router-dom";

function PatientLayout() {
  return (
    <section className="patient-profile">
      <h2>Patient Dashboard</h2>

      <nav>
        <NavLink to="/patient/profile">Profile</NavLink>{" "}
        <NavLink to="/patient/appointments">Appointments</NavLink>{" "}
        <NavLink to="/patient/upcoming">Upcoming</NavLink>{" "}
        <NavLink to="/patient/history">History</NavLink>
      </nav>

      <hr />
      <Outlet />
    </section>
  );
}

export default PatientLayout;