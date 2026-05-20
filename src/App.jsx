import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: 28, left: 28, zIndex: 1000,
        width: 44, height: 44, borderRadius: '50%',
        background: '#e8002d', color: 'white', border: 'none',
        fontSize: 20, cursor: 'pointer', boxShadow: '0 4px 16px rgba(232,0,45,0.4)',
        opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.25s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      aria-label="Back to top"
    >↑</button>
  );
}

import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InstallBanner from './components/InstallBanner';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Category from './pages/Category';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user?.isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppInner() {
  const { loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
      🇰🇷
    </div>
  );
  return (
    <>
      <ScrollToTop />
      <BackToTop />
      <Toaster position="bottom-center" />
      <Navbar />
      <main style={{ flex: 1, background: 'var(--bg)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Catalog />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
      <InstallBanner />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <WishlistProvider>
              <ProductsProvider>
                <CartProvider>
                  <AppInner />
                </CartProvider>
              </ProductsProvider>
            </WishlistProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
