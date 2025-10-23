"use client";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { useState } from "react";

const FormDialogBerita = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  errors,
  inputClass,
}) => {
  const [fotoPreview, setFotoPreview] = useState(null);

  return (
    <Dialog
      header={form.IDBERITA ? "Edit Berita" : "Tambah Berita"}
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
        <div className ="mt-3">
          <label>Judul Berita</label>
          <InputText
            className={inputClass('JUDUL')}
            maxLength={60}
            value={form.JUDUL}
            placeholder="Max 60 huruf"
            onChange={(e) => setForm({ ...form, JUDUL: e.target.value })}
          />
          {errors.JUDUL && <small className="text-red-500">{errors.JUDUL}</small>}
        </div>

        <div className ="mt-3">
          <label>Deskripsi Singkat</label>
          <InputText
            className={inputClass('DESKRIPSISINGKAT')}
            maxLength={100}
            value={form.DESKRIPSISINGKAT}
            placeholder="Max 100 huruf"
            onChange={(e) => setForm({ ...form, DESKRIPSISINGKAT: e.target.value })}
          />
          {errors.DESKRIPSISINGKAT && <small className="text-red-500">{errors.DESKRIPSISINGKAT}</small>}
        </div>

        <div className ="mt-3">
          <label>URL Berita</label>
          <InputText
            className={inputClass('URL')}
            value={form.URL}
            placeholder="Masukan URL berita "
            onChange={(e) => setForm({ ...form, URL: e.target.value })}
          />
          {errors.URL && <small className="text-red-500">{errors.DESKRIPSISINGKAT}</small>}
        </div>
        
        <div className ="mt-3">
          <label>Upload Thumbnail Berita</label>
          <FileUpload 
            className="mt-1"
            mode="basic"
            name="file"
            accept="image/*"
            maxFileSize={1000000}
            auto={false}          
            customUpload={true} 
            chooseLabel="Pilih File"
            onSelect={(e) => {
              if (e.files && e.files.length > 0) {
                const file = e.files[0];
                setForm({ ...form, PRATINJAU: file }); 
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

export default FormDialogBerita;