"use client";
import { ROLE } from "@/constants/enums";
import { useIsAuthenticated, useUser } from "@/store/auth-store";
import React from "react";

interface ProtectedLayerProps {
  children: React.ReactNode;
  role: ROLE;
  onUnauthorized: () => void;
}

function ProtectedLayer({
  children,
  role,
  onUnauthorized,
}: ProtectedLayerProps) {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    // Not call for authentication yet
    if (isAuthenticated === null) return;
    // Called and not authenticated
    if (isAuthenticated === false) {
      onUnauthorized();
      setAllowed(false);
      return;
    }
    // Authenticated but role not match
    if (user?.role !== role) {
      onUnauthorized();
      setAllowed(false);
    } else setAllowed(true);
  }, [user, role, onUnauthorized, isAuthenticated]);

  React.useEffect(() => {
    function handle() {
      onUnauthorized();
    }
    window.addEventListener("needlogin", handle, { once: true });
    return () => {
      window.removeEventListener("needlogin", handle);
    };
  }, [onUnauthorized]);

  if (!allowed) return null;
  return <>{children}</>;
}

export default ProtectedLayer;
