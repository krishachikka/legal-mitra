import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LawyersLandingPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_NODE_BACKEND_URL}/api/v1/lawyers-directory/lawyers`);
        const fetchedLawyers = Array.isArray(response.data.data) ? response.data.data : [];
        setLawyers(fetchedLawyers);
        setFilteredLawyers(fetchedLawyers); // Set all lawyers initially
        setLoading(false);
      } catch (err) {
        setError('Error fetching data', err);
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  useEffect(() => {
    // Filter lawyers based on search query (location)
    if (searchQuery === '') {
      setFilteredLawyers(lawyers); // Show all lawyers when search query is empty
    } else {
      setFilteredLawyers(
        lawyers.filter((lawyer) => {
          // Ensure location is a string before calling toLowerCase()
          const location = lawyer.location ? lawyer.location.toLowerCase() : '';
          return location.includes(searchQuery.toLowerCase());
        })
      );
    }
  }, [searchQuery, lawyers]);

  const handleConnectClick = (lawyerId) => {
    navigate(`/lawyer-directory/${lawyerId}`);
  };

  const handleJoinLawyerClick = () => {
    navigate('/lawyers-form');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query on input change
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-800"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-red-100/20">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-300 px-10 py-8">
        <div className="flex items-center gap-4 text-black"></div>
        <div className="flex gap-4">
          <button
            onClick={handleJoinLawyerClick}
            className="flex items-center justify-center px-4 py-3 rounded-3xl bg-red-900 text-white text-sm font-bold hover:scale-105 transition-all"
          >
            Join LegalMitra as a Lawyer
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-40 py-5">
        <div className="max-w-[960px] mx-auto">
          <h1 className="text-4xl font-black text-black mb-4">Find a Lawyer</h1>

          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by location..."
              value={searchQuery} // Bind search query value
              onChange={handleSearchChange} // Handle search input change
              className="w-full h-14 p-4 rounded-4xl bg-red-800/10 text-black placeholder-[#966c4f] border-none"
            />
          </div>

          {/* Featured Lawyers */}
          <h3 className="text-lg font-bold text-black mb-4">Featured Lawyers</h3>
          <div className="space-y-4">
            {filteredLawyers.length > 0 ? (
              filteredLawyers.map((lawyer) => (
                <div key={lawyer._id} className="flex items-center justify-between bg-red-950/15 p-4 rounded-lg shadow-lg">
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
                      <p className="text-sm text-black">{lawyer.location}</p> {/* Display location */}
                    </div>
                  </div>

                  {/* Connect Button */}
                  <button
                    onClick={() => handleConnectClick(lawyer._id)}
                    className="px-6 py-2 bg-red-900 text-white rounded-full font-semibold hover:bg-red-800 hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer"
                  >
                    Connect
                  </button>
                </div>
              ))
            ) : (
              <p>No lawyers found for this location</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyersLandingPage;
