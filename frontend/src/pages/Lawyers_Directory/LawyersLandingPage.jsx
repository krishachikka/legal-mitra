import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LawyersLandingPage = () => {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile_no: '',
        email: '',
        experience: '',
        location: '',
        image: '',
        certificate: null,
        idProof: null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLawyers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/api/v1/lawyers-directory/lawyers');
                const fetchedLawyers = Array.isArray(response.data) ? response.data : [];
                setLawyers(fetchedLawyers);
                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchLawyers();
    }, []);

    const handleConnectClick = (lawyerId) => {
        navigate(`/lawyer-details/${lawyerId}`);
    };

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Construct form data for file upload
        const data = new FormData();
        data.append('name', formData.name);
        data.append('mobile_no', formData.mobile_no);
        data.append('email', formData.email);
        data.append('experience', formData.experience);
        data.append('location', formData.location);
        data.append('image', formData.image); // If an image is provided
        data.append('certificate', formData.certificate);
        data.append('idProof', formData.idProof);

        try {
            const response = await axios.post('http://localhost:3000/api/v1/lawyers-directory/become-a-lawyer', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Lawyer registration successful!');
            setShowModal(false);
        } catch (err) {
            alert('Error submitting form.');
        }
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
            {/* Become a Lawyer Button */}
            <div className="text-center mb-8">
                <button
                    onClick={handleModalToggle}
                    className="bg-green-600 text-white py-2 px-4 rounded"
                >
                    Become a Lawyer
                </button>
            </div>

            {/* Lawyers Directory */}
            <h1 className="text-3xl font-semibold text-center mb-8">Lawyers Directory</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {lawyers.length > 0 ? (
                    lawyers.map((lawyer) => (
                        <div key={lawyer._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <img
                                className="w-full h-48 object-cover"
                                src={lawyer.image}
                                alt={lawyer.name}
                                loading="lazy"
                            />
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 truncate">{lawyer.name}</h2>
                                <p className="text-gray-600 text-sm mb-4">Experience: {lawyer.experience}</p>
                                <button
                                    onClick={() => handleConnectClick(lawyer._id)}
                                    className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
                                >
                                    Connect
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500">No lawyers available at the moment</div>
                )}
            </div>

            {/* Modal for Becoming a Lawyer */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-semibold mb-4">Become a Lawyer</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Mobile No</label>
                                <input
                                    type="text"
                                    name="mobile_no"
                                    value={formData.mobile_no}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Experience</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Upload Certificate</label>
                                <input
                                    type="file"
                                    name="certificate"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Upload ID Proof</label>
                                <input
                                    type="file"
                                    name="idProof"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleModalToggle}
                                    className="bg-gray-400 text-white py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white py-2 px-4 rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LawyersLandingPage;
