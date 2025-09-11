'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

const FormDialogDepositPenggunaan = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  depositOptions,
}) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.IDDEPOSIT) newErrors.IDDEPOSIT = 'Deposit wajib dipilih';
    if (!form.TANGGALPEMAKAIAN) newErrors.TANGGALPEMAKAIAN = 'Tanggal Pemakaian wajib diisi';
    if (!form.JUMLAH_PEMAKAIAN || form.JUMLAH_PEMAKAIAN <= 0)
      newErrors.JUMLAH_PEMAKAIAN = 'Jumlah Pemakaian harus lebih dari 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const handleDepositChange = (e) => {
    const selected = depositOptions.find(opt => opt.value === e.value);
    setForm({
      ...form,
      IDDEPOSIT: e.value,
      NIK: selected?.nik || '',
      NAMAPASIEN: selected?.NAMAPASIEN || '',
      NOINVOICE: selected?.NOINVOICE || '', 
      IDINVOICE: selected?.IDINVOICE || selected?.value || null
    });
  };


  return (
    <Dialog
      header={form.IDPENGGUNAAN ? 'Edit Penggunaan Deposit' : 'Tambah Penggunaan Deposit'}
      visible={visible}
      onHide={() => {
        setErrors({});
        onHide();
      }}
      style={{ width: '40vw' }}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className ="mt-2">
          <label className="font-medium">No Deposit</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.IDDEPOSIT })}
            options={depositOptions}
            value={form.IDDEPOSIT}
            onChange={handleDepositChange}
            placeholder="Pilih Deposit"
            filter
            showClear
          />
          {errors.IDDEPOSIT && <small className="p-error">{errors.IDDEPOSIT}</small>}
        </div>

        <div className ="mt-2">
          <label className="font-medium">No Invoice</label>
          <InputText className="w-full mt-2" value={form.NOINVOICE || ''} readOnly />
        </div>

        <div className ="mt-2">
          <label className="font-medium">NIK</label>
          <InputText className="w-full mt-2" value={form.NIK || ''} readOnly />
        </div>

        <div className ="mt-2">
          <label className="font-medium">Nama Pasien</label>
          <InputText className="w-full mt-2" value={form.NAMAPASIEN || ''} readOnly />
        </div>

        <div className ="mt-2">
          <label className="font-medium">Tanggal Pemakaian</label>
          <Calendar
            className={classNames('w-full mt-2', { 'p-invalid': errors.TANGGALPEMAKAIAN })}
            dateFormat="yy-mm-dd"
            value={form.TANGGALPEMAKAIAN ? new Date(form.TANGGALPEMAKAIAN) : null}
            onChange={(e) =>
              setForm({
                ...form,
                TANGGALPEMAKAIAN: e.value?.toISOString().split('T')[0] || '',
              })
            }
            showIcon
            showButtonBar
            placeholder="Pilih Tanggal"
          />
          {errors.TANGGALPEMAKAIAN && (
            <small className="p-error">{errors.TANGGALPEMAKAIAN}</small>
          )}
        </div>

        <div className ="mt-2">
          <label className="font-medium">Jumlah Pemakaian</label>
          <InputNumber
            className={classNames('w-full mt-2', { 'p-invalid': errors.JUMLAH_PEMAKAIAN })}
            value={form.JUMLAH_PEMAKAIAN}
            onValueChange={(e) =>
              setForm({ ...form, JUMLAH_PEMAKAIAN: e.value })
            }
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
          {errors.JUMLAH_PEMAKAIAN && (
            <small className="p-error">{errors.JUMLAH_PEMAKAIAN}</small>
          )}
        </div>

        <div className="text-right pt-3">
          <Button
            type="submit"
            label="Simpan"
            icon="pi pi-save"
            className="p-button-primary"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogDepositPenggunaan;