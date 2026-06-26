import { Navigate } from "react-router-dom";
import { getCurrentSession, getHomeRoute } from "../../lib/authService";

export default function ProtectedRoute({ allowedProfiles, children }) {
  const session = getCurrentSession();

  // Não está autenticado ou o token expirou.
  if (!session) {
    return <Navigate to="/" replace />;
  }

  // Está autenticado, mas pertence a outro perfil.
  if (!allowedProfiles.includes(session.perfil)) {
    return <Navigate to={getHomeRoute(session.perfil)} replace />;
  }

  return children;
}
