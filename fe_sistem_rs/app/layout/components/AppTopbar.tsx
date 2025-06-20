"use client";

import React from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function AppTopbar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="topbar flex items-center justify-between px-4 py-2 border-b bg-white">
      <div className="text-lg font-bold text-green-600">🏥 Rumah Sakit</div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Admin</span>
        <Button icon="pi pi-sign-out" onClick={handleLogout} label="Logout" className="p-button-sm p-button-secondary" />
      </div>
    </div>
  );
}
