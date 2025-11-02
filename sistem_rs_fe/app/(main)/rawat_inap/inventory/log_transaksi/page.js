'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import TabelPemesanan from "./components/tabelTransaksi"; 
import DetailMasuk from "./components/detailMasuk";
import DetailKeluar from "./components/detailKeluar";
import FilterTanggal from "@/app/components/filterTanggal";
import { Button } from "primereact/button";
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MonitoringPemesananPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pemesananRes, obatInapRes, alkesInapRes] = await Promise.all([
        axios.get(`${API_URL}/pemesanan`),
        axios.get(`${API_URL}/obat_inap`),
        axios.get(`${API_URL}/alkes_inap`)
      ]);
  
      const pemesananList = (Array.isArray(pemesananRes.data) ? pemesananRes.data : pemesananRes.data.data)
        .filter(item => item.STATUS === 'DITERIMA');
  
        const pemesananDetailData = await Promise.all(
          pemesananList.map(async (item) => {
            try {
              const res = await axios.get(`${API_URL}/pemesanan/${item.IDPEMESANAN}`);
              const detailList = res.data.details || []; 
        
              const { jumlah, total } = detailList.reduce(
                (acc, d) => {
                  acc.jumlah += d.QTY;
                  acc.total += d.QTY * d.HARGABELI;
                  return acc;
                },
                { jumlah: 0, total: 0 }
              );
        
              return {
                ID: item.IDPEMESANAN,
                TANGGAL: item.TGLPEMESANAN,
                SUPPLIER: item.NAMASUPPLIER,
                STATUS: 'MASUK',
                TIPE: 'PEMESANAN',
                JUMLAH: jumlah,
                TOTAL: total,
                ...item,
                detail: detailList
              };
            } catch (err) {
              console.error(`Gagal fetch detail untuk ID ${item.IDPEMESANAN}:`, err);
              return {
                ID: item.IDPEMESANAN,
                TANGGAL: item.TGLPEMESANAN,
                SUPPLIER: item.NAMASUPPLIER,
                STATUS: 'MASUK',
                TIPE: 'PEMESANAN',
                JUMLAH: 0,
                TOTAL: 0,
                ...item,
                detail: []
              };
            }
          })
        );        
  
      const obatInapData = (obatInapRes.data.data || []).map(item => ({
        ID: item.IDOBATINAP,
        TANGGAL: item.WAKTUPEMBERIAN,
        SUPPLIER: item.NAMAOBAT, 
        STATUS: 'KELUAR',
        TIPE: 'OBAT_INAP',
        ...item
      }));
  
      const alkesInapData = (alkesInapRes.data.data || []).map(item => ({
        ID: item.IDALKESINAP,
        TANGGAL: item.WAKTUPEMBERIAN,
        SUPPLIER: item.NAMAALKES, 
        STATUS: 'KELUAR',
        TIPE: 'ALKES_INAP',
        ...item
      }));
      const merged = [...pemesananDetailData, ...obatInapData, ...alkesInapData];
  
      const sortedData = merged.sort((a, b) => new Date(b.TANGGAL) - new Date(a.TANGGAL));

      setData(sortedData);
      setOriginalData(sortedData);
    } catch (err) {
      console.error("Gagal mengambil data transaksi:", err);
      toastRef.current?.showToast("01", "Gagal memuat data transaksi");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDetail = async (row) => {
    try {
      if (row.TIPE === 'PEMESANAN') {
        const res = await axios.get(`${API_URL}/pemesanan/${row.IDPEMESANAN}`);
        setDetailData({ ...res.data, TIPE: 'PEMESANAN' }); 
      } else {
        setDetailData(row); 
      }
      setDetailVisible(true);
    } catch (err) {
      toastRef.current?.showToast("01", "Gagal memuat detail transaksi");
    }
  };  

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGAL);
      const from = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const to = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      return (!from || visitDate >= from) && (!to || visitDate <= to);
    });
    const sortedFiltered = filtered.sort((a, b) => new Date(b.TANGGAL) - new Date(a.TANGGAL));
    setData(sortedFiltered);
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter((item) =>
        item.NAMASUPPLIER?.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <h3 className="text-xl font-semibold mb-3">Transaksi Stok Obat dan Alat Kesehatan</h3>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <FilterTanggal
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateFilter={handleDateFilter}
          resetFilter={resetFilter}
        />
        <div className='flex items-center justify-end'>
          <Button
            icon="pi pi-print"
            className="p-button-warning mt-3"
            tooltip="Cetak Data"
            onClick={() => setAdjustDialog(true)}
          />
          <HeaderBar
            placeholder="Cari berdasarkan supplier atau ID pemesanan..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      <TabelPemesanan data={data} loading={loading} onDetail={handleDetail} />

      {detailData?.TIPE === 'PEMESANAN' ? (
        <DetailMasuk
          visible={detailVisible}
          onHide={() => setDetailVisible(false)}
          data={detailData}
        />
      ) : detailData ? (
        <DetailKeluar
          visible={detailVisible}
          onHide={() => setDetailVisible(false)}
          data={detailData}
        />
      ) : null}

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

export default MonitoringPemesananPage;
