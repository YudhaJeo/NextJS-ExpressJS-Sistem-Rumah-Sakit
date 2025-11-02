"use client";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { useState, useEffect } from "react";

const FormDialogProfile = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  errors,
  inputClass,
}) => {
  const [fotoPreview, setFotoPreview] = useState(null);

  useEffect(() => {
    if (form.FOTOLOGO && typeof form.FOTOLOGO === "string") {
      setFotoPreview(form.FOTOLOGO);
    } else {
      setFotoPreview(null);
    }
  }, [form, visible]);

  return (
    <Dialog
      header="Edit Profil Rumah Sakit"
      visible={visible}
      onHide={onHide}
      style={{ width: "40vw" }}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
         <div className = "mt-3">
          <label>Nama Rumah Sakit</label>
          <InputText
            className={inputClass("NAMARS")}
            value={form.NAMARS || ""}
            onChange={(e) => setForm({ ...form, NAMARS: e.target.value })}
          />
          {errors.NAMARS && (
            <small className="text-red-500">{errors.NAMARS}</small>
          )}
        </div>

         <div className = "mt-3">
          <label>Alamat</label>
          <InputTextarea
            className={inputClass("ALAMAT")}
            rows={3}
            value={form.ALAMAT || ""}
            onChange={(e) => setForm({ ...form, ALAMAT: e.target.value })}
          />
          {errors.ALAMAT && (
            <small className="text-red-500">{errors.ALAMAT}</small>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div className = "mt-3">
            <label>Email</label>
            <InputText
              className="w-full mt-2"
              value={form.EMAIL || ""}
              onChange={(e) => setForm({ ...form, EMAIL: e.target.value })}
            />
          </div>
           <div className = "mt-3">
            <label>No. Hotline</label>
            <InputText
              className="w-full mt-2"
              value={form.NOMORHOTLINE || ""}
              onChange={(e) =>
                setForm({ ...form, NOMORHOTLINE: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div className = "mt-3">
            <label>No. Telp Ambulan</label>
            <InputText
              className="w-full mt-2"
              value={form.NOTELPAMBULAN || ""}
              onChange={(e) =>
                setForm({ ...form, NOTELPAMBULAN: e.target.value })
              }
            />
          </div>
           <div>
            <label>No. Ambulan WhatsApp</label>
            <InputText
              className="w-full mt-2"
              value={form.NOAMBULANWA || ""}
              onChange={(e) =>
                setForm({ ...form, NOAMBULANWA: e.target.value })
              }
            />
          </div>
        </div>

         <div className = "mt-3">
          <label>Deskripsi</label>
          <InputTextarea
            rows={3}
            className="w-full mt-2"
            value={form.DESKRIPSI || ""}
            onChange={(e) => setForm({ ...form, DESKRIPSI: e.target.value })}
          />
        </div>

         <div className = "mt-3">
          <label>Visi</label>
          <InputTextarea
            rows={3}
            className="w-full mt-2"
            value={form.VISI || ""}
            onChange={(e) => setForm({ ...form, VISI: e.target.value })}
          />
        </div>

         <div className = "mt-3">
          <label>Misi</label>
          <InputTextarea
            rows={3}
            className="w-full mt-2"
            value={form.MISI || ""}
            onChange={(e) => setForm({ ...form, MISI: e.target.value })}
          />
        </div>

         <div className = "mt-3">
          <label>Logo Rumah Sakit</label>
         <FileUpload
            className="mt-1"
            mode="basic"
            name="file"
            accept="image/*"
            maxFileSize={1000000}
            auto={false}
            customUpload={true}
            chooseLabel="Pilih Logo"
            onSelect={(e) => {
              if (e.files && e.files.length > 0) {
                const file = e.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  setForm({ ...form, FOTOLOGO: reader.result }); // base64 string
                  setFotoPreview(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />

          {fotoPreview && (
            <img
              src={fotoPreview}
              alt="Logo"
              className="w-5 h-5 object-contain border rounded-lg shadow-sm"
            />
          )}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogProfile;
