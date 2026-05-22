"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user } = useAuth();
  const currentPath = usePathname();
  if (currentPath.startsWith("/auth")) return null;
  const role = user?.role === "STAFF" ? "Staff" : "Member";

  const getActiveClass = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + "/") ? 'active-dashboard' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-aero sticky-top shadow-sm">
      <div className="container-fluid">
        <div className="nav-container">
          <div className="brand-group">
            <Link className="navbar-brand fw-bold m-0" href="/">
              <i className="bi bi-airplane-fill text-info me-1"></i>AeroMiles
            </Link>
            {/* Dashboard Link */}
            <Link className={`nav-item-aero ${getActiveClass('/')}`} href="/">
              <i className="bi bi-grid-fill"></i>
              <span className="nav-text">Dashboard</span>
            </Link>
          </div>

          <div className="d-flex ms-auto gap-1">
            {role === "Staff" && (
              <>
                <Link className={`nav-item-aero ${getActiveClass('/members')}`} href="/members/list">
                  <i className="bi bi-people-fill"></i>
                  <span className="nav-text">Kelola Member</span>
                </Link>
                
                <Link className={`nav-item-aero ${getActiveClass('/klaim')}`} href="/klaim">
                  <i className="bi bi-airplane-engines-fill"></i>
                  <span className="nav-text">Kelola Klaim</span>
                </Link>

                {/* --- MENU TAMBAHAN STAFF --- */}
                <Link className={`nav-item-aero ${getActiveClass('/hadiah')}`} href="/hadiah/kelola">
                  <i className="bi bi-gift-fill"></i>
                  <span className="nav-text">Kelola Hadiah</span>
                </Link>

                <Link className={`nav-item-aero ${getActiveClass('/mitra')}`} href="/mitra/kelola">
                  <i className="bi bi-building-fill"></i>
                  <span className="nav-text">Kelola Mitra</span>
                </Link>

                <Link className={`nav-item-aero ${getActiveClass('/laporan')}`} href="/transactions/report">
                  <i className="bi bi-file-earmark-text-fill"></i>
                  <span className="nav-text">Laporan Transaksi</span>
                </Link>
              </>
            )}

            {role === "Member" && (
              <>
                {/* Identitas Saya - Sekarang pake /identitas (Unified UI) */}
                <Link 
                  className={`nav-item-aero ${getActiveClass('/members/identitas')}`} 
                  href="/members/identitas"
                >
                  <i className="bi bi-file-earmark-person-fill"></i>
                  <span className="nav-text">Identitas Saya</span>
                </Link>

                {/* Klaim Miles - Sekarang ke root /klaim sesuai update tadi */}
                <Link className={`nav-item-aero ${getActiveClass('/klaim')}`} href="/klaim">
                  <i className="bi bi-airplane-engines-fill"></i>
                  <span className="nav-text">Klaim Miles</span>
                </Link>

                <Link className={`nav-item-aero ${getActiveClass('/transactions/transfer')}`} href="/transactions/transfer">
                  <i className="bi bi-arrow-left-right"></i>
                  <span className="nav-text">Transfer Miles</span>
                </Link>

                <Link className={`nav-item-aero ${getActiveClass('/transactions/redeem')}`} href="/transactions/redeem">
                  <i className="bi bi-gift-fill"></i>
                  <span className="nav-text">Redeem Hadiah</span>
                </Link>

                <Link className={`nav-item-aero ${getActiveClass('/transactions/buy-package')}`} href="/transactions/buy-package">
                  <i className="bi bi-cart-fill"></i>
                  <span className="nav-text">Beli Package</span>
                </Link>

                <Link className={`nav-item-aero ${getActiveClass('/transactions/tier')}`} href="/transactions/tier">
                  <i className="bi bi-award-fill"></i>
                  <span className="nav-text">Info Tier</span>
                </Link>
              </>
            )}

            <Link className={`nav-item-aero ${getActiveClass('/profile/settings')}`} href="/profile/settings">
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
  );
}