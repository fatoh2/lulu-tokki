import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <ProductsProvider>
      <CartProvider>
        <Toaster position="top-center" />
        <Navbar />
        <main style={{ flex: 1, background: '#f8f9fb' }}>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer style={{
          background: 'white',
          borderTop: '2px solid #e8002d',
          padding: '24px 20px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: 14,
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#e8002d', marginBottom: 6 }}>
              🇰🇷 هانوك سناكس
            </div>
            <div>جميع الحقوق محفوظة © {new Date().getFullYear()}</div>
          </div>
        </footer>
      </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
}
