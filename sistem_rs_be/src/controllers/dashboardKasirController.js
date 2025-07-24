import * as DashboardModel from '../models/dashboardKasirModel.js';

export const getDashboardKasir = async (req, res) => {
  try {
    const totalInvoice = await DashboardModel.getTotalInvoice();
    const totalPembayaran = await DashboardModel.getTotalPembayaran();
    const totalDeposit = await DashboardModel.getTotalDeposit();
    const totalDepositPenggunaan = await DashboardModel.getTotalDepositPenggunaan();
    const statusInvoice = await DashboardModel.getStatusInvoice();
    const statusDeposit = await DashboardModel.getStatusDeposit();

    const invoiceStatusMap = {
      LUNAS: 0,
      BELUM_LUNAS: 0,
    };
    statusInvoice.forEach((s) => {
      invoiceStatusMap[s.STATUS] = s.total;
    });

    const depositStatusMap = {
      AKTIF: 0,
      HABIS: 0,
      REFUND: 0,
    };
    statusDeposit.forEach((s) => {
      depositStatusMap[s.STATUS] = s.total;
    });

    res.status(200).json({
      totalInvoice: totalInvoice?.total || 0,
      totalPembayaran: totalPembayaran?.total || 0,
      totalDeposit: totalDeposit?.total || 0,
      totalDepositPenggunaan: totalDepositPenggunaan?.total || 0,
      statusInvoice: invoiceStatusMap,
      statusDeposit: depositStatusMap,
    });
  } catch (error) {
    console.error('Gagal ambil data dashboard kasir:', error);
    res.status(500).json({ message: 'Gagal mengambil data dashboard kasir' });
  }
};