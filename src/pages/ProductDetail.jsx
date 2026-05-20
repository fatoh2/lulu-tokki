import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const HEAT_LABELS = ['', '🌶️ خفيف', '🌶️🌶️ معتدل', '🌶️🌶️🌶️ حار', '🌶️🌶️🌶️🌶️ حار جداً', '🌶️🌶️🌶️🌶️🌶️ ناري!'];
const HEAT_COLORS = ['', '#f59e0b', '#f97316', '#ef4444', '#dc2626', '#991b1b'];

// Per-category gallery view definitions
const GALLERY_VIEWS = {
  رامن: [
    { label: 'المنتج', decorEmoji: '', bg: 'linear-gradient(135deg, #fff0f2 0%, #fce7f3 100%)' },
    { label: 'طريقة التقديم', decorEmoji: '🥢', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' },
    { label: 'المكونات', decorEmoji: '🫙', bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' },
    { label: 'العبوة', decorEmoji: '📦', bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' },
  ],
  رقائق: [
    { label: 'المنتج', decorEmoji: '', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' },
    { label: 'في الوعاء', decorEmoji: '🫙', bg: 'linear-gradient(135deg, #fff0f2 0%, #fce7f3 100%)' },
    { label: 'التوابل', decorEmoji: '🧂', bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' },
    { label: 'العبوة', decorEmoji: '📦', bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' },
  ],
  حلوى: [
    { label: 'المنتج', decorEmoji: '', bg: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)' },
    { label: 'التقديم', decorEmoji: '🎁', bg: 'linear-gradient(135deg, #fff0f2 0%, #fce7f3 100%)' },
    { label: 'المكونات', decorEmoji: '✨', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' },
    { label: 'العبوة', decorEmoji: '🎀', bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' },
  ],
  مشروبات: [
    { label: 'المنتج', decorEmoji: '', bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' },
    { label: 'بارد', decorEmoji: '🧊', bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' },
    { label: 'مع الثلج', decorEmoji: '🥤', bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' },
    { label: 'العبوة', decorEmoji: '📦', bg: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)' },
  ],
  بسكويت: [
    { label: 'المنتج', decorEmoji: '', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' },
    { label: 'مع الشاي', decorEmoji: '☕', bg: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)' },
    { label: 'مقطّع', decorEmoji: '🫙', bg: 'linear-gradient(135deg, #fff0f2 0%, #fce7f3 100%)' },
    { label: 'العبوة', decorEmoji: '🎁', bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' },
  ],
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const product = products.find(p => p.id === Number(id));
  const { addItem, items, updateQty } = useCart();
  const [activePhoto, setActivePhoto] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: 64 }}>😕</div>
        <h2 style={{ fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>المنتج غير موجود</h2>
        <Link to="/" style={{ display: 'inline-block', marginTop: 16, padding: '12px 28px', background: '#e8002d', color: 'white', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>
          العودة للمتجر
        </Link>
      </div>
    );
  }

  const views = GALLERY_VIEWS[product.category] ?? GALLERY_VIEWS['رامن'];
  const inCart = items.find(i => i.id === product.id);

  const handleAddToCart = () => {
    if (inCart) {
      updateQty(product.id, inCart.quantity + qty);
    } else {
      for (let i = 0; i < qty; i++) addItem(product);
    }
    toast.success(`تمت إضافة ${qty} إلى السلة! ${product.emoji}`, {
      style: { fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontWeight: 600 },
      iconTheme: { primary: '#e8002d', secondary: '#fff' },
    });
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#9ca3af', marginBottom: 24, flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 600 }}>المتجر</Link>
        <span>›</span>
        <button
          onClick={() => navigate('/', { state: { category: product.category } })}
          style={{ background: 'none', border: 'none', color: '#6b7280', fontFamily: 'Cairo, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}
        >
          {product.category}
        </button>
        <span>›</span>
        <span style={{ color: '#374151', fontWeight: 700, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </span>
      </nav>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>

        {/* ── Left: Photo Gallery ── */}
        <div>
          {/* Main Photo */}
          <div style={{
            borderRadius: 20,
            background: views[activePhoto].bg,
            height: 380,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.06)',
            marginBottom: 12,
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -30, left: -30, width: 150, height: 150, background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -40, right: -20, width: 180, height: 180, background: 'rgba(255,255,255,0.3)', borderRadius: '50%' }} />

            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 120, lineHeight: 1, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))' }}>
                {product.emoji}
              </div>
              {views[activePhoto].decorEmoji && (
                <div style={{ position: 'absolute', bottom: -20, left: -30, fontSize: 48, opacity: 0.6 }}>
                  {views[activePhoto].decorEmoji}
                </div>
              )}
            </div>

            {/* View label badge */}
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
              borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#374151',
            }}>
              {views[activePhoto].label}
            </div>

            {/* Badges */}
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 6 }}>
              {product.isNew && (
                <span style={{ background: '#003478', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>جديد</span>
              )}
              {product.isFeatured && (
                <span style={{ background: '#e8002d', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>⭐ مميز</span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {views.map((view, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(i)}
                style={{
                  borderRadius: 12,
                  background: view.bg,
                  height: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  border: `2px solid ${activePhoto === i ? '#e8002d' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                  boxShadow: activePhoto === i ? '0 0 0 3px rgba(232,0,45,0.15)' : 'none',
                }}
              >
                <span style={{ fontSize: 28 }}>{product.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: activePhoto === i ? '#e8002d' : '#6b7280' }}>
                  {view.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Product Info ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Category + Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: '#fff0f2', color: '#e8002d', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 8 }}>
              {product.category}
            </span>
            <span style={{ background: '#eff6ff', color: '#003478', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 8 }}>
              {product.brand}
            </span>
            {!product.inStock && (
              <span style={{ background: '#f3f4f6', color: '#6b7280', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 8 }}>
                نفد المخزون
              </span>
            )}
          </div>

          {/* Name */}
          <h1 style={{ fontWeight: 800, fontSize: 26, color: '#1a1a2e', margin: 0, lineHeight: 1.3 }}>
            {product.name}
          </h1>

          {/* Rating row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ fontSize: 18, color: s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db' }}>★</span>
              ))}
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#1a1a2e' }}>{product.rating}</span>
            <span style={{ color: '#9ca3af', fontSize: 14 }}>({product.reviews} تقييم)</span>
          </div>

          {/* Heat level */}
          {product.heat > 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: `${HEAT_COLORS[product.heat]}15`,
              border: `1px solid ${HEAT_COLORS[product.heat]}40`,
              borderRadius: 10, padding: '8px 14px',
              alignSelf: 'flex-start',
            }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: HEAT_COLORS[product.heat] }}>
                {HEAT_LABELS[product.heat]}
              </span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>مستوى {product.heat}/5</span>
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontWeight: 900, fontSize: 36, color: '#e8002d' }}>
              {product.price.toFixed(2)}
            </span>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#6b7280' }}>ر.س</span>
            {inCart && (
              <span style={{ marginRight: 8, fontSize: 13, color: '#003478', fontWeight: 700, background: '#eff6ff', padding: '3px 10px', borderRadius: 6 }}>
                ✓ {inCart.quantity} في السلة
              </span>
            )}
          </div>

          {/* Description */}
          <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.8, margin: 0 }}>
            {product.longDescription}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {product.tags.map(tag => (
              <span key={tag} style={{ background: '#f3f4f6', color: '#6b7280', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Quantity + Add to Cart */}
          <div style={{ background: '#f8f9fb', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#374151', minWidth: 60 }}>الكمية</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'white', borderRadius: 12, border: '2px solid #e5e7eb', overflow: 'hidden' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 42, height: 42, border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#374151', fontWeight: 700, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  −
                </button>
                <span style={{ fontWeight: 800, fontSize: 18, minWidth: 40, textAlign: 'center', color: '#1a1a2e' }}>{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{ width: 42, height: 42, border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#e8002d', fontWeight: 700, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fff0f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  +
                </button>
              </div>
              <span style={{ fontSize: 14, color: '#9ca3af', fontWeight: 600 }}>
                = {(product.price * qty).toFixed(2)} ر.س
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{
                  flex: 1, padding: '14px 20px',
                  background: product.inStock ? '#e8002d' : '#e5e7eb',
                  color: product.inStock ? 'white' : '#9ca3af',
                  border: 'none', borderRadius: 12,
                  fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 16,
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (product.inStock) e.currentTarget.style.background = '#b5001f'; }}
                onMouseLeave={e => { if (product.inStock) e.currentTarget.style.background = '#e8002d'; }}
              >
                {product.inStock ? `🛒 أضف ${qty > 1 ? qty + ' قطع' : ''} للسلة` : 'غير متاح حالياً'}
              </button>
              <Link
                to="/cart"
                style={{
                  padding: '14px 20px', borderRadius: 12,
                  border: '2px solid #e8002d', color: '#e8002d',
                  textDecoration: 'none', fontWeight: 800, fontSize: 15,
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff0f2'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                عرض السلة
              </Link>
            </div>
          </div>

          {/* Product Specs */}
          <div style={{ borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ background: '#f8f9fb', padding: '12px 16px', fontWeight: 800, fontSize: 14, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
              مواصفات المنتج
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <tbody>
                {[
                  ['الوزن', product.weight],
                  ['الحصص', product.servings],
                  ['البلد', product.origin],
                  ['العلامة التجارية', product.brand],
                  ['الفئة', product.category],
                  ...(product.heat > 0 ? [['مستوى الحرارة', `${product.heat}/5 — ${HEAT_LABELS[product.heat]}`]] : []),
                  ['التوفر', product.inStock ? '✅ متاح' : '❌ نفد المخزون'],
                ].map(([label, value], i) => (
                  <tr key={label} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 700, color: '#6b7280', width: '40%', borderBottom: '1px solid #f3f4f6' }}>{label}</td>
                    <td style={{ padding: '10px 16px', color: '#1a1a2e', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ marginTop: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1a1a2e', margin: 0 }}>
              منتجات مشابهة في فئة {product.category}
            </h2>
            <Link
              to="/"
              style={{ color: '#e8002d', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}
            >
              عرض الكل ←
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
