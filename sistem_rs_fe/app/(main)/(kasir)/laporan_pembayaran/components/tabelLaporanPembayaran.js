"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

const statusLabels = {
    BELUM_LUNAS: "Belum Dibayar",
    LUNAS: "Sudah Dibayar",
};

const statusSeverity = {
    BELUM_LUNAS: "danger",
    LUNAS: "success",
};

const metodeSeverity = {
    'Cash': 'success',
    'Transfer Bank': 'info',
    'QRIS': 'warning',
    DEFAULT: 'secondary',
};

const TabelLaporanPembayaran = ({ data, loading, onDelete }) => {
    const statusBody = (rowData) => (
        <Tag
            value={statusLabels[rowData.STATUS] || rowData.STATUS}
            severity={statusSeverity[rowData.STATUS] || "info"}
        />
    );

    const asuransiBody = (rowData) => {
        let severity = "warning";
        const asuransi = rowData.ASURANSI?.toUpperCase() || "";

        if (asuransi.includes("BPJS")) {
            severity = "success";
        } else if (asuransi === "UMUM") {
            severity = "info";
        }

        return <Tag value={rowData.ASURANSI} severity={severity} />;
    };

    const metodeBody = (row) => (
        <Tag
            value={row.METODEPEMBAYARAN}
            severity={metodeSeverity[row.METODEPEMBAYARAN] || metodeSeverity.DEFAULT}
        />
    );

    const actionBody = (rowData) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-trash"
                size="small"
                severity="danger"
                onClick={() => onDelete(rowData)}
            />
        </div>
    );

    return (
        <DataTable
            value={data}
            paginator
            rows={10}
            loading={loading}
            size="small"
            scrollable
        >
            <Column field="NOINVOICE" header="No Invoice" />
            <Column field="NIK" header="NIK" />
            <Column field="NAMAPASIEN" header="Nama Pasien" />
            <Column field="ASURANSI" header="Asuransi" body={asuransiBody} />
            <Column
                field="TANGGALINVOICE"
                header="Tgl Invoice"
                body={(rowData) => {
                    const tgl = new Date(rowData.TANGGALINVOICE);
                    return tgl.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });
                }}
            />
            <Column
                field="TOTALTAGIHAN"
                header="Total Tagihan"
                body={(rowData) =>
                    `Rp ${Number(rowData.TOTALTAGIHAN).toLocaleString("id-ID")}`
                }
            />
            <Column
                field="TOTALDEPOSIT"
                header="Total Deposit"
                body={(rowData) =>
                    `Rp ${Number(rowData.TOTALDEPOSIT).toLocaleString("id-ID")}`
                }
            />
            <Column
                field="TOTALANGSURAN"
                header="Total Angsuran"
                body={(rowData) =>
                    `Rp ${Number(rowData.TOTALANGSURAN).toLocaleString("id-ID")}`
                }
            />
            <Column
                field="SISA_TAGIHAN"
                header="Sisa Tagihan"
                body={(rowData) =>
                    `Rp ${Number(rowData.SISA_TAGIHAN || 0).toLocaleString("id-ID")}`
                }
            />
            <Column
                field="TOTALPEMBAYARAN"
                header="Total Pembayaran"
                body={(rowData) =>
                    `Rp ${Number(rowData.TOTALPEMBAYARAN || 0).toLocaleString("id-ID")}`
                }
            />
            <Column field="METODEPEMBAYARAN" header="Metode Pembayaran" body={metodeBody} />
            <Column field="STATUS" header="Status" body={statusBody} />
            <Column header="Aksi" body={actionBody} />
        </DataTable>
    );
};

export default TabelLaporanPembayaran;
