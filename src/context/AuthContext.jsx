
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  loginWithAPI,
  registerWithAPI,
  logoutFromAPI,
} from "../services/authApi";

import {
  getToken,
} from "../services/authToken";

const AuthContext = createContext(null);
const AUTH_KEY = "carepoint-auth";

function readPatient() {
  try {
    if (!getToken()) return null;

    return JSON.parse(
      sessionStorage.getItem(AUTH_KEY) || "null"
    );
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [patient, setPatient] = useState(readPatient);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleAuthChanged() {
      if (!getToken()) {
        sessionStorage.removeItem(AUTH_KEY);
        setPatient(null);
      }
    }

    window.addEventListener("auth:changed", handleAuthChanged);

    return () => {
      window.removeEventListener(
        "auth:changed",
        handleAuthChanged
      );
    };
  }, []);

  function savePatient(apiPatient) {
    const loggedInPatient = {
      id: apiPatient.patientId,
      name: apiPatient.name || "MediCare Patient",
      email: apiPatient.email,
    };

    sessionStorage.setItem(
      AUTH_KEY,
      JSON.stringify(loggedInPatient)
    );

    setPatient(loggedInPatient);

    return loggedInPatient;
  }

  async function login(email, password) {
    if (!email?.trim() || !password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    setLoading(true);

    try {
      const apiPatient = await loginWithAPI(
        email.trim().toLowerCase(),
        password
      );

      const loggedInPatient = savePatient(apiPatient);

      return {
        success: true,
        patient: loggedInPatient,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Login failed.",
      };
    } finally {
      setLoading(false);
    }
  }

  async function register(name, email, password) {
    if (!name?.trim() || !email?.trim() || !password) {
      return {
        success: false,
        message: "Please fill in all fields.",
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return {
        success: false,
        message: "Enter a valid email address.",
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        message: "Password must contain at least 8 characters.",
      };
    }

    setLoading(true);

    try {
      const apiPatient = await registerWithAPI(
        name.trim(),
        email.trim().toLowerCase(),
        password
      );

      const loggedInPatient = savePatient(apiPatient);

      return {
        success: true,
        patient: loggedInPatient,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed.",
      };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    logoutFromAPI();
    sessionStorage.removeItem(AUTH_KEY);
    setPatient(null);
  }

  const isAuthenticated = Boolean(patient && getToken());

  return (
    <AuthContext.Provider
      value={{
        patient,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
