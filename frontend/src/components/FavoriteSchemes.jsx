import React, { useState, useEffect } from 'react';
import { Heart, HeartOff, MapPin, DollarSign, Users, Calendar, Building2 } from 'lucide-react';
import Card from './Card';
import { CardHeader, CardTitle, CardContent } from './Card';
import Button from './Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const FavoriteSchemes = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/schemes/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (schemeId) => {
    try {
      await api.post(`/schemes/${schemeId}/favorite`);
      setFavorites(prev => prev.filter(s => s.id !== schemeId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6 space-y-4">
            <div className="h-48 bg-gray-200 rounded-xl skeleton"></div>
            <div className="h-6 w-3/4 rounded skeleton"></div>
            <div className="h-4 w-1/2 rounded skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <HeartOff className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Favorite Schemes</h3>
        <p className="text-gray-500 mb-6">Start by adding schemes to your favorites</p>
        <Button onClick={() => window.location.href = '/schemes'} variant="primary">
          Browse Schemes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Favorite Schemes</h2>
        <span className="text-sm text-gray-500">{favorites.length} schemes saved</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((scheme) => (
          <Card key={scheme.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-2xl flex items-center justify-center">
                <Building2 className="h-16 w-16 text-blue-600" />
              </div>
              <button
                onClick={() => toggleFavorite(scheme.id)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              </button>
            </div>

            <CardContent className="pt-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{scheme.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{scheme.description}</p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{scheme.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span>₹{Number(scheme.price).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{scheme.total_units} units</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {new Date(scheme.application_deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full mt-4"
                onClick={() => window.location.href = `/schemes/${scheme.id}`}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoriteSchemes;
