
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppointmentProvider } from "./context/AppointmentContext";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Loading from "./components/Loading";

// Route-level lazy imports keep each page in a separate bundle.
const Home = lazy(() => import("./components/Home.jsx"));
const Doctors = lazy(() => import("./components/DoctorList.jsx"));
const DoctorProfile = lazy(() => import("./components/DoctorProfile.jsx"));
const Booking = lazy(() => import("./components/AppointmentBooking.jsx"));
const Appointments = lazy(() => import("./components/AppointmentHistory.jsx"));
const AppointmentDetails = lazy(() => import("./pages/AppointmentDetails.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const PatientLayout = lazy(() => import("./layout/PatientLayout.jsx"));
const PatientAppointments = lazy(() => import("./pages/PatientPages.jsx").then((module) => ({ default: module.PatientAppointments })));
const UpcomingAppointments = lazy(() => import("./pages/PatientPages.jsx").then((module) => ({ default: module.UpcomingAppointments })));
const PatientHistory = lazy(() => import("./pages/PatientPages.jsx").then((module) => ({ default: module.PatientHistory })));
const PatientProfilePage = lazy(() => import("./pages/PatientPages.jsx").then((module) => ({ default: module.PatientProfilePage })));

function AppRoutes() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header />

      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
        <main id="main-content" tabIndex={-1}>
        <Routes>
          {/* Login page opens first */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Home */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Doctors */}
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <Doctors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/:id"
            element={
              <ProtectedRoute>
                <DoctorProfile />
              </ProtectedRoute>
            }
          />

          {/* Appointment booking and history */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointment/:id"
            element={
              <ProtectedRoute>
                <AppointmentDetails />
              </ProtectedRoute>
            }
          />

          {/* Patient dashboard and subpages */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute>
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PatientProfilePage />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="upcoming" element={<UpcomingAppointments />} />
            <Route path="history" element={<PatientHistory />} />
            <Route path="profile" element={<PatientProfilePage />} />
          </Route>

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </main>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppointmentProvider>
          <AppRoutes />
        </AppointmentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
