import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit, Trash2, Filter, Eye, Calendar, User, X } from 'lucide-react';
import api from '../api/axios';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNews, setSelectedNews] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'announcement',
    priority: 'medium',
    tags: '',
    expiresAt: ''
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      console.log('🔍 Admin: Fetching news...');
      const response = await api.get('/api/news');
      console.log('📡 Admin API Response:', response);
      console.log('📊 Admin Response data:', response.data);
      const newsData = response.data.news || response.data;
      console.log('📝 Admin Setting news data:', newsData);
      setNews(newsData);
    } catch (error) {
      console.error('❌ Admin Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newsData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        expiresAt: formData.expiresAt || undefined
      };

      if (editingNews) {
        await api.put(`/api/news/${editingNews._id}`, newsData);
      } else {
        await api.post('/api/news/add', newsData);
      }

      setShowForm(false);
      setEditingNews(null);
      setFormData({
        title: '',
        content: '',
        summary: '',
        category: 'announcement',
        priority: 'medium',
        tags: '',
        expiresAt: ''
      });
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      summary: newsItem.summary || '',
      category: newsItem.category,
      priority: newsItem.priority,
      tags: newsItem.tags ? newsItem.tags.join(', ') : '',
      expiresAt: newsItem.expiresAt ? new Date(newsItem.expiresAt).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await api.delete(`/api/news/${id}`);
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingNews(null);
    setFormData({
      title: '',
      content: '',
      summary: '',
      category: 'announcement',
      priority: 'medium',
      tags: '',
      expiresAt: ''
    });
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'news':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'policy':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'event':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'announcement':
        return 'Announcement';
      case 'news':
        return 'News';
      case 'policy':
        return 'Policy';
      case 'event':
        return 'Event';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredNews = news.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  // Debug logging for admin
  console.log('📋 Admin News state:', { 
    newsLength: news.length, 
    filteredLength: filteredNews.length, 
    loading, 
    filter 
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
          <h1 className="text-2xl font-bold text-black">News Management</h1>
          <p className="text-gray-600">Manage company news, announcements, and important updates</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add News</span>
          </button>
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
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

      {/* News Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-black">All News & Announcements</h3>
          {/* Debug Info */}
          <div className="mt-2 p-2 bg-yellow-100 rounded text-xs text-yellow-800 border border-yellow-300">
            <p><strong>Admin Debug:</strong></p>
            <p>News array length: {news.length}</p>
            <p>Filtered news length: {filteredNews.length}</p>
            <p>Loading: {loading.toString()}</p>
            <p>Filter: {filter}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  News Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNews.length > 0 ? (
                filteredNews.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {item.summary}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {getPriorityLabel(item.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{item.createdBy?.name || 'Admin'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => setSelectedNews(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No news found for the selected filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(selectedNews.category)}`}>
                    {getCategoryLabel(selectedNews.category)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedNews.priority)}`}>
                    {getPriorityLabel(selectedNews.priority)} Priority
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
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedNews.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{selectedNews.createdBy?.name || 'Admin'}</span>
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

      {/* Add/Edit News Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">
                  {editingNews ? 'Edit News' : 'Add News'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter news title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Summary
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter brief summary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter news content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="announcement">Announcement</option>
                      <option value="news">News</option>
                      <option value="policy">Policy</option>
                      <option value="event">Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expires At (Optional)
                  </label>
                  <input
                    type="date"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingNews ? 'Update News' : 'Add News'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminNews; 