import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {

  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests");
      setRequests(res.data.requests);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id) => {
    try {
      await API.put(`/requests/${id}`);
      alert("Status updated");
      fetchRequests(); // refresh
    } catch (error) {
      console.log(error);
      alert("Error updating status");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container">

        <h2>Admin Dashboard</h2>

        {requests.map((r) => (
            <div className="card" key={r._id}>
            <h3>{r.patientName}</h3>
            <p>Blood Group: {r.bloodGroup}</p>
            <p>Hospital: {r.hospital}</p>
            <p>Status: {r.status}</p>

            {r.status === "pending" && (
                <button onClick={() => updateStatus(r._id)}>
                Mark as Fulfilled
                </button>
            )}
            </div>
        ))}

    </div>
  );
}

export default AdminDashboard;