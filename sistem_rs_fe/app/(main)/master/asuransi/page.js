'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import TabelAsuransi from './components/tabelAsuransi';
import FormDialogAsuransi from './components/formDialogAsuransi';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from "primereact/button";
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState({ NAMAASURANSI: '', KETERANGAN: '' });
  const [errors, setErrors] = useState({});
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });

  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/asuransi`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.NAMAASURANSI.trim()) newErrors.NAMAASURANSI = 'Nama asuransi wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDASURANSI;
    const url = isEdit
      ? `${API_URL}/asuransi/${form.IDASURANSI}`
      : `${API_URL}/asuransi`;

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
      setForm({ NAMAASURANSI: '', KETERANGAN: '' });
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setForm(row);
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin hapus '${row.NAMAASURANSI}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/asuransi/${row.IDASURANSI}`);
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

      <h3 className="text-xl font-semibold mb-3">Master Asuransi</h3>

      <div className="flex items-center justify-end">
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Cetak Data"
          onClick={() => setAdjustDialog(true)}
        />
      <HeaderBar
        title=""
        placeholder="Cari nama asuransi"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter((item) =>
            item.NAMAASURANSI.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
        onAddClick={() => {
          setForm({ NAMAASURANSI: '', KETERANGAN: '' });
          setDialogVisible(true);
        }}
      />
      </div>

      <TabelAsuransi
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogAsuransi
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm({ NAMAASURANSI: '', KETERANGAN: '' });
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
      />

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        dataAsuransi={data}
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