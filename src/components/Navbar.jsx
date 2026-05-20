import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

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
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const firstName = user?.name?.split(' ')[0] || '';

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isMobile && (
            <>
              <Link to="/" style={navLinkStyle('/')}>{t('footerHome')}</Link>
              <Link to="/store" style={navLinkStyle('/store')}>{t('navStore')}</Link>

              {/* User account link */}
              {user ? (
                <>
                  <Link to="/account" style={{ ...navLinkStyle('/account'), display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#e8002d,#003478)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white', fontWeight: 800 }}>
                      {firstName.charAt(0).toUpperCase()}
                    </span>
                    {firstName}
                  </Link>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    style={{ padding: '8px 14px', borderRadius: 8, border: '2px solid #e5e7eb', background: 'white', color: '#6b7280', fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8002d'; e.currentTarget.style.color = '#e8002d'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
                  >
                    {t('signOut')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={navLinkStyle('/login')}>{t('signIn')}</Link>
                  <Link to="/signup" style={{ ...navLinkStyle('/signup'), background: '#e8002d', color: 'white', padding: '8px 16px' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#b5001f'}
                    onMouseLeave={e => e.currentTarget.style.background = '#e8002d'}
                  >{t('signUp')}</Link>
                </>
              )}
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

          {/* Cart */}
          <Link
            to="/cart"
            style={{ textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 10, color: isActive('/cart') ? 'white' : '#e8002d', background: isActive('/cart') ? '#e8002d' : '#fff0f2', border: '2px solid #e8002d', transition: 'all 0.2s', fontSize: 20 }}
          >
            🛒
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: -8, left: -8, background: '#003478', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, boxShadow: '0 2px 6px rgba(0,52,120,0.4)' }}>
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger */}
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
          <Link to="/" style={{ display: 'block', padding: '12px 0', fontWeight: 700, fontSize: 16, color: isActive('/') ? '#e8002d' : '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}>
            {t('footerHome')}
          </Link>
          <Link to="/store" style={{ display: 'block', padding: '12px 0', fontWeight: 700, fontSize: 16, color: isActive('/store') ? '#e8002d' : '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}>
            {t('navStore')}
          </Link>
          {user ? (
            <>
              <Link to="/account" style={{ display: 'block', padding: '12px 0', fontWeight: 700, fontSize: 16, color: isActive('/account') ? '#e8002d' : '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}>
                👤 {user.name}
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} style={{ display: 'block', width: '100%', textAlign: 'start', padding: '12px 0', fontWeight: 700, fontSize: 16, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>
                {t('signOut')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ display: 'block', padding: '12px 0', fontWeight: 700, fontSize: 16, color: isActive('/login') ? '#e8002d' : '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}>
                {t('signIn')}
              </Link>
              <Link to="/signup" style={{ display: 'block', padding: '12px 0', fontWeight: 700, fontSize: 16, color: isActive('/signup') ? '#e8002d' : '#374151', textDecoration: 'none' }}>
                {t('signUp')}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
