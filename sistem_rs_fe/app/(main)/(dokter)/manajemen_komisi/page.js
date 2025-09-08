"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import TabelKomisiDokter from "./components/tabelKomisi";
import FormDialogKomisi from "./components/formDialogKomisi";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import AdjustPrintMarginLaporan from "./components/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";
import { Button } from "primereact/button";
import FilterTanggal from "@/app/components/filterTanggal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const KomisiPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [allRiwayatOptions, setAllRiwayatOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const PDFViewer = dynamic(() => import("./components/PDFViewer"), { ssr: false });
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const [formData, setFormData] = useState({
    IDKOMISI: 0,
    IDRAWATJALAN: "",
    NIK: "",
    NAMAPASIEN: "",
    NAMADOKTER: "",
    TANGGAL: "",
    NILAIKOMISI: "",
    STATUS: "",
    KETERANGAN: "",
  });

  const [riwayatOptions, setRiwayatOptions] = useState([]);
  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchRiwayat();
  }, []);

  useEffect(() => {
    if (formData.IDRAWATJALAN && allRiwayatOptions.length > 0) {
      const selected = allRiwayatOptions.find(
        (opt) => String(opt.value) === String(formData.IDRAWATJALAN)
      );
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          NIK: selected.NIK,
          NAMAPASIEN: selected.NAMAPASIEN,
          NAMADOKTER: selected.NAMADOKTER,
          TANGGAL: selected.TANGGAL,
        }));
      }
    }
  }, [formData.IDRAWATJALAN, allRiwayatOptions]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/komisi_dokter`);
      console.log("komisi_dokter:", res.data);
      setData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date);
  };

  const fetchRiwayat = async () => {
    try {
      const res = await axios.get(`${API_URL}/rawat_jalan`);
      console.log("rawat_jalan:", res.data);
      const options = res.data.data.map((item) => ({
        label: `${item.NAMADOKTER} - ${item.NAMALENGKAP} (${formatTanggal(item.TANGGALKUNJUNGAN)})`,
        value: item.IDRAWATJALAN,
        NIK: item.NIK,
        NAMAPASIEN: item.NAMALENGKAP,
        NAMADOKTER: item.NAMADOKTER,
        TANGGAL: formatTanggal(item.TANGGALKUNJUNGAN),
      }));
      setRiwayatOptions(options);
      setAllRiwayatOptions(options);
    } catch (err) {
      console.error("Gagal ambil data Riwayat:", err);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter((item) =>
        item.NAMAPASIEN?.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    const {
      IDRAWATJALAN,
      NILAIKOMISI,
      STATUS,
      KETERANGAN,
    } = formData;

    if (!IDRAWATJALAN || !NILAIKOMISI || !STATUS) {
      toastRef.current?.showToast("01", "Field wajib tidak boleh kosong!");
      return;
    }

    const isEdit = !!formData.IDKOMISI;
    const url = isEdit
      ? `${API_URL}/komisi_dokter/${formData.IDKOMISI}`
      : `${API_URL}/komisi_dokter`;

    try {
      if (isEdit) {
        await axios.put(url, formData);
        toastRef.current?.showToast("00", "Data berhasil diperbarui");
      } else {
        await axios.post(url, formData);
        toastRef.current?.showToast("00", "Data berhasil ditambahkan");
      }
      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal simpan:", err);
      toastRef.current?.showToast("01", "Gagal menyimpan data");
    }
  };

  const handleEdit = (row) => {
    const selected = allRiwayatOptions.find(
      (opt) => String(opt.value) === String(row.IDRAWATJALAN)
    );
    setFormData({
      IDKOMISI: row.IDKOMISI,
      IDRAWATJALAN: row.IDRAWATJALAN,
      NIK: selected?.NIK || row.NIK || "",
      NAMAPASIEN: selected?.NAMAPASIEN || row.NAMAPASIEN || "",
      NAMADOKTER: selected?.NAMADOKTER || row.NAMADOKTER || "",
      TANGGAL: selected?.TANGGAL || row.TANGGAL || "",
      NILAIKOMISI: row.NILAIKOMISI,
      STATUS: row.STATUS,
      KETERANGAN: row.KETERANGAN,
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus data komisi untuk pasien ${row.NAMAPASIEN}?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/komisi_dokter/${row.IDKOMISI}`);
          fetchData();
          toastRef.current?.showToast("00", "Berhasil dihapus");
        } catch (err) {
          console.error("Gagal hapus:", err);
          toastRef.current?.showToast("01", "Gagal hapus data");
        }
      },
    });
  };
  
  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALKUNJUNGAN);
      const from = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const to = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      return (!from || visitDate >= from) && (!to || visitDate <= to);
    });
    setData(filtered);
  };

  const resetForm = () => {
    setFormData({
      IDKOMISI: 0,
      IDRAWATJALAN: "",
      NIK: "",
      NAMAPASIEN: "",
      NAMADOKTER: "",
      TANGGAL: "",
      NILAIKOMISI: "",
      STATUS: "",
      KETERANGAN: "",
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Manajemen Komisi Dokter</h3>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <FilterTanggal
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateFilter={handleDateFilter}
          resetFilter={resetFilter}
        />
        <div className="flex items-center justify-end">
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Cetak Data"
          onClick={() => setAdjustDialog(true)}
        />
        <HeaderBar
          placeholder="Cari nama dokter/pasien..."
          onSearch={handleSearch}
          onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
        />
        </div>
      </div>

      <TabelKomisiDokter
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogKomisi
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onChange={setFormData}
        onSubmit={handleSubmit}
        formData={formData}
        riwayatOptions={riwayatOptions}
        allRiwayatOptions={allRiwayatOptions}
      />
          <AdjustPrintMarginLaporan
                  adjustDialog={adjustDialog}
                  setAdjustDialog={setAdjustDialog}
                  selectedRow={null}
                  dataKomisi={data}
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

export default KomisiPage;
