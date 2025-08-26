// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(dashboard)\(rawat_inap)\rawat_inap\menu\rawat_inap\components\tabs\TabAlkes.js
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import dayjs from "dayjs";
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TabAlkes = ({ tenagaMedisOptions, statusRawat }) => {
  const [alkesInapData, setAlkesInapData] = useState([]);
  const [alkesOptions, setAlkesOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const [newItem, setNewItem] = useState({
    WAKTUPEMBERIAN: null,
    IDTENAGAMEDIS: null,
    IDALKES: null,
    JUMLAH: 1,
    HARGA: 0,
    TOTAL: 0
  });

  useEffect(() => {
    fetchAlkes(); 
  }, []); 

  const fetchAlkes = async () => {
    try {
      const res = await axios.get(`${API_URL}/alkes`);
      const options = res.data.data.map((item) => ({
        label: item.NAMAALKES,
        value: item.IDALKES,
        HARGA: item.HARGAJUAL,
      }));
      setAlkesOptions(options);
    } catch (err) {
      console.error('Gagal ambil data alkes:', err);
    }
  };

  useEffect(() => {
    const idRawatInap = Cookies.get('idRawatInap');
    if (idRawatInap) {
      fetchData(idRawatInap);
    }
  }, []); 

  const fetchData = async (idRawatInap) => {
    if (!idRawatInap) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/alkes_inap/rawat_inap/${idRawatInap}`);
      setAlkesInapData(res.data.data || []);
    } catch (err) {
      console.error('Gagal ambil data alkes pasien rawat inap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const idRawatInap = Cookies.get('idRawatInap');
    if (!idRawatInap || !newItem.WAKTUPEMBERIAN || !newItem.IDTENAGAMEDIS || !newItem.IDALKES || !newItem.JUMLAH) {
      toast.current.show({ severity: 'warn', summary: 'Validasi', detail: 'Lengkapi semua field', life: 3000 });
      return;
    }

    const payload = {
      ...newItem,
      IDRAWATINAP: idRawatInap,
      WAKTUPEMBERIAN: dayjs(newItem.WAKTUPEMBERIAN).format("YYYY-MM-DD HH:mm:ss")
    };

    try {
      await axios.post(`${API_URL}/alkes_inap`, payload);
      toast.current.show({ severity: 'success', summary: 'Berhasil', detail: 'Data alkes berhasil ditambahkan', life: 3000 });
      fetchData(idRawatInap);
      setNewItem({ WAKTUPEMBERIAN: null, IDTENAGAMEDIS: null, IDALKES: null, JUMLAH: 1, HARGA: 0, TOTAL: 0 });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Gagal', detail: 'Gagal tambah data', life: 3000 });
      console.error('Gagal tambah data:', err);
    }
  };

    
  const handleDelete = (row) => {
    confirmDialog({
      message: 'Yakin hapus data ini?',
      header: 'Konfirmasi',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const idRawatInap = Cookies.get('idRawatInap');
        try {
          await axios.delete(`${API_URL}/alkes_inap/${row.IDALKESINAP}`);
          toast.current.show({ severity: 'success', summary: 'Berhasil', detail: 'Data alkes berhasil dihapus', life: 3000 });
          fetchData(idRawatInap); 
        } catch (err) {
          toast.current.show({ severity: 'error', summary: 'Gagal', detail: 'Gagal hapus data', life: 3000 });
          console.error('Gagal hapus data:', err);
        }
      }
    });
  };
  

  const formatRupiah = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
      .format(val || 0);

  return (
    <div className="mt-4">
      <Toast ref={toast} />
      <h3 className="text-lg font-semibold mb-3">Riwayat Alkes Inap</h3>

      {statusRawat === "AKTIF" && (
      <div className="flex flex-wrap gap-2 mb-4">
        <Calendar
          value={newItem.WAKTUPEMBERIAN}
          onChange={(e) => setNewItem({ ...newItem, WAKTUPEMBERIAN: e.value })}
          showButtonBar
          showIcon
          dateFormat="yy-mm-dd"
          showTime
          hourFormat="24"
          placeholder="Waktu Pemberian"
        />
        <Dropdown
          value={newItem.IDTENAGAMEDIS}
          options={tenagaMedisOptions}
          onChange={(e) => setNewItem({ ...newItem, IDTENAGAMEDIS: e.value })}
          placeholder="Pilih Petugas" filter showClear
        />
        <Dropdown
          value={newItem.IDALKES}
          options={alkesOptions}
          onChange={(e) => {
            const selected = alkesOptions.find(o => o.value === e.value);
            setNewItem({
              ...newItem,
              IDALKES: e.value,
              HARGA: selected?.HARGA || 0,
              TOTAL: newItem.JUMLAH * (selected?.HARGA || 0)
            });
          }}
          placeholder="Pilih Alkes" filter showClear
        />
        <InputNumber
          value={newItem.JUMLAH} min={1}
          onValueChange={(e) => setNewItem({
            ...newItem,
            JUMLAH: e.value,
            TOTAL: (e.value || 0) * (newItem.HARGA || 0)
          })}
          placeholder="Jumlah"
        />
        <InputNumber value={newItem.HARGA} readOnly mode="currency" currency="IDR" locale="id-ID" />
        <Button label="Tambahkan" icon="pi pi-save" onClick={handleAdd} />
      </div>
      )}

      <DataTable value={alkesInapData} paginator rows={10} loading={loading} sortField="WAKTUPEMBERIAN" sortOrder={-1} scrollable>
        <Column field="WAKTUPEMBERIAN" header="Waktu"
          body={(row) => row.WAKTUPEMBERIAN ? new Date(row.WAKTUPEMBERIAN).toLocaleString() : '-'}
        />
        <Column field="NAMATENAGAMEDIS" header="Petugas" />
        <Column field="NAMAALKES" header="Alkes" />
        <Column field="JUMLAH" header="Jumlah" />
        <Column field="HARGA" header="Harga" body={(row) => formatRupiah(row.HARGA)} />
        <Column field="TOTAL" header="Total" body={(row) => formatRupiah(row.TOTAL)} />
        {statusRawat === "AKTIF" && (
        <Column header="Aksi" body={(row) => (
          <div className="flex gap-2">
            <Button icon="pi pi-trash" size="small" severity="danger" onClick={() => handleDelete(row)} />
          </div>
        )} style={{ width: '150px' }} />
        )}
      </DataTable>
    </div>
  );
};

export default TabAlkes;