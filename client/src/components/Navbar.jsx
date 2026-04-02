import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>

      <h2 style={styles.logo}>RaktRakshak</h2>

      <div style={styles.links}>
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
          Home
        </NavLink>

        <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>
          Register
        </NavLink>

        <NavLink to="/find-donor" className={({ isActive }) => isActive ? "active" : ""}>
          Find Donor
        </NavLink>

        <NavLink to="/request-blood" className={({ isActive }) => isActive ? "active" : ""}>
          Request
        </NavLink>

        <NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>
          Admin
        </NavLink>
      </div>

    </nav>
  );
}
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#e63946",
    padding: "10px 20px",
    color: "white"
  },
  logo: {
    margin: 0
  },
  links: {
    display: "flex",
    gap: "15px"
  }
};

export default Navbar;