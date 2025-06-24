'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Reservasi } from './components/reservasi';
import TabelReservasiPasien from './components/tabelReservasi';
import FormReservasiPasien from './components/formReservasi';

const ReservasiPasienPage = () => {
    const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    const [formData, setFormData] = useState<Reservasi>({
        NIK: '',
        POLI: '',
        NAMADOKTER: '',
        TANGGALRESERVASI: '',
        JAMRESERVASI: '',
        STATUS: 'Menunggu',
        KETERANGAN: '',
    });

    const fetchReservasi = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:4000/api/reservasi');
            setReservasiList(res.data);
        } catch (err) {
            console.error('Gagal mengambil data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const isEdit = !!formData.IDRESERVASI;
        const url = isEdit
            ? `http://localhost:4000/api/reservasi/${formData.IDRESERVASI}`
            : 'http://localhost:4000/api/reservasi';

        try {
            if (isEdit) {
                await axios.put(url, formData);
            } else {
                await axios.post(url, formData);
            }
            fetchReservasi();
            setDialogVisible(false);
            resetForm();
        } catch (err) {
            console.error('Gagal menyimpan data:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            NIK: '',
            POLI: '',
            NAMADOKTER: '',
            TANGGALRESERVASI: '',
            JAMRESERVASI: '',
            STATUS: 'Menunggu',
            KETERANGAN: '',
        });
    };

    const handleEdit = (row: Reservasi) => {
        setFormData(row);
        setDialogVisible(true);
    };

    const handleDelete = async (row: Reservasi) => {
        try {
            await axios.delete(`http://localhost:4000/api/reservasi/${row.IDRESERVASI}`);
            fetchReservasi();
        } catch (err) {
            console.error('Gagal menghapus data:', err);
        }
    };

    useEffect(() => {
        fetchReservasi();
    }, []);

    return (
        <div className="card">
            <h3 className="text-xl font-semibold">Reservasi Pasien</h3>

            <div className="flex justify-content-end my-3">
                <Button label="Tambah Reservasi" icon="pi pi-plus" onClick={() => setDialogVisible(true)} />
            </div>

            <TabelReservasiPasien
                data={reservasiList}
                loading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <FormReservasiPasien
                visible={dialogVisible}
                formData={formData}
                onHide={() => {
                    setDialogVisible(false);
                    resetForm();
                }}
                onChange={setFormData}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default ReservasiPasienPage;
