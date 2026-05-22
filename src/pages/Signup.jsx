import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 6 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 12, color: 'var(--brand)', marginTop: 4, fontWeight: 600 }}>⚠ {error}</div>}
    </div>
  );
}

export default function Signup() {
  const { signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t('nameRequired');
    if (!form.email.trim()) e.email = t('emailRequired');
    if (form.password.length < 6) e.password = t('passwordTooShort');
    if (form.password !== form.confirm) e.confirm = t('passwordMismatch');
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const result = await signup(form.name.trim(), form.email.trim(), form.password);
    if (result.error === 'emailExists') {
      setErrors({ email: t('emailExistsError') });
    } else {
      navigate('/');
    }
  };

  const inputStyle = (hasErr) => ({
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `2px solid ${hasErr ? 'var(--brand)' : '#e5e7eb'}`, fontFamily: 'Cairo, sans-serif',
    fontSize: 14, color: '#1a1a2e', outline: 'none', boxSizing: 'border-box', background: 'white',
  });

  const focus = (field) => (e) => { if (!errors[field]) e.target.style.borderColor = 'var(--brand)'; };
  const blur  = (field) => (e) => { if (!errors[field]) e.target.style.borderColor = '#e5e7eb'; };

  return (
    <div style={{ maxWidth: 440, margin: '60px auto', padding: '0 20px' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
            <Logo size={72} />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 24, color: '#1a1a2e', margin: '0 0 6px' }}>{t('signUp')}</h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>{t('storeName')}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label={t('fullNameLabel')} error={errors.name}>
            <input value={form.name} onChange={set('name')} placeholder={t('namePlaceholder')} style={inputStyle(!!errors.name)} onFocus={focus('name')} onBlur={blur('name')} />
          </Field>
          <Field label={t('emailLabel')} error={errors.email}>
            <input type="email" value={form.email} onChange={set('email')} placeholder={t('emailPlaceholder')} style={inputStyle(!!errors.email)} onFocus={focus('email')} onBlur={blur('email')} />
          </Field>
          <Field label={t('passwordLabel')} error={errors.password}>
            <input type="password" value={form.password} onChange={set('password')} style={inputStyle(!!errors.password)} onFocus={focus('password')} onBlur={blur('password')} />
          </Field>
          <Field label={t('confirmPasswordLabel')} error={errors.confirm}>
            <input type="password" value={form.confirm} onChange={set('confirm')} style={inputStyle(!!errors.confirm)} onFocus={focus('confirm')} onBlur={blur('confirm')} />
          </Field>
          <button type="submit" style={{ padding: '13px 20px', background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 16, cursor: 'pointer', marginTop: 4, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-dark)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--brand)'}
          >
            {t('signupBtn')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280', margin: '24px 0 0' }}>
          {t('hasAccount')}{' '}
          <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 700, textDecoration: 'none' }}>{t('signIn')}</Link>
        </p>
      </div>
    </div>
  );
}
