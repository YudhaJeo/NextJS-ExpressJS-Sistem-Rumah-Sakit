'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelMetodePembayaran from './components/tabelMetodePembayaran';
import FormDialogMetodePembayaran from './components/formDialogMetodePembayaran';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from "primereact/button";
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState({
    IDMETODE: null,
    NAMA: '',
    STATUS: null,
    KETERANGAN: '',
    FEE_PERSEN: 0,
  });
  const [errors, setErrors] = useState({});
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });

  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/metode_pembayaran`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data metode pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NAMA.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      NAMA: form.NAMA,
      STATUS: form.STATUS,
      KETERANGAN: form.KETERANGAN,
      FEE_PERSEN: form.FEE_PERSEN,
    };

    const isEdit = !!form.IDMETODE;
    const url = isEdit
      ? `${API_URL}/metode_pembayaran/${form.IDMETODE}`
      : `${API_URL}/metode_pembayaran`;

    try {
      if (isEdit) {
        await axios.put(url, payload);
        toastRef.current?.showToast('00', 'Metode pembayaran berhasil diperbarui');
      } else {
        await axios.post(url, payload);
        toastRef.current?.showToast('00', 'Metode pembayaran berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data metode pembayaran');
    }
  };

  const handleEdit = (row) => {
    setForm({
      IDMETODE: row.IDMETODE ?? null,
      NAMA: row.NAMA ?? '',
      STATUS: row.STATUS ?? null,
      KETERANGAN: row.KETERANGAN ?? '',
      FEE_PERSEN: row.FEE_PERSEN ?? 0,
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus metode pembayaran '${row.NAMA}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/metode_pembayaran/${row.IDMETODE}`);
          fetchData();
          toastRef.current?.showToast('00', 'Metode pembayaran berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus metode pembayaran');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      IDMETODE: null,
      NAMA: '',
      TIPE: '',
      STATUS: null,
      KETERANGAN: '',
      FEE_PERSEN: 0,
      IDBANK: null,
    });
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />

      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Metode Pembayaran</h3>

      <div className="flex items-center justify-end">
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Cetak Data"
          onClick={() => setAdjustDialog(true)}
        />
      <HeaderBar
        title=""
        placeholder="Cari Nama Metode"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />
      </div>

      <TabelMetodePembayaran
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogMetodePembayaran
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
      />

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        dataMetodebayar={data}
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