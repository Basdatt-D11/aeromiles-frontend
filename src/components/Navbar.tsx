"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return pathname === path ? "active-dashboard" : "";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-aero sticky-top shadow-sm">
      <div className="container-fluid">
        <div className="nav-container">
          <div className="brand-group">
            <Link className="navbar-brand fw-bold m-0" href="/">
              <i className="bi bi-airplane-fill text-info me-1"></i>AeroMiles
            </Link>

            <Link className={`nav-item-aero ${isActive("/")}`} href="/">
              <i className="bi bi-grid-fill"></i>
              <span className="nav-text">Dashboard</span>
            </Link>
          </div>

          <div className="d-flex ms-auto gap-1">
            {user?.role === "Staff" && (
              <>
                <Link className={`nav-item-aero ${isActive("/members/list")}`} href="/members/list">
                  <i className="bi bi-people-fill"></i>
                  <span className="nav-text">Kelola Member</span>
                </Link>
                <Link className={`nav-item-aero ${isActive("/klaim/kelola")}`} href="/klaim/kelola">
                  <i className="bi bi-airplane-engines-fill"></i>
                  <span className="nav-text">Kelola Klaim</span>
                </Link>
                <Link className={`nav-item-aero ${isActive("/hadiah/kelola")}`} href="/hadiah/kelola">
                  <i className="bi bi-gift-fill"></i>
                  <span className="nav-text">Kelola Hadiah</span>
                </Link>
                <Link className={`nav-item-aero ${isActive("/mitra/kelola")}`} href="/mitra/kelola">
                  <i className="bi bi-shop-window"></i>
                  <span className="nav-text">Kelola Mitra</span>
                </Link>
                <Link className={`nav-item-aero ${isActive("/transactions/report")}`} href="/transactions/report">
                  <i className="bi bi-file-earmark-bar-graph-fill"></i>
                  <span className="nav-text">Laporan Transaksi</span>
                </Link>
                <Link className={`nav-item-aero ${isActive("/profile/settings")}`} href="/profile/settings">
                  <i className="bi bi-gear-fill"></i>
                  <span className="nav-text">Pengaturan Profil</span>
                </Link>
                <Link className={`nav-item-aero text-logout ${isActive("/auth/logout")}`} href="/auth/logout">
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="nav-text">Logout</span>
                </Link>
              </>
            )}

            {user?.role === "Member" && (
              <>
                <Link className={`nav-item-aero ${isActive("/members/identitas")}`} href="/members/identitas">
                  <i className="bi bi-file-earmark-person-fill"></i>
                  <span className="nav-text">Identitas Saya</span>
                </Link>
                <Link className={`nav-item-aero ${isActive("/klaim/riwayat")}`} href="/klaim/riwayat">
                  <i className="bi bi-airplane-engines-fill"></i>
                  <span className="nav-text">Klaim Miles</span>
                </Link>
                <Link className={`nav-item-aero ${isActive("/transactions/transfer")}`} href="/transactions/transfer">
                  <i className="bi bi-arrow-left-right"></i>
                  <span className="nav-text">Transfer Miles</span>
                </Link>
                <Link className={`nav-item-aero ${isActive("/transactions/redeem")}`} href="/transactions/redeem">
                  <i className="bi bi-gift-fill"></i>
                  <span className="nav-text">Redeem Hadiah</span>
                </Link>
                <Link className={`nav-item-aero ${isActive("/transactions/buy-package")}`} href="/transactions/buy-package">
                  <i className="bi bi-cart-fill"></i>
                  <span className="nav-text">Beli Package</span>
                </Link>
                <Link className={`nav-item-aero ${isActive("/transactions/tier")}`} href="/transactions/tier">
                  <i className="bi bi-award-fill"></i>
                  <span className="nav-text">Info Tier</span>
                </Link>
                <Link className={`nav-item-aero ${isActive("/profile/settings")}`} href="/profile/settings">
                  <i className="bi bi-gear-fill"></i>
                  <span className="nav-text">Pengaturan Profil</span>
                </Link>
                <Link className={`nav-item-aero text-logout ${isActive("/auth/logout")}`} href="/auth/logout">
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="nav-text">Logout</span>
                </Link>
              </>
            )}
            
            {!user && (
              <Link className={`nav-item-aero ${isActive("/auth/login")}`} href="/auth/login">
                <i className="bi bi-box-arrow-in-right"></i>
                <span className="nav-text">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
