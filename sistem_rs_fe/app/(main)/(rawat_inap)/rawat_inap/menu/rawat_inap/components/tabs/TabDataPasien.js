import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

const TabDataPasien = ({
  form,
  setForm,
  errors,
  rawatJalanOptions,
  isEditMode,
  inputClass
}) => {
  const formatGender = (gender) => {
    if(!gender) return "-";
    return gender === "L" ? "Laki-Laki" : "Perempuan";
  };

  return (
    <>
      <div className="mt-2">
        <label>Rawat Inap</label>
        <Dropdown
          className={inputClass('IDRAWATJALAN')}
          value={form.IDRAWATJALAN}
          options={rawatJalanOptions}
          onChange={(e) => {
            const selected = rawatJalanOptions.find((o) => o.value === e.value);
            setForm({
              ...form,
              IDRAWATJALAN: e.value,
              POLI: selected?.POLI || '',
              JENISKELAMIN: selected?.JENISKELAMIN || '',
              NIK: selected?.NIK || '',
              ALAMAT_PASIEN: selected?.ALAMAT_PASIEN || '',
              DIAGNOSA: selected?.DIAGNOSA || '',
            })
          }}
          readOnly={isEditMode}
          placeholder="Pilih Rawat Inap"
          filter
          showClear
          optionLabel="label"
        />
        {errors.IDRAWATJALAN && <small className="text-red-500">{errors.IDRAWATJALAN}</small>}
      </div>

      <div className="mt-2">
        <label>Poli</label>
        <InputText
          className={inputClass('POLI')}
          value={form.POLI}
          onChange={(e) => setForm({ ...form, POLI: e.target.value })}
          readOnly={isEditMode}
        />
      </div>

      <div className="mt-2">
        <label>Diagnosa</label>
        <InputText
          className={inputClass('DIAGNOSA')}
          value={form.DIAGNOSA}
          onChange={(e) => setForm({ ...form, DIAGNOSA: e.target.value })}
          readOnly={isEditMode}
        />
      </div>
      
      <div className="mt-2">
        <label>Jenis Kelamin</label>    
        <InputText
          readOnly={isEditMode}
          className={inputClass('JENISKELAMIN')}
          value={formatGender(form.JENISKELAMIN)}
        />
      </div>
      
      <div className="mt-2">
        <label>NIK</label>
        <InputText
          readOnly={isEditMode}
          className={inputClass('NIK')}
          value={form.NIK}
        />
      </div>

      <div className="mt-2">
        <label>Alamat</label>
        <InputText
          readOnly={isEditMode}
          className={inputClass('ALAMAT_PASIEN')}
          value={form.ALAMAT_PASIEN}
        />
      </div>
    </>
  );
};

export default TabDataPasien;
