import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";

const AdminProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    // ⏳ wait till auth restore
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (user.role !== "admin") {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
