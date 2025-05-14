import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const LawyerDetailsPage = () => {
    const { lawyerId } = useParams(); // Get the lawyerId from the URL
    const [lawyer, setLawyer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLawyerDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${VITE_NODE_BACKEND_URL}/api/v1/lawyers-directory/${lawyerId}`);  // Adjusted URL
                setLawyer(response.data.data);  // Assuming the response returns the lawyer's data in the 'data' field
                setLoading(false);
            } catch (err) {
                setError('Error fetching lawyer details');
                setLoading(false);
            }
        };

        fetchLawyerDetails();
    }, [lawyerId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="px-10 py-5 bg-gradient-to-t from-red-900/90 to-gray-200 shadow-lg">
            {lawyer ? (
                <div className="max-w-[960px] mx-auto backdrop-blur-sm bg-red-50/80 p-6 rounded-3xl shadow-md">
                    <div className="flex items-center gap-8 mb-6">
                        {/* Profile Picture */}
                        <div
                            className="w-48 h-48 bg-cover rounded-full border-4 border-red-950"
                            style={{
                                backgroundImage: `url(${lawyer.profilePhoto})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        ></div>

                        {/* Lawyer Info */}
                        <div className="flex flex-col justify-between">
                            <h1 className="text-4xl font-bold text-[#1b130e]">{lawyer.name}</h1>
                            <p className="text-sm text-red-900 font-bold">{lawyer.email}</p>
                            <p className="mt-2 text-[#1b130e] text-sm font-bold">{lawyer.contactNo}</p>
                            <p className="mt-2 text-[#1b130e] text-sm">{lawyer.location}</p>
                            <p className="mt-2 text-red-900 text-sm font-semibold">{lawyer.yearsOfExperience} years of experience</p>
                            <p className="mt-4">{lawyer.bio}</p>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-[#1b130e]">Additional Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                            <div className="bg-red-900/20 p-4 rounded-3xl">
                                <h3 className="text-lg font-semibold text-grey-800">Specialization</h3>
                                <p className="text-sm text-[#1b130e]">{lawyer.specialization}</p>
                            </div>

                            <div className="bg-red-900/20 p-4 rounded-3xl">
                                <h3 className="text-lg font-semibold text-grey-800">Availability</h3>
                                <p className="text-sm text-[#1b130e]">{lawyer.availability}</p>
                            </div>

                            <div className="bg-red-900/20 p-4 rounded-3xl">
                                <h3 className="text-lg font-semibold text-grey-800">Language Spoken</h3>
                                <p className="text-sm text-[#1b130e]">{lawyer.languageSpoken}</p>
                            </div>

                            <div className="bg-red-900/20 p-4 rounded-3xl">
                                <h3 className="text-lg font-semibold text-grey-800">Number of Cases Solved</h3>
                                <p className="text-sm text-[#1b130e]">{lawyer.noOfCasesSolved}</p>
                            </div>

                            <div className="bg-red-900/20 p-4 rounded-3xl">
                                <h3 className="text-lg font-semibold text-grey-800">Education</h3>
                                <p className="text-sm text-[#1b130e]">{lawyer.education}</p>
                            </div>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-[#1b130e]">Documents</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                            <div className="bg-red-900/20 p-4 rounded-3xl">
                                <h3 className="text-lg font-semibold text-grey-800">Profile Photo</h3>
                                <a
                                    href={lawyer.profilePhoto}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center text-black bg-red-200/50 hover:text-white hover:bg-red-900 py-3 px-6 rounded-full mt-4 transition duration-300"
                                >
                                    View Profile Photo
                                </a>
                            </div>

                            <div className="bg-red-900/20 p-4 rounded-3xl">
                                <h3 className="text-lg font-semibold text-grey-800">Education Certificate</h3>
                                <a
                                    href={lawyer.educationCertificate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center text-black bg-red-200/50 hover:text-white hover:bg-red-900 py-3 px-6 rounded-full mt-4 transition duration-300"
                                >
                                    View Education Certificate
                                </a>
                            </div>
                        </div>
                    </div>


                    {/* Contact Section */}
                    <div className="mt-8 flex justify-end">
                        <button
                            className="bg-red-800 hover:bg-red-900 hover:scale-105 text-white px-6 py-2 rounded-3xl font-semibold"
                            onClick={() => window.location.href = `mailto:${lawyer.email}`}
                        >
                            Contact Lawyer
                        </button>
                    </div>
                </div>
            ) : (
                <div>No lawyer found</div>
            )}
        </div>
    );
};

export default LawyerDetailsPage;
