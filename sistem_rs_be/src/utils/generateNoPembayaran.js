import db from '../core/config/knex.js';

export async function generateNoPembayaran(tanggalBayar, trx) {
  const tanggal = tanggalBayar.split('T')[0].replace(/-/g, '');
  const prefix = `PAY-${tanggal}-`;

  const lastPembayaran = await trx('pembayaran')
    .where('NOPEMBAYARAN', 'like', `${prefix}%`)
    .orderBy('NOPEMBAYARAN', 'desc')
    .forUpdate() 
    .first();

  let nextNumber = 1;

  if (lastPembayaran) {
    const lastNumber = parseInt(lastPembayaran.NOPEMBAYARAN.slice(-3), 10);
    nextNumber = lastNumber + 1;
  }

  const noPembayaran = `${prefix}${String(nextNumber).padStart(3, '0')}`;
  return noPembayaran;
}