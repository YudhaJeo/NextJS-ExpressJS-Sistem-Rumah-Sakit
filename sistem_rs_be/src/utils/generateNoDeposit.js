import db from '../core/config/knex.js';

export async function generateNoDeposit(tanggalDeposit, trx) {
  const tanggal = tanggalDeposit.split('T')[0].replace(/-/g, '');
  const prefix = `DEP-${tanggal}-`;

  const lastDeposit = await trx('deposit')
    .where('NODEPOSIT', 'like', `${prefix}%`)
    .orderBy('NODEPOSIT', 'desc')
    .forUpdate() // lock row biar aman di transaksi
    .first();

  let nextNumber = 1;

  if (lastDeposit) {
    const lastNumber = parseInt(lastDeposit.NODEPOSIT.slice(-3), 10);
    nextNumber = lastNumber + 1;
  }

  const noDeposit = `${prefix}${String(nextNumber).padStart(3, '0')}`;
  return noDeposit;
}
