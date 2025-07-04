'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at"];

const FormDialogDokter = ({ visible, formData, onHide, onChange, onSubmit, poliOptions }) => {
  const handleJadwalChange = (index, field, value) => {
    const updated = [...formData.JADWAL];
    updated[index][field] = value;
    onChange({ ...formData, JADWAL: updated });
  };

  const handleAddShift = (hari) => {
    const newJadwal = [...formData.JADWAL, { HARI: hari, JAM_MULAI: '', JAM_SELESAI: '' }];
    onChange({ ...formData, JADWAL: newJadwal });
  };

  const handleRemoveShift = (index) => {
    const updated = [...formData.JADWAL];
    updated.splice(index, 1);
    onChange({ ...formData, JADWAL: updated });
  };

  return (
    <Dialog
      header={formData.IDDOKTER ? 'Edit Dokter' : 'Tambah Dokter'}
      visible={visible}
      onHide={onHide}
      style={{ width: '45vw' }}
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
          {hariList.map((hari) => {
            const shifts = formData.JADWAL.filter(j => j.HARI === hari);
            return (
              <div key={hari} className="mb-3">
                <div className="font-semibold">{hari}</div>
                {shifts.map((shift, i) => {
                  const globalIndex = formData.JADWAL.findIndex((j, idx) =>
                    j.HARI === hari && formData.JADWAL.indexOf(j) === idx
                  );

                  return (
                    <div key={i} className="flex items-center gap-2 mt-2">
                      <input
                        type="time"
                        className="w-28 p-2 border rounded"
                        value={shift.JAM_MULAI}
                        onChange={(e) => handleJadwalChange(globalIndex + i, 'JAM_MULAI', e.target.value)}
                      />
                      <span>-</span>
                      <input
                        type="time"
                        className="w-28 p-2 border rounded"
                        value={shift.JAM_SELESAI}
                        onChange={(e) => handleJadwalChange(globalIndex + i, 'JAM_SELESAI', e.target.value)}
                      />
                      <Button
                        type="button"
                        icon="pi pi-trash"
                        text
                        severity="danger"
                        onClick={() => handleRemoveShift(globalIndex + i)}
                      />
                    </div>
                  );
                })}
                <Button
                  type="button"
                  label={`+ Shift ${hari}`}
                  text
                  size="small"
                  onClick={() => handleAddShift(hari)}
                  className="mt-1"
                />
              </div>
            );
          })}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogDokter;