'use client';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';

const initialForm = (suppliers = [], obat = [], alkes = []) => ({
  TGLPEMESANAN: new Date().toISOString().split('T')[0],
  SUPPLIERID: null,
  details: []
});

const FormPemesanan = ({ visible, onHide, onSubmit, suppliers, obat, alkes }) => {
  const [form, setForm] = useState(initialForm());
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.TGLPEMESANAN) newErrors.TGLPEMESANAN = 'Tanggal pemesanan harus diisi';
    if (!form.SUPPLIERID) newErrors.SUPPLIERID = 'Supplier harus dipilih';
    if (form.details.length === 0) newErrors.details = 'Minimal satu detail barang harus diisi';

    form.details.forEach((d, idx) => {
      if (!d.JENISBARANG) newErrors[`details-${idx}-JENISBARANG`] = 'Jenis barang harus dipilih';
      if (!d.IDBARANG) newErrors[`details-${idx}-IDBARANG`] = 'Barang harus dipilih';
      if (!d.QTY || d.QTY <= 0) newErrors[`details-${idx}-QTY`] = 'Qty harus lebih dari 0';
      if (!d.HARGABELI || d.HARGABELI <= 0) newErrors[`details-${idx}-HARGABELI`] = 'Harga beli harus lebih dari 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form ketika dialog ditutup
  useEffect(() => {
    if (!visible) {
      setForm(initialForm());
      setErrors({});
    }
  }, [visible]);

  const addDetail = () => {
    setForm({
      ...form,
      details: [
        ...form.details,
        { JENISBARANG: 'OBAT', IDBARANG: null, QTY: 1, HARGABELI: 0 }
      ]
    });
  };

  const removeDetail = (idx) => {
    const newDetails = form.details.filter((_, i) => i !== idx);
    setForm({ ...form, details: newDetails });
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form); // kirim ke parent
    onHide();       // parent bisa simpan data ke server
  };

  return (
    <Dialog
      header="Tambah Pemesanan"
      visible={visible}
      onHide={onHide}
      style={{ width: '55vw' }}
    >
      <div className="space-y-4">
        {/* Tanggal Pemesanan */}
        <div>
          <label>Tanggal Pemesanan</label>
          <Calendar
            className={classNames('w-full mt-2', { 'p-invalid': errors.TGLPEMESANAN })}
            dateFormat="yy-mm-dd"
            value={form.TGLPEMESANAN ? new Date(form.TGLPEMESANAN) : null}
            onChange={(e) =>
              setForm({
                ...form,
                TGLPEMESANAN: e.value?.toISOString().split('T')[0] || ''
              })
            }
            showIcon
          />
          {errors.TGLPEMESANAN && <small className="p-error">{errors.TGLPEMESANAN}</small>}
        </div>

        {/* Supplier */}
        <div>
          <label>Supplier</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.SUPPLIERID })}
            value={form.SUPPLIERID}
            options={(suppliers || []).map(s => ({
              label: s.NAMASUPPLIER,
              value: s.SUPPLIERID
            }))}
            onChange={(e) => setForm({ ...form, SUPPLIERID: e.value })}
            placeholder="Pilih Supplier"
          />
          {errors.SUPPLIERID && <small className="p-error">{errors.SUPPLIERID}</small>}
        </div>

        {/* Detail Barang */}
        <div>
          <label>Detail Barang</label>
          {form.details.length === 0 && errors.details && (
            <small className="p-error block mt-1">{errors.details}</small>
          )}

          {form.details.map((d, idx) => (
            <div
              key={idx}
              className="grid grid-cols-5 gap-2 items-center mt-3 border p-3 rounded-lg shadow-sm"
            >
              {/* Jenis Barang */}
              <div>
                <Dropdown
                  value={d.JENISBARANG}
                  options={[
                    { label: 'OBAT', value: 'OBAT' },
                    { label: 'ALKES', value: 'ALKES' }
                  ]}
                  onChange={(e) => {
                    const newDetails = [...form.details];
                    newDetails[idx].JENISBARANG = e.value;
                    newDetails[idx].IDBARANG = null;
                    setForm({ ...form, details: newDetails });
                  }}
                  className={classNames({ 'p-invalid': errors[`details-${idx}-JENISBARANG`] })}
                />
                {errors[`details-${idx}-JENISBARANG`] && (
                  <small className="p-error">{errors[`details-${idx}-JENISBARANG`]}</small>
                )}
              </div>

              {/* Pilih Barang */}
              <div>
                <Dropdown
                  className={classNames('w-full', { 'p-invalid': errors[`details-${idx}-IDBARANG`] })}
                  value={d.IDBARANG}
                  options={(d.JENISBARANG === 'OBAT' ? obat : alkes).map(b => ({
                    label: b.NAMAOBAT || b.NAMAALKES,
                    value: b.IDOBAT || b.IDALKES
                  }))}
                  onChange={(e) => {
                    const newDetails = [...form.details];
                    newDetails[idx].IDBARANG = e.value;
                    setForm({ ...form, details: newDetails });
                  }}
                  placeholder={`Pilih ${d.JENISBARANG}`}
                />
                {errors[`details-${idx}-IDBARANG`] && (
                  <small className="p-error">{errors[`details-${idx}-IDBARANG`]}</small>
                )}
              </div>

              {/* Qty */}
              <div>
                <InputNumber
                  value={d.QTY}
                  className={classNames('w-full', { 'p-invalid': errors[`details-${idx}-QTY`] })}
                  onValueChange={(e) => {
                    const newDetails = [...form.details];
                    newDetails[idx].QTY = e.value;
                    setForm({ ...form, details: newDetails });
                  }}
                  min={1}
                />
                {errors[`details-${idx}-QTY`] && (
                  <small className="p-error">{errors[`details-${idx}-QTY`]}</small>
                )}
              </div>

              {/* Harga Beli */}
              <div>
                <InputNumber
                  value={d.HARGABELI}
                  className={classNames('w-full', { 'p-invalid': errors[`details-${idx}-HARGABELI`] })}
                  onValueChange={(e) => {
                    const newDetails = [...form.details];
                    newDetails[idx].HARGABELI = e.value;
                    setForm({ ...form, details: newDetails });
                  }}
                  mode="currency"
                  currency="IDR"
                  locale="id-ID"
                />
                {errors[`details-${idx}-HARGABELI`] && (
                  <small className="p-error">{errors[`details-${idx}-HARGABELI`]}</small>
                )}
              </div>

              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-outlined"
                onClick={() => removeDetail(idx)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-between">
          <Button
            label="Tambah Barang"
            icon="pi pi-plus"
            onClick={addDetail}
            className="p-button-outlined"
          />
          <Button
            label="Simpan Pemesanan"
            icon="pi pi-save"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default FormPemesanan;