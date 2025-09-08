import db from '../core/config/knex.js';

export const getAll = () =>
  db('tindakan_inap')
    .join('rawat_inap', 'tindakan_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('rawat_jalan', 'rawat_inap.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .join('tindakan_medis', 'tindakan_inap.IDTINDAKAN', 'tindakan_medis.IDTINDAKAN')
    .join('master_tenaga_medis', 'tindakan_inap.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'tindakan_inap.*',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      'tindakan_medis.NAMATINDAKAN',
      'master_tenaga_medis.NAMALENGKAP as NAMAPERAWAT'
    );


export const getById = (id) =>
  db('tindakan_inap')
    .where({ IDTINDAKANINAP: id })
    .first();

export const getByRawatInapId = (idRawatInap) =>
  db('tindakan_inap')
    .join('tindakan_medis', 'tindakan_inap.IDTINDAKAN', 'tindakan_medis.IDTINDAKAN')
    .join('master_tenaga_medis', 'tindakan_inap.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .where({ 'tindakan_inap.IDRAWATINAP': idRawatInap })
    .select(
      'tindakan_inap.*',
      'tindakan_medis.NAMATINDAKAN',
      'tindakan_medis.HARGA as HARGA_TINDAKAN',
      'master_tenaga_medis.NAMALENGKAP as NAMATENAGAMEDIS'
    );

    export const create = async (data) => {
      return db.transaction(async (trx) => {
    
        const [insertedId] = await trx('tindakan_inap').insert(data);
    
        await trx('tindakan_medis')
          .where({ IDTINDAKAN: data.IDTINDAKAN })
    
        return { status: 'success', message: 'Tindakan inap berhasil ditambahkan', id: insertedId };
      });
    };
    
    export const remove = async (id) => {
      return db.transaction(async (trx) => {
        const tindakanInap = await trx('tindakan_inap').where({ IDTINDAKANINAP: id }).first();
        if (!tindakanInap) {
          return { status: 'error', message: 'Data tindakan inap tidak ditemukan' };
        }
    
        await trx('tindakan_inap').where({ IDTINDAKANINAP: id }).delete();
    
        return { status: 'success', message: 'Data tindakan inap berhasil dihapus' };
      });
    };