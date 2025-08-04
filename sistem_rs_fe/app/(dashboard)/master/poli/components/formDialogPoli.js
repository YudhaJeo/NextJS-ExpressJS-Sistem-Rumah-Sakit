"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const FormPoli = ({ visible, formData, onHide, onChange, onSubmit, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={formData.IDPOLI ? "Edit Poli" : "Tambah Poli"}
      visible={visible}
      onHide={onHide}
      style={{ width: "30vw" }}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label>Nama Poli</label>
          <InputText
            className={inputClass('NAMAPOLI')}
            value={formData.NAMAPOLI}
            onChange={(e) => onChange({ ...formData, NAMAPOLI: e.target.value })}
          />
          {errors.NAMAPOLI && <small className="text-red-500">{errors.NAMAPOLI}</small>}
        </div>

        <div>
          <label>Kode</label>
          <InputText
            className={inputClass('KODE')}
            value={formData.KODE}
            onChange={(e) => onChange({ ...formData, KODE: e.target.value })}
          />
          {errors.KODE && <small className="text-red-500">{errors.KODE}</small>}
        </div>

        <div>
          <label>Zona</label>
          <InputText
            className={inputClass('ZONA')}
            value={formData.ZONA}
            onChange={(e) => onChange({ ...formData, ZONA: e.target.value })}
          />
          {errors.ZONA && <small className="text-red-500">{errors.ZONA}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormPoli;