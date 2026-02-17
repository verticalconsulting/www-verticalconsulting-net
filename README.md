<div align="center">

# 🏢 Vertical Consulting

### Professional Consulting Services Website

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://www.verticalconsulting.net)
[![Jekyll](https://img.shields.io/badge/Jekyll-4.4.0-CC0000?style=for-the-badge&logo=jekyll&logoColor=white)](https://jekyllrb.com/)
[![Ruby](https://img.shields.io/badge/Ruby-3.2.2-CC342D?style=for-the-badge&logo=ruby&logoColor=white)](https://www.ruby-lang.org/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)

[![Website Status](https://img.shields.io/website?down_color=red&down_message=offline&style=flat-square&up_color=green&up_message=online&url=https%3A%2F%2Fwww.verticalconsulting.net)](https://www.verticalconsulting.net)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[🌐 Live Site](https://www.verticalconsulting.net) | [📧 Contact](mailto:corey@5hughes.com) | [📄 Documentation](CLAUDE.md)

</div>

---

## 📊 Project Overview

Five hughes LLC dba **Vertical Consulting** is a professional consulting services website built with Jekyll and deployed on Cloudflare Pages. The site showcases DevOps engineering, web design, and AI consulting services.

### 🎯 Key Features

- 🚀 **Fast & Secure**: Static site generation with Cloudflare Pages CDN
- 📱 **Responsive Design**: Mobile-first approach with fluid typography
- 🎨 **Modern UI**: CSS custom properties and scroll-reveal animations
- 🔐 **Spam Protection**: Akismet, honeypot, and reCAPTCHA v2
- 📝 **Client Portal**: Downloadable forms and Google Forms integration
- 🤖 **AI Services**: Grace AI Receptionist and healthcare marketing solutions

## 🚀 Deployment Status

**Current Environment**: Production
**Platform**: Cloudflare Pages
**Build Tool**: Jekyll 4.4.0 + Wrangler
**Last Updated**: Active Development

```mermaid
graph LR
    A[Git Push] -->|master branch| B[Cloudflare Pages]
    B -->|bundle install| C[Install Dependencies]
    C -->|jekyll build| D[Generate _site/]
    D -->|wrangler deploy| E[Deploy to CDN]
    E --> F[https://verticalconsulting.net]

    style F fill:#f38020,stroke:#333,stroke-width:2px,color:#fff
```
## 🗂️ Site Structure

```
┌─────────────────────────────────────────┐
│         Main Navigation                 │
├─────────────────────────────────────────┤
│  Home  │  About  │  Services  │  Projects  │  Press  │  Contact  │
└─────────────────────────────────────────┘

📄 Core Pages
├── 🏠 index.html - Homepage
├── 👤 about.html - Company information
├── 💼 services.html - Service offerings
├── 📁 projects.html - Portfolio showcase
├── 📰 press.html - Media & announcements
└── 📧 contact.html - Contact form

📁 Marketing Division Pages
├── 🏥 healthcare-marketing.html
├── 🤖 grace-ai-receptionist.html
└── 📊 marketing-divisions.html

📁 Project Detail Pages
├── projects-hmi.html
├── projects-ai-chatsolution.html
├── projects-a-nonprofit-missionary-fundraising.html
└── projects-a-missionary-website.html

📁 Landing Pages
├── 🎯 landing/ai-receptionist-jackson-ms.html
├── 📱 sms-optin.html
└── ✅ sms-optin-thank-you.html

📁 Client Resources
└── 📋 client-forms.html - Download/upload forms

⚖️ Legal Pages
├── 🔒 privacy.html
└── ℹ️ imprint.html
```
## 🎨 Design System

### Color Palette

<table>
<tr>
<td align="center" bgcolor="#001423" width="150">
<br><br>
<code>#001423</code><br>
<strong>Primary 900</strong>
<br><br>
</td>
<td align="center" bgcolor="#d7e0e5" width="150">
<br><br>
<code>#d7e0e5</code><br>
<strong>Primary 300</strong>
<br><br>
</td>
<td align="center" bgcolor="#f7f7f7" width="150">
<br><br>
<code>#f7f7f7</code><br>
<strong>Accent 200</strong>
<br><br>
</td>
</tr>
<tr>
<td align="center" bgcolor="#e4e4e4" width="150">
<br><br>
<code>#e4e4e4</code><br>
<strong>Accent 300</strong>
<br><br>
</td>
<td align="center" bgcolor="#646464" width="150">
<br><br>
<code style="color: white;">#646464</code><br>
<strong style="color: white;">Accent 400</strong>
<br><br>
</td>
<td align="center" bgcolor="#ffffff" width="150">
<br><br>
<code>#ffffff</code><br>
<strong>Neutral 100</strong>
<br><br>
</td>
</tr>
</table>

### Typography

| Element | Font Family | Usage |
|---------|------------|-------|
| **H1** | [Roboto Serif](https://fonts.google.com/specimen/Roboto+Serif) | Page headings |
| **H2, H3, Nav, Body** | [Roboto](https://fonts.google.com/specimen/Roboto) | Content & navigation |

**Font Features:**
- ✨ Fluid typography using `clamp()` functions
- 📏 Responsive sizing across all devices
- 🎯 CSS custom properties for consistency

### Icons

All icons provided by [Font Awesome](https://fontawesome.com/)

| Icon | Usage | Color |
|------|-------|-------|
| 💻 Code Solid | Development services | `#fff` |
| 🖥️ Desktop Solid | Web design services | `#fff` |
| 👥 Users Solid | Consulting services | `#fff` |
| 🧠 Brain Solid | AI services | `#fff` |

### CSS Architecture

**Custom Properties:**
```css
/* Colors */
--clr-neutral-100: #fff;
--clr-primary-300: #d7e0e5;
--clr-primary-900: #001423;
--clr-accent-200: #f7f7f7;
--clr-accent-300: #e4e4e4;
--clr-accent-400: #646464;

/* Typography */
--ff-heading: 'Roboto Serif', serif;
--ff-body: 'Roboto', sans-serif;
--fw-heading-light: 300;
--fw-body-light: 300;

/* Fluid Type Scale */
--fs-h1: clamp(...);
--fs-h2: clamp(...);
--fs-h3-small: clamp(...);
--fs-p: clamp(...);
--fs-icons: clamp(...);

/* Layout */
--lh-short: 1.2;
```
## 🛡️ Security & Spam Prevention

Contact form submissions are protected by a **triple-layer security system**:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 🤖 **AI Detection** | [Akismet](https://akismet.com/) | ML-based spam filtering |
| 🍯 **Honeypot** | Hidden field trap | Bot detection |
| ✅ **Human Verification** | reCAPTCHA v2 | Challenge-response test |

## 🛠️ Technology Stack

<table>
<tr>
<td>

**Build & Deploy**
- ![Jekyll](https://img.shields.io/badge/Jekyll-4.4.0-CC0000?logo=jekyll&logoColor=white)
- ![Ruby](https://img.shields.io/badge/Ruby-3.2.2-CC342D?logo=ruby&logoColor=white)
- ![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)
- ![Wrangler](https://img.shields.io/badge/Wrangler-CLI-F38020?logo=cloudflare&logoColor=white)

</td>
<td>

**Frontend**
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
- ![jQuery](https://img.shields.io/badge/jQuery-1.8.3-0769AD?logo=jquery&logoColor=white)

</td>
</tr>
<tr>
<td>

**Development Tools**
- ![VS Code](https://img.shields.io/badge/VS_Code-007ACC?logo=visual-studio-code&logoColor=white)
- ![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)
- ![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)

</td>
<td>

**Validation & Quality**
- ![W3C](https://img.shields.io/badge/W3C-Validated-005A9C?logo=w3c&logoColor=white)
- ![SEO](https://img.shields.io/badge/SEO-Optimized-4285F4?logo=google&logoColor=white)
- ![Accessibility](https://img.shields.io/badge/a11y-WCAG_2.1-0078D4?logo=accessibility&logoColor=white)

</td>
</tr>
</table>
## 🚀 Getting Started

### Prerequisites

- Ruby 3.2.2+ (via `.tool-versions`)
- Bundler 2.x
- Node.js (for Wrangler deployment)
- Git

### Local Development

```bash
# 1. Clone the repository
git clone <repository-url>
cd verticalconsulting

# 2. Install dependencies
bundle install

# 3. Start local development server
bundle exec jekyll serve

# 4. Open browser
# http://localhost:4000
```

### Building for Production

```bash
# Build static site
bundle exec jekyll build

# Output directory: _site/
```

### Deployment

Automatic deployment via Cloudflare Pages on push to `master`:

```bash
# Cloudflare build commands
build: bundle exec jekyll build
deploy: npx wrangler deploy
```

Manual deployment:
```bash
bundle exec jekyll build
npx wrangler deploy
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Branch Naming

- `feature/[description]` - New features
- `fix/[description]` - Bug fixes
- `docs/[description]` - Documentation
- `seo/[description]` - SEO improvements

### Commit Message Format

```
type: brief description

- Detailed change 1
- Detailed change 2
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request targeting `master`

## 📋 Adding New Pages

1. Create HTML file in root directory
2. Include standard header with navigation
3. Link stylesheet: `<link rel="stylesheet" href="style.css">`
4. Link script: `<script src="script.js"></script>`
5. Include jQuery and Font Awesome CDN links
6. Use existing CSS utility classes
7. Add page to navigation in all HTML files
8. Update `sitemap.xml` with new page URL and current date
9. Test responsive behavior
10. Submit to Google Search Console after deployment

## 🔍 SEO & Search Engine Indexing

### Current SEO Status

- ✅ **Sitemap**: `sitemap.xml` with 18 indexed pages
- ✅ **Robots.txt**: Properly configured to allow all crawlers
- ✅ **Structured Data**: Schema markup for business information
- ✅ **Meta Tags**: SEO-optimized titles and descriptions on all pages
- ✅ **Mobile-Friendly**: Responsive design with fluid typography
- ✅ **Fast Loading**: Cloudflare CDN with edge caching

### Google Search Console Setup

To submit your website to Google for indexing, follow the comprehensive guide:

📖 **[Google Search Console Setup Guide](GOOGLE-SEARCH-CONSOLE-SETUP.md)**

This guide includes:
- Step-by-step verification process
- Sitemap submission instructions
- Priority page indexing
- Troubleshooting common issues
- Maintenance checklist

### Quick Sitemap Submission

```bash
# After deploying new pages, ping Google:
curl "https://www.google.com/ping?sitemap=https://www.verticalconsulting.net/sitemap.xml"

# Or submit via Google Search Console:
# 1. Go to https://search.google.com/search-console
# 2. Navigate to Sitemaps
# 3. Submit: sitemap.xml
```

### SEO Best Practices Implemented

| Feature | Implementation | Status |
|---------|----------------|--------|
| **Meta Tags** | Title, description, keywords | ✅ |
| **Open Graph** | Social media preview tags | ✅ |
| **Canonical URLs** | Prevent duplicate content | ✅ |
| **Alt Text** | All images have descriptive alt text | ✅ |
| **Semantic HTML** | Proper heading hierarchy | ✅ |
| **HTTPS** | Secure connection via Cloudflare | ✅ |
| **XML Sitemap** | All pages mapped | ✅ |
| **Robots.txt** | Crawler instructions | ✅ |
| **Page Speed** | Optimized assets & CDN | ✅ |

## 📄 License

All content ideas, elements, structure, and implementation are licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).

⚠️ **Commercial Use Prohibited**: Third parties may **NOT** copy or otherwise imitate content for commercial purposes or for profit.

## 📞 Contact

**Five hughes LLC dba Vertical Consulting**

- 🌐 Website: [www.verticalconsulting.net](https://www.verticalconsulting.net)
- 📧 Email: corey@5hughes.com
- 💼 Services: DevOps Engineering | Web Design | AI Consulting

---

<div align="center">

**Built with ❤️ using Jekyll & Cloudflare Pages**

[![Made with Jekyll](https://img.shields.io/badge/Made%20with-Jekyll-CC0000?style=flat-square&logo=jekyll&logoColor=white)](https://jekyllrb.com/)
[![Deployed on Cloudflare](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)

</div> 
