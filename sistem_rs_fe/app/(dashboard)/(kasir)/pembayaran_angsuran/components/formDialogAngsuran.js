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
}) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.IDINVOICE) newErrors.IDINVOICE = 'Invoice wajib dipilih';
    if (!form.TANGGALBAYAR) newErrors.TANGGALBAYAR = 'Tanggal bayar wajib diisi';
    if (!form.NOMINAL || form.NOMINAL <= 0) newErrors.NOMINAL = 'Jumlah harus lebih dari 0';
    if (!form.METODE) newErrors.METODE = 'Metode wajib dipilih';
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
        NAMA_ASURANSI: selectedInvoice.NAMA_ASURANSI || '',
      });
    } else {
      setForm({
        ...form,
        IDINVOICE: '',
        NOINVOICE: '',
        NIK: '',
        NAMAPASIEN: '',
        NAMA_ASURANSI: '',
      });
    }
  };

  return (
    <Dialog
      header="Input Pembayaran Angsuran"
      visible={visible}
      onHide={() => {
        setErrors({});
        onHide();
      }}
      style={{ width: '40vw' }}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">No Angsuran</label>
          <InputText
            className="w-full mt-2"
            value={form.NOANGSURAN || 'Otomatis'}
            readOnly
          />
        </div>

        <div>
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
          />
          {errors.IDINVOICE && <small className="p-error">{errors.IDINVOICE}</small>}
        </div>

        <div>
          <label className="font-medium">NIK</label>
          <InputText
            className="w-full mt-2"
            value={form.NIK || ''}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">Nama Pasien</label>
          <InputText
            className="w-full mt-2"
            value={form.NAMAPASIEN || ''}   
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">Asuransi</label>
          <InputText
            className="w-full mt-2"
            value={form.NAMA_ASURANSI || ''}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">Tanggal Bayar</label>
          <Calendar
            className={classNames('w-full mt-2', { 'p-invalid': errors.TANGGALBAYAR })}
            value={form.TANGGALBAYAR ? new Date(form.TANGGALBAYAR) : null}
            onChange={(e) =>
              setForm({
                ...form,
                TANGGALBAYAR: e.value?.toISOString().split('T')[0],
              })
            }
            showIcon
            dateFormat="yy-mm-dd"
            placeholder="Pilih Tanggal"
          />
          {errors.TANGGALBAYAR && <small className="p-error">{errors.TANGGALBAYAR}</small>}
        </div>

        <div>
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

        <div>
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

        {form.METODE === 'Transfer Bank' && (
          <div>
            <label className="font-medium">Pilih Bank</label>
            <Dropdown
              className="w-full mt-2"
              value={form.IDBANK}
              options={bankOptions}
              onChange={(e) => setForm({ ...form, IDBANK: e.value })}
              placeholder="Pilih Bank"
              showClear
              filter
            />
          </div>
        )}

        <div>
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