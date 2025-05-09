
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-faircut"></div>
    </div>;
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
