function normalizePath(pathname) {
  if (!pathname) return "/";
  if (pathname === "/index.html") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function currentPath() {
  return normalizePath(window.location.pathname);
}

function setCurrentNavLinks() {
  const path = currentPath();
  document.querySelectorAll("a[href]").forEach((link) => {
    const rawHref = link.getAttribute("href");
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
      return;
    }
    let linkPath = "";
    try {
      linkPath = normalizePath(new URL(rawHref, window.location.origin).pathname);
    } catch (err) {
      return;
    }
    if (linkPath === path) {
      link.classList.add("current");
    }
  });
}

function initReveal() {
  function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i += 1) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 100;
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }

  reveal();
  window.addEventListener("scroll", reveal, { passive: true });
}

function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-link").forEach((node) =>
    node.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    })
  );
}

function injectMobileBackButton() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  if (document.querySelector(".mobile-header-back")) return;
  if (currentPath() === "/") return;

  const back = document.createElement("button");
  back.className = "mobile-header-back";
  back.type = "button";
  back.setAttribute("aria-label", "Go back");
  back.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i><span>Back</span>';
  back.addEventListener("click", () => {
    const referrer = document.referrer ? new URL(document.referrer, window.location.origin) : null;
    if (window.history.length > 1 && referrer && referrer.origin === window.location.origin) {
      window.history.back();
      return;
    }
    window.location.href = "index.html";
  });

  navbar.insertBefore(back, navbar.firstChild);
}

function injectMobileBottomNav() {
  if (document.querySelector(".ios-bottom-nav")) return;

  const nav = document.createElement("nav");
  nav.className = "ios-bottom-nav";
  nav.setAttribute("aria-label", "Mobile tab navigation");
  nav.innerHTML = `
    <ul class="ios-bottom-nav-list">
      <li><a class="ios-bottom-nav-link" data-path="/" href="index.html"><i class="fa-solid fa-gauge-high" aria-hidden="true"></i><span>Dashboard</span></a></li>
      <li><a class="ios-bottom-nav-link" data-path="/projects.html" href="projects.html"><i class="fa-solid fa-briefcase" aria-hidden="true"></i><span>Matters</span></a></li>
      <li><a class="ios-bottom-nav-link" data-path="/services.html" href="services.html"><i class="fa-solid fa-list-check" aria-hidden="true"></i><span>Tasks</span></a></li>
      <li><a class="ios-bottom-nav-link" data-path="/contact.html" href="contact.html"><i class="fa-solid fa-comments" aria-hidden="true"></i><span>Messages</span></a></li>
    </ul>
  `;
  document.body.appendChild(nav);

  const path = currentPath();
  nav.querySelectorAll(".ios-bottom-nav-link").forEach((link) => {
    const linkPath = normalizePath(link.getAttribute("data-path"));
    if (path === linkPath) link.classList.add("active");
  });
}

function initSelectDrawer() {
  const isSmallScreen = window.matchMedia("(max-width: 820px)").matches;
  if (!isSmallScreen) return;

  const selects = Array.from(document.querySelectorAll("select"));
  if (!selects.length) return;

  const overlay = document.createElement("div");
  overlay.className = "ios-select-drawer-overlay";
  overlay.innerHTML = '<div class="ios-select-drawer" role="dialog" aria-modal="true" aria-label="Choose an option"></div>';
  document.body.appendChild(overlay);
  const drawer = overlay.querySelector(".ios-select-drawer");

  let activeSelect = null;

  function closeDrawer() {
    overlay.classList.remove("active");
    drawer.innerHTML = "";
    activeSelect = null;
  }

  function openDrawer(select) {
    activeSelect = select;
    drawer.innerHTML = "";

    const label = select.getAttribute("aria-label") || select.name || "Choose an option";
    const heading = document.createElement("p");
    heading.textContent = label;
    heading.style.margin = "0.1rem 0 0.55rem";
    heading.style.fontWeight = "600";
    drawer.appendChild(heading);

    Array.from(select.options).forEach((option) => {
      if (option.disabled) return;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option.textContent;
      if (option.value === select.value) button.classList.add("active");
      button.addEventListener("click", () => {
        if (!activeSelect) return;
        activeSelect.value = option.value;
        activeSelect.dispatchEvent(new Event("input", { bubbles: true }));
        activeSelect.dispatchEvent(new Event("change", { bubbles: true }));
        closeDrawer();
      });
      drawer.appendChild(button);
    });

    overlay.classList.add("active");
  }

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeDrawer();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDrawer();
  });

  selects.forEach((select) => {
    select.addEventListener("click", (event) => {
      event.preventDefault();
      openDrawer(select);
    });
  });
}

