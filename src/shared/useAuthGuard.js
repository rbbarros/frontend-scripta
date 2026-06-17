import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../lib/session";

export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);
}
