import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  MapPin,
  DollarSign,
  Home,
  Calendar
} from 'lucide-react';
import Card from '../components/Card';
import { CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const SchemeManagement = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    total_units: '',
    available_units: '',
    category: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await api.get('/schemes');
      setSchemes(response.data);
    } catch (error) {
      toast.error('Failed to fetch schemes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingScheme) {
        await api.put(`/schemes/${editingScheme.id}`, formData);
        toast.success('Scheme updated successfully');
      } else {
        await api.post('/schemes', formData);
        toast.success('Scheme created successfully');
      }
      setIsModalOpen(false);
      setEditingScheme(null);
      resetForm();
      fetchSchemes();
    } catch (error) {
      toast.error('Failed to save scheme');
    }
  };

  const handleEdit = (scheme) => {
    setEditingScheme(scheme);
    setFormData({
      name: scheme.name,
      description: scheme.description,
      location: scheme.location,
      price: scheme.price,
      total_units: scheme.total_units,
      available_units: scheme.available_units,
      category: scheme.category,
      start_date: scheme.start_date,
      end_date: scheme.end_date,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (schemeId) => {
    if (!confirm('Are you sure you want to delete this scheme?')) return;
    
    try {
      await api.delete(`/schemes/${schemeId}`);
      toast.success('Scheme deleted successfully');
      fetchSchemes();
    } catch (error) {
      toast.error('Failed to delete scheme');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      price: '',
      total_units: '',
      available_units: '',
      category: '',
      start_date: '',
      end_date: '',
    });
  };

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || scheme.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scheme Management</h1>
          <p className="text-gray-600">Create and manage housing schemes</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Scheme
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schemes List */}
      {filteredSchemes.length === 0 ? (
        <EmptyState
          icon="file"
          title="No schemes found"
          description="Create a new housing scheme to get started"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scheme.status === 'active' ? 'bg-green-100 text-green-700' :
                    scheme.status === 'closed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {scheme.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{scheme.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{scheme.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {scheme.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    ₹{Number(scheme.price).toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Home className="h-4 w-4 mr-2" />
                    {scheme.available_units} / {scheme.total_units} units available
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(scheme.start_date).toLocaleDateString()} - {new Date(scheme.end_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(scheme)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(scheme.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingScheme(null);
          resetForm();
        }}
        title={editingScheme ? 'Edit Scheme' : 'Create New Scheme'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Scheme Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter scheme name"
            required
          />
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter scheme description"
            required
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            required
          />
          <Input
            label="Price (₹)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Units"
              name="total_units"
              type="number"
              value={formData.total_units}
              onChange={handleChange}
              placeholder="Total units"
              required
            />
            <Input
              label="Available Units"
              name="available_units"
              type="number"
              value={formData.available_units}
              onChange={handleChange}
              placeholder="Available units"
              required
            />
          </div>
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., EWS, LIG, MIG, HIG"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
            <Input
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingScheme(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingScheme ? 'Update Scheme' : 'Create Scheme'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchemeManagement;
