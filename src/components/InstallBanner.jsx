import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem('hanook-install-dismissed') === '1'; } catch { return false; }
  });
  const { lang } = useLanguage();

  useEffect(() => {
    const handler = e => { e.preventDefault(); setPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!prompt || dismissed || !isMobile) return null;

  const handleInstall = async () => {
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') { setPrompt(null); }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try { localStorage.setItem('hanook-install-dismissed', '1'); } catch {}
  };

  return (
    <div
      className="pwa-install-banner"
      style={{
        position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
        background: '#1a1a2e', color: 'white', borderRadius: 18, padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 14, zIndex: 999,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)', maxWidth: 380, width: 'calc(100% - 40px)',
        fontFamily: 'Cairo, sans-serif', direction: lang === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      <span style={{ fontSize: 36, flexShrink: 0 }}>🇰🇷</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>
          {lang === 'ar' ? 'ثبّت التطبيق على هاتفك' : 'Install the App'}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
          {lang === 'ar' ? 'أضف هانوك سناكس لشاشتك الرئيسية' : 'Add Hanook Snacks to your home screen'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleInstall}
          style={{ padding: '8px 16px', borderRadius: 10, background: '#e8002d', color: 'white', border: 'none', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
        >
          {lang === 'ar' ? 'تثبيت' : 'Install'}
        </button>
        <button
          onClick={handleDismiss}
          style={{ padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
          title={lang === 'ar' ? 'إغلاق' : 'Close'}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
