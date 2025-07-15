// app\(dashboard)\(rawat_inap)\rawat_inap\manajemen-kamar\components\formKamar.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import React from 'react';

const FormBed = ({ 
  visible, 
  onHide, 
  onSubmit, 
  form, 
  setForm,
  errors,
  bangsalOptions
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDBED ? 'Edit Bed' : 'Tambah Bed'}
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
          <label>Nomor Bed</label>
          <InputText
            className={inputClass('')}
            value={form.NOMORBED}
            onChange={(e) => setForm({ ...form, NOMORBED: e.target.value })}
            placeholder='Contoh: B1'
          />
          {errors.NOMORBED && <small className="text-red-500">{errors.NOMORBED}</small>}
        </div>

        <div className="mt-2">
          <label>Kamar</label>
          <Dropdown
            className={inputClass('IDKAMAR')}
            options={bangsalOptions}
            value={form.IDKAMAR}
            onChange={(e) => setForm({ ...form, IDKAMAR: e.value })}
            placeholder="Pilih Kamar"
          />
          {errors.IDKAMAR && <small className="text-red-500">{errors.IDKAMAR}</small>}
        </div>

        <div className="mt-2">
          <label>Status</label>
          <Dropdown
            className={inputClass('STATUS')}
            options={[
              { label: 'Tersedia', value: 'TERSEDIA' },
              { label: 'Terisi', value: 'TERISI' },
              { label: 'Dibersihkan', value: 'DIBERSIHKAN' },
            ]}
            value={form.STATUS}
            onChange={(e) => setForm({ ...form, STATUS: e.value })}
            placeholder="Pilih"
          />
          {errors.STATUS && <small className="text-red-500">{errors.STATUS}</small>}
        </div>


        <div className="mt-2">
          <label>Keterangan</label>
          <InputText
            className={inputClass('KETERANGAN')}
            value={form.KETERANGAN}
            onChange={(e) => setForm({ ...form, KETERANGAN: e.target.value })}
            placeholder="Masukkan keterangan"
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

export default FormBed;