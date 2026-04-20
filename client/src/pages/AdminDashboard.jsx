import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const usersRes = await API.get("/users/pending");
      setPendingUsers(usersRes.data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    try {
      setApprovingId(id);
      await API.put(`/users/${id}/approve`);
      alert("User approved successfully");
      fetchDashboard();
    } catch (error) {
      console.log(error);
      alert("Error approving user");
    } finally {
      setApprovingId(null);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  return (
    <div className="container">
      {/* Page hero */}
      <div className="page-hero">
        <p className="eyebrow">Administration</p>
        <h2>Admin Dashboard</h2>
        <p>Review and approve pending user registrations before they can access the platform.</p>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0 }}>⏳ Pending Registrations</h3>
          {!loading && (
            <span className="badge badge--warning">{pendingUsers.length} pending</span>
          )}
        </div>

        {loading ? (
          <div className="loading-state" style={{ padding: "32px 0" }}>
            <div className="spinner" />
            <p>Loading registrations…</p>
          </div>
        ) : pendingUsers.length ? (
          <div>
            {pendingUsers.map((user) => (
              <div className="admin-list-row" key={user._id}>
                <div className="admin-list-info">
                  <strong>{user.institutionName || user.name}</strong>
                  <p style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <span>
                      {user.role === "donor" ? "🩸 Donor" : "🏥 Recipient"}
                    </span>
                    <span>📧 {user.email}</span>
                    <span>📍 {user.city}</span>
                    {user.bloodGroup && <span>🩸 {user.bloodGroup}</span>}
                  </p>
                </div>
                <button
                  onClick={() => approveUser(user._id)}
                  disabled={approvingId === user._id}
                  className="btn-sm"
                  style={{ flexShrink: 0 }}
                >
                  {approvingId === user._id ? "Approving…" : "✅ Approve"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: "40px 0" }}>
            <div className="empty-state-icon">🎉</div>
            <h3>All Caught Up!</h3>
            <p>No pending registrations at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
