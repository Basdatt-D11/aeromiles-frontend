"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function TransferMiles() {
  const { user } = useAuth();
  const [awardMiles, setAwardMiles] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHistory = async () => {
    if (!user?.email) {
      setHistory([]);
      return;
    }

    try {
      const response = await fetch(`/api/transfer?email=${encodeURIComponent(user.email)}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.history)) {
        const formattedHistory = data.history.map((item: any) => {
          const type = item.transfer_type ?? (item.email_member_1?.toLowerCase() === user.email.toLowerCase() ? "Kirim" : "Terima");
          const otherEmail = type === "Kirim" ? item.email_member_2 : item.email_member_1;
          const timestamp = item.created_at ?? item.timestamp ?? item.createdAt ?? new Date().toISOString();

          return {
            timestamp,
            member_name: otherEmail,
            member_email: otherEmail,
            miles: Number(item.jumlah ?? 0),
            note: item.catatan ?? item.note ?? "-",
            type
          };
        });

        setHistory(formattedHistory);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  };

  useEffect(() => {
    async function fetchMemberData() {
      if (!user?.email) {
        setAwardMiles(null);
        setHistory([]);
        return;
      }

      try {
        const memberResponse = await fetch(`/api/member?email=${encodeURIComponent(user.email)}`);
        const memberData = await memberResponse.json();
        if (memberData.success && memberData.member?.award_miles != null) {
          setAwardMiles(Number(memberData.member.award_miles));
        } else {
          setAwardMiles(null);
        }
      } catch (err) {
        console.error(err);
        setAwardMiles(null);
      }

      await fetchHistory();
    }

    fetchMemberData();
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h4 className="fw-bold">Transfer Miles</h4>
        <p className="text-muted">Silakan login untuk melakukan transfer miles.</p>
      </div>
    );
  }

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user?.email) {
      setError("Anda harus login untuk melakukan transfer miles.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const recipientEmail = formData.get("recipient_email")?.toString().trim() || "";
    const amountValue = formData.get("amount")?.toString() || "";
    const note = formData.get("note")?.toString() || "";
    const jumlah = Number(amountValue);

    if (!recipientEmail) {
      setError("Email penerima harus diisi.");
      return;
    }
    if (!jumlah || jumlah <= 0) {
      setError("Jumlah miles harus lebih besar dari 0.");
      return;
    }
    if (jumlah < 100) {
      setError("Jumlah transfer minimal 100 miles.");
      return;
    }
    if (user.role && user.role.toLowerCase() !== "member") {
      setError("Hanya member yang dapat melakukan transfer miles.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email_member_1: user.email,
          email_member_2: recipientEmail,
          jumlah,
          catatan: note || "-"
        })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Terjadi error saat transfer.");
        setIsSubmitting(false);
        return;
      }

      setSuccess(data.message || `SUKSES: Transfer ${jumlah} miles berhasil dicatat.`);
      setAwardMiles(prev => (prev !== null ? prev - jumlah : prev));
      await fetchHistory();
      setIsSubmitting(false);

      const modalEl = document.getElementById("transferModal");
      if (modalEl) {
        // @ts-ignore
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi error saat transfer. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  const isNonMember = user?.role && user.role.toLowerCase() !== "member";

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold m-0">Transfer Miles</h4>
          <p className="text-muted small m-0">Award Miles tersedia: <span className="fw-bold">{awardMiles !== null ? awardMiles.toLocaleString("id-ID") : "Sedang dimuat..."}</span></p>
          {isNonMember && (
            <div className="alert alert-warning mt-3 py-2 mb-0 small">
              Fitur transfer hanya tersedia untuk member. Mohon gunakan akun member untuk melakukan transfer.
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#transferModal"
            style={{ backgroundColor: "#1E3A8A", borderRadius: "8px" }}
            disabled={isNonMember}
            title={isNonMember ? "Hanya member yang dapat melakukan transfer" : "Transfer baru"}
          >
            <i className="bi bi-plus-lg me-2"></i>Transfer Baru
          </button>
        </div>
      </div>

      {success && (
        <div className="alert alert-success mb-4" role="alert">
          {success}
        </div>
      )}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Riwayat Transfer</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="text-muted small">
                <tr>
                  <th className="fw-normal">Waktu</th>
                  <th className="fw-normal">Member</th>
                  <th className="fw-normal">Jumlah Miles</th>
                  <th className="fw-normal">Catatan</th>
                  <th className="fw-normal">Tipe</th>
                  <th className="fw-normal">Aksi</th>
                </tr>
              </thead>
              <tbody className="small">
                {history.map((h, index) => (
                  <tr key={index}>
                    <td className="text-muted">{h.timestamp}</td>
                    <td>
                      <div className="fw-bold text-dark">{h.member_name}</div>
                      <div className="text-muted small">{h.member_email}</div>
                    </td>
                    <td className={`fw-bold ${h.type === 'Kirim' ? 'text-danger' : 'text-success'}`}>
                      {h.type === 'Kirim' ? '-' : '+'}{h.miles.toLocaleString("id-ID")}
                    </td>
                    <td className="text-muted">{h.note}</td>
                    <td>
                      <span className={`badge rounded-pill ${h.type === 'Kirim' ? 'bg-light text-dark border' : 'bg-primary'}`} style={{ fontSize: "0.7rem", padding: "4px 12px" }}>
                        {h.type}
                      </span>
                    </td>
                    <td>
                      <i className="bi bi-lock-fill text-muted" style={{ cursor: "not-allowed" }} title="Tidak dapat diubah"></i>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">Belum ada riwayat transfer.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Transfer */}
      <div className="modal fade" id="transferModal" tabIndex={-1} aria-labelledby="transferModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "12px" }}>
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold" id="transferModalLabel">Transfer Miles</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleTransfer}>
                {error && (
                  <div className="alert alert-danger small mb-3" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success small mb-3" role="alert">
                    {success}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email Penerima</label>
                  <input type="email" name="recipient_email" className="form-control" placeholder="member@example.com" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Jumlah Miles</label>
                  <input type="number" name="amount" className="form-control" placeholder="0" min="100" required />
                  <div className="form-text small">Maksimal transfer: {awardMiles !== null ? awardMiles.toLocaleString("id-ID") : "Sedang dimuat..."} miles.</div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold small">Catatan (opsional)</label>
                  <textarea name="note" className="form-control" rows={3} placeholder="Hadiah"></textarea>
                </div>
                <div className="d-flex justify-content-end">
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary px-4" style={{ backgroundColor: "#1E3A8A", borderRadius: "6px" }}>
                    {isSubmitting ? "Sedang mengirim..." : "Transfer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
