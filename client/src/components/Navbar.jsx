import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token") || localStorage.getItem("user"))
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token") || localStorage.getItem("user")));
    };
    window.addEventListener("auth-updated", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("auth-updated", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-updated"));
      navigate("/");
      window.location.reload();
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <h2 className="logo">
        <span className="logo-icon">🩸</span>
        RaktRakshak
      </h2>

      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className={`links${menuOpen ? " open" : ""}`}>
        {isAuthenticated ? (
          <>
            <NavLink to="/" className="nav-link" onClick={closeMenu}>Home</NavLink>

            {user?.applicationStatus !== "pending" && (
              <NavLink to="/find-donor" className="nav-link" onClick={closeMenu}>Find Donor</NavLink>
            )}

            {user?.role === "donor" && user?.applicationStatus !== "pending" && (
              <NavLink to="/active-requests" className="nav-link" onClick={closeMenu}>Active Requests</NavLink>
            )}

            {user?.role === "recipient" && user?.applicationStatus !== "pending" && (
              <>
                <NavLink to="/record-donation" className="nav-link" onClick={closeMenu}>Record Donation</NavLink>
                <NavLink to="/request-blood" className="nav-link" onClick={closeMenu}>Request Blood</NavLink>
              </>
            )}

            {user?.role === "admin" && (
              <NavLink to="/admin" className="nav-link" onClick={closeMenu}>Admin</NavLink>
            )}

            <button onClick={handleLogout} className="logout-btn">
              ↩ Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link" onClick={closeMenu}>Login</NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
