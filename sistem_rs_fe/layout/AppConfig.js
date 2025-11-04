'use client';

import { PrimeReactContext } from 'primereact/api';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { classNames } from 'primereact/utils';
import React, { useState, useEffect, useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

export const LayoutProvider = ({ children }) => {
  const [layoutConfig, setLayoutConfig] = useState(() => {
    // load dari localStorage kalau ada
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('layoutConfig');
      if (saved) return JSON.parse(saved);
    }
    return {
      theme: 'lara-light-blue',
      colorScheme: 'light',
      menuMode: 'static',
      scale: 14,
      ripple: true,
    };
  });

  const [layoutState, setLayoutState] = useState({
    configSidebarVisible: false,
  });

  // simpan ke localStorage setiap kali layoutConfig berubah
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('layoutConfig', JSON.stringify(layoutConfig));
    }
  }, [layoutConfig]);

  // terapkan tema saat pertama kali load
  useEffect(() => {
    if (typeof window !== 'undefined' && layoutConfig.theme) {
      const link = document.getElementById('theme-css');
      if (link) {
        link.setAttribute('href', `/themes/${layoutConfig.theme}/theme.css`);
      }
      document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    }
  }, []);

  return (
    <LayoutContext.Provider value={{ layoutConfig, setLayoutConfig, layoutState, setLayoutState }}>
      {children}
    </LayoutContext.Provider>
  );
};

