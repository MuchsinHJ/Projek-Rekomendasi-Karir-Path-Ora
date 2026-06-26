import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store.ts";
import logo from "../../images/logo.png";
import {LayoutDashboard,Upload,ChartColumn,Route,User,CircleHelp,LogOut,X} from "lucide-react";
/**
 * Sidebar Navigation Component
 * 
 * Fungsi:
 * - Menampilkan menu navigasi utama (Dashboard, Upload, Profile, etc.)
 * - Active state untuk highlight menu yang sedang aktif
 * - Logout button
 * 
 * Digunakan di: AppLayout
 */
interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
}) => {
    const location = useLocation();
    const { logout } = useAuthStore();

    // Menu items sesuai PRD §3.0 Sitemap
    const menuItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={18}/>,
        },
        {
            label: "Upload CV",
            path: "/upload",
            icon: <Upload size={18}/>,
        },
        {
            label: "Analysis",
            path: "/analysis",
            icon: <ChartColumn size={18}/>,
        },
        {
            label: "Career Recommendations",
            path: "/career-recommendations",
            icon: <Route size={18}/>,
        },
        {
            label: "Profile",
            path: "/profile",
            icon: <User size={18}/>,
        },
        
        
    ];

    const isActive = (path: string) => location.pathname.startsWith(path);

    const handleSupport = () => {
        window.open("https://wa.me/6285609727086?text=Hello%20Path'Ora%20Support", "_blank");
    };

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    return (
        <>
        {isOpen && (
            <div
                onClick={onClose}
                className="
                    fixed inset-0
                    z-40
                    lg:hidden
                "
            />
        )}
        
        {/* <aside className="w-64  text-white bg-[#FFFFFF] h-screen flex flex-col fixed left-0 top-0 shadow-lg"> */}
        <aside className={`flex flex-col fixed top-0 left-0 w-64 h-screen bg-[#FFFFFF] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        
            {/* Logo Section */}
            <div className="flex items-center justify-between py-6 px-6">
                <div className="flex items-center gap-4">
                    <img
                        src={logo}
                        alt="Path'Ora Logo"
                        className="w-9 h-9 icon-dark rounded-full shadow-md"
                    />

                    <h1 className="text-2xl font-['Newsreader'] text-gray-900">
                        Path'Ora
                    </h1>
                </div>

                <button
                    onClick={onClose}
                    className="lg:hidden"
                >
                    <X size={22} className="text-black" />
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto ">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-['Manrope'] ${
                            isActive(item.path)
                                ? "bg-[#CFE9D3] text-[#0A2012]"
                                : "text-gray-700 hover:bg-[#CFE9D3] hover:text-[#0A2012]"
                        }`}
                        onClick={() => {
                            if (window.innerWidth < 1024) {
                                onClose();
                            }
                        }}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium text-sm md:text-base">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Logout Button */}
            <div className=" mt-auto p-4  border-gray-200">

                <button
                    onClick={handleSupport}
                    className="w-full flex items-center gap-3 hover:bg-[#b23b3b] hover:text-white text-[#0A2012] rounded-lg font-['Manrope',_sans-serif] py-2 px-4  transition-colors text-sm"
                >
                    <CircleHelp size={18}/>
                    <span>Help</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 hover:bg-[#b23b3b] hover:text-white text-[#0A2012] rounded-lg font-['Manrope',_sans-serif] py-2 px-4  transition-colors text-sm"
                >
                    <LogOut size={18}/>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
        </>
    );
};

export default Sidebar;
