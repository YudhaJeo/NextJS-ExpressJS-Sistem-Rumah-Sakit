import db from '../core/config/knex.js';

export const getDashboardInfo = async () => {
  const jumlahPasien = await db('pasien').count('* as total');
  const jumlahDokter = await db('master_tenaga_medis').where('JENISTENAGAMEDIS', 'Dokter').count('* as total');
  const bedTersedia = await db('bed').where('STATUS', 'TERSEDIA').count('* as total');
  const bedTerisi = await db('bed').where('STATUS', 'TERISI').count('* as total');

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

  return {
    cards: [
      {
        title: 'Jumlah Pasien',
        value: jumlahPasien[0].total,
        color: '#42A5F5',
        icon: 'pi pi-users'
      },
      {
        title: 'Jumlah Dokter',
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
    chart: chartData
  };
};