'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import FilterTanggal from '@/app/components/filterTanggal';
import TabelLaporanPembayaran from './components/tabelLaporanPembayaran';
import HeaderBar from '@/app/components/headerbar';
import { Button } from 'primereact/button';
import AdjustPrintMarginLaporan from './print/adjustPrintMarginLaporan';
import { Dialog } from 'primereact/dialog';
import dynamic from 'next/dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [adjustDialog, setAdjustDialog] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);

    const toastRef = useRef(null);
    const router = useRouter();

    const PDFViewer = dynamic(() => import('./print/PDFViewer'), { ssr: false });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/laporan_pembayaran`);
            setData(res.data.data);
            setOriginalData(res.data.data);
        } catch (err) {
            console.error('Gagal ambil data laporan pembayaran:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (keyword) => {
        if (!keyword) return setData(originalData);
        const filtered = originalData.filter(
            (item) =>
                item.NOINVOICE.toLowerCase().includes(keyword.toLowerCase()) ||
                item.NAMAPASIEN.toLowerCase().includes(keyword.toLowerCase())
        );
        setData(filtered);
    };

    const handleDateFilter = () => {
        if (!startDate && !endDate) return setData(originalData);
        const filtered = originalData.filter((item) => {
            const invoiceDate = new Date(item.TANGGALINVOICE);
            const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
            const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
            return (!from || invoiceDate >= from) && (!to || invoiceDate <= to);
        });
        setData(filtered);
    };

    const resetFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setData(originalData);
    };

    const handleDelete = (row) => {
        confirmDialog({
            message: `Hapus Invoice ${row.NOINVOICE}?`,
            header: 'Konfirmasi Hapus',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Ya',
            rejectLabel: 'Batal',
            accept: async () => {
                try {
                    await axios.delete(`${API_URL}/invoice/${row.IDINVOICE}`);
                    fetchData();
                    toastRef.current?.showToast('00', 'Data berhasil dihapus');
                } catch (err) {
                    console.error('Gagal hapus data invoice:', err);
                    toastRef.current?.showToast('01', 'Gagal menghapus data');
                }
            },
        });
    };

    return (
        <div className="card">
            <ToastNotifier ref={toastRef} />

            <ConfirmDialog />

            <h3 className="text-xl font-semibold mb-3">Manajemen Laporan Pembayaran</h3>

            <div className="flex flex-col md:flex-row justify-content-between md:items-center gap-4">
                <FilterTanggal
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    handleDateFilter={handleDateFilter}
                    resetFilter={resetFilter}
                />
                <div className="flex items-center gap-2">
                    <Button
                        icon="pi pi-print"
                        className="p-button-warning mt-3"
                        tooltip="Atur Print Margin"
                        onClick={() => setAdjustDialog(true)}
                    />
                    <HeaderBar
                        title=""
                        placeholder="Cari no invoice atau nama pasien..."
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <TabelLaporanPembayaran
                data={data}
                loading={loading}
                onDelete={handleDelete}
            />

            <AdjustPrintMarginLaporan
                adjustDialog={adjustDialog}
                setAdjustDialog={setAdjustDialog}
                selectedRow={null}
                dataLaporan={data}
                setPdfUrl={setPdfUrl}
                setFileName={setFileName}
                setJsPdfPreviewOpen={setJsPdfPreviewOpen}
            />

            <Dialog
                visible={jsPdfPreviewOpen}
                onHide={() => setJsPdfPreviewOpen(false)}
                modal
                style={{ width: '90vw', height: '90vh' }}
                header="Preview PDF"
            >
                <PDFViewer
                    pdfUrl={pdfUrl}
                    fileName={fileName}
                    paperSize="A4"
                />
            </Dialog>
        </div>
    );
};

export default Page; 