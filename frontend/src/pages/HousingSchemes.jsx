import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Home, 
  DollarSign, 
  Calendar,
  Users,
  Filter,
  Search
} from 'lucide-react';
import Card from '../components/Card';
import { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { Select } from '../components/Input';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const HousingSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  useEffect(() => {
    filterSchemes();
  }, [schemes, filters]);

  const fetchSchemes = async () => {
    try {
      const response = await api.get('/schemes?available_only=true');
      setSchemes(response.data);
    } catch (error) {
      toast.error('Failed to fetch schemes');
    } finally {
      setLoading(false);
    }
  };

  const filterSchemes = () => {
    let filtered = schemes;

    if (filters.category) {
      filtered = filtered.filter(scheme => scheme.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(scheme =>
        scheme.name.toLowerCase().includes(searchLower) ||
        scheme.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredSchemes(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <PageLoader />;

  const categories = [...new Set(schemes.map(s => s.category))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Housing Schemes</h1>
        <p className="text-gray-600">Explore available housing schemes and find your perfect home</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search schemes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>

            <Button
              variant="secondary"
              onClick={() => setFilters({ category: '', search: '' })}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <EmptyState
          icon="search"
          title="No schemes found"
          description="Try adjusting your filters or search terms"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                <Home className="h-16 w-16 text-primary-300" />
              </div>

              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{scheme.name}</h3>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    {scheme.category}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {scheme.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    ₹{Number(scheme.price).toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    {scheme.available_units} units available
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    Deadline: {new Date(scheme.application_deadline).toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 line-clamp-2">{scheme.eligibility_criteria}</p>
                </div>
              </CardContent>

              <CardFooter>
                <Link to={`/apply/${scheme.id}`} className="w-full">
                  <Button variant="primary" className="w-full" disabled={scheme.available_units === 0}>
                    {scheme.available_units === 0 ? 'No Units Available' : 'Apply Now'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600 mb-1">{schemes.length}</div>
            <div className="text-sm text-gray-600">Total Schemes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-3xl font-bold text-accent-600 mb-1">
              {schemes.reduce((sum, s) => sum + s.available_units, 0)}
            </div>
            <div className="text-sm text-gray-600">Available Units</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HousingSchemes;
