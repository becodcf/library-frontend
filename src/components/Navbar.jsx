import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <NavLink className="navbar-brand" to="/">
        <i className="bi bi-book-half me-2"></i>
        Biblioteca
      </NavLink>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/books">
              Livros
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/readers">
              Leitores
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/loans">
              Empréstimos
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="d-flex align-items-center">
        <span className="text-light me-3">Olá, {user?.name}</span>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
