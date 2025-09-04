'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelJenis from './components/tabelJenisBangsal';
import FormDialog from './components/formDialogBangsal';
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

  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });

  const [form, setForm] = useState({
    NAMAJENIS: '',
    HARGAPERHARI: null,
    FASILITAS: '',
  });

  const [errors, setErrors] = useState({});
  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/jenis_bangsal`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.NAMAJENIS.trim()) {
      newErrors.NAMAJENIS = (
        <span style={{ color: 'red' }}>Jenis bangsal wajib diisi</span>
      );
    }

    if (
      form.HARGAPERHARI === null ||
      form.HARGAPERHARI === undefined ||
      isNaN(form.HARGAPERHARI)
    ) {
      newErrors.HARGAPERHARI = (
        <span style={{ color: 'red' }}>Harga wajib diisi</span>
      );
    }

    if (!form.FASILITAS.trim()) {
      newErrors.FASILITAS = (
        <span style={{ color: 'red' }}>Fasilitas wajib diisi</span>
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDJENISBANGSAL;
    const url = isEdit
      ? `${API_URL}/jenis_bangsal/${form.IDJENISBANGSAL}`
      : `${API_URL}/jenis_bangsal`;

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
      setForm({
        NAMAJENIS: '',
        HARGAPERHARI: null,
        FASILITAS: '',
      });
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
      message: `Yakin hapus '${row.NAMAJENIS}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/jenis_bangsal/${row.IDJENISBANGSAL}`);
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

      <h3 className="text-xl font-semibold mb-3">Master Jenis Bangsal</h3>

      <div className='flex items-center justify-end'>
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Atur Print Margin"
          onClick={() => setAdjustDialog(true)}
        />
        <HeaderBar
          title=""
          placeholder="Cari jenis bangsal"
          onSearch={(keyword) => {
            if (!keyword) return fetchData();
            const filtered = data.filter((item) =>
              item.NAMAJENIS.toLowerCase().includes(keyword.toLowerCase())
            );
            setData(filtered);
          }}
          onAddClick={() => {
            setForm({
              NAMAJENIS: '',
              HARGAPERHARI: null,
              FASILITAS: '',
            });
            setDialogVisible(true);
          }}
        />
      </div>

      <TabelJenis
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm({ NAMAJENIS: '' });
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
