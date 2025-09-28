import { useState, useEffect } from 'react';

export const usePrinterManager = () => {
  const [availablePrinters, setAvailablePrinters] = useState<string[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const [isQzReady, setIsQzReady] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const detectPrinters = async () => {
    // Daftar printer default untuk fallback
    const defaultPrinters = ['POS-58', 'Default Printer'];
    
    try {
      // Pastikan QZ Tray tersedia dan memiliki metode yang dibutuhkan
      if (!window.qz?.printers?.find) {
        console.warn('QZ Tray belum siap atau tidak lengkap');
        setAvailablePrinters(defaultPrinters);
        return defaultPrinters;
      }

      // Coba dapatkan daftar printer
      let printers: string[] = [];
      try {
        printers = await window.qz.printers.find();
      } catch (findError) {
        console.error('Gagal menemukan printer:', findError);
      }
      
      // Jika tidak ada printer, gunakan default
      const finalPrinters = printers.length > 0 
        ? printers 
        : defaultPrinters;
      
      console.log('Daftar printer:', finalPrinters);
      setAvailablePrinters(finalPrinters);
      
      // Pilih printer pertama jika belum ada yang dipilih
      if (!selectedPrinter && finalPrinters.length > 0) {
        selectPrinter(finalPrinters[0]);
      }

      return finalPrinters;
    } catch (error) {
      console.error('Kesalahan umum saat mendeteksi printer:', error);
      
      // Gunakan printer default
      setAvailablePrinters(defaultPrinters);
      
      if (!selectedPrinter) {
        selectPrinter(defaultPrinters[0]);
      }

      setConnectionError(
        error instanceof Error 
          ? error.message 
          : 'Gagal mendeteksi printer'
      );

      return defaultPrinters;
    }
  };

  const safeConnectToQzTray = async () => {
    // Hindari multiple koneksi simultan
    if (isConnecting) return;

    try {
      setIsConnecting(true);
      
      // Cek ketersediaan QZ Tray sebelum operasi
      if (!window.qz) {
        throw new Error('QZ Tray tidak tersedia');
      }

      // Coba disconnect terlebih dahulu jika ada koneksi aktif
      try {
        // Pastikan websocket ada sebelum disconnect
        if (window.qz?.websocket?.disconnect) {
          await window.qz.websocket.disconnect();
        }
      } catch (disconnectError) {
        // Abaikan error disconnect, lanjutkan
        console.log('Gagal disconnect (mungkin tidak ada koneksi aktif):', disconnectError);
      }

      // Sambungkan kembali dengan timeout
      await Promise.race([
        window.qz?.websocket?.connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Koneksi WebSocket timeout')), 5000)
        )
      ]);
      
      console.log('QZ Tray websocket berhasil tersambung');
      setConnectionError(null);
      setIsQzReady(true);

      // Deteksi printer setelah tersambung
      await detectPrinters();
    } catch (err) {
      console.error('Gagal menyambungkan QZ Tray:', err);
      
      // Periksa jenis spesifik error
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Koneksi QZ Tray gagal';
      
      // Tangani berbagai jenis error koneksi
      const connectionErrorMessages = [
        'An open connection with QZ Tray already exists',
        'Connection attempt cancelled by user',
        'WebSocket is closed before the connection is established',
        'Koneksi WebSocket timeout',
        'Cannot read properties of null (reading \'sendData\')'
      ];

      const isConnectionError = connectionErrorMessages.some(msg => 
        errorMessage.includes(msg)
      );

      if (isConnectionError) {
        console.log('Koneksi bermasalah, lanjutkan dengan printer default');
        setIsQzReady(true);
        setConnectionError(null);

        // Deteksi printer meskipun koneksi bermasalah
        await detectPrinters();
      } else {
        setConnectionError(errorMessage);
        setIsQzReady(false);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    // Ambil printer yang tersimpan dari localStorage
    const savedPrinter = localStorage.getItem('selectedPrinter');
    if (savedPrinter) {
      setSelectedPrinter(savedPrinter);
    }

    // Tunggu QZ Tray dimuat
    const checkQzTray = () => {
      if (window.qz && window.qz.printers) {
        safeConnectToQzTray();
      } else {
        // Coba lagi setelah 1 detik
        setTimeout(checkQzTray, 1000);
      }
    };

    checkQzTray();
  }, []);

  const fetchPrinters = async () => {
    // Gunakan fungsi deteksi printer yang sudah ada
    return await detectPrinters();
  };

  const selectPrinter = (printerName: string) => {
    setSelectedPrinter(printerName);
    localStorage.setItem('selectedPrinter', printerName);
  };

  const getPrinterConfig = () => {
    if (!selectedPrinter) {
      throw new Error('Printer belum dipilih');
    }
    if (!window.qz?.configs) {
      throw new Error('QZ Tray tidak tersedia');
    }
    return window.qz.configs.create(selectedPrinter);
  };

  return {
    availablePrinters,
    selectedPrinter,
    fetchPrinters,
    selectPrinter,
    getPrinterConfig,
    isQzReady,
    connectionError
  };
};
