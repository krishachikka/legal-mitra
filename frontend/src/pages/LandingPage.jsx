import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChangedListener } from '../utils/auth'; // Assuming you have this utility
import landingpage1 from '/assets/legalmitra_landingpage1.jpeg';

const LandingPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
            setUser(user);
        });
        return () => unsubscribe(); // Cleanup the listener when component unmounts
    }, []);

    const handleButtonClick = () => {
        if (user) {
            // If user is logged in, navigate to /legal-advice
            navigate('/legal-advice');
        } else {
            // If user is not logged in, navigate to /login
            navigate('/login');
        }
    };

    return (
        <div className="bg-gray-900 text-white">
            {/* Hero Section */}
            <section className="flex items-center justify-between p-20 bg-gradient-to-t from-red-800 to-b-red-600">
                {/* Left Side Text */}
                <div className="w-1/2">
                    <h1 className="text-6xl font-extrabold mb-6 text-yellow-100">Your Trusted Legal Partner</h1>
                    <p className="mb-6 text-lg text-gray-300">
                        Our legal experts are here to help you protect your rights with personalized advice and guidance throughout your legal journey.
                    </p>
                    <button
                        onClick={handleButtonClick}
                        className="px-10 py-4 bg-yellow-100 text-black font-semibold rounded-4xl shadow-lg hover:bg-yellow-400 transform transition-all duration-300 ease-in-out hover:scale-105"
                    >
                        Get Started Today
                    </button>
                </div>

                {/* Right Side Image */}
                <div className="w-1/2">
                    <img
                        src={landingpage1}  // Replace with a real image link
                        alt="Legal Image"
                        className="w-3/5 m-auto rounded-br-4xl rounded-tl-4xl shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
                    />
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-yellow-100">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-black mb-6">About Us</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        With a team of experienced legal professionals, we offer high-quality legal services that are tailored to your needs. We strive to make your legal experience as seamless and stress-free as possible.
                    </p>
                    <p className="text-lg text-gray-700 mb-6">
                        Whether you need help with personal legal matters, business law, or estate planning, we are here to guide you every step of the way.
                    </p>
                    <button className="px-10 py-3 bg-red-900 text-white font-semibold rounded-3xl shadow-lg hover:bg-red-800 transform transition-all duration-300 ease-in-out hover:scale-105">
                        Learn More About Us
                    </button>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-gradient-to-t from-gray-700 to-b-black">
                <h2 className="text-4xl font-bold text-center text-yellow-100 mb-10">Our Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {/* Service 1 */}
                    <div className="m-4 bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Legal Consultation</h3>
                        <p className="text-gray-600">
                            Our expert attorneys provide personalized legal advice to help you navigate through both personal and business-related legal matters.
                        </p>
                    </div>
                    {/* Service 2 */}
                    <div className="m-4 bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Contract Drafting</h3>
                        <p className="text-gray-600">
                            We help you draft clear, legally binding contracts that safeguard your interests and ensure all critical legal details are addressed.
                        </p>
                    </div>
                    {/* Service 3 */}
                    <div className="m-4 bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Litigation Support</h3>
                        <p className="text-gray-600">
                            Our team provides expert representation and support throughout the litigation process to ensure your best interests are protected.
                        </p>
                    </div>
                    {/* Service 4 */}
                    <div className="m-4 bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Estate Planning</h3>
                        <p className="text-gray-600">
                            Plan for the future with our comprehensive estate planning services, including wills, trusts, and more to protect your assets.
                        </p>
                    </div>
                    {/* Service 5 */}
                    <div className="m-4 bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Business Law</h3>
                        <p className="text-gray-600">
                            From startups to established companies, we provide legal services to help your business navigate complexities and remain compliant.
                        </p>
                    </div>
                    {/* Service 6 */}
                    <div className="m-4 bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Family Law</h3>
                        <p className="text-gray-600">
                            We offer compassionate and expert legal assistance in family law matters, including divorce, child custody, and adoption.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gradient-to-b from-gray-700 to-t-black">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-red-200 mb-10">What Our Clients Say</h2>
                    <div className="flex justify-between space-x-8">
                        <div className="bg-red-100 p-8 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105">
                            <p className="text-lg text-gray-700 mb-4">
                                "The team was fantastic! They helped me through a difficult legal situation with professionalism and care. Highly recommend!"
                            </p>
                            <p className="font-semibold text-gray-800">Sarah J.</p>
                        </div>
                        <div className="bg-red-100 p-8 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105">
                            <p className="text-lg text-gray-700 mb-4">
                                "I couldn't have asked for a better legal team. They were knowledgeable, reliable, and always had my best interests at heart."
                            </p>
                            <p className="font-semibold text-gray-800">David P.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-gradient-to-t from-red-800 to-b-red-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
                    <p className="text-lg mb-6">
                        Have questions or need help with a legal matter? Contact us today to schedule a consultation, and we'll be happy to assist.
                    </p>
                    <button className="px-10 py-3 bg-red-100 text-black font-semibold rounded-4xl shadow-lg hover:bg-red-200 transform transition-all duration-300 ease-in-out hover:scale-105">
                        Contact Us
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
