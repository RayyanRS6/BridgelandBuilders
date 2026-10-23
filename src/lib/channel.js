// Marketing channel for one "touch" (how a visit arrived), used for the GA4
// lead_channel parameter in the browser and, behind TAG_BY_FORM_PAGE, for the
// GoHighLevel channel label on the server. Pure: no window, no storage, so the
// API functions can import it too.
//
// A touch is { source, medium, campaign, gclid, gbraid, wbraid, fbclid,
// msclkid, referrer } where referrer is "host/path" without the query.

// copilot.com: Microsoft Copilot's consumer address (added 2026-10-23).
const AI_ASSISTANTS = /(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|bard\.google\.com|copilot\.microsoft\.com|copilot\.com|you\.com|phind\.com|meta\.ai|grok\.com|deepseek\.com|chat\.mistral\.ai)$/;
const SEARCH_ENGINES = /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|yahoo\.com|search\.yahoo\.com|ecosia\.org|yandex\.[a-z.]+|baidu\.com|search\.brave\.com|startpage\.com|qwant\.com)$/;
const SOCIAL = /(^|\.)(facebook\.com|fb\.com|fb\.me|m\.facebook\.com|l\.facebook\.com|lm\.facebook\.com|instagram\.com|l\.instagram\.com|linkedin\.com|lnkd\.in|tiktok\.com|youtube\.com|youtu\.be|x\.com|twitter\.com|t\.co|reddit\.com|pinterest\.[a-z.]+|threads\.net|nextdoor\.com)$/;
const SOCIAL_SOURCES = /^(facebook|fb|instagram|ig|meta|linkedin|tiktok|youtube|twitter|x|reddit|pinterest|threads|nextdoor)$/;
const PAID_MEDIUMS = /^(cpc|ppc|paid|paidsearch|paid_search|paid-search|paidsocial|paid_social|paid-social|cpm|display|ads?|retargeting)$/;
const GBP_SOURCES = /^(gbp|google_business_profile|google-business-profile|googlebusinessprofile|google_my_business|gmb|google_maps|maps)$/;

const hostOf = (referrer) => String(referrer || '').split('/')[0].toLowerCase();

/**
 * One of: google-ads, microsoft-ads, paid-social, paid-other,
 * google-business-profile, ai-assistant, organic-search, organic-social,
 * email, referral, campaign, direct.
 */
export function channelFor(touch) {
  if (!touch) return 'direct';
  const source = String(touch.source || '').toLowerCase();
  const medium = String(touch.medium || '').toLowerCase();

  if (touch.gclid || touch.gbraid || touch.wbraid) return 'google-ads';
  if (touch.msclkid) return 'microsoft-ads';
  if (GBP_SOURCES.test(source) || GBP_SOURCES.test(medium)) return 'google-business-profile';
  if (PAID_MEDIUMS.test(medium)) {
    if (SOCIAL_SOURCES.test(source)) return 'paid-social';
    if (source === 'google') return 'google-ads';
    if (source === 'bing' || source === 'microsoft') return 'microsoft-ads';
    return 'paid-other';
  }
  if (touch.fbclid && !source) return 'organic-social';
  if (medium === 'email' || source === 'newsletter') return 'email';
  if (SOCIAL_SOURCES.test(source)) return 'organic-social';

  const host = hostOf(touch.referrer);
  if (host) {
    if (AI_ASSISTANTS.test(host)) return 'ai-assistant';
    if (SEARCH_ENGINES.test(host)) return 'organic-search';
    if (SOCIAL.test(host)) return 'organic-social';
    return 'referral';
  }
  if (source) {
    if (/chatgpt|openai|perplexity|claude|gemini|copilot/.test(source)) return 'ai-assistant';
    return 'campaign';
  }
  return 'direct';
}
