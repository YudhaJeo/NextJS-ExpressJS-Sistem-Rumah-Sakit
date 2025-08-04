"use client";

import React, { useState } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";

const statusSeverity = {
  TETAP: "success",
  KONTRAK: "info",
  HONORER: "warning",
};

const TabelTenagaNonMedis = ({ data, loading, onEdit, onDelete }) => {
  const [layout, setLayout] = useState("grid");
  const [selectedData, setSelectedData] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const getSeverity = (status) => {
    const key = (status || "").toUpperCase();
    return statusSeverity[key] || "secondary";
  };

  const openDetail = (row) => {
    setSelectedData(row);
    setDialogVisible(true);
  };

  const listItem = (row, index) => {
    return (
      <div
        className="col-12"
        key={row.IDTENAGANONMEDIS}
        onClick={() => openDetail(row)}
      >
        <div
          className={classNames(
            "flex flex-column xl:flex-row xl:align-items-start p-4 gap-4",
            { "border-top-1 surface-border": index !== 0 }
          )}
        >
          <img
            className="w-9 sm:w-16rem xl:w-10rem shadow-2 block mx-auto border-round object-cover"
            src={
              row.FOTOPROFIL
                ? `${process.env.NEXT_PUBLIC_URL}${row.FOTOPROFIL}`
                : "/no-image.png"
            }
            alt={row.NAMALENGKAP}
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">
                {row.NAMALENGKAP}
              </div>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-user"></i>
                  <span className="font-semibold">
                    {row.JENISTENAGANONMEDIS}
                  </span>
                </span>
                <Tag
                  value={row.STATUSKEPEGAWAIAN}
                  severity={getSeverity(row.STATUSKEPEGAWAIAN)}
                />
              </div>
              <div className="text-sm text-600">{row.UNITKERJA}</div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(row);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(row);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const gridItem = (row) => {
    return (
      <div
        className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2 cursor-pointer"
        key={row.IDTENAGANONMEDIS}
        onClick={() => openDetail(row)}
      >
        <div className="p-4 border-1 surface-border surface-card border-round-lg h-full flex flex-column justify-content-between transition-all duration-200 hover:surface-hover hover:shadow-3">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-user"></i>
              <span className="font-semibold">{row.JENISTENAGANONMEDIS}</span>
            </div>
            <Tag
              value={row.STATUSKEPEGAWAIAN}
              severity={getSeverity(row.STATUSKEPEGAWAIAN)}
            />
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <img
              className="w-12rem h-12rem shadow-2 rounded-xl object-cover"
              src={
                row.FOTOPROFIL
                  ? `${process.env.NEXT_PUBLIC_URL}${row.FOTOPROFIL}`
                  : "/no-image.png"
              }
              alt={row.NAMALENGKAP}
            />
            <div className="text-2xl font-bold text-center">
              {row.NAMALENGKAP}
            </div>
            <span className="text-sm text-600">{row.UNITKERJA}</span>
          </div>
          <div className="flex align-items-center justify-content-between">
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-warning"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (row, layout, index) => {
    if (!row) return null;
    return layout === "list" ? listItem(row, index) : gridItem(row);
  };

  const listTemplate = (rows, layout) => {
    if (!rows || rows.length === 0)
      return <div className="col-12">Tidak ada data</div>;
    return (
      <div className="grid grid-nogutter">
        {rows.map((r, i) => itemTemplate(r, layout, i))}
      </div>
    );
  };

  const header = () => {
    return (
      <div className="flex justify-content-end">
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    );
  };

  return (
    <div className="card">
      <DataView
        value={data}
        listTemplate={listTemplate}
        layout={layout}
        header={header()}
        loading={loading}
      />

      <Dialog
        header={selectedData?.NAMALENGKAP || "Detail Tenaga Non Medis"}
        visible={dialogVisible}
        style={{ width: "50vw" }}
        modal
        onHide={() => setDialogVisible(false)}
      >
        {selectedData && (
          <div className="p-3 flex flex-column gap-3">
            <img
              className="w-12rem h-12rem shadow-2 border-round mx-auto"
              src={
                selectedData.FOTOPROFIL
                  ? `${process.env.NEXT_PUBLIC_URL}${selectedData.FOTOPROFIL}`
                  : "/no-image.png"
              }
              alt={selectedData.NAMALENGKAP}
            />
            <div>
              <b>Kode:</b> {selectedData.KODETENAGANONMEDIS}
            </div>
            <div>
              <b>Jenis Kelamin:</b>{" "}
              {selectedData.JENISKELAMIN === "L" ? "Laki-laki" : "Perempuan"}
            </div>
            <div>
              <b>Tempat / Tanggal Lahir:</b> {selectedData.TEMPATLAHIR} /{" "}
              {selectedData.TANGGALLAHIR
                ? new Date(selectedData.TANGGALLAHIR).toLocaleDateString("id-ID")
                : "-"}
            </div>
            <div>
              <b>No HP:</b> {selectedData.NOHP}
            </div>
            <div>
              <b>Email:</b> {selectedData.EMAIL}
            </div>
            <div>
              <b>Jenis Tenaga Non Medis:</b>{" "}
              {selectedData.JENISTENAGANONMEDIS}
            </div>
            <div>
              <b>Spesialisasi:</b> {selectedData.SPESIALISASI}
            </div>
            <div>
              <b>Unit Kerja:</b> {selectedData.UNITKERJA}
            </div>
            <div>
              <b>Status Kepegawaian:</b> {selectedData.STATUSKEPEGAWAIAN}
            </div>
            <div>
              <b>Dokumen Pendukung:</b>{" "}
              {selectedData.DOKUMENPENDUKUNG || "-"}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default TabelTenagaNonMedis;