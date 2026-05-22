import { useLanguage } from '../context/LanguageContext';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const { isRTL } = useLanguage();
  if (totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '…', totalPages];
    if (currentPage >= totalPages - 3) return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages];
  };

  const btn = (content, page, active = false, disabled = false) => (
    <button
      key={typeof content === 'number' ? content : content + page}
      onClick={() => !disabled && page && onPageChange(page)}
      disabled={disabled}
      style={{
        minWidth: 38,
        height: 38,
        borderRadius: 8,
        border: `2px solid ${active ? 'var(--brand)' : '#e5e7eb'}`,
        background: active ? 'var(--brand)' : 'white',
        color: active ? 'white' : disabled ? '#d1d5db' : '#374151',
        fontFamily: 'Cairo, sans-serif',
        fontWeight: 700,
        fontSize: 14,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.15s',
        padding: '0 6px',
      }}
      onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.borderColor = 'var(--brand)'; }}
      onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.borderColor = '#e5e7eb'; }}
    >
      {content}
    </button>
  );

  const prevArrow = isRTL ? '→' : '←';
  const nextArrow = isRTL ? '←' : '→';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '32px 0 8px', flexWrap: 'wrap' }}>
      {btn(prevArrow, currentPage - 1, false, currentPage === 1)}
      {getPages().map((p, i) =>
        p === '…'
          ? <span key={`ellipsis-${i}`} style={{ color: '#9ca3af', padding: '0 4px', fontWeight: 700 }}>…</span>
          : btn(p, p, p === currentPage)
      )}
      {btn(nextArrow, currentPage + 1, false, currentPage === totalPages)}
    </div>
  );
}
