# Google Search Console Setup Guide

This guide will help you submit your website to Google Search Console and ensure all pages are indexed by Google.

## Prerequisites

- ✅ `sitemap.xml` file exists (located in root directory)
- ✅ `robots.txt` file exists and references sitemap
- ✅ Website is live at https://www.verticalconsulting.net

## Step 1: Verify Website Ownership

### Option A: HTML File Upload (Recommended for Static Sites)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"** or **"Add a property"**
3. Enter your website URL: `https://www.verticalconsulting.net`
4. Select **"HTML file"** verification method
5. Download the verification file (e.g., `google1234567890abcdef.html`)
6. Upload the file to your website root directory:
   ```bash
   # Copy the downloaded file to your project root
   cp ~/Downloads/google*.html C:\Users\ogDevOps\sources\verticalconsulting\
   
   # Commit and deploy
   git add google*.html
   git commit -m "chore: add Google Search Console verification file"
   git push origin master
   ```
7. Wait for Cloudflare Pages to deploy (usually 1-2 minutes)
8. Click **"Verify"** in Google Search Console

### Option B: DNS Verification (Alternative)

1. Choose **"Domain"** property type
2. Copy the TXT record provided by Google
3. Add it to your domain's DNS settings (Cloudflare DNS)
4. Wait for DNS propagation (can take up to 48 hours, usually minutes)
5. Click **"Verify"**

### Option C: Google Analytics (If Already Installed)

1. Select **"Google Analytics"** method
2. Must use the same Google account for both services
3. Click **"Verify"**

## Step 2: Submit Sitemap

Once verified:

1. In Google Search Console, navigate to **"Sitemaps"** (left sidebar)
2. Enter sitemap URL: `sitemap.xml`
3. Click **"Submit"**

Google will now:
- Discover all 18 pages listed in your sitemap
- Begin crawling and indexing your pages
- Show indexing status in the "Coverage" report

## Step 3: Request Indexing for Priority Pages

For immediate indexing of important pages:

1. Go to **"URL Inspection"** in left sidebar
2. Enter full URL of priority page (e.g., `https://www.verticalconsulting.net/grace-ai-receptionist.html`)
3. Click **"Request Indexing"**

### Recommended Priority Pages to Index First:

```
1. https://www.verticalconsulting.net/ (Homepage)
2. https://www.verticalconsulting.net/services.html
3. https://www.verticalconsulting.net/grace-ai-receptionist.html
4. https://www.verticalconsulting.net/healthcare-marketing.html
5. https://www.verticalconsulting.net/landing/ai-receptionist-jackson-ms.html
6. https://www.verticalconsulting.net/contact.html
```

**Note**: Google limits manual indexing requests. Use this for critical pages only.

## Step 4: Monitor Indexing Status

### Coverage Report

1. Navigate to **"Coverage"** or **"Pages"** in left sidebar
2. Monitor:
   - **Valid**: Successfully indexed pages
   - **Valid with warnings**: Indexed but with issues
   - **Error**: Not indexed due to errors
   - **Excluded**: Intentionally not indexed

### Expected Timeline

| Milestone | Timeline |
|-----------|----------|
| Sitemap submission | Immediate |
| Initial crawl | 1-7 days |
| Full site indexing | 1-4 weeks |
| Regular crawling | Ongoing |

## Step 5: Optimize for Faster Indexing

### A. Submit URL to Google Directly (Alternative Method)

Visit: `https://www.google.com/ping?sitemap=https://www.verticalconsulting.net/sitemap.xml`

This pings Google's servers to crawl your sitemap immediately.

### B. Use URL Inspection Tool

For new or updated pages:
1. URL Inspection → Enter URL → Request Indexing
2. Do this after major content updates

### C. Build Internal Links

Ensure all pages link to each other through navigation and contextual links. Google discovers pages faster when they're well-connected.

## Step 6: Set Up Additional Features

### Enable Email Notifications

1. Go to **"Settings"** (gear icon)
2. Enable notifications for:
   - Critical indexing issues
   - Manual actions
   - Security issues

### Add Users (Optional)

1. Go to **"Settings"** → **"Users and permissions"**
2. Add team members with appropriate access levels

### Connect to Google Analytics (Recommended)

1. Go to **"Settings"** → **"Associations"**
2. Link your Google Analytics property for deeper insights

## Verification Checklist

- [ ] Website verified in Google Search Console
- [ ] Sitemap submitted (`sitemap.xml`)
- [ ] Sitemap shows "Success" status
- [ ] No errors in Coverage report
- [ ] Priority pages requested for indexing
- [ ] Email notifications enabled
- [ ] Google Analytics connected (optional)

## Troubleshooting

### Sitemap Not Found Error

**Cause**: Sitemap URL is incorrect or file not deployed

**Fix**:
```bash
# Verify sitemap is accessible
curl https://www.verticalconsulting.net/sitemap.xml

# Ensure it's deployed
git status
git push origin master
```

### Pages Not Indexing

**Common Causes**:
1. `robots.txt` blocking Google (check: `https://www.verticalconsulting.net/robots.txt`)
2. `noindex` meta tag in HTML
3. Low-quality content (rare for business sites)
4. Duplicate content issues

**Fix**:
- Use URL Inspection tool to see exact error
- Check page source for meta robots tags
- Ensure content is unique and valuable

### "Crawled - Currently Not Indexed"

**Meaning**: Google found the page but hasn't indexed it yet

**Fix**:
- Improve page content quality
- Add more internal links to the page
- Request indexing via URL Inspection tool
- Be patient (can take weeks for new sites)

## Maintenance

### Regular Tasks

**Weekly**:
- Check for new indexing errors

**Monthly**:
- Review Coverage report
- Update sitemap dates after major changes
- Check Core Web Vitals

**After Major Updates**:
- Request re-indexing for changed pages
- Update sitemap `lastmod` dates
- Submit updated sitemap

### Updating Sitemap

When you add/remove pages:

1. Edit `sitemap.xml` to add/remove URLs
2. Update `lastmod` dates to current date
3. Commit and deploy:
   ```bash
   git add sitemap.xml
   git commit -m "chore: update sitemap with new pages"
   git push origin master
   ```
4. Google Search Console will auto-detect changes (or resubmit manually)

## Additional Resources

- [Google Search Console Help](https://support.google.com/webmasters/)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Cloudflare SEO Guide](https://www.cloudflare.com/learning/seo/)

## Support

For issues specific to this website, contact:
- **Email**: corey@5hughes.com
- **Website**: https://www.verticalconsulting.net/contact.html

---

**Last Updated**: February 4, 2026
