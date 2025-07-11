// sistem_rs_fe\layout\AppSidebar.js
'use client';

import { Suspense } from 'react';
import AppMenu from './AppMenu';

const AppSidebar = () => {
    return (
        <Suspense fallback={null}>
            <AppMenu />
        </Suspense>
    );
};

export default AppSidebar;
