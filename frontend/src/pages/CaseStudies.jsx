import { useEffect, useState } from "react";
import axios from "axios";

const CaseStudies = () => {
    const [judgements, setJudgements] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchJudgements = async (page) => {
        setLoading(true);
        try {
            // Use the VITE_API_BASE_URL environment variable
            const response = await axios.get(
                `${import.meta.env.VITE_NODE_BACKEND_URL}/api/v1/past-judgement?page=${page}&limit=10`
            );
            setJudgements(response.data.judgements);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError("Error fetching judgements.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJudgements(page);
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Formats date to MM/DD/YYYY
    };

    console.log(formatDate)

    if (loading) return <p className="text-center text-xl">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-6 bg-gradient-to-t from-red-900 via-white to-gray-400">
            <h1 className="text-3xl font-bold mb-6 text-center">Past Case Judgements</h1>

            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {judgements.map((judgement) => (
                    <div key={judgement._id} className="bg-red-50 shadow-lg shadow-red-950 rounded-3xl p-6">
                        <h2 className="text-xl font-semibold text-red-800">{judgement.case_no}</h2>
                        <p className="mt-2 text-gray-700">
                            <strong>Diary No:</strong> {judgement.diary_no}
                        </p>
                        <p className="mt-2 text-gray-700">
                            <strong>Petitioner:</strong> {judgement.pet}
                        </p>
                        <p className="mt-2 text-gray-700">
                            <strong>Respondent:</strong> {judgement.res}
                        </p>
                        <p className="mt-2 text-gray-700">
                            <strong>Judgement By:</strong> {judgement.judgement_by}
                        </p>
                        <div className="mt-4">
                            <a
                                href={judgement.temp_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-4 py-2 bg-red-900 text-white rounded-3xl hover:bg-red-800 hover:scale-105 transition-all ease-in-out duration-100"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 text-white font-bold">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-red-200/60 text-black rounded-l-3xl hover:bg-red-300 disabled:opacity-30"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-xl">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-red-200/60 text-black rounded-r-3xl hover:bg-red-300 disabled:opacity-30"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CaseStudies;
