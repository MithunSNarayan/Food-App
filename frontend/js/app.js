/**
 * FoodApp - Home Application Logic
 * Only Vanilla JavaScript
 */

const App = {
  activeCategory: 'all',
  searchQuery: '',

  // Initialize Home Page
  init() {
    this.renderHeaderAndFooter();
    this.renderCategories();
    this.renderRestaurants();
    this.attachEventListeners();
    this.setupCartListener();
  },

  // Render Header & Footer
  renderHeaderAndFooter() {
    const navPlaceholder = document.getElementById('navbarPlaceholder');
    if (navPlaceholder) {
      navPlaceholder.innerHTML = UIComponents.renderNavbar('home');
    }

    const footerPlaceholder = document.getElementById('footerPlaceholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = UIComponents.renderFooter();
    }
  },

  // Render Cuisine Categories Carousel
  renderCategories() {
    const container = document.getElementById('categoriesCarousel');
    if (!container) return;

    container.innerHTML = MockData.categories.map(cat => 
      UIComponents.renderCategoryPill(cat, cat.id === this.activeCategory)
    ).join('');
  },

  // Render Restaurant Grids
  renderRestaurants() {
    const topRatedContainer = document.getElementById('topRatedGrid');
    const fastDeliveryContainer = document.getElementById('fastDeliveryGrid');

    let list = MockData.restaurants.filter(r => r.isActive === 1);

    // Apply category filter if not "all"
    if (this.activeCategory && this.activeCategory !== 'all') {
      const catObj = MockData.categories.find(c => c.id === this.activeCategory);
      if (catObj) {
        list = list.filter(r => 
          r.cuisineType.toLowerCase().includes(catObj.name.toLowerCase()) ||
          r.name.toLowerCase().includes(catObj.name.toLowerCase())
        );
      }
    }

    // Apply search query if present
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.cuisineType.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
      );
    }

    // Top Rated (Sorted by rating)
    if (topRatedContainer) {
      const topRated = [...list].sort((a, b) => b.rating - a.rating);
      if (topRated.length === 0) {
        topRatedContainer.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 40px 0; text-align: center; color: var(--color-text-secondary);">
            <p style="font-size: 16px; font-weight: 600;">No restaurants match your search</p>
            <p style="font-size: 13px; color: var(--color-text-muted);">Try a different cuisine or search term</p>
          </div>
        `;
      } else {
        topRatedContainer.innerHTML = topRated.slice(0, 6).map(r => UIComponents.renderRestaurantCard(r)).join('');
      }
    }

    // Fastest Delivery (Sorted by delivery time)
    if (fastDeliveryContainer) {
      const fastDelivery = [...list].filter(r => r.isFastDelivery).sort((a, b) => a.deliveryTime - b.deliveryTime);
      if (fastDelivery.length === 0) {
        fastDeliveryContainer.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 24px 0; text-align: center; color: var(--color-text-muted); font-size: 13px;">
            No fast-delivery restaurants found for this filter.
          </div>
        `;
      } else {
        fastDeliveryContainer.innerHTML = fastDelivery.slice(0, 3).map(r => UIComponents.renderRestaurantCard(r)).join('');
      }
    }
  },

  // Category Filter Click Handler
  onFilterCategory(categoryId) {
    this.activeCategory = categoryId;
    this.renderCategories();
    this.renderRestaurants();
    UIComponents.showToast(`Showing ${categoryId === 'all' ? 'all cuisines' : categoryId}`, 'normal');
  },

  // Restaurant Card Click Handler
  onSelectRestaurant(restaurantID) {
    const restaurant = MockData.restaurants.find(r => r.restaurantID === restaurantID);
    if (restaurant) {
      UIComponents.showToast(`Selected "${restaurant.name}". Menu page is scheduled next!`, 'normal');
    }
  },

  // Toggle Favorite
  toggleFavorite(restaurantID, btnElement) {
    btnElement.classList.toggle('favorited');
    const isFav = btnElement.classList.contains('favorited');
    UIComponents.showToast(isFav ? "Saved to favorites ❤️" : "Removed from favorites", 'normal');
  },

  // Event Listeners
  attachEventListeners() {
    // Global Search in Navbar
    const globalSearch = document.getElementById('globalSearchInput');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderRestaurants();
      });
    }

    // Hero Search Input
    const heroSearch = document.getElementById('heroSearchInput');
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    if (heroSearch) {
      heroSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderRestaurants();
      });
    }
    if (heroSearchBtn) {
      heroSearchBtn.addEventListener('click', () => {
        const query = heroSearch ? heroSearch.value : '';
        this.searchQuery = query;
        this.renderRestaurants();
        const section = document.getElementById('restaurantsSection');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Navbar Scroll Shadow
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('appNavbar');
      if (navbar) {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    });

    // Location Picker Click
    const locPicker = document.getElementById('navLocationPicker');
    if (locPicker) {
      locPicker.addEventListener('click', () => {
        UIComponents.showToast("Current Location: BTM Layout, Bengaluru (Auto-detected)", 'normal');
      });
    }
  },

  // Cart Listener for Dynamic Badge Update
  setupCartListener() {
    window.addEventListener('cartUpdated', () => {
      const badge = document.getElementById('cartBadgeCount');
      if (badge) {
        badge.innerText = CartService.getItemCount();
      }
    });
  }
};

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
