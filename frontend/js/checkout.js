/**
 * FoodApp - Checkout Page Logic
 * Only Vanilla JavaScript
 * Direct mapping to OrderDAO.addOrder(Orders) & UserDAO.getUser()
 */

const Checkout = {
  selectedAddressId: 1,
  selectedPaymentMethod: 'UPI', // 'UPI', 'CARD', 'COD', 'NET_BANKING'
  appliedDiscount: 50,
  deliveryFee: 30,
  taxAndPackaging: 25,

  init() {
    this.checkCartNotEmpty();
    this.renderHeaderAndFooter();
    this.renderSavedAddresses();
    this.renderOrderSummary();
    this.attachEventListeners();
  },

  // 1. Validate Cart
  checkCartNotEmpty() {
    const cart = CartService.getCart();
    if (cart.length === 0) {
      window.location.href = 'cart.html';
    }
  },

  // 2. Render Header & Footer
  renderHeaderAndFooter() {
    const navPlaceholder = document.getElementById('navbarPlaceholder');
    if (navPlaceholder) {
      navPlaceholder.innerHTML = UIComponents.renderNavbar('checkout');
    }

    const footerPlaceholder = document.getElementById('footerPlaceholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = UIComponents.renderFooter();
    }
  },

  // 3. Render Saved Delivery Addresses
  renderSavedAddresses() {
    const container = document.getElementById('savedAddressesGrid');
    if (!container) return;

    const user = MockData.currentUser;
    const addresses = user.savedAddresses || [
      { id: 1, type: "Home", text: user.address },
      { id: 2, type: "Work", text: "Tech Park, 5th Floor, Electronic City, Bengaluru" }
    ];

    container.innerHTML = addresses.map(addr => `
      <div class="address-select-card ${addr.id === this.selectedAddressId ? 'selected' : ''}" onclick="Checkout.selectAddress(${addr.id})">
        <div class="address-type-tag">
          <span>${addr.type === 'Home' ? '🏠' : '🏢'}</span>
          <span>${addr.type}</span>
        </div>
        <p class="address-text">${addr.text}</p>
        <div class="address-check-icon">✓</div>
      </div>
    `).join('');
  },

  selectAddress(id) {
    this.selectedAddressId = id;
    this.renderSavedAddresses();
    UIComponents.showToast('Delivery address selected', 'normal');
  },

  // 4. Select Payment Method
  selectPaymentMethod(method, cardElement) {
    this.selectedPaymentMethod = method;
    document.querySelectorAll('.payment-method-card').forEach(el => el.classList.remove('selected'));
    if (cardElement) cardElement.classList.add('selected');
  },

  // 5. Render Right Column Order Summary
  renderOrderSummary() {
    const cart = CartService.getCart();
    if (cart.length === 0) return;

    const restaurant = cart[0].restaurant || { name: "Restaurant Order", address: "Selected Outlet" };
    const itemSubtotal = CartService.getCartTotal();
    const actualDeliveryFee = itemSubtotal >= 400 ? 0 : this.deliveryFee;
    const grandTotal = Math.max(0, itemSubtotal + actualDeliveryFee + this.taxAndPackaging - this.appliedDiscount);

    // Restaurant Mini Header
    const restoMini = document.getElementById('checkoutRestoMini');
    if (restoMini) {
      restoMini.innerHTML = `
        <div class="mini-resto-icon">🍽️</div>
        <div class="mini-resto-info">
          <h4>${restaurant.name}</h4>
          <p>${restaurant.address}</p>
        </div>
      `;
    }

    // Mini Items List
    const itemsMini = document.getElementById('checkoutMiniItemsList');
    if (itemsMini) {
      itemsMini.innerHTML = cart.map(item => `
        <div class="checkout-mini-row">
          <span>${item.itemName} × ${item.quantity}</span>
          <span style="font-weight: 600; color: var(--color-text-primary);">₹${item.price * item.quantity}</span>
        </div>
      `).join('');
    }

    // Bill Details
    const billContainer = document.getElementById('checkoutBillDetails');
    if (billContainer) {
      billContainer.innerHTML = `
        <div class="bill-row">
          <span>Item Total</span>
          <span>₹${itemSubtotal}</span>
        </div>
        <div class="bill-row">
          <span>Delivery Fee</span>
          <span>${actualDeliveryFee === 0 ? '<span style="color: var(--color-success); font-weight: 700;">FREE</span>' : '₹' + actualDeliveryFee}</span>
        </div>
        <div class="bill-row">
          <span>Taxes & Restaurant Packaging</span>
          <span>₹${this.taxAndPackaging}</span>
        </div>
        <div class="bill-row discount">
          <span>Coupon Discount (WELCOME50)</span>
          <span>- ₹${this.appliedDiscount}</span>
        </div>
        <div class="bill-divider"></div>
        <div class="bill-row-total">
          <span>Total Payable</span>
          <span class="bill-total-price">₹${grandTotal}</span>
        </div>
      `;
    }
  },

  // 6. Handle Place Order
  placeOrder() {
    const cart = CartService.getCart();
    if (cart.length === 0) {
      UIComponents.showToast('Your cart is empty', 'error');
      return;
    }

    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `<span>⏳ Placing your order...</span>`;
    }

    const user = MockData.currentUser;
    const restaurant = cart[0].restaurant;
    const itemSubtotal = CartService.getCartTotal();
    const actualDeliveryFee = itemSubtotal >= 400 ? 0 : this.deliveryFee;
    const grandTotal = Math.max(0, itemSubtotal + actualDeliveryFee + this.taxAndPackaging - this.appliedDiscount);
    
    // Generate new Order entity (matching Orders.java)
    const newOrderId = Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      orderID: newOrderId,
      userID: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      deliveryAddress: user.address,
      restaurantID: cart[0].restaurantID,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      orderDate: new Date().toISOString(),
      totalAmount: grandTotal,
      status: "PENDING", // PENDING -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED
      paymentMethod: this.selectedPaymentMethod,
      paymentStatus: this.selectedPaymentMethod === 'COD' ? "PENDING" : "PAID",
      items: cart.map(item => ({
        menuID: item.menuID,
        itemName: item.itemName,
        price: item.price,
        quantity: item.quantity,
        isVeg: item.isVeg,
        itemTotal: item.price * item.quantity
      }))
    };

    // Save order in localStorage
    try {
      const existingOrders = JSON.parse(localStorage.getItem('foodapp_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('foodapp_orders', JSON.stringify(existingOrders));
      localStorage.setItem('foodapp_active_order', JSON.stringify(newOrder));
    } catch (e) {
      console.error(e);
    }

    // Simulate backend JDBC insert into `orders` and `order_items`
    setTimeout(() => {
      CartService.clearCart();
      UIComponents.showToast(`Order #${newOrderId} placed successfully! 🎉`, 'success');

      setTimeout(() => {
        window.location.href = `order-tracking.html?orderId=${newOrderId}`;
      }, 1000);
    }, 1200);
  },

  // 7. Add New Address Prompt
  promptNewAddress() {
    const newAddr = prompt("Enter your new delivery address:");
    if (newAddr && newAddr.trim().length > 5) {
      MockData.currentUser.savedAddresses.push({
        id: Date.now(),
        type: "Other",
        text: newAddr.trim()
      });
      this.renderSavedAddresses();
      UIComponents.showToast("New address added successfully!", "success");
    }
  },

  attachEventListeners() {}
};

// Auto Boot
document.addEventListener('DOMContentLoaded', () => {
  Checkout.init();
});
