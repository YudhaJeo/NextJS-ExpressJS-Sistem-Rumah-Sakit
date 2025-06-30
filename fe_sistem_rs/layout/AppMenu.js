/* eslint-disable @next/next/no-img-element */

import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import Link from "next/link";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model = [
    {
      label: "Home",
      items: [
        {
          label: "Dashboard",
          icon: "pi pi-fw pi-home",
          to: "/",
        },
        {
          label: "Antrian",
          icon: "pi pi-fw pi-list",
          items: [
            {
              label: "Data Antrian",
              icon: "pi pi-fw pi-users",
              to: "/antrian/data",
            },
            {
              label: "Data Printer",
              icon: "pi pi-fw pi-print",
              to: "/antrian/printer",
            },
          ],
        },
      ],
    },
    {
      label: "Master Data",
      items: [
        {
          label: "Master",
          icon: "pi pi-fw pi-database",
          items: [
            {
              label: "Pasien",
              icon: "pi pi-fw pi-user",
              to: "/master/pasien",
            },
            {
              label: "Asuransi",
              icon: "pi pi-fw pi-id-card",
              to: "/master/asuransi",
            },
            {
              label: "Agama",
              icon: "pi pi-fw pi-building-columns",
              to: "/master/agama",
            },
            {
              label: "Poli",
              icon: "pi pi-fw pi-warehouse",
              to: "/master/poli",
            },
            {
              label: "Dokter",
              icon: "pi pi-fw pi-graduation-cap",
              to: "/master/dokter",
            },
          ],
        },
        {
          label: "Loket",
          icon: "pi pi-fw pi-id-card",
          items: [
            {
              label: "Database Loket",
              icon: "pi pi-fw pi-user",
              to: "/master/loket",
            },
          ],
        },
      ],
    },
    {
      label: "Pendaftaran",
      items: [
        {
          label: "Pendaftaran Pasien",
          icon: "pi pi-fw pi-user-plus",
          items: [
            {
              label: "Reservasi",
              icon: "pi pi-fw pi-calendar",
              to: "/pendaftaran/reservasi",
            },
            {
              label: "Formulir Pendaftaran",
              icon: "pi pi-fw pi-book",
              to: "/pendaftaran/formulir",
            },
          ],
        },
      ],
    },
    {
      label: "Rekam Medis",
      items: [
        {
          label: "Data Medis",
          icon: "pi pi-fw pi-folder-open",
          items: [
            {
              label: "File Dokumen",
              icon: "pi pi-fw pi-file",
              to: "/rekamMedis/dokumen",
            },
            {
              label: "Tracer Rekam Medis",
              icon: "pi pi-fw pi-book",
              to: "/rekamMedis/tracer-rekam-medis",
            },
          ],
        },
      ],
    },
    {
      label: "Laporan",
      items: [
        {
          label: "Reporting",
          icon: "pi pi-fw pi-chart-bar",
          items: [
            {
              label: "Pendaftaran Pasien",
              icon: "pi pi-fw pi-file-arrow-up",
              to: "/laporan/report-pendaftaran-pasien",
            },
            {
              label: "Statistik Kunjungan",
              icon: "pi pi-fw pi-chart-line",
              to: "/laporan/statistik-kunjungan",
            },
            {
              label: "Rekap Kunjungan",
              icon: "pi pi-fw pi-file-check",
              to: "/laporan/rekap-kunjungan",
            },
            {
              label: "Histori Transaksi",
              icon: "pi pi-fw pi-history",
              to: "/laporan/histori-transaksi",
            },
          ],
        },
      ],
    },
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator" key={`separator-${i}`}></li>
          );
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
