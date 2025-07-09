"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useEffect } from "react";

const getNamaHari = (tanggalString) => {
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  const tanggal = new Date(tanggalString);
  return hari[tanggal.getDay()];
};

const FormReservasiPasien = ({
  visible,
  formData,
  onHide,
  onChange,
  onSubmit,
  setFormData,
  pasienOptions,
  poliOptions,
  dokterOptions,
  setDokterOptions,
  allDokterOptions,
}) => {
  useEffect(() => {
  if (!formData.TANGGALRESERVASI || !formData.IDPOLI) {
    setDokterOptions([]);
    return;
  }

  const hari = getNamaHari(formData.TANGGALRESERVASI);

  const filtered = allDokterOptions.filter(
    (dokter) =>
      dokter.IDPOLI === formData.IDPOLI &&
      dokter.label.toLowerCase().includes(hari.toLowerCase())
  );

  setDokterOptions(filtered);

  if (!filtered.some((d) => d.value === formData.IDDOKTER)) {
    setFormData((prev) => ({ ...prev, IDDOKTER: "" }));
  }
}, [formData.TANGGALRESERVASI, formData.IDPOLI]);
  return (
    <Dialog
      header={formData.IDRESERVASI ? "Edit Reservasi" : "Tambah Reservasi"}
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
        <div>
          <label>NIK</label>
          <Dropdown
            className="w-full mt-2"
            options={pasienOptions}
            value={formData.NIK}
            onChange={(e) => {
              setFormData({
                ...formData,
                NIK: e.value,
              });
            }}
            placeholder="Pilih NIK"
            filter
            showClear
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">
          <label>Tanggal Reservasi</label>
          <Calendar
            className='w-full mt-2'
            dateFormat="yy-mm-dd"
            value={
              formData.TANGGALRESERVASI
                ? new Date(formData.TANGGALRESERVASI)
                : undefined
            }
            onChange={(e) =>
              onChange({
                ...formData,
                TANGGALRESERVASI: e.value?.toISOString().split("T")[0] || "",
              })
            }
            showIcon
          />
        </div>

        <div className="w-full md:w-1/2">
          <label>Poli</label>
          <Dropdown
            className="w-full mt-2"
            options={poliOptions}
            value={formData.IDPOLI}
            onChange={(e) => {
              const selectedPoli = e.value;

              setFormData({
                ...formData,
                IDPOLI: selectedPoli,
                IDDOKTER: "",
              });

              const filteredDokter = allDokterOptions.filter(
                (dokter) => dokter.IDPOLI === selectedPoli
              );
              setDokterOptions(filteredDokter);
            }}
            placeholder="Pilih Poli"
            filter
            showClear
          />
        </div>
        </div>

      <div>
        <label>Nama Dokter & Jadwal Praktek</label>
          <Dropdown
            className="w-full mt-2"
            options={dokterOptions}
            value={formData.IDDOKTER}
            onChange={(e) => {
              setFormData({
                ...formData,
                IDDOKTER: e.value,
              });
            }}
            placeholder="Pilih Dokter"
            filter
            showClear
          />
      </div>

        <div>
          <label>Keluhan</label>
          <InputText
            className="w-full mt-2"
            value={formData.KETERANGAN}
            onChange={(e) =>
              onChange({ ...formData, KETERANGAN: e.target.value })
            }
          />
        </div>

        <div>
          <label>Status</label>
          <Dropdown
            className="w-full mt-2"
            options={["Menunggu", "Dikonfirmasi", "Dibatalkan"].map((val) => ({
              label: val,
              value: val,
            }))}
            value={formData.STATUS}
            onChange={(e) => onChange({ ...formData, STATUS: e.value })}
            placeholder="Pilih Status"
          />
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormReservasiPasien;