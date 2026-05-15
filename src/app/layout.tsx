import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AeroMiles",
  description: "Frequent Flyer Program Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = "Member"; 
  const currentPath = "/";

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --aero-primary: #0052CC;   
            --aero-secondary: #2684FF; 
            --aero-accent: #00B8D9;     
            --aero-bg: #F4F5F7;
          }
          body {
            font-family: 'Inter', sans-serif;
            background-color: var(--aero-bg);
            color: #172B4D;
          }
          h1, h2, h3, h4, h5, h6, .brand-group {
            display: flex; align-items: center; gap: 15px; flex-shrink: 0;
          }
          .card, .card-stat, .alert, .badge {
            border-radius: 12px !important; border: none !important;
          }
          .navbar-aero { background-color: var(--aero-primary); padding: 0.4rem 1rem; }
          .nav-container { display: flex; align-items: center; width: 100%; flex-wrap: nowrap; }
          .nav-item-aero {
            display: flex; flex-direction: row; align-items: center;
            color: rgba(255, 255, 255, 0.85); text-decoration: none;
            padding: 4px 10px; border-radius: 8px; font-size: 0.7rem;
            transition: 0.2s ease; text-align: center; flex-shrink: 0; 
          }
          .nav-text { max-width: 60px; line-height: 1; margin-top: 0px; margin-left: 8px; white-space: normal; }
          .nav-item-aero i { font-size: 1.1rem; }
          .active-dashboard { background-color: rgba(255, 255, 255, 0.15); color: #ffffff !important; margin-left: 10px; }
          .nav-item-aero:hover { background-color: rgba(255, 255, 255, 0.2); color: #ffffff; }
          .text-logout { color: #ff6b6b !important; }
        `}</style>
      </head>
      <body>
        <nav className="navbar navbar-expand-lg navbar-dark navbar-aero sticky-top shadow-sm">
          <div className="container-fluid">
            <div className="nav-container">
              <div className="brand-group">
                <Link className="navbar-brand fw-bold m-0" href="/">
                  <i className="bi bi-airplane-fill text-info me-1"></i>AeroMiles
                </Link>
                <Link className={`nav-item-aero ${currentPath === '/' ? 'active-dashboard' : ''}`} href="/">
                  <i className="bi bi-grid-fill"></i>
                  <span className="nav-text">Dashboard</span>
                </Link>
              </div>

              <div className="d-flex ms-auto gap-1">
                {role === "Staff" && (
                  <>
                    <Link className="nav-item-aero" href="/members/list">
                      <i className="bi bi-people-fill"></i>
                      <span className="nav-text">Kelola Member</span>
                    </Link>
                    <Link className="nav-item-aero" href="/klaim/kelola">
                      <i className="bi bi-airplane-engines-fill"></i>
                      <span className="nav-text">Kelola Klaim</span>
                    </Link>
                    <Link className="nav-item-aero" href="/hadiah/kelola">
                      <i className="bi bi-gift-fill"></i>
                      <span className="nav-text">Kelola Hadiah</span>
                    </Link>
                    <Link className="nav-item-aero" href="/mitra/kelola">
                      <i className="bi bi-shop-window"></i>
                      <span className="nav-text">Kelola Mitra</span>
                    </Link>
                    <Link className="nav-item-aero" href="/transactions/report">
                      <i className="bi bi-file-earmark-bar-graph-fill"></i>
                      <span className="nav-text">Laporan Transaksi</span>
                    </Link>
                  </>
                )}

                {role === "Member" && (
                  <>
                    <Link className="nav-item-aero" href="/members/identitas">
                      <i className="bi bi-file-earmark-person-fill"></i>
                      <span className="nav-text">Identitas Saya</span>
                    </Link>
                    <Link className="nav-item-aero" href="/klaim/ajukan">
                      <i className="bi bi-airplane-engines-fill"></i>
                      <span className="nav-text">Klaim Miles</span>
                    </Link>
                    <Link className="nav-item-aero" href="/transactions/transfer">
                      <i className="bi bi-arrow-left-right"></i>
                      <span className="nav-text">Transfer Miles</span>
                    </Link>
                    <Link className="nav-item-aero" href="/transactions/redeem">
                      <i className="bi bi-gift-fill"></i>
                      <span className="nav-text">Redeem Hadiah</span>
                    </Link>
                    <Link className="nav-item-aero" href="/transactions/buy-package">
                      <i className="bi bi-cart-fill"></i>
                      <span className="nav-text">Beli Package</span>
                    </Link>
                    <Link className="nav-item-aero" href="/transactions/tier">
                      <i className="bi bi-award-fill"></i>
                      <span className="nav-text">Info Tier</span>
                    </Link>
                  </>
                )}

                <Link className="nav-item-aero" href="/profile/settings">
                  <i className="bi bi-gear-fill"></i>
                  <span className="nav-text">Pengaturan Profil</span>
                </Link>
                <Link className="nav-item-aero text-logout" href="/auth/logout">
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="nav-text">Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container py-4">
          {children}
        </div>
      </body>
    </html>
  );
}