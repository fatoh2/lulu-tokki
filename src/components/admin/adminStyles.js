export const ORDER_STATUS = {
  pending:   { label: 'قيد الانتظار', bg: '#fff7ed', color: '#c2410c', icon: '⏳', next: 'confirmed' },
  confirmed: { label: 'تم التأكيد',   bg: '#eff6ff', color: '#1d4ed8', icon: '✅', next: 'shipped' },
  shipped:   { label: 'تم الشحن',     bg: '#faf5ff', color: '#7e22ce', icon: '🚚', next: 'delivered' },
  delivered: { label: 'تم التوصيل',   bg: '#f0fdf4', color: '#16a34a', icon: '📦', next: null },
  cancelled: { label: 'ملغي',          bg: '#f3f4f6', color: '#6b7280', icon: '❌', next: null },
};

export const EMPTY_FORM = {
  nameAr: '', nameKo: '', nameEn: '', nameHe: '',
  description: '', price: '', category: '',
  emoji: '🍜', brand: '', weight: '', servings: '',
  heat: 0, inStock: true, stock: '', tags: '', variants: [],
};

export const toastStyle = {
  fontFamily: 'Cairo, sans-serif',
  direction: 'rtl',
  fontWeight: 600,
};

export const inputStyle = (hasError) => ({
  width: '100%', padding: '10px 12px', borderRadius: 10,
  border: `2px solid ${hasError ? 'var(--brand)' : '#e5e7eb'}`,
  fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a1a2e',
  outline: 'none', boxSizing: 'border-box', background: 'white',
  transition: 'border-color 0.2s',
});
