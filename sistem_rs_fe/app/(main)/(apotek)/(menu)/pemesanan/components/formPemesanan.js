'use client';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';

const initialForm = () => ({
  TGLPEMESANAN: new Date().toISOString().split('T')[0],
  SUPPLIERID: null,
  details: []
});

const FormPemesanan = ({ visible, onHide, onSubmit, suppliers, obat, alkes }) => {
  const [form, setForm] = useState(initialForm());
  const [errors, setErrors] = useState({});

  const inputClass = (field) =>
    classNames('w-full mt-2', { 'p-invalid': errors[field] });

  const validate = () => {
    const newErrors = {};
    if (!form.TGLPEMESANAN) newErrors.TGLPEMESANAN = 'Tanggal pemesanan harus diisi';
    if (!form.SUPPLIERID) newErrors.SUPPLIERID = 'Supplier harus dipilih';
    if (form.details.length === 0) newErrors.details = 'Minimal satu barang harus diisi';

    form.details.forEach((d, idx) => {
      if (!d.JENISBARANG) newErrors[`details-${idx}-JENISBARANG`] = 'Jenis harus dipilih';
      if (!d.IDBARANG) newErrors[`details-${idx}-IDBARANG`] = 'Barang harus dipilih';
      if (!d.QTY || d.QTY <= 0) newErrors[`details-${idx}-QTY`] = 'Qty > 0';
      if (!d.HARGABELI || d.HARGABELI <= 0) newErrors[`details-${idx}-HARGABELI`] = 'Harga > 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    const details = form.details.filter((_, i) => i !== idx);
    setForm({ ...form, details });
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    onHide();
  };

  return (
    <Dialog header="Form Pemesanan" visible={visible} onHide={onHide} style={{ width: '60vw' }}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Tanggal Pemesanan */}
        <div>
          <label>Tanggal Pemesanan</label>
          <Calendar
            className={inputClass('TGLPEMESANAN')}
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
          {errors.TGLPEMESANAN && <small className="text-red-500">{errors.TGLPEMESANAN}</small>}
        </div>

        {/* Supplier */}
        <div>
          <label>Supplier</label>
          <Dropdown
            className={inputClass('SUPPLIERID')}
            value={form.SUPPLIERID}
            options={(suppliers || []).map(s => ({ label: s.NAMASUPPLIER, value: s.SUPPLIERID }))}
            onChange={(e) => setForm({ ...form, SUPPLIERID: e.value })}
            placeholder="Pilih Supplier"
            filter
            showClear
          />
          {errors.SUPPLIERID && <small className="text-red-500">{errors.SUPPLIERID}</small>}
        </div>

        {/* Detail Barang */}
        <div>
          <label>Detail Barang</label>
          {errors.details && <small className="text-red-500 block">{errors.details}</small>}

          {form.details.map((d, idx) => (
            <div
              key={idx}
              className="flex flex-wrap md:flex-nowrap items-start gap-2 border rounded-md p-3 mt-2"
            >
              {/* Jenis Barang */}
              <div className="w-24">
                <Dropdown
                  value={d.JENISBARANG}
                  options={[{ label: 'OBAT', value: 'OBAT' }, { label: 'ALKES', value: 'ALKES' }]}
                  onChange={(e) => {
                    const details = [...form.details];
                    details[idx].JENISBARANG = e.value;
                    details[idx].IDBARANG = null;
                    setForm({ ...form, details });
                  }}
                  className={inputClass(`details-${idx}-JENISBARANG`)}
                />
                {errors[`details-${idx}-JENISBARANG`] && (
                  <small className="text-red-500">{errors[`details-${idx}-JENISBARANG`]}</small>
                )}
              </div>

              {/* Nama Barang */}
              <div className="flex-1 min-w-[150px]">
                <Dropdown
                  className={inputClass(`details-${idx}-IDBARANG`)}
                  value={d.IDBARANG}
                  options={(d.JENISBARANG === 'OBAT' ? obat : alkes).map(b => ({
                    label: b.NAMAOBAT || b.NAMAALKES,
                    value: b.IDOBAT || b.IDALKES
                  }))}
                  onChange={(e) => {
                    const details = [...form.details];
                    details[idx].IDBARANG = e.value;
                    setForm({ ...form, details });
                  }}
                  placeholder={`Pilih ${d.JENISBARANG}`}
                  filter
                  showClear
                />
                {errors[`details-${idx}-IDBARANG`] && (
                  <small className="text-red-500">{errors[`details-${idx}-IDBARANG`]}</small>
                )}
              </div>

              {/* QTY */}
              <div className="w-20">
                <InputNumber
                  value={d.QTY}
                  className={inputClass(`details-${idx}-QTY`)}
                  onValueChange={(e) => {
                    const details = [...form.details];
                    details[idx].QTY = e.value;
                    setForm({ ...form, details });
                  }}
                  min={1}
                />
                {errors[`details-${idx}-QTY`] && (
                  <small className="text-red-500">{errors[`details-${idx}-QTY`]}</small>
                )}
              </div>

              {/* Harga Beli */}
              <div className="w-36">
                <InputNumber
                  value={d.HARGABELI}
                  className={inputClass(`details-${idx}-HARGABELI`)}
                  onValueChange={(e) => {
                    const details = [...form.details];
                    details[idx].HARGABELI = e.value;
                    setForm({ ...form, details });
                  }}
                  mode="currency"
                  currency="IDR"
                  locale="id-ID"
                />
                {errors[`details-${idx}-HARGABELI`] && (
                  <small className="text-red-500">{errors[`details-${idx}-HARGABELI`]}</small>
                )}
              </div>

              <div className="mt-2">
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm"
                  onClick={() => removeDetail(idx)}
                  type="button"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-between pt-4">
          <Button
            label="Tambah Barang"
            icon="pi pi-plus"
            onClick={addDetail}
            className="p-button-outlined"
            type="button"
          />
          <Button
            type="submit"
            label="Simpan Pemesanan"
            icon="pi pi-save"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default FormPemesanan;
