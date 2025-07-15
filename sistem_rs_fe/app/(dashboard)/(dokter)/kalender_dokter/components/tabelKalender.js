// tabelkalender
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
      const [kalenderRes, dokterRes] = await Promise.all([
        axios.get(`${API_URL}/kalender`),
        axios.get(`${API_URL}/datadokter`),
      ]);

      const dokterMap = dokterRes.data.reduce((acc, dokter) => {
        acc[dokter.ID] = dokter;
        return acc;
      }, {});

      const data = kalenderRes.data.map((item) => {
        const dokter = dokterMap[item.IDDOKTER];
        const namaDokter = dokter?.NAMADOKTER || '';

        return {
          id: item.ID,
          title: `${item.STATUS === 'libur' ? 'Libur' : 'Perjanjian'} - ${namaDokter} (${item.KETERANGAN || '-'})`,
          start: item.TANGGAL,
          extendedProps: {
            IDDOKTER: item.IDDOKTER,
            STATUS: item.STATUS,
            KETERANGAN: item.KETERANGAN,
            NAMA_DOKTER: namaDokter,
          },
          color: item.STATUS === 'libur' ? '#f87171' : '#60a5fa',
        };
      });

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
          NAMADOKTER: event.extendedProps.NAMADOKTER,
        });
      }}
      displayEventTime={false}
      height="auto"
    />
  );
}
