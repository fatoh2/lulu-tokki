import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function ReturnPolicy() {
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
          {lang === 'ar' ? 'سياسة الإلغاء والاسترجاع' : 'Return & Cancellation Policy'}
        </span>
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 20, padding: '36px 40px', boxShadow: 'var(--shadow-md)' }}>
        <h1 style={{ fontWeight: 900, fontSize: 26, color: 'var(--text)', marginTop: 0, marginBottom: 8 }}>
          {lang === 'ar' ? '↩️ سياسة الإلغاء والاسترجاع' : '↩️ Return & Cancellation Policy'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32 }}>
          {lang === 'ar' ? 'آخر تحديث: يناير 2025' : 'Last updated: January 2025'}
        </p>

        {lang === 'ar' ? (
          <div style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#eff6ff', border: '2px solid #bfdbfe', borderRadius: 14, padding: '16px 20px' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#1d4ed8', fontSize: 14 }}>
                📋 وفقاً لقانون حماية الكارتيانيت الإسرائيلي (חוק הגנת הצרכן, תשמ"א-1981) يحق لك إلغاء طلبك خلال <strong>14 يوماً</strong> من تاريخ الاستلام.
              </p>
            </div>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>1. حق الإلغاء</h2>
              <p>يحق لك إلغاء الطلب في الحالات التالية:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li><strong>قبل الشحن:</strong> إلغاء كامل بدون أي رسوم. تواصل معنا فور إرسال الطلب.</li>
                <li><strong>بعد الاستلام:</strong> إلغاء خلال 14 يوماً من تاريخ الاستلام وفق القانون الإسرائيلي.</li>
                <li><strong>منتج معيب أو خاطئ:</strong> استرجاع كامل بدون قيود زمنية.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>2. شروط الاسترجاع</h2>
              <p>لقبول طلب الاسترجاع يجب أن:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>يكون المنتج في حالته الأصلية وغير مفتوح (للمنتجات الغذائية)</li>
                <li>يكون التواصل معنا خلال 14 يوماً من تاريخ الاستلام</li>
                <li>يتضمن الطلب رقم الطلب الأصلي</li>
              </ul>
              <p style={{ marginTop: 10, background: 'var(--muted-bg)', borderRadius: 10, padding: '10px 14px', fontSize: 14 }}>
                <strong>⚠️ استثناء:</strong> المنتجات الغذائية المفتوحة لا يمكن استرجاعها لأسباب صحية وسلامة الغذاء، إلا في حالة وجود عيب في المنتج.
              </p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>3. رسوم الإلغاء</h2>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li><strong>إلغاء قبل الشحن:</strong> مجاني تماماً</li>
                <li><strong>إلغاء بعد الاستلام (خلال 14 يوم):</strong> قد تُطبَّق رسوم إدارية لا تتجاوز 5% من قيمة الطلب وفق القانون</li>
                <li><strong>منتج معيب أو خاطئ:</strong> استرداد كامل بدون أي رسوم</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>4. آلية الاسترداد</h2>
              <p>
                بما أن الدفع يتم نقداً عند الاستلام، سيتم رد المبلغ نقداً عند استلام المنتج المُعاد.
                في حالة عدم إمكانية الاسترداد المباشر، يتم التنسيق عبر واتساب لاختيار طريقة مناسبة.
              </p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>5. طريقة تقديم طلب الإلغاء</h2>
              <p>لتقديم طلب إلغاء أو استرجاع، تواصل معنا بإحدى الطرق التالية:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>
                  <strong>واتساب:</strong>{' '}
                  <a href="https://wa.me/972504493660" target="_blank" rel="noopener noreferrer" dir="ltr" style={{ color: '#25d366', textDecoration: 'none', fontWeight: 700 }}>
                    +972-50-449-3660
                  </a>
                  {' '}— الأسرع
                </li>
                <li><strong>البريد الإلكتروني:</strong> noorabutamam304@gmail.com</li>
              </ul>
              <p style={{ marginTop: 10 }}>يرجى ذكر <strong>رقم الطلب</strong> وسبب الإلغاء في رسالتك.</p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>6. الإطار القانوني</h2>
              <p>
                تعمل هذه السياسة وفق أحكام <strong>قانون حماية الكارتيانيت الإسرائيلي (חוק הגנת הצרכן, תשמ"א-1981)</strong>
                {' '}و<strong>لوائح التجارة الإلكترونية الإسرائيلية (תקנות הגנת הצרכן (ביטול עסקה), תשע"א-2010)</strong>.
                في حال وجود أي نزاع، يحق لك التوجه إلى محكمة الصلح الإسرائيلية.
              </p>
            </section>
          </div>
        ) : (
          <div style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#eff6ff', border: '2px solid #bfdbfe', borderRadius: 14, padding: '16px 20px' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#1d4ed8', fontSize: 14 }}>
                📋 Under Israeli Consumer Protection Law (1981), you have the right to cancel your order within <strong>14 days</strong> of receipt.
              </p>
            </div>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>1. Right to Cancel</h2>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li><strong>Before shipment:</strong> Full cancellation, no charges. Contact us immediately.</li>
                <li><strong>After receipt:</strong> Cancel within 14 days of delivery per Israeli law.</li>
                <li><strong>Defective or wrong item:</strong> Full refund with no time restrictions.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>2. Return Conditions</h2>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>Product must be in original, unopened condition (food items)</li>
                <li>Contact must be made within 14 days of receipt</li>
                <li>Original order reference must be included</li>
              </ul>
              <p style={{ marginTop: 10, background: 'var(--muted-bg)', borderRadius: 10, padding: '10px 14px', fontSize: 14 }}>
                <strong>⚠️ Exception:</strong> Opened food products cannot be returned for health and food safety reasons, unless the product is defective.
              </p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>3. Cancellation Fees</h2>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li><strong>Before shipment:</strong> Completely free</li>
                <li><strong>After receipt (within 14 days):</strong> An administrative fee of up to 5% of the order value may apply per Israeli law</li>
                <li><strong>Defective or wrong item:</strong> Full refund, no fees</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>4. Refund Process</h2>
              <p>Since payment is cash on delivery, refunds are issued in cash upon receiving the returned item. If direct refund isn't possible, we'll coordinate via WhatsApp to find a suitable method.</p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>5. How to Cancel</h2>
              <p>To request a cancellation or return, contact us via:</p>
              <ul style={{ paddingInlineStart: 24, marginTop: 8 }}>
                <li>
                  <strong>WhatsApp:</strong>{' '}
                  <a href="https://wa.me/972504493660" target="_blank" rel="noopener noreferrer" dir="ltr" style={{ color: '#25d366', textDecoration: 'none', fontWeight: 700 }}>
                    +972-50-449-3660
                  </a>
                  {' '}— Fastest
                </li>
                <li><strong>Email:</strong> noorabutamam304@gmail.com</li>
              </ul>
              <p style={{ marginTop: 10 }}>Please include your <strong>order reference</strong> and reason for cancellation.</p>
            </section>

            <section>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginTop: 0, marginBottom: 10 }}>6. Legal Framework</h2>
              <p>
                This policy operates under the <strong>Israeli Consumer Protection Law (1981)</strong> and the <strong>Israeli Consumer Protection Regulations (Transaction Cancellation) 2010</strong>.
                In the event of a dispute, you may contact the Israeli Small Claims Court.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
