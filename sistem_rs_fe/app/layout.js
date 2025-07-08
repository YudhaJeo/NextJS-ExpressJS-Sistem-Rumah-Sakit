// app/layout.js
import Providers from './providers';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

export const metadata = {
  title: 'Rumah Sakit',
  description: 'Sistem Informasi Rumah Sakit',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          id="theme-css"
          href="/themes/lara-light-indigo/theme.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
