/**
 * FoodApp - Admin Restaurant Management Logic
 * Only Vanilla JavaScript
 * Direct mapping to RestaurantDAO (addRestaurant, updateRestaurant, deleteRestaurant, getAllRestaurants)
 */

const AdminRestaurants = {
  restaurants: [],
  searchQuery: '',
  statusFilter: 'ALL', // 'ALL', 'ACTIVE', 'INACTIVE'
  editingRestaurantId: null,

  init() {
    this.loadRestaurants();
    AdminApp.init('restaurants');
    this.renderRestaurantsTable();
    this.attachEventListeners();
  },

  // 1. Load Restaurants (Simulating RestaurantDAO.getAllRestaurants())
  loadRestaurants() {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('foodapp_restaurants') || '[]');
    } catch (e) {
      console.error(e);
    }

    if (saved.length === 0) {
      saved = [...MockData.restaurants];
      try {
        localStorage.setItem('foodapp_restaurants', JSON.stringify(saved));
      } catch (e) {}
    }

    this.restaurants = saved;
  },

  // 2. Render Restaurants Table
  renderRestaurantsTable() {
    const tbody = document.getElementById('restaurantsTableBody');
    const countDisplay = document.getElementById('restaurantCountText');
    if (!tbody) return;

    let filtered = [...this.restaurants];

    // Status Filter
    if (this.statusFilter === 'ACTIVE') {
      filtered = filtered.filter(r => r.isActive === 1);
    } else if (this.statusFilter === 'INACTIVE') {
      filtered = filtered.filter(r => r.isActive === 0);
    }

    // Search Query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.cuisineType.toLowerCase().includes(q) || 
        r.address.toLowerCase().includes(q)
      );
    }

    if (countDisplay) {
      countDisplay.innerText = `Showing ${filtered.length} of ${this.restaurants.length} restaurants`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
            No restaurants found matching your search.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(r => `
      <tr id="resto-row-${r.restaurantID}">
        <td>
          <div class="flex items-center gap-3">
            <img src="${r.image}" alt="${r.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;">
            <div>
              <div style="font-weight: 700;">${r.name}</div>
              <div style="font-size: 11px; color: var(--color-text-muted);">ID: #${r.restaurantID}</div>
            </div>
          </div>
        </td>
        <td>
          <span style="font-size: 12.5px; color: var(--color-text-secondary);">${r.cuisineType}</span>
        </td>
        <td>
          <span style="font-weight: 600;">${r.deliveryTime} mins</span>
        </td>
        <td>
          <span class="badge-rating" style="padding: 2px 6px; font-size: 11px;">★ ${r.rating ? r.rating.toFixed(1) : '4.5'}</span>
        </td>
        <td>
          <label class="switch-control" title="Toggle Open/Close Status">
            <input type="checkbox" ${r.isActive === 1 ? 'checked' : ''} onchange="AdminRestaurants.toggleRestaurantActive(${r.restaurantID}, this.checked)">
            <span class="slider-round"></span>
          </label>
        </td>
        <td>
          <span style="font-size: 12px; color: var(--color-text-muted);">User #${r.adminUserID || 1}</span>
        </td>
        <td>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-sm" onclick="AdminRestaurants.openEditModal(${r.restaurantID})">
              ✏️ Edit
            </button>
            <button class="btn btn-ghost btn-sm" style="color: var(--color-error);" onclick="AdminRestaurants.deleteRestaurant(${r.restaurantID})">
              🗑️ Delete
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  // 3. Toggle Restaurant Active Status (Simulating RestaurantDAO.updateRestaurant)
  toggleRestaurantActive(restaurantID, isActive) {
    const resto = this.restaurants.find(r => r.restaurantID === restaurantID);
    if (resto) {
      resto.isActive = isActive ? 1 : 0;
      this.saveData();
      UIComponents.showToast(`"${resto.name}" is now ${isActive ? 'OPEN 🟢' : 'CLOSED 🔴'}`, 'normal');
    }
  },

  // 4. Open Modal for Add
  openAddModal() {
    this.editingRestaurantId = null;
    document.getElementById('modalTitle').innerText = 'Onboard New Restaurant';
    document.getElementById('restoForm').reset();
    document.getElementById('formRestoId').value = '';
    document.getElementById('restoModal').classList.add('active');
  },

  // 5. Open Modal for Edit
  openEditModal(restaurantID) {
    const resto = this.restaurants.find(r => r.restaurantID === restaurantID);
    if (!resto) return;

    this.editingRestaurantId = restaurantID;
    document.getElementById('modalTitle').innerText = `Edit "${resto.name}"`;
    document.getElementById('formRestoId').value = resto.restaurantID;
    document.getElementById('formRestoName').value = resto.name;
    document.getElementById('formRestoCuisine').value = resto.cuisineType;
    document.getElementById('formRestoDeliveryTime').value = resto.deliveryTime;
    document.getElementById('formRestoAddress').value = resto.address;
    document.getElementById('formRestoRating').value = resto.rating || 4.5;
    document.getElementById('formRestoImage').value = resto.image;
    document.getElementById('formRestoIsActive').checked = resto.isActive === 1;

    document.getElementById('restoModal').classList.add('active');
  },

  closeModal() {
    document.getElementById('restoModal').classList.remove('active');
  },

  // 6. Save Restaurant (Simulating RestaurantDAO.addRestaurant or updateRestaurant)
  saveRestaurant(event) {
    event.preventDefault();

    const name = document.getElementById('formRestoName').value.trim();
    const cuisineType = document.getElementById('formRestoCuisine').value.trim();
    const deliveryTime = parseInt(document.getElementById('formRestoDeliveryTime').value) || 30;
    const address = document.getElementById('formRestoAddress').value.trim();
    const rating = parseFloat(document.getElementById('formRestoRating').value) || 4.5;
    const image = document.getElementById('formRestoImage').value.trim() || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80";
    const isActive = document.getElementById('formRestoIsActive').checked ? 1 : 0;

    if (!name || !cuisineType || !address) {
      UIComponents.showToast('Please fill all required fields', 'error');
      return;
    }

    if (this.editingRestaurantId) {
      // Update existing
      const index = this.restaurants.findIndex(r => r.restaurantID === this.editingRestaurantId);
      if (index > -1) {
        this.restaurants[index] = {
          ...this.restaurants[index],
          name,
          cuisineType,
          deliveryTime,
          address,
          rating,
          image,
          isActive
        };
        UIComponents.showToast(`Updated "${name}" successfully! ✅`, 'success');
      }
    } else {
      // Add new
      const newId = Math.floor(100 + Math.random() * 900);
      const newResto = {
        restaurantID: newId,
        name,
        cuisineType,
        deliveryTime,
        address,
        adminUserID: 1,
        rating,
        isActive,
        priceForTwo: "₹400 for two",
        image,
        isPopular: false,
        isFastDelivery: deliveryTime <= 25
      };
      this.restaurants.unshift(newResto);
      UIComponents.showToast(`Restaurant "${name}" added successfully! 🎉`, 'success');
    }

    this.saveData();
    this.closeModal();
    this.renderRestaurantsTable();
  },

  // 7. Delete Restaurant (Simulating RestaurantDAO.deleteRestaurant)
  deleteRestaurant(restaurantID) {
    const resto = this.restaurants.find(r => r.restaurantID === restaurantID);
    if (!resto) return;

    if (confirm(`Are you sure you want to delete "${resto.name}"? This will also remove its associated menus.`)) {
      this.restaurants = this.restaurants.filter(r => r.restaurantID !== restaurantID);
      this.saveData();
      this.renderRestaurantsTable();
      UIComponents.showToast(`Deleted "${resto.name}"`, 'normal');
    }
  },

  saveData() {
    try {
      localStorage.setItem('foodapp_restaurants', JSON.stringify(this.restaurants));
      MockData.restaurants = this.restaurants;
    } catch (e) {
      console.error(e);
    }
  },

  attachEventListeners() {
    const search = document.getElementById('restoSearchInput');
    if (search) {
      search.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderRestaurantsTable();
      });
    }

    const statusFilter = document.getElementById('statusFilterSelect');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.renderRestaurantsTable();
      });
    }
  }
};

// Auto Boot
document.addEventListener('DOMContentLoaded', () => {
  AdminRestaurants.init();
});
