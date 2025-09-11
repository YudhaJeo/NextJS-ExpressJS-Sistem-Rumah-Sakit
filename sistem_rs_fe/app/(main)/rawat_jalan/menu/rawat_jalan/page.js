"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import ToastNotifier from "@/app/components/toastNotifier";
import FilterTanggal from "@/app/components/filterTanggal";
import FormDialogRawatJalan from "./components/formDialogRiwayat";
import TabelRawatJalan from "./components/tabelRiwayat";
import { Toast } from "primereact/toast";
import HeaderBar from "@/app/components/headerbar";
import DetailRawatJalan from "./components/detailRawatJalan";
import { Button } from "primereact/button";
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialForm = () => ({
  IDRAWATJALAN: "",
  IDDOKTER: "",
  IDPENDAFTARAN: "",
  STATUSKUNJUNGAN: "Dalam Antrian",
  STATUSRAWAT: "Rawat Jalan",
  DIAGNOSA: "",
  KETERANGAN: "",
  FOTORESEP: null,
  fotoResepLama: null,
});

const RawatJalanPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState(initialForm());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dokterOptions, setDokterOptions] = useState([]);
  const [pendaftaranOptions, setPendaftaranOptions] = useState([]);
  const [unitKerja, setUnitKerja] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRawat, setSelectedRawat] = useState(null); 
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });

  const toastRef = useRef(null);
  const toastUpload = useRef(null);

  async function fetchDokter() {
    try {
      const res = await axios.get(`${API_URL}/dokter`);
      const options = res.data.map((dokter) => ({
        label: dokter.NAMALENGKAP,
        value: dokter.IDDOKTER,
      }));
      setDokterOptions(options);
    } catch (err) {
      console.error("Gagal ambil data Dokter:", err);
    }
  }

  const fetchData = async (poliFilter) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/rawat_jalan`);
      let list = res.data.data || [];

      if (poliFilter) {
        list = list.filter((item) => item.POLI === poliFilter);
      }

      setData(list);
      setOriginalData(list);

      const daftarRes = await axios.get(`${API_URL}/pendaftaran`);
      let options = daftarRes.data.data;

      if (poliFilter) {
        options = options.filter((item) => item.POLI === poliFilter);
      }

      options = options.map((item) => {
        const d = new Date(item.TANGGALKUNJUNGAN);
        const tanggalFormatted = `${d.getDate().toString().padStart(2, "0")}-${(
          d.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${d.getFullYear()}`;
        return {
          label: `${item.NAMALENGKAP} - ${tanggalFormatted}`,
          value: item.IDPENDAFTARAN,
        };
      });

      setPendaftaranOptions(options);
    } catch (err) {
      console.error("Gagal ambil data monitoring:", err);
      toastRef.current?.showToast("01", "Gagal mengambil data dari server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const poliUser = Cookies.get("unitKerja");
    const roleUser = Cookies.get("role");
    setUnitKerja(roleUser === "Super Admin" ? null : poliUser || null);
    fetchData(roleUser === "Super Admin" ? null : poliUser || null);
    fetchDokter();
  }, []);

  const resetForm = () => setForm(initialForm());

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleDetail = (row) => {
    setSelectedRawat(row);
    setDetailVisible(true);
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

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("IDDOKTER", form.IDDOKTER);
      formData.append("IDPENDAFTARAN", form.IDPENDAFTARAN);
      formData.append("STATUSKUNJUNGAN", form.STATUSKUNJUNGAN);
      formData.append("STATUSRAWAT", form.STATUSRAWAT);
      formData.append("DIAGNOSA", form.DIAGNOSA);
      formData.append("KETERANGAN", form.KETERANGAN);
      if (!form.FOTORESEP && form.fotoResepLama) {
        formData.append("fotoResepLama", form.fotoResepLama);
      }
      if (form.FOTORESEP) {
        formData.append("FOTORESEP", form.FOTORESEP);
      }

      if (form.IDRAWATJALAN) {
        await axios.put(`${API_URL}/rawat_jalan/${form.IDRAWATJALAN}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toastRef.current?.showToast("00", "Data berhasil diperbarui");
      }

      fetchData(unitKerja);
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal simpan data:", err);
      toastRef.current?.showToast("01", "Gagal menyimpan data");
    }
  };

  const handleEdit = (row) => {
    setForm({
      IDRAWATJALAN: row.IDRAWATJALAN,
      IDDOKTER: row.IDDOKTER || "",
      IDPENDAFTARAN: row.IDPENDAFTARAN || "",
      STATUSKUNJUNGAN: row.STATUSKUNJUNGAN || "Dalam Antrian",
      STATUSRAWAT: row.STATUSRAWAT || "Rawat Jalan",
      DIAGNOSA: row.DIAGNOSA || "",
      KETERANGAN: row.KETERANGAN || "",
      FOTORESEP: null,
      fotoResepLama: row.FOTORESEP || null,
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus data RawatJalan untuk ${row.IDRAWATJALAN}?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/rawat_jalan/${row.IDRAWATJALAN}`);
          await axios.delete(`${API_URL}/pendaftaran/${row.IDPENDAFTARAN}`);
          toastRef.current?.showToast("00", "Data berhasil dihapus");
          fetchData(unitKerja);
        } catch (err) {
          console.error("Gagal hapus data:", err);
          toastRef.current?.showToast("01", "Gagal menghapus data");
        }
      },
    });
  };

  return (
    <div className="card p-4">
      <ToastNotifier ref={toastRef} />
      <Toast ref={toastUpload} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Monitoring Rawat Jalan</h3>

      <div className="flex flex-col md:flex-row justify-content-between items-center gap-4 mb-4">
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
          tooltip="Atur Print Margin"
          onClick={() => {
            handleDateFilter();
            setAdjustDialog(true);
          }}
        />
        <HeaderBar
          title=""
          placeholder="Cari nama pasien atau status kunjungan"
          onSearch={(keyword) => {
            if (!keyword) return fetchData();
            const filtered = data.filter(
              (item) =>
                item.STATUSKUNJUNGAN.toLowerCase().includes(keyword.toLowerCase()) ||
                item.NAMALENGKAP.toLowerCase().includes(keyword.toLowerCase())
            );
            setData(filtered);
          }}
        />
      </div>
      </div>

      <TabelRawatJalan
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={handleDetail}
      />
      
      <DetailRawatJalan
        visible={detailVisible}
        onHide={() => setDetailVisible(false)}
        rawatJalan={selectedRawat}
      />

      <FormDialogRawatJalan
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        dokterOptions={dokterOptions}
        pendaftaranOptions={pendaftaranOptions}
      />

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        dataRajal={data}
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

export default RawatJalanPage;