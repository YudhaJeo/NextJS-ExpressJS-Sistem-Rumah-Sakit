"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const FormDialogDokter = ({ visible, formData, onHide, onChange, onSubmit, poliOptions }) => {
    const hariOptions = [
        { label: "Senin - Kamis", value: "Senin - Kamis" },
        { label: "Jumat - Minggu", value: "Jumat - Minggu" },
        { label: "Setiap Hari", value: "Setiap Hari" }
    ];

    const jamOptions = [
        { label: "01:00 - 05:00", value: "01:00 - 05:00" },
        { label: "07:00 - 12:00", value: "07:00 - 12:00" },
        { label: "13:00 - 17:00", value: "13:00 - 17:00" },
        { label: "19:00 - 22:00", value: "19:00 - 22:00" }
    ];

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
                    <Dropdown
                        className="w-full mt-2"
                        options={poliOptions}
                        value={formData.IDPOLI}
                        onChange={(e) => onChange({ ...formData, IDPOLI: e.value })}
                        placeholder="Pilih Poli"
                        filter
                        showClear
                    />
                </div>

                <div>
                    <label>Hari Praktek</label>
                    <Dropdown
                        className="w-full mt-2"
                        options={hariOptions}
                        value={formData.HARI_PRAKTEK}
                        onChange={(e) => onChange({ ...formData, HARI_PRAKTEK: e.value })}
                        placeholder="Pilih Hari Praktek"
                        filter
                        showClear
                    />
                </div>

                <div>
                    <label>Jam Praktek</label>
                    <Dropdown
                        className="w-full mt-2"
                        options={jamOptions}
                        value={formData.JAM_PRAKTEK}
                        onChange={(e) => onChange({ ...formData, JAM_PRAKTEK: e.value })}
                        placeholder="Pilih Jam Praktek"
                        filter
                        showClear
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
