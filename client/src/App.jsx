import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import FindDonor from "./pages/FindDonor";
import RequestBlood from "./pages/RequestBlood";
import AdminDashboard from "./pages/AdminDashboard";
import ApprovalPending from "./pages/ApprovalPending";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import API from "./services/api";

function App() {
  useEffect(() => {
    const syncSession = async () => {
      try {
        const res = await API.get("/api/auth/me");

        if (res.data.success && res.data.user) {
          localStorage.setItem("token", "cookie-session");
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (error) {
        const currentPath = window.location.pathname;
        const keepPendingFlow = currentPath === "/register" || currentPath === "/login";

        if (!keepPendingFlow) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };

    syncSession();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/approval-pending" element={<ApprovalPending />} />
        <Route path="/register" element={<Register />} />
        <Route path="/find-donor" element={<FindDonor />} />
        <Route
          path="/request-blood"
          element={
            <PrivateRoute role="recipient">
              <RequestBlood />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
