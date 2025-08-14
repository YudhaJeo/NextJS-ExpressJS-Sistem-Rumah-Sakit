import db from '../core/config/knex.js';

export const getAll = () =>
  db('rawat_inap')
    .join('rawat_jalan', 'rawat_inap.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('poli as pl', 'pendaftaran.IDPOLI', 'pl.IDPOLI')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .join('kamar', 'bed.IDKAMAR', 'kamar.IDKAMAR')
    .join('bangsal', 'kamar.IDBANGSAL', 'bangsal.IDBANGSAL')
    .join('jenis_bangsal', 'bangsal.IDJENISBANGSAL', 'jenis_bangsal.IDJENISBANGSAL')
    .select(
      'rawat_inap.*',
      'pasien.NIK as PASIEN_NIK',
      'pasien.NAMALENGKAP',
      'pasien.USIA',
      'pasien.JENISKELAMIN',
      'pasien.ALAMAT as ALAMAT_PASIEN',
      'pl.NAMAPOLI as POLI',
      'bed.NOMORBED',
      'kamar.NAMAKAMAR',
      'bangsal.NAMABANGSAL',
      'jenis_bangsal.NAMAJENIS',
      'jenis_bangsal.HARGAPERHARI',
      'rawat_jalan.DIAGNOSA'
    )

    export const getAllAktif = () =>
      db('rawat_inap')
        .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
        .join('kamar', 'bed.IDKAMAR', 'kamar.IDKAMAR')
        .join('bangsal', 'kamar.IDBANGSAL', 'bangsal.IDBANGSAL')
        .join('jenis_bangsal', 'bangsal.IDJENISBANGSAL', 'jenis_bangsal.IDJENISBANGSAL')
        .select(
          'rawat_inap.IDRAWATINAP',
          'rawat_inap.TANGGALMASUK',
          'rawat_inap.TANGGALKELUAR',
          'jenis_bangsal.HARGAPERHARI'
        )
        .where('rawat_inap.STATUS', 'AKTIF'); 
    

export const updateTotalKamar = (id, totalKamar) =>
  db('rawat_inap')
    .where({ IDRAWATINAP: id })
    .update({ TOTALKAMAR: totalKamar, UPDATED_AT: db.fn.now() });


export const getById = (id) =>
  db('rawat_inap')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .select('rawat_inap.*', 'bed.NOMORBED')
    .where('rawat_inap.IDRAWATINAP', id)
    .first();

export const create = async (data) => {
  const { IDRAWATJALAN, IDBED, TANGGALMASUK, TANGGALKELUAR, CATATAN } = data;

  const harga = await db('bed')
    .join('kamar', 'bed.IDKAMAR', 'kamar.IDKAMAR')
    .join('bangsal', 'kamar.IDBANGSAL', 'bangsal.IDBANGSAL')
    .join('jenis_bangsal', 'bangsal.IDJENISBANGSAL', 'jenis_bangsal.IDJENISBANGSAL')
    .where('bed.IDBED', IDBED)
    .select('jenis_bangsal.HARGAPERHARI')
    .first();

  const tanggalMasuk = new Date(TANGGALMASUK);
  const tanggalKeluar = TANGGALKELUAR ? new Date(TANGGALKELUAR) : null;

  let totalHarga = null;
  let status = 'AKTIF';

  if (tanggalKeluar) {
    const durasi = Math.max(
      1,
      Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24))
    );
    totalHarga = harga.HARGAPERHARI * durasi;
    status = 'SELESAI';
  }

  await db('rawat_inap').insert({
    IDRAWATJALAN,
    IDBED,
    TANGGALMASUK,
    TANGGALKELUAR,
    STATUS: status,
    TOTALKAMAR: totalHarga,
    CATATAN,
  });

  await db('bed').where({ IDBED }).update({ STATUS: 'TERISI' });

  return true;
};

export const update = async (id, data) => {
  const { TANGGALMASUK, TANGGALKELUAR, IDBED, CATATAN } = data;

  const rawat = await db('rawat_inap').where({ IDRAWATINAP: id }).first();
  const oldBedId = rawat.IDBED;
  const newBedId = IDBED || rawat.IDBED;
  const tanggalMasuk = new Date(TANGGALMASUK || rawat.TANGGALMASUK);
  const tanggalKeluar = TANGGALKELUAR ? new Date(TANGGALKELUAR) : null;

  let totalHarga = null;
  let status = 'AKTIF';

  if (tanggalKeluar) {
    const harga = await db('bed')
      .join('kamar', 'bed.IDKAMAR', 'kamar.IDKAMAR')
      .join('bangsal', 'kamar.IDBANGSAL', 'bangsal.IDBANGSAL')
      .join('jenis_bangsal', 'bangsal.IDJENISBANGSAL', 'jenis_bangsal.IDJENISBANGSAL')
      .where('bed.IDBED', newBedId)
      .select('jenis_bangsal.HARGAPERHARI')
      .first();

    const durasi = Math.max(1, Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24)));
    totalHarga = harga.HARGAPERHARI * durasi;
    status = 'SELESAI';
  }

  const updateData = {
    TANGGALMASUK: tanggalMasuk,
    TANGGALKELUAR: tanggalKeluar,
    STATUS: status,
    TOTALKAMAR: totalHarga,
    CATATAN,
    UPDATED_AT: db.fn.now(),
  };

  if (IDBED && IDBED !== oldBedId) {
    updateData.IDBED = IDBED;
  }

  await db('rawat_inap')
    .where({ IDRAWATINAP: id })
    .update(updateData);

  const updatedRawat = await db('rawat_inap').where({ IDRAWATINAP: id }).first();

  if (oldBedId !== newBedId) {
    if (oldBedId) {
      await db('bed').where({ IDBED: oldBedId }).update({ STATUS: 'TERSEDIA' });
    }
    
    if (newBedId) {
      await db('bed').where({ IDBED: newBedId }).update({ STATUS: 'TERISI' });
    }
  } else {
    if (status === 'SELESAI') {
      await db('bed').where({ IDBED: newBedId }).update({ STATUS: 'TERSEDIA' });
    } else {
      await db('bed').where({ IDBED: newBedId }).update({ STATUS: 'TERISI' });
    }
  }

  return updatedRawat;
};


export const remove = async (id) => {
  const rawat = await db('rawat_inap').where({ IDRAWATINAP: id }).first();
  if (rawat?.IDBED) {
    await db('bed').where({ IDBED: rawat.IDBED }).update({ STATUS: 'TERSEDIA' });
  }
  return db('rawat_inap').where({ IDRAWATINAP: id }).delete();
};

export const updateBedStatus = (id, status) =>
  db('bed').where({ IDBED: id }).update({ STATUS: status });

export const getTotalObatInap = async (IDRAWATINAP) => {
  const result = await db('obat_inap')
    .where({ IDRAWATINAP })
    .sum('TOTAL as total');
  return result[0];
};

export const getTotalTindakanInap = async (IDRAWATINAP) => {
  const result = await db('tindakan_inap')
    .where({ IDRAWATINAP })
    .sum('TOTAL as total');
  return result[0];
};
