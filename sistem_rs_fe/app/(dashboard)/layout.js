import Layout from '../../layout/layout';

export const metadata = {
  title: 'Sistem Rumah Sakit',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function AppLayout({ children }) {
  return <Layout>{children}</Layout>;
}
