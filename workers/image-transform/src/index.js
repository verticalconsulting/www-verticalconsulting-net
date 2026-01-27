/**
 * Cloudflare Images Transformation Worker
 *
 * A reusable image optimization worker that provides:
 * - Automatic format negotiation (AVIF > WebP > JPEG)
 * - Responsive image resizing
 * - Quality optimization
 * - Caching with proper headers
 * - URL-based and query parameter transformations
 *
 * Usage:
 *   /cdn-cgi/imageoptim/width=800,quality=80/images/photo.jpg
 *   /images/photo.jpg?width=800&quality=80&format=auto
 */

// Default configuration - can be overridden via environment variables
const DEFAULT_CONFIG = {
  // Quality settings
  quality: 85,
  slowConnectionQuality: 60,

  // Maximum dimensions
  maxWidth: 2400,
  maxHeight: 2400,

  // Cache TTL in seconds (1 week)
  cacheTtl: 604800,

  // Allowed origins for remote images (empty = same origin only)
  allowedOrigins: [],

  // Enable format auto-negotiation
  autoFormat: true,

  // Default fit mode
  defaultFit: 'scale-down',

  // Strip metadata by default (keeps copyright)
  metadata: 'copyright',
};

/**
 * Parse transformation options from URL path
 * Format: /cdn-cgi/imageoptim/option1=value1,option2=value2/path/to/image.jpg
 */
function parsePathOptions(pathname) {
  const match = pathname.match(/^\/cdn-cgi\/imageoptim\/([^/]+)\/(.+)$/);
  if (!match) return null;

  const optionsStr = match[1];
  const imagePath = '/' + match[2];
  const options = {};

  optionsStr.split(',').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value !== undefined) {
      options[key] = value;
    }
  });

  return { options, imagePath };
}

/**
 * Parse transformation options from query parameters
 */
function parseQueryOptions(url) {
  const options = {};
  const params = url.searchParams;

  // Dimension parameters
  if (params.has('width') || params.has('w')) {
    options.width = params.get('width') || params.get('w');
  }
  if (params.has('height') || params.has('h')) {
    options.height = params.get('height') || params.get('h');
  }
  if (params.has('dpr')) {
    options.dpr = params.get('dpr');
  }

  // Quality and format
  if (params.has('quality') || params.has('q')) {
    options.quality = params.get('quality') || params.get('q');
  }
  if (params.has('format') || params.has('f')) {
    options.format = params.get('format') || params.get('f');
  }

  // Fit and positioning
  if (params.has('fit')) {
    options.fit = params.get('fit');
  }
  if (params.has('gravity') || params.has('g')) {
    options.gravity = params.get('gravity') || params.get('g');
  }

  // Effects
  if (params.has('blur')) {
    options.blur = params.get('blur');
  }
  if (params.has('sharpen')) {
    options.sharpen = params.get('sharpen');
  }
  if (params.has('brightness')) {
    options.brightness = params.get('brightness');
  }
  if (params.has('contrast')) {
    options.contrast = params.get('contrast');
  }
  if (params.has('saturation')) {
    options.saturation = params.get('saturation');
  }

  // Transformations
  if (params.has('rotate')) {
    options.rotate = params.get('rotate');
  }
  if (params.has('flip')) {
    options.flip = params.get('flip');
  }
  if (params.has('trim')) {
    options.trim = params.get('trim');
  }

  // Background and border
  if (params.has('background') || params.has('bg')) {
    options.background = params.get('background') || params.get('bg');
  }
  if (params.has('border')) {
    options.border = params.get('border');
  }

  // Metadata and animation
  if (params.has('metadata')) {
    options.metadata = params.get('metadata');
  }
  if (params.has('anim')) {
    options.anim = params.get('anim');
  }

  // Compression mode
  if (params.has('compression')) {
    options.compression = params.get('compression');
  }

  return options;
}

