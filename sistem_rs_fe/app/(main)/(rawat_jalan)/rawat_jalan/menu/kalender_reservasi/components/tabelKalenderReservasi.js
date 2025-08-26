'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TabelKalender({ refresh }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchKalender();
  }, [refresh]);

  const fetchKalender = async () => {
    try {
      const res = await axios.get(`${API_URL}/reservasi`);

      // Filter hanya status "dikonfirmasi"
      const filteredData = res.data.filter(item => item.STATUS?.toLowerCase() === 'dikonfirmasi');

      const data = filteredData.map((item) => ({
        id: item.IDRESERVASI,
        title: `Reservasi - ${item.NAMALENGKAP} - ${item.NAMADOKTER} - (${item.KETERANGAN || '-'})`,
        start: item.TANGGALRESERVASI,
        extendedProps: {
          NIK: item.NIK,
          NAMAPASIEN: item.NAMALENGKAP,
          NAMAPOLI: item.NAMAPOLI,
          NAMADOKTER: item.NAMADOKTER,
          JAMRESERVASI: item.JAMRESERVASI,
          JADWALPRAKTEK: item.JADWALPRAKTEK?.join(', ') || '-',
          STATUS: item.STATUS,
          KETERANGAN: item.KETERANGAN,
          TANGGALRESERVASI: item.TANGGALRESERVASI,
        },
        color: item.STATUS === 'batal' ? '#f87171' : '#60a5fa',
      }));

      setEvents(data);
    } catch (err) {
      console.error('Gagal memuat data reservasi:', err);
    }
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
    setVisible(true);
  };

  const formatTanggal = (isoDate) => {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        displayEventTime={false}
        contentHeight="auto"
        expandRows={true}
        dayMaxEventRows={3}
        moreLinkClick="popover"
        height="auto"
        eventClick={handleEventClick}
        dayCellDidMount={(info) => {
          if (info.date.getDay() === 0) {
            info.el.style.backgroundColor = '#ffe4e6';
            info.el.style.color = '#dc2626';
          }
        }}
      />

      <Dialog
        header="Detail Reservasi"
        visible={visible}
        style={{ width: '30rem' }}
        onHide={() => setVisible(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button label="Tutup" icon="pi pi-times" onClick={() => setVisible(false)} />
          </div>
        }
      >
        {selectedEvent && (
          <div className="p-2">
            <p><strong>Pasien:</strong> {selectedEvent.NAMAPASIEN}</p>
            <p><strong>Dokter:</strong> {selectedEvent.NAMADOKTER}</p>
            <p><strong>Poli:</strong> {selectedEvent.NAMAPOLI}</p>
            <p><strong>Jam Reservasi:</strong> {selectedEvent.JAMRESERVASI}</p>
            <p><strong>Tanggal:</strong> {formatTanggal(selectedEvent.TANGGALRESERVASI)}</p>
            <p><strong>Keterangan:</strong> {selectedEvent.KETERANGAN || '-'}</p>
            <p><strong>Status:</strong> {selectedEvent.STATUS}</p>
          </div>
        )}
      </Dialog>

      <style jsx global>{`
        .fc .fc-event-title {
          white-space: normal !important;
          overflow: visible !important;
          text-overflow: unset !important;
          font-size: 0.85rem;
        }
        .fc-daygrid-event {
          padding: 2px 4px;
        }
      `}</style>
    </>
  );
}
