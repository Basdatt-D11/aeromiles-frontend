import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import MainLayoutWrapper from "@/components/MainLayoutWrapper";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AeroMiles",
  description: "AeroMiles Dashboard",
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        <script src="https://cdn.tailwindcss.com" async></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              corePlugins: {
                preflight: false,
              },
              theme: {
                extend: {
                  fontFamily: { sans: ['Inter', 'sans-serif'] },
                  colors: {
                    brand: {
                      dark: '#0F172A',
                      primary: '#1E3A8A',
                      primaryHover: '#172554',
                      accent: '#60A5FA',
                      iconBg: '#315891',
                    }
                  }
                }
              }
            }
          `
        }}></script>
      </head>
      <body>
        <AuthProvider>
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
        </AuthProvider>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
