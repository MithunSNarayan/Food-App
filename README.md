<div align="center">

# 🍔 FoodApp — Modern Full-Stack Food Delivery Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://www.java.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Theme: Dark & Light](https://img.shields.io/badge/Theme-Dark%20%26%20Light-blueviolet)](https://github.com/)

**A SaaS-grade food ordering, restaurant management, and live kitchen dispatch platform built with high-performance Vanilla Web Technologies and Enterprise Java.**

[Explore Features](#-key-features) • [Architecture](#-architecture--tech-stack) • [Quick Start](#-getting-started) • [Project Structure](#-project-structure)

</div>

---

## 🌟 Key Features

### 🌓 1. Adaptive Dark & Light Mode
- **Universal Theme Manager**: Instant one-click toggle between crisp Light Mode and obsidian Dark Mode (`[data-theme="dark"]`).
- **OS Sync & Persistence**: Automatically respects `prefers-color-scheme` with `localStorage` memory across tabs.
- **Zero FOUC (Flash of Unstyled Content)**: Synchronous early execution prevents white flashes on dark mode startup.
- **Appearance Settings**: Interactive profile settings page with Light, Dark, and System preview mockup cards.

### 🍕 2. Customer Food Ordering Experience
- **Dynamic Restaurant Catalog**: Search and filter by cuisines (Italian, Burgers, Sushi, Indian, Desserts), ratings, price range, and dietary preferences (Pure Veg / Non-Veg).
- **Interactive Menu & Customizer**: Dish variations, add-ons, spice levels, and special cooking instructions.
- **Cart & Discount Engine**: Real-time tax, delivery fee, platform fee calculation, and coupon discount validation (`SAVE50`, `TASTY20`, `WELCOME`).
- **Seamless Checkout**: Address management, delivery slot scheduling, and simulated multi-gateway payments (UPI, Credit/Debit Card, Net Banking, COD).
- **Live Order Tracking**: Interactive step-by-step visual tracker with driver simulation and invoice downloads.

### 🤖 3. FoodieBot AI Concierge
- **Floating AI Assistant**: Instant smart dish recommendations based on cravings, budget, and dietary preferences.
- **Nutrition & Macro Analyzer**: Real-time calorie and macro breakdown (Protein, Carbs, Fats) with interactive visual charts.
- **One-Click Cart Adding**: Add recommended meals directly to cart from chatbot suggestion cards.

### 👨‍🍳 4. Restaurant Partner & Admin Portal
- **Kitchen Kanban Fulfillment Board**: Real-time drag-and-drop order pipeline (Received ➔ Preparing ➔ Ready ➔ Dispatched).
- **Menu Catalog Management**: Full CRUD operations for dishes, categories, pricing, stock availability, and image URLs.
- **Restaurant Outlets Management**: Onboard new branches, manage delivery radius, toggle operational status.
- **User & Access Management**: Customer and partner account access controls.
- **Executive Analytics**: KPI summary cards for Revenue, Orders, Average Order Value, and Peak Sales hours.

---

## 🏗️ Architecture & Tech Stack

```
FoodApp/
├── 🌐 Frontend (Pure Vanilla Stack — Zero Framework Overhead)
│   ├── Semantic HTML5 with SEO meta-tags & accessibility (ARIA)
│   ├── Modular CSS3 (Design tokens, CSS variables, Glassmorphism, Micro-animations)
│   └── Vanilla JavaScript ES6+ (Services, Component Renderers, Mock Data Engines)
│
└── ☕ Backend (Enterprise Java & JDBC)
    ├── Java DAO layer & Service Architecture
    ├── Models (User, Restaurant, Order, MenuItem, Cart)
    └── MySQL Database Connectivity (JDBC Driver)
```

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, Modern Vanilla CSS3 (Custom Properties & Design System), JavaScript (ES6+) |
| **UI Components** | Navbar with Quick Theme Switcher, Modal Dialogs, Toast Notifications, Skeleton Loaders |
| **Backend** | Java, Servlet/DAO Pattern, JDBC |
| **Database** | MySQL (Connector `mysql-connector-j-9.2.0.jar`) |
| **Icons & Fonts** | Scalable inline SVGs, Google Fonts (Inter) |

---

## 📁 Project Structure

```bash
FoodApp/
├── frontend/                     # Modern Frontend Web Application
│   ├── css/
│   │   ├── design-system.css     # Global CSS tokens, light/dark variables, typography
│   │   ├── components.css        # Shared UI components (Navbar, buttons, modals, toasts)
│   │   ├── home.css              # Home landing page styles
│   │   ├── restaurants.css       # Restaurant listings & filter panel styles
│   │   ├── restaurant.css        # Restaurant details & menu layout
│   │   ├── cart.css              # Shopping cart & coupon styles
│   │   ├── checkout.css          # Multi-step checkout & payment styles
│   │   ├── orders.css            # Order history & invoice styles
│   │   ├── tracking.css          # Real-time order tracking styles
│   │   ├── profile.css           # User profile & appearance tab styles
│   │   ├── auth.css              # Sign in & registration styles
│   │   ├── admin.css             # Admin dashboard & management styles
│   │   ├── admin-orders.css      # Kitchen Kanban board styles
│   │   └── chatbot.css           # FoodieBot AI chat modal styles
│   ├── js/
│   │   ├── mockData.js           # Comprehensive realistic mock data store
│   │   ├── components.js         # ThemeManager, Navbar, Footer, Toast notifications
│   │   ├── app.js                # Home page controller
│   │   ├── restaurants.js        # Catalog & filter controller
│   │   ├── restaurant.js         # Menu item selection & customizer controller
│   │   ├── cart.js               # Cart service & state management
│   │   ├── checkout.js           # Order placement & validation
│   │   ├── orders.js             # Order history controller
│   │   ├── tracking.js           # Live tracking simulation controller
│   │   ├── profile.js            # Profile & theme switcher controller
│   │   ├── auth.js               # Authentication & validation controller
│   │   ├── admin.js              # Admin portal & catalog controller
│   │   └── chatbot.js            # FoodieBot AI recommendations engine
│   ├── index.html                # Customer Landing Page
│   ├── restaurants.html          # Restaurant Catalog & Search Page
│   ├── restaurant.html           # Restaurant Menu & Dish Customizer
│   ├── cart.html                 # Cart & Discounts Page
│   ├── checkout.html             # Order Checkout & Payment
│   ├── orders.html               # Customer Past Orders & Invoices
│   ├── order-tracking.html       # Live Delivery Tracker
│   ├── profile.html              # Account & Appearance Preferences
│   ├── login.html                # Customer & Partner Login
│   ├── register.html             # Registration Page
│   ├── admin-dashboard.html      # Admin KPI Overview
│   ├── admin-restaurants.html    # Partner Management
│   ├── admin-menu.html           # Menu Catalog Management
│   ├── admin-orders.html         # Kitchen Fulfillment Kanban
│   └── admin-users.html          # User Directory & Access Control
├── src/                          # Java Backend Source Files
│   └── com/                      # Java Package Structure (Models, DAOs, Services)
├── .gitignore                    # Production Git Ignore configuration
└── README.md                     # Documentation & Overview
```

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari)
- *(Optional for Backend)*: JDK 17+ and MySQL Server

