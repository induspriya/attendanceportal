import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Tag, User, AlertCircle, Info, Calendar } from 'lucide-react';
import api from '../api/axios';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNews, setSelectedNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching news...');
      const response = await api.get('/api/news');
      console.log('📡 API Response:', response);
      console.log('📊 Response data:', response.data);
      const newsData = response.data.news || response.data;
      console.log('📝 Setting news data:', newsData);
      setNews(newsData);
    } catch (error) {
      console.error('❌ Error fetching news:', error);
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
    // Category filter
    if (filter !== 'all' && item.category !== filter) return false;
    
    // Priority filter
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(searchLower) ||
        item.summary?.toLowerCase().includes(searchLower) ||
        item.content.toLowerCase().includes(searchLower) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  // Debug logging
  console.log('📋 News state:', { 
    newsLength: news.length, 
    filteredLength: filteredNews.length, 
    loading, 
    filter, 
    priorityFilter 
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

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Tag className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-black">Search & Filter News</h3>
        </div>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search news by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category and Priority Filters */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilter(category.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filter === category.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Priorities', count: news.length },
                { value: 'urgent', label: 'Urgent', count: news.filter(n => n.priority === 'urgent').length },
                { value: 'high', label: 'High', count: news.filter(n => n.priority === 'high').length },
                { value: 'medium', label: 'Medium', count: news.filter(n => n.priority === 'medium').length },
                { value: 'low', label: 'Low', count: news.filter(n => n.priority === 'low').length },
              ].map((priority) => (
                <button
                  key={priority.value}
                  onClick={() => setPriorityFilter(priority.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    priorityFilter === priority.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {priority.label} ({priority.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredNews.length} of {news.length} news items
          </p>
          {/* Debug Info */}
          <div className="mt-2 p-2 bg-yellow-100 rounded text-xs text-yellow-800 border border-yellow-300">
            <p><strong>Debug Info:</strong></p>
            <p>News array length: {news.length}</p>
            <p>Filtered news length: {filteredNews.length}</p>
            <p>Loading: {loading.toString()}</p>
            <p>Filter: {filter}, Priority: {priorityFilter}</p>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading news...</h3>
            <p className="text-gray-500">Please wait while we fetch the latest updates.</p>
          </div>
        </motion.div>
      ) : filteredNews.length > 0 ? (
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
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No news found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'There are no news items available at the moment.'}
            </p>
            {(searchTerm || filter !== 'all' || priorityFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                  setPriorityFilter('all');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </motion.div>
      )}

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