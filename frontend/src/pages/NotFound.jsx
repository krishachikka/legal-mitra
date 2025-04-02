// src/components/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-3xl border border-red-900">
                <h1 className="text-4xl font-semibold text-center text-red-900 mb-4">404 - Page Not Found</h1>
                <p className="text-center text-lg mb-4">Oops! The page you're looking for doesn't exist.</p>
                <Link
                    to="/"
                    className="w-full py-3 text-center rounded-xl bg-red-900 text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-900"
                >
                    Go Back to Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
