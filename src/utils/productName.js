/**
 * Get the display name of a product based on the active UI language.
 * Falls back to the legacy `name` field for backward compatibility.
 *
 * @param {object} product - Product object
 * @param {string} lang    - Active language code ('ar', 'en', 'he')
 * @returns {string}
 */
export function productName(product, lang) {
  if (!product) return '';
  if (lang === 'en') return product.nameEn || product.name || '';
  if (lang === 'he') return product.nameHe || product.nameAr || product.name || '';
  // Default: Arabic
  return product.nameAr || product.name || '';
}
