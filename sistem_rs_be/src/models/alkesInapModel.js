import db from '../core/config/knex.js';

export const getAll = () =>
  db('alkes_inap')
    .join('rawat_inap', 'alkes_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('rawat_jalan', 'rawat_inap.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .join('alkes', 'alkes_inap.IDALKES', 'alkes.IDALKES')
    .join('master_tenaga_medis', 'alkes_inap.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'alkes_inap.*',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      'alkes.NAMAALKES',
      'master_tenaga_medis.NAMALENGKAP as NAMAPERAWAT'
    );


export const getById = (id) =>
  db('alkes_inap')
    .where({ IDALKESINAP: id })
    .first();

export const getByRawatInapId = (idRawatInap) =>
  db('alkes_inap')
    .join('alkes', 'alkes_inap.IDALKES', 'alkes.IDALKES')
    .join('master_tenaga_medis', 'alkes_inap.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .where({ 'alkes_inap.IDRAWATINAP': idRawatInap })
    .select(
      'alkes_inap.*',
      'alkes.NAMAALKES',
      'alkes.HARGAJUAL as HARGA_ALKES',
      'master_tenaga_medis.NAMALENGKAP as NAMATENAGAMEDIS'
    );

    export const create = async (data) => {
      return db.transaction(async (trx) => {
        const alkes = await trx('alkes')
          .where({ IDALKES: data.IDALKES })
          .select('STOK')
          .first();
    
        if (!alkes) {
          return { status: 'error', message: 'Alkes tidak ditemukan' };
        }
    
        if (alkes.STOK <= 0) {
          return { status: 'error', message: 'Stok alkes kosong, tidak bisa ditambahkan ke alkes inap' };
        }
    
        if (alkes.STOK < data.JUMLAH) {
          return { status: 'error', message: `Stok alkes hanya tersisa ${alkes.STOK}, tidak mencukupi` };
        }
    
        const [insertedId] = await trx('alkes_inap').insert(data);
    
        await trx('alkes')
          .where({ IDALKES: data.IDALKES })
          .decrement('STOK', data.JUMLAH);
    
        return { status: 'success', message: 'Alkes inap berhasil ditambahkan', id: insertedId };
      });
    };
    
    export const remove = async (id) => {
      return db.transaction(async (trx) => {
        const alkesInap = await trx('alkes_inap').where({ IDALKESINAP: id }).first();
        if (!alkesInap) {
          return { status: 'error', message: 'Data alkes inap tidak ditemukan' };
        }
    
        await trx('alkes_inap').where({ IDALKESINAP: id }).delete();
    
        await trx('alkes')
          .where({ IDALKES: alkesInap.IDALKES })
          .increment('STOK', alkesInap.JUMLAH);
    
        return { status: 'success', message: 'Data alkes inap berhasil dihapus' };
      });
    };