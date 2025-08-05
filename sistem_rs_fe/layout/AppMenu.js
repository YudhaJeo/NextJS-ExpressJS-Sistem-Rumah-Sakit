import React, { useContext, useState, useEffect } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import Cookies from "js-cookie";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const [userRole, setUserRole] = useState(null);
  const [unitKerja, setUnitKerja] = useState(null);

  useEffect(() => {
    const roleFromCookies = Cookies.get("role");
    const unitKerjaFromCookies = Cookies.get("unitKerja");
    setUserRole(roleFromCookies);
    setUnitKerja(unitKerjaFromCookies);
  }, []);

  if (!userRole) return null;

  let model = [];

  if (userRole === "Super Admin") {
    model = [
      {
        label: "dashboard",
        items: [
          { label: "Dashboard Utama", icon: "pi pi-fw pi-chart-bar", to: "/" },
        ],
      },
      {
        label: "Antrian",
        icon: "pi pi-fw pi-list",
        items: [
          { label: "Antrian Pendaftaran", icon: "pi pi-fw pi-users", to: "/antrian/data" },
          { label: "Antrian Poli", icon: "pi pi-fw pi-users", to: "/antrian/antrian_poli" },
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
              { label: "Jadwal Dokter", icon: "pi pi-fw pi-graduation-cap", to: "/master/dokter" },
              { label: "Role", icon: "pi pi-fw pi-users", to: "/master/role" },
              { label: "Tenaga Medis", icon: "pi pi-fw pi-users", to: "/master/tenaga_medis" },
              { label: "Tenaga Non Medis", icon: "pi pi-fw pi-users", to: "/master/tenaga_non_medis" },
            ],
          },
        ],
      },
      {
        label: "Fitur Pasien",
        items: [
          { label: "Dashboard Pasien", icon: "pi pi-fw pi-chart-bar", to: "/dashboard" },
          {
            label: "Master",
            items: [
              { label: "Pasien", icon: "pi pi-fw pi-user", to: "/pasien" },
            ],
          },
          {
            label: "Menu",
            items: [
              {
                label: "Pendaftaran Pasien",
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
                  { label: "File Dokumen", icon: "pi pi-fw pi-file", to: "/rekam_medis/dokumen" },
                  { label: "Tracer Rekam Medis", icon: "pi pi-fw pi-notes", to: "/rekam_medis/tracer" },
                ],
              },
              {
                label: "Laporan",
                icon: "pi pi-fw pi-chart-bar",
                items: [
                  { label: "Statistik Kunjungan", icon: "pi pi-fw pi-chart-line", to: "/laporan/statistik_kunjungan" },
                  { label: "Rekap Kunjungan", icon: "pi pi-fw pi-file-check", to: "/laporan/rekap_kunjungan" },
                  { label: "Histori Transaksi", icon: "pi pi-fw pi-history", to: "/laporan/histori_transaksi" },
                ],
              },
              { label: "Riwayat Kunjungan", icon: "pi pi-fw pi-history", to: "/riwayat_kunjungan" },
            ],
          },
        ],
      },
      {
        label: "Fitur Dokter",
        items: [
          { label: "Dashboard Dokter", icon: "pi pi-fw pi-chart-bar", to: "/dashboard_dokter" },
          {
            label: "Menu",
            items: [
              { label: "Kalender Dokter", icon: "pi pi-fw pi-book", to: "/kalender_dokter" },
              { label: "Riwayat Pengobatan", icon: "pi pi-fw pi-folder-open", to: "/riwayat_pengobatan" },
              { label: "Manajemen Komisi", icon: "pi pi-fw pi-money-bill", to: "/manajemen_komisi" },
              {
                label: "Laporan",
                icon: "pi pi-fw pi-chart-bar",
                items: [
                  { label: "Laporan dan Transaksi", icon: "pi pi-fw pi-file", to: "/laporan_komisi" },
                  { label: "Entri Drawing Rekam Medis", icon: "pi pi-fw pi-pencil", to: "/entri_rm" },
                  { label: "Drawing Rekam Medis", icon: "pi pi-fw pi-image", to: "/drawing_rm" },
                  { label: "Histori Transaksi", icon: "pi pi-fw pi-history", to: "/histori_transaksi" },
                ],
              },
            ],
          },
        ],
      },
      {
        label: "Fitur Rawat Jalan",
        items: [
          { label: "Dashboard Rawat Jalan", icon: "pi pi-fw pi-home", to: "/rawat_jalan/dashboard" },
          {
            label: "Menu",
            items: [
              { label: "Tindakan & Layanan Medis", icon: "pi pi-fw pi-heart", to: "/rawat_jalan/tindakan_layanan" },
              { label: "Resep Obat", icon: "pi pi-fw pi-briefcase", to: "/rawat_jalan/resep" },
              { label: "Perjanjian", icon: "pi pi-fw pi-calendar-plus", to: "/rawat_jalan/perjanjian" },
              { label: "Kalender Perjanjian", icon: "pi pi-fw pi-calendar", to: "/rawat_jalan/kalender_perjanjian" },
              { label: "Riwayat Perjanjian", icon: "pi pi-fw pi-history", to: "/rawat_jalan/riwayat_perjanjian" },
              { label: "Kalender Ruangan", icon: "pi pi-fw pi-building", to: "/rawat_jalan/kalender_ruangan" },
              { label: "Riwayat Pasien", icon: "pi pi-fw pi-users", to: "/rawat_jalan/riwayat_pasien" },
              { label: "Laporan Tindakan Medis", icon: "pi pi-fw pi-file", to: "/rawat_jalan/laporan_tindakan" },
              { label: "Cetak Rekam Medis", icon: "pi pi-fw pi-print", to: "/rawat_jalan/cetak_rm" },
              { label: "Resep Obat Pasien", icon: "pi pi-fw pi-book-medical", to: "/rawat_jalan/resep_pasien" },
              { label: "Report Resep Pasien", icon: "pi pi-fw pi-chart-bar", to: "/rawat_jalan/report_resep" },
            ],
          },
        ],
      },
      {
        label: "Fitur Rawat Inap",
        items: [
          { label: "Dashboard Rawat Inap", icon: "pi pi-fw pi-chart-bar", to: "/rawat_inap" },
          {
            label: "Master",
            items: [
              { label: "Tindakan Medis", icon: "pi pi-fw pi-heart", to: "/rawat_inap/master/tindakan_medis" },
              { label: "Jenis Bangsal", icon: "pi pi-fw pi-tag", to: "/rawat_inap/master/jenis_bangsal" },
              { label: "Manajemen Bangsal", icon: "pi pi-fw pi-th-large", to: "/rawat_inap/master/manajemen_bangsal" },
              { label: "Manajemen Kamar", icon: "pi pi-fw pi-table", to: "/rawat_inap/master/manajemen_kamar" },
            ],
          },
          {
            label: "Menu",
            items: [
              { label: "Manajemen Bed", icon: "pi pi-fw pi-objects-column", to: "/rawat_inap/menu/manajemen_bed" },
              { label: "Rawat Inap", icon: "pi pi-fw pi-heart", to: "/rawat_inap/menu/rawat_inap" },
              { label: "Obat Inap", icon: "pi pi-fw pi-briefcase", to: "/rawat_inap/menu/obat_inap" },
              { label: "Tindakan Medis Inap", icon: "pi pi-fw pi-link", to: "/rawat_inap/menu/tindakan_inap" },
              { label: "Tagihan Sementara", icon: "pi pi-fw pi-money-bill", to: "/rawat_inap/menu/tagihan_sementara" },
              { label: "Riwayat Rawat Inap", icon: "pi pi-fw pi-users", to: "/rawat_inap/menu/riwayat_inap" },
            ],
          },
        ],
      },
      {
        label: "Apotek & Farmasi",
        items: [
          { label: "Dashboard Apotek", icon: "pi pi-fw pi-chart-bar", to: "/dashboard" },
          {
            label: "Master",
            items: [
              { label: "Daftar Obat", icon: "pi pi-fw pi-database", to: "/daftar_obat" },
              { label: "Alat Kesehatan", icon: "pi pi-fw pi-briefcase", to: "/alkes" },
              { label: "Supplier", icon: "pi pi-fw pi-user", to: "/supplier" },
              
              
            ],
          },
          {
            label: "Menu",
            items: [
              { label: "Kartu Stock", icon: "pi pi-fw pi-bars", to: "/kartu_stock" },
              { label: "First Expired First Out", icon: "pi pi-fw pi-chart-line", to: "/FEFO" },
              { label: "Order Pengambilan Obat", icon: "pi pi-fw pi-history", to: "/order_pengambilan_obat" },
              { label: "Penjualan/POS Kasir", icon: "pi pi-fw pi-shopping-cart", to: "/penjualan" },
            ],
          },
          {
            label: "Laporan",
            items: [
              // { label: "Penjualan Obat", icon: "pi pi-fw pi-shopping-cart", to: "/apotek/penjualan" },
              // { label: "Pembelian Obat", icon: "pi pi-fw pi-dollar", to: "/apotek/pembelian" },
              // { label: "Retur Obat", icon: "pi pi-fw pi-undo", to: "/apotek/retur" },
              { label: "Laporan Penjualan", icon: "pi pi-fw pi-chart-bar", to: "/apotek/laporan_penjualan_obat" },
              // { label: "Laporan Pembelian", icon: "pi pi-fw pi-chart-bar", to: "/apotek/laporan_pembelian" },
            ],
          },
        ],
      },
      {
        label: "Fitur Kasir & Sales",
        items: [
          { label: "Dashboard Kasir", icon: "pi pi-fw pi-chart-bar", to: "/dashboard_kasir" },
          {
            label: "Master",
            items: [
              { label: "Bank Account", icon: "pi pi-fw pi-building", to: "/bank_account" },
              { label: "Metode Pembayaran", icon: "pi pi-fw pi-credit-card", to: "/metode_pembayaran" },
            ],
          },
          {
            label: "Menu",
            items: [
              {
                label: "Invoice & Pembayaran",
                icon: "pi pi-fw pi-wallet",
                items: [
                  { label: "Invoice", icon: "pi pi-fw pi-receipt", to: "/invoice" },
                  { label: "Pembayaran", icon: "pi pi-fw pi-money-bill", to: "/pembayaran" },
                ],
              },
              { label: "Pembayaran Angsuran", icon: "pi pi-fw pi-credit-card", to: "/pembayaran_angsuran" },
              {
                label: "Deposit Pembayaran",
                icon: "pi pi-fw pi-wallet",
                items: [
                  { label: "Deposit", icon: "pi pi-fw pi-money-bill", to: "/deposit" },
                  { label: "Deposit Penggunaan", icon: "pi pi-fw pi-money-bill", to: "/deposit_penggunaan" },
                ],
              },
              { label: "Cetak Invoice & Kwitansi", icon: "pi pi-fw pi-print", to: "/cetak_invoice" },
              { label: "Laporan Pembayaran", icon: "pi pi-fw pi-chart-bar", to: "/laporan_pembayaran" },
            ],
          },
        ],
      },
    ];
  } else if (userRole === "Dokter") {
    model = [
      {
        label: "Fitur Dokter",
        items: [
          { label: "Dashboard Dokter", icon: "pi pi-fw pi-chart-bar", to: "/dashboard_dokter" },
          {
            label: "Menu",
            items: [
              { label: "Kalender Dokter", icon: "pi pi-fw pi-book", to: "/kalender_dokter" },
              { label: "Riwayat Pengobatan", icon: "pi pi-fw pi-folder-open", to: "/riwayat_pengobatan" },
              { label: "Manajemen Komisi", icon: "pi pi-fw pi-money-bill", to: "/manajemen_komisi" },
              {
                label: "Laporan",
                icon: "pi pi-fw pi-chart-bar",
                items: [
                  { label: "Laporan Komisi", icon: "pi pi-fw pi-file", to: "/laporan_komisi" },
                  { label: "Entri Rekam Medis", icon: "pi pi-fw pi-pencil", to: "/entri_rm" },
                  { label: "Drawing Rekam Medis", icon: "pi pi-fw pi-image", to: "/drawing_rm" },
                  { label: "Histori Transaksi", icon: "pi pi-fw pi-history", to: "/histori_transaksi" },
                ],
              },
            ],
          },
        ],
      },
    ];
  } else if (userRole === "Perawat") {
    model = [
      {
        label: "Antrian",
        icon: "pi pi-fw pi-list",
        items: [
          { label: "Antrian Poli", icon: "pi pi-fw pi-users", to: "/antrian/antrian_poli" },
        ],
      },
      {
        label: "Fitur Dokter",
        items: [
          { label: "Dashboard Dokter", icon: "pi pi-fw pi-chart-bar", to: "/dashboard_dokter" },
          {
            label: "Menu",
            items: [
              { label: "Kalender Dokter", icon: "pi pi-fw pi-book", to: "/kalender_dokter" },
              { label: "Riwayat Pengobatan", icon: "pi pi-fw pi-folder-open", to: "/riwayat_pengobatan" },
            ],
          },
        ],
      },
    ];
  } else if (userRole === "Kasir") {
    model = [
      {
        label: "Fitur Kasir & Sales",
        items: [
          { label: "Dashboard Kasir", icon: "pi pi-fw pi-chart-bar", to: "/dashboard_kasir" },
          {
            label: "Master",
            items: [
              { label: "Bank Account", icon: "pi pi-fw pi-building", to: "/bank_account" },
              { label: "Metode Pembayaran", icon: "pi pi-fw pi-credit-card", to: "/metode_pembayaran" },
            ],
          },
          {
            label: "Menu",
            items: [
              {
                label: "Invoice & Pembayaran",
                icon: "pi pi-fw pi-wallet",
                items: [
                  { label: "Invoice", icon: "pi pi-fw pi-receipt", to: "/invoice" },
                  { label: "Pembayaran", icon: "pi pi-fw pi-money-bill", to: "/pembayaran" },
                ],
              },
              { label: "Pembayaran Angsuran", icon: "pi pi-fw pi-credit-card", to: "/pembayaran_angsuran" },
              {
                label: "Deposit Pembayaran",
                icon: "pi pi-fw pi-wallet",
                items: [
                  { label: "Deposit", icon: "pi pi-fw pi-money-bill", to: "/deposit" },
                  { label: "Deposit Penggunaan", icon: "pi pi-fw pi-money-bill", to: "/deposit_penggunaan" },
                ],
              },
              { label: "Cetak Invoice & Kwitansi", icon: "pi pi-fw pi-print", to: "/cetak_invoice" },
              { label: "Laporan Pembayaran", icon: "pi pi-fw pi-chart-bar", to: "/laporan_pembayaran" },
            ],
          },
        ],
      },
    ];
  }

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