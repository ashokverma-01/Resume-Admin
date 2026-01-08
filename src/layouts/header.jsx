import { useTheme } from "@/hooks/use-theme";
import { Bell, ChevronsLeft, Moon, Search, Sun } from "lucide-react";
import { useRef, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/auth-context";

export const Header = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { user, logout } = useContext(AuthContext);

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Logout logic
        logout();
        navigate("/login");
    };

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
                <div className="input">
                    <Search
                        size={20}
                        className="text-slate-300"
                    />
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search..."
                        className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                    />
                </div>
            </div>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
                <button className="btn-ghost size-10">
                    <Bell size={20} />
                </button>
                <button
                    className="size-10 overflow-hidden rounded-full"
                    onClick={() => setOpen(!open)} // <-- ye add kiya
                >
                    <img
                        src={user.profileImage?.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqus0S7qc6GLn7yh44WPR7MzR1DSM81WI6ng&s"}
                        alt="profile image"
                        className="size-full object-cover"
                    />
                    {open && (
                        <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                            <button
                                onClick={() => navigate("/profile")}
                                className="w-full rounded-t-lg px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700"
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => navigate("/settings")}
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700"
                            >
                                Settings
                            </button>
                            <button
                                onClick={() => {
                                    // logout logic
                                    localStorage.removeItem("token");
                                    navigate("/login");
                                }}
                                className="w-full rounded-b-lg px-4 py-2 text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
