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
                const response = await axios.get(`http://localhost:3000/api/v1/lawyers-directory/${lawyerId}`);  // Adjusted URL
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
        <div className="px-10 py-5">
            {lawyer ? (
                <div className="max-w-[960px] mx-auto">
                    <div className="flex items-center gap-8">
                        {/* Profile Picture */}
                        <div
                            className="w-32 h-32 bg-cover rounded-full"
                            style={{ backgroundImage: `url(${lawyer.profilePhoto})` }}
                        ></div>

                        {/* Lawyer Info */}
                        <div>
                            <h1 className="text-3xl font-bold">{lawyer.name}</h1>
                            <p className="text-sm text-[#9b9b9b]">{lawyer.email}</p>
                            <p className="mt-2">{lawyer.bio}</p>
                            <p className="mt-2">{lawyer.experience} years of experience</p>
                            <p className="mt-2">{lawyer.location}</p>
                        </div>
                    </div>

                    {/* Additional Lawyer Information (if needed) */}
                    {/* e.g. list of cases handled, etc. */}
                </div>
            ) : (
                <div>No lawyer found</div>
            )}
        </div>
    );
};

export default LawyerDetailsPage;
