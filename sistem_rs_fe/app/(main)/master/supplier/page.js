"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import TabelSupplier from "./components/tabelSupplier";
import FormSupplier from "./components/formDialogSupplier";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SupplierPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    SUPPLIERID: 0,
    NAMASUPPLIER: "",
    ALAMAT: "",
    KOTA: "",
    TELEPON: "",
    EMAIL: "",
    NAMASALES: "",
  });
  const [errors, setErrors] = useState({});
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });

  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchSupplier();
  }, []);

  const fetchSupplier = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/supplier`);
      setData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.NAMASUPPLIER?.trim()) newErrors.NAMASUPPLIER = 'Nama Supplier wajib diisi';
    if (!formData.ALAMAT?.trim()) newErrors.ALAMAT = 'Alamat wajib diisi';
    if (!formData.KOTA?.trim()) newErrors.KOTA = 'Kota wajib diisi';
    if (!formData.TELEPON?.trim()) newErrors.TELEPON = 'Telepon wajib diisi';
    if (!formData.EMAIL?.trim()) newErrors.EMAIL = 'Email wajib diisi';
    if (!formData.NAMASALES?.trim()) newErrors.NAMASALES = 'Nama Sales wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter((item) =>
        item.NAMASUPPLIER.toLowerCase().includes(keyword.toLowerCase()) ||
        item.NAMASALES.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!formData.SUPPLIERID;
    const url = isEdit
      ? `${API_URL}/supplier/${formData.SUPPLIERID}`
      : `${API_URL}/supplier`;

    try {
      if (isEdit) {
        await axios.put(url, formData);
        toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      } else {
        await axios.post(url, formData);
        toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
      }
      fetchSupplier();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setFormData({ ...row });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus Supplier ${row.NAMASUPPLIER}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/supplier/${row.SUPPLIERID}`);
          fetchPoli();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal menghapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
    SUPPLIERID: 0,
    NAMASUPPLIER: "",
    ALAMAT: "",
    KOTA: "",
    TELEPON: "",
    EMAIL: "",
    NAMASALES: "",
    });
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Supplier</h3>

      <div className="flex items-center justify-end">
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Atur Print Margin"
          onClick={() => setAdjustDialog(true)}
        />
      <HeaderBar
        title=""
        placeholder="Cari Nama Supplier"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />
      </div>

      <TabelSupplier
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormSupplier
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onChange={setFormData}
        onSubmit={handleSubmit}
        formData={formData}
        errors={errors}
      />

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        dataSupplier={data}
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

export default SupplierPage;