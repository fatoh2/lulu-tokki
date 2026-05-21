import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const links = [
    { label: t('footerHome'), to: '/' },
    { label: t('footerStore'), to: '/store' },
    { label: t('footerCart'), to: '/cart' },
  ];

  const legalLinks = [
    { label: lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', to: '/privacy' },
    { label: lang === 'ar' ? 'سياسة الإرجاع' : 'Return Policy', to: '/returns' },
    { label: lang === 'ar' ? '♿ إمكانية الوصول' : '♿ Accessibility', to: '/accessibility' },
  ];

  const contacts = [
    { icon: '📧', text: t('footerEmail') },
    { icon: '📞', text: t('footerPhone'), ltr: true },
    { icon: '📍', text: t('footerAddress') },
    { icon: '🕐', text: t('footerHours') },
  ];

  const headingStyle = { color: 'white', fontWeight: 800, fontSize: 14, marginTop: 0, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: 0.5 };
  const linkStyle = { color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' };

  return (
    <footer style={{ background: '#1a1a2e', color: 'white', padding: '48px 20px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>🇰🇷</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#e8002d' }}>{t('storeName')}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Korean Snacks Store</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, margin: '0 0 12px' }}>
              {t('footerTagline')}
            </p>
            {/* Business identity */}
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
              <div>{lang === 'ar' ? 'ע.מ. / ח.פ.: 000000000' : 'Reg. No.: 000000000'}</div>
              <div>{lang === 'ar' ? 'قلنسوة، إسرائيل' : 'Qalansawe, Israel'}</div>
            </div>
            {/* VAT note */}
            <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '5px 10px', display: 'inline-block' }}>
              {lang === 'ar' ? '💡 جميع الأسعار تشمل مع"מ' : '💡 All prices include VAT'}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={headingStyle}>
              {t('footerLinksTitle')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={linkStyle}
                  onMouseEnter={e => e.currentTarget.style.color = '#e8002d'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={headingStyle}>
              {lang === 'ar' ? 'قانوني' : 'Legal'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {legalLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={linkStyle}
                  onMouseEnter={e => e.currentTarget.style.color = '#e8002d'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={headingStyle}>
              {t('footerContactTitle')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {contacts.map(item => (
                <div key={item.icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.5 }}>
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  <span dir={item.ltr ? 'ltr' : undefined}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 16, color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
          <span>🇰🇷 {t('storeName')} © {new Date().getFullYear()} — {t('footerRights')}</span>
          <Link
            to="/accessibility"
            style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '3px 10px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            title={lang === 'ar' ? 'إعلان إمكانية الوصول' : 'Accessibility Statement'}
          >
            ♿ {lang === 'ar' ? 'إمكانية الوصول' : 'Accessibility'}
          </Link>
          {user?.isAdmin && (
            <Link to="/admin" style={{ color: 'rgba(255,255,255,0.12)', fontSize: 11, textDecoration: 'none' }} title="">⚙</Link>
          )}
        </div>
      </div>
    </footer>
  );
}
