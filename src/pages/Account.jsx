import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';

export default function Account() {
  const { user, logout } = useAuth();
  const { t, lang } = useLanguage();
  const { wishlist } = useWishlist();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [tab, setTab] = useState('history');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) { setOrders([]); setOrdersLoading(false); return; }
    const q = query(collection(db, 'orders'), where('userId', '==', user.id));
    getDocs(q).then(snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(docs);
      setOrdersLoading(false);
    }).catch(() => setOrdersLoading(false));
  }, [user?.id]);

  if (!user) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>👤</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 16 }}>{t('signIn')}</h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/login" style={{ display: 'inline-block', padding: '12px 28px', background: '#e8002d', color: 'white', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>
            {t('loginBtn')}
          </Link>
          <Link to="/signup" style={{ display: 'inline-block', padding: '12px 28px', background: 'white', color: '#374151', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15, border: '2px solid #e5e7eb' }}>
            {t('signUp')}
          </Link>
        </div>
      </div>
    );
  }

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const tabStyle = (active) => ({
    padding: '10px 22px', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontWeight: 700,
    fontSize: 14, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
    background: active ? '#e8002d' : 'white',
    color: active ? 'white' : '#6b7280',
    boxShadow: active ? '0 2px 8px rgba(232,0,45,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

      {/* Profile header */}
      <div style={{ background: 'white', borderRadius: 20, padding: '24px 28px', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'linear-gradient(135deg, #e8002d, #003478)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'white', fontWeight: 800, flexShrink: 0 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e' }}>{user.name}</div>
            <div style={{ fontSize: 13, color: '#9ca3af', direction: 'ltr' }}>{user.email}</div>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          style={{ padding: '9px 20px', border: '2px solid #e5e7eb', borderRadius: 10, background: 'white', color: '#6b7280', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8002d'; e.currentTarget.style.color = '#e8002d'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
        >
          {t('signOut')}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button style={tabStyle(tab === 'history')} onClick={() => setTab('history')}>
          📦 {t('orderHistoryTab')} {orders.length > 0 && `(${orders.length})`}
        </button>
        <button style={tabStyle(tab === 'wishlist')} onClick={() => setTab('wishlist')}>
          ❤️ {t('wishlistTab')} {wishlist.length > 0 && `(${wishlist.length})`}
        </button>
      </div>

      {/* Order history */}
      {tab === 'history' && (
        orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', background: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
            <h3 style={{ fontWeight: 800, fontSize: 20, color: '#1a1a2e', margin: '0 0 8px' }}>{t('emptyHistoryMsg')}</h3>
            <Link to="/store" style={{ display: 'inline-block', marginTop: 20, padding: '12px 28px', background: '#e8002d', color: 'white', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>
              {t('browseStore')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#374151', fontWeight: 700, marginBottom: 2 }}>
                      {t('orderDateLabel')}: {new Date(order.date).toLocaleDateString(lang === 'ar' ? 'ar-IL' : 'en-IL', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', direction: 'ltr' }}>#{order.id}</div>
                  </div>
                  <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                    📲 {t('orderSentWhatsapp')}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {order.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{item.emoji}</span>
                      <span style={{ fontSize: 14, color: '#374151', flex: 1 }}>{item.name}</span>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>× {item.quantity}</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', flexShrink: 0 }}>{(item.price * item.quantity).toFixed(2)} {t('currency')}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '2px solid #f3f4f6', paddingTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: '#e8002d' }}>{t('totalLabel')}: {order.total.toFixed(2)} {t('currency')}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Wishlist */}
      {tab === 'wishlist' && (
        wishlistProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', background: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>❤️</div>
            <h3 style={{ fontWeight: 800, fontSize: 20, color: '#1a1a2e', margin: '0 0 8px' }}>{t('emptyWishlistMsg')}</h3>
            <Link to="/store" style={{ display: 'inline-block', marginTop: 20, padding: '12px 28px', background: '#e8002d', color: 'white', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>
              {t('browseStore')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
            {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )
      )}
    </div>
  );
}
