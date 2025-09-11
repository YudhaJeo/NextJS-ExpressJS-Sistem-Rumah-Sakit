'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabView, TabPanel } from 'primereact/tabview';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [lineChartOptions, setLineChartOptions] = useState({});
  const [poliChartData, setPoliChartData] = useState({});
  const [poliChartOptions, setPoliChartOptions] = useState({});
  const [bedChartData, setBedChartData] = useState({});
  const [bedChartOptions, setBedChartOptions] = useState({});
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${API_URL}/dashboard`)
      .then((res) => {
        const resData = res.data;
        setData(resData);

        const style = getComputedStyle(document.documentElement);

        const labels = resData.chart?.labels ?? [];
        const values = resData.chart?.datasets?.[0]?.data ?? [];
        const backgroundColors = [
          'rgba(179, 59, 255, 0.5)',
          'rgba(255, 204, 0, 0.5)',
          'rgba(6, 146, 62, 0.5)',
          'rgba(138, 0, 0, 0.5)',
        ];
        const borderColors = ['#B13BFF', '#FFCC00', '#06923E', '#8A0000'];

        setBarChartData({
          labels,
          datasets: [
            {
              label: resData.chart?.datasets?.[0]?.label ?? 'Statistik Umum',
              data: values,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        });

        setBarChartOptions({
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { color: style.getPropertyValue('--text-color') },
              grid: { color: style.getPropertyValue('--surface-border') },
            },
            y: { ticks: { color: style.getPropertyValue('--text-color') } },
          },
        });

        const lineLabels = resData.trend?.labels ?? ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        setLineChartData({
          labels: lineLabels,
          datasets: [
            {
              label: 'Pasien',
              data: resData.trend?.pasien ?? [2, 4, 3, 5, 6, 7, 8],
              fill: false,
              borderColor: '#42A5F5',
              tension: 0.4,
            },
            {
              label: 'Dokter',
              data: resData.trend?.dokter ?? [1, 1, 1, 2, 2, 3, 3],
              fill: false,
              borderColor: '#66BB6A',
              tension: 0.4,
            },
          ],
        });
        setLineChartOptions({
          plugins: { legend: { labels: { color: style.getPropertyValue('--text-color') } } },
          scales: {
            x: { ticks: { color: style.getPropertyValue('--text-color') } },
            y: { ticks: { color: style.getPropertyValue('--text-color'), beginAtZero: true } },
          },
        });

        const poliLabels = resData.distribusi?.labels ?? ['Umum', 'Gigi', 'Anak', 'Bedah'];
        const poliValues = resData.distribusi?.data ?? [10, 5, 7, 3];
        const poliColors = [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ];
        setPoliChartData({
          labels: poliLabels,
          datasets: [
            {
              data: poliValues,
              backgroundColor: poliLabels.map((_, i) => poliColors[i % poliColors.length]),
              borderColor: poliLabels.map((_, i) => poliColors[i % poliColors.length].replace('0.6', '1')),
              borderWidth: 1,
            },
          ],
        });
        setPoliChartOptions({
          plugins: { legend: { position: 'bottom', labels: { color: style.getPropertyValue('--text-color') } } },
          scales: {
            r: {
              angleLines: { color: style.getPropertyValue('--surface-border') },
              grid: { color: style.getPropertyValue('--surface-border') },
              ticks: { color: style.getPropertyValue('--text-color') },
            },
          },
        });

        const totalBed = resData.bed?.total ?? 10;
        const usedBed = resData.bed?.used ?? 7;
        setBedChartData({
          labels: ['Terisi', 'Tersedia'],
          datasets: [
            {
              data: [usedBed, totalBed - usedBed],
              backgroundColor: ['#E53935', '#43A047'],
              hoverBackgroundColor: ['#EF5350', '#66BB6A'],
            },
          ],
        });
        setBedChartOptions({
          cutout: '70%',
          plugins: { legend: { position: 'bottom', labels: { color: style.getPropertyValue('--text-color') } } },
        });
      })
      .catch((err) => {
        console.error('Gagal ambil data dashboard:', err);
        setData(null);
      });
  }, []);

  const cards =
    data?.cards?.map((card) => ({
      title: card.title,
      value: card.value,
      icon: card.icon,
      border: card.color,
    })) ?? [];

  return (
    <div className="grid">
      <div className="card col-12 mb-2">
        <div className="flex justify-content-center md:justify-content-between align-items-center">
          <h1 className="text-xl font-semibold mb-3 text-center md:text-left flex-1">
            Rumah Sakit Bayza Medika
          </h1>
          <span className="text-sm font-bold text-700">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="col-12">
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          {/* TAB 1 - Statistik & Cards */}
          <TabPanel header="Statistik & Ringkasan">
            <div className="grid">
              {cards.map((card, i) => (
                <div className="col-12 md:col-6 xl:col-3" key={i}>
                  <Card className="shadow-md" style={{ borderTop: `4px solid ${card.border}` }}>
                    <div className="flex justify-content-between">
                      <div>
                        <span className="block text-500 mb-2">{card.title}</span>
                        <span className="text-900 font-bold text-xl md:text-2xl">{card.value}</span>
                      </div>
                      <div>
                        <div
                          className="flex align-items-center justify-content-center border-round"
                          style={{
                            width: '2.5rem',
                            height: '2.5rem',
                          }}
                        >
                          <i className={`${card.icon} text-xl`} />
                        </div>
                        <Tag value="Live" severity="info" />
                      </div>
                    </div>
                  </Card>
                </div>
              ))}

              <div className="col-12 md:col-6">
                <Card>
                  <div className="flex justify-content-between mb-3">
                    <span className="font-medium text-lg text-900">Tren Pasien & Dokter</span>
                    <Tag value="Live" severity="info" />
                  </div>
                  <Chart type="line" data={lineChartData} options={lineChartOptions} className="w-full" />
                </Card>
              </div>

              <div className="col-12 md:col-6">
                <Card>
                  <div className="flex justify-content-between mb-3">
                    <span className="font-medium text-lg text-900">Statistik Umum</span>
                    <Tag value="Live" severity="info" />
                  </div>
                  <Chart type="bar" data={barChartData} options={barChartOptions} className="w-full" />
                </Card>
              </div>

              <div className="col-12 md:col-6">
                <Card>
                  <div className="flex justify-content-between mb-3">
                    <span className="font-medium text-lg text-900">Distribusi Pasien per Poli</span>
                    <Tag value="Live" severity="info" />
                  </div>
                  <Chart type="polarArea" data={poliChartData} options={poliChartOptions} className="w-full" />
                </Card>
              </div>

              <div className="col-12 md:col-6">
                <Card>
                  <div className="flex justify-content-between mb-3">
                    <span className="font-medium text-lg text-900">Statistik Bed</span>
                    <Tag value="Live" severity="info" />
                  </div>
                  <Chart type="doughnut" data={bedChartData} options={bedChartOptions} className="w-full" />
                </Card>
              </div>
            </div>
          </TabPanel>

          {/* TAB 2 - Data Tabel */}
          <TabPanel header="Data Terkini">
            <div className="grid">
              {data?.table && (
                <div className="col-12">
                  <Card>
                    <div className="flex justify-content-between mb-3">
                      <span className="font-medium text-lg text-900">Data Tabel Terkini</span>
                      <Tag value="Live" severity="info" />
                    </div>
                    <DataTable value={data.table} paginator rows={5} responsiveLayout="scroll">
                      {Object.keys(data.table[0] || {}).map((field, idx) => (
                        <Column key={idx} field={field} header={field.toUpperCase()} sortable />
                      ))}
                    </DataTable>
                  </Card>
                </div>
              )}

              <div className="col-12">
                <Card>
                  <div className="flex justify-content-between mb-3">
                    <span className="font-medium text-lg text-900">Kalender Dokter</span>
                    <Tag value="Live" severity="info" />
                  </div>
                  <DataTable value={data?.kalender ?? []} paginator rows={3} responsiveLayout="scroll">
                    <Column field="NAMA_DOKTER" header="Nama Dokter" sortable />
                    <Column
                      field="TANGGAL"
                      header="Tanggal"
                      sortable
                      body={(rowData) => {
                        const date = new Date(rowData.TANGGAL);
                        return date.toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        });
                      }}
                    />
                    <Column
                      field="STATUS"
                      header="Status"
                      sortable
                      body={(rowData) => {
                        switch (rowData.STATUS) {
                          case 'info':
                            return <Tag severity="info" value="perjanjian" />;
                          case 'warning':
                            return <Tag severity="warning" value="libur" />;
                          default:
                            return <Tag severity="secondary" value={rowData.STATUS} />;
                        }
                      }}
                    />
                    <Column field="KETERANGAN" header="Keterangan" />
                  </DataTable>
                </Card>
              </div>

              <div className="col-12">
                <Card>
                  <div className="flex justify-content-between mb-3">
                    <span className="font-medium text-lg text-900">Jadwal Reservasi</span>
                    <Tag value="Live" severity="info" />
                  </div>
                  <DataTable value={data?.reservasi ?? []} paginator rows={3} responsiveLayout="scroll">
                    <Column field="NAMALENGKAP" header="Nama Pasien" />
                    <Column
                      field="TANGGALRESERVASI"
                      header="Tanggal Reservasi"
                      body={(rowData) => {
                        const date = new Date(rowData.TANGGALRESERVASI);
                        return date.toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        });
                      }}
                    />
                    <Column field="NAMAPOLI" header="Poli" />
                    <Column field="NAMADOKTER" header="Nama Dokter" />
                    <Column field="JAMRESERVASI" header="Jam" />
                    <Column field="KETERANGAN" header="Keluhan" />
                    <Column
                      header="Status"
                      body={(row) => {
                        const status = row.STATUS;
                        const severity = () => {
                          switch (status) {
                            case "Menunggu":
                              return "info";
                            case "Dikonfirmasi":
                              return "success";
                            case "Dibatalkan":
                              return "danger";
                            default:
                              return "info";
                          }
                        };
                        return <Tag value={status} severity={severity()} />;
                      }}
                    />
                  </DataTable>
                </Card>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default Dashboard;
