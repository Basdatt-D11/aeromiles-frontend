import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AeroMiles",
  description: "Frequent Flyer Program Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <AuthProvider>
          <Navbar />
          <div className="container py-4">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}