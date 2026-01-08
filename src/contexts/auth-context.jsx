import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            setUser(JSON.parse(userData));
        }

        setLoading(false);
    }, []);

    const login = (res) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
    };

    const logout = () => {
        // Remove only auth-related items
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        // Clear context
        setUser(null);
    };

    const updateUser = async (id, data) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Session expired. Please login again.");
                return;
            }

            const res = await axios.put(`https://resume-backend-s69p.onrender.com/api/user/update/${id}`, data, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedUser = {
                ...res.data.user,
                id: res.data.user._id,
            };

            setUser(updatedUser);

            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
            console.error("Update failed:", error.response?.data || error.message);
        }
    };

    return <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
