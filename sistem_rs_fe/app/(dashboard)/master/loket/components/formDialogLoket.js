'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const FormDialogLoket = ({ visible, onHide, onSubmit, form, setForm, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.NO ? 'Edit Loket' : 'Tambah Loket'}
      visible={visible}
      onHide={onHide}
      style={{ width: '30vw' }}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label>Nama Loket</label>
          <InputText
            className={inputClass('NAMALOKET')}
            value={form.NAMALOKET}
            onChange={(e) => setForm({ ...form, NAMALOKET: e.target.value })}
          />
          {errors.NAMALOKET && <small className="text-red-500">{errors.NAMALOKET}</small>}
        </div>

        <div>
          <label>Kode</label>
          <InputText
            className={inputClass('KODE')}
            value={form.KODE}
            onChange={(e) => setForm({ ...form, KODE: e.target.value })}
          />
          {errors.KODE && <small className="text-red-500">{errors.KODE}</small>}
        </div>

        <div>
          <label>Deskripsi</label>
          <InputText
            className={inputClass('DESKRIPSI')}
            value={form.DESKRIPSI}
            onChange={(e) => setForm({ ...form, DESKRIPSI: e.target.value })}
          />
          {errors.DESKRIPSI && <small className="text-red-500">{errors.DESKRIPSI}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogLoket;