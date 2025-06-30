'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function DisplayAntrian() {
  const [loketList, setLoketList] = useState([]);
  const [antrianList, setAntrianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const toast = useRef(null);

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loketRes, antrianRes] = await Promise.all([
        axios.get(`${API_URL}/loket`),
        axios.get(`${API_URL}/antrian/data`)
      ]);

      setLoketList(loketRes.data.data || []);
      setAntrianList(antrianRes.data.data || []);
    } catch (err) {
      console.error('Gagal fetch data:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Gagal memuat data.',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAmbilTiket = async (namaLoket) => {
    try {
      const res = await axios.post(`${API_URL}/antrian/store`, {
        LOKET: namaLoket
      });

      const nomorBaru = res.data.data.NO_ANTRIAN || res.data.data;
      const loket = loketList.find(l => l.NAMALOKET === namaLoket);

      if (loket) {
        setAntrianList(prev => [
          ...prev.filter((a) => a.LOKET !== namaLoket || a.STATUS !== 'Belum'),
          {
            ID: Date.now(),
            NO_ANTRIAN: nomorBaru,
            LOKET: namaLoket,
            STATUS: 'Belum',
            LOKET_ID: loket.NO,
            CREATED_AT: new Date().toISOString(),
          }
        ]);
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Sukses',
        detail: `Tiket ${namaLoket} berhasil diambil. Nomor: ${nomorBaru}`,
        life: 3000
      });
    } catch (err) {
      console.error('Gagal ambil tiket:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Gagal mengambil tiket.',
        life: 3000
      });
    }
  };

  const getAntrianByLoket = (namaLoket) => {
    const item = antrianList.find((a) => a.LOKET === namaLoket && a.STATUS === 'Belum');
    return typeof item?.NO_ANTRIAN === 'string' ? item.NO_ANTRIAN : '-';
  };

  // Fungsi untuk menghitung ukuran berdasarkan screen dan jumlah loket
  const getResponsiveConfig = () => {
    const { width, height } = screenSize;
    const loketCount = loketList.length;
    
    let cols, maxCols;
    
    // Responsive breakpoints
    if (width < 768) {
      // Mobile: 1 kolom
      maxCols = 1;
      return {
        cols: Math.min(loketCount, maxCols),
        headerSize: 'text-2xl',
        subtitleSize: 'text-sm',
        numberSize: 'text-3xl',
        cardPadding: 'p-2',
        containerPadding: 'p-2'
      };
    } else if (width < 1024) {
      // Tablet: maksimal 2 kolom
      maxCols = 2;
      return {
        cols: Math.min(loketCount, maxCols),
        headerSize: 'text-3xl',
        subtitleSize: 'text-base',
        numberSize: 'text-4xl',
        cardPadding: 'p-3',
        containerPadding: 'p-3'
      };
    } else if (width < 1440) {
      // Desktop kecil: maksimal 3-4 kolom
      maxCols = loketCount <= 3 ? 3 : 4;
      return {
        cols: Math.min(loketCount, maxCols),
        headerSize: 'text-4xl',
        subtitleSize: 'text-lg',
        numberSize: 'text-5xl',
        cardPadding: 'p-4',
        containerPadding: 'p-4'
      };
    } else {
      // Desktop besar: maksimal 4-6 kolom
      maxCols = loketCount <= 4 ? 4 : Math.min(6, loketCount);
      return {
        cols: Math.min(loketCount, maxCols),
        headerSize: 'text-5xl',
        subtitleSize: 'text-xl',
        numberSize: 'text-6xl',
        cardPadding: 'p-4',
        containerPadding: 'p-6'
      };
    }
  };

  const config = getResponsiveConfig();
  const colClass = `col-${12 / config.cols}`;
  
  // Hitung apakah perlu centering
  const needsCentering = loketList.length < config.cols;

  const renderCard = (loket, index) => {
    const currentNumber = getAntrianByLoket(loket.NAMALOKET);
    const hasQueue = currentNumber !== '-';
    const isActive = loket.AKTIF !== false;

    const headerTemplate = (
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <i className={`pi ${isActive ? 'pi-circle-fill text-green-500' : 'pi-circle-fill text-red-500'} text-sm`}></i>
          <span className="font-bold text-lg">{loket.NAMALOKET}</span>
        </div>
        <Tag 
          value={hasQueue ? 'Tersedia' : 'Kosong'} 
          severity={hasQueue ? 'success' : 'warning'}
          icon={hasQueue ? 'pi pi-check' : 'pi pi-exclamation-triangle'}
        />
      </div>
    );

    const footerTemplate = (
      <div className="flex justify-center mt-2">
        <Button
          label="Ambil Tiket"
          icon="pi pi-ticket"
          onClick={() => handleAmbilTiket(loket.NAMALOKET)}
          disabled={loading || !isActive}
          loading={loading}
          className="w-full"
          size="small"
          severity={hasQueue ? 'success' : 'info'}
        />
      </div>
    );

    return (
      <div key={index} className={colClass}>
        <Card
          header={headerTemplate}
          footer={footerTemplate}
          className={`
            h-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg
            ${isActive ? 'cursor-pointer' : 'opacity-60'}
            ${hasQueue ? 'border-l-4 border-green-500' : 'border-l-4 border-orange-500'}
            ${config.cardPadding}
          `}
        >
          <div className="text-center">
            <div className="mb-2">
              <small className="text-600 font-medium">Loket #{loket.NO}</small>
            </div>
            
            <div className="mb-2">
              <div className="text-xs text-600 font-medium mb-1">
                Nomor Antrian Saat Ini
              </div>
              <div className={`
                ${config.numberSize} font-bold p-2 border-2 border-dashed border-round-lg
                ${hasQueue ? 'text-green-600 border-green-300 bg-green-50' : 'text-400 border-300 surface-100'}
              `}>
                {currentNumber}
              </div>
            </div>

            {hasQueue && (
              <Badge 
                value="Siap Dilayani" 
                severity="success" 
                className="animate-pulse text-xs"
              />
            )}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-column overflow-hidden">
      <Toast ref={toast} position="top-right" />
      
      {/* Header - Fixed height */}
      <div className={`text-center ${config.containerPadding} pb-2 flex-shrink-0`}>
        <h1 className={`${config.headerSize} font-bold text-800 mb-2`}>
          <i className="pi pi-desktop mr-2 text-blue-600"></i>
          Sistem Antrian Digital
        </h1>
        <p className={`${config.subtitleSize} text-600 mb-2`}>
          Ambil nomor antrian Anda dengan mudah dan cepat
        </p>
        
        <div className="flex align-items-center justify-content-center gap-4 text-xs">
          <div className="flex align-items-center gap-2">
            <i className="pi pi-circle-fill text-green-500 animate-pulse"></i>
            <span className="text-600">Loket Aktif</span>
          </div>
          <div className="flex align-items-center gap-2">
            <i className="pi pi-circle-fill text-red-500"></i>
            <span className="text-600">Loket Tidak Aktif</span>
          </div>
        </div>
        
        <Divider className="my-2" />
      </div>

      {/* Content - Flexible height */}
      <div className={`flex-1 overflow-hidden ${config.containerPadding} pt-0`}>
        {loading ? (
          <div className="flex flex-column align-items-center justify-content-center h-full">
            <ProgressSpinner 
              style={{width: '50px', height: '50px'}} 
              strokeWidth="4" 
              animationDuration="1s"
            />
            <p className="text-lg text-600 font-medium mt-3">
              <i className="pi pi-spin pi-spinner mr-2"></i>
              Memuat data...
            </p>
          </div>
        ) : loketList.length === 0 ? (
          <div className="text-center h-full flex flex-column align-items-center justify-content-center">
            <i className="pi pi-inbox text-4xl text-400 mb-3 block"></i>
            <h3 className="text-xl font-semibold text-700 mb-2">
              Tidak Ada Loket Tersedia
            </h3>
            <p className="text-600">
              Silakan hubungi administrator untuk informasi lebih lanjut
            </p>
          </div>
        ) : (
          <div className={`h-full ${needsCentering ? 'flex align-items-center justify-content-center' : ''}`}>
            <div className={`grid ${needsCentering ? 'justify-content-center' : ''}`}>
              {loketList.map((loket, index) => renderCard(loket, index))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer - Fixed height */}
      {!loading && loketList.length > 0 && (
        <div className={`flex-shrink-0 ${config.containerPadding} pt-2`}>
          <Divider className="my-2" />
          <div className="flex justify-content-center gap-6 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {loketList.filter(l => l.AKTIF !== false).length}
              </div>
              <div className="text-xs text-600">Loket Aktif</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {antrianList.filter(a => a.STATUS === 'Belum').length}
              </div>
              <div className="text-xs text-600">Antrian Aktif</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">
                {loketList.length}
              </div>
              <div className="text-xs text-600">Total Loket</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayAntrian;