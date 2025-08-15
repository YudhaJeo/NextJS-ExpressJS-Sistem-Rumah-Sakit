'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

const FormDialogInvoice = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  pasienOptions,
}) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.NIK) newErrors.NIK = 'NIK pasien wajib dipilih';
    if (!form.TANGGALINVOICE) newErrors.TANGGALINVOICE = 'Tanggal Invoice wajib diisi';
    if (!form.TOTALTAGIHAN || form.TOTALTAGIHAN <= 0)
      newErrors.TOTALTAGIHAN = 'Total tagihan harus lebih dari 0';
    if (form.TOTALDEPOSIT < 0) newErrors.TOTALDEPOSIT = 'Deposit tidak boleh negatif';
    if (form.TOTALANGSURAN < 0) newErrors.TOTALANGSURAN = 'Angsuran tidak boleh negatif';

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
      header="Edit Invoice"
      visible={visible}
      onHide={() => {
        setErrors({});
        onHide();
      }}
      style={{ width: '40vw' }}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">No Invoice</label>
          <InputText
            className="w-full mt-2"
            value={form.NOINVOICE || 'Otomatis'}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">NIK Pasien</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.NIK })}
            options={pasienOptions}
            value={form.NIK}
            onChange={(e) => {
              const selected = pasienOptions.find((p) => p.value === e.value);
              setForm({
                ...form,
                NIK: e.value,
                NAMAPASIEN: selected?.NAMALENGKAP || '',
                ASURANSI: selected?.ASURANSI || '-',
              });
            }}
            placeholder="Pilih Pasien"
            filter
            showClear
          />
          {errors.NIK && <small className="p-error">{errors.NIK}</small>}
        </div>

        <div>
          <label className="font-medium">Asuransi</label>
          <InputText
            className="w-full mt-2"
            value={form.ASURANSI || '-'}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">Tanggal Invoice</label>
          <Calendar
            className={classNames('w-full mt-2', { 'p-invalid': errors.TANGGALINVOICE })}
            dateFormat="yy-mm-dd"
            value={form.TANGGALINVOICE ? new Date(form.TANGGALINVOICE) : null}
            onChange={(e) =>
              setForm({
                ...form,
                TANGGALINVOICE: e.value?.toISOString().split('T')[0] || '',
              })
            }
            showIcon
            showButtonBar
            placeholder="Pilih Tanggal"
          />
          {errors.TANGGALINVOICE && <small className="p-error">{errors.TANGGALINVOICE}</small>}
        </div>

        <div>
          <label className="font-medium">Total Tagihan</label>
          <InputNumber
            className={classNames('w-full mt-2', { 'p-invalid': errors.TOTALTAGIHAN })}
            value={form.TOTALTAGIHAN}
            onValueChange={(e) => setForm({ ...form, TOTALTAGIHAN: e.value })}
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
          {errors.TOTALTAGIHAN && <small className="p-error">{errors.TOTALTAGIHAN}</small>}
        </div>

        <div>
          <label className="font-medium">Total Deposit</label>
          <InputNumber
            className="w-full mt-2"
            value={form.TOTALDEPOSIT}
            onValueChange={(e) => setForm({ ...form, TOTALDEPOSIT: e.value })}
            mode="currency"
            currency="IDR"
            locale="id-ID"
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">Total Angsuran</label>
          <InputNumber
            className="w-full mt-2"
            value={form.TOTALANGSURAN}
            onValueChange={(e) => setForm({ ...form, TOTALANGSURAN: e.value })}
            mode="currency"
            currency="IDR"
            locale="id-ID"
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">Sisa Tagihan</label>
          <InputNumber
            className="w-full mt-2"
            value={form.SISA_TAGIHAN}
            mode="currency"
            currency="IDR"
            locale="id-ID"
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">Status</label>
          <InputText
            className="w-full mt-2"
            value={form.STATUS === 'LUNAS' ? 'Sudah Dibayar' : 'Belum Dibayar'}
            readOnly
          />
        </div>

        {form.IDINVOICE > 0 && (
          <div className="text-right pt-3">
            <Button
              type="submit"
              label="Simpan"
              icon="pi pi-save"
              className="p-button-primary"
            />
          </div>
        )}
      </form>
    </Dialog>
  );
};

export default FormDialogInvoice;