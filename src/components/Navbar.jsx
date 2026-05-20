import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function Navbar() {
  const { totalItems } = useCart();
  const { t, toggleLang } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 15,
    color: isActive(path) ? '#e8002d' : '#374151',
    background: isActive(path) ? '#fff0f2' : 'transparent',
    transition: 'all 0.2s',
  });

  return (
    <nav style={{ background: 'white', borderBottom: '2px solid #e8002d', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🇰🇷</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#e8002d', lineHeight: 1.1 }}>{t('storeName')}</div>
            <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1 }}>Korean Snacks Store</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isMobile && (
            <>
              <Link to="/store" style={navLinkStyle('/store')}>{t('navStore')}</Link>
              <Link
                to="/admin"
                style={{
                  ...navLinkStyle('/admin'),
                  color: isActive('/admin') ? '#003478' : '#6b7280',
                  background: isActive('/admin') ? '#eff6ff' : 'transparent',
                  fontSize: 14,
                  padding: '8px 14px',
                }}
              >
                ⚙️ {t('navAdmin')}
              </Link>
            </>
          )}

          {/* Lang toggle */}
          <button
            onClick={toggleLang}
            style={{ padding: '6px 12px', borderRadius: 8, border: '2px solid #e5e7eb', background: 'white', color: '#374151', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8002d'; e.currentTarget.style.color = '#e8002d'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
          >
            {t('langToggle')}
          </button>

          {/* Cart icon only */}
          <Link
            to="/cart"
            title={t('navCart')}
            style={{
              textDecoration: 'none',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 10,
              color: isActive('/cart') ? 'white' : '#e8002d',
              background: isActive('/cart') ? '#e8002d' : '#fff0f2',
              border: '2px solid #e8002d',
              transition: 'all 0.2s',
              fontSize: 20,
            }}
          >
            🛒
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: -8,
                left: -8,
                background: '#003478',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 800,
                boxShadow: '0 2px 6px rgba(0,52,120,0.4)',
              }}>
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger (mobile only) */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center' }}
              aria-label="Menu"
            >
              <div style={{ width: 22, height: 2, background: '#374151', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
              <div style={{ width: 22, height: 2, background: '#374151', borderRadius: 2, transition: 'opacity 0.25s', opacity: menuOpen ? 0 : 1 }} />
              <div style={{ width: 22, height: 2, background: '#374151', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{ background: 'white', borderTop: '1px solid #f3f4f6', borderBottom: '2px solid #e8002d', padding: '12px 20px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <Link
            to="/store"
            style={{ display: 'block', padding: '12px 0', fontWeight: 700, fontSize: 16, color: isActive('/store') ? '#e8002d' : '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}
          >
            {t('navStore')}
          </Link>
          <Link
            to="/admin"
            style={{ display: 'block', padding: '12px 0', fontWeight: 700, fontSize: 16, color: isActive('/admin') ? '#003478' : '#6b7280', textDecoration: 'none' }}
          >
            ⚙️ {t('navAdmin')}
          </Link>
        </div>
      )}
    </nav>
  );
}
