'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelKamar from './components/tabelKamar';
import FormDialogKamar from './components/formDialogKamar';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from "primereact/button";
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const toastRef = useRef(null);

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [bangsalOptions, setBangsalOptions] = useState([]);

  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });

  const [form, setForm] = useState({
    IDKAMAR: '',
    NAMAKAMAR: '',
    IDBANGSAL: '',
    KAPASITAS: '',
    KETERANGAN: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
    fetchBangsal();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/kamar`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data kamar:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBangsal = async () => {
    try {
      const res = await axios.get(`${API_URL}/bangsal`);
      const options = res.data.data.map((item) => ({
        label: `${item.NAMABANGSAL} - ${item.NAMAJENIS}`,
        value: item.IDBANGSAL,
        NAMAJENIS: item.NAMAJENIS,
      }));
      setBangsalOptions(options);
    } catch (err) {
      console.error('Gagal ambil bangsal:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.NAMAKAMAR?.trim()) {
      newErrors.NAMAKAMAR = 'Nama kamar wajib diisi';
    }

    if (!form.IDBANGSAL) {
      newErrors.IDBANGSAL = 'Bangsal wajib dipilih';
    }

    if (!form.KAPASITAS || isNaN(form.KAPASITAS)) {
      newErrors.KAPASITAS = 'Kapasitas harus berupa angka';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      IDKAMAR: '',
      NAMAKAMAR: '',
      IDBANGSAL: '',
      KAPASITAS: '',
      KETERANGAN: '',
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDKAMAR;
    const url = isEdit
      ? `${API_URL}/kamar/${form.IDKAMAR}`
      : `${API_URL}/kamar`;

    try {
      if (isEdit) {
        await axios.put(url, form);
        toastRef.current?.showToast('00', 'Data kamar berhasil diperbarui');
      } else {
        await axios.post(url, form);
        toastRef.current?.showToast('00', 'Data kamar berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data kamar:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data kamar');
    }
  };

  const handleEdit = (row) => {
    setForm({ ...row });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus kamar '${row.NAMAKAMAR}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/kamar/${row.IDKAMAR}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data kamar berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus kamar:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data kamar');
        }
      },
    });
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter((item) =>
        item.NAMAKAMAR.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Manajemen Data Kamar</h3>

      <div className='flex items-center justify-end'>
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Cetak Data"
          onClick={() => setAdjustDialog(true)}
        />
        <HeaderBar
          title=""
          placeholder="Cari nama kamar"
          onSearch={handleSearch}
          onAddClick={() => {
            resetForm();
            setDialogVisible(true);
          }}
        />
      </div>

      <TabelKamar
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogKamar
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        bangsalOptions={bangsalOptions}
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