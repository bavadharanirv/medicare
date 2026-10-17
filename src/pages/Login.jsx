
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import { loginWithAPI } from "../services/authApi";

export default function Login({ compact = false }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    const email = identifier.trim().toLowerCase();

    if (isRegister && !name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!email) {
      nextErrors.identifier = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.identifier = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must contain at least 8 characters.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setErrors({});

    try {
      if (isRegister) {
        // Keep the existing registration flow.
        const result = await register(name.trim(), email, password);

        if (!result?.success) {
          setErrors({
            form: result?.message || "Registration failed.",
          });
          return;
        }

        await loginWithAPI(email, password);
      } else {
        await loginWithAPI(email, password);
      }

      if (!isRegister) {
        const result = await login(email, password);

        if (result && result.success === false) {
          setErrors({ form: result.message });
          return;
        }
      }

      navigate("/home", { replace: true });
    } catch (error) {
      setErrors({
        form: error.message || "Unable to sign in. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsRegister((current) => !current);
    setName("");
    setIdentifier("");
    setPassword("");
    setErrors({});
  }

  return (
    <section className={compact ? "login-panel" : "auth-page"}>
      <div className={compact ? "login-panel-card" : "auth-card"}>
        <div className="auth-icon">✚</div>
        <span className="eyebrow">WELCOME TO MEDICARE</span>

        <h2>{isRegister ? "Create Patient Account" : "Patient Login"}</h2>

        <p>
          {isRegister
            ? "Register to book and manage your appointments."
            : "Sign in to access your patient dashboard."}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <Input
              id="patient-name"
              label="Full Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
              error={errors.name}
              required
            />
          )}

          <Input
            id={compact ? "home-patient-email" : "patient-email"}
            label="Email Address"
            type="email"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Enter your email address"
            autoComplete="email"
            error={errors.identifier}
            required
          />

          <Input
            id={compact ? "home-password" : "patient-password"}
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            error={errors.password}
            required
          />

          {errors.form && (
            <p className="field-error" role="alert">
              {errors.form}
            </p>
          )}

          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account →"
                : "Log in →"}
          </button>
        </form>

        <p className="auth-footnote">
          {isRegister
            ? "Create an account to get started."
            : "Use your registered email and password."}
        </p>

        <p className="register-switch">
          {isRegister ? "Already have an account? " : "New patient? "}
          <button
            type="button"
            onClick={switchMode}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "#245ce8",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "inherit",
            }}
          >
            {isRegister ? "Log in here" : "Create Account"}
          </button>
        </p>

        {!compact && (
          <Link to="/doctors" className="text-link">
            Browse doctors →
          </Link>
        )}
      </div>
    </section>
  );
}
