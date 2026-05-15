"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user } = useAuth();
  const currentPath = usePathname();

  if (!user) return null;

  const role = user.role === "STAFF" ? "Staff" : "Member";

  return (
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
  );
}