import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ProductsProvider>
          <CartProvider>
            <Toaster position="bottom-center" />
            <Navbar />
            <main style={{ flex: 1, background: '#f8f9fb' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/store" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
          </CartProvider>
        </ProductsProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
