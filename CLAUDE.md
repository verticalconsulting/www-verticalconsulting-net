# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Five hughes LLC dba Vertical Consulting website - a static business website built with Jekyll, featuring professional consulting services, project portfolio, and contact information. The site is deployed on Netlify at https://www.verticalconsulting.net.

## Technology Stack

- **Static Site Generator**: Jekyll 4.4.0
- **Frontend**: HTML, CSS (custom properties/CSS variables), JavaScript (jQuery)
- **Deployment**: Netlify (auto-deploys from master)
- **CI/CD**: GitHub Actions (Ruby 3.2 with bundler)
- **Spam Prevention**: Akismet, honeypot fields, reCAPTCHA 2 (via Netlify)

## Development Commands

### Local Development

```bash
# Install dependencies
bundle install

# Serve site locally with live reload (default Jekyll command)
bundle exec jekyll serve

# Build site for production
bundle exec jekyll build

# Build with future-dated posts
bundle exec jekyll build --future
```

### Testing the Build

```bash
# Use Docker to build (matches CI environment)
docker run \
  -v $(pwd):/srv/jekyll \
  -v $(pwd)/_site:/srv/jekyll/_site \
  jekyll/builder:latest /bin/bash -c "chmod -R 777 /srv/jekyll && jekyll build --future"
```

## Architecture

### Site Structure

The site follows a simple flat structure with individual HTML pages for each section:

- **Main Pages**: `index.html`, `about.html`, `services.html`, `projects.html`, `press.html`, `contact.html`, `client-forms.html`
- **Marketing Pages**: `marketing-divisions.html`, `healthcare-marketing.html`, `grace-ai-receptionist.html`
- **Landing Pages**: `landing/ai-receptionist-jackson-ms.html`, `sms-optin.html`, `sms-optin-thank-you.html`
- **Legal Pages**: `privacy.html`, `imprint.html`
- **Project Detail Pages**: `projects-*.html` (e.g., `projects-hmi.html`, `projects-ai-chatsolution.html`, `projects-a-missionary-website.html`)

### Client Forms Feature

The `client-forms.html` page provides a dual-purpose forms interface:

1. **Download Forms Section**:
   - Static PDFs stored in `/forms/` directory
   - Sample forms include: client intake, project requirements worksheet, NDA template
   - Each form displayed in styled card with download button

2. **Upload Forms Section**:
   - Uses embedded Google Forms for file uploads
   - Files automatically route to owner's Google Drive
   - Setup requires creating a Google Form with:
     - Client Name field (required)
     - Form Type/Description field
     - File Upload field (accepts PDF, DOC, DOCX, XLS, XLSX, images)
   - Embed iframe code must be updated in `client-forms.html` after form creation

**To add new downloadable forms**:
1. Add PDF/DOC file to `/forms/` directory
2. Copy a `.form-card` div in `client-forms.html`
3. Update title, description, and href path
4. Commit changes

### Styling System

CSS is centralized in `style.css` using a custom properties (CSS variables) approach:

**Color Palette**:
- Primary: `--clr-primary-900` (#001423), `--clr-primary-300` (#d7e0e5)
- Accent: `--clr-accent-200` (#f7f7f7), `--clr-accent-300` (#e4e4e4), `--clr-accent-400` (#646464)
- Neutral: `--clr-neutral-100` (#fff)

**Typography**:
- Headings: Roboto Serif (via Google Fonts)
- Body: Roboto (via Google Fonts)
- Fluid type scale using `clamp()` for responsive sizing

**Key CSS Features**:
- Fluid typography using `clamp()` functions
- Custom CSS properties for consistent theming
- Scroll-triggered reveal animations (`.reveal` class)
- Responsive hamburger navigation

### JavaScript Functionality

`script.js` provides:
- **Active Nav Link**: jQuery-based current page highlighting
- **Logo Debug**: Console logging for logo asset validation (development feature)
- **Scroll Reveal**: Intersection-based reveal animations
- **Mobile Navigation**: Hamburger menu toggle functionality

### Jekyll Configuration

Site metadata in `_config.yml`:
- Title: Five hughes LLC dba Vertical Consulting
- Email: corey@5hughes.com
- URL: https://www.verticalconsulting.net
- Markdown: kramdown
- Syntax highlighter: rouge
- Plugin: jekyll-feed

### Images and Assets

- Logo: `images/vertical-v-only-logo.png` (55x55px, used in navbar and favicon)
- Project images, background images, and client work samples in `/images`
- Icons: Font Awesome (via CDN)

## Git Workflow

- **Main Branch**: `master` (used for production deployments and PR targets)
- **CI/CD**: GitHub Actions builds Jekyll site with Ruby 3.2 on push/PR to master
- **Deployment**: Netlify automatically deploys from master branch

### Branch Naming Convention

- `feature/[description]` - for new features
- `fix/[description]` - for bug fixes
- `docs/[description]` - for documentation updates
- `seo/[description]` - for SEO-related changes

### Commit Message Format

```
type: description

- Detailed change 1
- Detailed change 2
```

Types: `feat:` (new feature), `fix:` (bug fix), `docs:` (documentation), `style:` (formatting), `refactor:`, `test:`, `chore:` (maintenance)

## Working with This Codebase

### When Adding New Pages

1. Create HTML file in root directory (not in subdirectory)
2. Include standard header with navigation (copy from existing page)
3. Link stylesheet: `<link rel="stylesheet" href="style.css">`
4. Link script: `<script src="script.js"></script>` (before closing `</body>`)
5. Include jQuery and Font Awesome CDN links in `<head>`
6. Use existing CSS utility classes for consistency
7. Add new page to navigation menu in all HTML files

### When Modifying Styles

- Use existing CSS custom properties (variables) for colors and typography
- Maintain fluid typography patterns with `clamp()` functions
- Test responsive behavior at mobile breakpoints (navigation hamburger activates below ~768px)
- Keep styling in centralized `style.css` file

### When Working with JavaScript

- jQuery 1.8.3 is loaded for legacy compatibility
- New features can use vanilla JS (see hamburger menu and reveal animations)
- Console debug statements should be removed or commented out for production

## Professional Context

Based on `.github/chatmodes/Devops.chatmode.md`, the site owner operates in three professional modes:
1. **DevOps Engineer**: Azure, Kubernetes, Terraform, CI/CD
2. **Website Designer**: Web design, UX/UI, SEO
3. **AI Consultant**: Azure AI Foundry, OpenAI, business AI strategy

This context informs the services offered and content on the website.
