'use client';

import { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TabelKalender({ refresh }) {
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [visible, setVisible] = useState(false);
  const toast = useRef(null); // ✅ pakai useRef, bukan useState

  useEffect(() => {
    fetchKalender();
  }, [refresh]);

  const fetchKalender = async () => {
    try {
      const kalenderRes = await axios.get(`${API_URL}/kalender`);

      // kelompokkan data per tanggal
      const grouped = kalenderRes.data.reduce((acc, item) => {
        const date = item.TANGGAL;
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
      }, {});

      const data = Object.entries(grouped).map(([date, items]) => ({
        id: date,
        title: `${items.length} Status`,
        start: date,      
        allDay: true,   
        extendedProps: { items },
        color: '#60a5fa',
      }));

      setEvents(data);
    } catch (err) {
      console.error('Gagal memuat data kalender:', err);
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
    }).format(date);
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Apakah yakin ingin menghapus jadwal ${rowData.NAMA_DOKTER} pada ${formatTanggal(rowData.TANGGAL)}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Tidak',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/kalender/${rowData.ID}`);
          fetchKalender();
          setSelectedEvents((prev) =>
            prev.filter((item) => item.ID !== rowData.ID)
          );
          toast.current?.show({
            severity: 'success',
            summary: 'Berhasil',
            detail: 'Jadwal berhasil dihapus',
          });
        } catch (err) {
          console.error('Gagal menghapus jadwal:', err);
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal menghapus jadwal',
          });
        }
      },
    });
  };

  const actionBody = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => handleDelete(rowData)}
      />
    );
  };

  return (
    <>
      <Toast ref={toast} /> {/* ✅ sudah pakai useRef */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        displayEventTime={false}
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
        header="Detail Jadwal"
        visible={visible}
        style={{ width: '60rem' }}
        onHide={() => setVisible(false)}
        footer={
          <div className="flex justify-end">
            <Button
              label="Tutup"
              icon="pi pi-times"
              onClick={() => setVisible(false)}
            />
          </div>
        }
      >
        {selectedEvents.length > 0 && (
          <DataTable
            value={selectedEvents}
            paginator
            rows={20} rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
            responsiveLayout="scroll"
          >
            <Column field="NAMA_DOKTER" header="Dokter" />
            <Column
              field="TANGGAL"
              header="Tanggal"
              body={(row) => formatTanggal(row.TANGGAL)}
            />
            <Column field="STATUS" header="Status" />
            <Column field="KETERANGAN" header="Keterangan" />
            <Column body={actionBody} header="Aksi" style={{ width: '6rem' }} />
          </DataTable>
        )}
      </Dialog>
    </>
  );
}
