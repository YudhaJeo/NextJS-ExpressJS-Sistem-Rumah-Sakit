"use client";

import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const FormDialogDokumen = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  pasienOptions,
  errors,
  inputClass,
  JenisDokumenOptions,
}) => {
  return (
    <Dialog
      header={form.IDDOKUMEN ? "Edit Dokumen" : "Tambah Dokumen"}
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
          <label>NIK Pasien</label>
          <Dropdown
            className={inputClass("NIK")}
            value={form.NIK}
            options={pasienOptions}
            onChange={(e) => {
              const selected = pasienOptions.find((p) => p.value === e.value);
              setForm({
                ...form,
                NIK: e.value,
                NAMALENGKAP: selected?.NAMALENGKAP || "",
              });
            }}
            placeholder="Pilih NIK"
            filter
            showClear
          />
          {errors.NIK && <small className="text-red-500">{errors.NIK}</small>}
        </div>

        <div>
          <label>Jenis Dokumen</label>
          <Dropdown
            className={inputClass("JENISDOKUMEN")}
            options={JenisDokumenOptions}
            value={form.JENISDOKUMEN}
            onChange={(e) => setForm({ ...form, JENISDOKUMEN: e.value })}
            placeholder="Pilih"
          />
          {errors.JENISDOKUMEN && <small className="text-red-500">{errors.JENISDOKUMEN}</small>}
        </div>

        <div>
          <label>Unggah File</label>
          <input
            type="file"
            className={inputClass("file")}
            onChange={(e) => {
              const file = e.target.files[0];
              setForm({ ...form, file });
            }}
          />
          {errors.file && <small className="text-red-500">{errors.file}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogDokumen;