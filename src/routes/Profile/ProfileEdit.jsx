import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqus0S7qc6GLn7yh44WPR7MzR1DSM81WI6ng&s";

const ProfileEdit = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user, updateUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        profileImage: null,
    });

    const [preview, setPreview] = useState(DEFAULT_AVATAR);

    // 🔹 Fill form from logged-in user
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                profileImage: null, // file only
            });

            setPreview(user.profileImage?.url || DEFAULT_AVATAR);
        }
    }, [user]);

    // 🔹 Image preview logic (memory safe)
    useEffect(() => {
        if (formData.profileImage instanceof File) {
            const objectUrl = URL.createObjectURL(formData.profileImage);
            setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [formData.profileImage]);

    if (!user) {
        return <div className="p-6 text-center">Loading user details...</div>;
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "profileImage" && files && files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                profileImage: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userId = user?.id || user?._id;
            if (!userId) {
                alert("User ID not found. Please login again.");
                return;
            }

            const data = new FormData();
            data.append("fullName", formData.fullName);
            data.append("email", formData.email);

            if (formData.profileImage instanceof File) {
                data.append("profileImage", formData.profileImage);
            }

            await updateUser(userId, data);
            navigate("/profile");
        } catch (error) {
            console.error("Update profile error:", error);
            alert(error?.response?.data?.message || "Something went wrong while updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-start justify-center bg-gray-100 p-6 dark:bg-zinc-950">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-md dark:bg-zinc-900">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-100">Edit Profile</h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* Full Name */}
                    <div>
                        <label className="mb-1 block text-gray-700 dark:text-gray-200">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border border-gray-300 p-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-1 block text-gray-700 dark:text-gray-200">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border border-gray-300 p-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100"
                        />
                    </div>

                    {/* Profile Image */}
                    <div>
                        <label className="mb-1 block text-gray-700 dark:text-gray-200">Profile Image</label>

                        <input
                            type="file"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full text-gray-700 dark:text-gray-200"
                        />

                        <img
                            src={preview}
                            alt="Profile Preview"
                            className="mt-3 h-24 w-24 rounded-full border border-gray-200 object-cover dark:border-zinc-700"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileEdit;
