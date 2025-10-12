import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct, onAddToCart }) => {
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
  
  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group flex flex-col cursor-pointer"
      onClick={() => onSelectProduct(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelectProduct(product)}
      aria-label={`View details for ${product.name}`}
    >
      <div className="w-full h-40 sm:h-48 overflow-hidden relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-2 right-2 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full ${categoryColorMap[product.category] || 'bg-gray-100 text-gray-800'}`}>
          {product.category}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">by {product.seller}</p>
        <p className="text-sm text-gray-600 mt-2 flex-grow min-h-[40px] line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-green-600">{formatPrice(product.price)}</p>
          <button 
            onClick={handleAddToCartClick} 
            className="px-4 py-2 text-sm font-medium text-green-700 bg-transparent border border-green-700 rounded-md hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
