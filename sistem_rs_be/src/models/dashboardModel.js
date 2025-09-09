import db from '../core/config/knex.js';

export const getDashboardInfo = async () => {
  try {
    const jumlahPasien = await db('pasien').count('* as total');
    const jumlahDokter = await db('master_tenaga_medis').where('JENISTENAGAMEDIS', 'Dokter').count('* as total');
    const bedTersedia = await db('bed').where('STATUS', 'TERSEDIA').count('* as total');
    const bedTerisi = await db('bed').where('STATUS', 'TERISI').count('* as total');
    const totalBed = await db('bed').count('* as total');

    const jumlahReservasi = await db('reservasi')
      .join('pasien', 'reservasi.NIK', 'pasien.NIK')
    .join('poli', 'reservasi.IDPOLI', 'poli.IDPOLI')
    .join('dokter', 'reservasi.IDDOKTER', 'dokter.IDDOKTER')
    .leftJoin('jadwal_dokter', 'dokter.IDDOKTER', 'jadwal_dokter.IDDOKTER')
    .leftJoin('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'reservasi.*',
      'pasien.NAMALENGKAP',
      'poli.NAMAPOLI',
      'dokter.IDDOKTER',
      'master_tenaga_medis.NAMALENGKAP as NAMADOKTER',
      'reservasi.TANGGALRESERVASI',
      'reservasi.JAMRESERVASI',
      'reservasi.STATUS',
    )
    .orderBy('TANGGALRESERVASI', 'asc')
    .limit(10);  

    const kalenderDokter = await db('kalender')
      .join('dokter', 'kalender.IDDOKTER', 'dokter.IDDOKTER')
      .join('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
      .select(
        'kalender.*',
        'dokter.IDDOKTER',
        'master_tenaga_medis.NAMALENGKAP as NAMA_DOKTER',
        'kalender.STATUS',
        'kalender.TANGGAL',
        'kalender.KETERANGAN'
      )
      .orderBy('TANGGAL', 'asc')
      .limit(10);

    const chartData = {
      labels: ['Pasien', 'Dokter', 'Tersedia', 'Terisi'],
      datasets: [
        {
          label: 'Statistik',
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350'],
          data: [
            jumlahPasien[0].total,
            jumlahDokter[0].total,
            bedTersedia[0].total,
            bedTerisi[0].total
          ]
        }
      ]
    };

const trenPasien = await db('pasien')
  .select(db.raw('DAYOFWEEK(TANGGALDAFTAR) as hari'), db.raw('COUNT(*) as total'))
  .groupBy('hari');

const trenDokter = await db('master_tenaga_medis')
  .where('JENISTENAGAMEDIS', 'Dokter')
  .select(db.raw('DAYOFWEEK(CREATED_AT) as hari'), db.raw('COUNT(*) as total'))
  .groupBy('hari');

const hariLabels = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

const trend = {
  labels: hariLabels,
  pasien: hariLabels.map((_, idx) => {
    const found = trenPasien.find(row => Number(row.hari) === (idx === 0 ? 1 : idx + 1));
    return found ? found.total : 0;
  }),
  dokter: hariLabels.map((_, idx) => {
    const found = trenDokter.find(row => Number(row.hari) === (idx === 0 ? 1 : idx + 1));
    return found ? found.total : 0;
  }),
};

    const distribusiPasien = await db('pendaftaran')
      .join('poli', 'pendaftaran.IDPOLI', 'poli.IDPOLI')
      .select('poli.NAMAPOLI')
      .count('* as total')
      .groupBy('poli.NAMAPOLI');

    const distribusi = {
      labels: distribusiPasien.map(r => r.NAMAPOLI),
      data: distribusiPasien.map(r => r.total),
    };

    const bed = {
      total: totalBed[0].total,
      used: bedTerisi[0].total,
    };

    return {
      cards: [
        {
          title: 'Total Pasien',
          value: jumlahPasien[0].total,
          color: '#42A5F5',
          icon: 'pi pi-users'
        },
        {
          title: 'Total Dokter',
          value: jumlahDokter[0].total,
          color: '#66BB6A',
          icon: 'pi pi-graduation-cap'
        },
        {
          title: 'Bed Tersedia',
          value: bedTersedia[0].total,
          color: '#FFA726',
          icon: 'pi pi-check-circle'
        },
        {
          title: 'Bed Terisi',
          value: bedTerisi[0].total,
          color: '#EF5350',
          icon: 'pi pi-times-circle'
        }
      ],
      chart: chartData,    
      trend,               
      distribusi,          
      bed,                 
      kalender: kalenderDokter,
      reservasi: jumlahReservasi
    };
  } catch (error) {
    console.error('Error getDashboardInfo:', error);
    throw error;
  }
};
