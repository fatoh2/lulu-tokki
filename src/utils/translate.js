/**
 * Auto-translate text using Google Translate's free endpoint.
 * Works well for Arabic → English and Arabic → Hebrew.
 *
 * @param {string} text - Source text to translate
 * @param {string} from - Source language code (e.g., 'ar')
 * @param {string} to   - Target language code (e.g., 'en', 'he')
 * @returns {Promise<string>} Translated text, or original text on error
 */
export async function translateText(text, from, to) {
  if (!text || !text.trim()) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text.trim())}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const data = await res.json();
    // Response format: [[["translated","original",null,null,null],...],...]
    if (!data?.[0]) return text;
    const translated = data[0].map(seg => seg[0]).join('');
    if (!translated) return text;
    return translated;
  } catch {
    return text;
  }
}

/**
 * Translate Arabic text to both English and Hebrew in parallel.
 * @param {string} arabicText
 * @returns {Promise<{ en: string, he: string }>}
 */
export async function translateArToEnHe(arabicText) {
  if (!arabicText || !arabicText.trim()) return { en: '', he: '' };
  const [en, he] = await Promise.all([
    translateText(arabicText, 'ar', 'en'),
    translateText(arabicText, 'ar', 'he'),
  ]);
  return { en, he };
}
