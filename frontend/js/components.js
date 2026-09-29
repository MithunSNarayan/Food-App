/**
 * FoodApp - Shared Components UI Generator & Theme Management
 * Pure Vanilla JavaScript
 */

// ============================================================================
// 1. THEME MANAGER (Adaptive Dark / Light Theme Controller)
// ============================================================================
const ThemeManager = {
  STORAGE_KEY: 'foodapp_theme',

  icons: {
    sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`,
    moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`
  },

  getSavedPreference() {
    try {
      return localStorage.getItem(this.STORAGE_KEY) || 'system';
    } catch (e) {
      return 'system';
    }
  },

  getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  getEffectiveTheme() {
    const pref = this.getSavedPreference();
    if (pref === 'dark' || pref === 'light') return pref;
    return this.getSystemTheme();
  },

  init() {
    const effectiveTheme = this.getEffectiveTheme();
    this.applyTheme(effectiveTheme, false);

    // Listen for OS system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        if (this.getSavedPreference() === 'system') {
          this.applyTheme(e.matches ? 'dark' : 'light', false);
        }
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(listener);
      }
    }

    // Synchronize theme changes across multiple browser tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY) {
        this.applyTheme(this.getEffectiveTheme(), false);
      }
    });

    // Update UI once DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.updateUI());
    } else {
      this.updateUI();
    }
  },

  applyTheme(theme, dispatchEvent = true) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateUI();
    if (dispatchEvent) {
      window.dispatchEvent(new CustomEvent('foodapp:themechange', { detail: { theme } }));
    }
  },

  setTheme(preference, notifyUser = true) {
    try {
      localStorage.setItem(this.STORAGE_KEY, preference);
    } catch (e) {}

    let effective = preference;
    if (preference === 'system') {
      effective = this.getSystemTheme();
    }

    this.applyTheme(effective, true);

    if (notifyUser && typeof UIComponents !== 'undefined' && UIComponents.showToast) {
      if (preference === 'system') {
        UIComponents.showToast(`Theme synced with system (${effective === 'dark' ? 'Dark' : 'Light'})`, 'normal');
      } else {
        UIComponents.showToast(`Switched to ${effective === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`, 'normal');
      }
    }
  },

  toggle(notifyUser = true) {
    const current = document.documentElement.getAttribute('data-theme') || this.getEffectiveTheme();
    const target = current === 'dark' ? 'light' : 'dark';
    this.setTheme(target, notifyUser);
  },

  updateUI() {
    const current = document.documentElement.getAttribute('data-theme') || this.getEffectiveTheme();
    const isDark = current === 'dark';

    // Update all theme toggle buttons across the page
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', isDark ? 'Switch to Light Mode (☀️)' : 'Switch to Dark Mode (🌙)');
      btn.innerHTML = isDark ? this.icons.sun : this.icons.moon;
      btn.classList.toggle('is-dark', isDark);
    });

    // Update any theme text labels
    document.querySelectorAll('.theme-status-text').forEach(el => {
      el.textContent = isDark ? 'Dark Mode' : 'Light Mode';
    });

    // Update radio buttons or cards in profile settings if present
    const pref = this.getSavedPreference();
    document.querySelectorAll(`[data-theme-option]`).forEach(card => {
      const option = card.getAttribute('data-theme-option');
      card.classList.toggle('active', option === pref);
    });
  }
};

// Immediate initialization before paint
ThemeManager.init();

