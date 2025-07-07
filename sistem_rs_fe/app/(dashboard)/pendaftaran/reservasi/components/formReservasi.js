"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

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
  allDokterOptions
}) => {
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
              const selected = pasienOptions.find((p) => p.value === e.value);
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

        <div>
          <label>Poli</label>
          <Dropdown
  className="w-full mt-2"
  options={poliOptions}
  value={formData.IDPOLI}
  onChange={(e) => {
    const selectedPoli = e.value;

    // Update form dan reset dokter yang terpilih
    setFormData({
      ...formData,
      IDPOLI: selectedPoli,
      IDDOKTER: '', // reset dokter saat poli berubah
    });

    // Filter dokter sesuai poli yang dipilih
    const filteredDokter = allDokterOptions.filter(
      (dokter) => dokter.IDPOLI === selectedPoli
    );

    console.log('Dokter yang cocok dengan poli:', filteredDokter);

    // Update opsi dokter
    setDokterOptions(filteredDokter);
  }}
  placeholder="Pilih Poli"
  filter
  showClear
/>

        </div>

        <div>
          <label>Nama Dokter</label>
          <Dropdown
            className="w-full mt-2"
            options={dokterOptions}
            value={formData.IDDOKTER}
            onChange={(e) => {
              const selected = dokterOptions.find((p) => p.value === e.value);
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
          <label>Tanggal Reservasi</label>
          <Calendar
            className="w-full mt-2"
            dateFormat="yy-mm-dd"
            value={
              formData.TANGGALRESERVASI
                ? new Date(formData.TANGGALRESERVASI)
                : undefined
            }
            onChange={(e) =>
              onChange({
                ...formData,
                TANGGALRESERVASI:
                  e.value?.toISOString().split("T")[0] || "",
              })
            }
            showIcon
          />
        </div>

        <div>
          <label>Jadwal Praktek</label>
          <InputText
            type="text"
            className="w-full mt-2"
            value={formData.JADWALPRAKTEK}
            onChange={(e) =>
              onChange({ ...formData, JADWALPRAKTEK: e.target.value })
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
            onChange={(e) =>
              onChange({ ...formData, STATUS: e.value })
            }
            placeholder="Pilih Status"
          />
        </div>

        <div>
          <label>Keterangan</label>
          <InputText
            className="w-full mt-2"
            value={formData.KETERANGAN}
            onChange={(e) =>
              onChange({ ...formData, KETERANGAN: e.target.value })
            }
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
