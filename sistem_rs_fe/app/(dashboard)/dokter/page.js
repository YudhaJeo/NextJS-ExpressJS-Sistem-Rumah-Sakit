/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const Dokter = () => {
    const [chartOptions, setChartOptions] = useState({});
    const [tanggalHariIni, setTanggalHariIni] = useState('');
    const router = useRouter();

    const chartData = {
        labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        datasets: [
            {
                label: 'New',
                data: [10, 20, 40, 60, 90, 10, 20, 40, 60, 90, 40, 60],
                fill: false,
                borderColor: '#06b6d4',
                tension: 0.4
            },
            {
                label: 'Completed',
                data: [5, 15, 30, 45, 60, 10, 20, 40, 60, 90, 40, 60],
                fill: false,
                borderColor: '#fb923c',
                tension: 0.4
            },
            {
                label: 'Canceled',
                data: [2, 5, 10, 20, 30, 10, 20, 40, 60, 90, 40, 60],
                fill: true,
                backgroundColor: '#a78bfa88',
                borderColor: '#a78bfa',
                tension: 0.4
            }
        ]
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.push('/login');
        }

        const options = {
            plugins: {
                legend: {
                    labels: { color: '#495057' }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#495057' },
                    grid: { color: '#ebedef' }
                },
                y: {
                    ticks: { color: '#495057' },
                    grid: { color: '#ebedef' }
                }
            }
        };
        setChartOptions(options);

        // Set tanggal real-time
        const today = new Date();
        const formattedDate = today.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setTanggalHariIni(formattedDate);
    }, []);

    const topCards = [
        { title: 'Jadwal Dokter Hari ini', value: 3882, icon: "pi pi-users", bgColor: "bg-blue-100", borderColor: "#B13BFF" },
        { title: 'Jumlah Pasien', value: 532, icon: "pi pi-users", bgColor: "bg-yellow-100", borderColor: "#FFCC00" },
        { title: 'Tanggal', value: tanggalHariIni, icon: "pi pi-calendar", bgColor: "bg-green-100", borderColor: "#06923E" },
        { title: 'Laporan Hari ini', value: 440, icon: "pi pi-book", bgColor: "bg-purple-100", borderColor: "#8A0000" },
    ];

    const infodokter = [
        { nama_dokter: 'Dr. Syamsudin', poli: 'Gigi', jadwal_praktek: '18:00 - 20:00' },
        { nama_dokter: 'Dr. Ali', poli: 'Mata', jadwal_praktek: '18:00 - 20:00' },
        { nama_dokter: 'Dr. Agus', poli: 'Kaki', jadwal_praktek: '18:00 - 20:00' }
    ];

    return (
        <div className="grid">
            {/* Header with Search */}
            <div className="col-12 flex justify-content-between align-items-center mb-4">
                <h2 className="text-2xl font-bold">Dashboard Dokter</h2>
            </div>

            {/* Top Cards */}
            {topCards.map((card, idx) => (
                <div className="col-12 lg:col-6 xl:col-3" key={idx}>
                    <div className="card mb-0" style={{ borderTop: `3px solid ${card.borderColor}` }}>
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">{card.title}</span>
                                <div className="text-900 font-medium text-xl">{card.value}</div>
                            </div>
                            <div className={`flex align-items-center justify-content-center ${card.bgColor} border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className={`${card.icon} text-2xl`} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Chart */}
            <div className="col-12">
                <div className="card">
                    <div className="flex justify-content-between mb-4 flex-wrap gap-2">
                        <span className="text-1000 font-medium text-lg">Laporan Bulanan</span>
                        <Tag value="6 Bulan Terakhir" severity="info" />
                    </div>
                    <div className="h-50rem">
                        <Chart type="bar" data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Info Dokter Table */}
            <div className="col-12">
                <div className="card">
                    <h5>Info Dokter Hari ini</h5>
                    <DataTable value={infodokter} className="mt-4">
                        <Column field="nama_dokter" header="Nama Dokter" />
                        <Column field="poli" header="Poli" />
                        <Column field="jadwal_praktek" header="Jadwal Praktek" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Dokter;
