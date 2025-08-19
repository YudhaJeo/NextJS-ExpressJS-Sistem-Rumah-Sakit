'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});
  const [polarChartData, setPolarChartData] = useState({});
  const [polarChartOptions, setPolarChartOptions] = useState({});
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${API_URL}/dashboard`)
      .then((res) => {
        const resData = res.data;
        // console.log('DATA DASHBOARD:', resData);
        setData(resData);

        const style = getComputedStyle(document.documentElement);

        const labels = resData.chart?.labels ?? [];
        const values = resData.chart?.datasets?.[0]?.data ?? [];

        const backgroundColors = [
          'rgba(179, 59, 255, 0.2)',
          'rgba(255, 204, 0, 0.2)',
          'rgba(6, 146, 62, 0.2)',
          'rgba(138, 0, 0, 0.2)',
        ];

        const borderColors = [
          '#B13BFF',
          '#FFCC00',
          '#06923E',
          '#8A0000',
        ];

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
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { color: style.getPropertyValue('--text-color') },
              grid: { color: style.getPropertyValue('--surface-border') },
            },
            y: {
              ticks: { color: style.getPropertyValue('--text-color') },
            },
          },
        });

        setPolarChartData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        });

        setPolarChartOptions({
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: style.getPropertyValue('--text-color') },
            },
          },
        });
      })
      .catch((err) => {
        console.error('Gagal ambil data dashboard:', err);
        setData(null);
      });
  }, []);

  const cards = data?.cards?.map((card) => ({
    title: card.title,
    value: card.value,
    icon: card.icon,
    background: card.color + '20',
    border: card.color,
  })) ?? [];

  return (
    <div className="grid">
  <div className="card col-12">
    <div className="flex justify-content-center md:justify-content-between align-items-center">
      {/* Judul di tengah (mobile: tengah, desktop: kiri) */}
      <h1 className="text-xl font-semibold mb-3 text-center md:text-left flex-1">
        Rumah Sakit Bayza Medika
      </h1>

      {/* Hari & Tanggal Realtime */}
      <span className="text-sm font-bold text-700">
        {new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })}
      </span>
    </div>
  </div>


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
                    background: card.background,
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
          <div className="flex justify-content-between mb-5">
            <span className="font-medium text-lg text-900">Perbandingan Data</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="polarArea" data={polarChartData} options={polarChartOptions} className="w-full" />
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
        {data?.table && (
          <Card>
            <div className="flex justify-content-between mb-3">
              <span className="font-medium text-lg text-900">Data Terkini</span>
              <Tag value="Live" severity="info" />
            </div>
            <DataTable value={data.table} paginator rows={5} responsiveLayout="scroll">
              {Object.keys(data.table[0] || {}).map((field, idx) => (
                <Column key={idx} field={field} header={field.toUpperCase()} sortable />
              ))}
            </DataTable>
          </Card>
        )}
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
                          case "info":
                            return <Tag severity="info" value="perjanjian" />;
                          case "warning":
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
    </div>
  );
};

export default Dashboard;
