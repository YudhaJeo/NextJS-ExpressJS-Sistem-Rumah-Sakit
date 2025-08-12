// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(dashboard)\master\tenaga_non_medis\components\formDialogTenagaNonMedis.js
"use client";

import axios from "axios";
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

function FormDialogTenagaNonMedis({ visible, onHide, onSubmit, form, setForm }) {
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    if (visible) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/role/tenaga-non-medis`)
        .then((res) => {
          const options = res.data.data.map((role) => ({
            label: role.NAMAROLE,
            value: role.NAMAROLE,
          }));
          setRoleOptions(options);
        })
        .catch((err) => {
          console.error("Gagal mengambil role tenaga non medis:", err);
        });
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setErrors({});
      setPreviewImage(null);
      setPreviewDokumen(null);
    } else {
      if (form.FOTOPROFIL) {
        setPreviewImage(
          typeof form.FOTOPROFIL === "string"
            ? `/uploads/tenaga_non_medis/${form.FOTOPROFIL}`
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
    if (form.STATUSKEPEGAWAIAN === "Tetap" && form.NIP) { if (!/^[0-9]{18}$/.test(form.NIP)) {newErrors.NIP = "NIP harus 18 digit angka";}}
    if (!form.NAMALENGKAP) newErrors.NAMALENGKAP = "Nama wajib diisi";
    if (!form.JENISKELAMIN) newErrors.JENISKELAMIN = "Jenis kelamin wajib dipilih";
    if (!form.TEMPATLAHIR) newErrors.TEMPATLAHIR = "Tempat lahir wajib diisi";
    if (!form.NOHP) newErrors.NOHP = "No. HP wajib diisi";
    if (!form.EMAIL) newErrors.EMAIL = "Email wajib diisi";
    if (!form.STATUSKEPEGAWAIAN) newErrors.STATUSKEPEGAWAIAN = "Status kepegawaian wajib dipilih";
    if (!form.SPESIALISASI) newErrors.SPESIALISASI = "Spesialisasi wajib diisi";
    if (!form.UNITKERJA) newErrors.UNITKERJA = "Unit Kerja wajib diisi";

    if (!form.IDTENAGANONMEDIS && !form.PASSWORD) {
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
      header={form.IDTENAGANONMEDIS ? "Edit Tenaga Non Medis" : "Tambah Tenaga Non Medis"}
      visible={visible}
      onHide={onHide}
      style={{ width: "50vw" }}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">Kode Tenaga Non Medis</label>
          <InputText
            value={form.KODETENAGANONMEDIS || ""}
            className="w-full mt-2"
            placeholder="Kode Otomatis"
            disabled
          />
        </div>

        {form.STATUSKEPEGAWAIAN === "Tetap" && (
          <div className="mt-3">
            <label className="font-medium">NIP</label>
            <InputText
              value={form.NIP || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*$/.test(value) && value.length <= 18) {
                  setForm({ ...form, NIP: value });
                }
              }}
              className={classNames("w-full mt-2", {
                "p-invalid": errors.NIP,
              })}
              placeholder="Isi jika ada"
            />
            {errors.NIP && <small className="p-error">{errors.NIP}</small>}
          </div>
        )}

        <div className="mt-3">
          <label className="font-medium">Nama Lengkap</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.NAMALENGKAP })}
            value={form.NAMALENGKAP || ""}
            onChange={(e) => setForm({ ...form, NAMALENGKAP: e.target.value })}
          />
          {errors.NAMALENGKAP && <small className="p-error">{errors.NAMALENGKAP}</small>}
        </div>

        <div className="mt-3">
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

        <div className="mt-3">
          <label className="font-medium">Tempat Lahir</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.TEMPATLAHIR })}
            value={form.TEMPATLAHIR || ""}
            onChange={(e) => setForm({ ...form, TEMPATLAHIR: e.target.value })}
          />
          {errors.TEMPATLAHIR && <small className="p-error">{errors.TEMPATLAHIR}</small>}
        </div>

        <div className="mt-3">
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

        <div className="mt-3">
          <label className="font-medium">No. HP</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.NOHP })}
            value={form.NOHP || ""}
            onChange={(e) => setForm({ ...form, NOHP: e.target.value })}
          />
          {errors.NOHP && <small className="p-error">{errors.NOHP}</small>}
        </div>

        <div className="mt-3">
          <label className="font-medium">Email</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.EMAIL })}
            value={form.EMAIL || ""}
            onChange={(e) => setForm({ ...form, EMAIL: e.target.value })}
          />
          {errors.EMAIL && <small className="p-error">{errors.EMAIL}</small>}
        </div>

        <div className="mt-3">
          <label className="font-medium">Password</label>
          <Password
            className={classNames("w-full mt-2", { "p-invalid": errors.PASSWORD })}
            value={form.PASSWORD}
            onChange={(e) => setForm({ ...form, PASSWORD: e.target.value })}
            toggleMask
            placeholder={form.IDTENAGANONMEDIS ? "(Password tidak diubah)" : "Masukkan Password"}
            disabled={!!form.IDTENAGANONMEDIS}
            feedback={false}
          />
          {errors.PASSWORD && <small className="p-error">{errors.PASSWORD}</small>}
        </div>

        <div className="mt-3">
          <label className="font-medium">Jenis Tenaga Non Medis</label>
          <Dropdown
            className={classNames("w-full mt-2", { "p-invalid": errors.JENISTENAGANONMEDIS })}
            value={form.JENISTENAGANONMEDIS}
            options={roleOptions}
            onChange={(e) => setForm({ ...form, JENISTENAGANONMEDIS: e.value })}
            placeholder="Pilih Jenis Tenaga Non Medis"
          />
          {errors.JENISTENAGANONMEDIS && (
            <small className="p-error">{errors.JENISTENAGANONMEDIS}</small>
          )}
        </div>

        <div className="mt-3">
          <label className="font-medium">Spesialisasi</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.SPESIALISASI })}
            value={form.SPESIALISASI || ""}
            onChange={(e) => setForm({ ...form, SPESIALISASI: e.target.value })}
          />
          {errors.SPESIALISASI && <small className="p-error">{errors.SPESIALISASI}</small>}
        </div>

        <div className="mt-3">
          <label className="font-medium">Unit Kerja</label>
          <InputText
            className={classNames("w-full mt-2", { "p-invalid": errors.UNITKERJA })}
            value={form.UNITKERJA || ""}
            onChange={(e) => setForm({ ...form, UNITKERJA: e.target.value })}
          />
          {errors.UNITKERJA && <small className="p-error">{errors.UNITKERJA}</small>}
        </div>

        <div className="mt-3">
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

        <div className="mt-3">
            <label className="font-medium">Foto Profil</label>
            <FileUpload
            className="mt-1"
              mode="basic"
              accept="image/*"
              maxFileSize={5000000}
              customUpload
              chooseLabel="Pilih Foto"
              auto={false}
              onSelect={(e) => handleFileUpload("FOTOPROFIL", e)}
            />
            <small className="block text-gray-500 text-sm">Ukuran maksimal file: 5MB</small>
        </div>

        <div className="mt-3">
            <label className="font-medium">Dokumen Pendukung</label>
            <FileUpload
              className="mt-1"
              mode="basic"
              maxFileSize={5000000}
              customUpload
              chooseLabel="Pilih Dokumen"
              auto={false}
              onSelect={(e) => handleFileUpload("DOKUMENPENDUKUNG", e)}
            />
            <small className="block text-gray-500 text-sm">Ukuran maksimal file: 5MB</small>
        </div>  

        <div className="text-right pt-4">
          <Button type="submit" label="Simpan" icon="pi pi-save" className="p-button-primary" />
        </div>
      </form>
    </Dialog>
  );
}

export default FormDialogTenagaNonMedis;