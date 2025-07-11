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
            {
              label: "Jenis Bangsal",
              icon: "pi pi-fw pi-tag",
              to: "/master/jenisbangsal",
            },
          ],
        },
      ],
    },
    {
      label: "Fitur Pasien",
      items: [
        {
          label: "Menu",
          items: [
        { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/dashboard" },
        { label: "Pasien", icon: "pi pi-fw pi-user", to: "/pasien" },
        { label: "Pendaftaran Pasien", 
          icon: "pi pi-fw pi-user-plus",
          items: [
            { label: "Reservasi", icon: "pi pi-fw pi-calendar", to: "/pendaftaran/reservasi" },
            { label: "Formulir Pendaftaran", icon: "pi pi-fw pi-book", to: "/pendaftaran/formulir" },
            { label: "Riwayat Kunjungan", icon: "pi pi-fw pi-history", to: "/pendaftaran/riwayatKunjungan" },
          ],
        },
        {
          label: "Rekam Medis",
          icon: "pi pi-fw pi-folder-open",
          items: [
            { label: "File Dokumen", icon: "pi pi-fw pi-file", to: "/dataMedis/dokumen" },
            { label: "Tracer Rekam Medis", icon: "pi pi-fw pi-notes", to: "/dataMedis/tracer" },
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
      ],
    },
  ],
},
{
  label: "Fitur Dokter",
  items: [
    {
      label: "Menu",
      items: [
        { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/dashboarddokter" },
        { label: "Data Dokter", icon: "pi pi-fw pi-user", to: "/data" },
        { label: "Kalender Dokter", icon: "pi pi-fw pi-book", to: "/dokter/kalender_dokter" },
        { label: "Riwayat Pengobatan", icon: "pi pi-fw pi-folder-open", to: "/dokter/riwayat_pengobatan" },
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
    {
      label: "Menu",
      items: [
        { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/rawatjalan/dashboard" },
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
    {
      label: "Menu",
      items: [
        {
          label: "Ruangan",
          icon: "pi pi-fw pi-home",
          items: [
            { label: "Manajemen Bangsal", icon: "pi pi-fw pi-th-large", to: "/rawatinap/manajemen-bangsal" },
            { label: "Manajemen Kamar", icon: "pi pi-fw pi-table", to: "/rawatinap/manajemen-kamar" },
            { label: "Manajemen Bed", icon: "pi pi-fw pi-objects-column", to: "/rawatinap/manajemen-bed" },
          ],
        },
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
    {
      label: "Menu",
      items: [
        { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/kasir/dashboard" },
        { label: "Invoice & Pembayaran", 
          icon: "pi pi-fw pi-wallet",
          items: [
            { label: "Invoice", icon: "pi pi-fw pi-receipt", to: "/invoice" },
            { label: "Pembayaran", icon: "pi pi-fw pi-money-bill", to: "/pembayaran" },
          ],
        },
        { label: "Pembayaran Angsuran", icon: "pi pi-fw pi-credit-card", to: "/kasir/pembayaran-angsuran" },
        { label: "Deposit Pembayaran", icon: "pi pi-fw pi-wallet", to: "/kasir/deposit" },
        { label: "Cetak Invoice & Kwitansi", icon: "pi pi-fw pi-print", to: "/kasir/cetak-invoice" },
        { label: "Produk & Layanan", icon: "pi pi-fw pi-tags", to: "/kasir/produk-layanan" },
        { label: "Jenis Produk & Layanan", icon: "pi pi-fw pi-th-large", to: "/kasir/jenis-produk" },
        { label: "Metode Pembayaran", icon: "pi pi-fw pi-credit-card", to: "/metodePembayaran" },
        { label: "Bank Account", icon: "pi pi-fw pi-building", to: "/bankAccount" },
        { label: "Laporan Pembayaran", icon: "pi pi-fw pi-chart-bar", to: "/kasir/laporan-pembayaran" },
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
