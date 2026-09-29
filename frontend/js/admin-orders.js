/**
 * FoodApp - Admin Live Orders & Kitchen Board Logic
 * High-Level SaaS Grade • Pure Vanilla JavaScript
 * Direct mapping to OrderDAO (getAllOrders, updateOrder, getOrder)
 */

const AdminOrders = {
  orders: [],
  currentView: 'kanban', // 'kanban' or 'list'
  filterStatus: 'ALL',

  init() {
    this.loadOrders();
    AdminApp.init('orders');
    this.renderKanbanBoard();
    this.renderListViewTable();
  },

  // 1. Load Orders (Simulating OrderDAO.getAllOrders())
  loadOrders() {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('foodapp_orders') || '[]');
    } catch (e) {
      console.error(e);
    }

    if (saved.length === 0) {
      saved = [
        {
          orderID: 849205,
          customerName: "Ananya Iyer",
          customerPhone: "+91 98450 22119",
          deliveryAddress: "Flat 204, Green Glen Layout, Bellandur, Bengaluru",
          restaurantID: 101,
          totalAmount: 640,
          status: "PENDING",
          paymentMethod: "UPI",
          paymentStatus: "PAID",
          orderDate: new Date().toISOString(),
          items: [
            { itemName: "Meghana Special Chicken Biryani", quantity: 2, price: 320, isVeg: false }
          ]
        },
        {
          orderID: 849201,
          customerName: "Lokesh Sharma",
          customerPhone: "+91 98765 43210",
          deliveryAddress: "Flat 402, Sunshine Heights, BTM 2nd Stage, Bengaluru",
          restaurantID: 101,
          totalAmount: 580,
          status: "PREPARING",
          paymentMethod: "UPI",
          paymentStatus: "PAID",
          orderDate: new Date(Date.now() - 600000).toISOString(),
          items: [
            { itemName: "Meghana Special Chicken Biryani", quantity: 1, price: 320, isVeg: false },
            { itemName: "Andhra Chilli Chicken", quantity: 1, price: 240, isVeg: false }
          ]
        },
        {
          orderID: 849195,
          customerName: "Sneha Reddy",
          customerPhone: "+91 91234 56789",
          deliveryAddress: "Villa 12, Palm Meadows, Whitefield, Bengaluru",
          restaurantID: 101,
          totalAmount: 390,
          status: "OUT_FOR_DELIVERY",
          paymentMethod: "CARD",
          paymentStatus: "PAID",
          orderDate: new Date(Date.now() - 1800000).toISOString(),
          items: [
            { itemName: "Mutton Boneless Biryani", quantity: 1, price: 390, isVeg: false }
          ]
        },
        {
          orderID: 849180,
          customerName: "Vikram Patil",
          customerPhone: "+91 99887 76655",
          deliveryAddress: "14th Main, HSR Layout Sector 3, Bengaluru",
          restaurantID: 101,
          totalAmount: 370,
          status: "DELIVERED",
          paymentMethod: "COD",
          paymentStatus: "PAID",
          orderDate: new Date(Date.now() - 7200000).toISOString(),
          items: [
            { itemName: "Paneer Butter Masala Biryani", quantity: 1, price: 260, isVeg: true },
            { itemName: "Gulab Jamun (2 Pcs)", quantity: 1, price: 110, isVeg: true }
          ]
        }
      ];
      try {
        localStorage.setItem('foodapp_orders', JSON.stringify(saved));
      } catch (e) {}
    }

    this.orders = saved;
  },

  // 2. Render Kanban Pipeline Board
  renderKanbanBoard() {
    const pendingCol = document.getElementById('kanbanPendingCards');
    const prepCol = document.getElementById('kanbanPrepCards');
    const outCol = document.getElementById('kanbanOutCards');
    const delCol = document.getElementById('kanbanDelCards');

    if (!pendingCol || !prepCol || !outCol || !delCol) return;

    const pendingOrders = this.orders.filter(o => o.status === 'PENDING');
    const prepOrders = this.orders.filter(o => o.status === 'PREPARING');
    const outOrders = this.orders.filter(o => o.status === 'OUT_FOR_DELIVERY');
    const delOrders = this.orders.filter(o => o.status === 'DELIVERED');

    // Counts
    document.getElementById('countPending').innerText = pendingOrders.length;
    document.getElementById('countPrep').innerText = prepOrders.length;
    document.getElementById('countOut').innerText = outOrders.length;
    document.getElementById('countDel').innerText = delOrders.length;

    pendingCol.innerHTML = this.generateCardsHTML(pendingOrders, 'PREPARING', 'Accept & Cook ➔');
    prepCol.innerHTML = this.generateCardsHTML(prepOrders, 'OUT_FOR_DELIVERY', 'Dispatch Rider ➔');
    outCol.innerHTML = this.generateCardsHTML(outOrders, 'DELIVERED', 'Mark Delivered ✓');
    delCol.innerHTML = this.generateCardsHTML(delOrders, null, null);
  },

  generateCardsHTML(ordersList, nextStatus, actionText) {
    if (ordersList.length === 0) {
      return `<div style="text-align: center; padding: 24px 10px; color: #94A3B8; font-size: 13px;">No orders in this stage</div>`;
    }

    return ordersList.map(o => `
      <div class="kitchen-order-card" id="kot-card-${o.orderID}">
        <!-- Top -->
        <div class="kot-card-header">
          <span class="kot-order-num">#${o.orderID}</span>
          <span class="kot-time-ago">${this.getTimeAgo(o.orderDate)}</span>
        </div>

        <!-- Customer -->
        <div class="kot-customer-info">
          <strong>${o.customerName}</strong>
          <span style="font-size: 11px; color: #64748B;">📍 ${o.deliveryAddress}</span>
        </div>

        <!-- Dishes List -->
        <div class="kot-dishes-list">
          ${(o.items || []).map(i => `
            <div class="kot-dish-row">
              <span class="kot-dish-name">
                <span style="font-weight: 700; color: var(--color-primary);">${i.quantity}x</span>
                <span>${i.itemName}</span>
              </span>
              <span style="font-weight: 700; color: #334155;">₹${(i.price || 0) * (i.quantity || 1)}</span>
            </div>
          `).join('')}
        </div>

        <!-- Footer & Action -->
        <div class="kot-card-footer">
          <div>
            <div class="kot-price-total">₹${o.totalAmount}</div>
            <div style="font-size: 10.5px; color: #64748B; font-weight: 600;">${o.paymentMethod} (${o.paymentStatus})</div>
          </div>

          <div class="flex gap-2">
            <button class="btn btn-outline btn-sm" onclick="AdminOrders.viewTicket(${o.orderID})" title="View KOT Slip">
              📄 Slip
            </button>
            ${nextStatus ? `
              <button class="kot-btn-advance" onclick="AdminOrders.advanceOrderStatus(${o.orderID}, '${nextStatus}')">
                ${actionText}
              </button>
            ` : `
              <span style="font-size: 11px; font-weight: 700; color: #16A34A; padding: 4px 8px; background: #DCFCE7; border-radius: 6px;">Completed</span>
            `}
          </div>
        </div>
      </div>
    `).join('');
  },

  // 3. Render List View Table
  renderListViewTable() {
    const tbody = document.getElementById('ordersListTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.orders.map(o => `
      <tr>
        <td><strong>#${o.orderID}</strong></td>
        <td>
          <div style="font-weight: 700;">${o.customerName}</div>
          <div style="font-size: 11px; color: #64748B;">${o.customerPhone || ''}</div>
        </td>
        <td>
          <span style="font-size: 12.5px;">${(o.items || []).map(i => `${i.quantity}x ${i.itemName}`).join(', ')}</span>
        </td>
        <td><strong>₹${o.totalAmount}</strong></td>
        <td>
          <span style="font-size: 12px; font-weight: 600;">${o.paymentMethod} (${o.paymentStatus})</span>
        </td>
        <td>
          <span class="badge-status ${o.status === 'DELIVERED' ? 'open' : (o.status === 'CANCELLED' ? 'closed' : 'open')}">
            ${o.status.replace(/_/g, ' ')}
          </span>
        </td>
        <td>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-sm" onclick="AdminOrders.viewTicket(${o.orderID})">
              📄 Slip
            </button>
            ${o.status !== 'DELIVERED' && o.status !== 'CANCELLED' ? `
              <button class="btn btn-primary btn-sm" onclick="AdminOrders.advanceToNextStage(${o.orderID})">
                Advance ➔
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  },

  // 4. Advance Status
  advanceOrderStatus(orderID, newStatus) {
    const order = this.orders.find(o => o.orderID === orderID);
    if (order) {
      order.status = newStatus;
      if (newStatus === 'DELIVERED') order.paymentStatus = 'PAID';
      this.saveOrders();
      this.renderKanbanBoard();
      this.renderListViewTable();
      UIComponents.showToast(`Order #${orderID} advanced to "${newStatus.replace(/_/g, ' ')}" 🚀`, 'success');
    }
  },

  advanceToNextStage(orderID) {
    const order = this.orders.find(o => o.orderID === orderID);
    if (!order) return;

    if (order.status === 'PENDING') this.advanceOrderStatus(orderID, 'PREPARING');
    else if (order.status === 'PREPARING') this.advanceOrderStatus(orderID, 'OUT_FOR_DELIVERY');
    else if (order.status === 'OUT_FOR_DELIVERY') this.advanceOrderStatus(orderID, 'DELIVERED');
  },

  // 5. View KOT Ticket / Print Slip
  viewTicket(orderID) {
    const order = this.orders.find(o => o.orderID === orderID);
    if (!order) return;

    const modal = document.getElementById('kotModal');
    const content = document.getElementById('kotSlipContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align: center; border-bottom: 2px dashed #CBD5E1; padding-bottom: 16px; margin-bottom: 16px;">
        <div style="font-size: 20px; font-weight: 800; color: var(--color-primary);">KITCHEN ORDER TICKET (KOT)</div>
        <div style="font-size: 12px; color: #64748B;">FoodApp Partner Live Dispatch</div>
        <div style="font-size: 22px; font-weight: 800; margin-top: 6px;">Order #${order.orderID}</div>
        <div style="font-size: 12px; color: #64748B;">Placed: ${new Date(order.orderDate).toLocaleString()}</div>
      </div>

      <div style="margin-bottom: 16px; font-size: 13px;">
        <div><strong>Customer:</strong> ${order.customerName} (${order.customerPhone || '+91 98765 43210'})</div>
        <div><strong>Address:</strong> ${order.deliveryAddress}</div>
        <div><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})</div>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 1px solid #CBD5E1; text-align: left;">
              <th style="padding: 4px 0;">Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map(i => `
              <tr style="border-bottom: 1px dashed #E2E8F0;">
                <td style="padding: 6px 0; font-weight: 600;">${i.itemName}</td>
                <td style="text-align: center; font-weight: 800; color: var(--color-primary);">${i.quantity}</td>
                <td style="text-align: right;">₹${(i.price || 0) * (i.quantity || 1)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; margin-bottom: 20px;">
        <span>Total Amount:</span>
        <span style="color: var(--color-primary);">₹${order.totalAmount}</span>
      </div>

      <div class="flex gap-3 justify-end">
        <button class="btn btn-outline" onclick="window.print()">🖨️ Print Ticket</button>
        <button class="btn btn-primary" onclick="document.getElementById('kotModal').classList.remove('active')">Close</button>
      </div>
    `;

    modal.classList.add('active');
  },

  closeModal() {
    const modal = document.getElementById('kotModal');
    if (modal) modal.classList.remove('active');
  },

  // 6. Switch View (Kanban vs List)
  switchView(viewName, btn) {
    this.currentView = viewName;
    document.querySelectorAll('.view-switch-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const kanbanGrid = document.getElementById('kanbanGrid');
    const listView = document.getElementById('ordersListView');

    if (viewName === 'kanban') {
      kanbanGrid.classList.remove('hidden');
      listView.classList.remove('active');
    } else {
      kanbanGrid.classList.add('hidden');
      listView.classList.add('active');
    }
  },

  getTimeAgo(dateString) {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (diff <= 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  },

  saveOrders() {
    try {
      localStorage.setItem('foodapp_orders', JSON.stringify(this.orders));
    } catch (e) {
      console.error(e);
    }
  }
};

// Auto Boot
document.addEventListener('DOMContentLoaded', () => {
  AdminOrders.init();
});
