import db from '../core/config/knex.js';

export const createPenjualan = async (data, detail) => {
  const [id] = await db('penjualan').insert(data).returning('IDPENJUALAN');
  const detailData = detail.map((item) => ({
    ...item,
    IDPENJUALAN: id,
  }));
  await db('penjualan_detail').insert(detailData);
  return id;
};

export const getPenjualanByOrder = async (idorder) => {
  return await db('penjualan')
    .where('IDORDER', idorder)
    .first();
};

export const getPenjualan = async () => {
  return await db('penjualan as p')
    .join('order_pengambilan_header as o', 'p.IDORDER', 'o.IDORDER')
    .join('pasien as ps', 'o.IDPASIEN', 'ps.IDPASIEN')
    .select('p.*', 'ps.NAMAPASIEN');
};
