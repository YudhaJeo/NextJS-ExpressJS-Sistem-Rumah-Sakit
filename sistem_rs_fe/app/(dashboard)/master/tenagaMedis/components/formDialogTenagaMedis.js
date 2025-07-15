"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

const jenisKelaminOptions = [
  { label: "Laki-laki", value: "L" },
  { label: "Perempuan", value: "P" },
];

const jenisTenagaMedisOptions = [
  { label: "Dokter Umum", value: "Dokter Umum" },
  { label: "Dokter Spesialis", value: "Dokter Spesialis" },
  { label: "Dokter Gigi", value: "Dokter Gigi" },
  { label: "Dokter Gigi Spesialis", value: "Dokter Gigi Spesialis" },
  { label: "Perawat", value: "Perawat" },
  { label: "Bidan", value: "Bidan" },
  { label: "Apoteker", value: "Apoteker" },
  { label: "Asisten Apoteker", value: "Asisten Apoteker" },
  { label: "Analis Laboratorium", value: "Analis Laboratorium" },
  { label: "Radiografer", value: "Radiografer" },
  { label: "Ahli Gizi", value: "Ahli Gizi" },
  { label: "Fisioterapis", value: "Fisioterapis" },
  { label: "Terapis Wicara", value: "Terapis Wicara" },
  { label: "Terapis Okupasi", value: "Terapis Okupasi" },
  { label: "Rekam Medis", value: "Rekam Medis" },
  { label: "Sanitarian", value: "Sanitarian" },
  { label: "K3 Rumah Sakit", value: "K3 Rumah Sakit" },
  { label: "Psikolog Klinis", value: "Psikolog Klinis" },
  { label: "Manajemen Medis", value: "Manajemen Medis" },
  { label: "IT Medis", value: "IT Medis" },
  { label: "Penyuluh Kesehatan", value: "Penyuluh Kesehatan" },
];

const statusKepegawaianOptions = [
  { label: "Tetap", value: "Tetap" },
  { label: "Kontrak", value: "Kontrak" },
  { label: "Honorer", value: "Honorer" },
];