function initPullToRefresh() {
  const path = currentPath();
  const enabledPaths = new Set(["/", "/projects.html"]);
  if (!enabledPaths.has(path)) return;
  if (!window.matchMedia("(max-width: 820px)").matches) return;

  const indicator = document.createElement("div");
  indicator.className = "ios-pull-indicator";
  indicator.textContent = "Pull to refresh";
  document.body.appendChild(indicator);

  let startY = 0;
  let pullDistance = 0;
  let tracking = false;
  const threshold = 90;

  window.addEventListener(
    "touchstart",
    (event) => {
      if (window.scrollY > 0) return;
      startY = event.touches[0].clientY;
      pullDistance = 0;
      tracking = true;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (!tracking) return;
      const currentY = event.touches[0].clientY;
      const delta = currentY - startY;
      pullDistance = Math.max(0, Math.min(130, delta));
      if (pullDistance <= 12) {
        indicator.classList.remove("visible");
        return;
      }
      indicator.classList.add("visible");
      indicator.textContent = pullDistance > threshold ? "Release to refresh" : "Pull to refresh";
    },
    { passive: true }
  );

  window.addEventListener("touchend", () => {
    if (!tracking) return;
    tracking = false;
    if (pullDistance > threshold) {
      indicator.textContent = "Refreshing...";
      window.location.reload();
      return;
    }
    indicator.classList.remove("visible");
    indicator.textContent = "Pull to refresh";
  });
}

let imageWorkerAvailabilityPromise = null;

function checkImageWorkerAvailability() {
  if (imageWorkerAvailabilityPromise) return imageWorkerAvailabilityPromise;

  imageWorkerAvailabilityPromise = fetch(
    "/cdn-cgi/imageoptim/width=64,quality=70,format=auto/images/vertical-v-only-logo.png",
    {
      method: "HEAD",
      cache: "no-store",
    }
  )
    .then((response) => response.ok)
    .catch(() => false);

  return imageWorkerAvailabilityPromise;
}

function buildOptimizedImageUrl(pathname, width) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const requestedWidth = Math.min(Math.max(Math.ceil(width * dpr), 240), 2400);
  const roundedWidth = Math.ceil(requestedWidth / 80) * 80;
  const quality = window.matchMedia("(max-width: 820px)").matches ? 72 : 82;
  return `/cdn-cgi/imageoptim/width=${roundedWidth},quality=${quality},format=auto${pathname}`;
}

function shouldSkipOptimization(img, pathname) {
  if (!pathname.includes("/images/")) return true;
  if (pathname.startsWith("/cdn-cgi/imageoptim/")) return true;
  if (img.dataset.noOptimize === "true") return true;

  const lowerPath = pathname.toLowerCase();
  if (lowerPath.endsWith(".svg") || lowerPath.endsWith(".gif") || lowerPath.endsWith(".ico")) return true;

  const classText = (img.className || "").toLowerCase();
  const altText = (img.getAttribute("alt") || "").toLowerCase();
  const widthAttr = parseInt(img.getAttribute("width") || "0", 10);
  const heightAttr = parseInt(img.getAttribute("height") || "0", 10);
  const isLikelyIcon = (widthAttr > 0 && widthAttr <= 140 && heightAttr > 0 && heightAttr <= 140) || classText.includes("logo") || altText.includes("logo");
  return isLikelyIcon;
}

function applyResponsiveSrcset(img, pathname, baseWidth) {
  if (img.getAttribute("srcset")) return;
  const widthSteps = [360, 540, 720, 960, 1200, 1600, 2000];
  const maxUsefulWidth = Math.min(Math.max(Math.ceil(baseWidth * 2), 720), 2000);
  const candidates = widthSteps.filter((w) => w <= maxUsefulWidth);
  if (!candidates.length) candidates.push(Math.min(Math.max(Math.ceil(baseWidth), 360), 1200));

  const srcset = candidates
    .map((w) => `${buildOptimizedImageUrl(pathname, w)} ${w}w`)
    .join(", ");
  img.setAttribute("srcset", srcset);
  if (!img.getAttribute("sizes")) {
    img.setAttribute("sizes", "(max-width: 820px) 100vw, 50vw");
  }
}

async function initCloudflareImageOptimization() {
  const workerAvailable = await checkImageWorkerAvailability();
  if (!workerAvailable) return;

  document.querySelectorAll("img[src]").forEach((img) => {
    const rawSrc = img.getAttribute("src");
    if (!rawSrc || rawSrc.startsWith("data:")) return;

    let resolved;
    try {
      resolved = new URL(rawSrc, window.location.href);
    } catch (err) {
      return;
    }

    if (resolved.origin !== window.location.origin) return;
    const pathname = resolved.pathname;
    if (shouldSkipOptimization(img, pathname)) return;

    const renderWidth = img.clientWidth || parseInt(img.getAttribute("width") || "0", 10) || Math.min(window.innerWidth, 1200);
    const optimizedSrc = buildOptimizedImageUrl(pathname, renderWidth);
    const originalSrc = rawSrc;

    applyResponsiveSrcset(img, pathname, renderWidth);
    img.setAttribute("decoding", "async");
    img.setAttribute("data-original-src", originalSrc);
    img.src = optimizedSrc;

    img.addEventListener(
      "error",
      () => {
        const fallbackSrc = img.getAttribute("data-original-src");
        if (!fallbackSrc) return;
        img.removeAttribute("srcset");
        img.src = fallbackSrc;
      },
      { once: true }
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setCurrentNavLinks();
  initReveal();
  initHamburgerMenu();
  injectMobileBackButton();
  injectMobileBottomNav();
  initSelectDrawer();
  initPullToRefresh();
  initCloudflareImageOptimization();
});
