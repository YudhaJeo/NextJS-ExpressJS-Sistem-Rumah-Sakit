"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const FormDialogDokter = ({ visible, formData, onHide, onChange, onSubmit }) => {
    return (
        <Dialog
            header={formData.IDDOKTER ? "Edit Dokter" : "Tambah Dokter"}
            visible={visible}
            onHide={onHide}
            style={{ width: "30vw" }}
        >
            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <div>
                    <label>Nama Dokter</label>
                    <InputText
                        className="w-full mt-2"
                        value={formData.NAMADOKTER}
                        onChange={(e) => onChange({ ...formData, NAMADOKTER: e.target.value })}
                    />
                </div>

                <div>
                    <label>Nama Poli</label>
                    <InputText
                        className="w-full mt-2"
                        value={formData.NAMAPOLI}
                        onChange={(e) => onChange({ ...formData, NAMAPOLI: e.target.value })}
                    />
                </div>

                <div>
                    <label>Jadwal Praktek</label>
                    <InputText
                        type="date"
                        className="w-full mt-2"
                        value={formData.JADWALPRAKTEK}
                        onChange={(e) => onChange({ ...formData, JADWALPRAKTEK: e.target.value })}
                    />
                </div>

                <div className="text-right pt-3">
                    <Button type="submit" label="Simpan" icon="pi pi-save" />
                </div>
            </form>
        </Dialog>
    );
};

export default FormDialogDokter;
