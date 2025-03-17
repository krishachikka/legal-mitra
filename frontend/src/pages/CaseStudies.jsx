import React, { useEffect, useState } from "react";
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
            const response = await axios.get(
                `http://localhost:3000/api/v1/past-judgement?page=${page}&limit=10`
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

    if (loading) return <p className="text-center text-xl">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Past Case Judgements</h1>

            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {judgements.map((judgement) => (
                    <div key={judgement._id} className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-blue-600">{judgement.case_no}</h2>
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
                        <p className="mt-2 text-gray-700">
                            {/* <strong>Judgement Date:</strong> {formatDate(judgement.judgment_dates)} */}
                        </p>
                        <div className="mt-4">
                            <a
                                href={judgement.temp_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-xl">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-lg hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CaseStudies;
