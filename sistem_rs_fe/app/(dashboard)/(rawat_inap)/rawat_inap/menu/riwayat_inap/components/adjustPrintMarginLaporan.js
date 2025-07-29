// sistem_rs_fe\app\(dashboard)\(rawat_inap)\rawat_inap\menu\riwayat_inap\components\adjustPrintMarginLaporan.js
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Toolbar } from 'primereact/toolbar';

export default function AdjustPrintMarginLaporan({ adjustDialog, setAdjustDialog, handleAdjust, excel }) {
    const [dataAdjust, setDataAdjust] = useState({
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        paperWidth: 210,
        betweenCells: 10,
        paddingTop: 5,
        paperSize: 'A4',
        orientation: 'portrait'
    });

    const [loadingExport, setLoadingExport] = useState(false);

    const paperSizes = [
        { name: 'A4', value: 'A4' },
        { name: 'Letter', value: 'Letter' },
        { name: 'Legal', value: 'Legal' }
    ];

    const orientationOptions = [
        { label: 'Potrait', value: 'portrait' },
        { label: 'Lanskap', value: 'landscape' }
    ];

    const onInputChangeNumber = (e, name) => {
        const val = (e.target ? e.target.value : e.value) || 0;
        setDataAdjust((prev) => ({ ...prev, [name]: val }));
    };

    const onInputChange = (e, name) => {
        const val = (e.target ? e.target.value : e.value) || '';
        setDataAdjust((prev) => ({ ...prev, [name]: val }));
    };

    const exportPdf = async () => {
        try {
            setLoadingExport(true);
            await handleAdjust(dataAdjust);
        } finally {
            setLoadingExport(false);
        }
    };

    const footernya = () => (
        <div className="flex flex-row md:justify-between md:align-items-center">
            <div className="flex flex-row" style={{ justifyContent: 'flex-start' }}>
                <Button
                    label="Export PDF"
                    icon="pi pi-file"
                    className="p-button-danger mr-2"
                    onClick={exportPdf}
                    loading={loadingExport}
                    disabled={loadingExport}
                />
                <Button
                    label="Export Excel"
                    icon="pi pi-file"
                    className="p-button-success mr-2"
                    onClick={excel}
                    disabled={loadingExport}
                />
            </div>
        </div>
    );

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
                    {/* pengaturan margin */}
                    <div className="col-12 md:col-6">
                        <div className="grid formgrid">
                            <h5 className="col-12 mb-2">Pengaturan Margin (mm)</h5>
                            {['Top', 'Bottom', 'Right', 'Left'].map((label) => (
                                <div className="col-6 field" key={label}>
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

                    {/* pengaturan kertas */}
                    <div className="col-12 md:col-6">
                        <div className="grid formgrid">
                            <h5 className="col-12 mb-2">Pengaturan Kertas</h5>
                            <div className="col-12 field">
                                <label htmlFor="paperSize">Ukuran Kertas</label>
                                <Dropdown
                                    id="paperSize"
                                    value={dataAdjust.paperSize}
                                    options={paperSizes}
                                    onChange={(e) => onInputChange(e, 'paperSize')}
                                    optionLabel="name"
                                    className="w-full"
                                />
                            </div>
                            <div className="col-12 field">
                                <label htmlFor="orientation">Orientasi</label>
                                <Dropdown
                                    id="orientation"
                                    value={dataAdjust.orientation}
                                    options={orientationOptions}
                                    onChange={(e) => onInputChange(e, 'orientation')}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* isi form */}
                <Toolbar className="py-2 justify-content-end" end={footernya} />
            </Dialog>
        </div>
    );
}
