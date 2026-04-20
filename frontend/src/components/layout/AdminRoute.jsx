import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { currentUser } from "@/api/api"; //

export default function AdminRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    currentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Check if user exists and has the 'admin' role
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
