// sistem_rs_fe\app\(dashboard)\(rawatinap)\rawatinap\page.js
'use client';

import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const Dokter = () => {
    const [chartOptions] = useState({});
    const router = useRouter();

    const chartData = {
        labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        datasets: [
            {
                label: 'New',
                data: [10, 20, 40, 60, 90, 10, 20, 40, 60, 90,40, 60],
                fill: false,
                borderColor: '#06b6d4',
                tension: 0.4
            },
            {
                label: 'Completed',
                data: [5, 15, 30, 45, 60, 10, 20, 40, 60, 90,40, 60],
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
    }, []);

    return (
        <div className="grid">

            {/* Header */}
            <div className="card w-full">
                    <h2 className="text-2xl font-bold">Dashboard Rawat Inap</h2>
            </div>

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

        </div>
    );
};

export default Dokter;
