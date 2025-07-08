import db from '../core/config/knex.js';

export async function generateNoInvoice(tanggalInvoice) {
  const trx = await db.transaction();

  try {
    const tanggal = tanggalInvoice.split('T')[0].replace(/-/g, '');

    const count = await trx('invoice')
      .whereRaw('DATE(TANGGALINVOICE) = ?', [tanggalInvoice.split('T')[0]])
      .count('IDINVOICE as total')
      .first();

    const nextNumber = String((count?.total || 0) + 1).padStart(3, '0');

    await trx.commit();

    return `INV-${tanggal}-${nextNumber}`;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}
