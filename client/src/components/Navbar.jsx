import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
      <Link to="/inventory">Inventory</Link>
      {!isLoggedIn ? (
        <Link to="/login">Login</Link>
      ) : (
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
