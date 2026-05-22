import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Accessibility() {
  const { lang } = useLanguage();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
        <Link to="/" style={{ color: 'var(--subtext)', textDecoration: 'none', fontWeight: 600 }}>
          {lang === 'ar' ? 'الرئيسية' : 'Home'}
        </Link>
        {' › '}
        <span style={{ color: 'var(--text)', fontWeight: 700 }}>
          {lang === 'ar' ? 'إمكانية الوصول' : 'Accessibility Statement'}
        </span>
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 20, padding: '36px 40px', boxShadow: 'var(--shadow-md)' }}>
        <h1 style={{ fontWeight: 900, fontSize: 26, color: 'var(--text)', marginTop: 0, marginBottom: 8 }}>
          {lang === 'ar' ? '♿ إعلان إمكانية الوصول' : '♿ Accessibility Statement'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32 }}>
          {lang === 'ar' ? 'آخر تحديث: يناير 2025' : 'Last updated: January 2025'}
        </p>

        {lang === 'ar' ? (
          <div style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: 14, padding: '16px 20px' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#16a34a', fontSize: 14 }}>
                ✅ تلتزم Lulu Tokki بجعل موقعها الإلكتروني متاحاً لجميع المستخدمين، بما فيهم ذوو الإعاقات، وفقاً
                {' '}<strong>للمعيار الإسرائيلي SI 5568</strong> ومتطلبات{' '}
                <strong>WCAG 2.1 المستوى AA</strong>.
              </p>
            </div>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>1. مستوى إمكانية الوصول</h2>
              <p>
                نسعى إلى تحقيق المستوى <strong>AA</strong> وفق معايير WCAG 2.1 (إرشادات إمكانية الوصول لمحتوى الويب)،
                وهو المستوى المطلوب بموجب التشريع الإسرائيلي (תקנות שוויון זכויות לאנשים עם מוגבלות, תשע"ג-2013).
              </p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>2. ما تم تطبيقه</h2>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>دعم القراءة من اليمين إلى اليسار (RTL) للغة العربية</li>
                <li>ألوان بتباين كافٍ بين النص والخلفية</li>
                <li>أحجام خطوط واضحة وقابلة للتوسيع</li>
                <li>وصف نصي بديل (alt text) للصور الجوهرية</li>
                <li>تسميات واضحة لجميع حقول النماذج</li>
                <li>دعم التنقل بلوحة المفاتيح للعناصر التفاعلية الرئيسية</li>
                <li>وضع ليلي (داكن) لتقليل إجهاد العين</li>
                <li>بنية صفحة منطقية بعناوين هرمية (H1، H2، H3)</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>3. القيود المعروفة</h2>
              <p>نعمل على تحسين الموقع باستمرار. القيود الحالية التي نعلم بها:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>بعض صور المنتجات لا تحتوي على وصف نصي بديل كامل — قيد جارٍ معالجته</li>
                <li>التنقل الكامل بلوحة المفاتيح لبعض المكونات التفاعلية قيد التطوير</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>4. التقنيات المساعدة</h2>
              <p>الموقع متوافق مع:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>قارئات الشاشة: NVDA، VoiceOver (Mac/iOS)، TalkBack (Android)</li>
                <li>التكبير في المتصفح حتى 200% دون فقدان المحتوى</li>
                <li>أوضاع التباين العالي في نظام التشغيل</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>5. الإبلاغ عن مشكلة</h2>
              <p>
                إذا واجهت أي عائق في الوصول إلى المحتوى أو الخدمات، يرجى التواصل معنا:
              </p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>البريد الإلكتروني: <strong>noorabutamam304@gmail.com</strong></li>
                <li>
                  واتساب:{' '}
                  <a href="https://wa.me/972504493660" target="_blank" rel="noopener noreferrer" dir="ltr" style={{ color: '#25d366', textDecoration: 'none', fontWeight: 700 }}>
                    +972-50-449-3660
                  </a>
                </li>
              </ul>
              <p style={{ marginTop: 10 }}>نلتزم بالرد خلال <strong>5 أيام عمل</strong>.</p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>6. الإطار القانوني</h2>
              <p>
                يتوافق هذا الإعلان مع متطلبات{' '}
                <strong>قانون المساواة في الحقوق لذوي الإعاقات الإسرائيلي (תשנ"ח-1998)</strong>
                {' '}ولوائحه التنفيذية الخاصة بالمواقع الإلكترونية.
              </p>
            </section>
          </div>
        ) : (
          <div style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: 14, padding: '16px 20px' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#16a34a', fontSize: 14 }}>
                ✅ Lulu Tokki is committed to making its website accessible to all users, including people with disabilities, in accordance with{' '}
                <strong>Israeli Standard SI 5568</strong> and <strong>WCAG 2.1 Level AA</strong>.
              </p>
            </div>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>1. Accessibility Level</h2>
              <p>
                We aim to conform to <strong>WCAG 2.1 Level AA</strong>, as required by Israeli law
                (Equal Rights for People with Disabilities Regulations, 2013).
              </p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>2. What We've Implemented</h2>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>Right-to-left (RTL) support for Arabic</li>
                <li>Sufficient color contrast between text and backgrounds</li>
                <li>Clear font sizes that can be scaled</li>
                <li>Alternative text for meaningful images</li>
                <li>Clear labels for all form fields</li>
                <li>Keyboard navigation support for main interactive elements</li>
                <li>Dark mode to reduce eye strain</li>
                <li>Logical page structure with heading hierarchy (H1, H2, H3)</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>3. Known Limitations</h2>
              <p>We are continually improving. Currently known limitations:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>Some product images lack complete alt text descriptions — being addressed</li>
                <li>Full keyboard navigation for some interactive components is in development</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>4. Assistive Technologies</h2>
              <p>The website is compatible with:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>Screen readers: NVDA, VoiceOver (Mac/iOS), TalkBack (Android)</li>
                <li>Browser zoom up to 200% without content loss</li>
                <li>High-contrast OS modes</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>5. Report an Issue</h2>
              <p>If you encounter any accessibility barrier, please contact us:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>Email: <strong>noorabutamam304@gmail.com</strong></li>
                <li>
                  WhatsApp:{' '}
                  <a href="https://wa.me/972504493660" target="_blank" rel="noopener noreferrer" dir="ltr" style={{ color: '#25d366', textDecoration: 'none', fontWeight: 700 }}>
                    +972-50-449-3660
                  </a>
                </li>
              </ul>
              <p style={{ marginTop: 10 }}>We commit to responding within <strong>5 business days</strong>.</p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>6. Legal Framework</h2>
              <p>
                This statement complies with the{' '}
                <strong>Israeli Equal Rights for People with Disabilities Law (1998)</strong>{' '}
                and its implementing regulations regarding websites.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
