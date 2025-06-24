'use client';

import { Reservasi } from './reservasi';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

interface Props {
    visible: boolean;
    formData: Reservasi;
    onHide: () => void;
    onChange: (data: Reservasi) => void;
    onSubmit: () => void;
}

const FormReservasiPasien = ({ visible, formData, onHide, onChange, onSubmit }: Props) => {
    return (
        <Dialog
            header={formData.IDRESERVASI ? 'Edit Reservasi' : 'Tambah Reservasi'}
            visible={visible}
            onHide={onHide}
            style={{ width: '40vw' }}
        >
            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <div>
                    <label>NIK</label>
                    <InputText
                        className="w-full mt-2"
                        value={formData.NIK}
                        onChange={(e) => onChange({ ...formData, NIK: e.target.value })}
                    />
                </div>
                <div>
                    <label>Poli</label>
                    <InputText
                        className="w-full mt-2"
                        value={formData.POLI}
                        onChange={(e) => onChange({ ...formData, POLI: e.target.value })}
                    />
                </div>
                <div>
                    <label>Nama Dokter</label>
                    <InputText
                        className="w-full mt-2"
                        value={formData.NAMADOKTER}
                        onChange={(e) => onChange({ ...formData, NAMADOKTER: e.target.value })}
                    />
                </div>
                <div>
                    <label>Tanggal Reservasi</label>
                    <InputText
                        type="date"
                        className="w-full mt-2"
                        value={formData.TANGGALRESERVASI}
                        onChange={(e) => onChange({ ...formData, TANGGALRESERVASI: e.target.value })}
                    />
                </div>
                <div>
                    <label>Jam Reservasi</label>
                    <InputText
                        type="time"
                        className="w-full mt-2"
                        value={formData.JAMRESERVASI}
                        onChange={(e) => onChange({ ...formData, JAMRESERVASI: e.target.value })}
                    />
                </div>
                <div>
                    <label>Status</label>
                    <InputText
                        className="w-full mt-2"
                        value={formData.STATUS}
                        onChange={(e) =>
                            onChange({
                                ...formData,
                                STATUS: e.target.value as 'Menunggu' | 'Dikonfirmasi' | 'Dibatalkan',
                            })
                        }
                    />
                </div>
                <div>
                    <label>Keterangan</label>
                    <InputText
                        className="w-full mt-2"
                        value={formData.KETERANGAN}
                        onChange={(e) => onChange({ ...formData, KETERANGAN: e.target.value })}
                    />
                </div>

                <div className="text-right pt-3">
                    <Button type="submit" label="Simpan" icon="pi pi-save" />
                </div>
            </form>
        </Dialog>
    );
};

export default FormReservasiPasien;
