'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

const FormDialogAngsuran = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  invoiceOptions,
  metodeOptions,
  bankOptions,
  isEdit = false, // ➤ Tambahkan prop untuk mode edit
}) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.IDINVOICE) newErrors.IDINVOICE = 'Invoice wajib dipilih';
    if (!form.TANGGALBAYAR) newErrors.TANGGALBAYAR = 'Tanggal bayar wajib diisi';
    if (!form.NOMINAL || form.NOMINAL <= 0) newErrors.NOMINAL = 'Jumlah harus lebih dari 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const handleInvoiceChange = (e) => {
    const selectedInvoice = invoiceOptions.find((inv) => inv.value === e.value);
    if (selectedInvoice) {
      setForm({
        ...form,
        IDINVOICE: selectedInvoice.value,
        NOINVOICE: selectedInvoice.label,
        NIK: selectedInvoice.NIK || '',
        NAMAPASIEN: selectedInvoice.NAMAPASIEN || '',
        NAMAASURANSI: selectedInvoice.NAMAASURANSI || '',
        TOTALDEPOSIT: selectedInvoice.TOTALDEPOSIT || 0,
        METODE: selectedInvoice.TOTALDEPOSIT > 0 ? 'Deposit' : '',
      });
    } else {
      setForm({
        ...form,
        IDINVOICE: '',
        NOINVOICE: '',
        NIK: '',
        NAMAPASIEN: '',
        NAMAASURANSI: '',
        TOTALDEPOSIT: 0,
        METODE: '',
      });
    }
  };

  return (
    <Dialog
      header={isEdit ? 'Edit Pembayaran Angsuran' : 'Tambah Pembayaran Angsuran'} // 👈 Judul otomatis
      visible={visible}
      onHide={() => {
        setErrors({});
        onHide();
      }}
      style={{ width: '40vw' }}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="mt-2">
          <label className="font-medium">No Angsuran</label>
          <InputText className="w-full mt-2" value={form.NOANGSURAN || 'Otomatis'} readOnly />
        </div>

        <div className="mt-2">
          <label className="font-medium">No Invoice</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.IDINVOICE })}
            value={form.IDINVOICE}
            options={invoiceOptions}
            onChange={handleInvoiceChange}
            placeholder="Pilih Invoice"
            optionLabel="label"
            optionValue="value"
            filter
            showClear
            disabled={isEdit} // 🔒 tidak bisa ubah invoice saat edit
          />
          {errors.IDINVOICE && <small className="p-error">{errors.IDINVOICE}</small>}
        </div>

        <div className="mt-2">
          <label className="font-medium">NIK</label>
          <InputText className="w-full mt-2" value={form.NIK || ''} readOnly />
        </div>

        <div className="mt-2">
          <label className="font-medium">Nama Pasien</label>
          <InputText className="w-full mt-2" value={form.NAMAPASIEN || form.NAMALENGKAP || ''} readOnly />
        </div>

        <div className="mt-2">
          <label className="font-medium">Asuransi</label>
          <InputText className="w-full mt-2" value={form.NAMAASURANSI || ''} readOnly />
        </div>

        <div className="mt-2">
          <label className="font-medium">Tanggal Bayar</label>
          <Calendar
            className={classNames('w-full mt-2', { 'p-invalid': errors.TANGGALBAYAR })}
            dateFormat="yy-mm-dd"
            value={form.TANGGALBAYAR ? new Date(form.TANGGALBAYAR) : null}
            onChange={(e) =>
              setForm({
                ...form,
                TANGGALBAYAR: e.value?.toISOString().split('T')[0] || '',
              })
            }
            showIcon
            showButtonBar
            placeholder="Pilih Tanggal"
          />
          {errors.TANGGALBAYAR && <small className="p-error">{errors.TANGGALBAYAR}</small>}
        </div>

        <div className="mt-2">
          <label className="font-medium">Jumlah Bayar</label>
          <InputNumber
            className={classNames('w-full mt-2', { 'p-invalid': errors.NOMINAL })}
            value={form.NOMINAL}
            onValueChange={(e) => setForm({ ...form, NOMINAL: e.value })}
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
          {errors.NOMINAL && <small className="p-error">{errors.NOMINAL}</small>}
        </div>

        {form.TOTALDEPOSIT > 0 && form.NOMINAL <= form.TOTALDEPOSIT ? (
          <div className="mt-2">
            <label className="font-medium">Metode Pembayaran</label>
            <InputText className="w-full mt-2" value="Deposit" readOnly />
          </div>
        ) : (
          <div className="mt-2">
            <label className="font-medium">Metode Pembayaran</label>
            <Dropdown
              className={classNames('w-full mt-2', { 'p-invalid': errors.METODE })}
              value={form.METODE}
              options={metodeOptions}
              onChange={(e) => setForm({ ...form, METODE: e.value })}
              placeholder="Pilih Metode"
            />
            {errors.METODE && <small className="p-error">{errors.METODE}</small>}
          </div>
        )}

        <div className="mt-2">
          <label className="font-medium">Keterangan</label>
          <InputText
            className="w-full mt-2"
            value={form.KETERANGAN}
            onChange={(e) => setForm({ ...form, KETERANGAN: e.target.value })}
            rows={3}
            placeholder="Opsional"
          />
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" className="p-button-primary" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogAngsuran;