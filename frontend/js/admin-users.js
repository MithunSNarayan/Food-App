/**
 * FoodApp - Admin User Management Logic
 * High-Level SaaS Grade • Pure Vanilla JavaScript
 * Direct mapping to UserDAO (getAllUsers, addUser, updateUser, deleteUser)
 */

const AdminUsers = {
  users: [],
  searchQuery: '',
  roleFilter: 'ALL', // 'ALL', 'CUSTOMER', 'ADMIN'
  editingUserId: null,

  init() {
    this.loadUsers();
    AdminApp.init('users');
    this.renderMetricsSummary();
    this.renderUsersTable();
    this.attachEventListeners();
  },

  // 1. Load Users (Simulating UserDAO.getAllUsers())
  loadUsers() {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('foodapp_admin_users') || '[]');
    } catch (e) {
      console.error(e);
    }

    if (saved.length === 0) {
      saved = [
        {
          id: 1,
          name: "Lokesh Sharma",
          email: "lokesh@foodapp.com",
          phone: "+91 98765 43210",
          role: "CUSTOMER",
          address: "Flat 402, Sunshine Heights, BTM 2nd Stage, Bengaluru",
          createdDate: "2026-01-15T10:30:00.000Z",
          status: "ACTIVE"
        },
        {
          id: 2,
          name: "Sneha Reddy",
          email: "sneha.reddy@gmail.com",
          phone: "+91 91234 56789",
          role: "CUSTOMER",
          address: "Villa 12, Palm Meadows, Whitefield, Bengaluru",
          createdDate: "2026-02-10T14:20:00.000Z",
          status: "ACTIVE"
        },
        {
          id: 3,
          name: "Vikram Patil",
          email: "vikram.patil@outlook.com",
          phone: "+91 99887 76655",
          role: "CUSTOMER",
          address: "14th Main, HSR Layout Sector 3, Bengaluru",
          createdDate: "2026-02-18T09:15:00.000Z",
          status: "ACTIVE"
        },
        {
          id: 99,
          name: "Rajesh Kumar (Partner)",
          email: "admin@foodapp.com",
          phone: "+91 98450 11223",
          role: "ADMIN",
          address: "Meghana Foods, Koramangala, Bengaluru",
          createdDate: "2025-11-01T08:00:00.000Z",
          status: "ACTIVE"
        },
        {
          id: 100,
          name: "Amit Deshmukh",
          email: "amit.truffles@foodapp.com",
          phone: "+91 98451 99887",
          role: "ADMIN",
          address: "Truffles Central, St. Marks Road, Bengaluru",
          createdDate: "2025-12-05T11:45:00.000Z",
          status: "ACTIVE"
        }
      ];
      try {
        localStorage.setItem('foodapp_admin_users', JSON.stringify(saved));
      } catch (e) {}
    }

    this.users = saved;
  },

  // 2. Render Metrics Summary
  renderMetricsSummary() {
    const totalCount = this.users.length + 1275;
    const customerCount = this.users.filter(u => u.role === 'CUSTOMER').length + 1237;
    const adminCount = this.users.filter(u => u.role === 'ADMIN').length + 38;

    const kpiWrap = document.getElementById('userMetricsKPIs');
    if (!kpiWrap) return;

    kpiWrap.innerHTML = `
      <div class="kpi-card">
        <div class="kpi-info-col">
          <span class="kpi-label">Total Registered Users</span>
          <span class="kpi-value">${totalCount.toLocaleString()}</span>
          <span class="kpi-trend positive">▲ +8% this month</span>
        </div>
        <div class="kpi-icon-box revenue">👥</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info-col">
          <span class="kpi-label">Active Food Customers</span>
          <span class="kpi-value">${customerCount.toLocaleString()}</span>
          <span class="kpi-trend positive">● 98.4% verified</span>
        </div>
        <div class="kpi-icon-box dishes">🍔</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info-col">
          <span class="kpi-label">Restaurant Partners & Admins</span>
          <span class="kpi-value">${adminCount} Partners</span>
          <span class="kpi-trend neutral">🔒 Multi-outlet access</span>
        </div>
        <div class="kpi-icon-box rating">🏪</div>
      </div>
    `;
  },

  // 3. Render Users Table
  renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    const countDisplay = document.getElementById('userCountText');
    if (!tbody) return;

    let filtered = [...this.users];

    // Role Filter
    if (this.roleFilter !== 'ALL') {
      filtered = filtered.filter(u => u.role === this.roleFilter);
    }

    // Search Query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) || 
        u.phone.toLowerCase().includes(q) ||
        (u.address && u.address.toLowerCase().includes(q))
      );
    }

    if (countDisplay) {
      countDisplay.innerText = `Showing ${filtered.length} of ${this.users.length} active system accounts`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 48px 20px; color: #64748B;">
            <div style="font-size: 28px; margin-bottom: 8px;">👥</div>
            <div style="font-weight: 700; font-size: 15px; color: #0F172A;">No users found</div>
            <div style="font-size: 13px;">Try changing search or filter parameters</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(user => {
      const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const isAdmin = user.role === 'ADMIN';

      return `
        <tr id="user-row-${user.id}">
          <td>
            <div class="flex items-center gap-3">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: ${isAdmin ? 'linear-gradient(135deg, #7C3AED, #5B21B6)' : 'linear-gradient(135deg, #FF6B35, #E85A2A)'}; color: #FFFFFF; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center;">
                ${initials}
              </div>
              <div>
                <div style="font-weight: 700; color: #0F172A;">${user.name}</div>
                <div style="font-size: 11px; color: #64748B;">User ID: #${user.id}</div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-weight: 600; color: #1E293B;">${user.email}</div>
            <div style="font-size: 11px; color: #64748B;">${user.phone}</div>
          </td>
          <td>
            <span style="font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; ${isAdmin ? 'background: #EDE9FE; color: #6D28D9; border: 1px solid #DDD6FE;' : 'background: #EFF6FF; color: #1D4ED8; border: 1px solid #DBEAFE;'}">
              ${user.role}
            </span>
          </td>
          <td>
            <span class="truncate" style="max-width: 240px; display: inline-block; font-size: 12.5px; color: #475569;">
              ${user.address || 'Not specified'}
            </span>
          </td>
          <td>
            <span style="font-size: 12px; color: #64748B;">
              ${new Date(user.createdDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </td>
          <td>
            <div class="flex gap-2">
              <button class="btn btn-outline btn-sm" onclick="AdminUsers.openEditModal(${user.id})">
                ✏️ Edit
              </button>
              <button class="btn btn-ghost btn-sm" style="color: var(--color-error);" onclick="AdminUsers.deleteUser(${user.id})">
                🗑️ Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // 4. Open Modal for Add User
  openAddModal() {
    this.editingUserId = null;
    document.getElementById('userModalTitle').innerText = 'Add New System User';
    document.getElementById('userForm').reset();
    document.getElementById('formUserId').value = '';
    document.getElementById('userModal').classList.add('active');
  },

  // 5. Open Modal for Edit User
  openEditModal(userId) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    this.editingUserId = userId;
    document.getElementById('userModalTitle').innerText = `Edit User: ${user.name}`;
    document.getElementById('formUserId').value = user.id;
    document.getElementById('formUserName').value = user.name;
    document.getElementById('formUserEmail').value = user.email;
    document.getElementById('formUserPhone').value = user.phone;
    document.getElementById('formUserRole').value = user.role;
    document.getElementById('formUserAddress').value = user.address || '';

    document.getElementById('userModal').classList.add('active');
  },

  closeModal() {
    document.getElementById('userModal').classList.remove('active');
  },

  // 6. Save User (Simulating UserDAO.addUser or updateUser)
  saveUser(event) {
    event.preventDefault();

    const name = document.getElementById('formUserName').value.trim();
    const email = document.getElementById('formUserEmail').value.trim();
    const phone = document.getElementById('formUserPhone').value.trim();
    const role = document.getElementById('formUserRole').value;
    const address = document.getElementById('formUserAddress').value.trim();

    if (!name || !email || !phone) {
      UIComponents.showToast('Please fill all required fields', 'error');
      return;
    }

    if (this.editingUserId) {
      // Update existing
      const index = this.users.findIndex(u => u.id === this.editingUserId);
      if (index > -1) {
        this.users[index] = {
          ...this.users[index],
          name,
          email,
          phone,
          role,
          address
        };
        UIComponents.showToast(`Updated user "${name}" successfully! ✅`, 'success');
      }
    } else {
      // Add new
      const newId = Math.floor(100 + Math.random() * 900);
      const newUser = {
        id: newId,
        name,
        email,
        phone,
        role,
        address: address || "Bengaluru",
        createdDate: new Date().toISOString(),
        status: "ACTIVE"
      };
      this.users.unshift(newUser);
      UIComponents.showToast(`User "${name}" created successfully! 🎉`, 'success');
    }

    this.saveData();
    this.closeModal();
    this.renderMetricsSummary();
    this.renderUsersTable();
  },

  // 7. Delete User (Simulating UserDAO.deleteUser)
  deleteUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    if (confirm(`Are you sure you want to deactivate and remove user "${user.name}"?`)) {
      this.users = this.users.filter(u => u.id !== userId);
      this.saveData();
      this.renderMetricsSummary();
      this.renderUsersTable();
      UIComponents.showToast(`User "${user.name}" removed`, 'normal');
    }
  },

  saveData() {
    try {
      localStorage.setItem('foodapp_admin_users', JSON.stringify(this.users));
    } catch (e) {
      console.error(e);
    }
  },

  attachEventListeners() {
    const search = document.getElementById('userSearchInput');
    if (search) {
      search.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderUsersTable();
      });
    }

    const role = document.getElementById('userRoleFilter');
    if (role) {
      role.addEventListener('change', (e) => {
        this.roleFilter = e.target.value;
        this.renderUsersTable();
      });
    }
  }
};

// Auto Boot
document.addEventListener('DOMContentLoaded', () => {
  AdminUsers.init();
});
