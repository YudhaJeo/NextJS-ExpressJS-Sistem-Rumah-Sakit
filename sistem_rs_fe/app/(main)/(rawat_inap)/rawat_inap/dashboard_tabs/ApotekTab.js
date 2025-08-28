// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(main)\(rawat_inap)\rawat_inap\dashboard_tabs\ApotekTab.js
'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import axios from 'axios';

const TabApotek = () => {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard_apotek`)
      .then(res => {
        const result = res.data;
        setData(result);

        const labels = ['Total Obat', 'Total Alkes', 'Total Supplier', 'Total Pemesanan'];
        const values = [
          result.totalObat,
          result.totalAlkes,
          result.totalSupplier,
          result.totalPemesanan
        ];

        const backgroundColors = [
          'rgba(0, 123, 255, 0.2)',
          'rgba(40, 167, 69, 0.2)',
          'rgba(255, 193, 7, 0.2)',
          'rgba(220, 53, 69, 0.2)',
        ];
        const borderColors = [
          '#007bff',
          '#28a745',
          '#ffc107',
          '#dc3545',
        ];

        setChartData({
          labels,
          datasets: [{
            label: 'Statistik Apotek',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        });

        setChartOptions({
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { stepSize: 1 }, min: 0 },
          }
        });
      })
      .catch(err => console.error(err));
  }, []);

  const cards = [
    { title: 'Total Obat', value: data.totalObat ?? 0, icon: 'pi pi-briefcase', border: '#007bff', background: 'rgba(0, 123, 255, 0.2)' },
    { title: 'Total Alkes', value: data.totalAlkes ?? 0, icon: 'pi pi-cog', border: '#28a745', background: 'rgba(40, 167, 69, 0.2)' },
    { title: 'Total Supplier', value: data.totalSupplier ?? 0, icon: 'pi pi-truck', border: '#ffc107', background: 'rgba(255, 193, 7, 0.2)' },
    { title: 'Total Pemesanan', value: data.totalPemesanan ?? 0, icon: 'pi pi-shopping-cart', border: '#dc3545', background: 'rgba(220, 53, 69, 0.2)' },
  ];

  return (
    <div className="grid">
      {cards.map((card, i) => (
        <div className="col-12 md:col-6 xl:col-3" key={i}>
          <Card className="shadow-md" style={{ borderTop: `4px solid ${card.border}` }}>
            <div className="flex justify-content-between">
              <div>
                <span className="block text-500 mb-2">{card.title}</span>
                <span className="text-900 font-bold text-xl md:text-2xl">{card.value}</span>
              </div>
              <div
                className="flex align-items-center justify-content-center border-round"
                style={{ background: card.background, width: '2.5rem', height: '2.5rem' }}
              >
                <i className={`${card.icon} text-xl`} />
              </div>
            </div>
          </Card>
        </div>
      ))}
      <div className="col-12">
        <Card>
          <Chart type="bar" data={chartData} options={chartOptions} className="w-full" />
        </Card>
      </div>
    </div>
  );
};

export default TabApotek;