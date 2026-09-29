/**
 * FoodApp - Restaurant Detail & Menu Logic
 * Only Vanilla JavaScript
 * Direct mapping to RestaurantDAO & MenuDAO
 */

const RestaurantDetail = {
  restaurant: null,
  menuItems: [],
  activeVegOnly: false,
  searchQuery: '',

  init() {
    this.loadRestaurantData();
    this.renderHeaderAndFooter();
    this.renderRestaurantHero();
    this.renderCategoryTabs();
    this.renderMenuCatalog();
    this.updateFloatingCartBar();
    this.attachEventListeners();
    this.setupCartListener();
  },

  // 1. Load Restaurant & Menu Data from Mock Service (Simulating DAOs)
  loadRestaurantData() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id')) || 101;

    // Simulate RestaurantDAO.getRestaurant(id)
    this.restaurant = MockData.restaurants.find(r => r.restaurantID === id) || MockData.restaurants[0];
    
    // Simulate MenuDAO.getAllMenus() filtered by restaurantID and deletedAt IS NULL
    this.menuItems = MockData.menus.filter(m => m.restaurantID === this.restaurant.restaurantID);
  },

  // 2. Render Header & Footer
  renderHeaderAndFooter() {
    const navPlaceholder = document.getElementById('navbarPlaceholder');
    if (navPlaceholder) {
      navPlaceholder.innerHTML = UIComponents.renderNavbar('restaurants');
    }

    const footerPlaceholder = document.getElementById('footerPlaceholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = UIComponents.renderFooter();
    }
  },

  // 3. Render Restaurant Hero Header Card
  renderRestaurantHero() {
    const heroContainer = document.getElementById('restaurantHero');
    const breadcrumbName = document.getElementById('breadcrumbRestoName');
    
    if (breadcrumbName) {
      breadcrumbName.innerText = this.restaurant.name;
    }

    if (!heroContainer) return;

    const r = this.restaurant;
    heroContainer.innerHTML = `
      <div class="resto-info-col">
        <h1 class="resto-name">${r.name}</h1>
        <p class="resto-cuisines">${r.cuisineType}</p>
        <div class="resto-address">
          ${UIComponents.icons.mapPin}
          <span>${r.address}</span>
        </div>

        <div class="resto-meta-row">
          <div class="resto-meta-item">
            <span class="meta-item-label">Rating</span>
            <div class="meta-item-value">
              <span class="badge-rating">${UIComponents.icons.star} ${r.rating.toFixed(1)}</span>
              <span style="font-size: 11px; color: var(--color-text-muted); font-weight: 500;">(1,000+ reviews)</span>
            </div>
          </div>

          <div class="resto-meta-item">
            <span class="meta-item-label">Delivery Time</span>
            <div class="meta-item-value">
              ${UIComponents.icons.clock}
              <span>${r.deliveryTime} mins</span>
            </div>
          </div>

          <div class="resto-meta-item">
            <span class="meta-item-label">Cost</span>
            <div class="meta-item-value">${r.priceForTwo}</div>
          </div>
        </div>

        ${r.offer ? `
          <div class="resto-offer-banner">
            <span>🏷️</span>
            <span>${r.offer} | Use coupon <strong>WELCOME50</strong></span>
          </div>
        ` : ''}
      </div>

      <div class="resto-image-col">
        <img src="${r.image}" alt="${r.name}">
      </div>
    `;
  },

  // 4. Render Category Tabs Navigation
  renderCategoryTabs() {
    const tabsContainer = document.getElementById('categoryTabs');
    if (!tabsContainer) return;

    // Extract unique categories
    const categories = ['All Dishes', ...new Set(this.menuItems.map(m => m.category))];

    tabsContainer.innerHTML = categories.map((cat, idx) => `
      <button class="category-tab-btn ${idx === 0 ? 'active' : ''}" onclick="RestaurantDetail.scrollToCategory('${cat}', this)">
        ${cat}
      </button>
    `).join('');
  },

  // 5. Render Categorized Menu Items
  renderMenuCatalog() {
    const catalogContainer = document.getElementById('menuCatalog');
    if (!catalogContainer) return;

    let items = [...this.menuItems];

    // Filter Veg Only
    if (this.activeVegOnly) {
      items = items.filter(m => m.isVeg);
    }

    // Search Query Filter
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(m => 
        m.itemName.toLowerCase().includes(q) || 
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    }

    if (items.length === 0) {
      catalogContainer.innerHTML = `
        <div class="listing-empty-state" style="margin: 40px 0;">
          <div class="empty-state-icon">🍲</div>
          <h3>No dishes found</h3>
          <p>No dishes match your current filter or search criteria.</p>
        </div>
      `;
      return;
    }

    // Group items by category
    const grouped = {};
    items.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    catalogContainer.innerHTML = Object.entries(grouped).map(([categoryName, dishList]) => `
      <section class="menu-category-section" id="cat-${categoryName.replace(/\s+/g, '-')}">
        <h2 class="menu-category-title">
          <span>${categoryName}</span>
          <span class="category-count-badge">(${dishList.length})</span>
        </h2>

        <div class="menu-items-list">
          ${dishList.map(dish => this.renderMenuItemCard(dish)).join('')}
        </div>
      </section>
    `).join('');
  },

  // 6. Render Single Dish Card
  renderMenuItemCard(dish) {
    const quantity = CartService.getItemQuantity(dish.menuID);
    const isOutOfStock = dish.isAvailable === 0;

    return `
      <div class="menu-item-card" id="dish-${dish.menuID}">
        <div class="item-details">
          <div class="food-type-icon ${dish.isVeg ? 'veg' : 'non-veg'}" title="${dish.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}">
            <div class="food-type-dot"></div>
          </div>
          <h3 class="item-name">${dish.itemName}</h3>
          <div class="item-price">₹${dish.price}</div>
          <p class="item-description">${dish.description}</p>
        </div>

        <div class="item-action-wrapper">
          <img src="${dish.image}" alt="${dish.itemName}" class="item-image" loading="lazy">
          
          <div class="item-add-btn-container">
            ${isOutOfStock ? `
              <div class="badge-out-of-stock">Out of Stock</div>
            ` : quantity > 0 ? `
              <div class="quantity-stepper">
                <button onclick="RestaurantDetail.onQuantityChange(${dish.menuID}, -1)" aria-label="Decrease quantity">−</button>
                <span>${quantity}</span>
                <button onclick="RestaurantDetail.onQuantityChange(${dish.menuID}, 1)" aria-label="Increase quantity">+</button>
              </div>
            ` : `
              <button class="btn-add-food" onclick="RestaurantDetail.onAddToCart(${dish.menuID})">
                + ADD
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  // 7. Cart Actions (Add, Increment, Decrement)
  onAddToCart(menuID) {
    const dish = this.menuItems.find(m => m.menuID === menuID);
    if (!dish) return;

    const added = CartService.addItem(dish, this.restaurant);
    if (added) {
      this.renderMenuCatalog();
      this.updateFloatingCartBar();
      UIComponents.showToast(`Added "${dish.itemName}" to cart! 🛒`, 'success');
    }
  },

  onQuantityChange(menuID, delta) {
    CartService.updateQuantity(menuID, delta);
    this.renderMenuCatalog();
    this.updateFloatingCartBar();
  },

  // 8. Update Sticky Floating Cart Bar
  updateFloatingCartBar() {
    const cartBar = document.getElementById('floatingCartBar');
    const countDisplay = document.getElementById('cartBarCount');
    const totalDisplay = document.getElementById('cartBarTotal');

    if (!cartBar) return;

    const count = CartService.getItemCount();
    const total = CartService.getCartTotal();

    if (count > 0) {
      cartBar.classList.add('visible');
      if (countDisplay) countDisplay.innerText = `${count} ${count === 1 ? 'Item' : 'Items'}`;
      if (totalDisplay) totalDisplay.innerText = `₹${total}`;
    } else {
      cartBar.classList.remove('visible');
    }
  },

  // 9. Scroll to Category Tab
  scrollToCategory(categoryName, btnElement) {
    document.querySelectorAll('.category-tab-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    if (categoryName === 'All Dishes') {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } else {
      const section = document.getElementById(`cat-${categoryName.replace(/\s+/g, '-')}`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },

  // 10. Toggle Veg Only Filter
  toggleVegOnly() {
    this.activeVegOnly = !this.activeVegOnly;
    const wrapper = document.getElementById('vegToggleWrapper');
    if (wrapper) {
      wrapper.classList.toggle('active', this.activeVegOnly);
    }
    this.renderMenuCatalog();
    UIComponents.showToast(this.activeVegOnly ? "Showing Vegetarian dishes only 🟢" : "Showing all dishes", 'normal');
  },

  // 11. Event Listeners
  attachEventListeners() {
    const menuSearch = document.getElementById('menuSearchInput');
    if (menuSearch) {
      menuSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderMenuCatalog();
      });
    }

    const globalSearch = document.getElementById('globalSearchInput');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderMenuCatalog();
      });
    }
  },

  // 12. Cart Listener
  setupCartListener() {
    window.addEventListener('cartUpdated', () => {
      const badge = document.getElementById('cartBadgeCount');
      if (badge) {
        badge.innerText = CartService.getItemCount();
      }
      this.updateFloatingCartBar();
    });
  }
};

// Aliases
const App = {
  onSelectRestaurant(id) {
    window.location.href = `restaurant.html?id=${id}`;
  },
  toggleFavorite(id, btn) {
    btn.classList.toggle('favorited');
    const isFav = btn.classList.contains('favorited');
    UIComponents.showToast(isFav ? "Saved to favorites ❤️" : "Removed from favorites", 'normal');
  }
};

// Auto Boot
document.addEventListener('DOMContentLoaded', () => {
  RestaurantDetail.init();
});
