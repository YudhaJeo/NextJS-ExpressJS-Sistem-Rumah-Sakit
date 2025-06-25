"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import TabelPendaftaran from "./components/tabelPasien";
import { Pendaftaran } from "@/types/formulir";

const Page = () => {
  const [data, setData] = useState<Pendaftaran[]>([]);
  const [originalData, setOriginalData] = useState<Pendaftaran[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState<Pendaftaran>({
    IDPENDAFTARAN: 0,
    NIK: "",
    NAMALENGKAP: "",
    TANGGALKUNJUNGAN: "",
    LAYANAN: "Rawat Jalan",
    POLI: "",
    NAMADOKTER: "",
    STATUSKUNJUNGAN: "Diperiksa",
  });

  const [pasienOptions, setPasienOptions] = useState<
    { label: string; value: string; NAMALENGKAP: string }[]
  >([]);

  const fetchPasien = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/pasien");
      const options = res.data.data.map((pasien: any) => ({
        label: `${pasien.NIK} - ${pasien.NAMALENGKAP}`,
        value: pasien.NIK,
        NAMALENGKAP: pasien.NAMALENGKAP,
      }));
      setPasienOptions(options);
    } catch (err) {
      console.error("Gagal ambil data pasien:", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/pendaftaran");
      setData(res.data.data);
      setOriginalData(res.data.data); 
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NIK.toLowerCase().includes(keyword) ||
          item.NAMALENGKAP.toLowerCase().includes(keyword)
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    const isEdit = !!form.IDPENDAFTARAN;
    const url = isEdit
      ? `http://localhost:4000/api/pendaftaran/${form.IDPENDAFTARAN}`
      : "http://localhost:4000/api/pendaftaran";

    try {
      if (isEdit) {
        await axios.put(url, form);
      } else {
        await axios.post(url, form);
      }
      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal simpan data:", err);
    }
  };

  const resetForm = () => {
    setForm({
      IDPENDAFTARAN: 0,
      NAMALENGKAP: "",
      NIK: "",
      TANGGALKUNJUNGAN: "",
      LAYANAN: "Rawat Jalan",
      POLI: "",
      NAMADOKTER: "",
      STATUSKUNJUNGAN: "Diperiksa",
    });
  };

  const handleEdit = (row: Pendaftaran) => {
    setForm({
      ...row,
      TANGGALKUNJUNGAN: row.TANGGALKUNJUNGAN?.split("T")[0] || "",
      NAMALENGKAP: row.NAMALENGKAP || "",
    });
    setDialogVisible(true);
  };

  const handleDelete = async (row: Pendaftaran) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/pendaftaran/${row.IDPENDAFTARAN}`
      );
      fetchData();
    } catch (err) {
      console.error("Gagal hapus data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPasien();
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Formulir Pendaftaran Kunjungan</h3>

      <div className="flex justify-content-end items-center my-3 gap-3">
        <span className="p-input-icon-left w-80">
          <i className="pi pi-search" />
          <InputText
            placeholder="Cari nama atau NIK..."
            className="w-full"
            onChange={(e) => handleSearch(e.target.value.toLowerCase())}
          />
        </span>

        <Button
          label="Tambah"
          icon="pi pi-plus"
          onClick={() => setDialogVisible(true)}
        />
      </div>

      <TabelPendaftaran
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        header={form.IDPENDAFTARAN ? "Edit Pendaftaran" : "Tambah Pendaftaran"}
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        style={{ width: "40vw" }}
      >
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label>Nama Pasien</label>
            <InputText
              className="w-full mt-2"
              value={form.NAMALENGKAP}
              disabled
            />
          </div>
          <div>
            <label>NIK</label>
            <Dropdown
              className="w-full mt-2"
              options={pasienOptions}
              value={form.NIK}
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
          </div>

          <div>
            <label>Tanggal Kunjungan</label>
            <Calendar
              className="w-full mt-2"
              dateFormat="yy-mm-dd"
              value={
                form.TANGGALKUNJUNGAN
                  ? new Date(form.TANGGALKUNJUNGAN)
                  : undefined
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  TANGGALKUNJUNGAN: e.value?.toISOString().split("T")[0] || "",
                })
              }
              showIcon
            />
          </div>
          <div>
            <label>Layanan</label>
            <Dropdown
              className="w-full mt-2"
              options={["Rawat Jalan", "Rawat Inap", "IGD"].map((val) => ({
                label: val,
                value: val,
              }))}
              value={form.LAYANAN}
              onChange={(e) => setForm({ ...form, LAYANAN: e.value })}
              placeholder="Pilih Layanan"
            />
          </div>
          <div>
            <label>Poli</label>
            <InputText
              className="w-full mt-2"
              value={form.POLI}
              onChange={(e) => setForm({ ...form, POLI: e.target.value })}
            />
          </div>
          <div>
            <label>Nama Dokter</label>
            <InputText
              className="w-full mt-2"
              value={form.NAMADOKTER}
              onChange={(e) => setForm({ ...form, NAMADOKTER: e.target.value })}
            />
          </div>
          <div>
            <label>Status Kunjungan</label>
            <Dropdown
              className="w-full mt-2"
              options={["Diperiksa", "Batal", "Selesai"].map((val) => ({
                label: val,
                value: val,
              }))}
              value={form.STATUSKUNJUNGAN}
              onChange={(e) => setForm({ ...form, STATUSKUNJUNGAN: e.value })}
              placeholder="Pilih Status"
            />
          </div>

          <div className="text-right pt-3">
            <Button type="submit" label="Simpan" icon="pi pi-save" />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Page;
