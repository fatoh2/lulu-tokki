import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';

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
import { CartProvider } from './context/CartProvider';
import { ProductsProvider } from './context/ProductsProvider';
import { LanguageProvider } from './context/LanguageProvider';
import { AuthProvider } from './context/AuthProvider';
import { WishlistProvider } from './context/WishlistProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InstallBanner from './components/InstallBanner';
import Home from './pages/Home';

// Route components are code-split — each loads as its own chunk on demand.
const Catalog = lazy(() => import('./pages/Catalog'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Category = lazy(() => import('./pages/Category'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Account = lazy(() => import('./pages/Account'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const Accessibility = lazy(() => import('./pages/Accessibility'));

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
      🇰🇷
    </div>
  );
}

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
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/returns" element={<ReturnPolicy />} />
            <Route path="/accessibility" element={<Accessibility />} />
          </Routes>
        </Suspense>
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
