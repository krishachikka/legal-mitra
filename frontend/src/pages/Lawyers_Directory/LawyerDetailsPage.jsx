import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To get the dynamic parameter from the route

const LawyerDetailsPage = () => {
    const [lawyer, setLawyer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [review, setReview] = useState('');
    const [reviews, setReviews] = useState([]);
    const { lawyerId } = useParams(); // Get the lawyerId from the route parameters

    useEffect(() => {
        const fetchLawyerDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/v1/lawyers-directory/lawyers/${lawyerId}`);
                setLawyer(response.data);
                setReviews(response.data.reviews || []); // Assuming reviews are stored as an array
                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchLawyerDetails();
    }, [lawyerId]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (review.trim() === '') return;

        const newReview = {
            reviewText: review,
            rating: 5, // Can change based on user input or dropdown
            reviewer: 'Anonymous', // Ideally, this should come from the logged-in user
            createdAt: new Date().toISOString(),
        };

        // Add the review to the current list of reviews
        setReviews([...reviews, newReview]);

        // Send the review to the server (ensure your backend supports adding reviews)
        try {
            await axios.post(`http://localhost:3000/api/v1/lawyers-directory/lawyer/${lawyerId}/add-review`, newReview);
            setReview('');
        } catch (err) {
            console.error("Error submitting review:", err);
            setError('Error submitting review');
        }
    };

    const handleContactClick = () => {
        alert('Contact Lawyer Feature - You can add more functionality here');
    };

    const handleConsultationRequest = () => {
        alert('Request Consultation Feature - You can add more functionality here');
    };

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
        <div className="container mx-auto px-4 py-8">
            {lawyer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side: Photo and Name with Rating */}
                    <div className="flex flex-col items-center">
                        <img
                            className="w-48 h-48 object-cover rounded-full mb-4"
                            src={lawyer.image}
                            alt={lawyer.name}
                        />
                        <h1 className="text-3xl font-semibold text-center mb-4">{lawyer.name}</h1>
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold text-yellow-500">{lawyer.ratings}</span>
                            <span className="text-gray-500">/ 5.0</span>
                        </div>
                    </div>

                    {/* Right Side: Lawyer Details */}
                    <div className="flex flex-col space-y-4">
                        <p className="text-lg">Mobile No: {lawyer.mobile_no}</p>
                        <p className="text-lg">Email: {lawyer.email}</p>
                        <p className="text-lg">Experience: {lawyer.experience}</p>
                        <p className="text-lg">Location: {lawyer.location}</p>
                        <p className="text-lg">{lawyer.cases_solved.total_cases} cases solved</p>
                        {/* New Sections */}
                        <p className="text-lg">Specialties: {lawyer.specialties || 'Not Provided'}</p>
                        <p className="text-lg">Languages Spoken: {lawyer.languages || 'Not Provided'}</p>
                        <p className="text-lg">Education: {lawyer.education || 'Not Provided'}</p>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 mt-4">
                            <button
                                onClick={handleContactClick}
                                className="bg-blue-600 text-white py-2 px-4 rounded"
                            >
                                Contact Lawyer
                            </button>
                            <button
                                onClick={handleConsultationRequest}
                                className="bg-green-600 text-white py-2 px-4 rounded"
                            >
                                Request Consultation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Section: Top Cases */}
            {lawyer && lawyer.cases_solved.top_cases.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-medium text-gray-700">Top Cases:</h3>
                    <ul className="text-lg text-gray-600">
                        {lawyer.cases_solved.top_cases.map((caseItem, idx) => (
                            <li key={idx} className="truncate mb-2">
                                {caseItem.case_name} - {caseItem.rating}⭐
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Review Section */}
            <div className="mt-8">
                <h3 className="text-xl font-medium text-gray-700">Add a Review</h3>
                <form onSubmit={handleReviewSubmit} className="mt-4">
                    <textarea
                        name="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        placeholder="Write your review here"
                    ></textarea>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded"
                    >
                        Submit Review
                    </button>
                </form>

                <h3 className="text-xl font-medium text-gray-700 mt-8">Reviews:</h3>
                <ul className="text-lg text-gray-600 mt-4">
                    {reviews.length > 0 ? (
                        reviews.map((rev, idx) => (
                            <li key={idx} className="mb-4">
                                <p className="font-semibold">{rev.reviewer}</p>
                                <p>{rev.reviewText}</p>
                                <p className="text-yellow-500">{rev.rating}⭐</p>
                                <p className="text-sm text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default LawyerDetailsPage;
