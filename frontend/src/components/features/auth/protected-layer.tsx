import { useUser } from "@/store/auth-store";
import React from "react";

interface ProtectedLayerProps {
  children: React.ReactNode;
  role: "user" | "admin";
  onUnauthorized: () => void;
}

function ProtectedLayer({
  children,
  role,
  onUnauthorized,
}: ProtectedLayerProps) {
  const user = useUser();
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    if (user?.role !== role) onUnauthorized();
    else setAllowed(true);
  }, [allowed, user, role, onUnauthorized]);

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
