import React from 'react';
import { ProductCategory } from '../types';
import { SearchIcon } from './icons';

interface FilterBarProps {
  categories: (ProductCategory | 'All')[];
  activeCategory: ProductCategory | 'All';
  setActiveCategory: (category: ProductCategory | 'All') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, activeCategory, setActiveCategory, searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm py-2 sticky top-16 z-30 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-green-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;