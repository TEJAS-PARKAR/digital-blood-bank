import { useState } from "react";
import API from "../services/api";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    phone: "",
    city: "",
    role: "donor"
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

      const res = await API.post("/users/register", formData);

      alert("Registration successful");

      console.log(res.data);

    } catch (error) {

      alert("Error registering user");
      console.log(error);

    }
  };

  return (
    <div className="container">
      <h2>Register as Donor</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="bloodGroup" placeholder="Blood Group" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;