import db from '../core/config/knex.js';

export async function getAllDokter() {
  const rows = await db('dokter')
    .leftJoin('jadwal_dokter', 'dokter.IDDOKTER', 'jadwal_dokter.IDDOKTER')
    .leftJoin('poli', 'dokter.IDPOLI', 'poli.IDPOLI')
    .select(
      'dokter.IDDOKTER',
      'dokter.NAMADOKTER',
      'dokter.IDPOLI',
      'poli.NAMAPOLI',
      'jadwal_dokter.HARI',
      'jadwal_dokter.JAM_MULAI',
      'jadwal_dokter.JAM_SELESAI'
    );

  const result = {};
  rows.forEach((row) => {
    if (!result[row.IDDOKTER]) {
      result[row.IDDOKTER] = {
        IDDOKTER: row.IDDOKTER,
        NAMADOKTER: row.NAMADOKTER,
        IDPOLI: row.IDPOLI,
        NAMAPOLI: row.NAMAPOLI,
        JADWALPRAKTEK: [],
      };
    }

    if (row.HARI && row.JAM_MULAI && row.JAM_SELESAI) {
      result[row.IDDOKTER].JADWALPRAKTEK.push(
        `${row.HARI} ${row.JAM_MULAI.slice(0, 5)} - ${row.JAM_SELESAI.slice(0, 5)}`
      );
    }
  });

  return Object.values(result).map((d) => ({
    ...d,
    JADWALPRAKTEK: d.JADWALPRAKTEK.join(', ')
  }));
}

export const getDokterById = async (id) => {
    const dokter = await db('dokter').where('IDDOKTER', id).first();
    const jadwal = await db('jadwal_dokter').where('IDDOKTER', id);
    return dokter ? { ...dokter, JADWAL: jadwal } : null;
};

export const createDokter = async ({ NAMADOKTER, IDPOLI, JADWAL }) => {
    const [IDDOKTER] = await db('dokter').insert({ NAMADOKTER, IDPOLI });
    const jadwalData = JADWAL.map((j) => ({ ...j, IDDOKTER }));
    await db('jadwal_dokter').insert(jadwalData);
};

export const updateDokter = async (id, { NAMADOKTER, IDPOLI, JADWAL }) => {
    await db('dokter').where('IDDOKTER', id).update({ NAMADOKTER, IDPOLI });
    await db('jadwal_dokter').where('IDDOKTER', id).del();
    const newJadwal = JADWAL.map((j) => ({ ...j, IDDOKTER: id }));
    await db('jadwal_dokter').insert(newJadwal);
};

export const deleteDokter = async (id) => {
    await db('dokter').where('IDDOKTER', id).del(); 
};
