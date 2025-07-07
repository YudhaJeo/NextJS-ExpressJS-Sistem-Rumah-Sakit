'use client';
import React, { useState, createContext, useMemo } from 'react';

export const LayoutContext = createContext({});

export const LayoutProvider = ({ children }) => {
    const [layoutConfig, setLayoutConfig] = useState({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
        scale: 14
    });

    const [layoutState, setLayoutState] = useState({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    });

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prev) => ({ ...prev, overlayMenuActive: !prev.overlayMenuActive }));
        }

        if (isDesktop()) {
            setLayoutState((prev) => ({ ...prev, staticMenuDesktopInactive: !prev.staticMenuDesktopInactive }));
        } else {
            setLayoutState((prev) => ({ ...prev, staticMenuMobileActive: !prev.staticMenuMobileActive }));
        }
    };

    const showProfileSidebar = () => {
        setLayoutState((prev) => ({ ...prev, profileSidebarVisible: !prev.profileSidebarVisible }));
    };

    const isOverlay = () => layoutConfig.menuMode === 'overlay';

    const isDesktop = () => typeof window !== 'undefined' && window.innerWidth > 991;

    const value = useMemo(() => ({
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showProfileSidebar
    }), [layoutConfig, layoutState]);

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
};
