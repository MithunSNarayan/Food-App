/**
 * FoodApp - Mock Data & Service Layer
 * Directly matches MySQL Database Schema and Java DAO Models:
 * - User (user)
 * - Restaurant (restaurant)
 * - Menu (menu)
 * - Orders (orders)
 */

const MockData = {
  // Current logged in user (Matches User.java)
  currentUser: {
    id: 1,
    name: "Mithun",
    email: "mithun@foodapp.com",
    password: "Classy@0539",
    phone: "+91 98765 43210",
    role: "CUSTOMER", // "ADMIN" or "CUSTOMER"
    address: "BTM Layout 2nd Stage, Bengaluru, Karnataka 560076",
    savedAddresses: [
      { id: 1, type: "Home", text: "Flat 402, Sunshine Heights, BTM 2nd Stage, Bengaluru" },
      { id: 2, type: "Work", text: "Tech Park, 5th Floor, Tower B, Electronic City, Bengaluru" }
    ]
  },

  // Cuisine Categories
  categories: [
    {
      id: "all",
      name: "All Food",
      icon: "🍽️",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "biryani",
      name: "Biryani",
      icon: "🍚",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "pizza",
      name: "Pizza",
      icon: "🍕",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "burgers",
      name: "Burgers",
      icon: "🍔",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "south-indian",
      name: "South Indian",
      icon: "🥘",
      image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "chinese",
      name: "Chinese",
      icon: "🍜",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "desserts",
      name: "Desserts",
      icon: "🍰",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "healthy",
      name: "Salads & Bowls",
      icon: "🥗",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80"
    }
  ],

  // Restaurants (Matches Restaurant.java & RestaurantDAO.java)
  restaurants: [
    {
      restaurantID: 101,
      name: "Meghana Foods Biryani",
      cuisineType: "Biryani, Andhra, South Indian",
      deliveryTime: 25,
      address: "100ft Road, Koramangala 5th Block, Bengaluru",
      adminUserID: 1,
      rating: 4.6,
      isActive: 1,
      priceForTwo: "₹450 for two",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
      offer: "50% OFF UPTO ₹100",
      isPopular: true,
      isFastDelivery: true
    },
    {
      restaurantID: 102,
      name: "Truffles Gourmet Burgers",
      cuisineType: "Burgers, American, Continental",
      deliveryTime: 20,
      address: "St. Marks Road, Central Bengaluru",
      adminUserID: 1,
      rating: 4.8,
      isActive: 1,
      priceForTwo: "₹350 for two",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
      offer: "FREE DELIVERY",
      isPopular: true,
      isFastDelivery: true
    },
    {
      restaurantID: 103,
      name: "La Pino'z Artisan Pizza",
      cuisineType: "Pizza, Italian, Fast Food",
      deliveryTime: 30,
      address: "Indiranagar 12th Main, Bengaluru",
      adminUserID: 1,
      rating: 4.4,
      isActive: 1,
      priceForTwo: "₹400 for two",
      image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
      offer: "BUY 1 GET 1 FREE",
      isPopular: true,
      isFastDelivery: false
    },
    {
      restaurantID: 104,
      name: "Beijing Bites Express",
      cuisineType: "Chinese, Asian, Dim Sum",
      deliveryTime: 22,
      address: "BTM 2nd Stage, Ring Road, Bengaluru",
      adminUserID: 1,
      rating: 4.3,
      isActive: 1,
      priceForTwo: "₹300 for two",
      image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80",
      offer: "20% OFF ABOVE ₹299",
      isPopular: false,
      isFastDelivery: true
    },
    {
      restaurantID: 105,
      name: "Nagarjuna Royal Meals",
      cuisineType: "Andhra, North Indian, Thali",
      deliveryTime: 35,
      address: "Residency Road, Bengaluru",
      adminUserID: 1,
      rating: 4.7,
      isActive: 1,
      priceForTwo: "₹550 for two",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
      offer: "SPECIAL THALI DEAL",
      isPopular: true,
      isFastDelivery: false
    },
    {
      restaurantID: 106,
      name: "Milano Ice Cream & Bakes",
      cuisineType: "Desserts, Gelato, Bakery",
      deliveryTime: 18,
      address: "HSR Layout Sector 4, Bengaluru",
      adminUserID: 1,
      rating: 4.9,
      isActive: 1,
      priceForTwo: "₹250 for two",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
      offer: "FLAT ₹50 OFF",
      isPopular: true,
      isFastDelivery: true
    }
  ],
  // Menu Items (Matches Menu.java & MenuDAO.java)
  menus: [
    // Restaurant 101 - Meghana Foods Biryani
    {
      menuID: 1001,
      restaurantID: 101,
      itemName: "Meghana Special Chicken Biryani",
      description: "Signature aromatic basmati rice cooked with succulent spiced chicken chunks and authentic Andhra masala.",
      price: 320,
      isAvailable: 1,
      category: "Biryani & Rice",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },
    {
      menuID: 1002,
      restaurantID: 101,
      itemName: "Paneer Butter Masala Biryani",
      description: "Fragrant saffron rice layered with tender grilled paneer cubes and rich cashew gravy.",
      price: 260,
      isAvailable: 1,
      category: "Biryani & Rice",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },
    {
      menuID: 1003,
      restaurantID: 101,
      itemName: "Andhra Chilli Chicken",
      description: "Crispy boneless chicken tossed in spicy green chilli paste, curry leaves, and lemon juice.",
      price: 240,
      isAvailable: 1,
      category: "Starters & Appetizers",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },
    {
      menuID: 1004,
      restaurantID: 101,
      itemName: "Crispy Babycorn 65",
      description: "Tender golden babycorn deep-fried with southern spices and served with mint chutney.",
      price: 190,
      isAvailable: 1,
      category: "Starters & Appetizers",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80",
      isRecommended: false
    },
    {
      menuID: 1005,
      restaurantID: 101,
      itemName: "Mutton Boneless Biryani",
      description: "Slow-cooked tender lamb chunks marinated in traditional spices layered with seeraga samba rice.",
      price: 390,
      isAvailable: 0, // Currently out of stock
      category: "Biryani & Rice",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80",
      isRecommended: false
    },
    {
      menuID: 1006,
      restaurantID: 101,
      itemName: "Gulab Jamun with Rabri (2 Pcs)",
      description: "Soft melt-in-the-mouth fried dumplings soaked in rose cardamom syrup topped with creamy rabri.",
      price: 110,
      isAvailable: 1,
      category: "Desserts & Drinks",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },

    // Restaurant 102 - Truffles Gourmet Burgers
    {
      menuID: 2001,
      restaurantID: 102,
      itemName: "All American Cheeseburger",
      description: "Juicy grilled patty layered with melted cheddar, crisp lettuce, gherkins, and homemade secret relish.",
      price: 240,
      isAvailable: 1,
      category: "Signature Burgers",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },
    {
      menuID: 2002,
      restaurantID: 102,
      itemName: "Peri Peri Veg Crunch Burger",
      description: "Crispy spiced vegetable patty with chipotle mayo, jalapeños, and fresh slaw.",
      price: 190,
      isAvailable: 1,
      category: "Signature Burgers",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },
    {
      menuID: 2003,
      restaurantID: 102,
      itemName: "Loaded Cheese Truffle Fries",
      description: "Crisp potato fries tossed in truffle parmesan oil and drenched in hot liquid cheese sauce.",
      price: 160,
      isAvailable: 1,
      category: "Sides & Fries",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },
    {
      menuID: 2004,
      restaurantID: 102,
      itemName: "Belgian Chocolate Thickshake",
      description: "Indulgent rich dark chocolate shake blended with premium vanilla cream.",
      price: 180,
      isAvailable: 1,
      category: "Desserts & Drinks",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80",
      isRecommended: false
    },

    // Restaurant 103 - La Pino'z Artisan Pizza
    {
      menuID: 3001,
      restaurantID: 103,
      itemName: "Farmhouse Deluxe Gourmet Pizza",
      description: "Fresh tomato concasse, mozzarella, bell peppers, sweet corn, mushrooms, and black olives.",
      price: 340,
      isAvailable: 1,
      category: "Artisan Pizzas",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },
    {
      menuID: 3002,
      restaurantID: 103,
      itemName: "BBQ Smoked Chicken Pizza",
      description: "Smoked tender barbecue chicken strips, red onions, jalapeños, and extra mozzarella.",
      price: 380,
      isAvailable: 1,
      category: "Artisan Pizzas",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },
    {
      menuID: 3003,
      restaurantID: 103,
      itemName: "Cheesy Garlic Bread Sticks",
      description: "Oven-baked crusty bread infused with garlic butter and melted mozzarella cheese.",
      price: 150,
      isAvailable: 1,
      category: "Starters & Appetizers",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },

    // Restaurant 104 - Beijing Bites
    {
      menuID: 4001,
      restaurantID: 104,
      itemName: "Classic Hakka Noodles",
      description: "Wok-tossed thin noodles with crunchy spring vegetables, soya garlic sauce, and scallions.",
      price: 180,
      isAvailable: 1,
      category: "Main Course",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },
    {
      menuID: 4002,
      restaurantID: 104,
      itemName: "Kung Pao Chicken",
      description: "Diced chicken wok-tossed with dried red chillies, crunchy peanuts, and spicy Sichuan glaze.",
      price: 260,
      isAvailable: 1,
      category: "Main Course",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },

    // Restaurant 105 - Nagarjuna Royal Meals
    {
      menuID: 5001,
      restaurantID: 105,
      itemName: "Traditional Andhra Veg Thali",
      description: "Unlimited style platter of gunpowder rice, pappu dal, rasam, sambar, curd, curd chilli, and payasam.",
      price: 240,
      isAvailable: 1,
      category: "Main Course",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    },

    // Restaurant 106 - Milano Ice Cream & Bakes
    {
      menuID: 6001,
      restaurantID: 106,
      itemName: "Sicilian Pistachio Gelato Tub (500ml)",
      description: "Authentic slow-churned Italian gelato crafted with 100% roasted Sicilian pistachios.",
      price: 320,
      isAvailable: 1,
      category: "Desserts & Drinks",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",
      isRecommended: true
    }
  ]
};

