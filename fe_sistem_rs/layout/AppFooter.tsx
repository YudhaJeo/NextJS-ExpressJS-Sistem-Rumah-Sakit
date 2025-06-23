/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="mr-2" /> */}
            <span>
                Copyright © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_COMPANY_NAME}. All rights reserved.
            </span>
            {/*
            <span className="font-medium ml-2">copyright&copy; {process.env.NEXT_PUBLIC_COMPANY_NAME}</span>
            */}
        </div>
    );
};

export default AppFooter;
