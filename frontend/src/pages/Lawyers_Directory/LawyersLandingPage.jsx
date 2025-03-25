import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LawyersLandingPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/v1/lawyers-directory/lawyers');
        const fetchedLawyers = Array.isArray(response.data.data) ? response.data.data : [];
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
    navigate(`/lawyer-directory/${lawyerId}`);
  };

  const handleJoinLawyerClick = () => {
    navigate('/lawyers-form');
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
    <div className="relative flex flex-col min-h-screen bg-[#fbfaf8] font-[Public Sans], sans-serif">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#f3ece8] px-10 py-8">
        <div className="flex items-center gap-4 text-[#1b130e]"></div>
        <div className="flex gap-4">
          <button
            onClick={handleJoinLawyerClick}
            className="flex items-center justify-center px-4 py-3 rounded-xl bg-[#e36c1c] text-[#fbfaf8] text-sm font-bold"
          >
            Join LegalMitra as a Lawyer
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-40 py-5">
        <div className="max-w-[960px] mx-auto">
          <h1 className="text-4xl font-black text-[#1b130e] mb-4">Find a Lawyer</h1>

          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="What type of lawyer do you need?"
              className="w-full h-14 p-4 rounded-xl bg-[#f3ece8] text-[#1b130e] placeholder-[#966c4f] border-none"
            />
          </div>

          {/* Featured Lawyers */}
          <h3 className="text-lg font-bold text-[#1b130e] mb-4">Featured Lawyers</h3>
          <div className="space-y-4">
            {lawyers.map((lawyer) => (
              <div key={lawyer._id} className="flex items-center justify-between bg-[#fbfaf8] p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <div
                    className="w-14 h-14 bg-cover rounded-full"
                    style={{ backgroundImage: `url(${lawyer.profilePhoto})` }}
                  ></div>

                  {/* Lawyer Info */}
                  <div>
                    <h4 className="text-xl font-semibold">{lawyer.name}</h4>
                    <p className="text-sm text-[#9b9b9b]">{lawyer.email}</p>
                  </div>
                </div>

                {/* Connect Button */}
                <button
                  onClick={() => handleConnectClick(lawyer._id)}
                  className="px-6 py-2 bg-[#e36c1c] text-white rounded-full font-semibold"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyersLandingPage;
