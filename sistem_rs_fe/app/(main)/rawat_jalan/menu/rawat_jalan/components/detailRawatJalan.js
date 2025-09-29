'use client';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DetailRawatJalan = ({ visible, onHide, rawatJalan }) => {
  const [tindakan, setTindakan] = useState([]);
  const [tindakanOptions, setTindakanOptions] = useState([]);
  const [newItem, setNewItem] = useState({ IDTINDAKAN: null, JUMLAH: 1, HARGA: 0, TOTAL: 0 });

  useEffect(() => {
    if (rawatJalan?.IDRAWATJALAN) {
      fetchTindakan();
      fetchTindakanOptions();
    }
  }, [rawatJalan]);

  const fetchTindakan = async () => {
    const res = await axios.get(`${API_URL}/rawat_jalan/${rawatJalan.IDRAWATJALAN}/tindakan`);
    setTindakan(res.data.data);
  };

  const fetchTindakanOptions = async () => {
    const res = await axios.get(`${API_URL}/tindakan_medis`);
    setTindakanOptions(res.data.data
      .filter(t => t.JENISRAWAT === 'JALAN')
      .map(t => ({ label: t.NAMATINDAKAN, value: t.IDTINDAKAN, harga: t.HARGA })));
  };

  const addTindakan = async () => {
    if (!newItem.IDTINDAKAN) return;
    await axios.post(`${API_URL}/rawat_jalan/${rawatJalan.IDRAWATJALAN}/tindakan`, newItem);
    setNewItem({ IDTINDAKAN: null, JUMLAH: 1, HARGA: 0, TOTAL: 0 });
    fetchTindakan();
  };

  const deleteTindakan = async (id) => {
    await axios.delete(`${API_URL}/rawat_jalan/${rawatJalan.IDRAWATJALAN}/tindakan/${id}`);
    fetchTindakan();
  };

  return (
    <Dialog header={`Detail Rawat Jalan - ${rawatJalan?.NAMALENGKAP || ''}`}
      visible={visible} style={{ width: '70vw' }} onHide={onHide}>
      
      <div className="mb-3">
        <p><b>Dokter:</b> {rawatJalan?.NAMADOKTER}</p>
        <p><b>Diagnosa:</b> {rawatJalan?.DIAGNOSA}</p>
        <p><b>Status:</b> {rawatJalan?.STATUSKUNJUNGAN}</p>
      </div>

      <h4 className="mb-2">Tindakan</h4>
      <div className="flex gap-2 mb-3">
        <Dropdown
          value={newItem.IDTINDAKAN}
          options={tindakanOptions}
          onChange={(e) => {
            const selected = tindakanOptions.find(o => o.value === e.value);
            setNewItem({
              ...newItem,
              IDTINDAKAN: e.value,
              HARGA: selected?.harga || 0,
              TOTAL: (selected?.harga || 0) * newItem.JUMLAH
            });
          }}
          placeholder="Pilih Tindakan"
          filter showClear
        />
        <InputNumber value={newItem.JUMLAH} min={1}
          onValueChange={(e) => setNewItem({
            ...newItem,
            JUMLAH: e.value,
            TOTAL: newItem.HARGA * e.value
          })}
        />
        <InputNumber value={newItem.HARGA} disabled mode="currency" currency="IDR" locale="id-ID" />
        <Button label="Tambah" icon="pi pi-plus" onClick={addTindakan} />
      </div>

      <DataTable value={tindakan} paginator rows={20} rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}>
        <Column field="NAMATINDAKAN" header="Tindakan" />
        <Column field="JUMLAH" header="Jumlah" />
        <Column field="HARGA" header="Harga"
          body={(row) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.HARGA)}
        />
        <Column field="TOTAL" header="Total"
          body={(row) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.TOTAL)}
        />
        <Column header="Aksi" body={(row) => (
          <Button icon="pi pi-trash" severity="danger" size="small"
            onClick={() => deleteTindakan(row.IDTINDAKANJALAN)} />
        )} />
      </DataTable>
    </Dialog>
  );
};

export default DetailRawatJalan;