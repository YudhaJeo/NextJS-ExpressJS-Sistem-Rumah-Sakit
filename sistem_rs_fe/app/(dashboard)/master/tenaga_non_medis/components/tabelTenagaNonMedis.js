"use client";

import React, { useState } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { Chip } from "primereact/chip";
import { Toolbar } from "primereact/toolbar";
import { Skeleton } from "primereact/skeleton";

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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const listItem = (row, index) => {
    return (
      <div className="col-12" key={row.IDTENAGANONMEDIS}>
        <Card className="mb-3 cursor-pointer hover:shadow-3 transition-all transition-duration-300">
          <div className="flex flex-column xl:flex-row xl:align-items-start gap-4">
            <div className="flex justify-content-center xl:justify-content-start">
              <img
                className="w-9rem h-9rem sm:w-12rem sm:h-12rem border-round-lg shadow-2 object-cover"
                src={
                  row.FOTOPROFIL
                    ? `${process.env.NEXT_PUBLIC_URL}${row.FOTOPROFIL}`
                    : "/no-image.png"
                }
                alt={row.NAMALENGKAP}
                onClick={() => openDetail(row)}
              />
            </div>
            
            <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
              <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                <h3 className="text-2xl font-bold text-900 m-0">
                  {row.NAMALENGKAP}
                </h3>
                
                <div className="flex flex-wrap align-items-center gap-2">
                  <Chip 
                    label={row.JENISTENAGANONMEDIS} 
                    icon="pi pi-user" 
                    className="bg-blue-100 text-blue-900"
                  />
                  <Tag
                    value={row.STATUSKEPEGAWAIAN}
                    severity={getSeverity(row.STATUSKEPEGAWAIAN)}
                    rounded
                  />
                </div>
                
                <div className="flex align-items-center gap-2 text-600">
                  <i className="pi pi-building text-sm"></i>
                  <span className="text-sm">{row.UNITKERJA}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  severity="warning"
                  rounded
                  outlined
                  tooltip="Edit"
                  tooltipOptions={{ position: 'top' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(row);
                  }}
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  rounded
                  outlined
                  tooltip="Hapus"
                  tooltipOptions={{ position: 'top' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(row);
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const gridItem = (row) => {
    return (
      <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={row.IDTENAGANONMEDIS}>
        <Card className="h-full cursor-pointer hover:shadow-4 transition-all transition-duration-300">
          <div className="flex flex-column h-full">
            {/* Header dengan status */}
            <div className="flex justify-content-between align-items-center mb-3">
              <Chip 
                label={row.JENISTENAGANONMEDIS} 
                icon="pi pi-user" 
                className="bg-blue-100 text-blue-900"
              />
              <Tag
                value={row.STATUSKEPEGAWAIAN}
                severity={getSeverity(row.STATUSKEPEGAWAIAN)}
                rounded
              />
            </div>
            
            {/* Foto dan info utama */}
            <div 
              className="flex flex-column align-items-center gap-3 py-3 flex-1"
              onClick={() => openDetail(row)}
            >
              <img
                className="w-10rem h-10rem border-round-lg shadow-2 object-cover"
                src={
                  row.FOTOPROFIL
                    ? `${process.env.NEXT_PUBLIC_URL}${row.FOTOPROFIL}`
                    : "/no-image.png"
                }
                alt={row.NAMALENGKAP}
              />
              <h4 className="text-xl font-bold text-center m-0 line-height-3">
                {row.NAMALENGKAP}
              </h4>
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-building text-sm"></i>
                <span className="text-sm text-center">{row.UNITKERJA}</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <Divider className="my-2" />
            <div className="flex justify-content-center gap-2">
              <Button
                icon="pi pi-pencil"
                severity="warning"
                rounded
                outlined
                size="small"
                tooltip="Edit"
                tooltipOptions={{ position: 'top' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(row);
                }}
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                outlined
                size="small"
                tooltip="Hapus"
                tooltipOptions={{ position: 'top' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(row);
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const itemTemplate = (row, layout, index) => {
    if (!row) return null;
    return layout === "list" ? listItem(row, index) : gridItem(row);
  };

  const listTemplate = (rows, layout) => {
    if (loading) {
      return (
        <div className="grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={layout === "list" ? "col-12" : "col-12 sm:col-6 lg:col-12 xl:col-4 p-2"}>
              <Card>
                <div className="flex align-items-center gap-3">
                  <Skeleton shape="circle" size="4rem" />
                  <div className="flex-1">
                    <Skeleton width="100%" className="mb-2" />
                    <Skeleton width="80%" />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      );
    }

    if (!rows || rows.length === 0) {
      return (
        <div className="col-12">
          <Card>
            <div className="text-center p-5">
              <i className="pi pi-info-circle text-6xl text-400 mb-3"></i>
              <h3 className="text-xl text-600">Tidak ada data</h3>
              <p className="text-500">Belum ada data tenaga non medis yang tersedia</p>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="grid">
        {rows.map((r, i) => itemTemplate(r, layout, i))}
      </div>
    );
  };

  const header = () => {
    return (
      <Toolbar 
        className="mb-3 border-none bg-transparent p-0"
        end={
          <DataViewLayoutOptions
            layout={layout}
            onChange={(e) => setLayout(e.value)}
          />
        }
      />
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Tutup"
        icon="pi pi-times"
        outlined
        onClick={() => setDialogVisible(false)}
      />
      {selectedData && (
        <>
          <Button
            label="Edit"
            icon="pi pi-pencil"
            severity="warning"
            onClick={() => {
              setDialogVisible(false);
              onEdit(selectedData);
            }}
          />
          <Button
            label="Hapus"
            icon="pi pi-trash"
            severity="danger"
            onClick={() => {
              setDialogVisible(false);
              onDelete(selectedData);
            }}
          />
        </>
      )}
    </div>
  );

  return (
    <Panel header="Data Tenaga Non Medis" className="m-0">
      {header()}
      
      <DataView
        value={data}
        listTemplate={listTemplate}
        layout={layout}
        loading={loading}
        emptyMessage=""
      />

      <Dialog
        header={
          <div className="flex align-items-center gap-2">
            <i className="pi pi-user-edit text-primary"></i>
            <span>{selectedData?.NAMALENGKAP || "Detail Tenaga Non Medis"}</span>
          </div>
        }
        visible={dialogVisible}
        style={{ width: "50vw", minWidth: "320px" }}
        modal
        footer={dialogFooter}
        onHide={() => setDialogVisible(false)}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        {selectedData && (
          <div className="flex flex-column gap-4">
            {/* Foto Profil */}
            <div className="flex justify-content-center">
              <img
                className="w-12rem h-12rem mt-4 border-circle shadow-3 object-cover"
                src={
                  selectedData.FOTOPROFIL
                    ? `${process.env.NEXT_PUBLIC_URL}${selectedData.FOTOPROFIL}`
                    : "/no-image.png"
                }
                alt={selectedData.NAMALENGKAP}
              />
            </div>

            {/* Detail Information */}
            <div className="grid">
              <div className="col-12 md:col-6">
                <Panel header="Informasi Personal" className="h-full">
                  <div className="flex flex-column gap-3">
                    <div className="flex align-items-center gap-2">
                      <i className="pi pi-id-card text-primary"></i>
                      <div>
                        <small className="text-600">Kode</small>
                        <div className="font-semibold">{selectedData.KODETENAGANONMEDIS}</div>
                      </div>
                    </div>
                    
                    <Divider className="my-2" />
                    
                    <div className="flex align-items-center gap-2">
                      <i className="pi pi-user text-primary"></i>
                      <div>
                        <small className="text-600">Jenis Kelamin</small>
                        <div className="font-semibold">
                          {selectedData.JENISKELAMIN === "L" ? "Laki-laki" : "Perempuan"}
                        </div>
                      </div>
                    </div>
                    
                    <Divider className="my-2" />
                    
                    <div className="flex align-items-start gap-2">
                      <i className="pi pi-calendar text-primary mt-1"></i>
                      <div>
                        <small className="text-600">Tempat / Tanggal Lahir</small>
                        <div className="font-semibold">
                          {selectedData.TEMPATLAHIR} / {formatDate(selectedData.TANGGALLAHIR)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>

              <div className="col-12 md:col-6">
                <Panel header="Kontak" className="h-full">
                  <div className="flex flex-column gap-3">
                    <div className="flex align-items-center gap-2">
                      <i className="pi pi-phone text-primary"></i>
                      <div>
                        <small className="text-600">No HP</small>
                        <div className="font-semibold">{selectedData.NOHP || "-"}</div>
                      </div>
                    </div>
                    
                    <Divider className="my-2" />
                    
                    <div className="flex align-items-center gap-2">
                      <i className="pi pi-envelope text-primary"></i>
                      <div>
                        <small className="text-600">Email</small>
                        <div className="font-semibold">{selectedData.EMAIL || "-"}</div>
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>

              <div className="col-12">
                <Panel header="Informasi Kepegawaian">
                  <div className="grid">
                    <div className="col-12 md:col-4">
                      <div className="flex align-items-center gap-2">
                        <i className="pi pi-briefcase text-primary"></i>
                        <div>
                          <small className="text-600">Jenis Tenaga Non Medis</small>
                          <div className="font-semibold">{selectedData.JENISTENAGANONMEDIS}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-12 md:col-4">
                      <div className="flex align-items-center gap-2">
                        <i className="pi pi-star text-primary"></i>
                        <div>
                          <small className="text-600">Spesialisasi</small>
                          <div className="font-semibold">{selectedData.SPESIALISASI || "-"}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-12 md:col-4">
                      <div className="flex align-items-center gap-2">
                        <i className="pi pi-building text-primary"></i>
                        <div>
                          <small className="text-600">Unit Kerja</small>
                          <div className="font-semibold">{selectedData.UNITKERJA}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-12 mt-3">
                      <div className="flex align-items-center gap-2">
                        <i className="pi pi-verified text-primary"></i>
                        <div>
                          <small className="text-600">Status Kepegawaian</small>
                          <div className="mt-1">
                            <Tag
                              value={selectedData.STATUSKEPEGAWAIAN}
                              severity={getSeverity(selectedData.STATUSKEPEGAWAIAN)}
                              rounded
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>

              {selectedData.DOKUMENPENDUKUNG && (
                <div className="col-12">
                  <Panel header="Dokumen Pendukung">
                    <Button
                      label="Lihat Dokumen"
                      icon="pi pi-external-link"
                      link
                      className="p-0"
                      onClick={() =>
                        window.open(
                          `${process.env.NEXT_PUBLIC_URL}${selectedData.DOKUMENPENDUKUNG}`,
                          "_blank"
                        )
                      }
                    />
                  </Panel>
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </Panel>
  );
};

export default TabelTenagaNonMedis;