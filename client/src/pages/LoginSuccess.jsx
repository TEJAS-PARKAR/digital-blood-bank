import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const setSession = async () => {
      try {
        const meRes = await API.get("/auth/me");

        if (meRes.data.success && meRes.data.user) {
          localStorage.setItem("token", "cookie-session");
          localStorage.setItem("user", JSON.stringify(meRes.data.user));

          if (meRes.data.user.applicationStatus === "pending") {
            window.location.href = "/approval-pending";
            return;
          }

          if (meRes.data.user.role === "admin") {
            window.location.href = "/admin";
            return;
          }

          window.location.href = "/";
          return;
        }

        navigate("/login");
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    setSession();
  }, [navigate, searchParams]);

  return (
    <div className="status-shell">
      <div className="status-card">
        <span className="status-icon">✅</span>
        <h2>Login Successful</h2>
        <p>You're signed in. Redirecting you to the right place…</p>
        <div className="loading-state" style={{ padding: "16px 0 0" }}>
          <div className="spinner" />
        </div>
      </div>
    </div>
  );
}

export default LoginSuccess;
