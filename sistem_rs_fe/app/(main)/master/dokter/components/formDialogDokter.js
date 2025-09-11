'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at"];

const FormDialogDokter = ({ visible, formData, onHide, onChange, onSubmit, poliOptions, tenagaOptions }) => {
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
        <div className ="mt-2">
          <label>Nama Dokter</label>
          <Dropdown
            className="w-full mt-2"
            options={tenagaOptions}
            value={formData.IDTENAGAMEDIS}
            onChange={(e) => onChange({ ...formData, IDTENAGAMEDIS: e.value })}
            placeholder="Pilih Dokter"
            filter
            showClear
          />
        </div>

        <div className ="mt-2">
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

        <div className ="mt-2">
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
                      <Calendar
                        value={shift.JAM_MULAI ? new Date(`1970-01-01T${shift.JAM_MULAI}`) : null}
                        onChange={(e) =>
                          handleJadwalChange(globalIndex + i, 'JAM_MULAI',
                            e.value?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                          )
                        }
                        timeOnly
                        showIcon
                        hourFormat="24"
                        className="w-28"
                      />
                      <span>-</span>
                      <Calendar
                        value={shift.JAM_SELESAI ? new Date(`1970-01-01T${shift.JAM_SELESAI}`) : null}
                        onChange={(e) =>
                          handleJadwalChange(globalIndex + i, 'JAM_SELESAI',
                            e.value?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                          )
                        }
                        timeOnly
                        showIcon
                        hourFormat="24"
                        className="w-28"
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
