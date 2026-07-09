import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  function handleLogout() {
    signOut();
    navigate("/login");
  }

  function handleNavClick() {
    setExpanded(false);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="d-flex justify-content-between align-items-center w-100">
        <NavLink className="navbar-brand" to="/">
          <i className="bi bi-book-half me-2"></i>
          Biblioteca
        </NavLink>

        <button
          className="btn btn-outline-light btn-sm d-lg-none"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <i className="bi bi-list"></i>
        </button>
      </div>

      <div className={`w-100 ${expanded ? "d-block" : "d-none"} d-lg-flex`}>
        <ul className="navbar-nav me-auto mt-2 mt-lg-0">
          <li className="nav-item">
            <NavLink className="nav-link" to="/books" onClick={handleNavClick}>
              Livros
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/readers" onClick={handleNavClick}>
              Leitores
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/loans" onClick={handleNavClick}>
              Empréstimos
            </NavLink>
          </li>
        </ul>

        <div className="d-flex align-items-center mt-2 mt-lg-0">
          <span className="text-light me-3">Olá, {user?.name}</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
