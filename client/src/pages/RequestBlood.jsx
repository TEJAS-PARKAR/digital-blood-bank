import { useState } from "react";
import API from "../services/api";

function RequestBlood() {

  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    hospital: "",
    city: "",
    contact: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post("/requests", formData);

      alert("Blood request created successfully");

      console.log(res.data);

    } catch (error) {

      console.log(error);
      alert("Error creating request");

    }
  };

  return (
    <div className="container">
        <h2>Request Blood</h2>

        <form onSubmit={handleSubmit}>
            <input name="patientName" placeholder="Patient Name" onChange={handleChange} />
            <input name="bloodGroup" placeholder="Blood Group" onChange={handleChange} />
            <input name="hospital" placeholder="Hospital" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="contact" placeholder="Contact" onChange={handleChange} />

            <button type="submit">Submit Request</button>
        </form>
    </div>
  );
}

export default RequestBlood;