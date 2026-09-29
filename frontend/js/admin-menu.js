/**
 * FoodApp - Admin Menu Catalog Management Logic
 * High-Level SaaS Grade • Pure Vanilla JavaScript
 * Direct mapping to MenuDAO (addMenu, updateMenu, deleteMenu, getAllMenusByRestaurant)
 */

const AdminMenu = {
  menus: [],
  restaurants: [],
  selectedRestaurantId: 101, // Meghana Foods by default
  searchQuery: '',
  categoryFilter: 'ALL',
  dietFilter: 'ALL', // 'ALL', 'VEG', 'NON_VEG'
  stockFilter: 'ALL', // 'ALL', 'IN_STOCK', 'OUT_OF_STOCK'
  editingMenuId: null,

  init() {
    this.loadData();
    AdminApp.init('menu');
    this.renderRestaurantSelector();
    this.renderMenuItemsTable();
    this.attachEventListeners();
  },

  // 1. Load Data (Simulating MenuDAO & RestaurantDAO)
  loadData() {
    this.restaurants = MockData.restaurants || [];
    
    let savedMenus = [];
    try {
      savedMenus = JSON.parse(localStorage.getItem('foodapp_menus') || '[]');
    } catch (e) {
      console.error(e);
    }

    if (savedMenus.length === 0) {
      savedMenus = [...MockData.menus];
      try {
        localStorage.setItem('foodapp_menus', JSON.stringify(savedMenus));
      } catch (e) {}
    }

    this.menus = savedMenus;
  },

  // 2. Render Restaurant Selector Dropdown
  renderRestaurantSelector() {
    const select = document.getElementById('menuRestoSelect');
    const modalRestoSelect = document.getElementById('formDishRestaurant');
    if (!select) return;

    const optionsHtml = this.restaurants.map(r => `
      <option value="${r.restaurantID}" ${r.restaurantID === this.selectedRestaurantId ? 'selected' : ''}>
        ${r.name}
      </option>
    `).join('');

    select.innerHTML = optionsHtml;
    if (modalRestoSelect) modalRestoSelect.innerHTML = optionsHtml;
  },

  // 3. Switch Selected Restaurant
  changeRestaurant(restaurantID) {
    this.selectedRestaurantId = parseInt(restaurantID);
    this.renderMenuItemsTable();
  },

  // 4. Render Menu Items Table
  renderMenuItemsTable() {
    const tbody = document.getElementById('menuTableBody');
    const countDisplay = document.getElementById('dishCountText');
    if (!tbody) return;

    // Filter by Restaurant
    let filtered = this.menus.filter(m => m.restaurantID === this.selectedRestaurantId);

    // Filter by Category
    if (this.categoryFilter !== 'ALL') {
      filtered = filtered.filter(m => m.category === this.categoryFilter);
    }

    // Filter by Diet (Veg vs Non-Veg)
    if (this.dietFilter === 'VEG') {
      filtered = filtered.filter(m => m.isVeg === true);
    } else if (this.dietFilter === 'NON_VEG') {
      filtered = filtered.filter(m => m.isVeg === false);
    }

    // Filter by Stock
    if (this.stockFilter === 'IN_STOCK') {
      filtered = filtered.filter(m => m.isAvailable === 1 || m.isAvailable === true);
    } else if (this.stockFilter === 'OUT_OF_STOCK') {
      filtered = filtered.filter(m => m.isAvailable === 0 || m.isAvailable === false);
    }

    // Search Query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.itemName.toLowerCase().includes(q) || 
        (m.description && m.description.toLowerCase().includes(q))
      );
    }

    if (countDisplay) {
      countDisplay.innerText = `Showing ${filtered.length} dishes in this outlet catalog`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 48px 20px; color: #64748B;">
            <div style="font-size: 28px; margin-bottom: 8px;">🍲</div>
            <div style="font-weight: 700; font-size: 15px; color: #0F172A;">No dishes found</div>
            <div style="font-size: 13px;">Try adjusting filters or click "+ Add New Dish"</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(dish => {
      const isAvailable = dish.isAvailable === 1 || dish.isAvailable === true;
      return `
        <tr id="dish-row-${dish.menuID}">
          <td>
            <div class="flex items-center gap-3">
              <img src="${dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}" alt="${dish.itemName}" style="width: 48px; height: 48px; border-radius: 10px; object-fit: cover;">
              <div>
                <div class="flex items-center gap-2">
                  <span class="diet-icon ${dish.isVeg ? 'veg' : 'non-veg'}" title="${dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}">
                    <span class="diet-dot"></span>
                  </span>
                  <span style="font-weight: 700; color: #0F172A;">${dish.itemName}</span>
                </div>
                <div style="font-size: 12px; color: #64748B; max-width: 280px;" class="truncate">${dish.description || ''}</div>
              </div>
            </div>
          </td>
          <td>
            <span style="font-size: 12px; font-weight: 600; padding: 4px 10px; background: #F1F5F9; border-radius: 999px; color: #334155;">
              ${dish.category}
            </span>
          </td>
          <td>
            <span style="font-size: 14px; font-weight: 800; color: #0F172A;">₹${dish.price}</span>
          </td>
          <td>
            <span class="badge-status ${dish.isVeg ? 'open' : 'closed'}" style="font-size: 11px;">
              ${dish.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
          </td>
          <td>
            <label class="switch-control" title="Toggle Stock Availability">
              <input type="checkbox" ${isAvailable ? 'checked' : ''} onchange="AdminMenu.toggleAvailability(${dish.menuID}, this.checked)">
              <span class="slider-round"></span>
            </label>
          </td>
          <td>
            <div class="flex gap-2">
              <button class="btn btn-outline btn-sm" onclick="AdminMenu.openEditModal(${dish.menuID})">
                ✏️ Edit
              </button>
              <button class="btn btn-ghost btn-sm" style="color: var(--color-error);" onclick="AdminMenu.deleteDish(${dish.menuID})">
                🗑️ Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // 5. Toggle Stock Availability (Simulating MenuDAO.updateMenu)
  toggleAvailability(menuID, isAvailable) {
    const dish = this.menus.find(m => m.menuID === menuID);
    if (dish) {
      dish.isAvailable = isAvailable ? 1 : 0;
      this.saveData();
      UIComponents.showToast(`"${dish.itemName}" is now ${isAvailable ? 'IN STOCK 🟢' : 'OUT OF STOCK 🔴'}`, 'normal');
    }
  },

  // 6. Open Modal for Add
  openAddModal() {
    this.editingMenuId = null;
    document.getElementById('dishModalTitle').innerText = 'Add New Dish to Catalog';
    document.getElementById('dishForm').reset();
    document.getElementById('formDishId').value = '';
    document.getElementById('formDishRestaurant').value = this.selectedRestaurantId;
    document.getElementById('dishModal').classList.add('active');
  },

  // 7. Open Modal for Edit
  openEditModal(menuID) {
    const dish = this.menus.find(m => m.menuID === menuID);
    if (!dish) return;

    this.editingMenuId = menuID;
    document.getElementById('dishModalTitle').innerText = `Edit "${dish.itemName}"`;
    document.getElementById('formDishId').value = dish.menuID;
    document.getElementById('formDishRestaurant').value = dish.restaurantID;
    document.getElementById('formDishName').value = dish.itemName;
    document.getElementById('formDishCategory').value = dish.category;
    document.getElementById('formDishPrice').value = dish.price;
    document.getElementById('formDishIsVeg').checked = dish.isVeg;
    document.getElementById('formDishDescription').value = dish.description || '';
    document.getElementById('formDishImage').value = dish.image || '';
    document.getElementById('formDishIsAvailable').checked = dish.isAvailable === 1 || dish.isAvailable === true;

    document.getElementById('dishModal').classList.add('active');
  },

  closeModal() {
    document.getElementById('dishModal').classList.remove('active');
  },

  // 8. Save Dish (Simulating MenuDAO.addMenu or updateMenu)
  saveDish(event) {
    event.preventDefault();

    const restaurantID = parseInt(document.getElementById('formDishRestaurant').value);
    const itemName = document.getElementById('formDishName').value.trim();
    const category = document.getElementById('formDishCategory').value.trim();
    const price = parseFloat(document.getElementById('formDishPrice').value) || 0;
    const isVeg = document.getElementById('formDishIsVeg').checked;
    const description = document.getElementById('formDishDescription').value.trim();
    const image = document.getElementById('formDishImage').value.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80";
    const isAvailable = document.getElementById('formDishIsAvailable').checked ? 1 : 0;

    if (!itemName || !category || price <= 0) {
      UIComponents.showToast('Please fill all required fields with valid pricing', 'error');
      return;
    }

    if (this.editingMenuId) {
      // Update existing
      const index = this.menus.findIndex(m => m.menuID === this.editingMenuId);
      if (index > -1) {
        this.menus[index] = {
          ...this.menus[index],
          restaurantID,
          itemName,
          category,
          price,
          isVeg,
          description,
          image,
          isAvailable
        };
        UIComponents.showToast(`Updated "${itemName}" successfully! ✅`, 'success');
      }
    } else {
      // Add new
      const newMenuID = Math.floor(10000 + Math.random() * 90000);
      const newDish = {
        menuID: newMenuID,
        restaurantID,
        itemName,
        description,
        price,
        isVeg,
        category,
        image,
        isAvailable,
        isBestSeller: false
      };
      this.menus.unshift(newDish);
      UIComponents.showToast(`Dish "${itemName}" added to menu! 🎉`, 'success');
    }

    this.saveData();
    this.closeModal();
    this.renderMenuItemsTable();
  },

  // 9. Delete Dish (Simulating MenuDAO.deleteMenu)
  deleteDish(menuID) {
    const dish = this.menus.find(m => m.menuID === menuID);
    if (!dish) return;

    if (confirm(`Are you sure you want to remove "${dish.itemName}" from the menu catalog?`)) {
      this.menus = this.menus.filter(m => m.menuID !== menuID);
      this.saveData();
      this.renderMenuItemsTable();
      UIComponents.showToast(`Removed "${dish.itemName}" from catalog`, 'normal');
    }
  },

  saveData() {
    try {
      localStorage.setItem('foodapp_menus', JSON.stringify(this.menus));
      MockData.menus = this.menus;
    } catch (e) {
      console.error(e);
    }
  },

  attachEventListeners() {
    const search = document.getElementById('dishSearchInput');
    if (search) {
      search.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderMenuItemsTable();
      });
    }

    const diet = document.getElementById('dishDietFilter');
    if (diet) {
      diet.addEventListener('change', (e) => {
        this.dietFilter = e.target.value;
        this.renderMenuItemsTable();
      });
    }

    const stock = document.getElementById('dishStockFilter');
    if (stock) {
      stock.addEventListener('change', (e) => {
        this.stockFilter = e.target.value;
        this.renderMenuItemsTable();
      });
    }
  }
};

// Auto Boot
document.addEventListener('DOMContentLoaded', () => {
  AdminMenu.init();
});
