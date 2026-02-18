# Cloudflare Images Transformation Worker

A reusable Cloudflare Worker for automatic image optimization and transformation. This worker provides on-the-fly image processing with automatic format negotiation, responsive resizing, and intelligent caching.

## Features

- **Automatic Format Negotiation**: Serves AVIF to supported browsers, falls back to WebP, then JPEG
- **Responsive Resizing**: Resize images on-demand via URL parameters
- **Quality Optimization**: Intelligent quality settings with slow-connection detection
- **Global CDN Caching**: Leverages Cloudflare's edge network for fast delivery
- **Two URL Formats**: Path-based (`/cdn-cgi/imageoptim/...`) or query parameters
- **Security**: Origin validation prevents unauthorized external image fetching
- **Graceful Fallback**: Returns original image if transformation fails

## Prerequisites

1. **Cloudflare Account** with Workers enabled
2. **Image Transformations** enabled for your zone (Dashboard > Images > Transformations)
3. **Node.js 16.17+** and npm installed
4. **Wrangler CLI** (`npm install -g wrangler`)

## Quick Start

### 1. Install Dependencies

```bash
cd workers/image-transform
npm install
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

### 3. Configure Your Zone

Edit `wrangler.toml` and uncomment/configure the routes for your domain:

```toml
[[routes]]
pattern = "www.verticalconsulting.net/cdn-cgi/imageoptim/*"
zone_name = "verticalconsulting.net"

[[routes]]
pattern = "www.verticalconsulting.net/images/*"
zone_name = "verticalconsulting.net"
```

### 4. Deploy

```bash
# Development (workers.dev subdomain)
npm run dev

# Production
npm run deploy:production
```

## Usage

### Path-Based Format (Recommended)

```
/cdn-cgi/imageoptim/[OPTIONS]/[IMAGE_PATH]
```

**Examples:**

```html
<!-- Resize to 800px width -->
<img src="/cdn-cgi/imageoptim/width=800/images/photo.jpg">

<!-- Resize with quality control -->
<img src="/cdn-cgi/imageoptim/width=800,quality=75/images/photo.jpg">

<!-- Multiple transformations -->
<img src="/cdn-cgi/imageoptim/width=400,height=300,fit=cover,gravity=face/images/portrait.jpg">
```

### Query Parameter Format

```
/images/photo.jpg?width=800&quality=75&format=auto
```

**Examples:**

```html
<!-- Basic resize -->
<img src="/images/photo.jpg?width=800">

<!-- With format auto-negotiation -->
<img src="/images/photo.jpg?width=800&format=auto">

<!-- Responsive with DPR -->
<img src="/images/photo.jpg?width=400&dpr=2">
```

## Transformation Options

### Dimensions

| Parameter | Description | Example |
|-----------|-------------|---------|
| `width` / `w` | Maximum width in pixels | `width=800` |
| `height` / `h` | Maximum height in pixels | `height=600` |
| `dpr` | Device pixel ratio multiplier | `dpr=2` |
| `fit` | Resize mode | `fit=cover` |

**Fit Modes:**
- `scale-down` (default): Shrink only, preserve aspect ratio
- `contain`: Fit within dimensions, preserve aspect ratio
- `cover`: Fill dimensions, crop excess
- `crop`: Crop to exact dimensions
- `pad`: Add padding to reach dimensions

### Quality & Format

| Parameter | Description | Example |
|-----------|-------------|---------|
| `quality` / `q` | JPEG/WebP/AVIF quality (1-100) | `quality=80` |
| `format` / `f` | Output format | `format=webp` |
| `compression` | Speed vs size tradeoff | `compression=fast` |

**Format Options:**
- `auto`: Negotiate best format based on browser support
- `avif`: Modern format, smallest size
- `webp`: Good compression, wide support
- `jpeg`: Universal compatibility
- `json`: Return image metadata only

### Visual Effects

| Parameter | Description | Range |
|-----------|-------------|-------|
| `blur` | Gaussian blur | 1-250 |
| `sharpen` | Sharpening | 0-10 |
| `brightness` | Brightness adjustment | 0.0-2.0 (1.0 = no change) |
| `contrast` | Contrast adjustment | 0.0-2.0 |
| `saturation` | Color saturation | 0.0-2.0 (0 = grayscale) |

### Transformations

| Parameter | Description | Values |
|-----------|-------------|--------|
| `rotate` | Rotation | `90`, `180`, `270` |
| `flip` | Mirror image | `h`, `v`, `hv` |
| `trim` | Trim borders | Pixels or `auto` |
| `background` / `bg` | Background color | CSS color |

### Focal Point & Cropping

| Parameter | Description | Values |
|-----------|-------------|--------|
| `gravity` / `g` | Crop focal point | `auto`, `face`, `left`, `right`, `top`, `bottom`, or `0.5x0.5` |

### Metadata & Animation

| Parameter | Description | Values |
|-----------|-------------|--------|
| `metadata` | EXIF handling | `copyright`, `keep`, `none` |
| `anim` | Preserve animation | `true`, `false` |

## Configuration

### Environment Variables

Configure in `wrangler.toml`:

```toml
[vars]
IMAGE_QUALITY = "85"          # Default quality (1-100)
IMAGE_MAX_WIDTH = "2400"      # Maximum allowed width
IMAGE_MAX_HEIGHT = "2400"     # Maximum allowed height
IMAGE_CACHE_TTL = "604800"    # Cache duration in seconds (1 week)
ALLOWED_ORIGINS = ""          # Comma-separated allowed external origins
```

### Per-Environment Config

```toml
[env.production.vars]
IMAGE_QUALITY = "85"

