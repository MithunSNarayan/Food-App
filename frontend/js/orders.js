/**
 * FoodApp - Order History Page Logic
 * Only Vanilla JavaScript
 * Direct mapping to OrderDAO.getAllOrders()
 */

const OrderHistory = {
  orders: [],
  activeTab: 'ALL', // 'ALL', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'
  activeInvoiceOrder: null,

  init() {
    this.loadOrders();
    this.renderHeaderAndFooter();
    this.renderOrdersList();
    this.attachEventListeners();
    this.setupCartListener();
  },

  // 1. Load Orders (Simulating OrderDAO.getAllOrders())
  loadOrders() {
    let savedOrders = [];
    try {
      savedOrders = JSON.parse(localStorage.getItem('foodapp_orders') || '[]');
    } catch (e) {
      console.error(e);
    }

    if (savedOrders.length === 0) {
      // Seed default realistic past orders
      savedOrders = [
        {
          orderID: 849201,
          userID: 1,
          customerName: "Lokesh Sharma",
          customerPhone: "+91 98765 43210",
          deliveryAddress: "Flat 402, Sunshine Heights, BTM 2nd Stage, Bengaluru",
          restaurantID: 101,
          restaurantName: "Meghana Foods Biryani",
          restaurantAddress: "100ft Road, Koramangala 5th Block, Bengaluru",
          orderDate: new Date(Date.now() - 3600000).toISOString(),
          totalAmount: 580,
          status: "DELIVERED",
          paymentMethod: "UPI",
          paymentStatus: "PAID",
          items: [
            { menuID: 1001, itemName: "Meghana Special Chicken Biryani", price: 320, quantity: 1, isVeg: false },
            { menuID: 1003, itemName: "Andhra Chilli Chicken", price: 240, quantity: 1, isVeg: false }
          ]
        },
        {
          orderID: 720194,
          userID: 1,
          customerName: "Lokesh Sharma",
          customerPhone: "+91 98765 43210",
          deliveryAddress: "Tech Park, 5th Floor, Electronic City, Bengaluru",
          restaurantID: 102,
          restaurantName: "Truffles Gourmet Burgers",
          restaurantAddress: "St. Marks Road, Central Bengaluru",
          orderDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          totalAmount: 400,
          status: "DELIVERED",
          paymentMethod: "CARD",
          paymentStatus: "PAID",
          items: [
            { menuID: 2001, itemName: "All American Cheeseburger", price: 240, quantity: 1, isVeg: false },
            { menuID: 2003, itemName: "Loaded Cheese Truffle Fries", price: 160, quantity: 1, isVeg: true }
          ]
        }
      ];
      try {
        localStorage.setItem('foodapp_orders', JSON.stringify(savedOrders));
      } catch (e) {}
    }

    this.orders = savedOrders;
  },

  // 2. Render Header & Footer
  renderHeaderAndFooter() {
    const navPlaceholder = document.getElementById('navbarPlaceholder');
    if (navPlaceholder) {
      navPlaceholder.innerHTML = UIComponents.renderNavbar('orders');
    }

    const footerPlaceholder = document.getElementById('footerPlaceholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = UIComponents.renderFooter();
    }
  },

  // 3. Render Filtered Orders List
  renderOrdersList() {
    const container = document.getElementById('ordersListContainer');
    if (!container) return;

    let filtered = [...this.orders];

    if (this.activeTab === 'IN_PROGRESS') {
      filtered = filtered.filter(o => ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status));
    } else if (this.activeTab === 'DELIVERED') {
      filtered = filtered.filter(o => o.status === 'DELIVERED');
    } else if (this.activeTab === 'CANCELLED') {
      filtered = filtered.filter(o => o.status === 'CANCELLED');
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="listing-empty-state" style="padding: 60px 20px;">
          <div class="empty-state-icon">📦</div>
          <h3>No orders found</h3>
          <p>You have no orders in this category. Craving something fresh?</p>
          <a href="restaurants.html" class="btn btn-primary">Browse Restaurants</a>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(order => {
      const isActive = ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status);
      const isDelivered = order.status === 'DELIVERED';
      const isCancelled = order.status === 'CANCELLED';

      let statusBadgeClass = 'in-progress';
      if (isDelivered) statusBadgeClass = 'delivered';
      if (isCancelled) statusBadgeClass = 'cancelled';

      return `
        <div class="order-history-card" id="order-card-${order.orderID}">
          <!-- Top Row -->
          <div class="order-card-top">
            <div class="order-resto-info">
              <div class="order-resto-icon">🍽️</div>
              <div class="order-resto-details">
                <h3>${order.restaurantName}</h3>
                <p>Order #${order.orderID} • ${new Date(order.orderDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at ${new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            <div class="order-status-badge ${statusBadgeClass}">
              ● ${order.status.replace(/_/g, ' ')}
            </div>
          </div>

          <!-- Items Summary -->
          <div class="order-items-summary">
            ${order.items.map(item => `
              <div class="order-item-line">
                <span style="font-weight: 600;">${item.quantity}×</span>
                <span>${item.itemName}</span>
                <span style="color: var(--color-text-muted);">— ₹${item.price * item.quantity}</span>
              </div>
            `).join('')}
          </div>

          <!-- Bottom Row: Price & Actions -->
          <div class="order-card-bottom">
            <div class="order-total-price">
              Total Paid: <span style="color: var(--color-primary);">₹${order.totalAmount}</span>
            </div>

            <div class="order-actions-group">
              ${isActive ? `
                <a href="order-tracking.html?orderId=${order.orderID}" class="btn btn-primary btn-sm">
                  <span>🛵 Track Live</span>
                </a>
              ` : `
                <button class="btn btn-primary btn-sm" onclick="OrderHistory.reorder(${order.orderID})">
                  <span>🔄 Re-order</span>
                </button>
              `}

              <button class="btn btn-outline btn-sm" onclick="OrderHistory.openInvoiceModal(${order.orderID})">
                <span>📄 View Invoice</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // 4. Switch Filter Tab
  setFilterTab(tab, btn) {
    this.activeTab = tab;
    document.querySelectorAll('.orders-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderOrdersList();
  },

  // 5. Reorder Action
  reorder(orderID) {
    const order = this.orders.find(o => o.orderID === orderID);
    if (!order) return;

    if (confirm(`Do you want to re-order all ${order.items.length} items from "${order.restaurantName}"?`)) {
      CartService.clearCart();
      order.items.forEach(item => {
        CartService.addItem({
          menuID: item.menuID,
          itemName: item.itemName,
          price: item.price,
          isVeg: item.isVeg,
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80"
        }, {
          restaurantID: order.restaurantID,
          name: order.restaurantName,
          address: order.restaurantAddress
        });
      });

      UIComponents.showToast('Items added to cart! Redirecting to cart...', 'success');
      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 700);
    }
  },

  // 6. Invoice Modal Actions
  openInvoiceModal(orderID) {
    const order = this.orders.find(o => o.orderID === orderID);
    if (!order) return;

    this.activeInvoiceOrder = order;
    const modal = document.getElementById('invoiceModal');
    const content = document.getElementById('invoiceModalContent');

    if (modal && content) {
      content.innerHTML = `
        <div class="invoice-header">
          <div style="font-size: 24px; font-weight: 800; color: var(--color-primary);">FoodApp Receipt</div>
          <p style="font-size: 12px; color: var(--color-text-muted);">Tax Invoice & Order Summary</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; font-size: 13px;">
          <div>
            <strong>Order Details:</strong>
            <p>Order ID: #${order.orderID}</p>
            <p>Date: ${new Date(order.orderDate).toLocaleString()}</p>
            <p>Status: ${order.status}</p>
          </div>
          <div>
            <strong>Restaurant:</strong>
            <p>${order.restaurantName}</p>
            <p>${order.restaurantAddress}</p>
          </div>
        </div>

        <div style="font-size: 13px; margin-bottom: 20px;">
          <strong>Billed To:</strong>
          <p>${order.customerName} (${order.customerPhone})</p>
          <p>${order.deliveryAddress}</p>
        </div>

        <table class="invoice-table">
          <thead>
            <tr>
              <th>Dish Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(i => `
              <tr>
                <td>${i.itemName}</td>
                <td>${i.quantity}</td>
                <td>₹${i.price}</td>
                <td style="text-align: right;">₹${i.price * i.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="invoice-footer">
          <div>
            <span style="font-size: 12px; color: var(--color-text-muted);">Payment Mode:</span>
            <strong>${order.paymentMethod} (${order.paymentStatus})</strong>
          </div>
          <div style="font-size: 18px; font-weight: 800; color: var(--color-primary);">
            Grand Total: ₹${order.totalAmount}
          </div>
        </div>

        <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end;">
          <button class="btn btn-outline btn-sm" onclick="window.print()">🖨️ Print Invoice</button>
          <button class="btn btn-primary btn-sm" onclick="OrderHistory.closeInvoiceModal()">Close</button>
        </div>
      `;

      modal.classList.add('active');
    }
  },

  closeInvoiceModal() {
    const modal = document.getElementById('invoiceModal');
    if (modal) modal.classList.remove('active');
  },

  attachEventListeners() {},

  setupCartListener() {
    window.addEventListener('cartUpdated', () => {
      const badge = document.getElementById('cartBadgeCount');
      if (badge) badge.innerText = CartService.getItemCount();
    });
  }
};

// Auto Boot
document.addEventListener('DOMContentLoaded', () => {
  OrderHistory.init();
});
