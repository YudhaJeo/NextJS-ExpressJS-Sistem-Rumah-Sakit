import db from '../core/config/knex.js';

export const getAll = () =>
  db('obat_inap')
    .join('rawat_inap', 'obat_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('rawat_jalan', 'rawat_inap.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .join('obat', 'obat_inap.IDOBAT', 'obat.IDOBAT')
    .join('master_tenaga_medis', 'obat_inap.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'obat_inap.*',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      'obat.NAMAOBAT',
      'master_tenaga_medis.NAMALENGKAP as NAMAPERAWAT'
    );


export const getById = (id) =>
  db('obat_inap')
    .where({ IDOBATINAP: id })
    .first();

export const getByRawatInapId = (idRawatInap) =>
  db('obat_inap')
    .join('obat', 'obat_inap.IDOBAT', 'obat.IDOBAT')
    .join('master_tenaga_medis', 'obat_inap.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .where({ 'obat_inap.IDRAWATINAP': idRawatInap })
    .select(
      'obat_inap.*',
      'obat.NAMAOBAT',
      'obat.HARGAJUAL as HARGA_OBAT',
      'master_tenaga_medis.NAMALENGKAP as NAMATENAGAMEDIS'
    );

export const create = async (data) => {
  return db.transaction(async (trx) => {
    const obat = await trx('obat')
      .where({ IDOBAT: data.IDOBAT })
      .select('STOK')
      .first();

    if (!obat) {
      return { status: 'error', message: 'Obat tidak ditemukan' };
    }

    if (obat.STOK <= 0) {
      return { status: 'error', message: 'Stok obat kosong, tidak bisa ditambahkan ke obat inap' };
    }

    if (obat.STOK < data.JUMLAH) {
      return { status: 'error', message: `Stok obat hanya tersisa ${obat.STOK}, tidak mencukupi` };
    }

    const [insertedId] = await trx('obat_inap').insert(data);

    await trx('obat')
      .where({ IDOBAT: data.IDOBAT })
      .decrement('STOK', data.JUMLAH);

    return { status: 'success', message: 'Obat inap berhasil ditambahkan', id: insertedId };
  });
};

export const remove = async (id) => {
  return db.transaction(async (trx) => {
    const obatInap = await trx('obat_inap').where({ IDOBATINAP: id }).first();
    if (!obatInap) {
      return { status: 'error', message: 'Data obat inap tidak ditemukan' };
    }

    await trx('obat_inap').where({ IDOBATINAP: id }).delete();

    await trx('obat')
      .where({ IDOBAT: obatInap.IDOBAT })
      .increment('STOK', obatInap.JUMLAH);

    return { status: 'success', message: 'Data obat inap berhasil dihapus' };
  });
};