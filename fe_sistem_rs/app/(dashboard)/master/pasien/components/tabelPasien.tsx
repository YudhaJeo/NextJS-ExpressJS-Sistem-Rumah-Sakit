'use client';

import { Pasien } from '@/types/pasien';
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
            <Column field="NAMALENGKAP" header="Nama Lengkap" sortable />
            <Column field="NIK" header="NIK" />
            <Column
                field="TANGGALLAHIR"
                header="Tgl Lahir"
                body={(row: Pasien) => {
                    const tanggal = new Date(row.TANGGALLAHIR);
                    return tanggal.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    });
                }}
            />
            <Column field="JENISKELAMIN" header="JK" />
            <Column field="ALAMAT" header="Alamat" />
            <Column field="NOHP" header="No HP" />
            <Column field="AGAMA" header="Agama" />
            <Column field="GOLDARAH" header="Gol. Darah" />
            <Column field="ASURANSI" header="Asuransi" />
            <Column field="NOASURANSI" header="No Asuransi" />
            <Column
                field="TANGGALDAFTAR"
                header="Tgl Daftar"
                body={(row: Pasien) => {
                    const tanggal = new Date(row.TANGGALDAFTAR);
                    return tanggal.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    });
                }}
            />
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
