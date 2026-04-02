import { useState } from "react";
import API from "../services/api";

function FindDonor() {

  const [bloodGroup, setBloodGroup] = useState("");
  const [donors, setDonors] = useState([]);

  const handleSearch = async () => {
    try {

      const res = await API.get(`/users/blood/${bloodGroup}`);

      setDonors(res.data.donors); 

    } catch (error) {
      console.log(error);
      alert("Error fetching donors");
    }
  };

  return (
    <div className="container">

        <h2>Find Donor</h2>

        <input
            placeholder="Enter Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>

        {donors.map((d) => (
            <div className="card" key={d._id}>
            <h3>{d.name}</h3>
            <p>Blood Group: {d.bloodGroup}</p>
            <p>City: {d.city}</p>
            <p>Phone: {d.phone}</p>
            </div>
        ))}

        </div>
  );
}

export default FindDonor;