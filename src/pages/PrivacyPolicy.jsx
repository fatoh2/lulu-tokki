import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicy() {
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
          {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </span>
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 20, padding: '36px 40px', boxShadow: 'var(--shadow-md)' }}>
        <h1 style={{ fontWeight: 900, fontSize: 26, color: 'var(--text)', marginTop: 0, marginBottom: 8 }}>
          {lang === 'ar' ? '🔒 سياسة الخصوصية' : '🔒 Privacy Policy'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32 }}>
          {lang === 'ar' ? 'آخر تحديث: يناير 2025' : 'Last updated: January 2025'}
        </p>

        {lang === 'ar' ? (
          <div style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>1. المعلومات التي نجمعها</h2>
              <p>عند إتمام طلبك، نقوم بجمع المعلومات التالية:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>الاسم الكامل</li>
                <li>رقم الهاتف</li>
                <li>عنوان التوصيل (مدينة، حي، شارع، رقم مبنى)</li>
                <li>عنوان البريد الإلكتروني (في حال إنشاء حساب)</li>
                <li>تفاصيل الطلبات (المنتجات، الكميات، الأسعار)</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>2. كيف نستخدم معلوماتك</h2>
              <p>نستخدم المعلومات المجمعة فقط للأغراض التالية:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>معالجة طلبك وتنسيق التوصيل</li>
                <li>التواصل معك عبر واتساب لتأكيد الطلب</li>
                <li>تحسين خدماتنا وتجربة التسوق</li>
                <li>الرد على استفساراتك وطلباتك</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>3. تخزين البيانات</h2>
              <p>
                يتم تخزين بياناتك بأمان على خوادم Google Firebase (Firestore) المشفرة. لا نحتفظ ببيانات بطاقات ائتمانية.
                يتم الدفع نقداً عند الاستلام فقط.
              </p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>4. مشاركة البيانات مع أطراف ثالثة</h2>
              <p>
                <strong>لا نقوم ببيع أو تأجير أو مشاركة بياناتك الشخصية مع أي طرف ثالث</strong> لأغراض تسويقية.
                البيانات مستخدمة حصراً لمعالجة طلباتك.
              </p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>5. حقوقك</h2>
              <p>وفقاً لقانون حماية الخصوصية الإسرائيلي (תשמ"א-1981)، يحق لك:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>الاطلاع على البيانات المحفوظة عنك</li>
                <li>طلب تصحيح أي بيانات غير دقيقة</li>
                <li>طلب حذف بياناتك</li>
              </ul>
              <p style={{ marginTop: 10 }}>لممارسة هذه الحقوق، تواصل معنا عبر البريد الإلكتروني: <strong>noorabutamam304@gmail.com</strong></p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>6. ملفات تعريف الارتباط (Cookies)</h2>
              <p>
                يستخدم الموقع ملفات تعريف ارتباط محلية فقط لحفظ تفضيلاتك (اللغة، الوضع الليلي، سلة التسوق).
                لا نستخدم ملفات تعريف ارتباط للتتبع أو الإعلانات.
              </p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>7. التواصل معنا</h2>
              <p>لأي استفسارات متعلقة بالخصوصية:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>البريد الإلكتروني: noorabutamam304@gmail.com</li>
                <li>الهاتف: <span dir="ltr">+972-50-449-3660</span></li>
                <li>العنوان: باقة الغربية</li>
              </ul>
            </section>
          </div>
        ) : (
          <div style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>1. Information We Collect</h2>
              <p>When you place an order, we collect:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>Full name</li>
                <li>Phone number</li>
                <li>Delivery address (city, district, street, building)</li>
                <li>Email address (if you create an account)</li>
                <li>Order details (products, quantities, prices)</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>2. How We Use Your Information</h2>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>Processing your order and coordinating delivery</li>
                <li>Contacting you via WhatsApp to confirm the order</li>
                <li>Improving our services and shopping experience</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>3. Data Storage</h2>
              <p>Your data is securely stored on encrypted Google Firebase (Firestore) servers. We do not store credit card information. Payment is cash on delivery only.</p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>4. Third-Party Sharing</h2>
              <p><strong>We do not sell, rent, or share your personal data with any third party</strong> for marketing purposes. Data is used solely to process your orders.</p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>5. Your Rights</h2>
              <p>Under Israeli Privacy Protection Law (1981), you have the right to access, correct, or delete your data. Contact us at <strong>noorabutamam304@gmail.com</strong>.</p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>6. Cookies</h2>
              <p>We use local cookies only to save your preferences (language, dark mode, cart). We do not use tracking or advertising cookies.</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
