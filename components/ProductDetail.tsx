import React from 'react';
import type { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const categoryColorMap: { [key: string]: string } = {
    'Food & Drink': 'bg-amber-100 text-amber-800',
    'Handcrafts': 'bg-sky-100 text-sky-800',
    'Apparel': 'bg-purple-100 text-purple-800',
    'Art': 'bg-rose-100 text-rose-800',
  };

  return (
    <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <button 
          onClick={onBack} 
          className="text-sm font-medium text-green-600 hover:text-green-800"
        >
          &larr; Back to market
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img 
            src={product.imageUrl.replace('/400/300', '/800/600')} // Request a larger image
            alt={product.name}
            className="w-full h-auto object-contain rounded-lg aspect-square"
          />
        </div>
        <div className="flex flex-col">
          <span className={`self-start text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColorMap[product.category] || 'bg-gray-100 text-gray-800'}`}>
            {product.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
          <p className="text-md text-gray-500 mt-2">
            Sold by <span className="font-medium text-gray-700">{product.seller}</span>
          </p>
          <p className="text-4xl font-bold text-green-600 my-4">{formatPrice(product.price)}</p>
          
          <div className="prose max-w-none text-gray-600">
            <p>{product.description}</p>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
