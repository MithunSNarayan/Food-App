/**
 * FoodApp - Order Confirmation & Live Tracking Logic
 * Only Vanilla JavaScript
 * Direct mapping to OrderDAO.getOrder(orderID) & updateOrder()
 */

const OrderTracking = {
  order: null,
  statusStages: ["PENDING", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"],

  init() {
    this.loadOrderData();
    this.renderHeaderAndFooter();
    this.renderTrackingView();
    this.attachEventListeners();
  },

  // 1. Load Order Data
  loadOrderData() {
    const params = new URLSearchParams(window.location.search);
    const orderId = parseInt(params.get('orderId'));

    let ordersList = [];
    try {
      ordersList = JSON.parse(localStorage.getItem('foodapp_orders') || '[]');
    } catch (e) {
      console.error(e);
    }

    if (orderId) {
      this.order = ordersList.find(o => o.orderID === orderId);
    }

    if (!this.order && ordersList.length > 0) {
      this.order = ordersList[0];
    }

    // Fallback realistic mock order if navigated directly
    if (!this.order) {
      this.order = {
        orderID: orderId || 584920,
        userID: 1,
        customerName: "Lokesh Sharma",
        customerPhone: "+91 98765 43210",
        deliveryAddress: "Flat 402, Sunshine Heights, BTM 2nd Stage, Bengaluru",
        restaurantID: 101,
        restaurantName: "Meghana Foods Biryani",
        restaurantAddress: "100ft Road, Koramangala 5th Block, Bengaluru",
        orderDate: new Date().toISOString(),
        totalAmount: 580,
        status: "PREPARING", // Default stage
        paymentMethod: "UPI",
        paymentStatus: "PAID",
        items: [
          { menuID: 1001, itemName: "Meghana Special Chicken Biryani", price: 320, quantity: 1, isVeg: false },
          { menuID: 1003, itemName: "Andhra Chilli Chicken", price: 240, quantity: 1, isVeg: false }
        ]
      };
    }
  },

  // 2. Render Header & Footer
  renderHeaderAndFooter() {
    const navPlaceholder = document.getElementById('navbarPlaceholder');
    if (navPlaceholder) {
      navPlaceholder.innerHTML = UIComponents.renderNavbar('tracking');
    }

    const footerPlaceholder = document.getElementById('footerPlaceholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = UIComponents.renderFooter();
    }
  },

  // 3. Render Entire Tracking View
  renderTrackingView() {
    const container = document.getElementById('trackingMainContainer');
    if (!container) return;

    const o = this.order;
    const currentStageIndex = this.statusStages.indexOf(o.status);
    const isCancelled = o.status === 'CANCELLED';

    // ETA calculation
    let etaText = "20-25 mins";
    if (o.status === "PREPARING") etaText = "15-20 mins";
    if (o.status === "OUT_FOR_DELIVERY") etaText = "8-10 mins";
    if (o.status === "DELIVERED") etaText = "Delivered 🎉";
    if (isCancelled) etaText = "Cancelled";

    container.innerHTML = `
      <!-- Hero Banner -->
      <section class="tracking-hero-card" style="${isCancelled ? 'background: linear-gradient(135deg, #D64545 0%, #A82828 100%);' : ''}">
        <div class="tracking-hero-left">
          <div class="tracking-check-icon">${isCancelled ? '✕' : (o.status === 'DELIVERED' ? '🎉' : '✓')}</div>
          <div class="tracking-hero-info">
            <h1>${isCancelled ? 'Order Cancelled' : (o.status === 'DELIVERED' ? 'Order Delivered!' : 'Order Placed Successfully!')}</h1>
            <p>
              <span class="order-id-pill">Order #${o.orderID}</span>
              • Placed at ${new Date(o.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div class="tracking-eta-box">
          <div class="eta-label">Estimated Delivery</div>
          <div class="eta-time">${etaText}</div>
        </div>
      </section>

      <!-- Main 2-Column Content -->
      <div class="tracking-layout">
        <!-- Left Column: Pipeline & Rider -->
        <div class="tracking-left-col">
          <!-- 4-Step Stepper -->
          <div class="tracking-stepper-card">
            <div class="stepper-header">
              <h3>Live Order Progress</h3>
              <span class="badge-status ${isCancelled ? 'closed' : 'open'}">
                ${isCancelled ? 'Cancelled' : o.status.replace(/_/g, ' ')}
              </span>
            </div>

            ${isCancelled ? `
              <div style="padding: 20px 0; color: var(--color-error); text-align: center;">
                <p style="font-weight: 700; font-size: 16px;">This order has been cancelled.</p>
                <p style="font-size: 13px; color: var(--color-text-muted);">Refund (if paid) will be credited to your original payment method in 24-48 hours.</p>
              </div>
            ` : `
              <div class="stepper-pipeline">
                <!-- Step 1: Order Placed -->
                <div class="stepper-step ${currentStageIndex >= 0 ? (currentStageIndex === 0 ? 'active' : 'completed') : 'pending'}">
                  <div class="step-circle-icon">${currentStageIndex > 0 ? '✓' : '📋'}</div>
                  <div class="step-details-group">
                    <h4>Order Confirmed</h4>
                    <p>Restaurant received and accepted your order</p>
                    <div class="step-timestamp">Just now</div>
                  </div>
                </div>

                <!-- Step 2: Preparing -->
                <div class="stepper-step ${currentStageIndex >= 1 ? (currentStageIndex === 1 ? 'active' : 'completed') : 'pending'}">
                  <div class="step-circle-icon">${currentStageIndex > 1 ? '✓' : '🍳'}</div>
                  <div class="step-details-group">
                    <h4>Kitchen Preparing</h4>
                    <p>Chef is cooking your dishes fresh and packing with tamper seals</p>
                    <div class="step-timestamp">${currentStageIndex >= 1 ? 'In progress' : 'Upcoming'}</div>
                  </div>
                </div>

                <!-- Step 3: Out for Delivery -->
                <div class="stepper-step ${currentStageIndex >= 2 ? (currentStageIndex === 2 ? 'active' : 'completed') : 'pending'}">
                  <div class="step-circle-icon">${currentStageIndex > 2 ? '✓' : '🛵'}</div>
                  <div class="step-details-group">
                    <h4>Out for Delivery</h4>
                    <p>Delivery partner has picked up your food and is on the way</p>
                    <div class="step-timestamp">${currentStageIndex >= 2 ? 'On the way' : 'Upcoming'}</div>
                  </div>
                </div>

                <!-- Step 4: Delivered -->
                <div class="stepper-step ${currentStageIndex >= 3 ? 'completed' : 'pending'}">
                  <div class="step-circle-icon">🏠</div>
                  <div class="step-details-group">
                    <h4>Delivered</h4>
                    <p>Food handed over to you. Bon appétit!</p>
                    <div class="step-timestamp">${currentStageIndex >= 3 ? 'Completed' : 'Upcoming'}</div>
                  </div>
                </div>
              </div>

              <!-- Interactive Simulator Bar -->
              <div class="simulation-bar">
                <p>💡 <strong>Demo Control:</strong> Test live status transitions to review the pipeline UX</p>
                <button class="btn btn-primary btn-sm" onclick="OrderTracking.advanceStatus()">
                  Next Status ⏩
                </button>
              </div>
            `}
          </div>

          <!-- Rider Card (Only if Out for Delivery or Preparing) -->
          <div class="rider-card">
            <div class="rider-info-left">
              <div class="rider-avatar">🛵</div>
              <div class="rider-details">
                <h4>Ramesh Kumar</h4>
                <p>⭐ 4.9 Rating • 2,400+ deliveries completed</p>
                <p style="font-size: 11px; color: var(--color-primary-dark); font-weight: 600;">Delivery Vehicle: Hero Electric (KA-05-EA-8821)</p>
              </div>
            </div>
            <button class="btn-call-rider" onclick="UIComponents.showToast('Connecting call to Ramesh Kumar (+91 98450 11223)...', 'normal')">
              <span>📞</span> Call Rider
            </button>
          </div>
        </div>

        <!-- Right Column: Itemized Receipt Card -->
        <aside class="tracking-receipt-card">
          <div class="receipt-title-row">
            <h3>Order Receipt</h3>
            <span class="receipt-status-badge ${o.paymentStatus === 'PAID' ? 'paid' : 'pending'}">
              ${o.paymentStatus === 'PAID' ? '● PAID' : '● CASH ON DELIVERY'}
            </span>
          </div>

          <!-- Restaurant Info -->
          <div class="receipt-resto-box">
            <h4>${o.restaurantName}</h4>
            <p>${o.restaurantAddress}</p>
          </div>

          <!-- Delivery Address -->
          <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 14px;">
            <strong>Drop Address:</strong> ${o.deliveryAddress}
          </div>

          <!-- Items Breakdown -->
          <div class="receipt-items-list">
            ${o.items.map(item => `
              <div class="receipt-item-row">
                <span>${item.itemName} × ${item.quantity}</span>
                <span style="font-weight: 600;">₹${item.price * item.quantity}</span>
              </div>
            `).join('')}
          </div>

          <!-- Total -->
          <div class="bill-row-total" style="margin-bottom: 8px;">
            <span>Grand Total</span>
            <span class="bill-total-price">₹${o.totalAmount}</span>
          </div>

          <div style="font-size: 12px; color: var(--color-text-muted); text-align: center; margin-top: 8px;">
            Paid via <strong>${o.paymentMethod}</strong>
          </div>

          <!-- Cancel Order Button (Only allowed when PENDING) -->
          ${o.status === 'PENDING' ? `
            <button class="receipt-cancel-btn" onclick="OrderTracking.cancelOrder()">
              ✕ Cancel Order
            </button>
          ` : ''}

          <a href="index.html" class="btn btn-outline w-full" style="margin-top: 12px;">
            Back to Home
          </a>
        </aside>
      </div>
    `;
  },

  // 4. Advance Status Simulation (Simulating OrderDAO.updateOrder)
  advanceStatus() {
    if (this.order.status === 'CANCELLED') return;

    const currentIndex = this.statusStages.indexOf(this.order.status);
    if (currentIndex < this.statusStages.length - 1) {
      this.order.status = this.statusStages[currentIndex + 1];
      this.saveOrderUpdate();
      this.renderTrackingView();
      UIComponents.showToast(`Order status updated to "${this.order.status.replace(/_/g, ' ')}"`, 'success');
    } else {
      this.order.status = "PENDING"; // Loop back for demo
      this.saveOrderUpdate();
      this.renderTrackingView();
      UIComponents.showToast('Reset status to "Order Placed"', 'normal');
    }
  },

  // 5. Cancel Order (Simulating OrderDAO.updateOrder with CANCELLED)
  cancelOrder() {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.order.status = 'CANCELLED';
      this.saveOrderUpdate();
      this.renderTrackingView();
      UIComponents.showToast('Order cancelled successfully', 'normal');
    }
  },

  saveOrderUpdate() {
    try {
      const ordersList = JSON.parse(localStorage.getItem('foodapp_orders') || '[]');
      const index = ordersList.findIndex(o => o.orderID === this.order.orderID);
      if (index > -1) {
        ordersList[index].status = this.order.status;
        localStorage.setItem('foodapp_orders', JSON.stringify(ordersList));
      }
      localStorage.setItem('foodapp_active_order', JSON.stringify(this.order));
    } catch (e) {
      console.error(e);
    }
  },

  attachEventListeners() {}
};

// Auto Boot
document.addEventListener('DOMContentLoaded', () => {
  OrderTracking.init();
});
