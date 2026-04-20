import { useEffect, useState, useMemo } from "react";
import API from "../services/api";

function RecordDonation() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [inventoryForm, setInventoryForm] = useState({ units: "", donationDate: "", notes: "" });
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setRecordsLoading(true);
      const [donorsRes, inventoryRes] = await Promise.all([
        API.get("/users/donors"),
        API.get("/inventory/my")
      ]);
      setDonors(donorsRes.data.donors || []);
      setRecords(inventoryRes.data.records || []);
    } catch (error) {
      console.error(error);
      alert("Error loading record dashboard");
    } finally {
      setLoading(false);
      setRecordsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleInventoryChange = (e) => {
    const { name, value } = e.target;
    setInventoryForm((cur) => ({ ...cur, [name]: value }));
  };

  const filteredDonors = useMemo(() => {
    if (!searchTerm) return [];
    return donors.filter((d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, donors]);

  const handleSelectDonor = (donor) => {
    setSelectedDonor(donor);
    setSearchTerm(donor.name);
  };

  const submitInventoryRecord = async (e) => {
    e.preventDefault();
    if (!selectedDonor) {
      alert("Please select a registered donor first.");
      return;
    }
    try {
      setSubmitting(true);
      await API.post("/inventory", {
        donorName: selectedDonor.name,
        bloodGroup: selectedDonor.bloodGroup,
        units: Number(inventoryForm.units),
        donationDate: inventoryForm.donationDate,
        notes: inventoryForm.notes
      });
      alert("Donation record added");
      setInventoryForm({ units: "", donationDate: "", notes: "" });
      setSearchTerm("");
      setSelectedDonor(null);
      const inventoryRes = await API.get("/inventory/my");
      setRecords(inventoryRes.data.records || []);
    } catch (error) {
      console.log(error);
      alert("Error saving donation record");
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== "recipient") {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: "48px" }}>
          <span style={{ fontSize: "2.5rem" }}>🔒</span>
          <h2 style={{ marginTop: "12px" }}>Access Denied</h2>
          <p>This section is available only for recipient accounts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Page hero */}
      <div className="page-hero">
        <p className="eyebrow">Recipient Workspace</p>
        <h2>Record Blood Donations</h2>
        <p>Log incoming blood units from registered donors and maintain your donation history.</p>
      </div>

      <div className="dashboard-grid">
        {/* New donation form */}
        <section className="card">
          <h3 style={{ marginBottom: "18px" }}>➕ Register New Donation</h3>
          <form onSubmit={submitInventoryRecord}>
            {/* Donor search */}
            <div className="search-box" style={{ marginBottom: "14px" }}>
              <input
                type="text"
                placeholder="Search donor by name…"
                value={searchTerm}
                style={{ margin: 0 }}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (selectedDonor && e.target.value !== selectedDonor.name) {
                    setSelectedDonor(null);
                  }
                }}
                required
              />
              {searchTerm && !selectedDonor && (
                <div className="dropdown-results">
                  {filteredDonors.length > 0 ? (
                    filteredDonors.map((d) => (
                      <div
                        key={d._id}
                        className="dropdown-row"
                        onClick={() => handleSelectDonor(d)}
                      >
                        <span><strong>{d.name}</strong></span>
                        <span className="badge badge--danger">{d.bloodGroup}</span>
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-empty">No donor found</div>
                  )}
                </div>
              )}
            </div>

            {/* Selected donor chip */}
            {selectedDonor && (
              <div className="selected-donor-chip">
                <span style={{ fontSize: "1.3rem" }}>✅</span>
                <div>
                  <strong>Selected Donor</strong>
                  {selectedDonor.name} &nbsp;·&nbsp; {selectedDonor.bloodGroup}
                </div>
              </div>
            )}

            <input
              name="units"
              type="number"
              min="1"
              placeholder="Units donated"
              value={inventoryForm.units}
              onChange={handleInventoryChange}
              required
            />
            <input
              name="donationDate"
              type="date"
              value={inventoryForm.donationDate}
              onChange={handleInventoryChange}
            />
            <input
              name="notes"
              placeholder="Notes (optional)"
              value={inventoryForm.notes}
              onChange={handleInventoryChange}
            />
            <button
              type="submit"
              disabled={!selectedDonor || submitting}
              style={{ width: "100%" }}
            >
              {submitting ? "Saving…" : "💾 Save Donation Record"}
            </button>
          </form>
        </section>

        {/* Recent records */}
        <section className="card">
          <h3 style={{ marginBottom: "18px" }}>📋 Recent Donation Records</h3>
          {recordsLoading ? (
            <div className="loading-state" style={{ padding: "32px 0" }}>
              <div className="spinner" />
              <p>Loading records…</p>
            </div>
          ) : records.length ? (
            <div style={{ maxHeight: "520px", overflowY: "auto", display: "grid", gap: "10px" }}>
              {records.map((record) => (
                <div className="list-row" key={record._id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <div>
                      <strong>{record.donorName}</strong>
                      <p>{record.bloodGroup} · {record.units} units</p>
                      <p>📅 {new Date(record.donationDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      {record.notes && <p>📝 {record.notes}</p>}
                    </div>
                    <span className="stat-badge">{record.units}u</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: "32px 0" }}>
              <div className="empty-state-icon">📭</div>
              <h3>No Records Yet</h3>
              <p>Use the form to log your first donation.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default RecordDonation;
