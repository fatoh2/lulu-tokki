import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { t, lang, isRTL } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', city: '', district: '', street: '', building: '', notes: '' });
  const [errors, setErrors] = useState({});

  const shipping = totalPrice >= 100 ? 0 : 15;
  const total = totalPrice + shipping;

  const paymentMethods = [
    { id: 'cod', label: t('pmCod'), icon: '💵', desc: t('pmCodDesc') },
    { id: 'credit', label: t('pmCredit'), icon: '💳', desc: t('pmCreditDesc') },
    { id: 'stcpay', label: t('pmStc'), icon: '📱', desc: t('pmStcDesc') },
  ];

  const update = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t('nameRequired');
    if (!form.phone.trim()) e.phone = t('phoneRequired');
    else if (!/^[0-9+\s\-]{7,15}$/.test(form.phone.trim())) e.phone = t('phoneInvalid');
    if (!form.city.trim()) e.city = t('cityRequired');
    if (!form.street.trim()) e.street = t('streetRequired');
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error(t('formError'), { style: { fontFamily: 'Cairo, sans-serif', direction: isRTL ? 'rtl' : 'ltr' } });
      return;
    }
    setSubmitted(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (items.length === 0 && !submitted) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 10 }}>{t('emptyCartTitle')}</h2>
        <Link to="/store" style={{ display: 'inline-block', padding: '12px 32px', background: '#e8002d', color: 'white', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>
          {t('backToStoreBtn')}
        </Link>
      </div>
    );
  }

  if (submitted) {
    const thankYou = lang === 'ar'
      ? <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>شكراً لك يا <strong style={{ color: '#1a1a2e' }}>{form.name}</strong>!</p>
      : <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>Thank you, <strong style={{ color: '#1a1a2e' }}>{form.name}</strong>!</p>;
    const contactMsg = lang === 'ar'
      ? <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>سنتواصل معك على <strong style={{ color: '#1a1a2e' }}>{form.phone}</strong> لتأكيد الطلب. وجباتك الكورية في طريقها إليك! 🇰🇷</p>
      : <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>We'll contact you at <strong style={{ color: '#1a1a2e' }}>{form.phone}</strong> to confirm your order. Your Korean snacks are on the way! 🇰🇷</p>;

    return (
      <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ background: 'white', borderRadius: 24, padding: 48, boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontWeight: 800, fontSize: 26, color: '#1a1a2e', marginBottom: 10 }}>{t('orderSuccessTitle')}</h2>
          {thankYou}
          {contactMsg}
          <div style={{ background: '#f8f9fb', borderRadius: 12, padding: '16px 24px', marginBottom: 32 }}>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{t('orderTotalLabel')}</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#e8002d' }}>{total.toFixed(2)} {t('currency')}</div>
          </div>
          <Link to="/store" style={{ display: 'inline-block', padding: '14px 40px', background: '#e8002d', color: 'white', textDecoration: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16 }}>
            {t('shopAgainBtn')}
          </Link>
        </div>
      </div>
    );
  }

  const Field = ({ label, required, error, children }) => (
    <div>
      <label style={{ display: 'block', fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#e8002d' }}>*</span>}
      </label>
      {children}
      {error && <div style={{ fontSize: 12, color: '#e8002d', marginTop: 4, fontWeight: 600 }}>⚠ {error}</div>}
    </div>
  );

  const inputStyle = (hasError) => ({
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `2px solid ${hasError ? '#e8002d' : '#e5e7eb'}`,
    fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a1a2e',
    outline: 'none', boxSizing: 'border-box', background: 'white', transition: 'border-color 0.2s',
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Link to="/cart" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>{t('backToCartLink')}</Link>
        <span style={{ color: '#d1d5db' }}>|</span>
        <h1 style={{ fontWeight: 800, fontSize: 24, color: '#1a1a2e', margin: 0 }}>{t('checkoutTitle')}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Personal Info */}
            <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontWeight: 800, fontSize: 17, color: '#1a1a2e', marginTop: 0, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #f3f4f6' }}>
                {t('personalInfoTitle')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label={t('fullNameLabel')} required error={errors.name}>
                    <input value={form.name} onChange={e => update('name', e.target.value)} placeholder={t('namePlaceholder')} style={inputStyle(!!errors.name)} onFocus={e => { if (!errors.name) e.target.style.borderColor = '#e8002d'; }} onBlur={e => { if (!errors.name) e.target.style.borderColor = '#e5e7eb'; }} />
                  </Field>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label={t('phoneLabel')} required error={errors.phone}>
                    <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder={t('phonePlaceholder')} type="tel" style={inputStyle(!!errors.phone)} onFocus={e => { if (!errors.phone) e.target.style.borderColor = '#e8002d'; }} onBlur={e => { if (!errors.phone) e.target.style.borderColor = '#e5e7eb'; }} />
                  </Field>
                </div>
              </div>
            </div>

            {/* Address */}
            <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontWeight: 800, fontSize: 17, color: '#1a1a2e', marginTop: 0, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #f3f4f6' }}>
                {t('addressTitle')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label={t('cityLabel')} required error={errors.city}>
                  <input value={form.city} onChange={e => update('city', e.target.value)} placeholder={t('cityPlaceholder')} style={inputStyle(!!errors.city)} onFocus={e => { if (!errors.city) e.target.style.borderColor = '#e8002d'; }} onBlur={e => { if (!errors.city) e.target.style.borderColor = '#e5e7eb'; }} />
                </Field>
                <Field label={t('districtLabel')}>
                  <input value={form.district} onChange={e => update('district', e.target.value)} placeholder={t('districtPlaceholder')} style={inputStyle(false)} onFocus={e => e.target.style.borderColor = '#e8002d'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </Field>
                <Field label={t('streetLabel')} required error={errors.street}>
                  <input value={form.street} onChange={e => update('street', e.target.value)} placeholder={t('streetPlaceholder')} style={inputStyle(!!errors.street)} onFocus={e => { if (!errors.street) e.target.style.borderColor = '#e8002d'; }} onBlur={e => { if (!errors.street) e.target.style.borderColor = '#e5e7eb'; }} />
                </Field>
                <Field label={t('buildingLabel')}>
                  <input value={form.building} onChange={e => update('building', e.target.value)} placeholder={t('buildingPlaceholder')} style={inputStyle(false)} onFocus={e => e.target.style.borderColor = '#e8002d'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </Field>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label={t('notesLabel')}>
                    <textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder={t('notesPlaceholder')} rows={3} style={{ ...inputStyle(false), resize: 'vertical', fontFamily: 'Cairo, sans-serif' }} onFocus={e => e.target.style.borderColor = '#e8002d'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </Field>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontWeight: 800, fontSize: 17, color: '#1a1a2e', marginTop: 0, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #f3f4f6' }}>
                {t('paymentTitle')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {paymentMethods.map(pm => (
                  <label key={pm.id} onClick={() => setPaymentMethod(pm.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, border: `2px solid ${paymentMethod === pm.id ? '#e8002d' : '#e5e7eb'}`, background: paymentMethod === pm.id ? '#fff0f2' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: `2px solid ${paymentMethod === pm.id ? '#e8002d' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {paymentMethod === pm.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e8002d' }} />}
                    </div>
                    <span style={{ fontSize: 22 }}>{pm.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>{pm.label}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{pm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ position: 'sticky', top: 84 }}>
            <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e', marginTop: 0, marginBottom: 20 }}>{t('orderSummaryTitle')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20, maxHeight: 280, overflowY: 'auto' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg, #fff5f5, #f0f4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{item.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }} className="line-clamp-2">{item.name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>× {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#1a1a2e', flexShrink: 0 }}>{(item.price * item.quantity).toFixed(2)} {t('currency')}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '2px solid #f3f4f6', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                  <span>{t('subtotal')}</span>
                  <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{totalPrice.toFixed(2)} {t('currency')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                  <span>{t('shippingLabel')}</span>
                  <span style={{ fontWeight: 700, color: shipping === 0 ? '#16a34a' : '#1a1a2e' }}>
                    {shipping === 0 ? t('freeLabel') : `${shipping.toFixed(2)} ${t('currency')}`}
                  </span>
                </div>
                <div style={{ borderTop: '2px solid #f3f4f6', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800 }}>
                    <span style={{ color: '#1a1a2e' }}>{t('totalLabel')}</span>
                    <span style={{ color: '#e8002d' }}>{total.toFixed(2)} {t('currency')}</span>
                  </div>
                </div>
              </div>
              <button type="submit" style={{ width: '100%', marginTop: 20, padding: '14px 20px', background: '#e8002d', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#b5001f'}
                onMouseLeave={e => e.currentTarget.style.background = '#e8002d'}
              >
                {t('confirmOrderBtn')}
              </button>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#9ca3af', fontSize: 12 }}>
                <span>🔒</span><span>{t('secureInfo')}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
