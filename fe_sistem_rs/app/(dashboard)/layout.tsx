import { Metadata } from 'next';
import Layout from '../../layout/layout';


interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Sistem Rumah Sakit',
    icons: {
        icon: '/favicon.ico',
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}