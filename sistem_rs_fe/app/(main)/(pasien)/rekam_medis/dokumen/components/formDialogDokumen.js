"use client";

import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { useState } from "react";

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
  const [fotoPreview, setFotoPreview] = useState(null);

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
          <label className="font-medium">NIK Pasien</label>
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
          <label className="font-medium">Jenis Dokumen</label>
          <Dropdown
            className={inputClass("JENISDOKUMEN")}
            options={JenisDokumenOptions}
            value={form.JENISDOKUMEN}
            onChange={(e) => setForm({ ...form, JENISDOKUMEN: e.value })}
            placeholder="Pilih"
          />
          {errors.JENISDOKUMEN && (
            <small className="text-red-500">{errors.JENISDOKUMEN}</small>
          )}
        </div>

        <div>
          <label className="font-medium">Upload Dokumen</label>
          <FileUpload 
            className="mt-2"
            mode="basic"
            name="file"
            accept="image/*,.pdf"
            maxFileSize={10000000}
            auto
            chooseLabel="Pilih File"
            onSelect={(e) => {
              if (e.files && e.files.length > 0) {
                const file = e.files[0];
                setForm({ ...form, file });
                if (file.type.startsWith("image/")) {
                  setFotoPreview(URL.createObjectURL(file));
                } else {
                  setFotoPreview(null);
                }
              }
            }}
          />
          {fotoPreview && (
            <img
              src={fotoPreview}
              alt="Preview"
              className="mt-3 w-full h-40 object-contain border rounded"
            />
          )}
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