import { useEffect, useState } from "react";
import axios from "axios";
import { Trash } from "lucide-react";
import FilePagination from "../../../hooks/pagination";
import { useNavigate } from "react-router-dom";

const CustomerList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [paginatedData, setPaginatedData] = useState([]);

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("https://resume-backend-s69p.onrender.com/api/user/all");
            setUsers(data.users || []);
        } catch (error) {
            console.error(error);
            alert("Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Pagination logic
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setPaginatedData(users.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, users, itemsPerPage]);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`https://resume-backend-s69p.onrender.com/api/user/delete/${id}`);
            alert("User deleted successfully");
            fetchUsers();
        } catch (error) {
            console.error(error);
            alert("Error deleting user");
        }
    };
    const token = localStorage.getItem("token");

    const toggleRole = async (user) => {
        const newRole = user.role === "user" ? "admin" : "user";

        try {
            await axios.put(
                `https://resume-backend-s69p.onrender.com/api/user/role/${user._id}`,
                { role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            // UI update
            setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)));
        } catch (error) {
            console.error(error);
            alert("Failed to update role");
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 dark:bg-zinc-950">
            <div className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow dark:bg-zinc-900">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-zinc-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Customer List 👥</h2>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gray-100 dark:bg-zinc-800">
                            <tr>
                                {["#", "Avatar", "Full Name", "Email", "Role", "Actions"].map((title) => (
                                    <th
                                        key={title}
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                                    >
                                        {title}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className={`transition hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                                            index % 2 === 0 ? "bg-gray-50 dark:bg-zinc-900" : ""
                                        }`}
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>

                                        <td className="px-4 py-3">
                                            <img
                                                src={
                                                    user.profileImage?.url ||
                                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqus0S7qc6GLn7yh44WPR7MzR1DSM81WI6ng&s"
                                                }
                                                alt={user.fullName}
                                                className="h-12 w-12 rounded-full border border-gray-200 object-cover dark:border-zinc-700"
                                            />
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{user.fullName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{user.email}</td>

                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => toggleRole(user)}
                                                className={`rounded-full px-3 py-1 font-semibold text-white transition-colors ${
                                                    user.role === "admin" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                                                }`}
                                            >
                                                {user.role}
                                            </button>
                                        </td>

                                        <td className="px-4 py-3">
                                            <button
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <FilePagination
                totalItems={users.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default CustomerList;
