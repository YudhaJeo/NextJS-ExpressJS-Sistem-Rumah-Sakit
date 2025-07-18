'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

const FormDialogKalender = ({
  visible,
  formData,
  onHide,
  onChange,
  onSubmit,
  onDelete,
  dokterOptions,
}) => {
  const statusOptions = [
    { label: 'Libur', value: 'libur' },
    { label: 'Perjanjian', value: 'perjanjian' },
  ];

  const handleDateChange = (e) => {
    const selectedDate = e.value;
    const hariTanggal = selectedDate.toLocaleDateString('id-ID', { weekday: 'long' });
    onChange({
      ...formData,
      TANGGAL: selectedDate.toISOString().slice(0, 10),
      HARI_TANGGAL: hariTanggal,
    });
  };

  return (
    <Dialog
      header={formData.ID ? 'Edit Kalender' : 'Tambah Kalender'}
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
          <label>Nama Dokter</label>
          <Dropdown
            className="w-full mt-1"
            options={dokterOptions}
            value={formData.IDDOKTER}
            onChange={(e) => onChange({ ...formData, IDDOKTER: e.value })}
            placeholder="Pilih Dokter"
            optionLabel="label"
          />
        </div>

        <div>
          <label>Tanggal</label>
          <Calendar
            value={formData.TANGGAL ? new Date(formData.TANGGAL) : null}
            onChange={handleDateChange}
            dateFormat="yy-mm-dd"
            showIcon
            className="w-full"
          />
        </div>

        <div>
          <label>Status</label>
          <Dropdown
            className="w-full mt-1"
            options={statusOptions}
            value={formData.STATUS}
            onChange={(e) => onChange({ ...formData, STATUS: e.value })}
            placeholder="Pilih Status"
          />
        </div>

        <div>
          <label>Keterangan</label>
          <InputText
            value={formData.KETERANGAN}
            placeholder="Tulis keterangan"
            className="w-full"
            onChange={(e) => onChange({ ...formData, KETERANGAN: e.target.value })}
          />
        </div>

        <div className="flex justify-between pt-2">
          {formData.ID > 0 && (
            <Button
              type="button"
              label="Hapus"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={() => onDelete(formData)}
            />
          )}
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogKalender;
