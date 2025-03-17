import React from 'react';
import logo from '../../public/assets/legalmitra_black.png';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 text-white">
            {/* Hero Section */}
            <section className="flex items-center justify-between p-20 bg-gradient-to-r from-blue-800 to-blue-600">
                {/* Left Side Text */}
                <div className="w-1/2">
                    <h1 className="text-6xl font-serif font-extrabold mb-6 text-yellow-400">Your Trusted Legal Partner</h1>
                    <p className="mb-6 text-lg text-gray-300">
                        Our legal experts are here to help you protect your rights with personalized advice and guidance throughout your legal journey.
                    </p>
                    <button
                        onClick={() => navigate('/legal-chat')}
                        className="px-10 py-4 bg-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transform transition-all duration-300 ease-in-out hover:scale-105"
                    >
                        Get Started Today
                    </button>
                </div>

                {/* Right Side Image */}
                <div className="w-1/2">
                    <img
                        src={logo}  // Replace with a real image link
                        alt="Legal Image"
                        className="w-full h-auto rounded-lg shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
                    />
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-gray-800">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-serif font-bold text-yellow-400 mb-6">About Us</h2>
                    <p className="text-lg text-gray-300 mb-8">
                        With a team of experienced legal professionals, we offer high-quality legal services that are tailored to your needs. We strive to make your legal experience as seamless and stress-free as possible.
                    </p>
                    <p className="text-lg text-gray-300 mb-6">
                        Whether you need help with personal legal matters, business law, or estate planning, we are here to guide you every step of the way.
                    </p>
                    <button className="px-10 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-500 transform transition-all duration-300 ease-in-out hover:scale-105">
                        Learn More About Us
                    </button>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-gray-700">
                <h2 className="text-4xl font-serif font-bold text-center text-yellow-400 mb-10">Our Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {/* Service 1 */}
                    <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Legal Consultation</h3>
                        <p className="text-gray-600">
                            Our expert attorneys provide personalized legal advice to help you navigate through both personal and business-related legal matters.
                        </p>
                    </div>
                    {/* Service 2 */}
                    <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Contract Drafting</h3>
                        <p className="text-gray-600">
                            We help you draft clear, legally binding contracts that safeguard your interests and ensure all critical legal details are addressed.
                        </p>
                    </div>
                    {/* Service 3 */}
                    <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Litigation Support</h3>
                        <p className="text-gray-600">
                            Our team provides expert representation and support throughout the litigation process to ensure your best interests are protected.
                        </p>
                    </div>
                    {/* Service 4 */}
                    <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Estate Planning</h3>
                        <p className="text-gray-600">
                            Plan for the future with our comprehensive estate planning services, including wills, trusts, and more to protect your assets.
                        </p>
                    </div>
                    {/* Service 5 */}
                    <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Business Law</h3>
                        <p className="text-gray-600">
                            From startups to established companies, we provide legal services to help your business navigate complexities and remain compliant.
                        </p>
                    </div>
                    {/* Service 6 */}
                    <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Family Law</h3>
                        <p className="text-gray-600">
                            We offer compassionate and expert legal assistance in family law matters, including divorce, child custody, and adoption.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-serif font-bold text-yellow-400 mb-10">What Our Clients Say</h2>
                    <div className="flex justify-between space-x-8">
                        <div className="bg-white p-8 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105">
                            <p className="text-lg text-gray-700 mb-4">
                                "The team was fantastic! They helped me through a difficult legal situation with professionalism and care. Highly recommend!"
                            </p>
                            <p className="font-semibold text-gray-800">Sarah J.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105">
                            <p className="text-lg text-gray-700 mb-4">
                                "I couldn't have asked for a better legal team. They were knowledgeable, reliable, and always had my best interests at heart."
                            </p>
                            <p className="font-semibold text-gray-800">David P.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-serif font-bold mb-6">Get In Touch</h2>
                    <p className="text-lg mb-6">
                        Have questions or need help with a legal matter? Contact us today to schedule a consultation, and we'll be happy to assist.
                    </p>
                    <button className="px-10 py-3 bg-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transform transition-all duration-300 ease-in-out hover:scale-105">
                        Contact Us
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
