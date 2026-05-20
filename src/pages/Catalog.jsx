import { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

const CATEGORIES = ['الكل', 'رامن', 'رقائق', 'حلوى', 'مشروبات', 'بسكويت'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'المميزة أولاً' },
  { value: 'price-asc', label: 'السعر: الأقل أولاً' },
  { value: 'price-desc', label: 'السعر: الأعلى أولاً' },
  { value: 'rating', label: 'الأعلى تقييماً' },
  { value: 'name', label: 'الاسم أبجدياً' },
];
const PAGE_SIZE = 20;

export default function Catalog() {
  const { products } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('الكل');
  const [maxPrice, setMaxPrice] = useState(null);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const maxPriceInData = Math.ceil(Math.max(...products.map(p => p.price))) + 1;
  const effectiveMax = maxPrice ?? maxPriceInData;

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [search, category, maxPrice, onlyInStock, minRating, sort]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    if (category !== 'الكل') result = result.filter(p => p.category === category);
    result = result.filter(p => p.price <= effectiveMax);
    if (onlyInStock) result = result.filter(p => p.inStock);
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name, 'ar')); break;
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return result;
  }, [products, search, category, effectiveMax, onlyInStock, minRating, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFiltersCount = [
    category !== 'الكل',
    maxPrice !== null && maxPrice < maxPriceInData,
    onlyInStock,
    minRating > 0,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setCategory('الكل');
    setMaxPrice(null);
    setOnlyInStock(false);
    setMinRating(0);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #e8002d 0%, #b5001f 50%, #003478 100%)',
        borderRadius: 20, padding: '32px 40px', marginBottom: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: 6 }}>
            🇰🇷 أفضل المنتجات الكورية الأصيلة
          </div>
          <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
            وجبات كورية في بيتك
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', margin: '8px 0 0', fontSize: 15 }}>
            {products.length}+ منتج أصيل يصلك على باب البيت
          </p>
        </div>
        <div style={{ fontSize: 80, opacity: 0.9 }}>🍜</div>
        <div style={{ position: 'absolute', top: -20, left: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 60, width: 160, height: 160, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>🔍</span>
        <input
          type="text" placeholder="ابحث عن منتج، علامة تجارية..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 50px 14px 20px', borderRadius: 12, border: '2px solid #e5e7eb', fontSize: 15, fontFamily: 'Cairo, sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = '#e8002d'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9ca3af' }}>×</button>
        )}
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '8px 18px', borderRadius: 24, border: '2px solid',
            borderColor: category === cat ? '#e8002d' : '#e5e7eb',
            background: category === cat ? '#e8002d' : 'white',
            color: category === cat ? 'white' : '#374151',
            fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
          }}>{cat}</button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ color: '#6b7280', fontSize: 14, fontWeight: 600 }}>
          {filtered.length === 0 ? 'لا توجد نتائج' : (
            <>
              <span style={{ color: '#1a1a2e', fontWeight: 800 }}>{filtered.length}</span> منتج
              {totalPages > 1 && (
                <span style={{ marginRight: 8, color: '#9ca3af' }}>
                  — صفحة {page} من {totalPages}
                </span>
              )}
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10,
              border: '2px solid', borderColor: activeFiltersCount > 0 ? '#e8002d' : '#e5e7eb',
              background: activeFiltersCount > 0 ? '#fff0f2' : 'white',
              color: activeFiltersCount > 0 ? '#e8002d' : '#374151',
              fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            <span>⚙️ فلاتر</span>
            {activeFiltersCount > 0 && (
              <span style={{ background: '#e8002d', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                {activeFiltersCount}
              </span>
            )}
          </button>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 16px', borderRadius: 10, border: '2px solid #e5e7eb', fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', background: 'white', color: '#374151', outline: 'none' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 24, border: '2px solid #e8002d', boxShadow: '0 4px 20px rgba(232,0,45,0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            <div>
              <label style={{ fontWeight: 700, fontSize: 14, color: '#374151', display: 'block', marginBottom: 10 }}>
                الحد الأقصى للسعر: <span style={{ color: '#e8002d' }}>{effectiveMax} ر.س</span>
              </label>
              <input type="range" min={5} max={maxPriceInData} step={0.5}
                value={effectiveMax}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                <span>5 ر.س</span><span>{maxPriceInData} ر.س</span>
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: 14, color: '#374151', display: 'block', marginBottom: 10 }}>الحد الأدنى للتقييم</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[0, 3, 3.5, 4, 4.5].map(r => (
                  <button key={r} onClick={() => setMinRating(r)} style={{
                    padding: '6px 12px', borderRadius: 8, border: '2px solid',
                    borderColor: minRating === r ? '#f59e0b' : '#e5e7eb',
                    background: minRating === r ? '#fffbeb' : 'white',
                    color: minRating === r ? '#d97706' : '#6b7280',
                    fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  }}>{r === 0 ? 'الكل' : `${r}★`}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <div onClick={() => setOnlyInStock(!onlyInStock)} style={{ width: 48, height: 26, borderRadius: 13, cursor: 'pointer', background: onlyInStock ? '#e8002d' : '#d1d5db', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, transition: 'right 0.2s', right: onlyInStock ? 4 : 24, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>المتاح فقط</span>
              </label>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <div style={{ marginTop: 20, borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
              <button onClick={resetFilters} style={{ padding: '8px 20px', borderRadius: 10, border: '2px solid #e5e7eb', background: 'white', color: '#6b7280', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                ↺ إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>لا توجد منتجات مطابقة</div>
          <div style={{ fontSize: 14 }}>جرب تغيير الفلاتر أو البحث بكلمات مختلفة</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
            {paginated.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          {totalPages > 1 && (
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, marginTop: 4 }}>
              عرض {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} من {filtered.length} منتج
            </div>
          )}
        </>
      )}
    </div>
  );
}
