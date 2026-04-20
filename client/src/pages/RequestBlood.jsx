import { useEffect, useState } from "react";
import API from "../services/api";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialRequestForm = {
  patientName: "",
  bloodGroup: "",
  hospital: "",
  city: "",
  contact: "",
  unitsRequired: 1
};

function statusBadge(status) {
  if (status === "pending") return <span className="badge badge--warning">Pending</span>;
  if (status === "fulfilled") return <span className="badge badge--success">Fulfilled</span>;
  if (status === "cancelled") return <span className="badge badge--neutral">Cancelled</span>;
  return <span className="badge badge--neutral">{status}</span>;
}

function RequestBlood() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [requestForm, setRequestForm] = useState(initialRequestForm);
  const [availability, setAvailability] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [inventoryRes, requestsRes] = await Promise.all([
        API.get("/inventory/my"),
        API.get("/requests/my")
      ]);
      setAvailability(inventoryRes.data.availability || []);
      setRequests(requestsRes.data.requests || []);
    } catch (error) {
      console.log(error);
      alert("Error loading recipient dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestForm((cur) => ({ ...cur, [name]: value }));
  };

  const submitBloodRequest = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.post("/requests", {
        ...requestForm,
        unitsRequired: Number(requestForm.unitsRequired)
      });
      alert("Blood request created successfully");
      setRequestForm(initialRequestForm);
      loadDashboard();
    } catch (error) {
      console.log(error);
      alert("Error creating request");
    } finally {
      setSubmitting(false);
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await API.put(`/requests/my/${id}`, { status });
      loadDashboard();
    } catch (error) {
      console.log(error);
      alert("Error updating request status");
    }
  };

  if (user?.role !== "recipient") {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: "48px" }}>
          <span style={{ fontSize: "2.5rem" }}>🔒</span>
          <h2 style={{ marginTop: "12px" }}>Access Restricted</h2>
          <p>This section is only available for recipient accounts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Hero */}
      <div className="page-hero">
        <p className="eyebrow">Recipient Workspace</p>
        <h2>Request Blood</h2>
        <p>
          {user?.institutionName || user?.name} — raise urgent blood requests and monitor your blood availability below.
        </p>
      </div>

      {/* Create request + availability side by side */}
      <div className="dashboard-grid">
        {/* Create request form */}
        <section className="card">
          <h3 style={{ marginBottom: "18px" }}>🩸 Create Blood Request</h3>
          <form onSubmit={submitBloodRequest}>
            <input
              name="patientName"
              placeholder="Patient Name"
              value={requestForm.patientName}
              onChange={handleRequestChange}
              required
            />
            <select
              name="bloodGroup"
              value={requestForm.bloodGroup}
              onChange={handleRequestChange}
              required
            >
              <option value="">Required Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <input
              name="unitsRequired"
              type="number"
              min="1"
              placeholder="Units Required"
              value={requestForm.unitsRequired}
              onChange={handleRequestChange}
              required
            />
            <input
              name="hospital"
              placeholder="Hospital Name"
              value={requestForm.hospital}
              onChange={handleRequestChange}
              required
            />
            <input
              name="city"
              placeholder="City"
              value={requestForm.city}
              onChange={handleRequestChange}
              required
            />
            <input
              name="contact"
              placeholder="Contact Number"
              value={requestForm.contact}
              onChange={handleRequestChange}
              required
            />
            <button type="submit" disabled={submitting} style={{ width: "100%" }}>
              {submitting ? "Submitting…" : "Submit Request"}
            </button>
          </form>
        </section>

        {/* Blood availability */}
        <section className="card">
          <h3 style={{ marginBottom: "18px" }}>Blood Availability</h3>
          {loading ? (
            <div className="loading-state" style={{ padding: "32px 0" }}>
              <div className="spinner" />
              <p>Loading…</p>
            </div>
          ) : availability.length ? (
            <div className="stat-list">
              {availability.map((item) => (
                <div className="stat-item" key={item.bloodGroup}>
                  <div>
                    <strong>{item.bloodGroup}</strong>
                    <p>{item.donorMatches} matching donor{item.donorMatches !== 1 ? "s" : ""} registered</p>
                  </div>
                  <span className="stat-badge">{item.totalUnits} units</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: "32px 0" }}>
              <div className="empty-state-icon">📭</div>
              <p>No inventory recorded yet.</p>
            </div>
          )}
        </section>
      </div>

      {/* My requests */}
      <section className="card">
        <h3 style={{ marginBottom: "18px" }}>Your Blood Requests</h3>
        {loading ? (
          <div className="loading-state" style={{ padding: "24px 0" }}>
            <div className="spinner" />
          </div>
        ) : requests.length ? (
          <div>
            {requests.map((request) => (
              <div className="list-row" key={request._id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <strong>{request.patientName}</strong>
                    <p>{request.bloodGroup} · {request.unitsRequired} units</p>
                    <p>🏥 {request.hospital}, {request.city}</p>
                    <p>📞 {request.contact}</p>
                  </div>
                  {statusBadge(request.status)}
                </div>
                {request.status === "pending" && (
                  <div className="action-row">
                    <button
                      type="button"
                      className="btn-sm"
                      onClick={() => updateRequestStatus(request._id, "fulfilled")}
                    >
                      Mark Fulfilled
                    </button>
                    <button
                      type="button"
                      className="btn-sm secondary-btn"
                      onClick={() => updateRequestStatus(request._id, "cancelled")}
                    >
                      Cancel Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: "32px 0" }}>
            <div className="empty-state-icon">📭</div>
            <h3>No Requests Yet</h3>
            <p>Submit your first blood request using the form above.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default RequestBlood;
