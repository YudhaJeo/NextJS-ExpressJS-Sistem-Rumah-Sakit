// app\(dashboard)\(rawat_inap)\rawat_inap\menu\rawat_inap\components\formTindakan.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import React from 'react';
import { InputText } from 'primereact/inputtext';

const FormRawatInap = ({ 
  visible, 
  onHide, 
  onSubmit, 
  form, 
  setForm,
  errors,
  pasienOptions,
  kamarOptions,
  bedOptions
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  console.log('form.IDKAMAR:', form.IDKAMAR);
  console.log('kamarOptions:', kamarOptions);
  console.log(
  'Index ditemukan:',
  kamarOptions.findIndex(opt => opt.value === form.IDKAMAR)
);


  return (
    <Dialog
      header={form.IDRAWATINAP ? 'Edit Rawat Inap' : 'Tambah Rawat Inap'}
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
          <label>Pasien</label>
          <Dropdown
            className={inputClass('IDPASIEN')}
            value={form.IDPASIEN}
            options={pasienOptions}
            onChange={(e) => setForm({ ...form, IDPASIEN: e.target.value })}
            placeholder="Pilih Pasien"
          />
          {errors.IDPASIEN && <small className="text-red-500">{errors.IDPASIEN}</small>}
        </div>

        <div className="mt-2">
          <label>Kamar</label>
          <Dropdown
            className={inputClass('IDKAMAR')}
            options={kamarOptions}
            value={form.IDKAMAR}
            onChange={(e) => setForm({ ...form, IDKAMAR: e.target.value })}
            optionLabel="label"
            optionValue="value" 
            placeholder="Pilih Kamar"
          />
          {errors.IDKAMAR && <small className="text-red-500">{errors.IDKAMAR}</small>}
        </div>

        <div>
          <label>Bed</label>
          <Dropdown
            className={inputClass('IDBED')}
            value={form.IDBED}
            options={bedOptions}
            onChange={(e) => setForm({ ...form, IDBED: e.value })}
            placeholder="Pilih Bed"
          />
          {errors.IDBED && <small className="text-red-500">{errors.IDBED}</small>}
        </div>

        <div>
          <label>Tanggal Masuk</label>
          <Calendar
            className={inputClass('TANGGALMASUK')}
            value={form.TANGGALMASUK}
            onChange={(e) => setForm({ ...form, TANGGALMASUK: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
          />
          {errors.TANGGALMASUK && <small className="text-red-500">{errors.TANGGALMASUK}</small>}
        </div>

        <div>
          <label>Status</label>
          <Dropdown
            className={inputClass('STATUS')}
            value={form.STATUS}
            options={[
              { label: 'AKTIF', value: 'AKTIF' },
              { label: 'SELESAI', value: 'SELESAI' },
            ]}
            onChange={(e) => setForm({ ...form, STATUS: e.value })}
            placeholder="Pilih Status"
          />
          {errors.STATUS && <small className="text-red-500">{errors.STATUS}</small>}
        </div>

        <div className="mt-2">
          <label>Catatat</label>
          <InputText
            className={inputClass('CATATAN')}
            value={form.CATATAN}
            onChange={(e) => setForm({ ...form, CATATAN: e.target.value })}
            placeholder="Masukkan catatan (Opsional)"
          />
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormRawatInap;