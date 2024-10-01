import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/Home/HomePage";
import ParentSignin from "./Pages/Parent/Signin/ParentSignin";
import DoctorSignin from "./Pages/Doctor/Signin/DoctorSignin";
import ParentSignup from "./Pages/Parent/Signup/ParentSignup";
import ParentOtp from "./Pages/Parent/Signup/ParentOtp";
import DoctorSignup from "./Pages/Doctor/Signup/DoctorSignup";
import DoctorOtp from "./Pages/Doctor/Signup/DoctorOtp";
import ForgotPassword from "./Pages/Parent/Signin/Forgotpassword/ForgotPassword";
import PasswordReset from "./Pages/Parent/Signin/Forgotpassword/PasswordReset";
import DForgotPassword from "./Pages/Doctor/Forgotpassword/DForgotPassword";
import AdminSignin from "./Pages/Admin/Signin/AdminSignin";
import Dashboard from "./Pages/Admin/Pages/Dashboard";
import Profile from "./Pages/Parent/Profile/Profile";
import ParentManagement from "./Pages/Admin/Pages/ParentManagement";
import DoctorManagement from "./Pages/Admin/Pages/DoctorManagement";
import P from "./Pages/Parent/Profile/P";
import About from "./Pages/About/About";
import DoctorProfile from "./Pages/Doctor/Profile/DoctorProfile";
import DoctorChangePassword from "./Pages/Doctor/ChnangePassword/ChangePassword";
import Test from "./Pages/Parent/Profile/Test";
import DoctorLists from "./Pages/Parent/FindDoctors/DoctorLists";
import DoctorDetails from "./Pages/Parent/DoctorProfile/DoctorDetails";
import ProtectedRoute from "./Components/Protected/ProtectedRoute";
import RedirectIfLoggedIn from "./Components/Protected/RedirecrIfLoggedIn";
import Verification from "./Pages/Doctor/Signup/Verification";
import Notify from "./Pages/Parent/Signin/Forgotpassword/Notify";
import PlanningSlots from "./Pages/Doctor/Planner/PlanningSlots";
import Planner from "./Pages/Doctor/Planner/Planner";
import TimeSlotForm from "./Components/TimeSlots/TimeSlotsForm";
import ConfirmAppointment from "./Pages/Parent/AppointmentDetails/ConfirmAppointment";
import PaymentSuccess from "./Pages/Parent/AppointmentDetails/PaymentSuccess";
import PaymentFailure from "./Pages/Parent/AppointmentDetails/PaymentFailure";
import ShowAppointments from "./Pages/Parent/AppointmentDetails/ShowAppointments";
import Consultation from "./Pages/Doctor/Consultation/Consultation";

function App() {
  return (
    <Routes>
      {/*public routes*/}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />

      <Route
        path="/notify"
        element={
          <RedirectIfLoggedIn>
            <Notify />
          </RedirectIfLoggedIn>
        }
      />
      
      <Route
        path="/parent-login"
        element={
          <RedirectIfLoggedIn>
            <ParentSignin />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/parent-signup"
        element={
          <RedirectIfLoggedIn>
            <ParentSignup />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/otp"
        element={
          <RedirectIfLoggedIn>
            <ParentOtp />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <RedirectIfLoggedIn>
            <ForgotPassword />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/password-reset"
        element={
          <RedirectIfLoggedIn>
            <PasswordReset />
          </RedirectIfLoggedIn>
        }
      />

      {/*protected routes */}
      <Route
        path="/myprofile"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/find-doctor" element={<DoctorLists />} />

      <Route
        path="/doctor-details/:doctorId"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <DoctorDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/confirm-appointment"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <ConfirmAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor-details/:doctorId"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <DoctorDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paymentsuccess"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paymentfailure"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <PaymentFailure />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <ShowAppointments />
          </ProtectedRoute>
        }
      />
    


      <Route
        path="/doctor-login"
        element={
          <RedirectIfLoggedIn>
            <DoctorSignin />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/doctor-forgotpassword"
        element={
          <RedirectIfLoggedIn>
            <DForgotPassword />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/doctor-signup"
        element={
          <RedirectIfLoggedIn>
            <DoctorSignup />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/d-otp"
        element={
          <RedirectIfLoggedIn>
            <DoctorOtp />
          </RedirectIfLoggedIn>
        }
      />

      <Route
        path="/verification"
        element={
          <RedirectIfLoggedIn>
            <Verification />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/doctor-profile"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor-change-password"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorChangePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/planner"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Planner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timeslotform"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <TimeSlotForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultation"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Consultation />
          </ProtectedRoute>
        }
      />

      <Route path="/admin" element={<AdminSignin />} />
      <Route
        path="/admin"
        element={
          <RedirectIfLoggedIn>
            <AdminSignin />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/parents"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ParentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DoctorManagement />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
