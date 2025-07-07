//formPoli
"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const FormPoli = ({ visible, formData, onHide, onChange, onSubmit }) => {
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
            className="w-full mt-2"
            value={formData.NAMAPOLI}
            onChange={(e) => onChange({ ...formData, NAMAPOLI: e.target.value })}
          />
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormPoli;
