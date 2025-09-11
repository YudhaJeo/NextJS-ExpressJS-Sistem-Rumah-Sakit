'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelObat from './components/tabelObat';
import FormObat from './components/formObat';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from "primereact/button";
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultForm = {
  IDOBAT: '',
  KODEOBAT: '',
  NAMAOBAT: '',
  MERKOBAT: '',
  JENISOBAT: 'TABLET',
  STOK: 0,
  HARGABELI: null,
  HARGAJUAL: null,
  TGLKADALUARSA: '',
  SUPPLIERID: null,
  LOKASI: '',
  DESKRIPSI: ''
};

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [supplierOptions, setSupplierOptions] = useState([]);

  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });

  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchSuppliers();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/obat`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data obat:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${API_URL}/supplier`);
      const options = res.data.map((item) => ({
        label: item.NAMASUPPLIER,
        value: item.SUPPLIERID,
      }));
      setSupplierOptions(options);
    } catch (err) {
      console.error('Gagal ambil data supplier:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!(form.KODEOBAT || '').trim())
      newErrors.KODEOBAT = <span style={{ color: 'red' }}>Kode obat wajib diisi</span>;

    if (!(form.NAMAOBAT || '').trim())
      newErrors.NAMAOBAT = <span style={{ color: 'red' }}>Nama obat wajib diisi</span>;

    if (!(form.MERKOBAT || '').trim())
      newErrors.MERKOBAT = <span style={{ color: 'red' }}>Merek wajib diisi</span>;

    if (!form.JENISOBAT)
      newErrors.JENISOBAT = <span style={{ color: 'red' }}>Jenis obat wajib diisi</span>;

    if (form.STOK === null || isNaN(form.STOK))
      newErrors.STOK = <span style={{ color: 'red' }}>Stok wajib diisi</span>;

    if (form.HARGABELI === null || isNaN(form.HARGABELI))
      newErrors.HARGABELI = <span style={{ color: 'red' }}>Harga beli wajib diisi</span>;

    if (form.HARGAJUAL === null || isNaN(form.HARGAJUAL))
      newErrors.HARGAJUAL = <span style={{ color: 'red' }}>Harga jual wajib diisi</span>;

    if (!(form.TGLKADALUARSA || '').trim())
      newErrors.TGLKADALUARSA = <span style={{ color: 'red' }}>Tanggal kadaluarsa wajib diisi</span>;

    if (!(form.LOKASI || '').trim())
      newErrors.LOKASI = <span style={{ color: 'red' }}>Lokasi rak wajib diisi</span>;

    if (!form.SUPPLIERID)
      newErrors.SUPPLIERID = <span style={{ color: 'red' }}>Supplier wajib dipilih</span>;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDOBAT;
    const url = isEdit
      ? `${API_URL}/obat/${form.IDOBAT}`
      : `${API_URL}/obat`;

    try {
      if (isEdit) {
        await axios.put(url, form);
        toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      } else {
        await axios.post(url, form);
        toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      setForm(defaultForm);
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setForm({
      IDOBAT: row.IDOBAT,
      KODEOBAT: row.KODEOBAT || '',
      NAMAOBAT: row.NAMAOBAT || '',
      MERKOBAT: row.MERKOBAT || '',
      JENISOBAT: row.JENISOBAT || 'TABLET',
      STOK: row.STOK ?? 0,
      HARGABELI: row.HARGABELI ?? 0,
      HARGAJUAL: row.HARGAJUAL ?? 0,
      TGLKADALUARSA: row.TGLKADALUARSA || '',
      SUPPLIERID: row.SUPPLIERID ?? null,
      LOKASI: row.LOKASI || '',
      DESKRIPSI: row.DESKRIPSI || ''
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin hapus '${row.NAMAOBAT}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/obat/${row.IDOBAT}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Data Obat</h3>

      <div className='flex items-center justify-end'>
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Cetak Data"
          onClick={() => setAdjustDialog(true)}
        />
        <HeaderBar
          title=""
          placeholder="Cari nama obat"
          onSearch={(keyword) => {
            if (!keyword) return fetchData();
            const filtered = data.filter((item) =>
              item.NAMAOBAT.toLowerCase().includes(keyword.toLowerCase()) ||
              item.JENISOBAT.toLowerCase().includes(keyword.toLowerCase())
            );
            setData(filtered);
          }}
          onAddClick={() => {
            setForm(defaultForm);
            setDialogVisible(true);
          }}
        />
      </div>

      <TabelObat
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormObat
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm(defaultForm);
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        supplierOptions={supplierOptions}
      />

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        data={data}
        setPdfUrl={setPdfUrl}
        setFileName={setFileName}
        setJsPdfPreviewOpen={setJsPdfPreviewOpen}
      />

      <Dialog
        visible={jsPdfPreviewOpen}
        onHide={() => setJsPdfPreviewOpen(false)}
        modal
        style={{ width: "90vw", height: "90vh" }}
        header="Preview PDF"
      >
        <PDFViewer pdfUrl={pdfUrl} fileName={fileName} paperSize="A4" />
      </Dialog>
    </div>
  );
};

export default Page;