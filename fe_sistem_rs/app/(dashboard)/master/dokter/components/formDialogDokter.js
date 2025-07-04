'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const FormDialogDokter = ({ visible, formData, onHide, onChange, onSubmit, poliOptions }) => {
  const handleJadwalChange = (index, field, value) => {
    const updatedJadwal = [...formData.JADWAL];
    updatedJadwal[index][field] = value;
    onChange({ ...formData, JADWAL: updatedJadwal });
  };

  return (
    <Dialog
      header={formData.IDDOKTER ? 'Edit Dokter' : 'Tambah Dokter'}
      visible={visible}
      onHide={onHide}
      style={{ width: '40vw' }}
    >
      <form
        className="space-y-4"
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
        <label className="block mb-2 font-semibold">Jadwal Praktek</label>
        {formData.JADWAL.map((item, index) => (
            <div key={item.HARI} className="flex items-center gap-2 mb-2">
            <span className="w-20">{item.HARI}</span>
            <input
                type="time"
                className="w-28 p-2 border rounded"
                value={item.JAM_MULAI}
                onChange={(e) => handleJadwalChange(index, 'JAM_MULAI', e.target.value)}
            />
            <span>-</span>
            <input
                type="time"
                className="w-28 p-2 border rounded"
                value={item.JAM_SELESAI}
                onChange={(e) => handleJadwalChange(index, 'JAM_SELESAI', e.target.value)}
            />
            </div>
        ))}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogDokter;
