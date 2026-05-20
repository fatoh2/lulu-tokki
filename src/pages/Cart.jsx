import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Cart() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart();
  const { t, lang } = useLanguage();

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
        <h2 style={{ fontWeight: 800, fontSize: 24, color: '#1a1a2e', marginBottom: 10 }}>{t('emptyCartTitle')}</h2>
        <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 32 }}>{t('emptyCartMsg')}</p>
        <Link
          to="/store"
          style={{ display: 'inline-block', padding: '14px 36px', borderRadius: 12, background: '#e8002d', color: 'white', textDecoration: 'none', fontWeight: 800, fontSize: 16 }}
        >
          {t('browseStore')}
        </Link>
      </div>
    );
  }

  const shipping = totalPrice >= 100 ? 0 : 15;
  const total = totalPrice + shipping;
  const nudge = lang === 'ar'
    ? `💡 أضف ${(100 - totalPrice).toFixed(2)} ₪ للحصول على شحن مجاني!`
    : `💡 Add ₪${(100 - totalPrice).toFixed(2)} more for free shipping!`;
  const itemsText = lang === 'ar'
    ? `${items.length} ${items.length === 1 ? 'منتج' : 'منتجات'} في سلتك`
    : `${items.length} ${items.length === 1 ? 'item' : 'items'} in your cart`;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontWeight: 800, fontSize: 26, color: '#1a1a2e', marginBottom: 8 }}>{t('cartTitle')}</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>{itemsText}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={clearCart}
              style={{ background: 'none', border: '2px solid #e5e7eb', borderRadius: 8, padding: '6px 14px', color: '#9ca3af', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              {t('clearCart')}
            </button>
          </div>

          {items.map(item => (
            <div
              key={item.id}
              style={{ background: 'white', borderRadius: 16, padding: 16, display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}
            >
              <div style={{ width: 80, height: 80, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg, #fff5f5, #f0f4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                {item.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{item.brand} • {item.category}</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#e8002d' }}>
                  {(item.price * item.quantity).toFixed(2)} {t('currency')}
                  <span style={{ fontWeight: 500, fontSize: 12, color: '#9ca3af', marginInlineStart: 6 }}>
                    ({item.price.toFixed(2)} × {item.quantity})
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '2px solid #e5e7eb', background: 'white', fontSize: 16, cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>−</button>
                <span style={{ fontWeight: 800, fontSize: 16, minWidth: 28, textAlign: 'center', color: '#1a1a2e' }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '2px solid #e8002d', background: '#fff0f2', fontSize: 16, cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8002d' }}>+</button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9ca3af', flexShrink: 0, padding: 4, borderRadius: 6, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8002d'}
                onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
              >✕</button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0', position: 'sticky', top: 84 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e', marginTop: 0, marginBottom: 20 }}>{t('orderSummaryTitle')}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
              <span>{t('subtotal')}</span>
              <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{totalPrice.toFixed(2)} {t('currency')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
              <span>{t('shippingFee')}</span>
              <span style={{ fontWeight: 700, color: shipping === 0 ? '#16a34a' : '#1a1a2e' }}>
                {shipping === 0 ? t('freeShippingLabel') : `${shipping.toFixed(2)} ${t('currency')}`}
              </span>
            </div>
            {shipping > 0 && (
              <div style={{ background: '#fffbeb', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#d97706', fontWeight: 600 }}>
                {nudge}
              </div>
            )}
            <div style={{ borderTop: '2px solid #f3f4f6', paddingTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800 }}>
                <span style={{ color: '#1a1a2e' }}>{t('totalLabel')}</span>
                <span style={{ color: '#e8002d' }}>{total.toFixed(2)} {t('currency')}</span>
              </div>
            </div>
          </div>

          <Link
            to="/checkout"
            style={{ display: 'block', textAlign: 'center', padding: '14px 20px', background: '#e8002d', color: 'white', textDecoration: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#b5001f'}
            onMouseLeave={e => e.currentTarget.style.background = '#e8002d'}
          >
            {t('checkoutBtn')}
          </Link>

          <Link
            to="/store"
            style={{ display: 'block', textAlign: 'center', padding: '12px 20px', marginTop: 10, background: 'white', color: '#374151', textDecoration: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, border: '2px solid #e5e7eb' }}
          >
            {t('continueShoppingBtn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