### 1. Running the Frontend (Instant Preview)
Since the frontend is built using pure Vanilla Web standards, no build step or node package manager is required:

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/FoodApp.git
   cd FoodApp
   ```
2. Open `frontend/index.html` directly in your favorite browser:
   - Double-click `frontend/index.html`, OR
   - Use VS Code Live Server extension, OR
   - Run a quick local HTTP server:
     ```bash
     # Using Python
     python -m http.server 3000 --directory frontend
     # Or using Node.js
     npx serve frontend
     ```
3. Open `http://localhost:3000` in your browser.

### 2. Demo Credentials
The application includes quick credentials for instant testing:

- **Customer Account**: `mithun@foodapp.com` / `demo123`
- **Admin / Partner Account**: `admin@foodapp.com` / `admin123`

---

## 🎨 Theme & Customization

The platform features a tokenized CSS architecture:

```css
/* Light Theme Defaults */
:root {
  --color-primary: #FF6B35;
  --color-bg: #FFFDFB;
  --color-surface: #FFFFFF;
  --color-border: #E8E8E5;
  --color-text-primary: #1F1F1F;
}

/* Dark Theme (Obsidian Slate Palette) */
[data-theme="dark"] {
  --color-bg: #0B0F19;
  --color-surface: #131B2A;
  --color-surface-soft: #1A2438;
  --color-border: #243048;
  --color-text-primary: #F8FAFC;
}
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ for a modern, high-performance food delivery experience.</sub>
</div>

