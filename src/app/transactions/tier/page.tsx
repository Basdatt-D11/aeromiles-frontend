"use client";

export default function TierInfo() {
  const currentMiles = 42000;
  const progress = 60; // Mock progress to Gold
  
  const tiers = [
    { name: "Blue", min_miles: 0, notes: ["Member awal"], color: "secondary" },
    { name: "Silver", min_miles: 10000, notes: ["Minimal 2 penerbangan"], color: "info" },
    { name: "Gold", min_miles: 30000, notes: ["Akses lounge", "Prioritas boarding"], color: "warning" },
    { name: "Platinum", min_miles: 60000, notes: ["Bonus miles 50%", "Concierge"], color: "primary" }
  ];

  const currentTier = tiers[2]; // Gold
  const nextTier = tiers[3]; // Platinum

  return (
    <>
      <div className="mb-4">
        <h4 className="m-0">Info Tier</h4>
        <small className="text-muted">Informasi tentang tingkatan dan progress Anda menuju tier berikutnya</small>
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div>Saldo Miles Anda: <strong>{currentMiles.toLocaleString("id-ID")}</strong></div>
            <div className="text-muted">Butuh <strong>18.000</strong> miles untuk naik ke {nextTier.name}</div>
          </div>
          <div className="progress" style={{ height: "14px", borderRadius: "12px" }}>
            <div className="progress-bar bg-info" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}></div>
          </div>
        </div>
      </div>

      <div className="row gy-3">
        {tiers.map((t, index) => (
          <div key={index} className="col-12">
            <div className={`card p-3 ${t.name === currentTier.name ? 'border-success shadow-sm' : ''}`} style={{ borderWidth: "2px" }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: "56px", height: "56px", borderRadius: "12px", backgroundColor: t.name === currentTier.name ? '#e6ffed' : '#f8f9fa', display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`bi bi-award-fill fs-4 text-${t.color}`}></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">{t.name} {t.name === currentTier.name && <span className="badge bg-success">Saat Ini</span>}</h6>
                      <small className="text-muted">Minimal Miles: {t.min_miles.toLocaleString("id-ID")}</small>
                    </div>
                    <div className="text-end">
                      {t.name === currentTier.name && nextTier && (
                        <small className="text-muted">{progress}% ke {nextTier.name}</small>
                      )}
                    </div>
                  </div>
                  <ul className="mb-0 mt-2">
                    {t.notes.map((n, i) => (
                      <li key={i} className="text-muted small">{n}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
