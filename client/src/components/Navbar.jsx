import { NavLink, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAuthenticated = Boolean(token || user);
  const navigate = useNavigate();
  const location = useLocation();

  if (["/login", "/register", "/login-success"].includes(location.pathname)) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
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
        {isAuthenticated ? (
          <>
            <NavLink to="/" className="nav-link">Home</NavLink>
            {user?.applicationStatus !== "pending" && (
              <NavLink to="/find-donor" className="nav-link">Find Donor</NavLink>
            )}
            {user?.role === "recipient" && user?.applicationStatus !== "pending" && (
              <NavLink to="/request-blood" className="nav-link">Recipient</NavLink>
            )}
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
