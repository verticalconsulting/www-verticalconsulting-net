# Cloudflare Images Worker Setup Guide

This guide walks you through deploying the image transformation worker for verticalconsulting.net and your other projects.

## Prerequisites

1. **Cloudflare Account** - Sign up at https://dash.cloudflare.com
2. **Node.js 16.17+** - Check with `node --version`
3. **Domain on Cloudflare** - DNS must be proxied through Cloudflare

## Step 1: Enable Image Transformations

1. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your zone (verticalconsulting.net)
3. Navigate to **Images** > **Transformations**
4. Click **Enable for zone**

> **Note**: If you don't see the Images option, you may need to enable it in your plan settings.

## Step 2: Install Wrangler CLI

```bash
# Install globally
npm install -g wrangler

# Or use npx (no install needed)
npx wrangler --version
```

## Step 3: Authenticate with Cloudflare

```bash
wrangler login
```

This opens a browser window to authorize Wrangler.

## Step 4: Get Your Account ID

```bash
wrangler whoami
```

Copy your Account ID and add it to `wrangler.toml`:

```toml
account_id = "your-account-id-here"
```

## Step 5: Configure Routes

Edit `wrangler.toml` and configure routes for your domain:

```toml
# For path-based optimization URLs
[[routes]]
pattern = "www.verticalconsulting.net/cdn-cgi/imageoptim/*"
zone_name = "verticalconsulting.net"

# For automatic optimization of /images/* path
[[routes]]
pattern = "www.verticalconsulting.net/images/*"
zone_name = "verticalconsulting.net"
```

## Step 6: Deploy the Worker

```bash
cd workers/image-transform

# Install dependencies
npm install

# Deploy to production
npm run deploy:production
```

## Step 7: Verify Deployment

Test the worker by accessing an optimized image URL:

```
https://www.verticalconsulting.net/cdn-cgi/imageoptim/width=400,quality=80/images/vertical-v-only-logo.png
```

You should see the optimized image. Check the response headers for:
- `cf-resized: internal=ok/...` - Confirms transformation worked
- `content-type: image/webp` or `image/avif` - Modern format served

## Integration Options

### Option A: Manual URL Updates (Recommended for gradual migration)

Update image src attributes directly:

```html
<!-- Before -->
<img src="images/photo.jpg">

<!-- After -->
<img src="/cdn-cgi/imageoptim/width=800,quality=85,format=auto/images/photo.jpg">
```

### Option B: JavaScript Auto-Transformation

Add the helper script and use data attributes:

```html
<script src="workers/image-transform/src/image-helper.js"></script>

<img src="images/photo.jpg"
     data-optimize
     data-width="800"
     data-quality="85"
     data-responsive>
```

### Option C: Build-Time Transformation

For Jekyll sites, create an include file `_includes/optimized-image.html`:

```liquid
{% assign base_url = "/cdn-cgi/imageoptim" %}
{% assign options = include.width | prepend: "width=" %}
{% if include.height %}{% assign options = options | append: ",height=" | append: include.height %}{% endif %}
{% if include.quality %}{% assign options = options | append: ",quality=" | append: include.quality %}{% else %}{% assign options = options | append: ",quality=85" %}{% endif %}
{% assign options = options | append: ",format=auto" %}

<img src="{{ base_url }}/{{ options }}/{{ include.src }}"
     alt="{{ include.alt }}"
     {% if include.class %}class="{{ include.class }}"{% endif %}
     {% if include.loading %}loading="{{ include.loading }}"{% endif %}>
```

Usage:
```liquid
{% include optimized-image.html src="images/photo.jpg" width="800" alt="Photo" loading="lazy" %}
```

## Current Site: Netlify to Cloudflare Migration

Your site is currently on Netlify. To use Cloudflare Image Transformations:

### Option 1: Keep Netlify + Add Cloudflare Proxy (Recommended)

1. Add your domain to Cloudflare
2. Update nameservers at your registrar
3. Set up Cloudflare DNS to point to Netlify
4. Enable "Proxied" status (orange cloud)
5. Deploy the image worker as described above

**DNS Configuration:**
```
Type: CNAME
Name: www
Target: your-site.netlify.app
Proxy: Proxied (orange cloud)
```

### Option 2: Migrate to Cloudflare Pages

1. Connect your GitHub repo to Cloudflare Pages
2. Set build command: `bundle exec jekyll build`
3. Set output directory: `_site`
4. Deploy the image worker

### Option 3: Use Cloudflare R2 for Images

Store images in Cloudflare R2 (S3-compatible storage):

1. Create an R2 bucket
2. Upload images to R2
3. Configure the worker to serve from R2
4. Update image URLs to R2 paths

## Adding to Other Projects

The worker is designed to be reusable. For each new project:

1. Copy the `workers/image-transform` directory
2. Update `wrangler.toml` with the new domain routes
3. Deploy: `npm run deploy:production`

Or create a centralized worker that handles multiple domains:

```toml
# wrangler.toml
[[routes]]
pattern = "www.verticalconsulting.net/*"
zone_name = "verticalconsulting.net"

[[routes]]
pattern = "www.another-site.com/*"
zone_name = "another-site.com"
```

## Monitoring & Analytics

### View Worker Metrics

```bash
# Live tail logs
wrangler tail

# View in dashboard
# Dashboard > Workers > image-transform > Metrics
```

### Key Metrics to Monitor

- **Requests**: Total image transformation requests
- **CPU Time**: Processing time per request
- **Cache Hit Rate**: Percentage served from cache
- **Errors**: Failed transformations

## Troubleshooting

### "Image Transformations not enabled"

Enable in Dashboard > Images > Transformations > Enable for zone

### Worker not triggering

- Verify routes are correctly configured
- Ensure DNS is proxied (orange cloud)
- Check worker is deployed: `wrangler deployments list`

### Images not optimizing

- Check browser DevTools > Network tab
- Look for `cf-resized` response header
- Verify image format is supported (JPEG, PNG, GIF, WebP, SVG)

### 403 Forbidden on external images

Add allowed origins to `wrangler.toml`:
```toml
[vars]
ALLOWED_ORIGINS = "https://cdn.example.com,https://storage.example.com"
```

## Cost Estimation

For verticalconsulting.net (based on exploration findings):

- **Current images**: ~57 files
- **Estimated unique transformations**: ~150 (3 sizes per image average)
- **Monthly cost**: FREE (well under 5,000 free transformations)

For high-traffic sites:
- Free tier: 5,000 unique transformations/month
- Paid: $0.50 per 1,000 additional transformations

## Next Steps

1. [ ] Add domain to Cloudflare (if not already)
2. [ ] Enable Image Transformations in dashboard
3. [ ] Deploy the worker
4. [ ] Test with a single image
5. [ ] Gradually update HTML to use optimized URLs
6. [ ] Monitor performance improvements

## Performance Gains Expected

Based on the site analysis:

| Image | Current Size | Optimized (WebP) | Savings |
|-------|-------------|------------------|---------|
| testimonial-*.png | 1.4 MB | ~150 KB | 89% |
| bw-code.jpg | 5.5 MB | ~200 KB | 96% |
| islandreach-homepage.png | 5.5 MB | ~300 KB | 95% |
| torch-cay-runway.png | 2.1 MB | ~150 KB | 93% |

**Total estimated savings**: 40-50 MB -> 2-3 MB (90%+ reduction)
