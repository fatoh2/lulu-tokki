import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const links = [
    { label: t('footerHome'), to: '/' },
    { label: t('footerStore'), to: '/store' },
    { label: t('footerCart'), to: '/cart' },
  ];

  const contacts = [
    { icon: '📧', text: t('footerEmail') },
    { icon: '📞', text: t('footerPhone') },
    { icon: '📍', text: t('footerAddress') },
    { icon: '🕐', text: t('footerHours') },
  ];

  return (
    <footer style={{ background: '#1a1a2e', color: 'white', padding: '48px 20px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>🇰🇷</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#e8002d' }}>{t('storeName')}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Korean Snacks Store</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              {t('footerTagline')}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: 14, marginTop: 0, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('footerLinksTitle')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
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
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: 14, marginTop: 0, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('footerContactTitle')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {contacts.map(item => (
                <div key={item.icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.5 }}>
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
          🇰🇷 {t('storeName')} © {new Date().getFullYear()} — {t('footerRights')}
        </div>
      </div>
    </footer>
  );
}
