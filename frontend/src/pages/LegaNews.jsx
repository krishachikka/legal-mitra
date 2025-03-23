import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiBell } from 'react-icons/fi'; // Bell Icon for "Recent Updates"
import { AiOutlineSearch } from 'react-icons/ai'; // Search Icon
import { AiOutlineCalendar } from 'react-icons/ai'; // Calendar Icon

const LegalNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch news from Flask API
    axios.get('http://localhost:5000/api/news')
      .then(response => {
        setNews(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // Filter news based on search query
  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-red-500">Something went wrong. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-r from-blue-50 via-green-50 to-blue-100">
      {/* Header and Search Bar */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center space-x-3">
          <FiBell className="text-yellow-500 text-xl transition-transform hover:scale-110" />
          <h1 className="text-2xl font-extrabold text-[#A55B4B] font-poppins tracking-wide leading-tight">
            Recent Legal News Updates
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-lg shadow-md p-2 w-1/3">
          <AiOutlineSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search news..."
            className="w-full p-2 text-sm text-gray-700 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* News Cards */}
      {filteredNews.length === 0 ? (
        <p className="text-center text-gray-500">No news available at the moment. Please check back later.</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-all">
              {/* Image */}
              <div className="relative">
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
                )}
                {/* Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 group-hover:opacity-0 transition-opacity"></div>
                <div className="absolute bottom-4 left-4 text-white text-lg font-semibold group-hover:opacity-100 opacity-0 transition-opacity">
                  <p>New</p>
                </div>
              </div>

              {/* News Content */}
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors ease-in-out duration-300">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                </h2>
                {/* Truncated summary */}
                <p className="text-gray-600 text-sm leading-relaxed"
                   style={{
                     display: '-webkit-box',
                     WebkitBoxOrient: 'vertical',
                     WebkitLineClamp: 3,  // Limit to 3 lines
                     overflow: 'hidden',
                     textOverflow: 'ellipsis'
                   }}
                >
                  {item.summary}
                </p>

                <div className="flex items-center space-x-2 text-gray-500 text-xs">
                  <AiOutlineCalendar className="text-gray-400" />
                  <p>{new Date(item.published).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LegalNews;
