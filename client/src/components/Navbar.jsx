import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // to update state
  };

  return (
    <nav className="navbar">
      <h2 className="logo">RaktRakshak</h2>

      <div className="links">
        {token ? (
          <>
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/find-donor" className="nav-link">Find Donor</NavLink>
            <NavLink to="/request-blood" className="nav-link">Request</NavLink>
            {user?.role === "admin" && (
              <NavLink to="/admin" className="nav-link">Admin</NavLink>
            )}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link">Login</NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;