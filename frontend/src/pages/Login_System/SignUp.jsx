import { useState, useEffect } from 'react';
import { signUp } from '../../utils/auth';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import signupimg from '../../../public/assets/signup.png';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the AOS CSS

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await signUp(email, password);
            setError('');
            alert("Signup successful!");
        } catch (err) {
            setError("Error: " + err.message);
        }
    };

    // Initialize AOS when the component mounts
    useEffect(() => {
        AOS.init({
            duration: 1000, // Default duration for all animations
            easing: 'ease-out-cubic', // Default easing
        });
    }, []);

    return (
        <div className='bg-gradient-to-t from-red-800/80 to-black shadow-lg w-full h-svh overflow-y-hidden pt-24'>
            <div
                data-aos="flip-right"  // Adding the flip-right animation
                data-aos-easing="ease-out-cubic"
                data-aos-duration="1000"
                className="flex flex-row w-1/2 h-2/3 mx-auto bg-red-950/30 backdrop-blur-sm overflow-hidden rounded-3xl border border-red-200 text-white shadow-lg shadow-red-200"
            >
                
                <div className='mx-auto p-6 w-full m-auto'>
                    <h2 className="text-2xl font-semibold text-center text-red-100 mb-4">Sign Up</h2>
                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-3xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-3xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-3xl bg-red-800 text-white hover:bg-red-300 hover:text-black hover:font-bold hover:scale-105 transition-all ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                        >
                            Sign Up
                        </button>
                    </form>
                    {error && <p className="mt-4 text-center text-red-500">{error}</p>}

                    {/* Go to Login Button */}
                    <div className="mt-4 text-center">
                        <p className="text-sm">Already have an account?</p>
                        <Link
                            to="/login"
                            className="text-red-300 hover:text-red-800 font-semibold"
                        >
                            Log In here
                        </Link>
                    </div>
                </div>

                <div className='flex bg-red-100/10 align-center justify-center w-full'>
                    <img
                        src={signupimg}  // Replace with a real image link
                        alt="Legal Image"
                        className="w-4/6 m-auto rounded-br-4xl rounded-tl-4xl shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
                    />
                </div>
            </div>
        </div>
    );
}

export default SignUp;
