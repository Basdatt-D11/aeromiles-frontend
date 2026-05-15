"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RedeemHadiah() {
  const { user } = useAuth();
  const [hadiahList, setHadiahList] = useState<any[]>([]);
  const [message, setMessage] = useState<{ text: string; type: "success" | "danger" } | null>(null);

  useEffect(() => {
    fetch("/api/hadiah").then(res => res.json()).then(data => {
      if (data.success) setHadiahList(data.data);
    });
  }, []);

  const handleRedeem = async (kode_hadiah: string) => {
    if (!user || !confirm("Yakin ingin menukar miles?")) return;

    const res = await fetch("/api/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_member: user.email, kode_hadiah }),
    });
    const data = await res.json();

    if (res.ok) {
      setMessage({ text: data.message, type: "success" });
    } else {
      setMessage({ text: data.error, type: "danger" });
    }
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Redeem Hadiah</h2>
        <p className="text-muted">Tersedia untuk: <span className="fw-bold">{user?.nama}</span></p>
      </div>

      {message && <div className={`alert alert-${message.type} fade show`}>{message.text}</div>}

      <div className="row g-4">
        {hadiahList.map((h, i) => (
          <div className="col-md-4" key={i}>
            <div className="card shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="badge bg-primary">{h.kode_hadiah}</span>
                  <span className="fw-bold text-success">{h.miles} Miles</span>
                </div>
                <h5 className="fw-bold mb-3">{h.nama}</h5>
                <button onClick={() => handleRedeem(h.kode_hadiah)} className="btn btn-outline-primary w-100">Redeem</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}