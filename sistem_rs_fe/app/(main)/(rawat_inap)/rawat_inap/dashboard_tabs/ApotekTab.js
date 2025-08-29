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
          'rgba(255, 159, 64, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ];
        const borderColors = [
          'rgb(255, 159, 64)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
        ];

        setChartData({
          labels,
          datasets: [{
            label: 'Jumlah: ',
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
    { title: 'Total Obat', value: data.totalObat ?? 0, icon: 'pi pi-briefcase', border: 'rgb(255, 159, 64)', background: 'rgba(0, 123, 255, 0.2)' },
    { title: 'Total Alkes', value: data.totalAlkes ?? 0, icon: 'pi pi-cog', border: 'rgb(75, 192, 192)', background: 'rgba(40, 167, 69, 0.2)' },
    { title: 'Total Supplier', value: data.totalSupplier ?? 0, icon: 'pi pi-truck', border: 'rgb(54, 162, 235)', background: 'rgba(255, 193, 7, 0.2)' },
    { title: 'Total Pemesanan', value: data.totalPemesanan ?? 0, icon: 'pi pi-shopping-cart', border: 'rgb(153, 102, 255)', background: 'rgba(220, 53, 69, 0.2)' },
  ];

  return (
    <div className="grid">
      {cards.map((card, i) => (
        <div className="col-12 md:col-6 xl:col-3" key={i}>
          <Card
            className="shadow-md"
            style={{ borderTop: `4px solid ${card.border}` }}
          >
            <div className="flex justify-content-between">
              <div>
                <span className="block text-500 mb-2">{card.title}</span>
                <span className="text-900 font-bold text-xl md:text-2xl">
                  {card.value}
                </span>
              </div>
              <div>
                <div
                  className={`flex align-items-center justify-content-center ${card.color} border-round`}
                  style={{ width: '2.5rem', height: '2.5rem' }}
                >
                  <i className={`${card.icon} text-xl`} />
                </div>
                <Tag value="Live" severity="info" />
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