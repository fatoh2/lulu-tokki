import { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['رامن', 'رقائق', 'حلوى', 'مشروبات', 'بسكويت'];
const EMPTY_FORM = {
  name: '', description: '', price: '', category: 'رامن',
  emoji: '🍜', brand: '', weight: '', servings: '',
  heat: 0, inStock: true, tags: '',
};

function Badge({ children, color = '#e8002d', bg = '#fff0f2' }) {
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#e8002d' }}> *</span>}
      </label>
      {children}
      {error && <div style={{ fontSize: 12, color: '#e8002d', marginTop: 3, fontWeight: 600 }}>⚠ {error}</div>}
    </div>
  );
}

export default function Admin() {
  const { products, addProduct, removeProduct } = useProducts();
  const [tab, setTab] = useState('list'); // 'list' | 'add'
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const filtered = products.filter(p =>
    !search.trim() ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.includes(search)
  );

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.description.trim()) e.description = 'الوصف مطلوب';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'سعر صحيح مطلوب';
    if (!form.brand.trim()) e.brand = 'العلامة التجارية مطلوبة';
    if (!form.emoji.trim()) e.emoji = 'الرمز مطلوب';
    return e;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await addProduct({
      ...form,
      price: Number(form.price),
      heat: Number(form.heat),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    toast.success(`تم إضافة "${form.name}" بنجاح! ✅`, {
      style: { fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontWeight: 600 },
    });
    setForm(EMPTY_FORM);
    setTab('list');
  };

  const handleRemove = async (id) => {
    const p = products.find(p => p.id === id);
    await removeProduct(id);
    setConfirmId(null);
    toast.success(`تم حذف "${p?.name}" ✅`, {
      style: { fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontWeight: 600 },
    });
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: `2px solid ${hasError ? '#e8002d' : '#e5e7eb'}`,
    fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a1a2e',
    outline: 'none', boxSizing: 'border-box', background: 'white',
    transition: 'border-color 0.2s',
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{ fontSize: 36 }}>⚙️</div>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 24, color: '#1a1a2e', margin: 0 }}>لوحة الإدارة</h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>إدارة منتجات متجر هانوك سناكس</p>
        </div>
        <div style={{ marginRight: 'auto' }}>
          <Badge color="#003478" bg="#eff6ff">{products.length} منتج إجمالاً</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: 'white', borderRadius: 12, padding: 4, border: '1px solid #e5e7eb', width: 'fit-content' }}>
        {[['list', '📋 المنتجات'], ['add', '➕ إضافة منتج']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '8px 24px', borderRadius: 9, border: 'none',
            background: tab === key ? '#e8002d' : 'transparent',
            color: tab === key ? 'white' : '#6b7280',
            fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            transition: 'all 0.2s',
          }}>{label}</button>
        ))}
      </div>

      {/* ── Products List Tab ── */}
      {tab === 'list' && (
        <div>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 420, marginBottom: 20 }}>
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input
              type="text" placeholder="ابحث في المنتجات..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle(false), paddingRight: 38 }}
              onFocus={e => e.target.style.borderColor = '#e8002d'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const count = products.filter(p => p.category === cat).length;
              return (
                <div key={cat} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 16px', fontSize: 13 }}>
                  <span style={{ fontWeight: 800, color: '#e8002d', marginLeft: 6 }}>{count}</span>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>{cat}</span>
                </div>
              );
            })}
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 100px 80px 80px 100px 80px', gap: 0, background: '#f8f9fb', borderBottom: '2px solid #e5e7eb', padding: '12px 16px', fontSize: 12, fontWeight: 800, color: '#6b7280' }}>
              <span>رمز</span>
              <span>اسم المنتج</span>
              <span>الفئة</span>
              <span>السعر</span>
              <span>التقييم</span>
              <span>المخزون</span>
              <span>إجراء</span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: '40px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                لا توجد منتجات مطابقة
              </div>
            ) : filtered.map((p, i) => (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '50px 1fr 100px 80px 80px 100px 80px',
                gap: 0, padding: '12px 16px', alignItems: 'center',
                background: i % 2 === 0 ? 'white' : '#fafafa',
                borderBottom: '1px solid #f3f4f6',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa'}
              >
                <div style={{ fontSize: 24, textAlign: 'center' }}>{p.emoji}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{p.brand} • ID: {p.id}</div>
                </div>
                <div><Badge color="#003478" bg="#eff6ff">{p.category}</Badge></div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#1a1a2e' }}>{p.price.toFixed(2)}</div>
                <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>{p.rating > 0 ? `${p.rating}★` : '—'}</div>
                <div>
                  {p.inStock
                    ? <Badge color="#16a34a" bg="#f0fdf4">✅ متاح</Badge>
                    : <Badge color="#6b7280" bg="#f3f4f6">❌ نفد</Badge>
                  }
                </div>
                <div>
                  {confirmId === p.id ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => handleRemove(p.id)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#e8002d', color: 'white', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>تأكيد</button>
                      <button onClick={() => setConfirmId(null)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', color: '#6b7280', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>إلغاء</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(p.id)}
                      style={{ padding: '6px 12px', borderRadius: 8, border: '2px solid #fee2e2', background: '#fff5f5', color: '#e8002d', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e8002d'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#e8002d'; }}
                    >🗑 حذف</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
            عرض {filtered.length} من {products.length} منتج
          </div>
        </div>
      )}

      {/* ── Add Product Tab ── */}
      {tab === 'add' && (
        <form onSubmit={handleAdd}>
          <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <h3 style={{ fontWeight: 800, fontSize: 17, color: '#1a1a2e', marginTop: 0, marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid #f3f4f6' }}>
              ➕ إضافة منتج جديد
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Name */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="اسم المنتج" required error={errors.name}>
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="مثال: رامن بلدق الحار 불닭볶음면"
                    style={inputStyle(!!errors.name)}
                    onFocus={e => { if (!errors.name) e.target.style.borderColor = '#e8002d'; }}
                    onBlur={e => { if (!errors.name) e.target.style.borderColor = '#e5e7eb'; }}
                  />
                </Field>
              </div>

              {/* Description */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="الوصف المختصر" required error={errors.description}>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)}
                    placeholder="جملة أو جملتان عن المنتج..."
                    rows={2}
                    style={{ ...inputStyle(!!errors.description), resize: 'vertical', fontFamily: 'Cairo, sans-serif' }}
                    onFocus={e => { if (!errors.description) e.target.style.borderColor = '#e8002d'; }}
                    onBlur={e => { if (!errors.description) e.target.style.borderColor = '#e5e7eb'; }}
                  />
                </Field>
              </div>

              {/* Price */}
              <Field label="السعر (ر.س)" required error={errors.price}>
                <input type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)}
                  placeholder="0.00"
                  style={inputStyle(!!errors.price)}
                  onFocus={e => { if (!errors.price) e.target.style.borderColor = '#e8002d'; }}
                  onBlur={e => { if (!errors.price) e.target.style.borderColor = '#e5e7eb'; }}
                />
              </Field>

              {/* Category */}
              <Field label="الفئة" required>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  style={{ ...inputStyle(false), cursor: 'pointer' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              {/* Brand */}
              <Field label="العلامة التجارية" required error={errors.brand}>
                <input value={form.brand} onChange={e => set('brand', e.target.value)}
                  placeholder="مثال: Samyang"
                  style={inputStyle(!!errors.brand)}
                  onFocus={e => { if (!errors.brand) e.target.style.borderColor = '#e8002d'; }}
                  onBlur={e => { if (!errors.brand) e.target.style.borderColor = '#e5e7eb'; }}
                />
              </Field>

              {/* Emoji */}
              <Field label="الرمز (إيموجي)" required error={errors.emoji}>
                <input value={form.emoji} onChange={e => set('emoji', e.target.value)}
                  placeholder="🍜"
                  style={{ ...inputStyle(!!errors.emoji), fontSize: 20, textAlign: 'center' }}
                  onFocus={e => { if (!errors.emoji) e.target.style.borderColor = '#e8002d'; }}
                  onBlur={e => { if (!errors.emoji) e.target.style.borderColor = '#e5e7eb'; }}
                />
              </Field>

              {/* Weight */}
              <Field label="الوزن">
                <input value={form.weight} onChange={e => set('weight', e.target.value)}
                  placeholder="مثال: 140g"
                  style={inputStyle(false)}
                  onFocus={e => e.target.style.borderColor = '#e8002d'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </Field>

              {/* Servings */}
              <Field label="الحصص">
                <input value={form.servings} onChange={e => set('servings', e.target.value)}
                  placeholder="مثال: حصتان"
                  style={inputStyle(false)}
                  onFocus={e => e.target.style.borderColor = '#e8002d'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </Field>

              {/* Heat */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label={`مستوى الحرارة: ${form.heat}/5 ${'🌶️'.repeat(form.heat) || 'لا يوجد'}`}>
                  <input type="range" min={0} max={5} step={1}
                    value={form.heat} onChange={e => set('heat', e.target.value)}
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                    <span>0 — لا حرارة</span><span>5 — ناري!</span>
                  </div>
                </Field>
              </div>

              {/* Tags */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="الوسوم (مفصولة بفاصلة)">
                  <input value={form.tags} onChange={e => set('tags', e.target.value)}
                    placeholder="حار, جديد, Samyang, كلاسيك"
                    style={inputStyle(false)}
                    onFocus={e => e.target.style.borderColor = '#e8002d'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </Field>
              </div>

              {/* Toggles */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[['inStock', 'متاح في المخزون']].map(([field, label]) => (
                  <label key={field} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <div onClick={() => set(field, !form[field])} style={{ width: 48, height: 26, borderRadius: 13, cursor: 'pointer', background: form[field] ? '#e8002d' : '#d1d5db', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, transition: 'right 0.2s', right: form[field] ? 4 : 24, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>{label}</span>
                  </label>
                ))}
              </div>

              {/* Preview */}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ background: '#f8f9fb', borderRadius: 12, padding: 16, border: '1px dashed #e5e7eb' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', marginBottom: 10 }}>معاينة المنتج</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg, #fff5f5, #f0f4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                      {form.emoji || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>{form.name || 'اسم المنتج'}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{form.brand || 'العلامة التجارية'} • {form.category}</div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: '#e8002d', marginTop: 2 }}>
                        {form.price ? `${Number(form.price).toFixed(2)} ر.س` : '0.00 ر.س'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, borderTop: '2px solid #f3f4f6', paddingTop: 20 }}>
              <button type="submit" style={{ flex: 1, padding: '13px 20px', background: '#e8002d', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#b5001f'}
                onMouseLeave={e => e.currentTarget.style.background = '#e8002d'}
              >
                ✅ إضافة المنتج للمتجر
              </button>
              <button type="button" onClick={() => { setForm(EMPTY_FORM); setErrors({}); }}
                style={{ padding: '13px 24px', background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              >
                مسح النموذج
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