function FormDialogTenagaMedis({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  errors,
  inputClass,
}) {
  return (
    <Dialog
      header={form.IDTENAGAMEDIS ? "Edit Tenaga Medis" : "Tambah Tenaga Medis"}
      visible={visible}
      onHide={onHide}
      style={{ width: "50vw" }}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label>Kode Tenaga Medis</label>
          <InputText
            className={inputClass("KODETENAGAMEDIS")}
            value={form.KODETENAGAMEDIS}
            onChange={(e) => setForm({ ...form, KODETENAGAMEDIS: e.target.value })}
          />
          {errors.KODETENAGAMEDIS && (
            <small className="text-red-500">{errors.KODETENAGAMEDIS}</small>
          )}
        </div>

        <div>
          <label>Nama Lengkap</label>
          <InputText
            className={inputClass("NAMALENGKAP")}
            value={form.NAMALENGKAP}
            onChange={(e) => setForm({ ...form, NAMALENGKAP: e.target.value })}
          />
          {errors.NAMALENGKAP && (
            <small className="text-red-500">{errors.NAMALENGKAP}</small>
          )}
        </div>

        <div>
          <label>Jenis Kelamin</label>
          <Dropdown
            className={inputClass("JENISKELAMIN")}
            value={form.JENISKELAMIN}
            options={jenisKelaminOptions}
            onChange={(e) => setForm({ ...form, JENISKELAMIN: e.value })}
            placeholder="Pilih"
          />
          {errors.JENISKELAMIN && (
            <small className="text-red-500">{errors.JENISKELAMIN}</small>
          )}
        </div>

        <div>
          <label>Tempat Lahir</label>
          <InputText
            value={form.TEMPATLAHIR || ""}
            onChange={(e) => setForm({ ...form, TEMPATLAHIR: e.target.value })}
          />
        </div>

        <div>
          <label>Tanggal Lahir</label>
          <Calendar
            value={form.TANGGALLAHIR ? new Date(form.TANGGALLAHIR) : null}
            onChange={(e) => setForm({ ...form, TANGGALLAHIR: e.value })}
            dateFormat="yy-mm-dd"
            showIcon
          />
        </div>

        <div>
          <label>No HP</label>
          <InputText
            value={form.NOHP || ""}
            onChange={(e) => setForm({ ...form, NOHP: e.target.value })}
          />
        </div>

        <div>
          <label>Email</label>
          <InputText
            className={inputClass("EMAIL")}
            value={form.EMAIL}
            onChange={(e) => setForm({ ...form, EMAIL: e.target.value })}
          />
          {errors.EMAIL && <small className="text-red-500">{errors.EMAIL}</small>}
        </div>

        <div>
          <label>Password</label>
          <Password
            className={inputClass("PASSWORD")}
            value={form.PASSWORD}
            onChange={(e) => setForm({ ...form, PASSWORD: e.target.value })}
            toggleMask
          />
          {errors.PASSWORD && <small className="text-red-500">{errors.PASSWORD}</small>}
        </div>

        <div>
          <label>Jenis Tenaga Medis</label>
          <Dropdown
            className={inputClass("JENISTENAGAMEDIS")}
            value={form.JENISTENAGAMEDIS}
            options={jenisTenagaMedisOptions}
            onChange={(e) => setForm({ ...form, JENISTENAGAMEDIS: e.value })}
            placeholder="Pilih"
            filter
          />
          {errors.JENISTENAGAMEDIS && (
            <small className="text-red-500">{errors.JENISTENAGAMEDIS}</small>
          )}
        </div>

        <div>
          <label>Spesialisasi</label>
          <InputText
            value={form.SPESIALISASI || ""}
            onChange={(e) => setForm({ ...form, SPESIALISASI: e.target.value })}
          />
        </div>

        <div>
          <label>Nomor STR</label>
          <InputText
            value={form.NOSTR || ""}
            onChange={(e) => setForm({ ...form, NOSTR: e.target.value })}
          />
        </div>

        <div>
          <label>Tgl Exp STR</label>
          <Calendar
            value={form.TGLEXPSTR ? new Date(form.TGLEXPSTR) : null}
            onChange={(e) => setForm({ ...form, TGLEXPSTR: e.value })}
            dateFormat="yy-mm-dd"
            showIcon
          />
        </div>

        <div>
          <label>Nomor SIP</label>
          <InputText
            value={form.NOSIP || ""}
            onChange={(e) => setForm({ ...form, NOSIP: e.target.value })}
          />
        </div>

        <div>
          <label>Tgl Exp SIP</label>
          <Calendar
            value={form.TGLEXPSIP ? new Date(form.TGLEXPSIP) : null}
            onChange={(e) => setForm({ ...form, TGLEXPSIP: e.value })}
            dateFormat="yy-mm-dd"
            showIcon
          />
        </div>

        <div>
          <label>Unit Kerja</label>
          <InputText
            value={form.UNITKERJA || ""}
            onChange={(e) => setForm({ ...form, UNITKERJA: e.target.value })}
          />
        </div>

        <div>
          <label>Status Kepegawaian</label>
          <Dropdown
            value={form.STATUSKEPEGAWAIAN || "Tetap"}
            options={statusKepegawaianOptions}
            onChange={(e) => setForm({ ...form, STATUSKEPEGAWAIAN: e.value })}
            placeholder="Pilih"
          />
        </div>

        <div>
          <label>Foto Profil</label>
          <input
            type="file"
            onChange={(e) => setForm({ ...form, FOTOPROFIL: e.target.files[0] })}
          />
        </div>

        <div>
          <label>Dokumen Pendukung</label>
          <input
            type="file"
            onChange={(e) => setForm({ ...form, DOKUMENPENDUKUNG: e.target.files[0] })}
          />
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
}

export default FormDialogTenagaMedis;