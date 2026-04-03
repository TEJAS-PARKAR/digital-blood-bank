import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { State, City } from "country-state-city";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    phone: "",
    state: "",
    city: "",
    institutionName: "",
    role: ""
  });
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  const navigate = useNavigate();

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const states = State.getStatesOfCountry("IN");
  const cities = selectedStateCode ? City.getCitiesOfState("IN", selectedStateCode) : [];

  useEffect(() => {
    // For Google-authored users, /api/auth/me returns profile data for completion
    const fetchAuthUser = async () => {
      try {
        const res = await API.get("/auth/me");
        if (res.data.success && res.data.profile && !res.data.profile.isProfileComplete) {
          const profile = res.data.profile;
          setFormData({
            name: profile.name || "",
            email: profile.email || "",
            bloodGroup: "",
            phone: "",
            state: "",
            city: "",
            institutionName: "",
            role: ""
          });
          setIsCompletingProfile(true);
        }
      } catch (error) {
        // No authenticated user; keep registration form mode
        console.log("Not logged in (or profile already complete):", error?.response?.data?.message || error.message);
      }
    };

    fetchAuthUser();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      const selected = states.find((item) => item.name === value);
      setFormData({
        ...formData,
        state: value,
        city: ""
      });
      setSelectedStateCode(selected?.isoCode || "");
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (isCompletingProfile) {
        res = await API.put("/users/update", formData);
        alert("Profile completed successfully");
        navigate("/");
      } else {
        res = await API.post("/users/register", formData);
        alert("Registration successful");
        navigate("/login");
      }

      console.log(res.data);

    } catch (error) {
      const message = error?.response?.data?.message || error?.response?.data?.error || error.message;
      alert(`Error ${isCompletingProfile ? "updating profile" : "registering user"}: ${message}`);
      console.error("Registration error details:", error);
    }
  };

  return (
    <div className="container">
      <h2>{isCompletingProfile ? "Complete Your Profile" : "Register"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              name="role"
              value="donor"
              checked={formData.role === "donor"}
              onChange={handleChange}
              required
            />
            Donor
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="recipient"
              checked={formData.role === "recipient"}
              onChange={handleChange}
              required
            />
            Recipient
          </label>
        </div>

        {formData.role !== "recipient" && (
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            disabled={isCompletingProfile}
            required
          />
        )}
        {formData.role === "recipient" && (
          <input
            name="institutionName"
            placeholder="Institution Name"
            value={formData.institutionName}
            onChange={handleChange}
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled
          required
        />
        {formData.role === "donor" && (
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        )}
        <input
          name="phone"
          placeholder="Phone (10 digits)"
          value={formData.phone}
          onChange={handleChange}
          pattern="[0-9]{10}"
          maxLength="10"
          required
        />
        <select
          name="state"
          value={formData.state}
          onChange={handleLocationChange}
          required
        >
          <option value="">Select State</option>
          {states.map((item) => (
            <option key={item.isoCode} value={item.name}>{item.name}</option>
          ))}
        </select>
        <select
          name="city"
          value={formData.city}
          onChange={handleLocationChange}
          required
          disabled={!selectedStateCode}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>{city.name}</option>
          ))}
        </select>

        <button type="submit">{isCompletingProfile ? "Complete Profile" : "Register"}</button>
      </form>
    </div>
  );
}

export default Register;