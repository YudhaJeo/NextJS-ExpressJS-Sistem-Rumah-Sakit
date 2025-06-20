"use client";

import React from "react";
import { PanelMenu } from "primereact/panelmenu";
import { useRouter } from "next/navigation";
import { AppMenu } from "./AppMenu";

export function AppSidebar() {
  const router = useRouter();

  const handleMenuClick = (item: any) => {
    if (item.to) router.push(item.to);
  };

  const transformMenu = (items: any[]) =>
    items.map((group) => ({
      label: group.label,
      items: group.items.map((item: any) => ({
        label: item.label,
        icon: item.icon,
        command: () => handleMenuClick(item),
      })),
    }));

  return (
    <div className="sidebar w-64 min-h-screen border-r p-3 bg-white">
      <PanelMenu model={transformMenu(AppMenu)} />
    </div>
  );
}
