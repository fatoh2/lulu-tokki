export default function AdminBadge({ children, color = 'var(--brand)', bg = 'var(--brand-soft)' }) {
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}
