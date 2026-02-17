# SEO Testing Guide - Post-Deployment Validation

After deploying your SEO updates, use this guide to verify everything is working correctly.

---

## 🧪 Testing Checklist

### 1. Social Media Preview Testing

#### Facebook Debug Tool
**URL**: https://developers.facebook.com/tools/debug/

Test these pages:
- [ ] https://www.verticalconsulting.net/services.html
- [ ] https://www.verticalconsulting.net/contact.html
- [ ] https://www.verticalconsulting.net/grace-ai-receptionist.html

**Expected Result**: Rich preview with title, description, and image

---

#### Twitter Card Validator
**URL**: https://cards-dev.twitter.com/validator

Test the same pages above.

**Expected Result**: Summary card with preview

---

#### LinkedIn Post Inspector
**URL**: https://www.linkedin.com/post-inspector/

Test the same pages above.

**Expected Result**: Professional preview card

---

### 2. Structured Data Validation

#### Google Rich Results Test
**URL**: https://search.google.com/test/rich-results

Test these pages:
- [ ] https://www.verticalconsulting.net/ (LocalBusiness)
- [ ] https://www.verticalconsulting.net/services.html (Service)
- [ ] https://www.verticalconsulting.net/contact.html (ContactPage)
- [ ] https://www.verticalconsulting.net/grace-ai-receptionist.html (Product)

**Expected Result**: "Page is eligible for rich results"

---

#### Schema.org Validator
**URL**: https://validator.schema.org/

Paste the HTML source or URL for each page.

**Expected Result**: No errors, valid structured data

---

### 3. Meta Tags Verification

#### View Page Source

For each updated page, view source (Ctrl+U or Cmd+U) and verify:

**services.html**:
```html
✓ <meta name="robots" content="index, follow">
✓ <link rel="canonical" href="https://www.verticalconsulting.net/services.html">
✓ <meta property="og:title" content="...">
✓ <meta property="og:description" content="...">
✓ <meta property="og:image" content="...">
✓ <meta name="twitter:card" content="summary_large_image">
```

**contact.html**:
```html
✓ <meta name="robots" content="index, follow">
✓ <link rel="canonical" href="https://www.verticalconsulting.net/contact.html">
✓ <meta property="og:title" content="...">
✓ <script type="application/ld+json"> (ContactPage schema)
```

**grace-ai-receptionist.html**:
```html
✓ <meta name="robots" content="index, follow">
✓ <link rel="canonical" href="https://www.verticalconsulting.net/grace-ai-receptionist.html">
✓ <meta property="og:type" content="product">
```

---

### 4. Font Loading Verification

Open DevTools Network tab (F12), reload page, filter by "font":

**Expected**:
- ✅ 1 request to fonts.googleapis.com (combined)
- ❌ NOT 4 separate font requests

**Verify on**:
- [ ] services.html
- [ ] contact.html
- [ ] grace-ai-receptionist.html

---

### 5. Page Speed & Core Web Vitals

#### PageSpeed Insights
**URL**: https://pagespeed.web.dev/

Test each page and note scores:

| Page | Mobile | Desktop | LCP | CLS | FID |
|------|--------|---------|-----|-----|-----|
| services.html | ? | ? | ? | ? | ? |
| contact.html | ? | ? | ? | ? | ? |
| grace-ai.html | ? | ? | ? | ? | ? |

**Goal**: 90+ scores, green metrics

---

### 6. Sitemap & Robots Validation

#### Sitemap
- [ ] Visit: https://www.verticalconsulting.net/sitemap.xml
- [ ] Verify XML loads without errors
- [ ] Confirm updated pages are listed
- [ ] Check lastmod dates (should be 2026-02-04)

#### Robots.txt
- [ ] Visit: https://www.verticalconsulting.net/robots.txt
- [ ] Verify: `User-agent: *` and `Allow: /`
- [ ] Confirm sitemap reference exists

---

### 7. Mobile-Friendly Test

**URL**: https://search.google.com/test/mobile-friendly

Test all three pages.

**Expected Result**: "Page is mobile-friendly"

---

## 🔍 Google Search Console Verification

### After Submitting Sitemap

1. **Coverage Report**
   - Navigate to: Coverage → Valid
   - Check that updated pages appear
   - Goal: No errors or warnings

2. **URL Inspection**
   - Test each updated page
   - Click "Request Indexing" if needed
   - Verify "URL is on Google"

3. **Enhancement Reports**
   - Check: Structured Data
   - Verify: No errors for LocalBusiness, Service, Product schemas

---

## 📊 Monitoring Schedule

### First Week
- [ ] Day 1: Deploy and run all tests above
- [ ] Day 3: Check Google Search Console for re-crawl
- [ ] Day 7: Verify rich snippets appearing in search

### First Month
- [ ] Week 2: Monitor indexing status
- [ ] Week 4: Review ranking changes
- [ ] Ongoing: Track social media share previews

---

## ❌ Troubleshooting

### Issue: Social preview not showing image

**Causes**:
1. Image URL incorrect or broken
2. Image file doesn't exist
3. Cloudflare caching old version

**Fix**:
1. Verify image URL in browser
2. Force Facebook/Twitter to re-scrape
3. Clear Cloudflare cache if needed

---

### Issue: Structured data errors

**Causes**:
1. JSON syntax error (missing comma, quote)
2. Invalid schema type
3. Required fields missing

**Fix**:
1. Use JSON validator
2. Check Schema.org documentation
3. Use Google's Rich Results Test

---

### Issue: Canonical URL warning in Search Console

**Causes**:
1. HTTP vs HTTPS mismatch
2. www vs non-www mismatch
3. Trailing slash inconsistency

**Fix**:
1. Ensure all canonicals use https://www.
2. Match URL format exactly
3. Update sitemap URLs to match

---

## ✅ Success Criteria

Your SEO implementation is successful when:

- ✅ All social media previews show rich cards
- ✅ Google Rich Results Test shows no errors
- ✅ PageSpeed scores are 90+
- ✅ Mobile-Friendly Test passes
- ✅ Fonts load in 1 request (not 4)
- ✅ Google Search Console shows pages indexed
- ✅ No warnings or errors in Coverage report
- ✅ Rich snippets appear in Google search results (within 7 days)

---

## 📞 Support

If tests fail or you need assistance:
- **Email**: corey@verticalconsulting.net
- **Phone**: 601-506-8818

---

**Last Updated**: February 4, 2026
