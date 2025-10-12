import React, { useMemo, useEffect } from 'react';
import type { CartItem } from '../types';
import { XIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from './icons';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(price);
};

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity }) => {
  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        onClose();
       }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full" aria-label="Close cart">
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
              <ShoppingBagIcon className="w-16 h-16 text-gray-300 mb-4"/>
              <h3 className="text-lg font-medium text-gray-800">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4">
              <ul className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <li key={item.id} className="py-4 flex">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Unit Price: {formatPrice(item.price)}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-100 rounded-l-md" aria-label={`Decrease quantity of ${item.name}`}><MinusIcon className="h-4 w-4"/></button>
                          <span className="px-3 py-1 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-100 rounded-r-md" aria-label={`Increase quantity of ${item.name}`}><PlusIcon className="h-4 w-4"/></button>
                        </div>
                        <div className="flex">
                          <button type="button" onClick={() => onUpdateQuantity(item.id, 0)} className="font-medium text-red-600 hover:text-red-800 flex items-center" aria-label={`Remove ${item.name} from cart`}>
                            <TrashIcon className="h-4 w-4 mr-1"/> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>{formatPrice(subtotal)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6">
                <button
                  onClick={() => alert('Checkout functionality not yet implemented.')}
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700"
                >
                  Checkout
                </button>
              </div>
              <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or{' '}
                  <button type="button" className="font-medium text-green-600 hover:text-green-500" onClick={onClose}>
                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
