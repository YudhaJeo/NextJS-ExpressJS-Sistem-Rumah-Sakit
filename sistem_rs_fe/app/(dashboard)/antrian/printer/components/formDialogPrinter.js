// app\(dashboard)\antrian\printer\components\formDialogPrinter.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import React from 'react';

const FormDialogPrinter = ({ visible, onHide, onSubmit, form, setForm, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  const statusOptions = [
    { label: 'AKTIF', value: 'AKTIF' },
    { label: 'TIDAK AKTIF', value: 'TIDAK AKTIF' },
  ];

  return (
    <Dialog
      header={form.NOPRINTER ? 'Edit Printer' : 'Tambah Printer'}
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
          <label>Nama Printer</label>
          <InputText
            className={inputClass('NAMAPRINTER')}
            value={form.NAMAPRINTER}
            onChange={(e) => setForm({ ...form, NAMAPRINTER: e.target.value })}
          />
          {errors.NAMAPRINTER && <small className="text-red-500">{errors.NAMAPRINTER}</small>}
        </div>

        <div>
          <label>Kode Printer</label>
          <InputText
            className={inputClass('KODEPRINTER')}
            value={form.KODEPRINTER}
            onChange={(e) => setForm({ ...form, KODEPRINTER: e.target.value })}
          />
          {errors.KODEPRINTER && <small className="text-red-500">{errors.KODEPRINTER}</small>}
        </div>

        <div>
          <label>Status</label>
          <Dropdown
            className={inputClass('KETERANGAN')}
            value={form.KETERANGAN}
            options={statusOptions}
            onChange={(e) => setForm({ ...form, KETERANGAN: e.value })}
            placeholder="Pilih Status"
          />
          {errors.KETERANGAN && <small className="text-red-500">{errors.KETERANGAN}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogPrinter;