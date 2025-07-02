"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import TabelDokter from "./components/tabelDokter";
import FormDokter from "./components/formDialogDokter";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DokterPage = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    const [formData, setFormData] = useState({
        IDDOKTER: 0,
        NAMADOKTER: "",
        NAMAPOLI: "",
        JADWALPRAKTEK: ""
    });

    const toastRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetchDokter();
    }, []);

    const fetchDokter = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/dokter`);
            setData(res.data);
            setOriginalData(res.data);
        } catch (err) {
            console.error('Gagal mengambil data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (keyword) => {
        if (!keyword) {
            setData(originalData);
        } else {
            const filtered = originalData.filter((item) =>
                item.NAMADOKTER.toLowerCase().includes(keyword.toLowerCase())
            );
            setData(filtered);
        }
    };

    const handleSubmit = async () => {
    if (!formData.NAMADOKTER) {
        toastRef.current?.showToast('01', 'Nama Dokter wajib diisi!');
        return;
    }
    if (!formData.JADWALPRAKTEK) {
        toastRef.current?.showToast('01', 'Jadwal Praktek wajib diisi!');
        return;
    }

    const isEdit = !!formData.IDDOKTER;
    const url = isEdit
        ? `${API_URL}/dokter/${formData.IDDOKTER}`
        : `${API_URL}/dokter`;

    try {
        if (isEdit) {
            await axios.put(url, formData);
            toastRef.current?.showToast('00', 'Data berhasil diperbarui');
        } else {
            await axios.post(url, formData);
            toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
        }
        fetchDokter();
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
            message: `Apakah Anda yakin ingin menghapus Dokter ${row.NAMADOKTER}?`,
            header: 'Konfirmasi Hapus',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Ya',
            rejectLabel: 'Batal',
            accept: async () => {
                try {
                    await axios.delete(`${API_URL}/dokter/${row.IDDOKTER}`);
                    fetchDokter();
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
            IDDOKTER: 0,
            NAMADOKTER: "",
            NAMAPOLI: "",
            JADWALPRAKTEK: ""
        });
    };

    return (
        <div className="card">
            <ToastNotifier ref={toastRef} />
            <ConfirmDialog />

            <h3 className="text-xl font-semibold mb-3">Master Dokter</h3>

            <HeaderBar
                title=""
                placeholder="Cari Nama Dokter..."
                onSearch={handleSearch}
                onAddClick={() => {
                    resetForm();
                    setDialogVisible(true);
                }}
            />

            <TabelDokter
                data={data}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <FormDokter
                visible={dialogVisible}
                onHide={() => {
                    setDialogVisible(false);
                    resetForm();
                }}
                onChange={setFormData}
                onSubmit={handleSubmit}
                formData={formData}
            />
        </div>
    );
};

export default DokterPage;
