"use client";

export default function AddMember() {
  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
      <div className="card-header bg-white"><strong>Tambah Member Baru</strong></div>
      <div className="card-body">
        <form className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="john@example.com" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Salutation</label>
            <select className="form-select"><option>Mr.</option><option>Ms.</option></select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Nama Depan</label>
            <input type="text" className="form-control" defaultValue="John" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nama Tengah</label>
            <input type="text" className="form-control" defaultValue="William" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nama Belakang</label>
            <input type="text" className="form-control" defaultValue="Doe" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Kewarganegaraan</label>
            <select className="form-select"><option>Indonesia</option></select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Tier</label>
            <select className="form-select"><option>Blue</option><option>Gold</option></select>
          </div>
          <div className="col-12 text-end">
            <button type="button" className="btn btn-primary px-4">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
