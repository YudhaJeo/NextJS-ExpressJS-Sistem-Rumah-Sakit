'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DashboardKasir = () => {
  const [data, setData] = useState(null);
  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});
  const [polarChartData, setPolarChartData] = useState({});
  const [polarChartOptions, setPolarChartOptions] = useState({});

  useEffect(() => {
    axios
      .get(`${API_URL}/dashboard_kasir`)
      .then((res) => {
        const resData = res.data;
        setData(resData);

        const style = getComputedStyle(document.documentElement);

        const labels = ['Total Invoice', 'Total Pembayaran', 'Total Deposit', 'Total Angsuran'];
        const values = [
          resData.totalInvoice ?? 0,
          resData.totalPembayaran ?? 0,
          resData.totalDeposit ?? 0,
          resData.totalAngsuran ?? 0,
        ];

        const backgroundColors = [
          'rgba(0, 123, 255, 0.2)',
          'rgba(40, 167, 69, 0.2)',
          'rgba(255, 193, 7, 0.2)',
          'rgba(111, 66, 193, 0.2)',
        ];

        const borderColors = [
          '#007BFF',
          '#28A745',
          '#FFC107',
          '#6F42C1',
        ];

        setBarChartData({
          labels,
          datasets: [
            {
              label: 'Statistik Kasir',
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
        console.error('Gagal ambil data dashboard kasir:', err);
        setData(null);
      });
  }, []);

  const cards = [
    {
      title: 'Total Invoice',
      value: data?.totalInvoice ?? 0,
      icon: 'pi pi-file',
      background: 'rgba(0, 123, 255, 0.2)',
      border: '#007BFF',
    },
    {
      title: 'Total Pembayaran',
      value: data?.totalPembayaran ?? 0,
      icon: 'pi pi-wallet',
      background: 'rgba(40, 167, 69, 0.2)',
      border: '#28A745',
    },
    {
      title: 'Total Deposit',
      value: data?.totalDeposit ?? 0,
      icon: 'pi pi-dollar',
      background: 'rgba(255, 193, 7, 0.2)',
      border: '#FFC107',
    },
    {
      title: 'Total Angsuran',
      value: data?.totalAngsuran ?? 0,
      icon: 'pi pi-list',
      background: 'rgba(111, 66, 193, 0.2)',
      border: '#6F42C1',
    },
  ];

  return (
    <div className="grid">
      <div className="card col-12">
        <h1 className="text-xl font-semibold mb-3">Dashboard Kasir</h1>
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
            <span className="font-medium text-lg text-900">Perbandingan Data Keuangan</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="polarArea" data={polarChartData} options={polarChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 md:col-6">
        <Card className="mb-2">
          <div className="flex justify-content-between">
            <span className="font-medium text-lg text-900">Statistik Keuangan</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="bar" data={barChartData} options={barChartOptions} className="w-full" />
        </Card>

        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">Transaksi Terbaru</span>
            <Tag value="Live" severity="info" />
          </div>
          <DataTable value={data?.transaksi ?? []} paginator rows={4} responsiveLayout="scroll">
            <Column field="nomor_invoice" header="No. Invoice" sortable />
            <Column field="nama_pasien" header="Nama Pasien" sortable />
            <Column field="status_pembayaran" header="Status" sortable />
            <Column
              field="tanggal"
              header="Tanggal"
              body={(rowData) => new Date(rowData.tanggal).toLocaleDateString('id-ID')}
              sortable
            />
            <Column
              field="total"
              header="Total (Rp)"
              body={(rowData) =>
                rowData.total?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
              }
            />
          </DataTable>
        </Card>
      </div>
    </div>
  );
};

export default DashboardKasir;