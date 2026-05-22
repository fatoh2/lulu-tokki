export default function AdminField({ label, required, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 5 }}>
        {label}{required && <span style={{ color: 'var(--brand)' }}> *</span>}
      </label>
      {children}
      {error && <div style={{ fontSize: 12, color: 'var(--brand)', marginTop: 3, fontWeight: 600 }}>&#x26A0; {error}</div>}
    </div>
  );
}
