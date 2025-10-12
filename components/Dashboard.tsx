import React from 'react';
import type { Product } from '../types';
import ProductGrid from './ProductGrid';
import { PlusIcon } from './icons';

interface DashboardProps {
  currentUser: { name: string } | null;
  userProducts: Product[];
  onAddNewProductClick: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, userProducts, onAddNewProductClick, onSelectProduct, onAddToCart }) => {
  return (
    <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 sm:pb-12 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Welcome, {currentUser?.name || 'Seller'}!
          </h1>
          <p className="mt-2 max-w-2xl text-base sm:text-lg text-gray-500">
            Manage your products, view your sales, and grow your business.
          </p>
        </div>
        <button
          onClick={onAddNewProductClick}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Product
        </button>
      </div>
      
      <div className="mt-8 sm:mt-12">
        <h2 className="text-2xl font-bold text-gray-800">Your Products</h2>
        <div className="mt-6">
          <ProductGrid 
            products={userProducts}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart} 
          />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
