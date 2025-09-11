'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TabelKalender({ refresh }) {
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchKalender();
  }, [refresh]);

  const toLocalDateString = (dateInput) => {
    const d = new Date(dateInput);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const fetchKalender = async () => {
    try {
      const res = await axios.get(`${API_URL}/reservasi`);

      const filteredData = res.data.filter(
        (item) => item.STATUS?.toLowerCase() === 'dikonfirmasi'
      );

      const grouped = filteredData.reduce((acc, item) => {
        const localDate = toLocalDateString(item.TANGGALRESERVASI);
        if (!acc[localDate]) acc[localDate] = [];
        acc[localDate].push(item);
        return acc;
      }, {});

      const data = Object.entries(grouped).map(([date, items]) => ({
        id: date,
        title: `${items.length} Reservasi`,
        start: date,      
        allDay: true,   
        extendedProps: { items },
        color: '#60a5fa',
      }));

      setEvents(data);
    } catch (err) {
      console.error('Gagal memuat data reservasi:', err);
    }
  };

  const handleEventClick = (info) => {
    setSelectedEvents(info.event.extendedProps.items || []);
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
        timeZone="local"       
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
        style={{ width: '50rem' }}
        onHide={() => setVisible(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button label="Tutup" icon="pi pi-times" onClick={() => setVisible(false)} />
          </div>
        }
      >
        {selectedEvents.length > 0 && (
          <DataTable value={selectedEvents} paginator rows={5} responsiveLayout="scroll">
            <Column field="NAMALENGKAP" header="Pasien" />
            <Column field="NAMADOKTER" header="Dokter" />
            <Column field="NAMAPOLI" header="Poli" />
            <Column field="JAMRESERVASI" header="Jam" />
            <Column field="TANGGALRESERVASI" header="Tanggal" body={(row) => formatTanggal(row.TANGGALRESERVASI)} />
            <Column field="STATUS" header="Status" />
            <Column field="KETERANGAN" header="Keterangan" />
          </DataTable>
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
