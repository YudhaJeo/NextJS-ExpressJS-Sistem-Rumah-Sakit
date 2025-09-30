'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

const FormDialogPembayaran = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  invoiceOptions,
  pasienOptions,
  metodeOptions,
  bankOptions,
}) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.IDINVOICE) newErrors.IDINVOICE = 'Invoice wajib dipilih';
    if (!form.NIK) newErrors.NIK = 'NIK wajib ada';
    if (!form.NAMAPASIEN) newErrors.NAMAPASIEN = 'Nama Pasien wajib ada';
    if (!form.ASURANSI) newErrors.ASURANSI = 'Asuransi wajib ada';
    if (!form.JUMLAHBAYAR || form.JUMLAHBAYAR <= 0)
      newErrors.JUMLAHBAYAR = 'Jumlah bayar harus lebih dari 0';
    if (!form.TANGGALBAYAR) newErrors.TANGGALBAYAR = 'Tanggal Bayar wajib diisi';
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
    const pasien = pasienOptions.find((p) =>
      selectedInvoice.label.includes(p.label.split(' - ')[1])
    );
    setForm({
      ...form,
      IDINVOICE: selectedInvoice.value,
      NOINVOICE: selectedInvoice.label.split(' - ')[0],
      NIK: pasien?.value || '',
      NAMAPASIEN: pasien?.label.split(' - ')[1] || '',
      ASURANSI: pasien?.NAMAASURANSI || '',
      JUMLAHBAYAR: selectedInvoice.SISA_TAGIHAN || 0,
      TOTALDEPOSIT: selectedInvoice.TOTALDEPOSIT || 0,
      METODEPEMBAYARAN: selectedInvoice.TOTALDEPOSIT > 0 ? 'Deposit' : '',
    });
  } else {
    setForm({
      ...form,
      IDINVOICE: '',
      NOINVOICE: '',
      NIK: '',
      NAMAPASIEN: '',
      ASURANSI: '',
      JUMLAHBAYAR: 0,
      TOTALDEPOSIT: 0,  
      METODEPEMBAYARAN: '',
    });
  }
};


  return (
    <Dialog
      header={form.IDPEMBAYARAN ? 'Edit Pembayaran' : 'Tambah Pembayaran'}
      visible={visible}
      onHide={() => {
        setErrors({});
        onHide();
      }}
      style={{ width: '40vw' }}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className ="mt-2">
          <label className="font-medium">No Pembayaran</label>
          <InputText
            className={classNames('w-full mt-2')}
            value={form.NOPEMBAYARAN || 'Otomatis'}
            readOnly
          />
          {errors.NOPEMBAYARAN && <small className="p-error">{errors.NOPEMBAYARAN}</small>}
        </div>

        <div className ="mt-2">
          <label className="font-medium">Invoice</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.IDINVOICE })}
            options={invoiceOptions}
            value={form.IDINVOICE}
            onChange={handleInvoiceChange}
            placeholder="Pilih Invoice"
            optionLabel="label"
            optionValue="value"
            filter
            showClear
          />
          {errors.IDINVOICE && <small className="p-error">{errors.IDINVOICE}</small>}
        </div>

        <div className ="mt-2">
          <label className="font-medium">NIK</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.NIK })}
            value={form.NIK}
            readOnly
          />
          {errors.NIK && <small className="p-error">{errors.NIK}</small>}
        </div>

        <div className ="mt-2">
          <label className="font-medium">Nama Pasien</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.NAMAPASIEN })}
            value={form.NAMAPASIEN}
            readOnly
          />
          {errors.NAMAPASIEN && <small className="p-error">{errors.NAMAPASIEN}</small>}
        </div>

        <div className ="mt-2">
          <label className="font-medium">Asuransi</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.ASURANSI })}
            value={form.ASURANSI}
            readOnly
          />
          {errors.ASURANSI && <small className="p-error">{errors.ASURANSI}</small>}
        </div>

        <div className ="mt-2">
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

        {form.TOTALDEPOSIT > 0 ? (
          <div className="mt-2">
            <label className="font-medium">Metode Pembayaran</label>
            <InputText
              className="w-full mt-2"
              value="Deposit"
              readOnly
            />
          </div>
        ) : (
          <div className="mt-2">
            <label className="font-medium">Metode Pembayaran</label>
            <Dropdown
              className={classNames('w-full mt-2', { 'p-invalid': errors.METODEPEMBAYARAN })}
              value={form.METODEPEMBAYARAN}
              options={metodeOptions}
              onChange={(e) => setForm({ ...form, METODEPEMBAYARAN: e.value })}
              placeholder="Pilih Metode"
            />
            {errors.METODEPEMBAYARAN && <small className="p-error">{errors.METODEPEMBAYARAN}</small>}
          </div>
        )}

        {form.METODEPEMBAYARAN === 'Transfer Bank' && (
          <div className ="mt-2">
            <label className="font-medium">Pilih Rekening Bank</label>
            <Dropdown
              className="w-full mt-2"
              options={bankOptions}
              value={form.IDBANK || ''}
              onChange={(e) => setForm({ ...form, IDBANK: e.value })}
              placeholder="Pilih Bank"
              optionLabel="label"
              optionValue="value"
              filter
              showClear
            />
          </div>
        )}

        <div className ="mt-2">
          <label className="font-medium">Jumlah Bayar</label>
          <InputNumber
            className={classNames('w-full mt-2', { 'p-invalid': errors.JUMLAHBAYAR })}
            value={form.JUMLAHBAYAR}
            onValueChange={(e) => setForm({ ...form, JUMLAHBAYAR: e.value })}
            mode="currency"
            currency="IDR"
            locale="id-ID"
            readOnly={form.METODEPEMBAYARAN === 'Deposit'}
          />
          {errors.JUMLAHBAYAR && <small className="p-error">{errors.JUMLAHBAYAR}</small>}
        </div>

        <div className ="mt-2">
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

export default FormDialogPembayaran;