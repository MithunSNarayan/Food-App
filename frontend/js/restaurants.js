/**
 * FoodApp - Restaurant Listing Page Logic
 * Only Vanilla JavaScript
 */

const RestaurantListing = {
  // Current Filter State
  filters: {
    searchQuery: '',
    cuisines: new Set(),
    minRating: 0,
    maxDeliveryTime: 999,
    onlyOffers: false,
    openNowOnly: true,
    sortBy: 'recommended' // 'recommended', 'rating', 'delivery', 'cost_asc', 'cost_desc'
  },

  init() {
    this.readUrlParams();
    this.renderHeaderAndFooter();
    this.renderCuisineFilterOptions();
    this.applyFiltersAndRender();
    this.attachEventListeners();
    this.setupCartListener();
  },

  // 1. Read URL Parameters
  readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const cuisine = params.get('cuisine');
    const filter = params.get('filter');
    const q = params.get('q');

    if (cuisine) {
      this.filters.cuisines.add(cuisine.toLowerCase());
    }
    if (filter === 'offers') {
      this.filters.onlyOffers = true;
    }
    if (filter === 'fast') {
      this.filters.maxDeliveryTime = 25;
    }
    if (q) {
      this.filters.searchQuery = q;
    }
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

  // 3. Render Cuisine Filter Checkboxes with Real Counts
  renderCuisineFilterOptions() {
    const container = document.getElementById('cuisineFilterList');
    const drawerContainer = document.getElementById('drawerCuisineList');
    if (!container && !drawerContainer) return;

    // Extract unique cuisines & compute counts
    const cuisineCounts = {};
    MockData.restaurants.forEach(r => {
      const tags = r.cuisineType.split(',').map(t => t.trim());
      tags.forEach(tag => {
        cuisineCounts[tag] = (cuisineCounts[tag] || 0) + 1;
      });
    });

    const markup = Object.entries(cuisineCounts).map(([cuisine, count]) => {
      const isChecked = Array.from(this.filters.cuisines).some(c => 
        cuisine.toLowerCase().includes(c) || c.includes(cuisine.toLowerCase())
      );
      return `
        <label class="filter-checkbox-label">
          <div class="filter-checkbox-left">
            <input type="checkbox" value="${cuisine}" ${isChecked ? 'checked' : ''} onchange="RestaurantListing.onCuisineToggle('${cuisine}', this.checked)">
            <span>${cuisine}</span>
          </div>
          <span class="filter-count-badge">${count}</span>
        </label>
      `;
    }).join('');

    if (container) container.innerHTML = markup;
    if (drawerContainer) drawerContainer.innerHTML = markup;
  },

  // 4. Filter & Sort Logic
  applyFiltersAndRender() {
    let list = [...MockData.restaurants];

    // Open Now Filter (isActive == 1)
    if (this.filters.openNowOnly) {
      list = list.filter(r => r.isActive === 1);
    }

    // Search Query
    if (this.filters.searchQuery) {
      const q = this.filters.searchQuery.toLowerCase();
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.cuisineType.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
      );
    }

    // Cuisines Filter
    if (this.filters.cuisines.size > 0) {
      list = list.filter(r => {
        const cuisinesLower = r.cuisineType.toLowerCase();
        return Array.from(this.filters.cuisines).some(c => cuisinesLower.includes(c.toLowerCase()));
      });
    }

    // Minimum Rating Filter
    if (this.filters.minRating > 0) {
      list = list.filter(r => r.rating >= this.filters.minRating);
    }

    // Delivery Time Filter
    if (this.filters.maxDeliveryTime < 999) {
      list = list.filter(r => r.deliveryTime <= this.filters.maxDeliveryTime);
    }

    // Only Offers Filter
    if (this.filters.onlyOffers) {
      list = list.filter(r => !!r.offer);
    }

    // Sorting
    switch (this.filters.sortBy) {
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery':
        list.sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      case 'cost_asc':
        list.sort((a, b) => parseInt(a.priceForTwo.replace(/\D/g, '')) - parseInt(b.priceForTwo.replace(/\D/g, '')));
        break;
      case 'cost_desc':
        list.sort((a, b) => parseInt(b.priceForTwo.replace(/\D/g, '')) - parseInt(a.priceForTwo.replace(/\D/g, '')));
        break;
      case 'recommended':
      default:
        // Default sort (popular first, then rating)
        list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating);
        break;
    }

    this.renderResults(list);
    this.updateActiveFilterPillsUI();
  },

  // 5. Render Results Grid
  renderResults(restaurants) {
    const grid = document.getElementById('restaurantsGrid');
    const countDisplay = document.getElementById('resultsCount');

    if (countDisplay) {
      countDisplay.innerHTML = `Showing <span>${restaurants.length}</span> restaurants`;
    }

    if (!grid) return;

    if (restaurants.length === 0) {
      grid.innerHTML = `
        <div class="listing-empty-state">
          <div class="empty-state-icon">🍽️</div>
          <h3>No restaurants found</h3>
          <p>We couldn't find any restaurants matching your current filters. Try resetting your filters or search terms.</p>
          <button class="btn btn-primary" onclick="RestaurantListing.resetFilters()">Reset All Filters</button>
        </div>
      `;
    } else {
      grid.innerHTML = restaurants.map(r => UIComponents.renderRestaurantCard(r)).join('');
    }
  },

  // 6. Filter Actions
  onCuisineToggle(cuisine, isChecked) {
    const c = cuisine.toLowerCase();
    if (isChecked) {
      this.filters.cuisines.add(c);
    } else {
      this.filters.cuisines.delete(c);
    }
    this.applyFiltersAndRender();
  },

  setRatingFilter(minRating) {
    this.filters.minRating = this.filters.minRating === minRating ? 0 : minRating;
    this.applyFiltersAndRender();
  },

  setDeliveryTimeFilter(maxTime) {
    this.filters.maxDeliveryTime = this.filters.maxDeliveryTime === maxTime ? 999 : maxTime;
    this.applyFiltersAndRender();
  },

  toggleOffersOnly() {
    this.filters.onlyOffers = !this.filters.onlyOffers;
    this.applyFiltersAndRender();
  },

  setSortBy(sortVal) {
    this.filters.sortBy = sortVal;
    this.applyFiltersAndRender();
  },

  resetFilters() {
    this.filters.cuisines.clear();
    this.filters.minRating = 0;
    this.filters.maxDeliveryTime = 999;
    this.filters.onlyOffers = false;
    this.filters.searchQuery = '';
    this.filters.sortBy = 'recommended';

    // Uncheck all sidebar checkboxes
    document.querySelectorAll('#cuisineFilterList input[type="checkbox"], #drawerCuisineList input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });

    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.value = '';

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'recommended';

    this.applyFiltersAndRender();
    UIComponents.showToast('Filters reset', 'normal');
  },

  // 7. Update Quick Chips UI
  updateActiveFilterPillsUI() {
    const chipRating = document.getElementById('chipRating');
    const chipFast = document.getElementById('chipFastDelivery');
    const chipOffers = document.getElementById('chipOffers');

    if (chipRating) {
      chipRating.classList.toggle('active', this.filters.minRating >= 4.0);
    }
    if (chipFast) {
      chipFast.classList.toggle('active', this.filters.maxDeliveryTime <= 25);
    }
    if (chipOffers) {
      chipOffers.classList.toggle('active', this.filters.onlyOffers);
    }

    // Update Radio Chips in Sidebar
    document.querySelectorAll('.filter-radio-chip[data-rating]').forEach(el => {
      const val = parseFloat(el.getAttribute('data-rating'));
      el.classList.toggle('active', this.filters.minRating === val);
    });

    document.querySelectorAll('.filter-radio-chip[data-time]').forEach(el => {
      const val = parseInt(el.getAttribute('data-time'));
      el.classList.toggle('active', this.filters.maxDeliveryTime === val);
    });
  },

  // 8. Mobile Drawer Open/Close
  toggleMobileDrawer(open) {
    const drawer = document.getElementById('mobileFilterDrawer');
    if (drawer) {
      drawer.classList.toggle('active', open);
    }
  },

  // 9. Event Listeners
  attachEventListeners() {
    const globalSearch = document.getElementById('globalSearchInput');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        this.filters.searchQuery = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.setSortBy(e.target.value);
      });
    }

    const drawerSortSelect = document.getElementById('drawerSortSelect');
    if (drawerSortSelect) {
      drawerSortSelect.addEventListener('change', (e) => {
        this.setSortBy(e.target.value);
        if (sortSelect) sortSelect.value = e.target.value;
      });
    }
  },

  // 10. Cart Synchronization
  setupCartListener() {
    window.addEventListener('cartUpdated', () => {
      const badge = document.getElementById('cartBadgeCount');
      if (badge) {
        badge.innerText = CartService.getItemCount();
      }
    });
  }
};

// Aliases for component clicks
const App = {
  onSelectRestaurant(restaurantID) {
    const restaurant = MockData.restaurants.find(r => r.restaurantID === restaurantID);
    if (restaurant) {
      UIComponents.showToast(`Selected "${restaurant.name}". Menu page is scheduled next!`, 'normal');
    }
  },
  toggleFavorite(restaurantID, btnElement) {
    btnElement.classList.toggle('favorited');
    const isFav = btnElement.classList.contains('favorited');
    UIComponents.showToast(isFav ? "Saved to favorites ❤️" : "Removed from favorites", 'normal');
  }
};

// Auto boot
document.addEventListener('DOMContentLoaded', () => {
  RestaurantListing.init();
});
