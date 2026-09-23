import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import Button from './Button';
import Input from './Input';

const AdvancedSearch = ({ onSearch, onFilter, filters, availableFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(filters || {});

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm, activeFilters);
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    onSearch('', {});
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== '' && value !== undefined);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6 mb-6">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            />
          </div>
          <Button type="submit" variant="primary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsExpanded(!isExpanded)}
            className={isExpanded ? 'bg-blue-50 text-blue-600' : ''}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {Object.values(activeFilters).filter(v => v).length}
              </span>
            )}
          </Button>
          {hasActiveFilters && (
            <Button type="button" variant="secondary" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {isExpanded && availableFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 slide-up">
            {availableFilters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'range' ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={activeFilters[`${filter.key}_min`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}_min`, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={activeFilters[`${filter.key}_max`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}_max`, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                ) : filter.type === 'date' ? (
                  <input
                    type="date"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={filter.placeholder}
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default AdvancedSearch;
