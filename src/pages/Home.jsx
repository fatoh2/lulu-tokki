import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return isMobile;
}

const HERO_PHOTO = 'https://plus.unsplash.com/premium_photo-1700830647950-6bba9ca2a957?fm=jpg&q=80&w=600&h=500&auto=format&fit=crop';

const CATEGORIES = [
  { key: 'رامن', emoji: '🍜', tKey: 'catRamen' },
  { key: 'رقائق', emoji: '🍟', tKey: 'catChips' },
  { key: 'حلوى', emoji: '🍬', tKey: 'catCandy' },
  { key: 'مشروبات', emoji: '🧃', tKey: 'catDrinks' },
  { key: 'بسكويت', emoji: '🍪', tKey: 'catBiscuits' },
];

const FEATURES = [
  { icon: '🚚', t1: 'feat1Title', t2: 'feat1Desc', color: '#e8002d', bg: '#fff0f2' },
  { icon: '🇰🇷', t1: 'feat2Title', t2: 'feat2Desc', color: '#003478', bg: '#eff6ff' },
  { icon: '⚡', t1: 'feat3Title', t2: 'feat3Desc', color: '#059669', bg: '#f0fdf4' },
  { icon: '🔒', t1: 'feat4Title', t2: 'feat4Desc', color: '#d97706', bg: '#fffbeb' },
];

export default function Home() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { t, lang } = useLanguage();
  const isMobile = useIsMobile();

  const mostBought = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  const catCount = (key) => products.filter(p => p.category === key).length;

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #e8002d 0%, #9b001e 45%, #003478 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '56px 20px' : '64px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 360, height: 360, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -60, width: 440, height: 440, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, width: '100%', display: 'flex', alignItems: 'center', gap: 48, flexDirection: isMobile ? 'column' : 'row' }}>

          {/* Text side */}
          <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'start' }}>
            <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>🇰🇷</div>
            <h1 style={{ color: 'white', fontSize: isMobile ? 30 : 38, fontWeight: 900, margin: '0 0 18px', lineHeight: 1.25 }}>
              {t('heroTitle')}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16, lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
              {t('heroSubtitle')}
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: isMobile ? 'center' : 'start', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/store')}
                style={{ padding: '14px 38px', borderRadius: 14, background: 'white', color: '#e8002d', fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 16, cursor: 'pointer', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
              >
                {t('heroShopNow')} ←
              </button>
              <button
                onClick={() => navigate('/store')}
                style={{ padding: '14px 38px', borderRadius: 14, background: 'transparent', color: 'white', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 16, cursor: 'pointer', border: '2px solid rgba(255,255,255,0.55)', transition: 'background 0.2s, border-color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.9)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)'; }}
              >
                {t('heroBrowse')}
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, justifyContent: isMobile ? 'center' : 'start', marginTop: 44, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 32 }}>
              {[
                { num: `${products.length}+`, label: t('heroStatProducts') },
                { num: '5', label: t('heroStatCategories') },
                { num: '100%', label: t('heroStatAuthentic') },
                { num: '⚡', label: t('heroStatDelivery') },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: 'white', lineHeight: 1 }}>{stat.num}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo side */}
          {!isMobile && (
            <div style={{ flexShrink: 0, width: 440 }}>
              <img
                src={HERO_PHOTO}
                alt="Korean snacks"
                style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 24, boxShadow: '0 24px 64px rgba(0,0,0,0.35)', display: 'block' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ background: 'white', padding: '52px 20px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div
              key={f.t1}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 18px', borderRadius: 16, background: f.bg, border: `1px solid ${f.color}22` }}
            >
              <div style={{ fontSize: 32, flexShrink: 0, lineHeight: 1 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: f.color, marginBottom: 5 }}>{t(f.t1)}</div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{t(f.t2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Best Sellers ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: '#e8002d', fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
            🔥 {t('mostBoughtSubtitle')}
          </div>
          <h2 style={{ fontWeight: 900, fontSize: 30, color: '#1a1a2e', margin: 0 }}>
            {t('mostBoughtTitle')}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
          {mostBought.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            onClick={() => navigate('/store')}
            style={{ padding: '13px 44px', borderRadius: 12, background: '#e8002d', color: 'white', border: 'none', fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#b5001f'}
            onMouseLeave={e => e.currentTarget.style.background = '#e8002d'}
          >
            {t('viewAllProducts')} →
          </button>
        </div>
      </div>

      {/* ── Categories ── */}
      <div style={{ background: '#f8f9fb', padding: '64px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: 28, color: '#1a1a2e', marginTop: 0, marginBottom: 40 }}>
            {t('categoriesTitle')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => navigate('/store', { state: { category: cat.key } })}
                style={{ background: 'white', border: '2px solid #f0f0f0', borderRadius: 20, padding: '28px 12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: 'Cairo, sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8002d'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,0,45,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 46, marginBottom: 10, lineHeight: 1 }}>{cat.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#1a1a2e', marginBottom: 4 }}>{t(cat.tKey)}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{catCount(cat.key)} {t('catItems')}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
