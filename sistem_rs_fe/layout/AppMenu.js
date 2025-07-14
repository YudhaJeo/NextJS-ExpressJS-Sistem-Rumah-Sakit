// sistem_rs_fe\layout\AppMenu.js
/* eslint-disable @next/next/no-img-element */

import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model = [
    {
      label: "dashboard",
      items: [
        { label: "Dashboard utama", icon: "pi pi-fw pi-chart-bar", to: "/"},
      ],
    },
    {
      label: "Antrian",
      icon: "pi pi-fw pi-list",
      items: [
        { label: "Antrian Pendaftaran", icon: "pi pi-fw pi-users", to: "/antrian/data" },
        { label: "Antrian Poli", icon: "pi pi-fw pi-users", to: "/antrian/antrianPoli" },
        { label: "Data Printer", icon: "pi pi-fw pi-print", to: "/antrian/printer" },
      ],
    },
    {
      label: "Master Data",
      items: [
        {
          label: "Master",
          items: [
            { label: "Loket", icon: "pi pi-fw pi-ticket", to: "/master/loket" },
            { label: "Asuransi", icon: "pi pi-fw pi-id-card", to: "/master/asuransi" },
            { label: "Agama", icon: "pi pi-fw pi-building-columns", to: "/master/agama" },
            { label: "Poli", icon: "pi pi-fw pi-warehouse", to: "/master/poli" },
            { label: "Dokter", icon: "pi pi-fw pi-graduation-cap", to: "/master/dokter" },
            { label: "Tenaga Medis", icon: "pi pi-fw pi-users", to: "/master/tenagaMedis" },
          ],
        },
      ],
    },
    {
      label: "Fitur Pasien",
      items: [
        { label: "Dashboard Pasien", icon: "pi pi-fw pi-chart-bar", to: "/dashboard" },
        { label: "Master",
          items: [
            { label: "Pasien", icon: "pi pi-fw pi-user", to: "/pasien" },,
          ],
        },
        {
          label: "Menu",
          items: [
        { label: "Pendaftaran Pasien", 
          icon: "pi pi-fw pi-user-plus",
          items: [
            { label: "Reservasi", icon: "pi pi-fw pi-calendar", to: "/pendaftaran/reservasi" },
            { label: "Formulir Pendaftaran", icon: "pi pi-fw pi-book", to: "/pendaftaran/formulir" },
          ],
        },
        {
          label: "Rekam Medis",
          icon: "pi pi-fw pi-folder-open",
          items: [
            { label: "File Dokumen", icon: "pi pi-fw pi-file", to: "/rekamMedis/dokumen" },
            { label: "Tracer Rekam Medis", icon: "pi pi-fw pi-notes", to: "/rekamMedis/tracer" },
          ],
        },
        {
          label: "Laporan",
          icon: "pi pi-fw pi-chart-bar",
          items: [
            { label: "Pendaftaran Pasien", icon: "pi pi-fw pi-file-arrow-up", to: "/laporan/report-pendaftaran-pasien" },
            { label: "Statistik Kunjungan", icon: "pi pi-fw pi-chart-line", to: "/laporan/statistik-kunjungan" },
            { label: "Rekap Kunjungan", icon: "pi pi-fw pi-file-check", to: "/laporan/rekap-kunjungan" },
            { label: "Histori Transaksi", icon: "pi pi-fw pi-history", to: "/laporan/histori-transaksi" },
          ],
        },
        { label: "Riwayat Kunjungan", icon: "pi pi-fw pi-history", to: "/pendaftaran/riwayatKunjungan" },
      ],
    },
  ],
},
{
  label: "Fitur Dokter",
  items: [
    { label: "Dashboard Dokter", icon: "pi pi-fw pi-chart-bar", to: "/dashboarddokter" },
    { label: "Master",
      items: [
        {},
      ],
     },
    {
      label: "Menu",
      items: [
        { label: "Data Dokter", icon: "pi pi-fw pi-user", to: "/data" },
        { label: "Kalender Dokter", icon: "pi pi-fw pi-book", to: "/kalender_dokter" },
        { label: "Riwayat Pengobatan", icon: "pi pi-fw pi-folder-open", to: "/riwayat_pengobatan" },
        { label: "Manajemen Komisi", icon: "pi pi-fw pi-money-bill", to: "/dokter/manajemen_komisi" },
        {
          label: "Laporan",
          icon: "pi pi-fw pi-chart-bar",
          items: [
            { label: "Laporan Komisi", icon: "pi pi-fw pi-file", to: "/dokter/laporan-komisi" },
            { label: "Entri Rekam Medis", icon: "pi pi-fw pi-pencil", to: "/dokter/entri-rm" },
            { label: "Drawing Rekam Medis", icon: "pi pi-fw pi-image", to: "/dokter/drawing-rm" },
            { label: "Histori Transaksi", icon: "pi pi-fw pi-history", to: "/dokter/histori-transaksi" },
          ],
        },
      ],
    },
  ],
},
    {
  label: "Fitur Rawat Jalan",
  items: [
    { label: "Dashboard Rawat Jalan", icon: "pi pi-fw pi-home", to: "/rawatjalan/dashboard" },
    { label: "Master",
      items: [
        {},
      ],
     },
    {
      label: "Menu",
      items: [
        { label: "Tindakan & Layanan Medis", icon: "pi pi-fw pi-heart", to: "/rawatjalan/tindakan-layanan" },
        { label: "Resep Obat", icon: "pi pi-fw pi-briefcase", to: "/rawatjalan/resep" },
        { label: "Perjanjian", icon: "pi pi-fw pi-calendar-plus", to: "/rawatjalan/perjanjian" },
        { label: "Kalender Perjanjian", icon: "pi pi-fw pi-calendar", to: "/rawatjalan/kalender-perjanjian" },
        { label: "Riwayat Perjanjian", icon: "pi pi-fw pi-history", to: "/rawatjalan/riwayat-perjanjian" },
        { label: "Kalender Ruangan", icon: "pi pi-fw pi-building", to: "/rawatjalan/kalender-ruangan" },
        { label: "Riwayat Pasien", icon: "pi pi-fw pi-users", to: "/rawatjalan/riwayat-pasien" },
        { label: "Laporan Tindakan Medis", icon: "pi pi-fw pi-file", to: "/rawatjalan/laporan-tindakan" },
        { label: "Cetak Rekam Medis", icon: "pi pi-fw pi-print", to: "/rawatjalan/cetak-rm" },
        { label: "Resep Obat Pasien", icon: "pi pi-fw pi-book-medical", to: "/rawatjalan/resep-pasien" },
        { label: "Report Resep Pasien", icon: "pi pi-fw pi-chart-bar", to: "/rawatjalan/report-resep" },
      ],
    },
  ],
},
{
  label: "Fitur Rawat Inap",
  items: [
    { label: "Dashboard Rawat Inap", icon: "pi pi-fw pi-chart-bar", to: "/rawatinap" },
    { label: "Master",
      items: [
        { label: "Jenis Bangsal", icon: "pi pi-fw pi-tag", to: "/master/jenisbangsal" },
        { label: "Manajemen Bangsal", icon: "pi pi-fw pi-th-large", to: "/rawatinap/manajemen-bangsal" },
        { label: "Manajemen Kamar", icon: "pi pi-fw pi-table", to: "/rawatinap/manajemen-kamar" },
      ],
     },    
    {
      label: "Menu",
      items: [
        { label: "Manajemen Bed", icon: "pi pi-fw pi-objects-column", to: "/rawatinap/manajemen-bed" },
        { label: "Charge Kamar", icon: "pi pi-fw pi-wallet", to: "/rawatinap/charge-kamar" },
        { label: "Resep Obat", icon: "pi pi-fw pi-briefcase", to: "/rawatinap/resep" },
        { label: "Tindakan Medis", icon: "pi pi-fw pi-heart", to: "/rawatinap/tindakan" },
        { label: "Cetak Tindakan Medis", icon: "pi pi-fw pi-print", to: "/rawatinap/cetak-tindakan" },
        { label: "Tagihan Sementara", icon: "pi pi-fw pi-money-bill", to: "/rawatinap/tagihan-sementara" },
        { label: "Riwayat Sementara", icon: "pi pi-fw pi-history", to: "/rawatinap/riwayat-sementara" },
        { label: "Riwayat Pasien", icon: "pi pi-fw pi-users", to: "/rawatinap/riwayat-pasien" },
      ],
    },
  ],
},
{
  label: "Fitur Kasir & Sales",
  items: [
    { label: "Dashboard Kasir", icon: "pi pi-fw pi-chart-bar", to: "/kasir/dashboard" },
    { label: "Master",
      items: [
        { label: "Bank Account", icon: "pi pi-fw pi-building", to: "/bankAccount" },
        { label: "Metode Pembayaran", icon: "pi pi-fw pi-credit-card", to: "/metodePembayaran" },
      ],
     },
    {
      label: "Menu",
      items: [
        { label: "Invoice & Pembayaran", 
          icon: "pi pi-fw pi-wallet",
          items: [
            { label: "Invoice", icon: "pi pi-fw pi-receipt", to: "/invoice" },
            { label: "Pembayaran", icon: "pi pi-fw pi-money-bill", to: "/pembayaran" },
          ],
        },
        { label: "Pembayaran Angsuran", icon: "pi pi-fw pi-credit-card", to: "/pembayaranangsuran" },
        { label: "Deposit Pembayaran", icon: "pi pi-fw pi-wallet", to: "/deposit" },
        { label: "Cetak Invoice & Kwitansi", icon: "pi pi-fw pi-print", to: "/cetakInvoice" },
        { label: "Produk & Layanan", icon: "pi pi-fw pi-tags", to: "/produkLayanan" },
        { label: "Jenis Produk & Layanan", icon: "pi pi-fw pi-th-large", to: "/jenisProduk" },
        { label: "Laporan Pembayaran", icon: "pi pi-fw pi-chart-bar", to: "/laporanPembayaran" },
      ],
    },
  ],
},
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) =>
          !item.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator" key={`separator-${i}`}></li>
          )
        )}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
