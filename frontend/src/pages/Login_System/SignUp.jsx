import React, { useState } from 'react';
import { signUp } from '../../utils/auth';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

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

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-3xl border border-red-900">
            <h2 className="text-2xl font-semibold text-center text-red-900 mb-4">Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-900 text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-900"
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
                    className="text-red-900 hover:text-red-800 font-semibold"
                >
                    Log In here
                </Link>
            </div>
        </div>
    );
}

export default SignUp;
