// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(main)\layout.js
import Layout from '../../layout/layout';
import { PrimeReactProvider } from 'primereact/api';

export const metadata = {
  title: 'Bayza Medika',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function AppLayout({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}