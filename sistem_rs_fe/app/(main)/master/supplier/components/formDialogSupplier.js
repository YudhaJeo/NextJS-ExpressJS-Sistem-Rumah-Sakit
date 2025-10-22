"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const FormSupplier = ({ visible, formData, onHide, onChange, onSubmit, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={formData.IDSUPPLIER ? "Edit Supplier" : "Tambah Supplier"}
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
        <div className ="mt-2">
          <label>Nama Supplier</label>
          <InputText
            className={inputClass('NAMASUPPLIER')}
            value={formData.NAMASUPPLIER}
            onChange={(e) => onChange({ ...formData, NAMASUPPLIER: e.target.value })}
          />
          {errors.NAMASUPPLIER && <small className="text-red-500">{errors.NAMASUPPLIER}</small>}
        </div>

        <div className ="mt-2">
          <label>Alamat</label>
          <InputText
            className={inputClass('ALAMAT')}
            value={formData.ALAMAT}
            onChange={(e) => onChange({ ...formData, ALAMAT: e.target.value })}
          />
          {errors.ALAMAT && <small className="text-red-500">{errors.ALAMAT}</small>}
        </div>

        <div className ="mt-2">
          <label>Kota</label>
          <InputText
            className={inputClass('KOTA')}
            value={formData.KOTA}
            onChange={(e) => onChange({ ...formData, KOTA: e.target.value })}
          />
          {errors.KOTA && <small className="text-red-500">{errors.KOTA}</small>}
        </div>

        <div className ="mt-2">
          <label>Telepon</label>
          <InputText
            className={inputClass('TELEPON')}
            value={formData.TELEPON}
            onChange={(e) => onChange({ ...formData, TELEPON: e.target.value })}
          />
          {errors.TELEPON && <small className="text-red-500">{errors.TELEPON}</small>}
        </div>

        <div className ="mt-2">
          <label>Email</label>
          <InputText
            className={inputClass('EMAIL')}
            value={formData.EMAIL}
            onChange={(e) => onChange({ ...formData, EMAIL: e.target.value })}
          />
          {errors.EMAIL && <small className="text-red-500">{errors.EMAIL}</small>}
        </div>

        <div className ="mt-2">
          <label>Nama Sales</label>
          <InputText
            className={inputClass('NAMASALES')}
            value={formData.NAMASALES}
            onChange={(e) => onChange({ ...formData, NAMASALES: e.target.value })}
          />
          {errors.NAMASALES && <small className="text-red-500">{errors.NAMASALES}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormSupplier;