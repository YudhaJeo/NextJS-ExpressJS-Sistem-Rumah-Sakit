import Layout from '../../layout/layout';
import Providers from '../providers';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../../styles/layout/layout.scss';
import '../../styles/demo/Demos.scss';
import '/public/themes/lara-light-indigo/theme.css';
import '../globals.css';


export const metadata = {
  title: 'Sistem Rumah Sakit',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function AppLayout({ children }) {
  return (
    <Providers>
      <Layout>
        {children}
      </Layout>
    </Providers>
  );
}
