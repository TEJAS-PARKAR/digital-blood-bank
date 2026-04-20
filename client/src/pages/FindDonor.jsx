import { useState } from "react";
import API from "../services/api";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function FindDonor() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [donors, setDonors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!bloodGroup) {
      alert("Please select a blood group first.");
      return;
    }
    try {
      setLoading(true);
      const res = await API.get(`/users/blood/${encodeURIComponent(bloodGroup)}`);
      setDonors(res.data.donors);
      setHasSearched(true);
    } catch (error) {
      console.log(error);
      alert("Error fetching donors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Page header */}
      <div className="page-hero">
        <p className="eyebrow">Donor Search</p>
        <h2>Find a Blood Donor</h2>
        <p>Search verified, approved donors by blood group and contact them directly.</p>
      </div>

      {/* Search bar */}
      <div className="card" style={{ marginBottom: "28px" }}>
        <div className="search-bar-wrap">
          <select
            className="blood-group-select"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          >
            <option value="">Select Blood Group</option>
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <button onClick={handleSearch} disabled={loading} style={{ minWidth: "120px" }}>
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>Searching donors…</p>
        </div>
      )}

      {/* No results */}
      {!loading && hasSearched && donors.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">😔</div>
          <h3>No Donors Found</h3>
          <p>There are no registered donors for <strong>{bloodGroup}</strong> in the system right now.</p>
        </div>
      )}

      {/* Donor cards */}
      {!loading && donors.length > 0 && (
        <>
          <p style={{ marginBottom: "16px", color: "var(--text-muted)", fontSize: "14px" }}>
            {donors.length} donor{donors.length !== 1 ? "s" : ""} found for <strong>{bloodGroup}</strong>
          </p>
          <div className="donor-grid">
            {donors.map((d) => (
              <div className="donor-card" key={d._id}>
                <div className="donor-card-header">
                  <h3>{d.name}</h3>
                  <span className="stat-badge">{d.bloodGroup}</span>
                </div>
                <p>📍 {d.city}{d.state ? `, ${d.state}` : ""}</p>
                <p>📞 {d.phone}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FindDonor;