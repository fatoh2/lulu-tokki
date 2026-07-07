import { useState, useMemo } from 'react';
import AdminBadge from './AdminBadge';
import { inputStyle } from './adminStyles';
import DailyRevenueChart from './DailyRevenueChart';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function AnalyticsTab({ orders, products, loading, loaded }) {
  const isMobile = useIsMobile();
  const [dateRange, setDateRange] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const filteredOrders = useMemo(() => {
    if (dateRange === 'all') return orders;
    const now = new Date();
    let start;
    if (dateRange === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateRange === 'week') {
      start = new Date(now);
      start.setDate(start.getDate() - 7);
    } else if (dateRange === 'month') {
      start = new Date(now);
      start.setMonth(start.getMonth() - 1);
    } else if (dateRange === 'custom') {
      const s = customStart ? new Date(customStart) : new Date(0);
      const e = customEnd ? new Date(customEnd + 'T23:59:59') : new Date();
      return orders.filter(o => {
        const d = new Date(o.date);
        return d >= s && d <= e;
      });
    }
    return orders.filter(o => new Date(o.date) >= start);
  }, [orders, dateRange, customStart, customEnd]);

  const revenue = filteredOrders.reduce((s, o) => s + (o.total || 0), 0);
  const avg = filteredOrders.length ? revenue / filteredOrders.length : 0;
  const customers = new Set(filteredOrders.map(o => o.phone || o.userId).filter(Boolean)).size;

  const prodMap = {};
  filteredOrders.forEach(o => (o.items || []).forEach(item => {
    if (!prodMap[item.id]) prodMap[item.id] = { name: item.name, emoji: item.emoji || '🛍️', qty: 0, revenue: 0 };
    prodMap[item.id].qty += item.quantity || 1;
    prodMap[item.id].revenue += (item.price || 0) * (item.quantity || 1);
  }));
  const topProducts = Object.values(prodMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

  const catMap = {};
  filteredOrders.forEach(o => (o.items || []).forEach(item => {
    const prod = products.find(pr => pr.id === item.id);
    const cat = prod?.category || 'أخرى';
    catMap[cat] = (catMap[cat] || 0) + (item.quantity || 1);
  }));
  const catTotal = Object.values(catMap).reduce((s, v) => s + v, 0) || 1;

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', fontSize: 15 }}>⏳ جاري تحميل البيانات...</div>;
  if (!loaded) return <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', fontSize: 15 }}>لا توجد بيانات</div>;

  const rangePills = [
    ['all', 'الكل'],
    ['today', 'اليوم'],
    ['week', 'آخر أسبوع'],
    ['month', 'آخر شهر'],
    ['custom', 'مخصص'],
  ];

  return (
    <div>
      {/* Date range filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {rangePills.map(([key, label]) => (
          <button key={key} onClick={() => setDateRange(key)} style={{
            padding: '6px 16px', borderRadius: 20, border: '2px solid',
            borderColor: dateRange === key ? 'var(--brand)' : '#e5e7eb',
            background: dateRange === key ? 'var(--brand)' : 'white',
            color: dateRange === key ? 'white' : '#374151',
            fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>
            {label}
          </button>
        ))}
        {dateRange === 'custom' && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} style={{ ...inputStyle(false), width: 150, fontSize: 13 }} />
            <span style={{ color: '#9ca3af', fontSize: 13 }}>إلى</span>
            <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} style={{ ...inputStyle(false), width: 150, fontSize: 13 }} />
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '💰', label: 'إجمالي الإيرادات', value: `${revenue.toFixed(2)} ₪`, color: 'var(--brand)', bg: 'var(--brand-soft)' },
          { icon: '📦', label: 'إجمالي الطلبات', value: filteredOrders.length, color: 'var(--brand-blue)', bg: '#eff6ff' },
          { icon: '📊', label: 'متوسط قيمة الطلب', value: `${avg.toFixed(2)} ₪`, color: '#7c3aed', bg: '#f5f3ff' },
          { icon: '👥', label: 'العملاء الفريدون', value: customers, color: '#16a34a', bg: '#f0fdf4' },
        ].map(({ icon, label, value, color, bg }) => (
          <div key={label} style={{ background: 'white', borderRadius: 16, padding: '20px 22px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: `1px solid ${bg}` }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Daily revenue chart */}
      <div style={{ background: 'white', borderRadius: 16, padding: 22, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 800, fontSize: 15, color: '#1a1a2e', marginTop: 0, marginBottom: 18 }}>📈 الإيرادات اليومية</h3>
        <DailyRevenueChart orders={filteredOrders} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Top 5 products */}
        <div style={{ background: 'white', borderRadius: 16, padding: 22, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: 800, fontSize: 15, color: '#1a1a2e', marginTop: 0, marginBottom: 18 }}>🏆 أكثر 5 منتجات مبيعاً</h3>
          {topProducts.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: 20 }}>لا توجد بيانات بعد</div>
          ) : topProducts.map((p, i) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topProducts.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: i === 0 ? '#fffbeb' : '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: i === 0 ? '#d97706' : '#9ca3af', flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{p.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.revenue.toFixed(2)} ₪</div>
              </div>
              <AdminBadge color="var(--brand)" bg="var(--brand-soft)">{p.qty} قطعة</AdminBadge>
            </div>
          ))}
        </div>

        {/* Category distribution */}
        <div style={{ background: 'white', borderRadius: 16, padding: 22, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: 800, fontSize: 15, color: '#1a1a2e', marginTop: 0, marginBottom: 18 }}>📂 الطلبات حسب الفئة</h3>
          {Object.keys(catMap).length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: 20 }}>لا توجد بيانات بعد</div>
          ) : Object.entries(catMap).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
            <div key={cat} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 5 }}>
                <span>{cat}</span>
                <span style={{ color: 'var(--brand)' }}>{count} قطعة</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: '#f3f4f6', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, var(--brand), #ff6b6b)', width: `${(count / catTotal) * 100}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