// ============================================================================
// 2. SHARED UI COMPONENTS
// ============================================================================
const UIComponents = {
  // SVG Icon Helpers (Standalone & Fast)
  icons: {
    logo: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
    mapPin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>`,
    cart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>`,
    user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    star: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    heart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`,
    arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`,
    menu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>`
  },

  // 1. Render Navbar
  renderNavbar(activePage = 'home') {
    const cartCount = (typeof CartService !== 'undefined' && CartService.getItemCount) ? CartService.getItemCount() : 0;
    const user = (typeof MockData !== 'undefined' && MockData.currentUser) ? MockData.currentUser : { name: "Mithun", email: "mithun@foodapp.com", role: "CUSTOMER" };
    const isDark = ThemeManager.getEffectiveTheme() === 'dark';

    return `
      <nav class="navbar" id="appNavbar">
        <div class="container nav-container">
          <!-- Brand Logo -->
          <a href="index.html" class="brand-logo" aria-label="FoodApp Home">
            <div class="logo-icon">${this.icons.logo}</div>
            <div class="logo-text">Food<span>App</span></div>
          </a>

          <!-- Location Selector -->
          <div class="location-selector" id="navLocationPicker" title="Change delivery location">
            <span class="loc-icon">${this.icons.mapPin}</span>
            <div class="loc-info truncate">
              <span class="loc-text">BTM Layout,</span>
              <span class="loc-city">Bengaluru</span>
            </div>
            <span class="loc-arrow">▼</span>
          </div>

          <!-- Search Bar -->
          <div class="nav-search">
            <div class="search-input-wrapper">
              <span class="search-icon">${this.icons.search}</span>
              <input type="text" id="globalSearchInput" placeholder="Search food & restaurants..." aria-label="Search">
            </div>
          </div>

          <!-- Navigation Links -->
          <ul class="nav-links">
            <li>
              <a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
            </li>
            <li>
              <a href="restaurants.html" class="nav-link ${activePage === 'restaurants' ? 'active' : ''}">Restaurants</a>
            </li>
            <li>
              <a href="restaurants.html?filter=offers" class="nav-link">Offers</a>
            </li>
          </ul>

          <!-- Subtle Divider Line -->
          <div class="nav-divider"></div>

          <!-- Action Buttons (Theme Toggle, Cart & Profile) -->
          <div class="flex items-center gap-3">
            <!-- Theme Toggle Button -->
            <button type="button" class="theme-toggle-btn ${isDark ? 'is-dark' : ''}" id="navThemeToggle" onclick="ThemeManager.toggle()" aria-label="${isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}" title="${isDark ? 'Switch to Light Mode (☀️)' : 'Switch to Dark Mode (🌙)'}">
              ${isDark ? ThemeManager.icons.sun : ThemeManager.icons.moon}
            </button>

            <a href="cart.html" class="nav-cart-btn" id="navCartBtn" aria-label="Shopping Cart">
              ${this.icons.cart}
              <span>Cart</span>
              <span class="cart-badge" id="cartBadgeCount">${cartCount}</span>
            </a>

            <!-- Profile Dropdown Container -->
            <div class="nav-user-dropdown-wrap">
              <button type="button" class="btn btn-outline btn-sm flex items-center gap-2" id="navUserBtn" onclick="UIComponents.toggleProfileDropdown(event)" title="${user.name}">
                ${this.icons.user}
                <span class="user-name-label">${user.name.split(' ')[0]}</span>
                <span style="font-size: 10px; color: var(--color-text-muted);">▼</span>
              </button>

              <!-- Dropdown Menu -->
              <div class="nav-user-dropdown-menu" id="navProfileDropdown">
                <div class="dropdown-user-header">
                  <div class="dropdown-user-name">${user.name}</div>
                  <div class="dropdown-user-email">${user.email || 'mithun@foodapp.com'}</div>
                  <span class="dropdown-role-tag">${user.role || 'CUSTOMER'}</span>
                </div>
                <div class="dropdown-divider"></div>
                <a href="profile.html" class="dropdown-item">
                  <span>👤</span> My Profile
                </a>
                <a href="orders.html" class="dropdown-item">
                  <span>📦</span> My Orders
                </a>
                <a href="admin-dashboard.html" class="dropdown-item">
                  <span>🏪</span> Partner Admin
                </a>
                
                <!-- Quick Theme Toggle in Dropdown -->
                <button type="button" class="dropdown-item flex items-center justify-between" onclick="ThemeManager.toggle();">
                  <span class="flex items-center gap-2"><span>🌓</span> <span class="theme-status-text">${isDark ? 'Dark Mode' : 'Light Mode'}</span></span>
                  <span class="dropdown-badge-theme">Toggle</span>
                </button>

                <div class="dropdown-divider"></div>
                <a href="login.html" class="dropdown-item logout" onclick="localStorage.removeItem('foodapp_user')">
                  <span>🚪</span> Sign Out
                </a>
              </div>
            </div>

            <button class="mobile-nav-toggle" id="mobileNavToggle" aria-label="Open menu">
              ${this.icons.menu}
            </button>
          </div>
        </div>
      </nav>
    `;
  },

  // 2. Render Footer
  renderFooter() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="index.html" class="footer-logo">
                <div class="logo-icon">${this.icons.logo}</div>
                <div>Food<span>App</span></div>
              </a>
              <p class="footer-desc">
                Delicious food delivered to your doorstep from top rated local restaurants with speed and care.
              </p>
            </div>

            <div class="footer-col">
              <h4>Company</h4>
              <ul class="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#blog">Food Stories</a></li>
                <li><a href="#contact">Contact Support</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>For Foodies</h4>
              <ul class="footer-links">
                <li><a href="#restaurants">Top Restaurants</a></li>
                <li><a href="#offers">Deals & Coupons</a></li>
                <li><a href="#tracking">Live Order Tracking</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>For Partners</h4>
              <ul class="footer-links">
                <li><a href="#partner-register">Add Your Restaurant</a></li>
                <li><a href="admin-dashboard.html">Restaurant Partner Portal</a></li>
                <li><a href="#delivery-partner">Become a Rider</a></li>
                <li><a href="#terms">Terms & Privacy</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <p>© 2026 FoodApp Inc. All rights reserved.</p>
            <div class="flex items-center gap-4">
              <p>Crafted with modern HTML, CSS & Vanilla JavaScript.</p>
              <button type="button" class="theme-toggle-btn btn-sm" onclick="ThemeManager.toggle()" title="Toggle Dark/Light Mode">
                ${ThemeManager.getEffectiveTheme() === 'dark' ? ThemeManager.icons.sun : ThemeManager.icons.moon}
              </button>
            </div>
          </div>
        </div>
      </footer>
    `;
  },

  // 3. Render Restaurant Card
  renderRestaurantCard(r) {
    const isFavorited = false;
    return `
      <div class="restaurant-card" data-id="${r.restaurantID}" onclick="window.location.href='restaurant.html?id=${r.restaurantID}'">
        <div class="card-image-wrap">
          <img src="${r.image}" alt="${r.name}" loading="lazy">
          ${r.offer ? `<span class="badge-offer">${r.offer}</span>` : ''}
          <button class="card-favorite-btn ${isFavorited ? 'favorited' : ''}" onclick="event.stopPropagation(); UIComponents.toggleFavorite(${r.restaurantID}, this)" aria-label="Add to favorites">
            ${this.icons.heart}
          </button>
        </div>

        <div class="card-content">
          <div class="card-header-row">
            <h4 class="card-title truncate" title="${r.name}">${r.name}</h4>
            <div class="badge-rating">
              ${this.icons.star}
              <span>${r.rating.toFixed(1)}</span>
            </div>
          </div>

          <p class="card-cuisine truncate">${r.cuisineType}</p>

          <div class="card-meta-row">
            <div class="badge-time">
              ${this.icons.clock}
              <span>${r.deliveryTime} mins</span>
            </div>
            <span class="card-price" style="color: var(--color-text-secondary); font-weight: 500;">${r.priceForTwo}</span>
          </div>

          <div class="card-address truncate">
            ${this.icons.mapPin}
            <span>${r.address}</span>
          </div>
        </div>
      </div>
    `;
  },

  // 4. Render Category Pill
  renderCategoryPill(cat, isActive = false) {
    return `
      <div class="category-pill ${isActive ? 'active' : ''}" data-category="${cat.id}" onclick="App.onFilterCategory('${cat.id}')">
        <div class="pill-img-wrapper">
          <img src="${cat.image}" alt="${cat.name}" loading="lazy">
        </div>
        <span class="pill-title">${cat.name}</span>
      </div>
    `;
  },

  // 5. Toast Notification
  showToast(message, type = 'normal') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 220);
    }, 2800);
  },

  // 6. Profile Dropdown Toggle
  toggleProfileDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('navProfileDropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
    }
  }
};

// Global click outside to close dropdowns
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('navProfileDropdown');
  const userBtn = document.getElementById('navUserBtn');
  if (dropdown && dropdown.classList.contains('active')) {
    if (userBtn && !userBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  }
});