// === AppConfig Sidebar ===
const AppConfig = (props) => {
  const [scales] = useState([12, 13, 14, 15, 16]);
  const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
  const { setRipple, changeTheme } = useContext(PrimeReactContext);

  const onConfigButtonClick = () => {
    setLayoutState((prev) => ({ ...prev, configSidebarVisible: true }));
  };

  const onConfigSidebarHide = () => {
    setLayoutState((prev) => ({ ...prev, configSidebarVisible: false }));
  };

  const changeRipple = (e) => {
    setRipple?.(e.value);
    setLayoutConfig((prev) => ({ ...prev, ripple: e.value }));
  };

  const _changeTheme = (theme, colorScheme) => {
    changeTheme?.(layoutConfig.theme, theme, 'theme-css', () => {
      const updatedConfig = { ...layoutConfig, theme, colorScheme };
      setLayoutConfig(updatedConfig);
      localStorage.setItem('layoutConfig', JSON.stringify(updatedConfig));
    });
  };

  const decrementScale = () => {
    setLayoutConfig((prev) => ({ ...prev, scale: Math.max(12, prev.scale - 1) }));
  };

  const incrementScale = () => {
    setLayoutConfig((prev) => ({ ...prev, scale: Math.min(16, prev.scale + 1) }));
  };

  useEffect(() => {
    document.documentElement.style.fontSize = layoutConfig.scale + 'px';
  }, [layoutConfig.scale]);

  return (
    <>
      <button className="layout-config-button config-link" type="button" onClick={onConfigButtonClick}>
        <i className="pi pi-cog"></i>
      </button>

      <Sidebar
        visible={layoutState.configSidebarVisible}
        onHide={onConfigSidebarHide}
        position="right"
        className="layout-config-sidebar w-20rem"
      >
        {!props.simple && (
          <>
            <h5>Scale</h5>
            <div className="flex align-items-center">
              <Button icon="pi pi-minus" type="button" onClick={decrementScale} rounded text disabled={layoutConfig.scale === scales[0]} />
              <div className="flex gap-2 align-items-center">
                {scales.map((s) => (
                  <i
                    key={s}
                    className={classNames('pi pi-circle-fill', {
                      'text-primary-500': s === layoutConfig.scale,
                      'text-300': s !== layoutConfig.scale,
                    })}
                  ></i>
                ))}
              </div>
              <Button icon="pi pi-plus" type="button" onClick={incrementScale} rounded text disabled={layoutConfig.scale === scales[scales.length - 1]} />
            </div>
          </>
        )}

<h5>Default Theme</h5>
                <div className="grid">
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('lara-light-blue', 'light')}>
                            <img src="/layout/images/themes/lara-light-blue.png" className="w-2rem h-2rem" alt="Lara Light Blue" />
                        </button>
                    </div>
                </div>

                <h5>PrimeOne Design</h5>
                <div className="grid">
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('lara-light-indigo', 'light')}>
                            <img src="/layout/images/themes/lara-light-indigo.png" className="w-2rem h-2rem" alt="Lara Light Indigo" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('lara-light-blue', 'light')}>
                            <img src="/layout/images/themes/lara-light-blue.png" className="w-2rem h-2rem" alt="Lara Light Blue" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('lara-light-purple', 'light')}>
                            <img src="/layout/images/themes/lara-light-purple.png" className="w-2rem h-2rem" alt="Lara Light Purple" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('lara-light-teal', 'light')}>
                            <img src="/layout/images/themes/lara-light-teal.png" className="w-2rem h-2rem" alt="Lara Light Teal" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('lara-dark-indigo', 'dark')}>
                            <img src="/layout/images/themes/lara-dark-indigo.png" className="w-2rem h-2rem" alt="Lara Dark Indigo" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('lara-dark-blue', 'dark')}>
                            <img src="/layout/images/themes/lara-dark-blue.png" className="w-2rem h-2rem" alt="Lara Dark Blue" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('lara-dark-purple', 'dark')}>
                            <img src="/layout/images/themes/lara-dark-purple.png" className="w-2rem h-2rem" alt="Lara Dark Purple" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('lara-dark-teal', 'dark')}>
                            <img src="/layout/images/themes/lara-dark-teal.png" className="w-2rem h-2rem" alt="Lara Dark Teal" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('soho-light', 'light')}>
                            <img src="/layout/images/themes/soho-light.png" className="w-2rem h-2rem" alt="Soho Light" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('soho-dark', 'dark')}>
                            <img src="/layout/images/themes/soho-dark.png" className="w-2rem h-2rem" alt="Soho Dark" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('viva-light', 'light')}>
                            <img src="/layout/images/themes/viva-light.svg" className="w-2rem h-2rem" alt="Viva Light" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('viva-dark', 'dark')}>
                            <img src="/layout/images/themes/viva-dark.svg" className="w-2rem h-2rem" alt="Viva Dark" />
                        </button>
                    </div>
                </div>

                <h5>Bootstrap</h5>
                <div className="grid">
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('bootstrap4-light-blue', 'light')}>
                            <img src="/layout/images/themes/bootstrap4-light-blue.svg" className="w-2rem h-2rem" alt="Bootstrap Light Blue" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('bootstrap4-light-purple', 'light')}>
                            <img src="/layout/images/themes/bootstrap4-light-purple.svg" className="w-2rem h-2rem" alt="Bootstrap Light Purple" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('bootstrap4-dark-blue', 'dark')}>
                            <img src="/layout/images/themes/bootstrap4-dark-blue.svg" className="w-2rem h-2rem" alt="Bootstrap Dark Blue" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('bootstrap4-dark-purple', 'dark')}>
                            <img src="/layout/images/themes/bootstrap4-dark-purple.svg" className="w-2rem h-2rem" alt="Bootstrap Dark Purple" />
                        </button>
                    </div>
                </div>

                <h5>Material Design</h5>
                <div className="grid">
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('md-light-indigo', 'light')}>
                            <img src="/layout/images/themes/md-light-indigo.svg" className="w-2rem h-2rem" alt="Material Light Indigo" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('md-light-deeppurple', 'light')}>
                            <img src="/layout/images/themes/md-light-deeppurple.svg" className="w-2rem h-2rem" alt="Material Light DeepPurple" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('md-dark-indigo', 'dark')}>
                            <img src="/layout/images/themes/md-dark-indigo.svg" className="w-2rem h-2rem" alt="Material Dark Indigo" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('md-dark-deeppurple', 'dark')}>
                            <img src="/layout/images/themes/md-dark-deeppurple.svg" className="w-2rem h-2rem" alt="Material Dark DeepPurple" />
                        </button>
                    </div>
                </div>

                <h5>Material Design Compact</h5>
                <div className="grid">
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('mdc-light-indigo', 'light')}>
                            <img src="/layout/images/themes/md-light-indigo.svg" className="w-2rem h-2rem" alt="Material Light Indigo" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('mdc-light-deeppurple', 'light')}>
                            <img src="/layout/images/themes/md-light-deeppurple.svg" className="w-2rem h-2rem" alt="Material Light Deep Purple" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('mdc-dark-indigo', 'dark')}>
                            <img src="/layout/images/themes/md-dark-indigo.svg" className="w-2rem h-2rem" alt="Material Dark Indigo" />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => _changeTheme('mdc-dark-deeppurple', 'dark')}>
                            <img src="/layout/images/themes/md-dark-deeppurple.svg" className="w-2rem h-2rem" alt="Material Dark Deep Purple" />
                        </button>
                    </div>
                </div>
      </Sidebar>
    </>
  );
};

export default AppConfig;