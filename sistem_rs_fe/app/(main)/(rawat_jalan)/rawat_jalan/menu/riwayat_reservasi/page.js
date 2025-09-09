'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import TabelReservasiRajal from './components/tabelriwayat';
import FilterTanggal from '@/app/components/filterTanggal';
import AdjustPrintMarginLaporan from "./components/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";
import { Button } from "primereact/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const toastRef = useRef(null);
  const router = useRouter();

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const PDFViewer = dynamic(() => import("./components/PDFViewer"), { ssr: false });
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      const res = await axios.get(`${API_URL}/reservasi`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const responseData = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      const filtered = responseData.filter(item => item.STATUS === 'Dikonfirmasi');
      setData(filtered);
      setOriginalData(filtered);
    } catch (err) {
      console.error('Gagal fetch reservasi rajal:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data reservasi rajal');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);

    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALRESERVASI);
      const from = startDate
        ? new Date(new Date(startDate).setHours(0, 0, 0, 0))
        : null;
      const to = endDate
        ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
        : null;
      return (!from || visitDate >= from) && (!to || visitDate <= to);
    });

    setData(filtered);
  };

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleSearch = (keyword) => {
    if (!keyword) return setData(originalData);

    const filtered = originalData.filter((item) => {
      const nama = item.NAMALENGKAP?.toLowerCase() || '';
      const nik = item.NIK?.toLowerCase() || '';
      return (
        nama.includes(keyword.toLowerCase()) ||
        nik.includes(keyword.toLowerCase())
      );
    });

    setData(filtered);
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <h3 className="text-xl font-semibold mb-3">Riwayat Reservasi</h3>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
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
                  onClick={() => setAdjustDialog(true)}
                />
                <HeaderBar
                  placeholder="Cari nama dokter/pasien..."
                  onSearch={handleSearch}
                />
                </div>
      </div>

      <TabelReservasiRajal data={data} loading={loading} />
      <AdjustPrintMarginLaporan
              adjustDialog={adjustDialog}
              setAdjustDialog={setAdjustDialog}
              selectedRow={null}
              dataReservasi={data}
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
