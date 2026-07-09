import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Bloqueia o acesso às rotas internas quando não há usuário autenticado
function PrivateRoute() {
  const { signed, loading } = useAuth();

  if (loading) {
    return null;
  }

  return signed ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
