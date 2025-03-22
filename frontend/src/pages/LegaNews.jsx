import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiBell } from 'react-icons/fi'; // Bell Icon for "Recent Updates"
import { FaRegNewspaper } from 'react-icons/fa'; // News Icon for individual news
import { AiOutlineCalendar } from 'react-icons/ai'; // Calendar Icon

const LegalNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Function to truncate the summary text to 2-3 lines
  const truncateSummary = (summary) => {
    const maxLength = 150; // Adjust the max length for summary truncation
    if (summary.length > maxLength) {
      return summary.substring(0, maxLength) + '...';
    }
    return summary;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      {/* Title with Bell Icon */}
      <div className="flex items-center justify-center mb-12 space-x-3">
        <FiBell className="text-yellow-500 text-3xl" /> {/* Recent Updates Bell Icon in Yellow */}
        <h1 className="text-3xl font-semibold text-gray-800">Recent Legal News Updates</h1>
      </div>

      {news.length === 0 ? (
        <p className="text-center text-gray-500">No news available at the moment. Please check back later.</p>
      ) : (
        <div className="space-y-8">
          {news.map((item, index) => (
            <div key={index} className="flex bg-white shadow-lg rounded-lg overflow-hidden border-t-4 border-red-600">
              {/* Circular Icon for News */}
              <div className="flex-shrink-0 flex items-center justify-center bg-red-600 w-16 h-16 rounded-full mr-6">
                <FaRegNewspaper className="text-white text-2xl" /> {/* Red News Icon */}
              </div>

              {/* News Content */}
              <div className="flex-grow p-6">
                <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                </h2>
                <p className="text-gray-600 mt-4 text-sm">{truncateSummary(item.summary)}</p>
                <div className="flex items-center mt-4">
                  <AiOutlineCalendar className="text-gray-400 text-xs mr-2" />
                  <p className="text-gray-400 text-xs">{new Date(item.published).toLocaleDateString()}</p>
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