// Local Cart Management
const CartService = {
  getCart() {
    try {
      const data = localStorage.getItem("foodapp_cart");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  
  saveCart(cart) {
    try {
      localStorage.setItem("foodapp_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {
      console.error("Cart save error", e);
    }
  },

  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCartRestaurant() {
    const cart = this.getCart();
    if (cart.length === 0) return null;
    return cart[0].restaurant;
  },

  addItem(menuItem, restaurant) {
    let cart = this.getCart();
    
    // Check if cart already has items from a different restaurant
    if (cart.length > 0 && cart[0].restaurantID !== restaurant.restaurantID) {
      if (!confirm(`Your cart contains items from "${cart[0].restaurant.name}". Do you want to discard your previous cart and add items from "${restaurant.name}"?`)) {
        return false;
      }
      cart = [];
    }

    const existingIndex = cart.findIndex(item => item.menuID === menuItem.menuID);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        menuID: menuItem.menuID,
        restaurantID: restaurant.restaurantID,
        itemName: menuItem.itemName,
        price: menuItem.price,
        isVeg: menuItem.isVeg,
        image: menuItem.image,
        quantity: 1,
        restaurant: {
          restaurantID: restaurant.restaurantID,
          name: restaurant.name,
          address: restaurant.address
        }
      });
    }

    this.saveCart(cart);
    return true;
  },

  updateQuantity(menuID, delta) {
    let cart = this.getCart();
    const index = cart.findIndex(item => item.menuID === menuID);
    if (index > -1) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      this.saveCart(cart);
    }
  },

  getItemQuantity(menuID) {
    const cart = this.getCart();
    const item = cart.find(i => i.menuID === menuID);
    return item ? item.quantity : 0;
  },

  clearCart() {
    this.saveCart([]);
  }
};

