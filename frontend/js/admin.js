/**
 * FoodApp - Admin & Restaurant Partner Portal Logic
 * Only Vanilla JavaScript
 * Direct mapping to OrderDAO, RestaurantDAO, MenuDAO, UserDAO
 */

const AdminApp = {
  activeRestaurant: null,
  orders: [],
  restaurants: [],
  menus: [],

  init(activePage = 'dashboard') {
    if (typeof ThemeManager !== 'undefined') {
      ThemeManager.init();
    }
    this.loadData();
    this.renderSidebar(activePage);
    this.renderTopbar();
    if (activePage === 'dashboard') {
      this.renderDashboardKPIs();
      this.renderRecentOrdersTable();
    }
  },

  // 1. Load Data from Mock Service
  loadData() {
    this.restaurants = MockData.restaurants || [];
    this.activeRestaurant = this.restaurants[0] || { name: "Meghana Foods Biryani", restaurantID: 101, isActive: 1 };
    
    try {
      this.orders = JSON.parse(localStorage.getItem('foodapp_orders') || '[]');
    } catch (e) {
      this.orders = [];
    }

    if (this.orders.length === 0) {
      this.orders = [
        {
          orderID: 849201,
          customerName: "Lokesh Sharma",
          restaurantID: 101,
          totalAmount: 580,
          status: "PREPARING",
          paymentMethod: "UPI",
          paymentStatus: "PAID",
          orderDate: new Date().toISOString(),
          items: [
            { itemName: "Meghana Special Chicken Biryani", quantity: 1, price: 320 },
            { itemName: "Andhra Chilli Chicken", quantity: 1, price: 240 }
          ]
        },
        {
          orderID: 849195,
          customerName: "Sneha Reddy",
          restaurantID: 101,
          totalAmount: 390,
          status: "OUT_FOR_DELIVERY",
          paymentMethod: "CARD",
          paymentStatus: "PAID",
          orderDate: new Date(Date.now() - 1800000).toISOString(),
          items: [
            { itemName: "Mutton Boneless Biryani", quantity: 1, price: 390 }
          ]
        },
        {
          orderID: 849180,
          customerName: "Vikram Patil",
          restaurantID: 101,
          totalAmount: 400,
          status: "DELIVERED",
          paymentMethod: "COD",
          paymentStatus: "PAID",
          orderDate: new Date(Date.now() - 7200000).toISOString(),
          items: [
            { itemName: "Paneer Butter Masala Biryani", quantity: 1, price: 260 },
            { itemName: "Gulab Jamun (2 Pcs)", quantity: 1, price: 110 }
          ]
        }
      ];
      try {
        localStorage.setItem('foodapp_orders', JSON.stringify(this.orders));
      } catch (e) {}
    }

    this.menus = MockData.menus || [];
  },

  // 2. Render Shared Admin Sidebar
  renderSidebar(activePage) {
    const sidebar = document.getElementById('adminSidebar');
    if (!sidebar) return;

    const activeOrdersCount = this.orders.filter(o => ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status)).length;

    sidebar.innerHTML = `
      <div class="admin-sidebar-header">
        <div class="admin-logo-icon">🍔</div>
        <div class="admin-logo-text">
          <h3>FoodApp</h3>
          <span>Partner Portal</span>
        </div>
      </div>

      <ul class="admin-nav-list">
        <li class="admin-nav-item ${activePage === 'dashboard' ? 'active' : ''}">
          <a href="admin-dashboard.html">
            <div class="admin-nav-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Dashboard</span>
            </div>
          </a>
        </li>

        <li class="admin-nav-item ${activePage === 'restaurants' ? 'active' : ''}">
          <a href="admin-restaurants.html">
            <div class="admin-nav-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span>Restaurants</span>
            </div>
          </a>
        </li>

        <li class="admin-nav-item ${activePage === 'menu' ? 'active' : ''}">
          <a href="admin-menu.html">
            <div class="admin-nav-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
              <span>Menu Catalog</span>
            </div>
          </a>
        </li>

        <li class="admin-nav-item ${activePage === 'orders' ? 'active' : ''}">
          <a href="admin-orders.html">
            <div class="admin-nav-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span>Live Orders</span>
            </div>
            ${activeOrdersCount > 0 ? `<span class="admin-nav-badge">${activeOrdersCount}</span>` : ''}
          </a>
        </li>

        <li class="admin-nav-item ${activePage === 'users' ? 'active' : ''}">
          <a href="admin-users.html">
            <div class="admin-nav-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>User Directory</span>
            </div>
          </a>
        </li>
      </ul>

      <div class="admin-sidebar-footer">
        <a href="index.html" class="switch-to-customer-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          <span>Back to FoodApp Store</span>
        </a>
      </div>
    `;
  },

  // 3. Render Topbar
  renderTopbar() {
    const topbar = document.getElementById('adminTopbar');
    if (!topbar) return;

    const isDark = (typeof ThemeManager !== 'undefined') ? ThemeManager.getEffectiveTheme() === 'dark' : false;

    topbar.innerHTML = `
      <div class="admin-topbar-left">
        <div class="store-selector">
          <span class="store-status-indicator" id="storeIndicator"></span>
          <span>${this.activeRestaurant.name}</span>
        </div>
      </div>

      <div class="admin-topbar-right">
        <!-- Theme Switcher -->
        <button type="button" class="theme-toggle-btn btn-sm ${isDark ? 'is-dark' : ''}" id="adminThemeToggle" onclick="ThemeManager.toggle()" aria-label="Toggle Theme" title="${isDark ? 'Switch to Light Mode (☀️)' : 'Switch to Dark Mode (🌙)'}">
          ${isDark ? (typeof ThemeManager !== 'undefined' ? ThemeManager.icons.sun : '☀️') : (typeof ThemeManager !== 'undefined' ? ThemeManager.icons.moon : '🌙')}
        </button>

        <label class="flex items-center gap-2" style="font-size: 12.5px; font-weight: 600; cursor: pointer;">
          <span id="storeStatusLabel">Store Open</span>
          <label class="switch-control">
            <input type="checkbox" id="storeStatusToggle" checked onchange="AdminApp.toggleStoreStatus(this.checked)">
            <span class="slider-round"></span>
          </label>
        </label>

        <div class="admin-user-pill">
          <div class="admin-avatar-small">AD</div>
          <span>Store Admin</span>
        </div>
      </div>
    `;
  },

  // 4. Render Dashboard KPI Cards
  renderDashboardKPIs() {
    const totalRevenue = this.orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0) + 47550;
    const activeOrders = this.orders.filter(o => ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status)).length;
    const totalDishes = this.menus.length + 18;

    const kpiContainer = document.getElementById('dashboardKPIs');
    if (!kpiContainer) return;

    kpiContainer.innerHTML = `
      <div class="kpi-card">
        <div class="kpi-info-col">
          <span class="kpi-label">Today's Revenue</span>
          <span class="kpi-value">₹${totalRevenue.toLocaleString()}</span>
          <span class="kpi-trend positive">▲ +14% vs yesterday</span>
        </div>
        <div class="kpi-icon-box revenue">💰</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info-col">
          <span class="kpi-label">Active Kitchen Orders</span>
          <span class="kpi-value">${activeOrders} Active</span>
          <span class="kpi-trend positive">⚡ 2 Ready for dispatch</span>
        </div>
        <div class="kpi-icon-box orders">🛵</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info-col">
          <span class="kpi-label">Active Menu Items</span>
          <span class="kpi-value">${totalDishes} Dishes</span>
          <span class="kpi-trend neutral">● 2 Items out of stock</span>
        </div>
        <div class="kpi-icon-box dishes">🍲</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info-col">
          <span class="kpi-label">Store Rating</span>
          <span class="kpi-value">${this.activeRestaurant.rating || 4.6} ★</span>
          <span class="kpi-trend positive">From 1,200+ foodies</span>
        </div>
        <div class="kpi-icon-box rating">⭐</div>
      </div>
    `;
  },

  // 5. Render Recent Orders Table
  renderRecentOrdersTable() {
    const tableBody = document.getElementById('recentOrdersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = this.orders.slice(0, 5).map(o => `
      <tr>
        <td><strong>#${o.orderID}</strong></td>
        <td>${o.customerName || "Customer"}</td>
        <td>
          <span class="truncate" style="max-width: 200px; display: inline-block;">
            ${(o.items || []).map(i => `${i.quantity}x ${i.itemName}`).join(', ')}
          </span>
        </td>
        <td><strong>₹${o.totalAmount}</strong></td>
        <td>
          <span style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary);">
            ${o.paymentMethod} (${o.paymentStatus})
          </span>
        </td>
        <td>
          <span class="badge-status ${o.status === 'DELIVERED' ? 'open' : (o.status === 'CANCELLED' ? 'closed' : 'open')}">
            ${o.status.replace(/_/g, ' ')}
          </span>
        </td>
        <td>
          <a href="admin-orders.html" class="btn btn-outline btn-sm">
            Manage ➔
          </a>
        </td>
      </tr>
    `).join('');
  },

  // 6. Toggle Store Online / Offline Status
  toggleStoreStatus(isOpen) {
    const label = document.getElementById('storeStatusLabel');
    const indicator = document.getElementById('storeIndicator');

    if (label) label.innerText = isOpen ? "Store Open" : "Store Closed";
    if (indicator) indicator.style.backgroundColor = isOpen ? "var(--color-success)" : "var(--color-error)";

    this.activeRestaurant.isActive = isOpen ? 1 : 0;
    UIComponents.showToast(isOpen ? "Store is now OPEN for orders 🟢" : "Store marked as CLOSED 🔴", 'normal');
  }
};
