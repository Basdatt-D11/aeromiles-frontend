"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">{children}</div>
    </>
  );
}
