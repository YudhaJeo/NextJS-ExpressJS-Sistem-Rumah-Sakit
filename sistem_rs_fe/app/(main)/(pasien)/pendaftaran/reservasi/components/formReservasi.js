"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";

const getNamaHari = (tanggalString) => {
  const hari = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
  ];
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
  errors,
  pasienOptions,
  poliOptions,
  dokterOptions,
  setDokterOptions,
  allDokterOptions,
}) => {
  const inputClass = (field) =>
    errors[field] ? "p-invalid w-full mt-2" : "w-full mt-2";

  const [jamOptions, setJamOptions] = useState([]);

  useEffect(() => {
    if (!formData.TANGGALRESERVASI || !formData.IDPOLI) {
      setDokterOptions([]);
      return;
    }

    const hari = getNamaHari(formData.TANGGALRESERVASI);

    const filtered = allDokterOptions.filter(
      (dokter) =>
        dokter.IDPOLI === formData.IDPOLI &&
        (dokter.JADWALPRAKTEK || []).some((j) =>
          j.toLowerCase().includes(hari.toLowerCase())
        )
    );

    if (
      formData.IDDOKTER &&
      !filtered.some((d) => d.value === formData.IDDOKTER)
    ) {
      const dokterLama = allDokterOptions.find(
        (d) => d.value === formData.IDDOKTER
      );
      if (dokterLama) filtered.push(dokterLama);
    }

    setDokterOptions(filtered);
  }, [formData.TANGGALRESERVASI, formData.IDPOLI]);

  useEffect(() => {
    if (!formData.IDDOKTER || !formData.TANGGALRESERVASI) {
      setJamOptions([]);
      return;
    }

    const hari = getNamaHari(formData.TANGGALRESERVASI);
    const selected = allDokterOptions.find(
      (d) => d.value === formData.IDDOKTER
    );

    if (selected && selected.JADWALPRAKTEK) {
      const filteredJam = selected.JADWALPRAKTEK.filter((j) =>
        j.includes(hari)
      );

      if (
        formData.JAMRESERVASI &&
        !filteredJam.includes(formData.JAMRESERVASI)
      ) {
        filteredJam.push(formData.JAMRESERVASI);
      }

      setJamOptions(filteredJam);
    } else {
      setJamOptions([]);
    }
  }, [formData.IDDOKTER, formData.TANGGALRESERVASI]);

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
            className={inputClass("NIK")}
            options={pasienOptions}
            value={formData.NIK}
            onChange={(e) => setFormData({ ...formData, NIK: e.value })}
            placeholder="Pilih NIK"
            filter
            showClear
          />
          {errors.NIK && <small className="text-red-500">{errors.NIK}</small>}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <label>Tanggal Reservasi</label>
            <Calendar
              className={inputClass("TANGGALRESERVASI")}
              dateFormat="yy-mm-dd"
              value={
                formData.TANGGALRESERVASI
                  ? new Date(formData.TANGGALRESERVASI)
                  : undefined
              }
              onChange={(e) =>
                onChange({
                  ...formData,
                  TANGGALRESERVASI: e.value
                    ? `${e.value.getFullYear()}-${String(
                        e.value.getMonth() + 1
                      ).padStart(2, "0")}-${String(e.value.getDate()).padStart(
                        2,
                        "0"
                      )}`
                    : "",
                })
              }
              showIcon
            />
            {errors.TANGGALRESERVASI && (
              <small className="text-red-500">{errors.TANGGALRESERVASI}</small>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <label>Poli</label>
            <Dropdown
              className={inputClass("IDPOLI")}
              options={poliOptions}
              value={formData.IDPOLI}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  IDPOLI: e.value,
                  IDDOKTER: "",
                  JAMRESERVASI: "",
                });
                setDokterOptions(
                  allDokterOptions.filter((d) => d.IDPOLI === e.value)
                );
              }}
              placeholder="Pilih Poli"
              filter
              showClear
            />
            {errors.IDPOLI && (
              <small className="text-red-500">{errors.IDPOLI}</small>
            )}
          </div>
        </div>

        <div>
          <label>Nama Dokter</label>
          <Dropdown
            className={inputClass("IDDOKTER")}
            options={dokterOptions.map((d) => ({
              label: d.NAMALENGKAP,
              value: d.value,
              JADWALPRAKTEK: d.JADWALPRAKTEK || [],
            }))}
            value={formData.IDDOKTER}
            onChange={(e) => {
              setFormData({
                ...formData,
                IDDOKTER: e.value,
                JAMRESERVASI: "",
              });
            }}
            placeholder="Pilih Dokter"
            filter
            showClear
          />
          {errors.IDDOKTER && (
            <small className="text-red-500">{errors.IDDOKTER}</small>
          )}
        </div>

        <div>
          <label>Jam Praktek</label>
          <Dropdown
            className={inputClass("JAMRESERVASI")}
            options={[
              ...(formData.JAMRESERVASI &&
              !jamOptions.includes(formData.JAMRESERVASI)
                ? [
                    {
                      label: formData.JAMRESERVASI,
                      value: formData.JAMRESERVASI,
                    },
                  ]
                : []),
              ...jamOptions.map((j) => ({ label: j, value: j })),
            ]}
            value={formData.JAMRESERVASI || ""}
            onChange={(e) =>
              setFormData({ ...formData, JAMRESERVASI: e.value })
            }
            placeholder="Pilih Jam"
          />
          {errors.JAMRESERVASI && (
            <small className="text-red-500">{errors.JAMRESERVASI}</small>
          )}
        </div>

        <div>
          <label>Keluhan</label>
          <InputText
            className={inputClass("KETERANGAN")}
            value={formData.KETERANGAN}
            onChange={(e) =>
              onChange({ ...formData, KETERANGAN: e.target.value })
            }
          />
          {errors.KETERANGAN && (
            <small className="text-red-500">{errors.KETERANGAN}</small>
          )}
        </div>

        <div>
          <label>Status</label>
          <Dropdown
            className={inputClass("STATUS")}
            options={["Menunggu", "Dikonfirmasi", "Dibatalkan"].map((val) => ({
              label: val,
              value: val,
            }))}
            value={formData.STATUS}
            onChange={(e) => onChange({ ...formData, STATUS: e.value })}
            placeholder="Pilih Status"
          />
          {errors.STATUS && (
            <small className="text-red-500">{errors.STATUS}</small>
          )}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormReservasiPasien;