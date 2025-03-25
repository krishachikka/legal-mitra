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
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 via-green-50 to-blue-100">
      {/* Header and Search Bar */}
      <div className="flex justify-between items-center mb-12 p-4">
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

      {/* Layout for Left and Right Content */}
      <div className="flex flex-1 space-x-8 px-4 pb-8">
        {/* Left side with Video/Image and Content Below */}
        <div className="w-2/3 flex flex-col space-y-8">
          <div className="relative">
            {filteredNews.length > 0 && filteredNews[0].image && (
              <img src={filteredNews[0].image} alt={filteredNews[0].title} className="w-full h-96 object-cover rounded-lg" />
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30"></div>
            <div className="absolute bottom-4 left-4 text-white text-lg font-semibold">
              <p>{filteredNews.length > 0 && filteredNews[0].title}</p>
            </div>
          </div>
          {/* Below the image/video - Title, Summary, and Other Info */}
          {filteredNews.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800">{filteredNews[0].title}</h2>
              <p className="text-gray-600 text-sm mt-4">{filteredNews[0].summary}</p>
              <div className="flex items-center space-x-2 text-gray-500 text-xs mt-4">
                <AiOutlineCalendar className="text-gray-400" />
                <p>{new Date(filteredNews[0].published).toLocaleDateString()}</p>
              </div>
              {/* Add any "More" or extra content here */}
              <button className="text-blue-500 hover:text-blue-700 mt-4">Read More</button>
            </div>
          )}

          {/* Additional news at the bottom left to fill space (increase to 6 items) */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800">More Recent News</h3>
            <ul className="mt-4 space-y-4">
              {/* Increase the number of news items to be displayed (from 3 to 6 or more) */}
              {filteredNews.slice(1, 7).map((item, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex space-x-4">
                  {/* Image for the additional news item */}
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                    </h4>
                    <p className="text-sm text-gray-600">{item.summary}</p>
                    <div className="flex items-center space-x-2 text-gray-500 text-xs mt-2">
                      <AiOutlineCalendar className="text-gray-400" />
                      <p>{new Date(item.published).toLocaleDateString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right side with Related News (with images) */}
        <div className="w-1/3">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Related News</h2>
          {filteredNews.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-xl mb-6 p-4 hover:shadow-2xl transition-all flex space-x-4">
              {/* Image for the related news item */}
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                </h3>
                <p className="text-sm text-gray-600">{item.summary}</p>
                <div className="flex items-center space-x-2 text-gray-500 text-xs mt-2">
                  <AiOutlineCalendar className="text-gray-400" />
                  <p>{new Date(item.published).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer (if needed for additional content at the bottom) */}
      <div className="bg-gray-800 text-white p-4 mt-8">
        <p className="text-center">© 2025 Legal News, All Rights Reserved</p>
      </div>
    </div>
  );
};

export default LegalNews;
