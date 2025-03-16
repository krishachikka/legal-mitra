import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Custom hook for fetching news
const useLegalArticles = (category) => {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const keywords = [
        'legal', 'law', 'attorney', 'court', 'judge', 'litigation', 'lawsuit',
        'jurisprudence', 'legalization', 'defendant', 'plaintiff', 'trial',
        'defense', 'prosecution', 'contract', 'settlement', 'verdict', 'laws',
        'courtroom', 'lawyer'
    ];

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_NEWS_API_URL}/${category}/in.json`
                );
                setArticles(response.data.articles);
                setFilteredArticles(filterLegalArticles(response.data.articles));
            } catch (err) {
                setError("Failed to fetch articles");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [category]);

    const filterLegalArticles = (articles) => {
        return articles.filter((article) => {
            const text = (article.title + ' ' + article.description).toLowerCase();
            return keywords.some((word) => text.includes(word.toLowerCase()));
        });
    };

    return { articles, filteredArticles, loading, error };
};

const LegalNews = () => {
    const [category, setCategory] = useState('business');
    const { filteredArticles, loading, error } = useLegalArticles(category);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    if (loading) {
        return (
            <div className="text-center text-lg">
                <div className="spinner"></div> {/* Add a spinner here if needed */}
                Loading...
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-600">{error}</p>;
    }

    return (
        <div>
            {/* Category Dropdown */}
            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Select Category</label>
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="mt-2 p-2 border rounded-md w-full"
                >
                    <option value="business">Business</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="general">General</option>
                    <option value="health">Health</option>
                    <option value="science">Science</option>
                    <option value="sports">Sports</option>
                    <option value="technology">Technology</option>
                </select>
            </div>

            {/* Display filtered articles with fade-in effect */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ${loading ? "fade-in" : ""}`}>
                {filteredArticles.map((article, index) => (
                    <div
                        className="max-w-sm rounded-lg shadow-lg bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        key={index}
                    >
                        <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">{article.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{article.description}</p>
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                            >
                                Read more
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LegalNews;