[env.staging.vars]
IMAGE_QUALITY = "70"
```

## Integration with Websites

### HTML srcset for Responsive Images

```html
<img
  src="/cdn-cgi/imageoptim/width=800/images/hero.jpg"
  srcset="
    /cdn-cgi/imageoptim/width=400/images/hero.jpg 400w,
    /cdn-cgi/imageoptim/width=800/images/hero.jpg 800w,
    /cdn-cgi/imageoptim/width=1200/images/hero.jpg 1200w,
    /cdn-cgi/imageoptim/width=1600/images/hero.jpg 1600w
  "
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px"
  alt="Hero image"
  loading="lazy"
>
```

### Picture Element with Format Fallbacks

```html
<picture>
  <source
    type="image/avif"
    srcset="/cdn-cgi/imageoptim/width=800,format=avif/images/photo.jpg"
  >
  <source
    type="image/webp"
    srcset="/cdn-cgi/imageoptim/width=800,format=webp/images/photo.jpg"
  >
  <img
    src="/cdn-cgi/imageoptim/width=800/images/photo.jpg"
    alt="Photo"
  >
</picture>
```

### CSS Background Images

```css
.hero {
  background-image: url('/cdn-cgi/imageoptim/width=1920,quality=80/images/hero-bg.jpg');
}

@media (max-width: 768px) {
  .hero {
    background-image: url('/cdn-cgi/imageoptim/width=768,quality=75/images/hero-bg.jpg');
  }
}
```

### JavaScript Dynamic Loading

```javascript
function getOptimizedUrl(imagePath, options = {}) {
  const params = Object.entries(options)
    .map(([k, v]) => `${k}=${v}`)
    .join(',');
  return `/cdn-cgi/imageoptim/${params}/${imagePath}`;
}

// Usage
const url = getOptimizedUrl('images/photo.jpg', {
  width: 800,
  quality: 80,
  format: 'auto'
});
```

## Performance Best Practices

1. **Use `format=auto`**: Let the worker negotiate the best format
2. **Set appropriate `width`**: Don't request larger than needed
3. **Use `loading="lazy"`**: Defer off-screen images
4. **Implement `srcset`**: Serve appropriate sizes for devices
5. **Cache aggressively**: Default 1-week cache is optimal

## Troubleshooting

### Images Not Transforming

1. Verify Image Transformations is enabled in Cloudflare Dashboard
2. Check worker routes are correctly configured
3. Ensure the image path is correct
4. Check worker logs: `wrangler tail`

### 403 Forbidden on External Images

Add the external origin to `ALLOWED_ORIGINS` in wrangler.toml:

```toml
[vars]
ALLOWED_ORIGINS = "https://example.com,https://cdn.example.com"
```

### Poor Quality Output

- Increase `quality` parameter (default is 85)
- Check source image quality
- Use `compression=fast` for speed over quality

## Pricing

Cloudflare Images Transformations:
- **Free**: 5,000 unique transformations/month
- **Paid**: $0.50 per 1,000 additional unique transformations

A "unique transformation" = unique combination of image + parameters. The same image at `width=400` and `width=800` counts as 2 transformations.

## Files

```
workers/image-transform/
├── src/
│   └── index.js        # Main worker code
├── wrangler.toml       # Cloudflare configuration
├── package.json        # Node.js dependencies
└── README.md           # This documentation
```

## License

MIT License - Free to use and modify for your projects.
