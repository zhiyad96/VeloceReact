import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Authcontext } from "../Context/Authcontext";

/* 🔒 USER PROTECTED ROUTE (only normal users can access user-only pages) */
export const ProtectedRoute = ({ children }) => {
  const { user, admin, loading } = useContext(Authcontext);

  if (loading) return <div>Loading...</div>;

  if (admin) return <Navigate to="/dashboard" replace />; // block admin
  if (!user) return <Navigate to="/login" replace />;     // block guests

  return children; // normal logged-in user
};

/* 🌐 PUBLIC ROUTE (visible to everyone except logged-in users or admins, used for login/register) */
export const PublicUserRoute = ({ children }) => {
  const { user, admin, loading } = useContext(Authcontext);

  if (loading) return <div>Loading...</div>;

  if (admin) return <Navigate to="/dashboard" replace />; // block admin
  if (user) return <Navigate to="/" replace />;           // block logged-in normal users

  return children; // guest
};

/* 🌐 PUBLIC PAGE (visible to everyone except admins, used for Home, Product, About, etc.) */
export const PublicNoAdmin = ({ children }) => {
  const { admin, loading } = useContext(Authcontext);

  if (loading) return <div>Loading...</div>;

  if (admin) return <Navigate to="/dashboard" replace />; // block admin

  return children; // guests + normal users
};

/* 🛠️ ADMIN PROTECTED ROUTE (only admins can access) */
export const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(Authcontext);

  if (loading) return <div>Loading...</div>;
  if (!admin) return <Navigate to="/login" replace />; // block non-admins

  return children; // admin
};
