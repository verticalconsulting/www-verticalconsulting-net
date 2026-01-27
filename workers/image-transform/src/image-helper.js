/**
 * Image Optimization Helper
 *
 * Client-side utility for generating optimized image URLs
 * Works with the Cloudflare Images Transformation Worker
 *
 * Usage in HTML:
 *   <script src="workers/image-transform/src/image-helper.js"></script>
 *   <script>
 *     document.querySelectorAll('img[data-optimize]').forEach(ImageOptim.transform);
 *   </script>
 */

(function(global) {
  'use strict';

  const ImageOptim = {
    // Default worker endpoint - update this to your deployed worker URL
    workerUrl: '/cdn-cgi/imageoptim',

    // Preset configurations for common use cases
    presets: {
      thumbnail: { width: 150, quality: 80, fit: 'cover' },
      small: { width: 400, quality: 80 },
      medium: { width: 800, quality: 85 },
      large: { width: 1200, quality: 85 },
      hero: { width: 1920, quality: 85 },
      avatar: { width: 100, height: 100, fit: 'cover', gravity: 'face' },
      card: { width: 400, height: 300, fit: 'cover' },
      og: { width: 1200, height: 630, fit: 'cover' }
    },

    /**
     * Build an optimized image URL
     *
     * @param {string} imagePath - Original image path
     * @param {Object} options - Transformation options
     * @returns {string} Optimized image URL
     */
    url(imagePath, options = {}) {
      // Handle preset names
      if (typeof options === 'string' && this.presets[options]) {
        options = this.presets[options];
      }

      // If no options, return original
      if (Object.keys(options).length === 0) {
        return imagePath;
      }

      // Build options string
      const optionsStr = Object.entries(options)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${k}=${v}`)
        .join(',');

      // Remove leading slash from image path if present
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

      return `${this.workerUrl}/${optionsStr}/${cleanPath}`;
    },

    /**
     * Generate srcset for responsive images
     *
     * @param {string} imagePath - Original image path
     * @param {number[]} widths - Array of widths to generate
     * @param {Object} baseOptions - Base transformation options
     * @returns {string} srcset attribute value
     */
    srcset(imagePath, widths = [400, 800, 1200, 1600], baseOptions = {}) {
      return widths
        .map(w => `${this.url(imagePath, { ...baseOptions, width: w })} ${w}w`)
        .join(', ');
    },

    /**
     * Transform an img element to use optimized URLs
     *
     * @param {HTMLImageElement} img - Image element to transform
     */
    transform(img) {
      const src = img.getAttribute('src');
      if (!src || src.includes('cdn-cgi/imageoptim')) return;

      // Get options from data attributes
      const options = {};
      const dataset = img.dataset;

      // Parse data attributes
      if (dataset.width) options.width = dataset.width;
      if (dataset.height) options.height = dataset.height;
      if (dataset.quality) options.quality = dataset.quality;
      if (dataset.fit) options.fit = dataset.fit;
      if (dataset.gravity) options.gravity = dataset.gravity;
      if (dataset.format) options.format = dataset.format;
      if (dataset.preset && ImageOptim.presets[dataset.preset]) {
        Object.assign(options, ImageOptim.presets[dataset.preset]);
      }

      // Add auto format for modern browsers
      if (!options.format) {
        options.format = 'auto';
      }

      // Set optimized src
      img.setAttribute('src', ImageOptim.url(src, options));

      // Generate srcset if requested
      if (dataset.responsive !== undefined) {
        const widths = dataset.widths
          ? dataset.widths.split(',').map(Number)
          : [400, 800, 1200, 1600];
        img.setAttribute('srcset', ImageOptim.srcset(src, widths, options));

        // Set default sizes if not present
        if (!img.getAttribute('sizes')) {
          img.setAttribute('sizes', '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw');
        }
      }
    },

    /**
     * Initialize automatic transformation for all images with data-optimize attribute
     */
    init() {
      // Transform images with data-optimize
      document.querySelectorAll('img[data-optimize]').forEach(this.transform.bind(this));

      // Set up mutation observer for dynamically added images
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              if (node.matches && node.matches('img[data-optimize]')) {
                this.transform(node);
              }
              node.querySelectorAll && node.querySelectorAll('img[data-optimize]').forEach(this.transform.bind(this));
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  };

  // Export to global scope
  global.ImageOptim = ImageOptim;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ImageOptim.init());
  } else {
    ImageOptim.init();
  }

})(typeof window !== 'undefined' ? window : this);
