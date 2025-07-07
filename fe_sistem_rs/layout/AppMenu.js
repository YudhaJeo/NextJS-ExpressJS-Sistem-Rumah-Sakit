/* eslint-disable @next/next/no-img-element */
import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";

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
              label: "Loket",
              icon: "pi pi-fw pi-ticket",
              to: "/master/loket",
            },
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
            {
              label: "Spesialisasi",
              icon: "pi pi-fw pi-stethoscope",
              to: "/master/spesialisasi",
            },
            {
              label: "Jenis Kunjungan",
              icon: "pi pi-fw pi-calendar",
              to: "/master/jenisKunjungan",
            },
            {
              label: "Tipe Pasien",
              icon: "pi pi-fw pi-users",
              to: "/master/tipePasien",
            },
            {
              label: "Jenis Identitas",
              icon: "pi pi-fw pi-id-card",
              to: "/master/jenisIdentitas",
            },
            {
              label: "Status Pembayaran",
              icon: "pi pi-fw pi-credit-card",
              to: "/master/statusPembayaran",
            },
            {
              label: "ICD 10",
              icon: "pi pi-fw pi-graduation-cap",
              to: "/master/icd10",
            },
            {
              label: "ICD 9",
              icon: "pi pi-fw pi-graduation-cap",
              to: "/master/icd9",
            },
            {
              label: "Jenis Tindakan",
              icon: "pi pi-fw pi-briefcase-medical",
              to: "/master/jenisTindakan",
            },
            {
              label: "Obat",
              icon: "pi pi-fw pi-medkit",
              to: "/master/Obat",
            },
            {
              label: "Suplier",
              icon: "pi pi-fw pi-truck",
              to: "/master/suplier",
            },
            {
              label: "Gudang",
              icon: "pi pi-fw pi-warehouse",
              to: "/master/gudang",
            },
            {
              label: "Satuan Obat",
              icon: "pi pi-fw pi-medkit",
              to: "/master/satuanObat",
            },
            {
              label: "Jenis Obat",
              icon: "pi pi-fw pi-medkit",
              to: "/master/jenisObat",
            },
            {
              label: "Jenis Kamar",
              icon: "pi pi-fw pi-bed",
              to: "/master/jeniskamar",
            },
            {
              label: "Jabatan",
              icon: "pi pi-fw pi-briefcase",
              to: "/master/jabatan",
            },
            {
              label: "Departemen",
              icon: "pi pi-fw pi-building",
              to: "/master/departemen",
            },
            {
              label: "Kategori Pengeluaran",
              icon: "pi pi-fw pi-tags",
              to: "/master/kategoriPengeluaran",
            },
            {
              label: "Satuan Barang",
              icon: "pi pi-fw pi-box",
              to: "/master/satuanBarang",
            },
            {
              label: "Metode Pembayaran",
              icon: "pi pi-fw pi-credit-card",
              to: "/master/metodePembayaran",
            },
            {
              label: "Bank Akun",
              icon: "pi pi-fw pi-bank",
              to: "/master/bank",
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
            {
              label: "Riwayat Kunjungan",
              icon: "pi pi-fw pi-history",
              to: "/pendaftaran/riwayatKunjungan",
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
              to: "/dataMedis/dokumen",
            },
            {
              label: "Entri SOAP",
              icon: "pi pi-fw pi-notes",
              to: "/dataMedis/soap",
            },
            {
              label: "Drawing Rekam Medis",
              icon: "pi pi-fw pi-pencil",
              to: "/dataMedis/tindakan",
            },
            {
              label: "Diagnosa Tindakan",
              icon: "pi pi-fw pi-stethoscope",
              to: "/dataMedis/diagnosaTindakan",
            },
            {
              label: "Riwayat Pengobatan",
              icon: "pi pi-fw pi-history",
              to: "/dataMedis/riwayatPengobatan",
            },
          ],
        },
      ],
    },
    {
      label: "Jadwal & Kalender",
      items: [
        {
          label: "Jadwal",
          icon: "pi pi-fw pi-calendar",
          items: [
            {
              label: "Jadwal Dokter",
              icon: "pi pi-fw pi-calendar",
              to: "/jadwal/jadwalDokter",
            },
            {
              label: "Kalender Libur",
              icon: "pi pi-fw pi-calendar-times",
              to: "/jadwal/kalenderLibur",
            },
          ],
        },
      ],
    },
    {
      label: "Komisi",
      items: [
        {
          label: "Komisi Dokter",
          icon: "pi pi-fw pi-money-bill",
        },
      ],
    },
    {
      label: "Farmasi",
      items: [
        {
          label: "Farmasi",
          icon: "pi pi-fw pi-folder-open",
          items: [
            {
              label: "POS Kasir",
              icon: "pi pi-fw pi-credit-card",
              to: "/farmasi/kasir",
            },
            {
              label: "Kalender Libur",
              icon: "pi pi-fw pi-calendar-times",
              to: "/farmasi/kalenderLibur",
            },
            {
              label: "Permintaan Obat",
              icon: "pi pi-fw pi-credit-card",
              to: "/farmasi/permintaanObat",
            },
            {
              label: "Stock Obat",
              icon: "pi pi-fw pi-calendar-times",
              to: "/farmasi/stockObat",
            },
            {
              label: "Laporan Farmasi",
              icon: "pi pi-fw pi-credit-card",
              to: "/farmasi/laporanFarmasi",
            },
          ],
        },
      ],
    },
    {
      label: "Rawat Inap",
      items: [
        {
          label: "Rawat Inap",
          icon: "pi pi-fw pi-folder-open",
          items: [
            {
              label: "Manajemen Kamar",
              icon: "pi pi-fw pi-calendar",
              to: "/rawatInap/manajemenKamar",
            },
            {
              label: "Tagihan & Pembayaran",
              icon: "pi pi-fw pi-calendar-times",
              to: "/rawatInap/tagihan",
            },
          ],
        },
      ],
    },
    {
      label: "Pemeriksaan Penunjang",
      items: [
        {
          label: "Pemeriksaan",
          icon: "pi pi-fw pi-folder-open",
          items: [
            {
              label: "Lab",
              icon: "pi pi-fw pi-flask",
              to: "/pemeriksaan/lab",
            },
            {
              label: "Radiologi",
              icon: "pi pi-fw pi-camera",
              to: "/pemeriksaan/radiologi",
            },
            {
              label: "Entri Hasil",
              icon: "pi pi-fw pi-file-edit",
              to: "/pemeriksaan/entriHasil",
            },
          ],
        },
      ],
    },
    {
      label: "Inventori",
      items: [
        {
          label: "Inventori",
          icon: "pi pi-fw pi-folder-open",
          items: [
            {
              label: "Inventori Barang",
              icon: "pi pi-fw pi-box",
              to: "/inventori/inventoriBarang",
            },
            {
              label: "Pengadaan Barang",
              icon: "pi pi-fw pi-truck",
              to: "/inventori/pengadaanBarang",
            },
            {
              label: "Stok Barang",
              icon: "pi pi-fw pi-archive",
              to: "/inventori/stokBarang",
            },
          ],
        },
      ],
    },
    {
      label: "SDM & Gaji",
      items: [
        {
          label: "SDM & GAJI",
          icon: "pi pi-fw pi-users",
          items: [
            {
              label: "Data Pegawai",
              icon: "pi pi-fw pi-user",
              to: "/pemeriksaan/dataPegawai",
            },
            {
              label: "Penggajian",
              icon: "pi pi-fw pi-money-bill",
              to: "/pemeriksaan/radiologi",
            },
          ],
        },
      ],
    },
    {
      label: "Keuangan",
      items: [
        {
          label: "Keuangan",
          icon: "pi pi-fw pi-wallet",
          items: [
            {
              label: "Transaksi",
              icon: "pi pi-fw pi-dollar",
              to: "/keuangan/transaksi",
            },
            {
              label: "Tagihan",
              icon: "pi pi-fw pi-file",
              to: "/keuangan/tagihan",
            },
            {
              label: "Pembayaran",
              icon: "pi pi-fw pi-credit-card",
              to: "/keuangan/pembayaran",
            },
            {
              label: "Invoice",
              icon: "pi pi-fw pi-file-invoice",
              to: "/keuangan/invoice",
            },
          ],
        },
      ],
    },
    {
      label: "Laporan",
      items: [
        {
          label: "Laporan",
          icon: "pi pi-fw pi-chart-bar",
          items: [
            {
              label: "Statistik Kunjungan",
              icon: "pi pi-fw pi-chart-line",
              to: "/laporan/statistikKunjungan",
            },
            {
              label: "Laporan RME",
              icon: "pi pi-fw pi-book",
              to: "/laporan/laporan",
            },
            {
              label: "Dashboard Eksekutif",
              icon: "pi pi-fw pi-chart-pie",
              to: "/laporan/dashboardEksekutif",
            },
          ],
        },
      ],
    },
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => (
          !item.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator" key={`separator-${i}`}></li>
          )
        ))}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;