import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Tag, User, AlertCircle, Info, Calendar } from 'lucide-react';
import axios from 'axios';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/news/');
      setNews(response.data.news || response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'announcement':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'news':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'policy':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'announcement':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'news':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'policy':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'event':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredNews = news.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const categories = [
    { value: 'all', label: 'All News', count: news.length },
    { value: 'announcement', label: 'Announcements', count: news.filter(n => n.category === 'announcement').length },
    { value: 'news', label: 'News', count: news.filter(n => n.category === 'news').length },
    { value: 'policy', label: 'Policies', count: news.filter(n => n.category === 'policy').length },
    { value: 'event', label: 'Events', count: news.filter(n => n.category === 'event').length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-black">News & Announcements</h1>
          <p className="text-gray-600">Stay updated with the latest company news and important announcements</p>
        </div>
        <FileText className="h-8 w-8 text-blue-600" />
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Tag className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-black">Filter News</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setFilter(category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* News Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredNews.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedNews(item)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(item.category)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {getPriorityIcon(item.priority)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
              {item.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {item.summary || item.content.substring(0, 120) + '...'}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(item.publishedAt)}</span>
              </div>
              {item.createdBy && (
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{item.createdBy.name || 'Admin'}</span>
                </div>
              )}
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* News Detail Modal */}
      {selectedNews && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedNews(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(selectedNews.category)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(selectedNews.category)}`}>
                    {selectedNews.category.charAt(0).toUpperCase() + selectedNews.category.slice(1)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <h2 className="text-xl font-bold text-black mb-4">
                {selectedNews.title}
              </h2>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(selectedNews.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getPriorityIcon(selectedNews.priority)}
                  <span>{selectedNews.priority.charAt(0).toUpperCase() + selectedNews.priority.slice(1)} Priority</span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                {selectedNews.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>

              {selectedNews.tags && selectedNews.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedNews.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default News; 