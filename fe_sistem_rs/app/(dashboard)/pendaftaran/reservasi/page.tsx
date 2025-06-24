"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

interface Reservasi {
  IDRESERVASI?: number;
  NIK: string;
  POLI: string;
  NAMADOKTER: string;
  TANGGALRESERVASI: string;
  JAMRESERVASI: string;
  STATUS: "Menunggu" | "Dikonfirmasi" | "Dibatalkan";
  KETERANGAN: string;
}

const ReservasiPasien = () => {
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [formData, setFormData] = useState<Reservasi>({
    NIK: "",
    POLI: "",
    NAMADOKTER: "",
    TANGGALRESERVASI: "",
    JAMRESERVASI: "",
    STATUS: "Menunggu",
    KETERANGAN: "",
  });

  const fetchReservasi = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/reservasi");
      setReservasiList(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const isEdit = !!formData.IDRESERVASI;
    const url = isEdit
      ? `http://localhost:4000/api/reservasi/${formData.IDRESERVASI}`
      : "http://localhost:4000/api/reservasi";

    try {
      if (isEdit) {
        await axios.put(url, formData);
      } else {
        await axios.post(url, formData);
      }
      fetchReservasi();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      NIK: "",
      POLI: "",
      NAMADOKTER: "",
      TANGGALRESERVASI: "",
      JAMRESERVASI: "",
      STATUS: "Menunggu",
      KETERANGAN: "",
    });
  };

  const handleEdit = (row: Reservasi) => {
    setFormData(row);
    setDialogVisible(true);
  };

  const handleDelete = async (row: Reservasi) => {
    try {
      await axios.delete(`http://localhost:4000/api/reservasi/${row.IDRESERVASI}`);
      fetchReservasi();
    } catch (err) {
      console.error("Gagal menghapus data:", err);
    }
  };

  useEffect(() => {
    fetchReservasi();
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Reservasi Pasien</h3>

      <div className="flex justify-content-end my-3">
        <Button
          label="Tambah Reservasi"
          icon="pi pi-plus"
          onClick={() => setDialogVisible(true)}
        />
      </div>

      <DataTable
        value={reservasiList}
        paginator
        rows={10}
        loading={isLoading}
        scrollable
        size="small"
      >
        <Column field="NIK" header="NIK" />
        <Column field="POLI" header="Poli" />
        <Column field="NAMADOKTER" header="Nama Dokter" />
        <Column field="TANGGALRESERVASI" header="Tanggal Reservasi" />
        <Column field="JAMRESERVASI" header="Jam Reservasi" />
        <Column field="STATUS" header="Status" />
        <Column field="KETERANGAN" header="Keterangan" />
        <Column
          header="Aksi"
          body={(row: Reservasi) => (
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
        header={formData.IDRESERVASI ? "Edit Reservasi" : "Tambah Reservasi"}
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
            <label>NIK</label>
            <InputText
              className="w-full mt-2"
              value={formData.NIK}
              onChange={(e) =>
                setFormData({ ...formData, NIK: e.target.value })
              }
            />
          </div>
          <div>
            <label>Poli</label>
            <InputText
              className="w-full mt-2"
              value={formData.POLI}
              onChange={(e) =>
                setFormData({ ...formData, POLI: e.target.value })
              }
            />
          </div>
          <div>
            <label>Nama Dokter</label>
            <InputText
              className="w-full mt-2"
              value={formData.NAMADOKTER}
              onChange={(e) =>
                setFormData({ ...formData, NAMADOKTER: e.target.value })
              }
            />
          </div>
          <div>
            <label>Tanggal Reservasi</label>
            <InputText
              type="date"
              className="w-full mt-2"
              value={formData.TANGGALRESERVASI}
              onChange={(e) =>
                setFormData({ ...formData, TANGGALRESERVASI: e.target.value })
              }
            />
          </div>
          <div>
            <label>Jam Reservasi</label>
            <InputText
              type="time"
              className="w-full mt-2"
              value={formData.JAMRESERVASI}
              onChange={(e) =>
                setFormData({ ...formData, JAMRESERVASI: e.target.value })
              }
            />
          </div>
          <div>
            <label>Status</label>
            <InputText
              className="w-full mt-2"
              value={formData.STATUS}
              onChange={(e) =>
                setFormData({ ...formData, STATUS: e.target.value as "Menunggu" | "Dikonfirmasi" | "Dibatalkan" })
              }
            />
          </div>
          <div>
            <label>Keterangan</label>
            <InputText
              className="w-full mt-2"
              value={formData.KETERANGAN}
              onChange={(e) =>
                setFormData({ ...formData, KETERANGAN: e.target.value })
              }
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

export default ReservasiPasien;
