import db from '../core/config/knex.js';

export const getTotalInvoice = async () => {
  try {
    return await db('invoice').count('IDINVOICE as total').first();
  } catch (error) {
    console.error('Error getTotalInvoice:', error);
    throw error;
  }
};

export const getTotalPembayaran = async () => {
  try {
    return await db('pembayaran').count('IDPEMBAYARAN as total').first();
  } catch (error) {
    console.error('Error getTotalPembayaran:', error);
    throw error;
  }
};

export const getTotalDeposit = async () => {
  try {
    return await db('deposit').count('IDDEPOSIT as total').first();
  } catch (error) {
    console.error('Error getTotalDeposit:', error);
    throw error;
  }
};

export const getTotalDepositPenggunaan = async () => {
  try {
    return await db('deposit_penggunaan').count('IDPENGGUNAAN as total').first();
  } catch (error) {
    console.error('Error getTotalDepositPenggunaan:', error);
    throw error;
  }
};

export const getTotalAngsuran = async () => {
  try {
    return await db('angsuran').count('IDANGSURAN as total').first();
  } catch (error) {
    console.error('Error getTotalAngsuran:', error);
    throw error;
  }
};

export const getStatusInvoice = async () => {
  try {
    return await db('invoice')
      .select('STATUS')
      .count('IDINVOICE as total')
      .groupBy('STATUS');
  } catch (error) {
    console.error('Error getStatusInvoice:', error);
    throw error;
  }
};

export const getStatusDeposit = async () => {
  try {
    return await db('deposit')
      .select('STATUS')
      .count('IDDEPOSIT as total')
      .groupBy('STATUS');
  } catch (error) {
    console.error('Error getStatusDeposit:', error);
    throw error;
  }
};

export const getDaftarInvoiceTerbaru = async () => {
  try {
    return await db('invoice')
      .join('pasien', 'invoice.NIK', 'pasien.NIK')
      .select(
        'invoice.NOINVOICE as nomor_invoice',
        'pasien.NAMALENGKAP as nama_pasien',
        'invoice.TANGGALINVOICE as tanggal',
        'invoice.TOTALTAGIHAN as total',
        'invoice.STATUS as status_pembayaran'
      )
      .orderBy('invoice.TANGGALINVOICE', 'desc')
      .limit(5);
  } catch (error) {
    console.error('Error getDaftarInvoiceTerbaru:', error);
    throw error;
  }
};