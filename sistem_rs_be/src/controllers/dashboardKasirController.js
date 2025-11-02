import * as DashboardModel from '../models/dashboardKasirModel.js';

export const getDashboardKasir = async (req, res) => {
  try {
    const totalInvoice = await DashboardModel.getTotalInvoice();
    const totalPembayaran = await DashboardModel.getTotalPembayaran();
    const totalDeposit = await DashboardModel.getTotalDeposit();
    const totalDepositPenggunaan = await DashboardModel.getTotalDepositPenggunaan();
    const totalAngsuran = await DashboardModel.getTotalAngsuran();
    const statusInvoice = await DashboardModel.getStatusInvoice();
    const statusDeposit = await DashboardModel.getStatusDeposit();
    const daftarInvoice = await DashboardModel.getDaftarInvoiceTerbaru();

    const invoiceStatusMap = {
      LUNAS: 0,
      BELUM_LUNAS: 0,
    };
    statusInvoice.forEach((s) => {
      const formattedStatus =
        s.STATUS === 'LUNAS'
          ? 'Lunas'
          : s.STATUS === 'BELUM_LUNAS'
          ? 'Belum Lunas'
          : s.STATUS;
      invoiceStatusMap[formattedStatus] = s.total;
    });

    const depositStatusMap = {
      AKTIF: 0,
      HABIS: 0,
      REFUND: 0,
    };
    statusDeposit.forEach((s) => {
      const formattedStatus =
        s.STATUS === 'AKTIF'
          ? 'Aktif'
          : s.STATUS === 'HABIS'
          ? 'Habis'
          : s.STATUS === 'REFUND'
          ? 'Refund'
          : s.STATUS;
      depositStatusMap[formattedStatus] = s.total;
    });

    const formattedDaftarInvoice = daftarInvoice.map((item) => ({
      ...item,
      status_pembayaran:
        item.status_pembayaran === 'LUNAS'
          ? 'Lunas'
          : item.status_pembayaran === 'BELUM_LUNAS'
          ? 'Belum Lunas'
          : item.status_pembayaran,
    }));

    res.status(200).json({
      totalInvoice: totalInvoice?.total || 0,
      totalPembayaran: totalPembayaran?.total || 0,
      totalDeposit: totalDeposit?.total || 0,
      totalDepositPenggunaan: totalDepositPenggunaan?.total || 0,
      totalAngsuran: totalAngsuran?.total || 0,
      statusInvoice: invoiceStatusMap,
      statusDeposit: depositStatusMap,
      transaksi: formattedDaftarInvoice,
    });
  } catch (error) {
    console.error('Gagal ambil data dashboard kasir:', error);
    res.status(500).json({ message: 'Gagal mengambil data dashboard kasir' });
  }
};