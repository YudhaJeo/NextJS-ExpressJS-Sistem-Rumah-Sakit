"use client";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { LayoutContext } from "@/layout/context/layoutcontext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const DashboardPasien = () => {
  const [data, setData] = useState(null);
  const [barOptions, setBarOptions] = useState({});
  const [pieOptions, setPieOptions] = useState({});
  const { layoutConfig } = useContext(LayoutContext);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) router.push("/login");

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/statistik-pasien`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));

    applyTheme(layoutConfig.colorScheme === "dark");
  }, []);

  const applyTheme = (dark) => {
    const base = {
      responsive: true,
      maintainAspectRatio: false, // penting agar chart ikut ukuran container
      plugins: {
        legend: {
          labels: {
            color: dark ? "#ebedef" : "#495057",
          },
        },
      },
    };

    const scale = {
      scales: {
        x: {
          ticks: { color: dark ? "#ebedef" : "#495057" },
          grid: { color: dark ? "rgba(160, 167, 181, .3)" : "#ebedef" },
        },
        y: {
          beginAtZero: true,
          ticks: { color: dark ? "#ebedef" : "#495057" },
          grid: { color: dark ? "rgba(160, 167, 181, .3)" : "#ebedef" },
        },
      },
    };

    setBarOptions({ ...base, ...scale });
    setPieOptions(base);
  };

  const barData = {
    labels: data?.bulanan?.map((b) => b.bulan) ?? [],
    datasets: [
      {
        label: "Jumlah Pasien",
        backgroundColor: "#0D5EA6",
        data: data?.bulanan?.map((b) => b.total) ?? [],
      },
    ],
  };

  const pieData = {
    labels: ["Laki-laki", "Perempuan"],
    datasets: [
      {
        data: [data?.jumlahLaki ?? 0, data?.jumlahPerempuan ?? 0],
        backgroundColor: ["#42A5F5", "#EC407A"],
        hoverBackgroundColor: ["#64B5F6", "#F48FB1"],
      },
    ],
  };

  const cards = [
    {
      title: "Total Pasien",
      value: data?.totalPasien ?? 0,
      icon: "pi pi-users",
      color: "bg-blue-100",
      border: "#007bff",
    },
    {
      title: "Pasien Hari Ini",
      value: data?.pasienHariIni ?? 0,
      icon: "pi pi-calendar-plus",
      color: "bg-green-100",
      border: "#28a745",
    },
    {
      title: "Laki-laki",
      value: data?.jumlahLaki ?? 0,
      icon: "pi pi-male",
      color: "bg-cyan-100",
      border: "#17a2b8",
    },
    {
      title: "Perempuan",
      value: data?.jumlahPerempuan ?? 0,
      icon: "pi pi-female",
      color: "bg-pink-100",
      border: "#e83e8c",
    },
  ];

  return (
    <div className="grid">
      {cards.map((card, i) => (
        <div className="col-12 md:col-6 xl:col-3" key={i}>
          <Card
            className="shadow-md mb-4"
            style={{ borderTop: `4px solid ${card.border}` }}
          >
            <div className="flex justify-content-between">
              <div>
                <span className="block text-500 mb-2">{card.title}</span>
                <span className="text-900 font-bold text-xl md:text-2xl">
                  {card.value}
                </span>
              </div>
              <div
                className={`flex align-items-center justify-content-center ${card.color} border-round`}
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className={`${card.icon} text-xl`} />
              </div>
            </div>
          </Card>
        </div>
      ))}

      <div className="col-12 md:col-6">
        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">
              Statistik Bulanan
            </span>
            <Tag value="Data Real" severity="info" />
          </div>
          <div style={{ height: "300px" }}>
            <Chart type="bar" data={barData} options={barOptions} />
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-6">
        <Card>
          <span className="font-medium text-lg text-900 mb-3 block">
            Distribusi Jenis Kelamin
          </span>
          <div style={{ height: "300px" }}>
            <Chart type="pie" data={pieData} options={pieOptions} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPasien;
