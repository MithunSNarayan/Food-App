# FoodApp — Modern Frontend Application

FoodApp is a production-grade, responsive food ordering and delivery web application built using **pure HTML, Vanilla CSS, and Vanilla JavaScript**.

The application is structured to map directly to the backend **Java + JDBC + MySQL** architecture (`UserDAO`, `RestaurantDAO`, `MenuDAO`, `OrderDAO`, `OrderItemDAOImpl`).

---

## 📱 Customer Experience Portal

| Page | File | Key Features |
|---|---|---|
| **Home Page** | `index.html` | Hero search, category carousels, top-rated & express restaurants, trust badges. |
| **Restaurant Listing** | `restaurants.html` | Multi-criteria cuisine filter, rating, delivery time, quick sort, search bar. |
| **Restaurant Menu** | `restaurant.html` | Category navigation tabs, pure veg toggle, in-dish search, item quantity steppers, floating cart bar. |
| **Cart & Summary** | `cart.html` | Quantity adjustment, cooking instructions, coupon discount (`WELCOME50`), itemized bill breakdown. |
| **Authentication** | `login.html` & `register.html` | Role selector (Customer vs Restaurant Partner), 1-click demo autofill, password visibility toggle. |
| **Checkout** | `checkout.html` | Saved address selection, multiple payment methods (UPI, Cards, Net Banking, COD), place order simulation. |
| **Live Order Tracking** | `order-tracking.html` | 4-stage live pipeline stepper, ETA countdown, rider card, demo status progression simulator. |
| **Order History** | `orders.html` | Tab filters, 1-click re-order flow, printable tax invoices (`window.print()`). |
| **Account Profile** | `profile.html` | Personal info, multi-address manager, password strength meter. |

---

## 🏪 Admin & Restaurant Partner Portal

| Page | File | Key Features |
|---|---|---|
| **Admin Dashboard** | `admin-dashboard.html` | Revenue & sales KPI cards, active store toggle (Open/Close), live incoming orders feed. |
| **Restaurant Management** | `admin-restaurants.html` | Outlet onboarding, cuisine and ETA configuration, store active switches, edit/delete modal. |
| **Menu Catalog** | `admin-menu.html` | Outlet selector, dish creation modal, pricing, veg/non-veg flags, stock availability switches. |
| **Kitchen Fulfillment Board** | `admin-orders.html` | Real-time Kanban board (Pending → Cooking → With Rider → Delivered), printable KOT tickets. |
| **User Directory** | `admin-users.html` | User accounts list, role assignment (Customer vs Admin), search & filters. |

---

## 🗄️ Database & DAO Alignment

| Java DAO | MySQL Table | Frontend Controller |
|---|---|---|
| `UserDAO` | `user` | `js/auth.js`, `js/profile.js`, `js/admin-users.js` |
| `RestaurantDAO` | `restaurant` | `js/app.js`, `js/restaurants.js`, `js/admin-restaurants.js` |
| `MenuDAO` | `menu` | `js/restaurant.js`, `js/admin-menu.js` |
| `OrderDAO` | `orders` | `js/checkout.js`, `js/tracking.js`, `js/orders.js`, `js/admin-orders.js` |
| `OrderItemDAOImpl` | `order_items` | `js/checkout.js`, `js/tracking.js`, `js/orders.js` |

---

## 🚀 Running the Frontend Locally

```bash
# In the project workspace:
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
