'use client';

import { Reservasi } from './reservasi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

interface Props {
    data: Reservasi[];
    loading: boolean;
    onEdit: (row: Reservasi) => void;
    onDelete: (row: Reservasi) => void;
}

const TabelReservasiPasien = ({ data, loading, onEdit, onDelete }: Props) => {
    return (
        <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable>
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
                        <Button icon="pi pi-pencil" size="small" severity="warning" onClick={() => onEdit(row)} />
                        <Button icon="pi pi-trash" size="small" severity="danger" onClick={() => onDelete(row)} />
                    </div>
                )}
            />
        </DataTable>
    );
};

export default TabelReservasiPasien;
