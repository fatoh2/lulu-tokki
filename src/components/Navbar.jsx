import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: 'white', borderBottom: '2px solid #e8002d', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🇰🇷</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#e8002d', lineHeight: 1.1 }}>هانوك سناكس</div>
            <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1 }}>Korean Snacks Store</div>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              color: isActive('/') ? '#e8002d' : '#374151',
              background: isActive('/') ? '#fff0f2' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            المتجر
          </Link>
          <Link
            to="/admin"
            style={{
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              color: isActive('/admin') ? '#003478' : '#6b7280',
              background: isActive('/admin') ? '#eff6ff' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            ⚙️ الإدارة
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            style={{
              textDecoration: 'none',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              color: isActive('/cart') ? 'white' : '#e8002d',
              background: isActive('/cart') ? '#e8002d' : '#fff0f2',
              border: '2px solid #e8002d',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 18 }}>🛒</span>
            <span>السلة</span>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: -8,
                left: -8,
                background: '#003478',
                color: 'white',
                borderRadius: '50%',
                width: 22,
                height: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800,
                boxShadow: '0 2px 6px rgba(0,52,120,0.4)',
              }}>
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
