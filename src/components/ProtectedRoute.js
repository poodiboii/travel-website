import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { loading, isAuthed, isAdmin } = useAuth();

  if (loading) return null;

  if (!isAuthed) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
