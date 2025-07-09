// app/jadwalpraktek/components/formDialogjadwal.js
'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useEffect} from "react";

const FormDialogJadwal = ({
  visible,
  formData,
  onHide,
  onChange,
  onSubmit,
  dokterOptions,
  allDokterOptions,
}) => {
  useEffect(() => {
    if (formData.IDDOKTER) {
      const selectedDokter = allDokterOptions.find(
        (dokter) => dokter.value === formData.IDDOKTER
      );
      if (selectedDokter && selectedDokter.jadwal) {
        onChange((prev) => ({
          ...prev,
          HARI: selectedDokter.jadwal,
        }));
      }
    }
  }, [formData.IDDOKTER]);
  return (
    <Dialog header={formData.ID ? 'Edit Jadwal' : 'Tambah Jadwal'} visible={visible} onHide={onHide} style={{ width: '40vw' }}>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div>
          <label>Nama Dokter</label>
          <Dropdown
            className="w-full mt-1"
            options={dokterOptions}
            value={formData.IDDOKTER}
            onChange={(e) => onChange({ ...formData, IDDOKTER: e.value })}
            placeholder="Pilih Dokter"
          />
        </div>

        <div>
          <label>Hari</label>
          <InputText
            value={formData.HARI}
            placeholder="Hari Praktek"
            className="w-full"
            readOnly
          />
        </div>

        <div>
          <label>Jam Mulai</label>
          <InputText
            className="w-full mt-1"
            value={formData.JAM_MULAI}
            onChange={(e) => onChange({ ...formData, JAM_MULAI: e.target.value })}
            placeholder="Contoh: 08:00"
          />
        </div>

        <div>
          <label>Jam Selesai</label>
          <InputText
            className="w-full mt-1"
            value={formData.JAM_SELESAI}
            onChange={(e) => onChange({ ...formData, JAM_SELESAI: e.target.value })}
            placeholder="Contoh: 12:00"
          />
        </div>

        <div className="text-right pt-2">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogJadwal;
