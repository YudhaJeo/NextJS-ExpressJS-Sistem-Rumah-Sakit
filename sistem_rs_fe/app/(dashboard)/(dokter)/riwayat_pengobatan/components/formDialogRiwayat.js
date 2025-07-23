'use client';

import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

const FormDialogPengobatan = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
}) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.STATUSKUNJUNGAN) newErrors.STATUSKUNJUNGAN = 'Status Kunjungan wajib diisi';
    if (!form.STATUSRAWAT) newErrors.STATUSRAWAT = 'Status Rawat wajib diisi';
    if (!form.DIAGNOSA) newErrors.DIAGNOSA = 'Diagnosa wajib diisi';
    if (!form.OBAT) newErrors.OBAT = 'Obat wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <Dialog
      header="Edit Riwayat Pengobatan"
      visible={visible}
      onHide={() => {
        setErrors({});
        onHide();
      }}
      style={{ width: '40vw' }}
      modal
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">Status Kunjungan</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.STATUSKUNJUNGAN })}
            value={form.STATUSKUNJUNGAN}
            options={['Diperiksa', 'Selesai', 'Batal'].map((val) => ({ label: val, value: val }))}
            onChange={(e) => setForm({ ...form, STATUSKUNJUNGAN: e.value })}
            placeholder="Pilih Status"
          />
          {errors.STATUSKUNJUNGAN && <small className="p-error">{errors.STATUSKUNJUNGAN}</small>}
        </div>

        <div>
          <label className="font-medium">Status Rawat</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.STATUSRAWAT })}
            value={form.STATUSRAWAT}
            options={['Rawat Jalan', 'Rawat Inap'].map((val) => ({ label: val, value: val }))}
            onChange={(e) => setForm({ ...form, STATUSRAWAT: e.value })}
            placeholder="Pilih Status Rawat"
          />
          {errors.STATUSRAWAT && <small className="p-error">{errors.STATUSRAWAT}</small>}
        </div>

        <div>
          <label className="font-medium">Diagnosa</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.DIAGNOSA })}
            value={form.DIAGNOSA || ''}
            onChange={(e) => setForm({ ...form, DIAGNOSA: e.target.value })}
            placeholder="Masukkan diagnosa"
          />
          {errors.DIAGNOSA && <small className="p-error">{errors.DIAGNOSA}</small>}
        </div>

        <div>
          <label className="font-medium">Obat</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.OBAT })}
            value={form.OBAT || ''}
            onChange={(e) => setForm({ ...form, OBAT: e.target.value })}
            placeholder="Masukkan obat"
          />
          {errors.OBAT && <small className="p-error">{errors.OBAT}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" className="p-button-primary" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogPengobatan;
