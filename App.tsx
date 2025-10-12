import React, { useState, useMemo, useCallback } from 'react';
import type { Product, ProductCategory, CartItem } from './types';
import { CATEGORIES } from './types';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import AddProductModal from './components/AddProductModal';
import FilterBar from './components/FilterBar';
import Dashboard from './components/Dashboard';
import ProductDetail from './components/ProductDetail';
import CartSidebar from './components/CartSidebar';

const INITIAL_PRODUCTS: Product[] = [
    {
      id: '1',
      name: 'Handmade Beaded Zulu Necklace',
      price: 450.00,
      description: 'Stunning, handcrafted Zulu beaded necklace. A vibrant expression of South African heritage and artistry, perfect for special occasions or adding a bold statement to your everyday look. Each piece is unique, reflecting the rich cultural traditions of the Zulu people.',
      imageUrl: 'https://picsum.photos/seed/zulu/400/300',
      seller: 'Africa Crafts Co.',
      category: 'Handcrafts',
    },
    {
      id: '2',
      name: 'Organic Rooibos Tea (200g)',
      price: 85.50,
      description: 'Naturally caffeine-free and rich in antioxidants. Sourced from the pristine Cederberg mountains, this premium quality Rooibos offers a smooth, sweet, and earthy flavour. Enjoy it hot or as a refreshing iced tea.',
      imageUrl: 'https://picsum.photos/seed/tea/400/300',
      seller: 'Cape Herbal',
      category: 'Food & Drink',
    },
    {
      id: '3',
      name: 'Original Biltong Slices (150g)',
      price: 120.00,
      description: 'Authentic, air-dried cured meat, seasoned with traditional spices like coriander and black pepper. The perfect high-protein snack for any time of day. Made from the finest cuts of South African beef.',
      imageUrl: 'https://picsum.photos/seed/biltong/400/300',
      seller: 'Karoo Meats',
      category: 'Food & Drink',
    },
    {
      id: '4',
      name: 'Shweshwe Fabric Cushion Cover',
      price: 295.00,
      description: 'Brighten up your home with this durable and iconic cushion cover made from 100% cotton Three Cats Shweshwe fabric. Features a vibrant, traditional print that adds a touch of Mzansi charm to any living space.',
      imageUrl: 'https://picsum.photos/seed/fabric/400/300',
      seller: 'Mzansi Decor',
      category: 'Handcrafts',
    },
    {
      id: '5',
      name: 'Protea Watercolour Print',
      price: 750.00,
      description: 'A beautiful A3 giclée print of a King Protea, South Africa\'s national flower. Printed on archival quality paper, this stunning watercolour artwork adds a touch of natural elegance to any room.',
      imageUrl: 'https://picsum.photos/seed/protea/400/300',
      seller: 'Fynbos Fine Art',
      category: 'Art',
    },
    {
        id: '6',
        name: 'Springbok Supporter T-Shirt',
        price: 350.00,
        description: 'Show your pride with this comfortable cotton t-shirt in the iconic green and gold. Features a high-quality print of the Springbok logo. Perfect for game day or any day. Bokke forever!',
        imageUrl: 'https://picsum.photos/seed/bokke/400/300',
        seller: 'SA Sportswear',
        category: 'Apparel',
      }
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string } | null>(null);
  const [currentView, setCurrentView] = useState<'market' | 'dashboard'>('market');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigateToMarket = () => {
    setCurrentView('market');
    setSelectedProduct(null);
  }
  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProduct(null);
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentUser({ name: 'SME Owner' });
    navigateToDashboard();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigateToMarket();
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'seller'>) => {
    const newProduct: Product = {
      id: new Date().toISOString(),
      seller: currentUser?.name || 'My Awesome SME',
      ...newProductData,
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };
  
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = useCallback((productToAdd: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...productToAdd, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const marketProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, activeCategory]);

  const userProducts = useMemo(() => {
    if (!currentUser) return [];
    return products.filter(product => product.seller === currentUser.name);
  }, [products, currentUser]);
  
  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const renderContent = () => {
    if (selectedProduct) {
      return (
        <ProductDetail 
          product={selectedProduct} 
          onAddToCart={handleAddToCart}
          onBack={() => setSelectedProduct(null)} 
        />
      );
    }
    
    if (currentView === 'dashboard') {
      return (
        <Dashboard
          currentUser={currentUser}
          userProducts={userProducts}
          onAddNewProductClick={() => setIsModalOpen(true)}
          onSelectProduct={handleSelectProduct}
          onAddToCart={handleAddToCart}
        />
      );
    }

    return (
      <>
        <FilterBar 
          categories={['All', ...CATEGORIES]}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center pb-8 sm:pb-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Discover Mzansi's Finest
            </h1>
            <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-500">
              Your one-stop marketplace for unique goods from South Africa's best small businesses.
            </p>
          </div>
          <ProductGrid 
            products={marketProducts} 
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        </main>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onNavigateHome={navigateToMarket}
        onNavigateToDashboard={navigateToDashboard}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={cartItemCount}
      />
      {renderContent()}
      <AddProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProduct}
      />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
      />
    </div>
  );
};

export default App;
