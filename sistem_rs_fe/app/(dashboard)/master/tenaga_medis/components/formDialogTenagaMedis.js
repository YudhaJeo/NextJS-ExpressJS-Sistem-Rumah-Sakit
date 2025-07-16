"use client";

import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { FileUpload } from "primereact/fileupload";
import { classNames } from "primereact/utils";

const jenisKelaminOptions = [
  { label: "Laki-laki", value: "L" },
  { label: "Perempuan", value: "P" },
];

const statusKepegawaianOptions = [
  { label: "Tetap", value: "Tetap" },
  { label: "Kontrak", value: "Kontrak" },
  { label: "Honorer", value: "Honorer" },
];

function FormDialogTenagaMedis({ visible, onHide, onSubmit, form, setForm }) {
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [previewDokumen, setPreviewDokumen] = useState(null);

  useEffect(() => {
    if (!visible) {
      setErrors({});
      setPreviewImage(null);
      setPreviewDokumen(null);
    } else {
      if (form.FOTOPROFIL) {
        setPreviewImage(
          typeof form.FOTOPROFIL === "string"
            ? `/uploads/tenaga_medis/${form.FOTOPROFIL}`
            : URL.createObjectURL(form.FOTOPROFIL)
        );
      }
      if (form.DOKUMENPENDUKUNG) {
        setPreviewDokumen(
          typeof form.DOKUMENPENDUKUNG === "string"
            ? form.DOKUMENPENDUKUNG
            : form.DOKUMENPENDUKUNG.name
        );
      }
    }
  }, [visible, form.FOTOPROFIL, form.DOKUMENPENDUKUNG]);

  const validate = () => {
    const newErrors = {};

    if (!form.KODETENAGAMEDIS) newErrors.KODETENAGAMEDIS = "Kode wajib diisi";
    if (!form.NAMALENGKAP) newErrors.NAMALENGKAP = "Nama wajib diisi";
    if (!form.JENISKELAMIN) newErrors.JENISKELAMIN = "Jenis kelamin wajib dipilih";
    if (!form.TEMPATLAHIR) newErrors.TEMPATLAHIR = "Tempat lahir wajib diisi";
    if (!form.NOHP) newErrors.NOHP = "No. HP wajib diisi";
    if (!form.EMAIL) newErrors.EMAIL = "Email wajib diisi";
    if (!form.JENISTENAGAMEDIS) newErrors.JENISTENAGAMEDIS = "Jenis tenaga medis wajib dipilih";
    if (!form.STATUSKEPEGAWAIAN) newErrors.STATUSKEPEGAWAIAN = "Status kepegawaian wajib dipilih";
    if (!form.SPESIALISASI) newErrors.SPESIALISASI = "Spesialisasi wajib diisi";
    if (!form.NOSTR) newErrors.NOSTR = "No. STR wajib diisi";
    if (!form.TGLEXPSTR) newErrors.TGLEXPSTR = "Tgl Exp STR wajib dipilih";
    if (!form.NOSIP) newErrors.NOSIP = "No. SIP wajib diisi";
    if (!form.TGLEXPSIP) newErrors.TGLEXPSIP = "Tgl Exp SIP wajib dipilih";
    if (!form.UNITKERJA) newErrors.UNITKERJA = "Unit Kerja wajib diisi";

    if (!form.IDTENAGAMEDIS && !form.PASSWORD) {
      newErrors.PASSWORD = "Password wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const handleFileUpload = (field, e) => {
    const file = e.files[0];
    if (file) {
      setForm({ ...form, [field]: file });
      if (field === "FOTOPROFIL") {
        const reader = new FileReader();
        reader.onload = (ev) => setPreviewImage(ev.target.result);
        reader.readAsDataURL(file);
      } else if (field === "DOKUMENPENDUKUNG") {
        setPreviewDokumen(file.name);
      }
    }
  };

  return (
    <Dialog
      header={form.IDTENAGAMEDIS ? "Edit Tenaga Medis" : "Tambah Tenaga Medis"}
      visible={visible}
      onHide={onHide}
      style={{ width: "50vw" }}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">Kode Tenaga Medis</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.KODETENAGAMEDIS })}
            value={form.KODETENAGAMEDIS}
            onChange={(e) => setForm({ ...form, KODETENAGAMEDIS: e.target.value })}
          />
          {errors.KODETENAGAMEDIS && <small className="p-error">{errors.KODETENAGAMEDIS}</small>}
        </div>

        <div>
          <label className="font-medium">Nama Lengkap</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.NAMALENGKAP })}
            value={form.NAMALENGKAP}
            onChange={(e) => setForm({ ...form, NAMALENGKAP: e.target.value })}
          />
          {errors.NAMALENGKAP && <small className="p-error">{errors.NAMALENGKAP}</small>}
        </div>

        <div>
          <label className="font-medium">Jenis Kelamin</label>
          <Dropdown
            className={classNames("w-full mt-2", { "p-invalid": errors.JENISKELAMIN })}
            value={form.JENISKELAMIN}
            options={jenisKelaminOptions}
            onChange={(e) => setForm({ ...form, JENISKELAMIN: e.value })}
            placeholder="Pilih"
          />
          {errors.JENISKELAMIN && <small className="p-error">{errors.JENISKELAMIN}</small>}
        </div>

        <div>
          <label className="font-medium">Tempat Lahir</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.TEMPATLAHIR })}
            value={form.TEMPATLAHIR}
            onChange={(e) => setForm({ ...form, TEMPATLAHIR: e.target.value })}
          />
          {errors.TEMPATLAHIR && <small className="p-error">{errors.TEMPATLAHIR}</small>}
        </div>

        <div>
          <label className="font-medium">Tanggal Lahir</label>
          <Calendar
            className={classNames("w-full mt-2", { "p-invalid": errors.TANGGALLAHIR })}
            value={form.TANGGALLAHIR ? new Date(form.TANGGALLAHIR) : null}
            onChange={(e) => setForm({ ...form, TANGGALLAHIR: e.value })}
            showIcon
            dateFormat="dd-mm-yy"
          />
          {errors.TANGGALLAHIR && <small className="p-error">{errors.TANGGALLAHIR}</small>}
        </div>

        <div>
          <label className="font-medium">No. HP</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.NOHP })}
            value={form.NOHP}
            onChange={(e) => setForm({ ...form, NOHP: e.target.value })}
          />
          {errors.NOHP && <small className="p-error">{errors.NOHP}</small>}
        </div>

        <div>
          <label className="font-medium">Email</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.EMAIL })}
            value={form.EMAIL}
            onChange={(e) => setForm({ ...form, EMAIL: e.target.value })}
          />
          {errors.EMAIL && <small className="p-error">{errors.EMAIL}</small>}
        </div>

        <div>
          <label className="font-medium">Password</label>
          <Password
            className={classNames("w-full mt-2", { "p-invalid": errors.PASSWORD })}
            value={form.PASSWORD}
            onChange={(e) => setForm({ ...form, PASSWORD: e.target.value })}
            toggleMask
            placeholder={form.IDTENAGAMEDIS ? "(Password tidak diubah)" : "Masukkan Password"}
            disabled={!!form.IDTENAGAMEDIS}
            feedback={false}
          />
          {errors.PASSWORD && <small className="p-error">{errors.PASSWORD}</small>}
        </div>

        <div>
          <label className="font-medium">Jenis Tenaga Medis</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.JENISTENAGAMEDIS })}
            value={form.JENISTENAGAMEDIS}
            onChange={(e) => setForm({ ...form, JENISTENAGAMEDIS: e.value })}
          />
          {errors.JENISTENAGAMEDIS && (
            <small className="p-error">{errors.JENISTENAGAMEDIS}</small>
          )}
        </div>

        <div>
          <label className="font-medium">Spesialisasi</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.SPESIALISASI })}
            value={form.SPESIALISASI || ""}
            onChange={(e) => setForm({ ...form, SPESIALISASI: e.target.value })}
          />
          {errors.SPESIALISASI && <small className="p-error">{errors.SPESIALISASI}</small>}
        </div>

        <div>
          <label className="font-medium">No. STR</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.NOSTR })}
            value={form.NOSTR || ""}
            onChange={(e) => setForm({ ...form, NOSTR: e.target.value })}
          />
          {errors.NOSTR && <small className="p-error">{errors.NOSTR}</small>}
        </div>

        <div>
          <label className="font-medium">Tgl Exp STR</label>
          <Calendar
            className={classNames("w-full mt-2", { "p-invalid": errors.TGLEXPSTR })}
            value={form.TGLEXPSTR ? new Date(form.TGLEXPSTR) : null}
            onChange={(e) => setForm({ ...form, TGLEXPSTR: e.value })}
            dateFormat="yy-mm-dd"
            showIcon
          />
          {errors.TGLEXPSTR && <small className="p-error">{errors.TGLEXPSTR}</small>}
        </div>

        <div>
          <label className="font-medium">No. SIP</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.NOSIP })}
            value={form.NOSIP || ""}
            onChange={(e) => setForm({ ...form, NOSIP: e.target.value })}
          />
          {errors.NOSIP && <small className="p-error">{errors.NOSIP}</small>}
        </div>

        <div>
          <label className="font-medium">Tgl Exp SIP</label>
          <Calendar
            className={classNames("w-full mt-2", { "p-invalid": errors.TGLEXPSIP })}
            value={form.TGLEXPSIP ? new Date(form.TGLEXPSIP) : null}
            onChange={(e) => setForm({ ...form, TGLEXPSIP: e.value })}
            dateFormat="yy-mm-dd"
            showIcon
          />
          {errors.TGLEXPSIP && <small className="p-error">{errors.TGLEXPSIP}</small>}
        </div>

        <div>
          <label className="font-medium">Unit Kerja</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.UNITKERJA })}
            value={form.UNITKERJA || ""}
            onChange={(e) => setForm({ ...form, UNITKERJA: e.target.value })}
          />
          {errors.UNITKERJA && <small className="p-error">{errors.UNITKERJA}</small>}
        </div>

        <div>
          <label className="font-medium">Status Kepegawaian</label>
          <Dropdown
            className={classNames("w-full mt-2", { "p-invalid": errors.STATUSKEPEGAWAIAN })}
            value={form.STATUSKEPEGAWAIAN}
            options={statusKepegawaianOptions}
            onChange={(e) => setForm({ ...form, STATUSKEPEGAWAIAN: e.value })}
            placeholder="Pilih"
          />
          {errors.STATUSKEPEGAWAIAN && (
            <small className="p-error">{errors.STATUSKEPEGAWAIAN}</small>
          )}
        </div>
        
        <div>
          <label className="font-medium">Foto Profil</label>
          {previewImage && (
            <div className="my-2">
              <img
                src={previewImage}
                alt="Preview"
                className="rounded-md w-32 h-32 object-cover border"
              />
            </div>
          )}
          <FileUpload
            mode="basic"
            name="FOTOPROFIL"
            accept="image/*"
            chooseLabel="Pilih Foto"
            customUpload
            uploadHandler={(e) => handleFileUpload("FOTOPROFIL", e)}
          />
          {errors.FOTOPROFIL && <small className="p-error">{errors.FOTOPROFIL}</small>}
        </div>

        <div>
          <label className="font-medium">Dokumen Pendukung</label>
          {previewDokumen && (
            <div className="my-2">
              <p className="text-sm text-gray-700">
                Dokumen: <strong>{previewDokumen}</strong>
              </p>
            </div>
          )}
          <FileUpload
            mode="basic"
            name="DOKUMENPENDUKUNG"
            accept=".pdf,.doc,.docx,.zip"
            chooseLabel="Upload Dokumen"
            customUpload
            uploadHandler={(e) => handleFileUpload("DOKUMENPENDUKUNG", e)}
          />
          {errors.DOKUMENPENDUKUNG && (
            <small className="p-error">{errors.DOKUMENPENDUKUNG}</small>
          )}
        </div>

        <div className="text-right pt-4">
          <Button type="submit" label="Simpan" icon="pi pi-save" className="p-button-primary" />
        </div>
      </form>
    </Dialog>
  );
}

export default FormDialogTenagaMedis;