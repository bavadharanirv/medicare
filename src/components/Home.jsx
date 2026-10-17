
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="hero">
        <div>
          <h1>
            Find the Right Doctor
            for Your Health
          </h1>

          <p>
            Book appointments with experienced doctors quickly and easily.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/doctors")}
          >
            Find a Doctor
          </button>
        </div>

        <div className="hero-icon">
          🏥
        </div>
      </div>

      <div className="features">
        <div>
          <span>👨‍⚕️</span>
          <h3>Expert Doctors</h3>
          <p>Experienced healthcare professionals.</p>
        </div>

        <div>
          <span>📅</span>
          <h3>Easy Booking</h3>
          <p>Book appointments in seconds.</p>
        </div>

        <div>
          <span>🔒</span>
          <h3>Secure</h3>
          <p>Your appointment information is protected.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
