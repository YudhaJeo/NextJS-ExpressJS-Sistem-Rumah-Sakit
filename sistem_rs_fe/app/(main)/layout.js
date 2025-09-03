// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(main)\layout.js

import Layout from '../../layout/layout';
import Providers from '../providers';

export const metadata = {
  title: 'Bayza Medika',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function AppLayout({ children }) {
  return (
    <Providers>
      <Layout>{children}</Layout>
    </Providers>
  );
}
