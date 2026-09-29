/**
 * FoodApp - Cart Page Logic
 * Only Vanilla JavaScript
 */

const CartPage = {
  appliedCoupon: null, // e.g. { code: 'WELCOME50', discount: 50 }
  deliveryFee: 30,
  taxAndPackaging: 25,

  init() {
    this.renderHeaderAndFooter();
    this.renderCartView();
    this.attachEventListeners();
    this.setupCartListener();
  },

  // 1. Render Header & Footer
  renderHeaderAndFooter() {
    const navPlaceholder = document.getElementById('navbarPlaceholder');
    if (navPlaceholder) {
      navPlaceholder.innerHTML = UIComponents.renderNavbar('cart');
    }

    const footerPlaceholder = document.getElementById('footerPlaceholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = UIComponents.renderFooter();
    }
  },

  // 2. Render Main Cart View
  renderCartView() {
    const mainContainer = document.getElementById('cartMainContainer');
    if (!mainContainer) return;

    const cart = CartService.getCart();

    // Check if cart is empty
    if (cart.length === 0) {
      mainContainer.innerHTML = `
        <div class="empty-cart-view">
          <div class="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>You haven't added any dishes yet. Explore our top restaurants and satisfy your cravings!</p>
          <a href="restaurants.html" class="btn btn-primary btn-lg">Explore Restaurants</a>
        </div>
      `;
      return;
    }

    const restaurant = cart[0].restaurant || { name: "Restaurant Order", address: "Selected Outlet" };
    const itemSubtotal = CartService.getCartTotal();
    
    // Free delivery on orders above ₹400
    const actualDeliveryFee = itemSubtotal >= 400 ? 0 : this.deliveryFee;
    const discountAmount = this.appliedCoupon ? this.appliedCoupon.discount : 0;
    const grandTotal = Math.max(0, itemSubtotal + actualDeliveryFee + this.taxAndPackaging - discountAmount);

    mainContainer.innerHTML = `
      <div class="cart-layout">
        <!-- Left Column: Items & Options -->
        <div class="cart-items-column">
          <!-- Restaurant Banner -->
          <div class="cart-resto-banner">
            <div class="resto-banner-left">
              <div class="resto-banner-icon">🍽️</div>
              <div class="resto-banner-info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.address}</p>
              </div>
            </div>
            <button class="btn-clear-cart" onclick="CartPage.onClearCart()">Clear Cart</button>
          </div>

          <!-- Items Card -->
          <div class="cart-items-card">
            <div class="cart-items-list">
              ${cart.map(item => `
                <div class="cart-item-row" id="cart-item-${item.menuID}">
                  <div class="item-row-left">
                    <img src="${item.image}" alt="${item.itemName}" class="item-row-image">
                    <div class="item-row-info">
                      <div class="item-row-title">
                        <div class="food-type-icon ${item.isVeg ? 'veg' : 'non-veg'}" style="width: 14px; height: 14px;">
                          <div class="food-type-dot" style="width: 6px; height: 6px;"></div>
                        </div>
                        <span>${item.itemName}</span>
                      </div>
                      <div class="item-row-unit-price">₹${item.price} each</div>
                    </div>
                  </div>

                  <div class="item-row-actions">
                    <div class="cart-stepper">
                      <button onclick="CartPage.onQuantityChange(${item.menuID}, -1)" aria-label="Decrease quantity">−</button>
                      <span>${item.quantity}</span>
                      <button onclick="CartPage.onQuantityChange(${item.menuID}, 1)" aria-label="Increase quantity">+</button>
                    </div>

                    <div class="item-row-subtotal">₹${item.price * item.quantity}</div>

                    <button class="btn-remove-item" onclick="CartPage.onRemoveItem(${item.menuID})" title="Remove item" aria-label="Remove item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Cooking & Delivery Instructions -->
          <div class="cart-card-secondary">
            <h4>
              <span>📝</span> Cooking & Delivery Notes
            </h4>
            <textarea class="cart-instructions-textarea" id="cartInstructions" placeholder="e.g. Ring the bell twice, please send extra napkins and cutlery..."></textarea>
          </div>

          <!-- Coupon Code Box -->
          <div class="cart-card-secondary">
            <h4>
              <span>🏷️</span> Apply Coupon Code
            </h4>
            
            ${this.appliedCoupon ? `
              <div class="coupon-applied-badge">
                <span>🎉 Coupon <strong>${this.appliedCoupon.code}</strong> applied! You save ₹${this.appliedCoupon.discount}</span>
                <span class="coupon-remove-link" onclick="CartPage.removeCoupon()">Remove</span>
              </div>
            ` : `
              <div class="coupon-input-wrapper">
                <input type="text" class="coupon-input" id="couponInput" placeholder="Enter coupon (e.g. WELCOME50)">
                <button class="btn btn-primary btn-sm" onclick="CartPage.applyCoupon()">Apply</button>
              </div>
            `}
          </div>
        </div>

        <!-- Right Column: Price Summary -->
        <aside class="cart-summary-card">
          <h3 class="cart-summary-title">Bill Details</h3>

          <div class="bill-rows-list">
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

            ${discountAmount > 0 ? `
              <div class="bill-row discount">
                <span>Coupon Discount (${this.appliedCoupon.code})</span>
                <span>- ₹${discountAmount}</span>
              </div>
            ` : ''}

            <div class="bill-divider"></div>

            <div class="bill-row-total">
              <span>To Pay</span>
              <span class="bill-total-price">₹${grandTotal}</span>
            </div>
          </div>

          <a href="checkout.html" class="btn btn-primary btn-checkout">
            <span>Proceed to Checkout</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>

          <div class="trust-badges-row">
            <div class="trust-badge-item">
              <span>🛡️</span>
              <span>100% Safe & Secure Online Payments</span>
            </div>
            <div class="trust-badge-item">
              <span>⚡</span>
              <span>Express contactless delivery to your door</span>
            </div>
          </div>
        </aside>
      </div>
    `;
  },

  // 3. Cart Actions
  onQuantityChange(menuID, delta) {
    CartService.updateQuantity(menuID, delta);
    this.renderCartView();
  },

  onRemoveItem(menuID) {
    CartService.updateQuantity(menuID, -999);
    this.renderCartView();
    UIComponents.showToast('Item removed from cart', 'normal');
  },

  onClearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      CartService.clearCart();
      this.appliedCoupon = null;
      this.renderCartView();
      UIComponents.showToast('Cart cleared', 'normal');
    }
  },

  // 4. Coupon Logic
  applyCoupon() {
    const input = document.getElementById('couponInput');
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
      UIComponents.showToast('Please enter a coupon code', 'error');
      return;
    }

    if (code === 'WELCOME50' || code === 'FOODAPP50') {
      this.appliedCoupon = { code: code, discount: 50 };
      this.renderCartView();
      UIComponents.showToast(`Coupon ${code} applied successfully! Saved ₹50`, 'success');
    } else {
      UIComponents.showToast('Invalid coupon code. Try WELCOME50', 'error');
    }
  },

  removeCoupon() {
    this.appliedCoupon = null;
    this.renderCartView();
    UIComponents.showToast('Coupon removed', 'normal');
  },

  // 5. Event Listeners
  attachEventListeners() {
    // Global search handler
    const globalSearch = document.getElementById('globalSearchInput');
    if (globalSearch) {
      globalSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          window.location.href = `restaurants.html?q=${encodeURIComponent(e.target.value)}`;
        }
      });
    }
  },

  // 6. Cart Listener
  setupCartListener() {
    window.addEventListener('cartUpdated', () => {
      const badge = document.getElementById('cartBadgeCount');
      if (badge) {
        badge.innerText = CartService.getItemCount();
      }
    });
  }
};

// Auto Boot
document.addEventListener('DOMContentLoaded', () => {
  CartPage.init();
});
