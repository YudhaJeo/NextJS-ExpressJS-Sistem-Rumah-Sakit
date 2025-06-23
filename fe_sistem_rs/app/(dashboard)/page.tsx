
"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import React from "react";

export default function Dashboard() {
  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "#42A5F5",
      },
      {
        label: "My Second dataset",
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: "#EC407A",
      },
    ],
  };

  return (
    <div className="dashboard p-4">
      <div className="grid">
        <div className="col">
          <Card title="Jumlah Pasien">0</Card>
        </div>
        <div className="col">
          <Card title="Jumlah Kunjungan">0</Card>
        </div>
        <div className="col">
          <Card title="Jumlah Dokter Hari Ini">0</Card>
        </div>
      </div>

      <div className="mt-5">
        <Card title="Statistik Kunjungan">
          <Chart type="bar" data={chartData} />
        </Card>
      </div>
    </div>
  );
}
