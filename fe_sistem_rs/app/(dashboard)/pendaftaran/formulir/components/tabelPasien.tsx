'use client';

import { Pasien } from '@/types/formulir';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

interface Props {
    data: Pasien[];
    loading: boolean;
    onEdit: (row: Pasien) => void;
    onDelete: (row: Pasien) => void;
}

const TabelPasien = ({ data, loading, onEdit, onDelete }: Props) => {
    return (
        <DataTable value={data} paginator rows={5} loading={loading} size="small" scrollable>
            <Column field="NAMA" header="Nama" sortable />
            <Column field="NIK" header="NIK" />
            <Column field="TGLLAHIR" header="Tgl Lahir" />
            <Column field="JK" header="JK" />
            <Column field="ALAMAT" header="Alamat" />
            <Column field="NOHP" header="No HP" />
            <Column field="EMAIL" header="Email" />
            <Column
                header="Aksi"
                body={(row: Pasien) => (
                    <div className="flex gap-2">
                        <Button icon="pi pi-pencil" size="small" severity="warning" onClick={() => onEdit(row)} />
                        <Button icon="pi pi-trash" size="small" severity="danger" onClick={() => onDelete(row)} />
                    </div>
                )}
                style={{ width: '150px' }}
            />
        </DataTable>
    );
};

export default TabelPasien;
