import React, { useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div className="p-6 text-center">Loading user details...</div>;
    }

    // ✅ userId safe handling
    const userId = user._id || user.id;

    const handleEdit = () => {
        navigate(`/profile/edit/${userId}`);
    };

    // ✅ profile image safe handling
    const profileImage =
        user?.profileImage?.url ||
        user?.profileImage ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqus0S7qc6GLn7yh44WPR7MzR1DSM81WI6ng&s";

    return (
        <div className="flex min-h-screen items-start justify-center bg-gray-100 p-4 dark:bg-zinc-950 sm:p-6 md:p-10">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-md dark:bg-zinc-900 sm:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Profile</h2>
                    <button
                        onClick={handleEdit}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Edit
                    </button>
                </div>

                {/* Profile Info */}
                <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <img
                        src={profileImage}
                        alt={user.fullName}
                        className="h-24 w-24 rounded-full border object-cover dark:border-zinc-700 sm:h-28 sm:w-28"
                    />

                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{user.fullName}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                        <p className="capitalize text-gray-600 dark:text-gray-300">{user.role}</p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4">
                    <h4 className="text-md mb-2 font-semibold text-gray-700 dark:text-gray-200">Additional Info</h4>
                    <p className="text-gray-600 dark:text-gray-300">Joined on: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
