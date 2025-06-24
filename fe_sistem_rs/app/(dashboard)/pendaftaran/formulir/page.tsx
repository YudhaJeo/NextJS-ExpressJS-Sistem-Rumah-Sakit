"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

interface Pasien {
  ID?: number;
  NAMA: string;
  NIK: string;
  TGLLAHIR: string;
  JK: "L" | "P";
  ALAMAT: string;
  NOHP: string;
  EMAIL: string;
}

const FormulirPendaftaran = () => {
  const [data, setData] = useState<Pasien[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState<Pasien>({
    NAMA: "",
    NIK: "",
    TGLLAHIR: "",
    JK: "L",
    ALAMAT: "",
    NOHP: "",
    EMAIL: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/pasien");
      setData(res.data.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const isEdit = !!form.ID;
    const url = isEdit
      ? `http://localhost:4000/api/pasien/${form.ID}`
      : "http://localhost:4000/api/pasien";

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
      NAMA: "",
      NIK: "",
      TGLLAHIR: "",
      JK: "P",
      ALAMAT: "",
      NOHP: "",
      EMAIL: "",
    });
  };

  const handleEdit = (row: Pasien) => {
    console.log("Edit row:", row);
    setForm(row);
    setDialogVisible(true);
  };

const handleDelete = async (row: Pasien) => {
  try {
    await axios.delete(`http://localhost:4000/api/pasien/${row.ID}`);
    fetchData();
  } catch (err) {
    console.error("Gagal hapus data:", err);
  }
};


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Formulir Pendaftaran Pasien</h3>

      <div className="flex justify-content-end my-3">
        <Button
          label="Tambah Pasien"
          icon="pi pi-plus"
          onClick={() => setDialogVisible(true)}
        />
      </div>

      <DataTable
        value={data}
        paginator
        rows={10}
        loading={isLoading}
        scrollable
        size="small"
      >
        <Column field="NAMA" header="Nama" />
        <Column field="NIK" header="NIK" />
        <Column
          field="TGLLAHIR"
          header="Tgl Lahir"
          body={(row: Pasien) => {
            const tanggal = new Date(row.TGLLAHIR);
            return tanggal.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          }}
        />
        <Column field="JK" header="JK" />
        <Column field="ALAMAT" header="Alamat" />
        <Column field="NOHP" header="No HP" />
        <Column field="EMAIL" header="Email" />
        <Column
          header="Aksi"
          body={(row: Pasien) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                size="small"
                severity="warning"
                onClick={() => handleEdit(row)}
              />
              <Button
                icon="pi pi-trash"
                size="small"
                severity="danger"
                onClick={() => handleDelete(row)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={form.ID ? "Edit Pasien" : "Tambah Pasien"}
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
            <label>Nama</label>
            <InputText
              className="w-full mt-2"
              value={form.NAMA}
              onChange={(e) => setForm({ ...form, NAMA: e.target.value })}
            />
          </div>
          <div>
            <label>NIK</label>
            <InputText
              className="w-full mt-2"
              value={form.NIK}
              onChange={(e) => setForm({ ...form, NIK: e.target.value })}
            />
          </div>
          <div>
            <label>Tanggal Lahir</label>
            <Calendar
              className="w-full mt-2"
              dateFormat="yy-mm-dd"
              value={form.TGLLAHIR ? new Date(form.TGLLAHIR) : undefined}
              onChange={(e) =>
                setForm({
                  ...form,
                  TGLLAHIR: e.value?.toISOString().split("T")[0] || "",
                })
              }
              showIcon
            />
          </div>
          <div>
            <label>Jenis Kelamin</label>
            <Dropdown
              className="w-full mt-2"
              options={[
                { label: "Laki-laki", value: "L" },
                { label: "Perempuan", value: "P" },
              ]}
              value={form.JK}
              onChange={(e) => setForm({ ...form, JK: e.value })}
              placeholder="Pilih"
            />
          </div>
          <div>
            <label>Alamat</label>
            <InputText
              className="w-full mt-2"
              value={form.ALAMAT}
              onChange={(e) => setForm({ ...form, ALAMAT: e.target.value })}
            />
          </div>
          <div>
            <label>No HP</label>
            <InputText
              className="w-full mt-2"
              value={form.NOHP}
              onChange={(e) => setForm({ ...form, NOHP: e.target.value })}
            />
          </div>
          <div>
            <label>Email</label>
            <InputText
              className="w-full mt-2"
              value={form.EMAIL}
              onChange={(e) => setForm({ ...form, EMAIL: e.target.value })}
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

export default FormulirPendaftaran;
