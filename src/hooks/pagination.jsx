import React from "react";

const FilePagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Create page numbers array
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mt-4 flex items-center justify-end gap-2">
            {/* Previous Button */}
            <button
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`rounded-lg border px-4 py-2 shadow-sm transition-colors duration-200 ${
                    currentPage === 1
                        ? "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-400"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
                Prev
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`rounded-lg border px-4 py-2 shadow-sm transition-colors duration-200 ${
                        currentPage === number ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    {number}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`rounded-lg border px-4 py-2 shadow-sm transition-colors duration-200 ${
                    currentPage === totalPages
                        ? "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-400"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default FilePagination;
