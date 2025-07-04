import db from '../core/config/knex.js';

// Ambil semua dokter beserta jadwalnya
export const getAllDokter = async () => {
    const dokterList = await db('dokter as d')
        .join('poli as p', 'd.IDPOLI', 'p.IDPOLI')
        .select('d.*', 'p.NAMAPOLI');

    const jadwalList = await db('jadwal_dokter');

    return dokterList.map((dokter) => ({
        ...dokter,
        JADWAL: jadwalList.filter(j => j.IDDOKTER === dokter.IDDOKTER)
    }));
};

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
    await db('dokter').where('IDDOKTER', id).del(); // Jadwal otomatis terhapus jika pakai ON DELETE CASCADE
};
