import React, { useState } from 'react';

const SearchFilter = ({ onSearch, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    onSearch(searchTerm, value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    onSearch('', 'all');
  };

  return (
    <div className="search-filter-container">
      <div className="search-section">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => {
                setSearchTerm('');
                onSearch('', selectedCategory);
              }}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-section">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : 
                 category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {(searchTerm || selectedCategory !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="btn-clear-filters"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


export default SearchFilter;