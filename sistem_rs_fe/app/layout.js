// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\layout.js
'use client';

import { useState, useEffect } from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import 'primereact/resources/primereact.min.css';
import { PrimeReactProvider } from 'primereact/api';
import AppConfig from '../layout/AppConfig';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import './globals.css';

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("lara-light-blue");

  // Jalankan hanya di client
  useEffect(() => {
    const saved = localStorage.getItem("layoutConfig");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setTheme(parsed.theme);
      } catch (err) {
        console.warn("Invalid layoutConfig:", err);
      }
    }
  }, []);

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          id="theme-css"
          href={`/themes/${theme}/theme.css`}
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <PrimeReactProvider>
          <LayoutProvider>
            {children}
            <AppConfig />
          </LayoutProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
