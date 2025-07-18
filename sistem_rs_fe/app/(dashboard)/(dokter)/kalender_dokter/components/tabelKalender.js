'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TabelKalender({
  onDateClick,
  onEventClick,
  refresh,
}) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchKalender();
  }, [refresh]);

  const fetchKalender = async () => {
    try {
      const kalenderRes = await axios.get(`${API_URL}/kalender`);

      const data = kalenderRes.data.map((item) => ({
        id: item.ID,
        title: `${item.STATUS === 'libur' ? 'Libur' : 'Perjanjian'} - ${item.NAMA_DOKTER} (${item.KETERANGAN || '-'})`,
        start: item.TANGGAL,
        extendedProps: {
          IDDOKTER: item.IDDOKTER,
          STATUS: item.STATUS,
          KETERANGAN: item.KETERANGAN,
          NAMA_DOKTER: item.NAMA_DOKTER,
        },
        color: item.STATUS === 'libur' ? '#f87171' : '#60a5fa',
      }));

      setEvents(data);
    } catch (err) {
      console.error('Gagal memuat data kalender:', err);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={(arg) => onDateClick(arg)}
      eventClick={(info) => {
        const event = info.event;
        onEventClick({
          ID: event.id,
          IDDOKTER: event.extendedProps.IDDOKTER,
          STATUS: event.extendedProps.STATUS,
          KETERANGAN: event.extendedProps.KETERANGAN,
          TANGGAL: event.startStr,
          NAMA_DOKTER: event.extendedProps.NAMA_DOKTER,
        });
      }}
      displayEventTime={false}
      height="auto"
      dayCellDidMount={(info) => {
        const date = info.date;
        if (date.getDay() === 0) {
          info.el.style.backgroundColor = '#ffe4e6'; // warna background hari Minggu
          info.el.style.color = '#dc2626'; // warna teks hari Minggu
        }
      }}
    />
  );
}
