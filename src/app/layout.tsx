import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/navbar";


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
      </head>
      <body style={{ backgroundColor: "#F4F5F7", fontFamily: "'Inter', sans-serif" }}>
        <AuthProvider>
          <Navbar />
          {/* Main Content Wrapper */}
          <main className="container py-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}