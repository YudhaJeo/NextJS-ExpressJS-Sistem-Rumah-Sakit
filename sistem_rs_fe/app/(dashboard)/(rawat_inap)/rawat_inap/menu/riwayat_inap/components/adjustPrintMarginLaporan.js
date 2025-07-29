/*
 * Copyright (C) Godong
 *http://www.marstech.co.id
 *Email. info@marstech.co.id
 *Telp. 0811-3636-09
 *Office        : Jl. Margatama Asri IV, Kanigoro, Kec. Kartoharjo, Kota Madiun, Jawa Timur 63118
 *Branch Office : Perum Griya Gadang Sejahtera Kav. 14 Gadang - Sukun - Kota Malang - Jawa Timur
 *
 *Godong
 *Adalah merek dagang dari PT. Marstech Global
 *
 *License Agreement
 *Software komputer atau perangkat lunak komputer ini telah diakui sebagai salah satu aset perusahaan yang bernilai.
 *Di Indonesia secara khusus,
 *software telah dianggap seperti benda-benda berwujud lainnya yang memiliki kekuatan hukum.
 *Oleh karena itu pemilik software berhak untuk memberi ijin atau tidak memberi ijin orang lain untuk menggunakan softwarenya.
 *Dalam hal ini ada aturan hukum yang berlaku di Indonesia yang secara khusus melindungi para programmer dari pembajakan software yang mereka buat,
 *yaitu diatur dalam hukum hak kekayaan intelektual (HAKI).
 *
 *********************************************************************************************************
 *Pasal 72 ayat 3 UU Hak Cipta berbunyi,
 *' Barangsiapa dengan sengaja dan tanpa hak memperbanyak penggunaan untuk kepentingan komersial '
 *' suatu program komputer dipidana dengan pidana penjara paling lama 5 (lima) tahun dan/atau '
 *' denda paling banyak Rp. 500.000.000,00 (lima ratus juta rupiah) '
 *********************************************************************************************************
 *
 *Proprietary Software
 *Adalah software berpemilik, sehingga seseorang harus meminta izin serta dilarang untuk mengedarkan,
 *menggunakan atau memodifikasi software tersebut.
 *
 *Commercial software
 *Adalah software yang dibuat dan dikembangkan oleh perusahaan dengan konsep bisnis,
 *dibutuhkan proses pembelian atau sewa untuk bisa menggunakan software tersebut.
 *Detail Licensi yang dianut di software https://en.wikipedia.org/wiki/Proprietary_software
 *EULA https://en.wikipedia.org/wiki/End-user_license_agreement
 *
 *Lisensi Perangkat Lunak https://id.wikipedia.org/wiki/Lisensi_perangkat_lunak
 *EULA https://id.wikipedia.org/wiki/EULA
 *
 * Created on Mon May 13 2024 - 04:33:50
 * Author : ARADHEA | aradheadhifa23@gmail.com
 * Version : 1.0
 */

 import { Button } from 'primereact/button';
 import { Dialog } from 'primereact/dialog';
 import { Dropdown } from 'primereact/dropdown';
 import { InputNumber } from 'primereact/inputnumber';
 import { InputText } from 'primereact/inputtext';
 import { Toolbar } from 'primereact/toolbar';
 import React, { useEffect, useRef, useState } from 'react';
 
 export default function AdjustPrintMarginLaporan({ adjustDialog, setAdjustDialog, handleAdjust, loadingPreview, excel }) {
     const paperSizes = [
         { name: 'A4', value: 'A4' },
         { name: 'Letter', value: 'Letter' },
         { name: 'Legal', value: 'Legal' }
     ];
     const orientationOptions = [
         { label: 'Potrait', value: 'portrait' },
         { label: 'Lanskap', value: 'landscape' }
     ];
 
     const [lazyState, setlazyState] = useState({
         first: 0,
         rows: 10,
         page: 0,
         sortField: null,
         sortOrder: null,
         filters: {}
     });
 
     useEffect(() => {
         loadLazyData();
     }, [lazyState]);
 
     const [dataAdjust, setDataAdjust] = useState({ marginTop: 10, marginBottom: 10, marginRight: 10, marginLeft: 10, paperWidth: 210, betweenCells: 10, paddingTop: 5, paperSize: 'A4', orientation: 'portrait' });
     const loadLazyData = async () => { };
 
     const onInputChangeNumber = (e, name) => {
         const val = (e.target ? e.target.value : e.value) || 0;
         let _dataAdjust = { ...dataAdjust };
         _dataAdjust[name] = val;
         setDataAdjust(_dataAdjust);
     };
 
     const onInputChange = (e, name) => {
         const val = (e.target ? e.target.value : e.value) || '';
         let _dataAdjust = { ...dataAdjust };
         _dataAdjust[name] = val;
         setDataAdjust(_dataAdjust);
     };
 
     const marginConfig = async () => {
         handleAdjust(dataAdjust);
         setAdjustDialog(false);
     };
 
     const footernya = () => {
         return (
             <React.Fragment>
                 <div className="flex flex-row md:justify-between md:align-items-center">
                     <div className="flex flex-row" style={{ justifyContent: 'flex-start' }}>
                         <Button label="Export PDF" icon="pi pi-file" className="p-button-danger mr-2" onClick={marginConfig} />
                         <Button label="Export Excel" icon="pi pi-file" className="p-button-success mr-2" onClick={excel} />
                     </div>
                 </div>
             </React.Fragment>
         );
     };
 
     return (
         <div className="crud-demo">
             <Dialog
                 visible={adjustDialog}
                 onHide={() => setAdjustDialog(false)}
                 header="Adjust Print Margin"
                 style={{ width: '50vw' }}
                 breakpoints={{
                     '960px': '85vw',
                     '768px': '90vw',
                     '576px': '95vw'
                 }}
             >
                 <div className="grid p-fluid">
                     {/* Margin Settings Section */}
                     <div className="col-12 md:col-6">
                         <div className="grid formgrid">
                             <h5 className="col-12 mb-2">Pengaturan Margin (mm)</h5>
 
                             {['Top', 'Bottom', 'Right', 'Left'].map((label) => (
                                 <div className="col-6 md:col-6 field" key={label}>
                                     <label htmlFor={`margin${label}`}>Margin {label}</label>
                                     <InputNumber
                                         id={`margin${label}`}
                                         value={dataAdjust[`margin${label}`]}
                                         onChange={(e) => onInputChangeNumber(e, `margin${label}`)}
                                         min={0}
                                         suffix=" mm"
                                         showButtons
                                         className="w-full"
                                         inputStyle={{ padding: '0.3rem' }}
                                     />
                                 </div>
                             ))}
                         </div>
                     </div>
 
                     {/* Paper Settings Section */}
                     <div className="col-12 md:col-6">
                         <div className="grid formgrid">
                             <h5 className="col-12 mb-2">Pengaturan Kertas</h5>
                             <div className="col-12 field">
                                 <label htmlFor="paperSize">Ukuran Kertas</label>
                                 <Dropdown
                                     id="paperSize"
                                     value={dataAdjust.paperSize}
                                     options={paperSizes}
                                     onChange={(e) => onInputChangeNumber(e, 'paperSize')}
                                     optionLabel="name"
                                     className="w-full"
                                     inputStyle={{ padding: '0.3rem' }}
                                 />
                             </div>
 
                             <div className="col-12 field">
                                 <label htmlFor="orientation">Orientasi</label>
                                 <Dropdown
                                     id="orientation"
                                     value={dataAdjust.orientation}
                                     options={orientationOptions}
                                     onChange={(e) => onInputChangeNumber(e, 'orientation')}
                                     className="w-full"
                                     inputStyle={{ padding: '0.3rem' }}
                                 />
                             </div>
                         </div>
                     </div>
 
                     {/* Dual Signature Section - Ditambahkan grid wrapper */}
                     <div className="col-12">
                         <div className="grid">
                             {/* Informasi Petugas 1 - Kiri */}
                             <div className="col-12 md:col-6">
                                 <div className="grid formgrid mt-3">
                                     <h5 className="col-12 mb-1">Informasi Petugas 1</h5>
 
                                     <div className="col-12 field">
                                         <label htmlFor="paraf1">Paraf</label>
                                         <InputText
                                             id="paraf1"
                                             value={dataAdjust.paraf1}
                                             onChange={(e) => onInputChange(e, 'paraf1')}
                                             className="w-full"
                                             placeholder="Masukkan inisial paraf"
                                         />
                                     </div>
 
                                     <div className="col-12 field">
                                         <label htmlFor="namaPetugas1">Nama Petugas</label>
                                         <InputText
                                             id="namaPetugas1"
                                             value={dataAdjust.namaPetugas1}
                                             onChange={(e) => onInputChange(e, 'namaPetugas1')}
                                             className="w-full"
                                             placeholder="Masukkan nama lengkap"
                                         />
                                     </div>
 
                                     <div className="col-12 field">
                                         <label htmlFor="jabatan1">Jabatan</label>
                                         <InputText
                                             id="jabatan1"
                                             value={dataAdjust.jabatan1}
                                             onChange={(e) => onInputChange(e, 'jabatan1')}
                                             className="w-full"
                                             placeholder="Masukkan jabatan"
                                         />
                                     </div>
                                 </div>
                             </div>
 
                             {/* Informasi Petugas 2 - Kanan */}
                             <div className="col-12 md:col-6">
                                 <div className="grid formgrid mt-3">
                                     <h5 className="col-12 mb-1">Informasi Petugas 2</h5>
 
                                     <div className="col-12 field">
                                         <label htmlFor="paraf2">Paraf</label>
                                         <InputText
                                             id="paraf2"
                                             value={dataAdjust.paraf2}
                                             onChange={(e) => onInputChange(e, 'paraf2')}
                                             className="w-full"
                                             placeholder="Masukkan inisial paraf"
                                         />
                                     </div>
 
                                     <div className="col-12 field">
                                         <label htmlFor="namaPetugas2">Nama Petugas</label>
                                         <InputText
                                             id="namaPetugas2"
                                             value={dataAdjust.namaPetugas2}
                                             onChange={(e) => onInputChange(e, 'namaPetugas2')}
                                             className="w-full"
                                             placeholder="Masukkan nama lengkap"
                                         />
                                     </div>
 
                                     <div className="col-12 field">
                                         <label htmlFor="jabatan2">Jabatan</label>
                                         <InputText
                                             id="jabatan2"
                                             value={dataAdjust.jabatan2}
                                             onChange={(e) => onInputChange(e, 'jabatan2')}
                                             className="w-full"
                                             placeholder="Masukkan jabatan"
                                         />
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
 
                 <Toolbar className="py-2 justify-content-end" end={footernya} />
             </Dialog>
         </div>
     );
 }
 