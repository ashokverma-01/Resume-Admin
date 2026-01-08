import { useEffect, useState } from "react";
import axios from "axios";
import { EyeIcon, Trash } from "lucide-react";
import FilePagination from "../../../hooks/pagination";
import { useNavigate } from "react-router-dom";

const ResumeList = () => {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);
    const [paginatedData, setPaginatedData] = useState([]);

    const handleEdit = (id) => {
        if (!id) return;
        navigate(`/view/${id}`);
    };

    const fetchResumes = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("https://resume-backend-s69p.onrender.com/api/resume/all");

            // Ensure it's always an array
            setResumes(Array.isArray(data.resumes) ? data.resumes : []);
        } catch (error) {
            console.error(error);
            alert("Error fetching resumes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    // Paginate safely
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setPaginatedData(resumes.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, resumes, itemsPerPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!id || !window.confirm("Are you sure you want to delete this resume?")) return;

        try {
            await axios.delete(`https://resume-backend-s69p.onrender.com/api/resume/delete/${id}`, {
                withCredentials: true, // if using cookies
                headers: {
                    "Content-Type": "application/json", // DELETE usually doesn't need multipart/form-data
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Resume deleted successfully");
            fetchResumes(); // refresh the list
        } catch (error) {
            console.error(error.response || error);
            alert("Error deleting resume");
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 dark:bg-zinc-950">
            <div className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow dark:bg-zinc-900">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-zinc-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Resume List 📄</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gray-100 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    #
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Phone
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                            {paginatedData.length > 0 ? (
                                paginatedData
                                    .filter((resume) => resume && resume._id) // remove undefined
                                    .map((resume, index) => (
                                        <tr
                                            key={resume._id || index}
                                            className="transition hover:bg-gray-50 dark:hover:bg-zinc-800"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{resume.fullName || "-"}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{resume.email || "-"}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{resume.phone || "-"}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex gap-3">
                                                    <button
                                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition hover:bg-blue-200"
                                                        onClick={() => handleEdit(resume._id)}
                                                    >
                                                        <EyeIcon size={18} />
                                                    </button>
                                                    <button
                                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition hover:bg-red-200"
                                                        onClick={() => handleDelete(resume._id)}
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No resumes found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <FilePagination
                totalItems={resumes.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ResumeList;