/**
 * Determine the best output format based on Accept header
 */
function negotiateFormat(request, requestedFormat) {
  if (requestedFormat && requestedFormat !== 'auto') {
    return requestedFormat;
  }

  const accept = request.headers.get('Accept') || '';

  // Prefer AVIF for browsers that support it
  if (accept.includes('image/avif')) {
    return 'avif';
  }

  // Fall back to WebP
  if (accept.includes('image/webp')) {
    return 'webp';
  }

  // Default to original format (let Cloudflare decide)
  return null;
}

/**
 * Detect slow connection from client hints
 */
function isSlowConnection(request) {
  const ect = request.headers.get('ECT');
  const saveData = request.headers.get('Save-Data');

  if (saveData === 'on') return true;
  if (ect && ['slow-2g', '2g', '3g'].includes(ect)) return true;

  return false;
}

/**
 * Build the cf.image options object
 */
function buildImageOptions(options, request, config) {
  const imageOpts = {};

  // Dimensions
  if (options.width) {
    const w = parseInt(options.width, 10);
    imageOpts.width = Math.min(w, config.maxWidth);
  }
  if (options.height) {
    const h = parseInt(options.height, 10);
    imageOpts.height = Math.min(h, config.maxHeight);
  }
  if (options.dpr) {
    imageOpts.dpr = parseFloat(options.dpr);
  }

  // Quality - adjust for slow connections
  const slowConnection = isSlowConnection(request);
  if (options.quality) {
    imageOpts.quality = parseInt(options.quality, 10);
  } else {
    imageOpts.quality = slowConnection ? config.slowConnectionQuality : config.quality;
  }

  // Format negotiation
  const format = negotiateFormat(request, options.format);
  if (format) {
    imageOpts.format = format;
  }

  // Fit mode
  imageOpts.fit = options.fit || config.defaultFit;

  // Gravity/focal point
  if (options.gravity) {
    imageOpts.gravity = options.gravity;
  }

  // Effects
  if (options.blur) {
    imageOpts.blur = Math.min(parseInt(options.blur, 10), 250);
  }
  if (options.sharpen) {
    imageOpts.sharpen = Math.min(parseFloat(options.sharpen), 10);
  }
  if (options.brightness) {
    imageOpts.brightness = parseFloat(options.brightness);
  }
  if (options.contrast) {
    imageOpts.contrast = parseFloat(options.contrast);
  }
  if (options.saturation) {
    imageOpts.saturation = parseFloat(options.saturation);
  }

  // Transformations
  if (options.rotate) {
    const rotate = parseInt(options.rotate, 10);
    if ([90, 180, 270].includes(rotate)) {
      imageOpts.rotate = rotate;
    }
  }
  if (options.flip) {
    if (['h', 'v', 'hv'].includes(options.flip)) {
      imageOpts.flip = options.flip;
    }
  }
  if (options.trim) {
    imageOpts.trim = options.trim;
  }

  // Background and border
  if (options.background) {
    imageOpts.background = options.background;
  }
  if (options.border) {
    imageOpts.border = options.border;
  }

  // Metadata
  imageOpts.metadata = options.metadata || config.metadata;

  // Animation
  if (options.anim !== undefined) {
    imageOpts.anim = options.anim === 'true' || options.anim === '1';
  }

  // Compression mode
  if (options.compression === 'fast') {
    imageOpts.compression = 'fast';
  }

  return imageOpts;
}

/**
 * Validate the image URL is allowed
 */
