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
import AdjustPrintMarginLaporanDinamis from '../../print/AdjustPrintMarginLaporanDinamis';
import { Dialog } from 'primereact/dialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TabTindakan = ({ tenagaMedisOptions, statusRawat }) => {
  const [tindakanInapData, setTindakanInapData] = useState([]);
  const [tindakanOptions, setTindakanOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const [newItem, setNewItem] = useState({
    WAKTUPEMBERIAN: null,
    IDTENAGAMEDIS: null,
    IDTINDAKAN: null,
    JUMLAH: 1,
    HARGA: 0,
    TOTAL: 0
  });

  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const [allTindakanInap, setAllTindakanInap] = useState([]);

  useEffect(() => {
    fetchTindakan();
    fetchAllTindakanInap();
  }, []);

  const fetchTindakan = async () => {
    try {
      const res = await axios.get(`${API_URL}/tindakan_medis`);
      const options = res.data.data.map((item) => ({
        label: item.NAMATINDAKAN,
        value: item.IDTINDAKAN,
        HARGA: item.HARGA,
      }));
      setTindakanOptions(options);
    } catch (err) {
      console.error('Gagal ambil data tindakan:', err);
    }
  };

  const fetchAllTindakanInap = async () => {
    try {
      const res = await axios.get(`${API_URL}/tindakan_inap`);
      setAllTindakanInap(res.data.data || []);
    } catch (err) {
      console.error('Gagal ambil seluruh data tindakan inap:', err);
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
      const res = await axios.get(`${API_URL}/tindakan_inap/rawat_inap/${idRawatInap}`);
      setTindakanInapData(res.data.data || []);
    } catch (err) {
      console.error('Gagal ambil data tindakan pasien rawat inap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const idRawatInap = Cookies.get('idRawatInap');
    if (!idRawatInap || !newItem.WAKTUPEMBERIAN || !newItem.IDTENAGAMEDIS || !newItem.IDTINDAKAN || !newItem.JUMLAH) {
      toast.current.show({ severity: 'warn', summary: 'Validasi', detail: 'Lengkapi semua field', life: 3000 });
      return;
    }

    const payload = {
      ...newItem,
      IDRAWATINAP: idRawatInap,
      WAKTUPEMBERIAN: dayjs(newItem.WAKTUPEMBERIAN).format("YYYY-MM-DD HH:mm:ss")
    };

    try {
      const res = await axios.post(`${API_URL}/tindakan_inap`, payload);

      if (res.data.status === 'success') {
        toast.current.show({
          severity: 'success',
          summary: 'Berhasil',
          detail: res.data.message,
          life: 3000
        });

        fetchData(idRawatInap);
        setNewItem({
          WAKTUPEMBERIAN: null,
          IDTENAGAMEDIS: null,
          IDTINDAKAN: null,
          JUMLAH: 1,
          HARGA: 0,
          TOTAL: 0
        });
      } else {
        toast.current.show({
          severity: 'warn',
          summary: 'Peringatan',
          detail: res.data.message,
          life: 3000
        });
      }
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.response?.data?.message || 'Terjadi kesalahan server',
        life: 3000
      });
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
          await axios.delete(`${API_URL}/tindakan_inap/${row.IDTINDAKANINAP}`);
          toast.current.show({ severity: 'success', summary: 'Berhasil', detail: 'Data tindakan berhasil dihapus', life: 3000 });
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

  const columns = [
    { label: 'Waktu', accessor: 'WAKTUPEMBERIAN', formatter: (v) => v ? new Date(v).toLocaleString() : '-' },
    { label: 'Petugas', accessor: 'NAMATENAGAMEDIS' },
    { label: 'Tindakan', accessor: 'NAMATINDAKAN' },
    { label: 'Jumlah', accessor: 'JUMLAH' },
    { label: 'Harga', accessor: 'HARGA', formatter: formatRupiah },
    { label: 'Total', accessor: 'TOTAL', formatter: formatRupiah },
  ];

  return (
    <div className="mt-4">
      <Toast ref={toast} />
      <h3 className="text-lg font-semibold mb-3">Riwayat Tindakan Inap</h3>

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
          value={newItem.IDTINDAKAN}
          options={tindakanOptions}
          onChange={(e) => {
            const selected = tindakanOptions.find(o => o.value === e.value);
            setNewItem({
              ...newItem,
              IDTINDAKAN: e.value,
              HARGA: selected?.HARGA || 0,
              TOTAL: newItem.JUMLAH * (selected?.HARGA || 0)
            });
          }}
          placeholder="Pilih Tindakan" filter showClear
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
        <InputNumber value={newItem.HARGA} disabled mode="currency" currency="IDR" locale="id-ID" />
        <Button label="Tambahkan" icon="pi pi-save" onClick={handleAdd} />

        <div className="flex flex-row gap-2">
          <Button
            icon="pi pi-print"
            tooltip="Cetak Data"
            className="p-button-warning"
            onClick={() => setAdjustDialog(true)}
          />
        </div>
      </div>
      )}

      <DataTable value={tindakanInapData} paginator rows={10} loading={loading} sortField="WAKTUPEMBERIAN" sortOrder={-1} scrollable>
        <Column field="WAKTUPEMBERIAN" header="Waktu"
          body={(row) => row.WAKTUPEMBERIAN ? new Date(row.WAKTUPEMBERIAN).toLocaleString() : '-'}
        />
        <Column field="NAMATENAGAMEDIS" header="Petugas" />
        <Column field="NAMATINDAKAN" header="Tindakan" />
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
      <AdjustPrintMarginLaporanDinamis
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        title="DATA TINDAKAN INAP"
        columns={columns}
        data={tindakanInapData}
        allData={allTindakanInap}
        setPdfUrl={setPdfUrl}
        setFileName={setFileName}
        setJsPdfPreviewOpen={setJsPdfPreviewOpen}
      />
      <Dialog
        visible={jsPdfPreviewOpen}
        onHide={() => setJsPdfPreviewOpen(false)}
        modal
        style={{ width: '90vw', height: '90vh' }}
        header="Preview PDF"
      >
        <iframe src={pdfUrl} title={fileName} width="100%" height="700px" style={{ border: 'none' }} />
      </Dialog>
    </div>
  );
};

export default TabTindakan;