import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = Boolean(localStorage.getItem("token") || localStorage.getItem("user"));

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="home-hero">
        <span className="home-hero-icon">🩸</span>
        <h1>RaktRakshak</h1>
        <p>Connecting blood donors with lives in need — fast, verified, and trusted.</p>
        <div className="home-hero-actions">
          {!isLoggedIn && (
            <>
              <button onClick={() => navigate("/login")} style={{ minWidth: "140px" }}>
                Get Started
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn-outline"
                style={{ minWidth: "140px" }}
              >
                Register
              </button>
            </>
          )}
          {isLoggedIn && user?.applicationStatus !== "pending" && (
            <button onClick={() => navigate("/find-donor")} style={{ minWidth: "160px" }}>
              🔍 Find a Donor
            </button>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="home-stats">
        <div className="home-stat-card">
          <div className="home-stat-num">8+</div>
          <div className="home-stat-label">Blood Groups Covered</div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-num">24h</div>
          <div className="home-stat-label">Typical Approval Time</div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-num">100%</div>
          <div className="home-stat-label">Verified Donors</div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="home-features">
        <div className="feature-card">
          <span className="feature-icon">🔍</span>
          <h3>Find Donors</h3>
          <p>Search verified donors by blood group and connect with them directly within minutes.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🏥</span>
          <h3>Request Blood</h3>
          <p>Hospitals and recipients can post urgent blood requests visible to matching donors.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📋</span>
          <h3>Track Inventory</h3>
          <p>Record incoming donations and monitor blood availability across blood groups in real time.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">✅</span>
          <h3>Admin Verified</h3>
          <p>Every donor and recipient is manually reviewed and approved before gaining access.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;