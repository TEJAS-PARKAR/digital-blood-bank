import { useLocation, useNavigate } from "react-router-dom";

function ApprovalPending() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="status-shell">
      <div className="status-card">
        <span className="status-icon">⏳</span>
        <p className="eyebrow" style={{ justifyContent: "center" }}>Registration Received</p>
        <h2>Your application is under review</h2>

        <div className="alert alert--info" style={{ textAlign: "left", marginTop: "20px" }}>
          <span>ℹ️</span>
          <div>
            <strong>
              {user?.institutionName || user?.name || "Your account"} is awaiting admin approval.
            </strong>
            <p>Kindly allow up to 24 hours for verification.</p>
          </div>
        </div>

        <p style={{ fontSize: "14px", marginTop: "8px" }}>
          Once approved, sign in again with the same Google account to access the platform.
        </p>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="btn-outline"
          style={{ marginTop: "24px", width: "100%" }}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

export default ApprovalPending;
