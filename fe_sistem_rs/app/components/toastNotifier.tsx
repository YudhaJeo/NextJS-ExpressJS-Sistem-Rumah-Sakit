// fe_sistem_rs/app/components/toastNotifier.tsx

'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { ToastMessage, Toast as ToastType } from 'primereact/toast';

export interface ToastNotifierHandle {
  showToast: (status: string, message?: string) => void;
}

const ToastNotifier = forwardRef<ToastNotifierHandle>((_, ref) => {
  const toastRef = useRef<ToastType>(null);

  useImperativeHandle(ref, () => ({
    showToast(status: string, message = '') {
      let config: ToastMessage = {
        life: 3000,
      };

      switch (status) {
        case '00': // success
          config = {
            ...config,
            severity: 'success',
            summary: 'Berhasil',
            detail: message || 'Data berhasil disimpan!',
          };
          break;
        case '01': // error
          config = {
            ...config,
            severity: 'error',
            summary: 'Gagal',
            detail: message || 'Terjadi kesalahan saat menyimpan!',
          };
          break;
        case '03': // warning
          config = {
            ...config,
            severity: 'warn',
            summary: 'Peringatan',
            detail: message || 'Data tidak ditemukan!',
          };
          break;
        case '99': // bad request
          config = {
            ...config,
            severity: 'error',
            summary: 'Permintaan tidak valid',
            detail: message || 'Silakan periksa input Anda!',
          };
          break;
        default:
          config = {
            ...config,
            severity: 'info',
            summary: 'Info',
            detail: message || 'Status tidak diketahui!',
          };
      }

      toastRef.current?.show(config);
    },
  }));

  return <Toast ref={toastRef} />;
});

ToastNotifier.displayName = 'ToastNotifier';
export default ToastNotifier;