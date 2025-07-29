import db from '../core/config/knex.js';

export async function generateNoAngsuran(tanggalBayar, trx) {
  const tanggal = tanggalBayar.split('T')[0].replace(/-/g, '');
  const prefix = `ANGS-${tanggal}-`;

  const last = await trx('angsuran')
    .where('NOANGSURAN', 'like', `${prefix}%`)
    .orderBy('NOANGSURAN', 'desc')
    .forUpdate()
    .first();

  let nextNumber = 1;
  if (last) {
    const lastNumber = parseInt(last.NOANGSURAN.slice(-3), 10);
    nextNumber = lastNumber + 1;
  }

  const noAngsuran = `${prefix}${String(nextNumber).padStart(3, '0')}`;
  return noAngsuran;
}