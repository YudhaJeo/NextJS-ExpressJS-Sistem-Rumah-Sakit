'use client';

import { useState, useEffect } from 'react';
import { usePrinterManager } from '@/utils/printerManager';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

export default function PrinterSelector() {
  const { 
    availablePrinters, 
    selectedPrinter, 
    fetchPrinters, 
    selectPrinter,
    isQzReady,
    connectionError 
  } = usePrinterManager();
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Otomatis fetch printer saat komponen dimuat
    handleFetchPrinters();
  }, [isQzReady]);

  useEffect(() => {
    // Tampilkan error jika ada
    if (connectionError) {
      toast.current.show({
        severity: 'error', 
        summary: 'Kesalahan Koneksi', 
        detail: connectionError,
        life: 5000
      });
    }
  }, [connectionError]);

  const handleFetchPrinters = async () => {
    if (!isQzReady) {
      toast.current.show({
        severity: 'warn', 
        summary: 'Peringatan', 
        detail: 'QZ Tray belum siap. Pastikan QZ Tray sudah terpasang.'
      });
      return;
    }

    setIsLoading(true);
    try {
      const printers = await fetchPrinters();
      if (printers.length === 0) {
        toast.current.show({
          severity: 'warn', 
          summary: 'Peringatan', 
          detail: 'Tidak ada printer yang ditemukan. Gunakan printer default.'
        });
      }
    } catch (error) {
      toast.current.show({
        severity: 'error', 
        summary: 'Kesalahan', 
        detail: 'Gagal mendapatkan daftar printer'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrinterSelect = (e) => {
    selectPrinter(e.value);
    toast.current.show({
      severity: 'success', 
      summary: 'Berhasil', 
      detail: `Printer ${e.value} dipilih`
    });
  };

  return (
    <div className="printer-selector flex align-items-center gap-2">
      <Toast ref={toast} />
      <Dropdown 
        value={selectedPrinter} 
        options={availablePrinters.map(printer => ({ 
          label: printer, 
          value: printer 
        }))}
        onChange={handlePrinterSelect}
        placeholder="Pilih Printer"
        disabled={isLoading || !isQzReady}
        loading={isLoading}
        className="flex-grow-1"
      />
      <Button 
        icon="pi pi-refresh" 
        onClick={handleFetchPrinters}
        loading={isLoading}
        disabled={!isQzReady}
        tooltip="Refresh Daftar Printer"
        severity="secondary"
      />
    </div>
  );
}
