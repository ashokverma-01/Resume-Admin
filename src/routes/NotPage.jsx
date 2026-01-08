import { Link } from "react-router-dom";

const NotPage = () => {
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-red-600">Unauthorized 🚫</h1>
            <p className="mt-2">You do not have permission to access this page</p>
            <Link
                to="/login"
                className="mt-4 text-blue-600 underline"
            >
                Go to Login
            </Link>
        </div>
    );
};

export default NotPage;
