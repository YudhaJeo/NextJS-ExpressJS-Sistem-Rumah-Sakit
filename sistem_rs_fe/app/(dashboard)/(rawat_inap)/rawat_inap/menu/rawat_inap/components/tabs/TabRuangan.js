import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const TabRuangan = ({
  form,
  setForm,
  errors,
  bedOptions,
  isEditMode,
  inputClass
}) => {
  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value || 0);

  return (
    <>
      <div className="mt-2">
        <label>Bed</label>
        <Dropdown
          className={inputClass('IDBED')}
          value={form.IDBED}
          options={bedOptions}
          onChange={(e) => {
            const selected = bedOptions.find((o) => o.value === e.value);
            setForm({
              ...form,
              IDBED: e.value,
              NAMAKAMAR: selected?.NAMAKAMAR || '',
              NAMABANGSAL: selected?.NAMABANGSAL || '',
              HARGAPERHARI: selected?.HARGAPERHARI || '',
              STATUSBED: selected?.STATUSBED || '',
            })
          }}
          placeholder="Pilih Bed"
          filter
          showClear
          optionLabel="label"
        />
        {errors.IDBED && <small className="text-red-500">{errors.IDBED}</small>}
      </div>

      <div className="mt-2">
        <label>Tanggal Masuk (Mulai)</label>
        <Calendar
          className={inputClass('TANGGALMASUK')}
          value={form.TANGGALMASUK ? new Date(form.TANGGALMASUK) : null}
          onChange={(e) => setForm({ ...form, TANGGALMASUK: e.value })}
          showButtonBar
          showIcon
          dateFormat="yy-mm-dd"
          placeholder="Waktu Pemberian"
        />
        {errors.TANGGALMASUK && <small className="text-red-500">{errors.TANGGALMASUK}</small>}
      </div>

      <div className="mt-2">
        <label className="mb-1">Tanggal Keluar (Pulang)</label>
        <div className="flex items-center gap-2">
          <Calendar
            className={inputClass('TANGGALKELUAR')}
            value={form.TANGGALKELUAR ? new Date(form.TANGGALKELUAR) : null}
            onChange={(e) => setForm({ ...form, TANGGALKELUAR: e.value })}
            showButtonBar
            showIcon
            dateFormat="yy-mm-dd"
            placeholder="Waktu Pemberian"
          />
        </div>
        {errors.TANGGALKELUAR && (
          <small className="text-red-500">{errors.TANGGALKELUAR}</small>
        )}
      </div>

      <div className="mt-2">
        <label>Catatan</label>
        <InputTextarea
          className={inputClass('CATATAN')}
          value={form.CATATAN || ''}
          onChange={(e) => setForm({ ...form, CATATAN: e.target.value })}
          placeholder="Masukkan catatan (Opsional)"
        />
      </div>

      <div className="mt-2">
        <label>Kamar</label>
        <InputText
          disabled={isEditMode}
          className={inputClass('NAMAKAMAR')}
          value={form.NAMAKAMAR}
        />
      </div>

      <div className="mt-2">
        <label>Bangsal</label>
        <InputText
          disabled={isEditMode}
          className={inputClass('NAMABANGSAL')}
          value={form.NAMABANGSAL}
        />
      </div>
    
      <div className="mt-2">
        <label>Harga Bangsal (Hari)</label>
        <InputText
          disabled={isEditMode}
          className={inputClass('HARGAPERHARI')}
          value={formatRupiah(form.HARGAPERHARI)}
          mode='currency'
        />
      </div>
    </>
  );
};

export default TabRuangan;