function isAllowedOrigin(imageUrl, config, requestOrigin) {
  // Same-origin images are always allowed
  if (imageUrl.startsWith('/')) {
    return true;
  }

  try {
    const url = new URL(imageUrl);

    // Check if it's the same origin as the request
    if (requestOrigin && url.origin === requestOrigin) {
      return true;
    }

    // Check against allowed origins list
    if (config.allowedOrigins.length > 0) {
      return config.allowedOrigins.some(origin =>
        url.origin === origin || url.hostname.endsWith(origin.replace(/^https?:\/\//, ''))
      );
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Check if the request is from another Worker (prevent loops)
 */
function isLoopRequest(request) {
  const via = request.headers.get('Via') || '';
  return via.includes('image-resizing');
}

/**
 * Build cache headers for the response
 */
function buildCacheHeaders(config, originalHeaders) {
  const headers = new Headers(originalHeaders);

  // Set cache control
  headers.set('Cache-Control', `public, max-age=${config.cacheTtl}, stale-while-revalidate=86400`);

  // Add Vary header for content negotiation
  headers.set('Vary', 'Accept');

  return headers;
}

/**
 * Check if the path is an image
 */
function isImagePath(pathname) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg', '.heic'];
  const ext = pathname.toLowerCase().split('.').pop();
  return imageExtensions.includes('.' + ext);
}

/**
 * Main request handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const config = { ...DEFAULT_CONFIG };

    // Override config from environment variables
    if (env.IMAGE_QUALITY) config.quality = parseInt(env.IMAGE_QUALITY, 10);
    if (env.IMAGE_MAX_WIDTH) config.maxWidth = parseInt(env.IMAGE_MAX_WIDTH, 10);
    if (env.IMAGE_MAX_HEIGHT) config.maxHeight = parseInt(env.IMAGE_MAX_HEIGHT, 10);
    if (env.IMAGE_CACHE_TTL) config.cacheTtl = parseInt(env.IMAGE_CACHE_TTL, 10);
    if (env.ALLOWED_ORIGINS) config.allowedOrigins = env.ALLOWED_ORIGINS.split(',');

    // Prevent request loops
    if (isLoopRequest(request)) {
      return fetch(request);
    }

    let imagePath = url.pathname;
    let options = {};

    // Try parsing path-based options first
    const pathParsed = parsePathOptions(url.pathname);
    if (pathParsed) {
      options = pathParsed.options;
      imagePath = pathParsed.imagePath;
    } else {
      // Fall back to query parameter options
      options = parseQueryOptions(url);
    }

    // Check if this is an image request with transformation options
    const hasTransformOptions = Object.keys(options).length > 0;
    const isImage = isImagePath(imagePath);

    // If no transformation requested or not an image, pass through
    if (!hasTransformOptions && !isImage) {
      return fetch(request);
    }

    // If it's an image but no explicit options, apply auto-optimization
    if (isImage && !hasTransformOptions && config.autoFormat) {
      const format = negotiateFormat(request, 'auto');
      if (format) {
        options.format = format;
      }
    }

    // Skip if still no options after auto-format check
    if (Object.keys(options).length === 0) {
      return fetch(request);
    }

    // Build the image URL
    let imageUrl;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      imageUrl = imagePath;
    } else {
      imageUrl = new URL(imagePath, url.origin).toString();
    }

    // Validate origin for external images
    if (!isAllowedOrigin(imagePath, config, url.origin)) {
      return new Response('Forbidden: External origin not allowed', { status: 403 });
    }

    // Build transformation options
    const imageOpts = buildImageOptions(options, request, config);

    try {
      // Fetch and transform the image
      const response = await fetch(imageUrl, {
        headers: request.headers,
        cf: {
          image: imageOpts,
          cacheEverything: true,
          cacheTtl: config.cacheTtl,
        },
      });

      // Handle errors
      if (!response.ok && !response.redirected) {
        // Return original image on transformation error
        console.error(`Image transformation failed for ${imageUrl}: ${response.status}`);
        return fetch(imageUrl);
      }

      // Build response with cache headers
      const headers = buildCacheHeaders(config, response.headers);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });

    } catch (error) {
      console.error(`Image transformation error: ${error.message}`);
      // Fall back to original image
      return fetch(imageUrl);
    }
  },
};
