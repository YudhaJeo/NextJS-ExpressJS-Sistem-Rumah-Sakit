import db from '../core/config/knex.js';

export async function generateNoInvoice(tanggalInvoice, trx) {
  const tanggal = tanggalInvoice.split('T')[0].replace(/-/g, '');
  const prefix = `INV-${tanggal}-`;

  // Ambil invoice terakhir di tanggal itu dengan LOCK
  const lastInvoice = await trx('invoice')
    .where('NOINVOICE', 'like', `${prefix}%`)
    .orderBy('NOINVOICE', 'desc')
    .forUpdate() // 🔑 Lock baris sampai transaksi selesai
    .first();

  let nextNumber = 1;

  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.NOINVOICE.slice(-3), 10);
    nextNumber = lastNumber + 1;
  }

  const noInvoice = `${prefix}${String(nextNumber).padStart(3, '0')}`;
  return noInvoice;
}
