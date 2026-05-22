"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout();
    router.push("/auth/login");
  }, [logout, router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="text-center text-muted">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Memproses...</span>
        </div>
        <h5>Sedang keluar dari sistem AeroMiles...</h5>
      </div>
    </div>
  );
}