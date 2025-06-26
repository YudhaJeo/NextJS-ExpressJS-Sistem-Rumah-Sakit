/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { ChartData, ChartOptions } from 'chart.js';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const [barOptions, setBarOptions] = useState<ChartOptions>({});

    const chartDataBar: ChartData = {
        labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"],
        datasets: [
            {
                label: "Users",
                backgroundColor: "#0D5EA6",
                data: [4800, 3000, 6000, 4300, 2000, 5000, 4000],
            },
        ],
    };

    const chartDataLine: ChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Revenue",
                data: [10, 20, 35, 60, 90, 95],
                fill: true,
                borderColor: "#42A5F5",
                tension: 0.4
            },
            {
                label: "Profit",
                data: [5, 15, 30, 55, 85, 92],
                fill: true,
                borderColor: "#66BB6A",
                tension: 0.4
            }
        ]
    };

    const applyLightTheme = () => {
        const commonOptions: ChartOptions = {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#495057' },
                    grid: { color: '#ebedef' }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: '#495057' },
                    grid: { color: '#ebedef' }
                }
            }
        };

        setLineOptions(commonOptions);
        setBarOptions({
            ...commonOptions,
            plugins: { legend: { display: false } }
        });
    };

    const applyDarkTheme = () => {
        const commonOptions: ChartOptions = {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#ebedef' },
                    grid: { color: 'rgba(160, 167, 181, .3)' }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: '#ebedef' },
                    grid: { color: 'rgba(160, 167, 181, .3)' }
                }
            }
        };

        setLineOptions(commonOptions);
        setBarOptions({
            ...commonOptions,
            plugins: { legend: { display: false } }
        });
    };

    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/login');
        }

        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const metricCards = [
        { title: "PENDAFTARAN PASIEN", value: 3882, icon: "pi pi-users", bgColor: "bg-blue-100", borderColor: "#B13BFF" },
        { title: "DATA MEDIS", value: 532, icon: "pi pi-map", bgColor: "bg-yellow-100", borderColor: "#FFCC00" },
        { title: "REKAP KUNJUNGAN", value: "12.6%", icon: "pi pi-directions", bgColor: "bg-green-100", borderColor: "#06923E" },
        { title: "LAPORAN BULANAN", value: 440, icon: "pi pi-comment", bgColor: "bg-purple-100", borderColor: "#8A0000" },
    ];

    return (
        <div className="grid">
            {metricCards.map((card, idx) => (
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

            <div className="col-12">
                <div className="card">
                    <div className="flex justify-content-between mb-4 flex-wrap gap-2">
                        <span className="text-1000 font-medium text-lg">Statistika Pasien</span>
                        <Tag value="Last Week" severity="info" />
                    </div>
                    <div className="h-10rem">
                        <Chart type="bar" data={chartDataBar} options={barOptions} />
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <span className="text-900 font-medium text-lg mb-4 block">Laporan Bulanan</span>
                    <div className="h-10rem">
                        <Chart type="line" data={chartDataLine} options={lineOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;