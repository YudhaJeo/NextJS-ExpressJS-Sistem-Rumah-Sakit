'use client';

import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import React, { useEffect, useContext, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { MenuContext } from './context/menucontext';
import { usePathname } from 'next/navigation';

const AppMenuitem = (props) => {
    const pathname = usePathname();
    const { activeMenu, setActiveMenu } = useContext(MenuContext);

    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const isActiveRoute = item?.to && pathname === item.to;
    const active = activeMenu === key || activeMenu.startsWith(key + '-');

    const submenuRef = useRef(null);

    const onRouteChange = (url) => {
        if (item?.to && item.to === url) {
            setActiveMenu(key);
        }
    };

    useEffect(() => {
        onRouteChange(pathname);
    }, [pathname]);

    const itemClick = (event) => {
        if (item?.disabled) {
            event.preventDefault();
            return;
        }

        if (item?.command) {
            item.command({ originalEvent: event, item });
        }

        if (item?.items) {
            setActiveMenu(active ? props.parentKey : key);
        } else {
            setActiveMenu(key);
        }
    };

    const subMenu = item?.items && item.visible !== false && (
        <CSSTransition
            nodeRef={submenuRef}
            timeout={{ enter: 1000, exit: 450 }}
            classNames="layout-submenu"
            in={props.root ? true : active}
            unmountOnExit
        >
            <ul ref={submenuRef}>
                {item.items.map((child, i) => (
                    <AppMenuitem
                        item={child}
                        index={i}
                        className={child.badgeClass}
                        parentKey={key}
                        key={child.label}
                    />
                ))}
            </ul>
        </CSSTransition>
    );

    return (
        <li className={classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
            {props.root && item?.visible !== false && (
                <div className="layout-menuitem-root-text text-sm">{item.label}</div>
            )}

            {(!item?.to || item?.items) && item?.visible !== false ? (
                <a
                    href={item.url}
                    onClick={itemClick}
                    className={classNames(item.class, 'p-ripple')}
                    target={item.target}
                    tabIndex={0}
                >
                    <i className={classNames('layout-menuitem-icon text-sm', item.icon)}></i>
                    <span className="layout-menuitem-text text-sm">{item.label}</span>
                    {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </a>
            ) : null}

            {item?.to && !item.items && item.visible !== false ? (
                <Link
                    href={item.to}
                    replace={item.replaceUrl}
                    target={item.target}
                    onClick={itemClick}
                    className={classNames(item.class, 'p-ripple', { 'active-route': isActiveRoute })}
                    tabIndex={0}
                >
                    <i className={classNames('layout-menuitem-icon text-sm', item.icon)}></i>
                    <span className="layout-menuitem-text text-sm">{item.label}</span>
                    {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </Link>
            ) : null}

            {subMenu}
        </li>
    );
};

export default AppMenuitem;
