import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Clock, ArrowRight, Bell } from 'lucide-react';
import Card from './Card';
import { CardHeader, CardTitle, CardContent } from './Card';
import Button from './Button';
import api from '../services/api';

const NewsAnnouncements = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get('/news');
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNewsTypeColor = (type) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'important':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6 space-y-4">
            <div className="h-6 w-1/3 rounded skeleton"></div>
            <div className="h-4 w-full rounded skeleton"></div>
            <div className="h-4 w-2/3 rounded skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <Megaphone className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No News</h3>
        <p className="text-gray-500">Check back later for updates</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">News & Announcements</h2>
        </div>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <Card key={item.id} className="hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getNewsTypeColor(item.type)}`}>
                    {item.type.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(item.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {item.is_new && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    NEW
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(item.published_at).toLocaleString()}</span>
                </div>
                {item.link && (
                  <Button variant="secondary" size="sm">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsAnnouncements;
