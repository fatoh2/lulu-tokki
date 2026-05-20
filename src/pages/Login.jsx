import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(form.email, form.password);
    if (result.error) {
      setError(t('invalidCredentialsError'));
    } else {
      navigate(from, { replace: true });
    }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '2px solid #e5e7eb', fontFamily: 'Cairo, sans-serif',
    fontSize: 14, color: '#1a1a2e', outline: 'none', boxSizing: 'border-box', background: 'white',
  };

  return (
    <div style={{ maxWidth: 440, margin: '60px auto', padding: '0 20px' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🇰🇷</div>
          <h1 style={{ fontWeight: 800, fontSize: 24, color: '#1a1a2e', margin: '0 0 6px' }}>{t('signIn')}</h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>{t('storeName')}</p>
        </div>

        {error && (
          <div style={{ background: '#fff0f2', border: '1px solid #fecdd3', borderRadius: 10, padding: '10px 14px', color: '#e8002d', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 6 }}>{t('emailLabel')}</label>
            <input
              type="email" value={form.email} required
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(''); }}
              placeholder={t('emailPlaceholder')} style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#e8002d'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 6 }}>{t('passwordLabel')}</label>
            <input
              type="password" value={form.password} required
              onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(''); }}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#e8002d'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <button type="submit" style={{ padding: '13px 20px', background: '#e8002d', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 16, cursor: 'pointer', marginTop: 4, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#b5001f'}
            onMouseLeave={e => e.currentTarget.style.background = '#e8002d'}
          >
            {t('loginBtn')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280', margin: '24px 0 0' }}>
          {t('noAccount')}{' '}
          <Link to="/signup" style={{ color: '#e8002d', fontWeight: 700, textDecoration: 'none' }}>{t('signUp')}</Link>
        </p>
      </div>
    </div>
  );
}
