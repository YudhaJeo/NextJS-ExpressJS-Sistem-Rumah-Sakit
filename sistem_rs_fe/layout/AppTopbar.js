import Link from "next/link";
import { classNames } from "primereact/utils";
import React, {
    forwardRef,
    useContext,
    useImperativeHandle,
    useRef,
    useEffect,
    useState,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import Cookies from "js-cookie";
import { Avatar } from "primereact/avatar";

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
        useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [profile, setProfile] = useState("");

    useEffect(() => {
        const name = Cookies.get("username");
        if (name) setUsername(name);

        const roleData = Cookies.get("role");
        if (roleData) setRole(roleData);
    }, []);

    useEffect(() => {
        const profileData = Cookies.get("profile");
        if (profileData && profileData !== "null" && profileData !== "undefined") {
            setProfile(profileData);
        }
    }, []);

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo.png`} alt="logo" />
                <span>RS Bayza Medika</span>
            </Link>

            <button
                ref={menubuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
            >
                <i className="pi pi-bars" />
            </button>

            <button
                ref={topbarmenubuttonRef}
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={showProfileSidebar}
            >
                <i className="pi pi-ellipsis-v" />
            </button>

            <div
                ref={topbarmenuRef}
                className={classNames("layout-topbar-menu", {
                    "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
                })}
            >
                <p className="text-base md:text-xl font-medium text-right flex flex-col">
                    <span>{username}</span>
                    {role && <span className="text-sm text-right text-gray-400">{role}</span>}
                </p>

                <Link href="/profile">
                    <button type="button" className="p-link layout-topbar-button">
                        <Avatar
                            image={
                                profile && profile !== "null" && profile !== "undefined"
                                    ? profile
                                    : undefined
                            }
                            icon={
                                !profile || profile === "null" || profile === "undefined"
                                    ? "pi pi-user"
                                    : undefined
                            }
                            size="xlarge"
                            shape="circle"
                            style={{ objectFit: 'cover', width: '3rem', height: '3rem', background: 'transparent' }}
                            onImageError={(e) => {
                                e.target.src = "";
                                e.target.classList.add("pi", "pi-user");
                            }}
                        />
                        <span>Profile</span>
                    </button>
                </Link>
            </div>
        </div>
    );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
