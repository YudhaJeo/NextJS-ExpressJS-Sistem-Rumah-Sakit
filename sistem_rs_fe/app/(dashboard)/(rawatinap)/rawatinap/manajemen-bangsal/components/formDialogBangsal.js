// app\(dashboard)\(rawatinap)\rawatinap\manajemen-bangsal\components\formDialogBangsal.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import React from 'react';

const FormDialogBangsal = ({ 
  visible, 
  onHide, 
  onSubmit, 
  form, 
  setForm,
  errors,
  bangsalOption,
  asuransiOptions
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDBANGSAL ? 'Edit Bangsal' : 'Tambah Bangsal'}
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
          <label>Nama Bangsal</label>
          <InputText
            className={inputClass('NAMABANGSAL')}
            value={form.NAMABANGSAL}
            onChange={(e) => setForm({ ...form, NAMABANGSAL: e.target.value })}
            placeholder='Masukan nama bangsal'
          />
          {errors.NAMABANGSAL && <small className="text-red-500">{errors.NAMABANGSAL}</small>}
        </div>

        <div className="mt-2">
          <label>Jenis Bangsal</label>
          <Dropdown
            className={inputClass('IDJENISBANGSAL')}
            options={bangsalOption}
            value={form.IDJENISBANGSAL}
            onChange={(e) => setForm({ ...form, IDJENISBANGSAL: e.value })}
            placeholder="Pilih Jenis Bangsal"
          />
          {errors.IDJENISBANGSAL && <small className="text-red-500">{errors.IDJENISBANGSAL}</small>}
        </div>

        <div className="mt-2">
          <label>Kapasitas</label>
          <InputNumber
            inputClassName={inputClass('KAPASITAS')}
            value={form.KAPASITAS}
            onValueChange={(e) => setForm({ ...form, KAPASITAS: e.value })}
            useGrouping={false}
            min={0}
            className="w-full"
            placeholder="Masukkan angka"
          />
          {errors.KAPASITAS && <small className="text-red-500">{errors.KAPASITAS}</small>}
        </div>

        <div className="mt-2">
          <label>Tersedia</label>
          <InputNumber
            inputClassName={inputClass('TERISI')}
            value={form.TERISI}
            onValueChange={(e) => setForm({ ...form, TERISI: e.value })}
            useGrouping={false}
            min={0}
            className="w-full"
            placeholder="Masukkan angka"
          />
          {errors.TERISI && <small className="text-red-500">{errors.TERISI}</small>}
        </div>

        <div className="mt-2">
          <label>Status</label>
          <Dropdown
            className={inputClass('STATUS')}
            options={[
              { label: 'Tersedia', value: 'TERSEDIA' },
              { label: 'Penuh', value: 'PENUH' },
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
            placeholder='Tambahkan keterangan lokasi dsb.'
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

export default FormDialogBangsal;