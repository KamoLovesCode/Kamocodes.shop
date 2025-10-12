import React from 'react';
import { StoreIcon, PlusIcon, GoogleIcon, ShoppingBagIcon } from './icons';

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigateToDashboard: () => void;
  isLoggedIn: boolean;
  currentUser: { name: string } | null;
  onLogin: () => void;
  onLogout: () => void;
  onCartClick: () => void;
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavigateHome, 
  onNavigateToDashboard, 
  isLoggedIn, 
  currentUser, 
  onLogin, 
  onLogout,
  onCartClick,
  cartItemCount
}) => {
  const handleSellClick = () => {
    if (isLoggedIn) {
      onNavigateToDashboard();
    } else {
      onLogin();
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={onNavigateHome} className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-md" aria-label="Go to homepage">
            <StoreIcon className="h-8 w-8 text-green-600" />
            <span className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
              <span className="hidden sm:inline">KAMOCODES SHOP</span>
              <span className="sm:hidden">KAMO SHOP</span>
            </span>
          </button>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handleSellClick}
              className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-full sm:rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              aria-label="Sell your goods"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="hidden sm:inline sm:ml-2">Sell Your Goods</span>
            </button>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isLoggedIn && currentUser ? (
                <>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 whitespace-nowrap">
                    Welcome, {currentUser.name}
                  </span>
                  <button 
                    onClick={onLogout}
                    className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
                    aria-label="Log Out"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={onLogin}
                    className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
                    aria-label="Log In"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => console.log('Sign up with Google clicked')}
                    className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 border border-gray-300 text-sm font-medium rounded-full sm:rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    aria-label="Sign up with Google"
                  >
                    <GoogleIcon className="h-5 w-5" />
                    <span className="hidden sm:inline sm:ml-2 whitespace-nowrap">Sign Up with Google</span>
                  </button>
                </>
              )}
            </div>

            <div className="border-l border-gray-300 h-6 mx-2"></div>

            <button onClick={onCartClick} className="relative p-2 text-gray-600 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-full" aria-label={`View shopping cart with ${cartItemCount} items`}>
              <ShoppingBagIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
