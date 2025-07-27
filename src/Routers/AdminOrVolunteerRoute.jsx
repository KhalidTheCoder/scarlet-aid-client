import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../providers/AuthContext";
import useUserRole from "../hooks/useUserRole";
import Loading from "../pages/Loading";

const AdminOrVolunteerRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <Loading />;
  }

  const allowedRoles = ["admin", "volunteer"];

  if (!user || !allowedRoles.includes(role)) {
    return (
      <Navigate to="/forbidden" state={{ from: location.pathname }} replace />
    );
  }

  return children;
};

export default AdminOrVolunteerRoute;
