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
    IDTENAGAMEDIS: "",
    IDPOLI: "",
    JADWAL: [
        { HARI: "Senin", JAM_MULAI: "", JAM_SELESAI: "" },
        { HARI: "Selasa", JAM_MULAI: "", JAM_SELESAI: "" },
        { HARI: "Rabu", JAM_MULAI: "", JAM_SELESAI: "" },
        { HARI: "Kamis", JAM_MULAI: "", JAM_SELESAI: "" },
        { HARI: "Jum'at", JAM_MULAI: "", JAM_SELESAI: "" }
    ]
    });

    const [poliOptions, setPoliOptions] = useState([]);
    const [tenagaOptions, setTenagaOptions] = useState([]);

    const toastRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetchDokter();
        fetchPoli();
        fetchTenaga();
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
    const fetchPoli = async () => {
         try {
    const res = await axios.get(`${API_URL}/poli`);
    console.log('Data poli API:', res.data);
    const options = res.data.map((poli) => ({
      label: `${poli.IDPOLI} - ${poli.NAMAPOLI}`,
      value: poli.IDPOLI,
      }));

    setPoliOptions(options);
      } catch (err) {
    console.error('Gagal ambil data poli:', err);
      }
    };

    const fetchTenaga = async () => {
         try {
    const res = await axios.get(`${API_URL}/tenaga_medis`);
    console.log('Data tenaga medis API:', res.data);
    const options = res.data.data.map((master_tenaga_medis) => ({
      label: `${master_tenaga_medis.NAMALENGKAP} - ${master_tenaga_medis.JENISTENAGAMEDIS}`,
      value: master_tenaga_medis.IDTENAGAMEDIS,
      }));

    setTenagaOptions(options);
      } catch (err) {
    console.error('Gagal ambil data tenaga:', err);
      }
    };

    const handleSearch = (keyword) => {
        if (!keyword) {
            setData(originalData);
        } else {
            const filtered = originalData.filter((item) =>
                item.IDDOKTER.toLowerCase().includes(keyword.toLowerCase())
            );
            setData(filtered);
        }
    };

    const handleSubmit = async () => {
    if (!formData.IDTENAGAMEDIS) {
        toastRef.current?.showToast('01', 'Nama Dokter wajib diisi!');
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

const parseJadwalPraktek = (text) => {
    if (!text) return [];

    return text.split(',').map((slot) => {
        const trimmed = slot.trim(); // "Senin 10:00 - 12:00"
        const firstSpaceIndex = trimmed.indexOf(' ');
        const hari = trimmed.substring(0, firstSpaceIndex); // Senin
        const jamString = trimmed.substring(firstSpaceIndex + 1); // "10:00 - 12:00"

        const [mulai, selesai] = jamString.split('-').map(j => j.trim()); // "10:00", "12:00"

        return {
            HARI: hari,
            JAM_MULAI: mulai,
            JAM_SELESAI: selesai,
        };
    });
};

const handleEdit = (row) => {
    const jadwal = parseJadwalPraktek(row.JADWALPRAKTEK);

    setFormData({
        IDDOKTER: row.IDDOKTER,
        IDTENAGAMEDIS: row.IDTENAGAMEDIS,
        IDPOLI: row.IDPOLI,
        JADWAL: jadwal
    });

    setDialogVisible(true);
};

    const handleDelete = (row) => {
        confirmDialog({
            message: `Apakah Anda yakin ingin menghapus Dokter ${row.IDDOKTER}?`,
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
        IDTENAGAMEDIS: "",
        IDPOLI: "",
        JADWAL: []
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
                poliOptions={poliOptions}
                tenagaOptions={tenagaOptions}
                
            />
        </div>
    );
};

export default DokterPage;
