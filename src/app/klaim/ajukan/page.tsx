"use client";

import { useRouter } from "next/navigation";

export default function AjukanKlaim() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Klaim berhasil diajukan (demo)");
    router.push("/klaim/riwayat");
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
          <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
            <h5 className="card-title mb-0 fw-bold">Ajukan Klaim Missing Miles</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold small">Maskapai</label>
                  <select className="form-select" required>
                    <option value="">Pilih Maskapai</option>
                    <option value="Garuda Indonesia">Garuda Indonesia</option>
                    <option value="Singapore Airlines">Singapore Airlines</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label fw-semibold small">Bandara Asal (IATA)</label>
                  <input type="text" className="form-control" placeholder="CGK" required />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label fw-semibold small">Bandara Tujuan (IATA)</label>
                  <input type="text" className="form-control" placeholder="DPS" required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold small">Tanggal Penerbangan</label>
                  <input type="date" className="form-control" required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold small">Flight Number</label>
                  <input type="text" className="form-control" placeholder="GA123" required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold small">Nomor Tiket</label>
                  <input type="text" className="form-control" placeholder="126XXXXXXXXXX" required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold small">Kelas Kabin</label>
                  <select className="form-select" required>
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold small">PNR</label>
                  <input type="text" className="form-control" placeholder="ABCDEF" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary px-4 mt-2" style={{ backgroundColor: "#1E3A8A", borderRadius: "6px" }}>Ajukan Klaim</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
