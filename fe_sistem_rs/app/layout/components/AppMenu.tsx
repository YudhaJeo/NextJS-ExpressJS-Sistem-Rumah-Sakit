export const AppMenu = [
  {
    label: "Home",
    items: [{ label: "Dashboard", icon: "pi pi-home", to: "/" }],
  },
  {
    label: "Master",
    items: [{ label: "Database Pasien", icon: "pi pi-users", to: "/pasien" }],
  },
  {
    label: "Pendaftaran",
    items: [
      { label: "Reservasi Pasien", icon: "pi pi-calendar", to: "/reservasi" },
      { label: "Pendaftaran Pasien", icon: "pi pi-user-plus", to: "/pendaftaran" },
    ],
  },
  {
    label: "Rekam Medis",
    items: [
      { label: "File Dokumen", icon: "pi pi-file", to: "/file-dokumen" },
      { label: "Tracer Rekam Medis", icon: "pi pi-search", to: "/tracer" },
    ],
  },
  {
    label: "Laporan/Reporting",
    items: [
      { label: "Report Pendaftaran Pasien", icon: "pi pi-book", to: "/report/pendaftaran" },
      { label: "Report Statistik Kunjungan", icon: "pi pi-chart-bar", to: "/report/statistik" },
      { label: "Rekap Kunjungan", icon: "pi pi-file-edit", to: "/report/rekap" },
      { label: "Histori Semua Transaksi", icon: "pi pi-history", to: "/report/histori" },
    ],
  },
];
