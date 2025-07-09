// app\(dashboard)\(rawatinap)\rawatinap\manajemen-bangsal\components\formDialogBangsal.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
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
          />
          {errors.NAMABANGSAL && <small className="text-red-500">{errors.NAMABANGSAL}</small>}
        </div>

        <div>
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

        <div>
          <label>NIK</label>
          <InputText
            className={inputClass('NIK')}
            maxLength={16}
            value={form.NIK}
            onChange={(e) => setForm({ ...form, NIK: e.target.value })}
          />
          {errors.NIK && <small className="text-red-500">{errors.NIK}</small>}
        </div>

        <div>
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

        <div>
          <label>Asuransi</label>
          <Dropdown
              className={inputClass('IDASURANSI')}
              options={asuransiOptions}
              value={form.IDASURANSI}
              onChange={(e) => setForm({ ...form, IDASURANSI: e.value })}
              placeholder="Pilih"
            />
            {errors.IDASURANSI && <small className="text-red-500">{errors.IDASURANSI}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogBangsal;