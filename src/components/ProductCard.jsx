import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const HEAT_LABELS = ['', '🌶️', '🌶️🌶️', '🌶️🌶️🌶️', '🌶️🌶️🌶️🌶️', '🌶️🌶️🌶️🌶️🌶️'];

export default function ProductCard({ product }) {
  const { addItem, items } = useCart();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const inCart = items.find(i => i.id === product.id);

  const handleAdd = () => {
    addItem(product);
    const msg = isRTL
      ? `تمت الإضافة إلى السلة! ${product.emoji}`
      : `Added to cart! ${product.emoji}`;
    toast.success(msg, {
      style: { fontFamily: 'Cairo, sans-serif', direction: isRTL ? 'rtl' : 'ltr', fontWeight: 600 },
      iconTheme: { primary: '#e8002d', secondary: '#fff' },
    });
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
    >
      {/* Badges */}
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 1 }}>
        {product.isNew && (
          <span style={{ background: '#003478', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{t('badgeNew')}</span>
        )}
        {product.isFeatured && (
          <span style={{ background: '#e8002d', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{t('badgeFeatured')}</span>
        )}
        {!product.inStock && (
          <span style={{ background: '#6b7280', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{t('badgeOutOfStock')}</span>
        )}
      </div>

      {/* Image */}
      <div style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #f0f4ff 100%)', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>
        {product.emoji}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#e8002d', fontWeight: 700, background: '#fff0f2', padding: '2px 8px', borderRadius: 6 }}>
            {product.category}
          </span>
          {product.heat > 0 && (
            <span style={{ fontSize: 11 }} title={`Heat: ${product.heat}/5`}>
              {HEAT_LABELS[product.heat]}
            </span>
          )}
        </div>

        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', lineHeight: 1.4 }} className="line-clamp-2">
          {product.name}
        </div>

        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, flex: 1 }} className="line-clamp-2">
          {product.description}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ fontSize: 13, color: s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db' }}>★</span>
            ))}
          </div>
          <span style={{ fontSize: 12, color: '#6b7280' }}>{product.rating} ({product.reviews})</span>
        </div>

        <div style={{ fontSize: 11, color: '#9ca3af' }}>{product.brand}</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e' }}>
            {product.price.toFixed(2)} <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>{t('currency')}</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); handleAdd(); }}
            disabled={!product.inStock}
            style={{
              background: !product.inStock ? '#e5e7eb' : inCart ? '#003478' : '#e8002d',
              color: !product.inStock ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: 10,
              padding: '8px 16px',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              cursor: product.inStock ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {!product.inStock ? t('outOfStock') : inCart ? t('inCart') : t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
