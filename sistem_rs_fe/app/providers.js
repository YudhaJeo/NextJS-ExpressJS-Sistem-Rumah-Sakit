'use client';

import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';

export default function Providers({ children }) {
  return (
    <PrimeReactProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </PrimeReactProvider>
  );
}
