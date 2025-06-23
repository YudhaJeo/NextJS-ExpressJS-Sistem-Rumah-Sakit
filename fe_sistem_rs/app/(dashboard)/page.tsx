// app/page.tsx
"use client";

import React from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Tag } from "primereact/tag";

export default function Dashboard() {
  const chartData = {
    labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"],
    datasets: [
      {
        label: "Users",
        backgroundColor: "#0D5EA6",
        data: [4800, 3000, 6000, 4300, 2000, 5000, 4000],
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  const metricCards = [
    { title: "PENDAFTARAN PASIEN", value: 3882, icon: "pi pi-users", bgColor: "bg-blue-100", borderColor: "#B13BFF" },
    { title: "DATA MEDIS  ", value: 532, icon: "pi pi-map", bgColor: "bg-yellow-100", borderColor: "#FFCC00" },
    { title: "REKAP KUNJUNGAN", value: "12.6%", icon: "pi pi-directions", bgColor: "bg-green-100", borderColor: "#06923E" },
    { title: "LAPORAN BULANAN", value: 440, icon: "pi pi-comment", bgColor: "bg-purple-100", borderColor: "border-purple-500" },
  ];
  
  return (
    <div className="p-2 md:p-3 space-y-0 mb-5">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {metricCards.map((card, idx) => (
          <Card
            key={idx}
            className="shadow-4 border-top-3 transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,255,255,0.7)]"
            style={{ borderTopColor: card.borderColor }}>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-500 block mb-0">{card.title}</span>
                <div className="text-900 text-3xl font-medium">{card.value}</div>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <i className={`${card.icon} text-5xl`}></i>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Acquisition and Growth */}
      <div className="w-full mb-5">
        <Card className="shadow-4 lg:col-span-2 mb-5">
          <div className="flex justify-between mb-4 flex-wrap gap-2">
            <span className="text-1000 font-medium text-lg">Statistika Pasien</span>
            <Tag value="Last Week" severity="info" />
          </div>
          <div className="w-full h-[500px]">
            <Chart type="bar" data={chartData} options={chartOptions} />
          </div>
        </Card>
        <Card className="shadow-4">
          <span className="text-900 font-medium text-lg mb-4 block mb-5">Laporan Bulanan</span>
          <div className="w-full h-[500px]">
            <Chart
              type="line"
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  { label: "Revenue", data: [10, 20, 35, 60, 90, 95], fill: true, borderColor: "#42A5F5", tension: 0.4 },
                  { label: "Profit", data: [5, 15, 30, 55, 85, 92], fill: true, borderColor: "#66BB6A", tension: 0.4 },
                ],
              }}
              options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: "#495057" } } } }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
