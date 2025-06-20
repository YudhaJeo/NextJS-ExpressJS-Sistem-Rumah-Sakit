// app/layout.tsx
"use client";

import "./globals.css";
import { AppTopbar } from "./layout/components/AppTopbar";
import { AppSidebar } from "./layout/components/AppSidebar";
import { AppFooter } from "./layout/components/AppFooter";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) router.push("/login");
  }, []);

  return (
    <html lang="id">
      <body>
        <AppTopbar />
        <div className="flex">
          <AppSidebar />
          <main className="p-4 flex-1 bg-gray-50">{children}</main>
        </div>
        <AppFooter />
      </body>
    </html>
  );
}
