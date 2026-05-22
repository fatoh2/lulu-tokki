import { useState, useRef, useEffect } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../firebase';
import { collection, getDocs, setDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useProducts } from '../context/ProductsContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['رامن', 'رقائق', 'حلوى', 'مشروبات', 'بسكويت'];

const ORDER_STATUS = {
  pending:   { label: 'قيد الانتظار', bg: '#fff7ed', color: '#c2410c', icon: '⏳', next: 'confirmed' },
  confirmed: { label: 'تم التأكيد',   bg: '#eff6ff', color: '#1d4ed8', icon: '✅', next: 'shipped' },
  shipped:   { label: 'تم الشحن',     bg: '#faf5ff', color: '#7e22ce', icon: '🚚', next: 'delivered' },
  delivered: { label: 'تم التوصيل',   bg: '#f0fdf4', color: '#16a34a', icon: '📦', next: null },
  cancelled: { label: 'ملغي',          bg: '#f3f4f6', color: '#6b7280', icon: '❌', next: null },
};

const EMPTY_FORM = {
  name: '', description: '', price: '', category: 'رامن',
  emoji: '🍜', brand: '', weight: '', servings: '',
  heat: 0, inStock: true, stock: '', tags: '', variants: [],
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
  const { products, addProduct, removeProduct, updateProduct, seedProducts } = useProducts();
  const [tab, setTab] = useState('list'); // 'list' | 'add'
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // ── Promo codes state ──
  const [promoCodes, setPromoCodes] = useState([]);
  const [codesLoading, setCodesLoading] = useState(true);
  const [codeForm, setCodeForm] = useState({ code: '', pct: 10, active: true });
  const [codeErrors, setCodeErrors] = useState({});
  const [editingCode, setEditingCode] = useState(null);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState(null);

  // ── Orders / Analytics shared state ──
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  // ── Order management state ──
  const [orderFilter, setOrderFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    let active = true;
    const loadCodes = async () => {
      try {
        const snap = await getDocs(collection(db, 'promoCodes'));
        const arr = [];
        snap.forEach(d => arr.push({ code: d.id, ...d.data() }));
        arr.sort((a, b) => a.code.localeCompare(b.code));
        if (active) setPromoCodes(arr);
      } finally {
        if (active) setCodesLoading(false);
      }
    };
    loadCodes();
    return () => { active = false; };
  }, []);

  const handleSaveCode = async () => {
    const errs = {};
    const code = codeForm.code.trim().toUpperCase();
    if (!code) errs.code = 'الكود مطلوب';
    if (!codeForm.pct || Number(codeForm.pct) < 1 || Number(codeForm.pct) > 100) errs.pct = 'نسبة 1–100';
    if (Object.keys(errs).length) { setCodeErrors(errs); return; }
    const entry = { pct: Number(codeForm.pct), active: codeForm.active };
    await setDoc(doc(db, 'promoCodes', code), entry);
    if (editingCode && editingCode !== code) {
      await deleteDoc(doc(db, 'promoCodes', editingCode));
      setPromoCodes(prev =>
        [...prev.filter(c => c.code !== editingCode), { code, ...entry }]
          .sort((a, b) => a.code.localeCompare(b.code))
      );
    } else if (editingCode) {
      setPromoCodes(prev => prev.map(c => c.code === code ? { code, ...entry } : c));
    } else {
      setPromoCodes(prev =>
        [...prev.filter(c => c.code !== code), { code, ...entry }]
          .sort((a, b) => a.code.localeCompare(b.code))
      );
    }
    toast.success(`${editingCode ? 'تم تحديث' : 'تم إضافة'} الكود ${code} ✅`, {
      style: { fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontWeight: 600 },
    });
    setCodeForm({ code: '', pct: 10, active: true });
    setCodeErrors({});
    setEditingCode(null);
  };

  const handleDeleteCode = async (code) => {
    await deleteDoc(doc(db, 'promoCodes', code));
    setPromoCodes(prev => prev.filter(c => c.code !== code));
    setConfirmDeleteCode(null);
    toast.success(`تم حذف الكود ${code} ✅`, {
      style: { fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontWeight: 600 },
    });
  };

  const toggleCodeActive = async (code, current) => {
    await updateDoc(doc(db, 'promoCodes', code), { active: !current });
    setPromoCodes(prev => prev.map(c => c.code === code ? { ...c, active: !current } : c));
  };

  const seedDefaultCodes = async () => {
    const defaults = [
      { code: 'HANOOK10', pct: 10, active: true },
      { code: 'HANOOK20', pct: 20, active: true },
      { code: 'WELCOME',  pct: 15, active: true },
      { code: 'KOREA',    pct: 5,  active: true },
    ];
    await Promise.all(defaults.map(({ code, ...rest }) =>
      setDoc(doc(db, 'promoCodes', code), rest)
    ));
    setPromoCodes(defaults);
    toast.success('تم إضافة الأكواد الافتراضية ✅', {
      style: { fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontWeight: 600 },
    });
  };

  const loadOrders = async () => {
    if (ordersLoaded) return;
    setOrdersLoading(true);
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      arr.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(arr);
      setOrdersLoaded(true);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedProducts();
      setSeeded(true);
    } finally {
      setSeeding(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      emoji: p.emoji,
      brand: p.brand,
      weight: p.weight ?? '',
      servings: p.servings ?? '',
      heat: p.heat ?? 0,
      inStock: p.inStock ?? true,
      stock: p.stock != null ? String(p.stock) : '',
      tags: (p.tags ?? []).join(', '),
      variants: p.variants ?? [],
    });
    setImagePreview(p.imageUrl ?? '');
    setImageFile(null);
    setErrors({});
    setTab('add');
  };

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
    setSubmitting(true);
    try {
      let imageUrl = imagePreview && !imageFile ? imagePreview : '';
      if (imageFile) {
        const targetId = editingId ?? (products.reduce((max, p) => Math.max(max, p.id), 0) + 1);
        const imgRef = storageRef(storage, `product-images/${targetId}`);
        await uploadBytes(imgRef, imageFile);
        imageUrl = await getDownloadURL(imgRef);
      }
      const stockVal = form.stock !== '' ? Number(form.stock) : null;
      const data = {
        ...form,
        price: Number(form.price),
        heat: Number(form.heat),
        stock: stockVal,
        inStock: stockVal == null ? form.inStock : stockVal > 0,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        ...(imageUrl ? { imageUrl } : {}),
      };
      if (editingId) {
        await updateProduct(editingId, data);
        toast.success(`تم تحديث "${form.name}" ✅`, {
          style: { fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontWeight: 600 },
        });
      } else {
        await addProduct(data);
        toast.success(`تم إضافة "${form.name}" بنجاح! ✅`, {
          style: { fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontWeight: 600 },
        });
      }
      setForm(EMPTY_FORM);
      setImageFile(null);
      setImagePreview('');
      setEditingId(null);
      setTab('list');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    const p = products.find(p => p.id === id);
    await removeProduct(id);
    setConfirmId(null);
    toast.success(`تم حذف "${p?.name}" ✅`, {
      style: { fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontWeight: 600 },
    });
  };

  // ── Order management computations ──
  const orderCounts = { all: orders.length };
  Object.keys(ORDER_STATUS).forEach(s => { orderCounts[s] = orders.filter(o => (o.status || 'pending') === s).length; });
  const visibleOrders = orderFilter === 'all' ? orders : orders.filter(o => (o.status || 'pending') === orderFilter);

  // ── Analytics computations ──
  const aRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const aAvg = orders.length ? aRevenue / orders.length : 0;
  const aCustomers = new Set(orders.map(o => o.phone || o.userId).filter(Boolean)).size;
  const aProdMap = {};
  orders.forEach(o => (o.items || []).forEach(item => {
    if (!aProdMap[item.id]) aProdMap[item.id] = { name: item.name, emoji: item.emoji || '🛍️', qty: 0, revenue: 0 };
    aProdMap[item.id].qty += item.quantity || 1;
    aProdMap[item.id].revenue += (item.price || 0) * (item.quantity || 1);
  }));
  const aTopProducts = Object.values(aProdMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
  const aCatMap = {};
  orders.forEach(o => (o.items || []).forEach(item => {
    const prod = products.find(pr => pr.id === item.id);
    const cat = prod?.category || 'أخرى';
    aCatMap[cat] = (aCatMap[cat] || 0) + (item.quantity || 1);
  }));
  const aCatTotal = Object.values(aCatMap).reduce((s, v) => s + v, 0) || 1;

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

      {/* Seed banner — shown when DB is empty */}
      {products.length === 0 && !seeded && (
        <div style={{ background: '#fffbeb', border: '2px solid #fbbf24', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#92400e' }}>⚠️ قاعدة البيانات فارغة</div>
            <div style={{ fontSize: 13, color: '#92400e', marginTop: 2 }}>لا يوجد منتجات في Firestore. اضغط لتعبئتها من الملف المحلي.</div>
          </div>
          <button onClick={handleSeed} disabled={seeding} style={{ padding: '10px 22px', background: '#e8002d', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 14, cursor: seeding ? 'wait' : 'pointer', opacity: seeding ? 0.7 : 1 }}>
            {seeding ? '⏳ جاري التعبئة...' : '📦 تعبئة قاعدة البيانات'}
          </button>
        </div>
      )}
      {seeded && (
        <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: 14, padding: '14px 20px', marginBottom: 20, fontWeight: 700, color: '#166534' }}>
          ✅ تم تعبئة قاعدة البيانات بنجاح!
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: 'white', borderRadius: 12, padding: 4, border: '1px solid #e5e7eb', width: 'fit-content' }}>
        {[['list', '📋 المنتجات'], ['add', editingId ? '✏️ تعديل' : '➕ إضافة منتج'], ['codes', '🎟️ أكواد الخصم'], ['orders', '🗂️ الطلبات'], ['analytics', '📊 الإحصاءات']].map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); if (key === 'list') { setEditingId(null); setForm(EMPTY_FORM); setErrors({}); setImageFile(null); setImagePreview(''); } if (key === 'codes') { setEditingCode(null); setCodeForm({ code: '', pct: 10, active: true }); setCodeErrors({}); } if (key === 'analytics' || key === 'orders') { loadOrders(); } }} style={{
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
                  {!p.inStock
                    ? <Badge color="#6b7280" bg="#f3f4f6">❌ نفد</Badge>
                    : p.stock != null && p.stock <= 5
                      ? <Badge color="#d97706" bg="#fffbeb">⚠️ {p.stock} فقط</Badge>
                      : <Badge color="#16a34a" bg="#f0fdf4">✅ {p.stock != null ? p.stock : '∞'}</Badge>
                  }
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {confirmId === p.id ? (
                    <>
                      <button onClick={() => handleRemove(p.id)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#e8002d', color: 'white', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>تأكيد</button>
                      <button onClick={() => setConfirmId(null)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', color: '#6b7280', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>إلغاء</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(p)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: '2px solid #dbeafe', background: '#eff6ff', color: '#003478', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#003478'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#003478'; }}
                      >✏️</button>
                      <button
                        onClick={() => setConfirmId(p.id)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: '2px solid #fee2e2', background: '#fff5f5', color: '#e8002d', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#e8002d'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#e8002d'; }}
                      >🗑️</button>
                    </>
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
              {editingId ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}
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

              {/* Image upload */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="صورة المنتج (اختياري — تحل محل الإيموجي)">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ border: '2px dashed #e5e7eb', borderRadius: 12, padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'border-color 0.2s', background: '#fafafa' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#e8002d'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>{imageFile?.name}</div>
                          <div style={{ fontSize: 12, color: '#e8002d', marginTop: 4 }}>اضغط لتغيير الصورة</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ width: 72, height: 72, borderRadius: 10, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>📷</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>اضغط لرفع صورة</div>
                          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>PNG, JPG, WEBP — بدون صورة يُستخدم الإيموجي</div>
                        </div>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
                </Field>
              </div>

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

              {/* Stock */}
              <Field label="الكمية المتوفرة (اتركه فارغاً = غير محدود)">
                <input type="number" min="0" step="1" value={form.stock} onChange={e => set('stock', e.target.value)}
                  placeholder="مثال: 10"
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

              {/* Variants */}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 8 }}>
                  أحجام العبوات (اختياري) — مثال: 1x، 3x، 6x
                </div>
                {form.variants.map((v, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <input
                      value={v.label} placeholder="الحجم (1x)"
                      onChange={e => { const vs = [...form.variants]; vs[i] = { ...vs[i], label: e.target.value }; set('variants', vs); }}
                      style={{ ...inputStyle(false), width: 80, flexShrink: 0 }}
                    />
                    <input
                      type="number" min="1" value={v.multiplier} placeholder="الكمية"
                      onChange={e => { const vs = [...form.variants]; vs[i] = { ...vs[i], multiplier: Number(e.target.value) }; set('variants', vs); }}
                      style={{ ...inputStyle(false), width: 90, flexShrink: 0 }}
                    />
                    <input
                      type="number" min="0" max="100" value={v.discountPct ?? ''} placeholder="خصم %"
                      onChange={e => { const vs = [...form.variants]; vs[i] = { ...vs[i], discountPct: e.target.value === '' ? 0 : Number(e.target.value) }; set('variants', vs); }}
                      style={{ ...inputStyle(false), width: 90, flexShrink: 0 }}
                    />
                    <button type="button" onClick={() => set('variants', form.variants.filter((_, j) => j !== i))}
                      style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #fee2e2', background: '#fff5f5', color: '#e8002d', cursor: 'pointer', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button"
                  onClick={() => set('variants', [...form.variants, { label: `${(form.variants.length + 1)}x`, multiplier: form.variants.length + 1, discountPct: 0 }])}
                  style={{ padding: '7px 16px', borderRadius: 8, border: '2px dashed #e5e7eb', background: 'white', color: '#6b7280', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13 }}>
                  + إضافة حجم
                </button>
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
              <button type="submit" disabled={submitting} style={{ flex: 1, padding: '13px 20px', background: submitting ? '#9ca3af' : '#e8002d', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 15, cursor: submitting ? 'wait' : 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#b5001f'; }}
                onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#e8002d'; }}
              >
                {submitting ? (imageFile ? '⏳ جاري رفع الصورة...' : '⏳ جاري الحفظ...') : editingId ? '💾 حفظ التعديلات' : '✅ إضافة المنتج للمتجر'}
              </button>
              <button type="button" onClick={() => { setForm(EMPTY_FORM); setErrors({}); setImageFile(null); setImagePreview(''); setEditingId(null); }}
                style={{ padding: '13px 24px', background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              >
                مسح النموذج
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Promo Codes Tab ── */}
      {tab === 'codes' && (
        <div>
          {/* Add / Edit form */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e', marginTop: 0, marginBottom: 18, paddingBottom: 12, borderBottom: '2px solid #f3f4f6' }}>
              {editingCode ? `✏️ تعديل الكود: ${editingCode}` : '➕ إضافة كود خصم'}
            </h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 5 }}>الكود <span style={{ color: '#e8002d' }}>*</span></label>
                <input
                  value={codeForm.code}
                  onChange={e => { setCodeForm(f => ({ ...f, code: e.target.value.toUpperCase() })); setCodeErrors(v => ({ ...v, code: '' })); }}
                  placeholder="مثال: SAVE15"
                  style={{ padding: '10px 12px', borderRadius: 10, border: `2px solid ${codeErrors.code ? '#e8002d' : '#e5e7eb'}`, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a1a2e', outline: 'none', width: 160, background: 'white', letterSpacing: 1 }}
                  onFocus={e => { if (!codeErrors.code) e.target.style.borderColor = '#e8002d'; }}
                  onBlur={e => { if (!codeErrors.code) e.target.style.borderColor = '#e5e7eb'; }}
                />
                {codeErrors.code && <div style={{ fontSize: 12, color: '#e8002d', marginTop: 3, fontWeight: 600 }}>⚠ {codeErrors.code}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 5 }}>نسبة الخصم % <span style={{ color: '#e8002d' }}>*</span></label>
                <input
                  type="number" min="1" max="100"
                  value={codeForm.pct}
                  onChange={e => { setCodeForm(f => ({ ...f, pct: e.target.value })); setCodeErrors(v => ({ ...v, pct: '' })); }}
                  style={{ padding: '10px 12px', borderRadius: 10, border: `2px solid ${codeErrors.pct ? '#e8002d' : '#e5e7eb'}`, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a1a2e', outline: 'none', width: 100, background: 'white' }}
                  onFocus={e => { if (!codeErrors.pct) e.target.style.borderColor = '#e8002d'; }}
                  onBlur={e => { if (!codeErrors.pct) e.target.style.borderColor = '#e5e7eb'; }}
                />
                {codeErrors.pct && <div style={{ fontSize: 12, color: '#e8002d', marginTop: 3, fontWeight: 600 }}>⚠ {codeErrors.pct}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 2 }}>
                <div onClick={() => setCodeForm(f => ({ ...f, active: !f.active }))} style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: codeForm.active ? '#e8002d' : '#d1d5db', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, transition: 'right 0.2s', right: codeForm.active ? 3 : 23, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#374151' }}>فعّال</span>
              </div>
              <div style={{ display: 'flex', gap: 8, paddingBottom: 2 }}>
                <button onClick={handleSaveCode} style={{ padding: '10px 22px', background: '#e8002d', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                  {editingCode ? '💾 حفظ' : '✅ إضافة'}
                </button>
                {editingCode && (
                  <button onClick={() => { setEditingCode(null); setCodeForm({ code: '', pct: 10, active: true }); setCodeErrors({}); }} style={{ padding: '10px 18px', background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    إلغاء
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Codes list */}
          {codesLoading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 14 }}>⏳ جاري التحميل...</div>
          ) : promoCodes.length === 0 ? (
            <div style={{ background: '#fffbeb', border: '2px solid #fbbf24', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#92400e' }}>لا توجد أكواد خصم بعد</div>
                <div style={{ fontSize: 13, color: '#92400e', marginTop: 2 }}>يمكنك إضافة الأكواد يدوياً أو تعبئة الأكواد الافتراضية.</div>
              </div>
              <button onClick={seedDefaultCodes} style={{ padding: '10px 22px', background: '#e8002d', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                🎟️ إضافة الأكواد الافتراضية
              </button>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 120px', gap: 0, background: '#f8f9fb', borderBottom: '2px solid #e5e7eb', padding: '12px 20px', fontSize: 12, fontWeight: 800, color: '#6b7280' }}>
                <span>الكود</span>
                <span>الخصم</span>
                <span>الحالة</span>
                <span>إجراء</span>
              </div>
              {promoCodes.map((c, i) => (
                <div key={c.code} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 120px', gap: 0, padding: '12px 20px', alignItems: 'center', background: i % 2 === 0 ? 'white' : '#fafafa', borderBottom: '1px solid #f3f4f6' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa'}
                >
                  <span style={{ fontWeight: 800, fontSize: 15, color: '#1a1a2e', letterSpacing: 1 }}>{c.code}</span>
                  <span style={{ fontWeight: 800, fontSize: 15, color: '#e8002d' }}>{c.pct}%</span>
                  <div>
                    <div onClick={() => toggleCodeActive(c.code, c.active)} style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: c.active ? '#e8002d' : '#d1d5db', position: 'relative', transition: 'background 0.2s', display: 'inline-block' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, transition: 'right 0.2s', right: c.active ? 3 : 23, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {confirmDeleteCode === c.code ? (
                      <>
                        <button onClick={() => handleDeleteCode(c.code)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#e8002d', color: 'white', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>تأكيد</button>
                        <button onClick={() => setConfirmDeleteCode(null)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', color: '#6b7280', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>إلغاء</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingCode(c.code); setCodeForm({ code: c.code, pct: c.pct, active: c.active }); setCodeErrors({}); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          style={{ padding: '6px 10px', borderRadius: 8, border: '2px solid #dbeafe', background: '#eff6ff', color: '#003478', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#003478'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#003478'; }}
                        >✏️</button>
                        <button onClick={() => setConfirmDeleteCode(c.code)}
                          style={{ padding: '6px 10px', borderRadius: 8, border: '2px solid #fee2e2', background: '#fff5f5', color: '#e8002d', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#e8002d'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#e8002d'; }}
                        >🗑️</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px 20px', fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
                {promoCodes.length} كود — {promoCodes.filter(c => c.active).length} فعّال
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Orders Management Tab ── */}
      {tab === 'orders' && (
        <div>
          {ordersLoading && <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', fontSize: 15 }}>⏳ جاري تحميل الطلبات...</div>}
          {!ordersLoading && ordersLoaded && (
            <>
              {/* Status filter pills */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {[['all', 'الكل'], ...Object.keys(ORDER_STATUS).map(s => [s, ORDER_STATUS[s].label])].map(([key, label]) => (
                  <button key={key} onClick={() => setOrderFilter(key)} style={{
                    padding: '6px 16px', borderRadius: 20, border: '2px solid',
                    borderColor: orderFilter === key ? '#e8002d' : '#e5e7eb',
                    background: orderFilter === key ? '#e8002d' : 'white',
                    color: orderFilter === key ? 'white' : '#374151',
                    fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  }}>
                    {label}{orderCounts[key] > 0 ? ` (${orderCounts[key]})` : ''}
                  </button>
                ))}
              </div>

              {visibleOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', fontSize: 14 }}>لا توجد طلبات في هذه الفئة</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {visibleOrders.map(order => {
                    const status = order.status || 'pending';
                    const sc = ORDER_STATUS[status] || ORDER_STATUS.pending;
                    const isExpanded = expandedOrder === order.id;
                    return (
                      <div key={order.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        {/* Header row */}
                        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                          <span style={{ background: sc.bg, color: sc.color, fontWeight: 700, fontSize: 12, padding: '4px 10px', borderRadius: 8, flexShrink: 0 }}>{sc.icon} {sc.label}</span>
                          <div style={{ flex: 1, minWidth: 160 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>{order.customerName || 'زبون'}</div>
                            <div style={{ fontSize: 12, color: '#9ca3af', direction: 'ltr' }}>{order.phone} • {new Date(order.date).toLocaleDateString('ar-IL', { month: 'short', day: 'numeric' })}</div>
                          </div>
                          {order.address?.city && <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>📍 {order.address.city}</div>}
                          <div style={{ fontWeight: 800, fontSize: 15, color: '#e8002d', flexShrink: 0 }}>{(order.total || 0).toFixed(2)} ₪</div>
                          <span style={{ fontSize: 16, color: '#9ca3af' }}>{isExpanded ? '▲' : '▼'}</span>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div style={{ borderTop: '1px solid #f3f4f6', padding: '14px 18px' }}>
                            {(order.items || []).map((item, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < (order.items.length - 1) ? '1px solid #f9fafb' : 'none' }}>
                                <span style={{ fontSize: 20 }}>{item.emoji || '🛍️'}</span>
                                <span style={{ flex: 1, fontSize: 13, color: '#374151', fontWeight: 600 }}>{item.name}</span>
                                {item.variant && <span style={{ fontSize: 11, color: '#6b7280', background: '#f3f4f6', padding: '1px 7px', borderRadius: 5 }}>{item.variant}</span>}
                                <span style={{ fontSize: 12, color: '#9ca3af' }}>× {item.quantity}</span>
                                <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e' }}>{((item.price || 0) * item.quantity).toFixed(2)} ₪</span>
                              </div>
                            ))}
                            <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#6b7280', margin: '12px 0', flexWrap: 'wrap' }}>
                              <span>مجموع: <b style={{ color: '#1a1a2e' }}>{(order.subtotal || 0).toFixed(2)} ₪</b></span>
                              {(order.discount || 0) > 0 && <span>خصم: <b style={{ color: '#16a34a' }}>-{order.discount.toFixed(2)} ₪</b></span>}
                              <span>شحن: <b style={{ color: '#1a1a2e' }}>{(order.shipping || 0) === 0 ? 'مجاني 🎉' : `${(order.shipping || 0).toFixed(2)} ₪`}</b></span>
                              {order.notes && <span>ملاحظات: <b style={{ color: '#374151' }}>{order.notes}</b></span>}
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {sc.next && (
                                <button onClick={() => handleUpdateStatus(order.id, sc.next)} style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: '#e8002d', color: 'white', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                                  {ORDER_STATUS[sc.next].icon} تحديث إلى: {ORDER_STATUS[sc.next].label}
                                </button>
                              )}
                              {status !== 'cancelled' && status !== 'delivered' && (
                                <button onClick={() => handleUpdateStatus(order.id, 'cancelled')} style={{ padding: '7px 18px', borderRadius: 8, border: '2px solid #e5e7eb', background: 'white', color: '#6b7280', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                                  ❌ إلغاء
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Analytics Tab ── */}
      {tab === 'analytics' && (
        <div>
          {ordersLoading && <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', fontSize: 15 }}>⏳ جاري تحميل البيانات...</div>}
          {!ordersLoading && !ordersLoaded && <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', fontSize: 15 }}>لا توجد بيانات</div>}
          {ordersLoaded && (
            <>
              {/* Summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                {[
                  { icon: '💰', label: 'إجمالي الإيرادات', value: `${aRevenue.toFixed(2)} ₪`, color: '#e8002d', bg: '#fff0f2' },
                  { icon: '📦', label: 'إجمالي الطلبات', value: orders.length, color: '#003478', bg: '#eff6ff' },
                  { icon: '📊', label: 'متوسط قيمة الطلب', value: `${aAvg.toFixed(2)} ₪`, color: '#7c3aed', bg: '#f5f3ff' },
                  { icon: '👥', label: 'العملاء الفريدون', value: aCustomers, color: '#16a34a', bg: '#f0fdf4' },
                ].map(({ icon, label, value, color, bg }) => (
                  <div key={label} style={{ background: 'white', borderRadius: 16, padding: '20px 22px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: `1px solid ${bg}` }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>{icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

                {/* Top 5 products */}
                <div style={{ background: 'white', borderRadius: 16, padding: 22, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontWeight: 800, fontSize: 15, color: '#1a1a2e', marginTop: 0, marginBottom: 18 }}>🏆 أكثر 5 منتجات مبيعاً</h3>
                  {aTopProducts.length === 0 ? (
                    <div style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: 20 }}>لا توجد بيانات بعد</div>
                  ) : aTopProducts.map((p, i) => (
                    <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < aTopProducts.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: i === 0 ? '#fffbeb' : '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: i === 0 ? '#d97706' : '#9ca3af', flexShrink: 0 }}>{i + 1}</div>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{p.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.revenue.toFixed(2)} ₪</div>
                      </div>
                      <Badge color="#e8002d" bg="#fff0f2">{p.qty} قطعة</Badge>
                    </div>
                  ))}
                </div>

                {/* Orders by category */}
                <div style={{ background: 'white', borderRadius: 16, padding: 22, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontWeight: 800, fontSize: 15, color: '#1a1a2e', marginTop: 0, marginBottom: 18 }}>📂 الطلبات حسب الفئة</h3>
                  {Object.keys(aCatMap).length === 0 ? (
                    <div style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: 20 }}>لا توجد بيانات بعد</div>
                  ) : Object.entries(aCatMap).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                    <div key={cat} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 5 }}>
                        <span>{cat}</span>
                        <span style={{ color: '#e8002d' }}>{count} قطعة</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: '#f3f4f6', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #e8002d, #ff6b6b)', width: `${(count / aCatTotal) * 100}%`, transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
