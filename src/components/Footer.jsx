import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Footer() {
  const { t, tr } = useLanguage();
  const { user } = useAuth();

  const links = [
    { label: t('footerHome'), to: '/' },
    { label: t('footerStore'), to: '/store' },
    { label: t('footerCart'), to: '/cart' },
  ];

  const legalLinks = [
    { label: tr('سياسة الخصوصية', 'Privacy Policy', 'מדיניות פרטיות'), to: '/privacy' },
    { label: tr('سياسة الإرجاع', 'Return Policy', 'מדיניות החזרות'), to: '/returns' },
    { label: tr('♿ إمكانية الوصول', '♿ Accessibility', '♿ נגישות'), to: '/accessibility' },
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
              <Logo size={38} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--brand)' }}>{t('storeName')}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Korean Snacks Store</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, margin: '0 0 12px' }}>
              {t('footerTagline')}
            </p>
            {/* Business identity */}
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
              <div>{tr('ע.מ. / ח.פ.: 000000000', 'Reg. No.: 000000000', 'ע.מ. / ח.פ.: 000000000')}</div>
              <div>{tr('باقة الغربية، إسرائيل', 'Baqa al-Gharbiyye, Israel', 'באקה אל-ע׳רביה, ישראל')}</div>
            </div>
            {/* VAT note */}
            <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '5px 10px', display: 'inline-block' }}>
              {tr('💡 جميع الأسعار تشمل مע"מ', '💡 All prices include VAT', '💡 כל המחירים כוללים מע״מ')}
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
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
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
              {tr('قانوني', 'Legal', 'משפטי')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {legalLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={linkStyle}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
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
          <span>🐰 {t('storeName')} © {new Date().getFullYear()} — {t('footerRights')}</span>
          <Link
            to="/accessibility"
            style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '3px 10px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            title={tr('إعلان إمكانية الوصول', 'Accessibility Statement', 'הצהרת נגישות')}
          >
            ♿ {tr('إمكانية الوصول', 'Accessibility', 'נגישות')}
          </Link>
          {user?.isAdmin && (
            <Link to="/admin" style={{ color: 'rgba(255,255,255,0.12)', fontSize: 11, textDecoration: 'none' }} title="">⚙</Link>
          )}
        </div>
      </div>
    </footer>
  );
}
