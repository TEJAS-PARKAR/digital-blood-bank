import { useEffect, useState } from "react";
import API from "../services/api";

function ActiveRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/requests");
        const allRequests = res.data.requests || [];
        const pending = allRequests.filter((r) => r.status === "pending").reverse();
        setRequests(pending);
      } catch (error) {
        console.error(error);
        alert("Error fetching active requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="container">
      {/* Page hero */}
      <div className="page-hero">
        <p className="eyebrow">Donor View</p>
        <h2>Active Blood Requests</h2>
        <p>Current patient needs from hospitals and blood banks. Contact them directly if you can donate.</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading active requests…</p>
        </div>
      ) : requests.length > 0 ? (
        <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {requests.map((req) => (
            <div className="request-card" key={req._id}>
              <div className="request-card-header">
                <h3>🩸 {req.bloodGroup} Needed</h3>
                <span className="stat-badge">{req.unitsRequired} Units</span>
              </div>

              <p>👤 <strong>Patient:</strong> {req.patientName}</p>
              <p>🏥 <strong>Hospital:</strong> {req.hospital}, {req.city}</p>

              <hr />

              <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text-muted)", fontWeight: 600, margin: "0 0 6px" }}>
                Contact
              </p>
              <p className="contact-highlight">📞 {req.contact}</p>

              {req.recipient && (
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" }}>
                  Requested by: <strong>{req.recipient.institutionName || req.recipient.name}</strong>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: "48px" }}>
          <div className="empty-state-icon">🎉</div>
          <h3>No Active Requests</h3>
          <p>There are no pending blood requests right now. Thank you for your commitment to saving lives!</p>
        </div>
      )}
    </div>
  );
}

export default ActiveRequests;
