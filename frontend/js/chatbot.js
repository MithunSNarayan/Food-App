/**
 * FoodApp - FoodieBot AI & ChartBot Assistant
 * Advanced Conversational AI, Smart Food Concierge, 1-Click Ordering & Visual Food Charts
 * Pure Vanilla JavaScript
 */

const FoodieBot = {
  isOpen: false,
  isMuted: false,
  messages: [],
  hasUnread: true,
  audioCtx: null,

  // 1. Initialize Bot
  init() {
    if (document.getElementById('foodiebotContainer')) return;
    this.injectMarkup();
    this.loadHistory();
    this.attachEvents();
  },

  // 2. Inject HTML Markup
  injectMarkup() {
    const container = document.createElement('div');
    container.id = 'foodiebotContainer';
    container.innerHTML = `
      <!-- Floating Launcher -->
      <div class="foodiebot-launcher" id="foodiebotLauncher">
        <div class="foodiebot-tooltip" id="foodiebotTooltip" onclick="FoodieBot.open()">
          <span>Craving something? Ask AI 🍕</span>
          <span class="tooltip-close" onclick="event.stopPropagation(); FoodieBot.dismissTooltip()">✕</span>
        </div>

        <div class="foodiebot-btn-wrap">
          <div class="foodiebot-pulse"></div>
          <button class="foodiebot-btn" id="foodiebotToggleBtn" onclick="FoodieBot.toggle()" aria-label="Open FoodieBot AI Assistant">
            <div class="foodiebot-btn-icon" id="foodiebotIcon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                <rect x="3" y="8" width="18" height="12" rx="4"></rect>
                <line x1="9" y1="13" x2="9.01" y2="13" stroke-width="3"></line>
                <line x1="15" y1="13" x2="15.01" y2="13" stroke-width="3"></line>
                <path d="M8 17s1.5 1.5 4 1.5 4-1.5 4-1.5"></path>
              </svg>
            </div>
            <span class="foodiebot-badge" id="foodiebotBadge">1</span>
          </button>
        </div>
      </div>

      <!-- Chatbot Main Window -->
      <div class="foodiebot-window" id="foodiebotWindow" role="dialog" aria-modal="true" aria-label="FoodieBot AI Assistant">
        <!-- Header -->
        <div class="foodiebot-header">
          <div class="foodiebot-header-info">
            <div class="foodiebot-avatar-wrap">
              🤖
              <span class="foodiebot-status-dot"></span>
            </div>
            <div class="foodiebot-titles">
              <h4>FoodieBot <span class="foodiebot-badge-ai">AI PRO</span></h4>
              <p>Your Smart Food & Order Assistant</p>
            </div>
          </div>

          <div class="foodiebot-header-actions">
            <button class="foodiebot-action-btn" id="foodiebotSoundBtn" onclick="FoodieBot.toggleSound()" title="Toggle Sound">
              🔊
            </button>
            <button class="foodiebot-action-btn" onclick="FoodieBot.clearHistory()" title="Clear Conversation">
              🗑️
            </button>
            <button class="foodiebot-action-btn" onclick="FoodieBot.close()" title="Close">
              ✕
            </button>
          </div>
        </div>

        <!-- Chat Body -->
        <div class="foodiebot-body" id="foodiebotMessages"></div>

        <!-- Quick Suggestion Chips -->
        <div class="foodiebot-quick-chips-wrap" id="foodiebotChips">
          <button class="foodiebot-chip" onclick="FoodieBot.sendPreset('Recommend best Biryani')">🍚 Best Biryani</button>
          <button class="foodiebot-chip" onclick="FoodieBot.sendPreset('Show healthy and veg options')">🥗 Healthy & Veg</button>
          <button class="foodiebot-chip" onclick="FoodieBot.sendPreset('Fast delivery under 25 mins')">⚡ Fast Delivery</button>
          <button class="foodiebot-chip" onclick="FoodieBot.sendPreset('Show active coupons and discounts')">🏷️ Promo Codes</button>
          <button class="foodiebot-chip" onclick="FoodieBot.sendPreset('Where is my order?')">📦 Track Order</button>
          <button class="foodiebot-chip" onclick="FoodieBot.sendPreset('Show food trends & calories chart')">📊 Nutrition & Trends</button>
          <button class="foodiebot-chip" onclick="FoodieBot.sendPreset('What is in my cart?')">🛒 My Cart</button>
        </div>

        <!-- Footer Input -->
        <div class="foodiebot-footer">
          <form class="foodiebot-input-form" onsubmit="FoodieBot.handleSubmit(event)">
            <input type="text" class="foodiebot-input" id="foodiebotInput" placeholder="Ask for food, order status, coupons, or charts..." autocomplete="off">
            <button type="submit" class="foodiebot-send-btn" aria-label="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  },

  // 3. Load or initialize history
  loadHistory() {
    const saved = sessionStorage.getItem('foodapp_chat_history');
    if (saved) {
      try {
        this.messages = JSON.parse(saved);
      } catch {
        this.messages = [];
      }
    }

    if (this.messages.length === 0) {
      const user = (typeof MockData !== 'undefined' && MockData.currentUser) ? MockData.currentUser.name.split(' ')[0] : 'there';
      this.messages.push({
        id: 'msg_' + Date.now(),
        sender: 'bot',
        text: `👋 Hey **${user}**! I'm **FoodieBot AI**, your personal food & ordering assistant.<br/><br/>I can help you find mouth-watering dishes, 1-click add meals to your cart, check order tracking, apply coupons, and visualize calorie & food trend charts! What are you craving today?`,
        cards: [],
        timestamp: this.formatTime()
      });
    }

    this.renderMessages();
  },

  // 4. Attach Events
  attachEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  },

  // 5. Toggle Bot Window
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  open() {
    this.isOpen = true;
    const win = document.getElementById('foodiebotWindow');
    const btn = document.getElementById('foodiebotToggleBtn');
    const badge = document.getElementById('foodiebotBadge');
    const tooltip = document.getElementById('foodiebotTooltip');

    if (win) win.classList.add('active');
    if (btn) btn.classList.add('open');
    if (badge) badge.style.display = 'none';
    if (tooltip) tooltip.style.display = 'none';

    this.hasUnread = false;
    this.scrollToBottom();

    setTimeout(() => {
      const input = document.getElementById('foodiebotInput');
      if (input) input.focus();
    }, 150);
  },

  close() {
    this.isOpen = false;
    const win = document.getElementById('foodiebotWindow');
    const btn = document.getElementById('foodiebotToggleBtn');
    if (win) win.classList.remove('active');
    if (btn) btn.classList.remove('open');
  },

  dismissTooltip() {
    const tooltip = document.getElementById('foodiebotTooltip');
    if (tooltip) tooltip.style.display = 'none';
  },

  toggleSound() {
    this.isMuted = !this.isMuted;
    const btn = document.getElementById('foodiebotSoundBtn');
    if (btn) btn.textContent = this.isMuted ? '🔇' : '🔊';
    if (typeof UIComponents !== 'undefined') {
      UIComponents.showToast(this.isMuted ? 'Sound muted' : 'Sound enabled');
    }
  },

  clearHistory() {
    sessionStorage.removeItem('foodapp_chat_history');
    this.messages = [];
    this.loadHistory();
    if (typeof UIComponents !== 'undefined') {
      UIComponents.showToast('Conversation cleared');
    }
  },

  // 6. Audio Synthesizer (Zero asset dependency)
  playChime() {
    if (this.isMuted) return;
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12); // D6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch {
      // Audio context might be restricted before interaction
    }
  },

  // 7. Handle Form Submission
  handleSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('foodiebotInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.sendUserMessage(text);
  },

  sendPreset(text) {
    this.open();
    this.sendUserMessage(text);
  },

  sendUserMessage(text) {
    this.messages.push({
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: this.escapeHtml(text),
      timestamp: this.formatTime()
    });

    this.renderMessages();
    this.showTypingIndicator();

    // Natural bot response delay
    setTimeout(() => {
      this.hideTypingIndicator();
      const botReply = this.processAIResponse(text);
      this.messages.push({
        id: 'msg_' + Date.now(),
        sender: 'bot',
        text: botReply.text,
        cards: botReply.cards || [],
        timestamp: this.formatTime()
      });

      this.renderMessages();
      this.playChime();
      this.saveHistory();
    }, 450 + Math.random() * 300);
  },

  // 8. AI Intent NLP Engine & Generator
  processAIResponse(rawQuery) {
    const q = rawQuery.toLowerCase().trim();

    // 1. GREETINGS & INTRO
    if (q.match(/\b(hi|hello|hey|hola|namaste|morning|evening|who are you|help|sup)\b/)) {
      return {
        text: `Hello! 😊 I'm your AI culinary assistant. How can I assist your appetite today? You can ask for recommendations like **"Best Biryani"**, **"Healthy salads"**, **"Under ₹300"**, check **"Promo codes"**, or view **"Food trends chart"**!`,
        cards: []
      };
    }

    // 2. FOOD TRENDS & NUTRITION CHARTS (CHARTBOT)
    if (q.includes('chart') || q.includes('trend') || q.includes('calorie') || q.includes('nutrition') || q.includes('macro') || q.includes('analytics') || q.includes('stats')) {
      return {
        text: `📊 Here is today's **Food Trends & Nutritional Intelligence Breakdown** for Bengaluru foodies:`,
        cards: [
          { type: 'trend_chart' },
          { type: 'macro_chart' }
        ]
      };
    }

    // 3. ORDER TRACKING & RECENT ORDERS
    if (q.includes('track') || q.includes('order') || q.includes('where is') || q.includes('status') || q.includes('delivery status')) {
      let orders = [];
      try {
        orders = JSON.parse(localStorage.getItem('foodapp_orders') || '[]');
      } catch {}

      if (orders.length > 0) {
        const latest = orders[0];
        return {
          text: `📦 Found your most recent order **#${latest.orderID}** from **${latest.restaurantName}**!`,
          cards: [{ type: 'order_status', order: latest }]
        };
      } else {
        return {
          text: `📦 You don't have any live active orders right now. Looking to order something delicious? Check out our top-rated restaurants below!`,
          cards: this.getFeaturedRestaurantCards().slice(0, 2)
        };
      }
    }

    // 4. COUPONS & DISCOUNTS
    if (q.includes('coupon') || q.includes('discount') || q.includes('offer') || q.includes('code') || q.includes('promo') || q.includes('deal')) {
      return {
        text: `🎉 Here are the top active discount coupons you can apply at checkout right now:`,
        cards: [
          { type: 'coupon', code: 'WELCOME50', desc: '50% OFF up to ₹100 on your first 3 orders!' },
          { type: 'coupon', code: 'BINGE100', desc: 'Flat ₹100 OFF on orders above ₹499' },
          { type: 'coupon', code: 'FREEDEL', desc: 'Zero Delivery Fee on orders above ₹199' }
        ]
      };
    }

    // 5. CART INQUIRIES
    if (q.includes('cart') || q.includes('basket') || q.includes('checkout') || q.includes('total bill') || q.includes('my items')) {
      if (typeof CartService !== 'undefined') {
        const cart = CartService.getCart();
        if (cart.length === 0) {
          return {
            text: `🛒 Your cart is currently empty! Would you like me to recommend some top chef specials?`,
            cards: this.getDishCards('recommended').slice(0, 2)
          };
        } else {
          const total = CartService.getCartTotal();
          const itemsList = cart.map(i => `• **${i.itemName}** × ${i.quantity} (₹${i.price * i.quantity})`).join('<br/>');
          return {
            text: `🛒 **Your Cart Summary (${CartService.getItemCount()} items):**<br/><br/>${itemsList}<br/><br/>💰 **Subtotal:** ₹${total}<br/><a href="cart.html" class="foodiebot-order-track-btn" style="margin-top: 10px;">Proceed to Cart / Checkout 💳</a>`,
            cards: []
          };
        }
      }
    }

    // 6. SPECIFIC CUISINE & DISH SEARCHES
    // Biryani
    if (q.includes('biryani') || q.includes('rice') || q.includes('pulao')) {
      const dishes = this.getDishCards('biryani');
      return {
        text: `🍚 Here are the most authentic, top-rated Biryanis freshly prepared near you:`,
        cards: dishes
      };
    }

    // Pizza
    if (q.includes('pizza') || q.includes('italian') || q.includes('pasta') || q.includes('cheese')) {
      const dishes = this.getDishCards('pizza');
      return {
        text: `🍕 Craving cheesy goodness? Check out these handcrafted artisan pizzas:`,
        cards: dishes
      };
    }

    // Burgers / Fast food
    if (q.includes('burger') || q.includes('fries') || q.includes('sandwich') || q.includes('continental')) {
      const dishes = this.getDishCards('burger');
      return {
        text: `🍔 Here are gourmet burgers loaded with premium patties and crispy sides:`,
        cards: dishes
      };
    }

    // Chinese / Asian
    if (q.includes('chinese') || q.includes('noodle') || q.includes('dim sum') || q.includes('asian') || q.includes('momos') || q.includes('fried rice')) {
      const dishes = this.getDishCards('chinese');
      return {
        text: `🍜 Wok-tossed hot Asian delicacies ready for express delivery:`,
        cards: dishes
      };
    }

    // Desserts & Sweets & Ice cream
    if (q.includes('dessert') || q.includes('ice cream') || q.includes('cake') || q.includes('sweet') || q.includes('gulab jamun') || q.includes('gelato')) {
      const dishes = this.getDishCards('dessert');
      return {
        text: `🍰 Sweet tooth alert! Here are luscious desserts to brighten your day:`,
        cards: dishes
      };
    }

    // Healthy & Veg Options
    if (q.includes('veg') || q.includes('healthy') || q.includes('salad') || q.includes('diet') || q.includes('protein') || q.includes('paneer') || q.includes('thali')) {
      const dishes = this.getDishCards('veg');
      return {
        text: `🥗 Here are wholesome, 100% Pure Veg and nutritious meals made with fresh ingredients:`,
        cards: dishes
      };
    }

    // Fast Delivery (Under 25 mins)
    if (q.includes('fast') || q.includes('quick') || q.includes('speed') || q.includes('urgent') || q.includes('20 min') || q.includes('25 min')) {
      const restos = this.getFeaturedRestaurantCards().filter(r => r.deliveryTime <= 25);
      return {
        text: `⚡ Hungry right now? These top restaurants deliver in **under 25 minutes**:`,
        cards: restos
      };
    }

    // Budget / Under ₹300
    if (q.includes('under 300') || q.includes('under 200') || q.includes('cheap') || q.includes('budget') || q.includes('affordable') || q.includes('pocket friendly')) {
      const dishes = this.getDishCards('budget');
      return {
        text: `💰 Delicious meals that go easy on your wallet (All under ₹300):`,
        cards: dishes
      };
    }

    // Customer Care & Support
    if (q.includes('refund') || q.includes('cancel') || q.includes('support') || q.includes('rider') || q.includes('call') || q.includes('complaint')) {
      return {
        text: `🛡️ **FoodApp Customer Care & Guarantees:**<br/><br/>• **Instant Refunds:** Reversals for cancelled orders processed within 2-4 hours.<br/>• **Hygiene Seal:** 100% tamper-proof packaging guarantee.<br/>• **Support Desk:** Available 24/7 at support@foodapp.com or call +91 80 4000 5000.<br/><br/>Need anything else? I'm right here!`,
        cards: []
      };
    }

    // General Food / Top recommendations
    const generalDishes = this.getDishCards('recommended');
    return {
      text: `🍽️ I found some wonderful chef recommendations that foodies are loving right now:`,
      cards: generalDishes.slice(0, 3)
    };
  },

  // Helper: Get Dish cards from MockData
  getDishCards(filterType) {
    if (typeof MockData === 'undefined' || !MockData.menus) return [];

    let list = [...MockData.menus];

    if (filterType === 'biryani') {
      list = list.filter(m => m.itemName.toLowerCase().includes('biryani') || m.category.includes('Biryani'));
    } else if (filterType === 'pizza') {
      list = list.filter(m => m.itemName.toLowerCase().includes('pizza') || m.category.includes('Pizza') || m.itemName.toLowerCase().includes('garlic'));
    } else if (filterType === 'burger') {
      list = list.filter(m => m.itemName.toLowerCase().includes('burger') || m.category.includes('Burgers'));
    } else if (filterType === 'chinese') {
      list = list.filter(m => m.restaurantID === 104 || m.category.includes('Main Course') || m.itemName.toLowerCase().includes('chicken'));
    } else if (filterType === 'dessert') {
      list = list.filter(m => m.isVeg && (m.itemName.toLowerCase().includes('gelato') || m.itemName.toLowerCase().includes('jamun') || m.category.includes('Dessert')));
    } else if (filterType === 'veg') {
      list = list.filter(m => m.isVeg);
    } else if (filterType === 'budget') {
      list = list.filter(m => m.price <= 300);
    } else {
      list = list.filter(m => m.isRecommended);
    }

    return list.slice(0, 3).map(m => {
      const resto = (MockData.restaurants || []).find(r => r.restaurantID === m.restaurantID) || { name: 'Top Restaurant' };
      return {
        type: 'dish',
        menuID: m.menuID,
        restaurantID: m.restaurantID,
        restaurantName: resto.name,
        itemName: m.itemName,
        price: m.price,
        isVeg: m.isVeg,
        image: m.image
      };
    });
  },

  // Helper: Get Restaurant cards
  getFeaturedRestaurantCards() {
    if (typeof MockData === 'undefined' || !MockData.restaurants) return [];
    return MockData.restaurants.slice(0, 3).map(r => ({
      type: 'restaurant',
      restaurantID: r.restaurantID,
      name: r.name,
      cuisineType: r.cuisineType,
      rating: r.rating,
      deliveryTime: r.deliveryTime,
      image: r.image
    }));
  },

  // 9. Render Messages into DOM
  renderMessages() {
    const container = document.getElementById('foodiebotMessages');
    if (!container) return;

    container.innerHTML = this.messages.map(m => {
      const isBot = m.sender === 'bot';
      const cardsHtml = (m.cards && m.cards.length > 0) ? this.renderCards(m.cards) : '';

      return `
        <div class="foodiebot-msg-row ${isBot ? 'bot' : 'user'}">
          <div class="foodiebot-msg-avatar">
            ${isBot ? '🤖' : '👤'}
          </div>
          <div class="foodiebot-msg-content">
            <div class="foodiebot-msg-bubble">
              ${m.text}
              ${cardsHtml}
            </div>
            <div class="foodiebot-msg-time">${m.timestamp}</div>
          </div>
        </div>
      `;
    }).join('');

    this.scrollToBottom();
  },

  // 10. Render Rich Cards
  renderCards(cards) {
    return cards.map(c => {
      if (c.type === 'dish') {
        return `
          <div class="foodiebot-dish-card">
            <img src="${c.image}" alt="${c.itemName}" class="foodiebot-dish-img" loading="lazy">
            <div class="foodiebot-dish-info">
              <div>
                <div class="foodiebot-dish-header">
                  <h5 class="foodiebot-dish-title">${c.itemName}</h5>
                  <span class="foodiebot-veg-badge">${c.isVeg ? '🟢' : '🔴'}</span>
                </div>
                <p class="foodiebot-dish-resto">${c.restaurantName}</p>
              </div>
              <div class="foodiebot-dish-bottom">
                <span class="foodiebot-dish-price">₹${c.price}</span>
                <button class="foodiebot-add-cart-btn" onclick="FoodieBot.addToCart(${c.menuID}, ${c.restaurantID}, this)">
                  ➕ Add to Cart
                </button>
              </div>
            </div>
          </div>
        `;
      }

      if (c.type === 'restaurant') {
        return `
          <div class="foodiebot-resto-card" onclick="window.location.href='restaurant.html?id=${c.restaurantID}'">
            <img src="${c.image}" alt="${c.name}" class="foodiebot-resto-img" loading="lazy">
            <div class="foodiebot-resto-body">
              <h5 class="foodiebot-resto-title">${c.name}</h5>
              <div class="foodiebot-resto-meta">
                <span class="foodiebot-resto-rating">⭐ ${c.rating}</span>
                <span>•</span>
                <span>⚡ ${c.deliveryTime} mins</span>
              </div>
            </div>
          </div>
        `;
      }

      if (c.type === 'order_status') {
        const o = c.order;
        const isDelivered = o.status === 'DELIVERED';
        const progressPct = isDelivered ? 100 : 65;
        return `
          <div class="foodiebot-order-card">
            <div class="foodiebot-order-header">
              <span class="foodiebot-order-id">Order #${o.orderID}</span>
              <span class="foodiebot-order-status-badge ${isDelivered ? 'delivered' : ''}">${o.status}</span>
            </div>
            <div style="font-size: 12px; color: #444; margin-bottom: 4px;">
              <strong>${o.restaurantName}</strong> • ₹${o.totalAmount}
            </div>
            <div class="foodiebot-order-progress-bar">
              <div class="foodiebot-order-progress-fill" style="width: ${progressPct}%;"></div>
            </div>
            <a href="order-tracking.html?orderId=${o.orderID}" class="foodiebot-order-track-btn">
              📍 Open Live Map Tracker
            </a>
          </div>
        `;
      }

      if (c.type === 'coupon') {
        return `
          <div class="foodiebot-coupon-card">
            <div class="foodiebot-coupon-info">
              <span class="foodiebot-coupon-code">${c.code}</span>
              <span class="foodiebot-coupon-desc">${c.desc}</span>
            </div>
            <button class="foodiebot-coupon-copy-btn" onclick="FoodieBot.copyCoupon('${c.code}', this)">
              Copy
            </button>
          </div>
        `;
      }

      if (c.type === 'trend_chart') {
        return `
          <div class="foodiebot-chart-card">
            <div class="foodiebot-chart-title">
              <span>🔥 Top Ordered Cuisines This Week</span>
              <span style="font-size: 10px; color: #888;">Live Data</span>
            </div>
            <div class="foodiebot-chart-bars">
              <div class="foodiebot-bar-row">
                <div class="foodiebot-bar-labels">
                  <span>🍚 Hyderabadi Biryani</span>
                  <span>38%</span>
                </div>
                <div class="foodiebot-bar-track">
                  <div class="foodiebot-bar-fill" style="width: 38%; background: #FF6B35;"></div>
                </div>
              </div>
              <div class="foodiebot-bar-row">
                <div class="foodiebot-bar-labels">
                  <span>🍕 Gourmet Pizza</span>
                  <span>24%</span>
                </div>
                <div class="foodiebot-bar-track">
                  <div class="foodiebot-bar-fill" style="width: 24%; background: #E85A2A;"></div>
                </div>
              </div>
              <div class="foodiebot-bar-row">
                <div class="foodiebot-bar-labels">
                  <span>🍔 Juicy Burgers</span>
                  <span>18%</span>
                </div>
                <div class="foodiebot-bar-track">
                  <div class="foodiebot-bar-fill" style="width: 18%; background: #F59E0B;"></div>
                </div>
              </div>
              <div class="foodiebot-bar-row">
                <div class="foodiebot-bar-labels">
                  <span>🥘 South Indian & Thalis</span>
                  <span>12%</span>
                </div>
                <div class="foodiebot-bar-track">
                  <div class="foodiebot-bar-fill" style="width: 12%; background: #10B981;"></div>
                </div>
              </div>
              <div class="foodiebot-bar-row">
                <div class="foodiebot-bar-labels">
                  <span>🍰 Gelato & Desserts</span>
                  <span>8%</span>
                </div>
                <div class="foodiebot-bar-track">
                  <div class="foodiebot-bar-fill" style="width: 8%; background: #8B5CF6;"></div>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      if (c.type === 'macro_chart') {
        return `
          <div class="foodiebot-chart-card">
            <div class="foodiebot-chart-title">
              <span>🥗 Average Nutritional Macros (Per Meal)</span>
            </div>
            <div class="foodiebot-macro-grid">
              <div class="foodiebot-macro-item">
                <div class="foodiebot-macro-val">540</div>
                <div class="foodiebot-macro-label">Avg Kcal 🔥</div>
              </div>
              <div class="foodiebot-macro-item">
                <div class="foodiebot-macro-val" style="color: #10B981;">28g</div>
                <div class="foodiebot-macro-label">Protein 🥩</div>
              </div>
              <div class="foodiebot-macro-item">
                <div class="foodiebot-macro-val" style="color: #3B82F6;">55g</div>
                <div class="foodiebot-macro-label">Carbs 🌾</div>
              </div>
            </div>
          </div>
        `;
      }

      return '';
    }).join('');
  },

  // 11. Add dish to cart directly from chat
  addToCart(menuID, restaurantID, btn) {
    if (typeof MockData === 'undefined' || typeof CartService === 'undefined') return;

    const menuItem = MockData.menus.find(m => m.menuID === menuID);
    const restaurant = MockData.restaurants.find(r => r.restaurantID === restaurantID);

    if (!menuItem || !restaurant) return;

    const success = CartService.addItem(menuItem, restaurant);
    if (success) {
      if (btn) {
        btn.classList.add('added');
        btn.innerHTML = '✓ Added!';
        setTimeout(() => {
          btn.classList.remove('added');
          btn.innerHTML = '➕ Add to Cart';
        }, 2500);
      }

      // Update cart count badge in navbar if present
      const badge = document.getElementById('cartBadgeCount');
      if (badge) badge.textContent = CartService.getItemCount();

      if (typeof UIComponents !== 'undefined') {
        UIComponents.showToast(`Added "${menuItem.itemName}" to your cart! 🛒`, 'success');
      }
    }
  },

  // 12. Copy Coupon Code
  copyCoupon(code, btn) {
    navigator.clipboard.writeText(code).then(() => {
      if (btn) {
        const oldText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = oldText; }, 2000);
      }
      if (typeof UIComponents !== 'undefined') {
        UIComponents.showToast(`Coupon code ${code} copied to clipboard!`, 'success');
      }
    }).catch(() => {
      if (typeof UIComponents !== 'undefined') {
        UIComponents.showToast(`Coupon code: ${code}`);
      }
    });
  },

  // 13. Typing Indicator
  showTypingIndicator() {
    const container = document.getElementById('foodiebotMessages');
    if (!container) return;
    const typing = document.createElement('div');
    typing.id = 'foodiebotTyping';
    typing.className = 'foodiebot-msg-row bot';
    typing.innerHTML = `
      <div class="foodiebot-msg-avatar">🤖</div>
      <div class="foodiebot-typing-indicator">
        <div class="foodiebot-typing-dot"></div>
        <div class="foodiebot-typing-dot"></div>
        <div class="foodiebot-typing-dot"></div>
      </div>
    `;
    container.appendChild(typing);
    this.scrollToBottom();
  },

  hideTypingIndicator() {
    const typing = document.getElementById('foodiebotTyping');
    if (typing) typing.remove();
  },

  // 14. Utilities
  scrollToBottom() {
    setTimeout(() => {
      const container = document.getElementById('foodiebotMessages');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  },

  formatTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  saveHistory() {
    try {
      sessionStorage.setItem('foodapp_chat_history', JSON.stringify(this.messages));
    } catch {}
  }
};

// Self-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => FoodieBot.init());
} else {
  FoodieBot.init();
}

// Global expose
window.FoodieBot = FoodieBot;
