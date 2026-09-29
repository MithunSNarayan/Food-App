/**
 * FoodApp - User Profile & Account Settings Logic
 * Only Vanilla JavaScript
 * Direct mapping to UserDAO.getUser() & UserDAO.updateUser()
 */

const Profile = {
  user: null,
  activeTab: 'personal', // 'personal', 'addresses', 'security'

  init() {
    this.loadUserData();
    this.renderHeaderAndFooter();
    this.renderSidebarOverview();
    this.renderPersonalInfoForm();
    this.renderSavedAddresses();
    this.attachEventListeners();
    this.setupCartListener();

    // Check URL params or hash
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') || window.location.hash.replace('#', '');
    if (tabParam && ['personal', 'addresses', 'security', 'appearance'].includes(tabParam)) {
      const btn = document.querySelector(`[onclick*="switchTab('${tabParam}'"]`);
      this.switchTab(tabParam, btn);
    }
  },

  // 1. Load User Data (Simulating UserDAO.getUser())
  loadUserData() {
    try {
      const saved = localStorage.getItem('foodapp_user');
      this.user = saved ? JSON.parse(saved) : MockData.currentUser;
    } catch (e) {
      this.user = MockData.currentUser;
    }
  },

  // 2. Render Header & Footer
  renderHeaderAndFooter() {
    const navPlaceholder = document.getElementById('navbarPlaceholder');
    if (navPlaceholder) {
      navPlaceholder.innerHTML = UIComponents.renderNavbar('profile');
    }

    const footerPlaceholder = document.getElementById('footerPlaceholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = UIComponents.renderFooter();
    }
  },

  // 3. Render Sidebar Overview
  renderSidebarOverview() {
    const nameDisplay = document.getElementById('profileNameDisplay');
    const emailDisplay = document.getElementById('profileEmailDisplay');
    const initialsDisplay = document.getElementById('profileInitials');
    const roleDisplay = document.getElementById('profileRoleBadge');

    const u = this.user;
    if (nameDisplay) nameDisplay.innerText = u.name;
    if (emailDisplay) emailDisplay.innerText = u.email;
    if (roleDisplay) roleDisplay.innerText = u.role;

    if (initialsDisplay) {
      if (u.avatar) {
        initialsDisplay.innerHTML = `<img src="${u.avatar}" alt="${u.name}">`;
      } else {
        const initials = u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        initialsDisplay.innerText = initials || 'G';
      }
    }
  },

  // 3.1 Avatar Modal & Upload Handlers
  openAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (modal) modal.classList.add('active');
  },

  closeAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (modal) modal.classList.remove('active');
  },

  triggerFileInput() {
    const fileInput = document.getElementById('avatarFileInput');
    if (fileInput) fileInput.click();
  },

  handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      UIComponents.showToast('File size must be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.user.avatar = e.target.result;
      this.saveUserData();
      this.renderSidebarOverview();
      this.closeAvatarModal();
      UIComponents.showToast('Profile photo updated successfully! 📸', 'success');
    };
    reader.readAsDataURL(file);
  },

  selectPresetAvatar(imageUrl) {
    this.user.avatar = imageUrl;
    this.saveUserData();
    this.renderSidebarOverview();
    this.closeAvatarModal();
    UIComponents.showToast('Avatar updated! ✨', 'success');
  },

  removeAvatar() {
    this.user.avatar = null;
    this.saveUserData();
    this.renderSidebarOverview();
    this.closeAvatarModal();
    UIComponents.showToast('Photo removed, default initials restored', 'normal');
  },

  currentZoom: 1,

  // 3.2 Zoom Photo Lightbox Handlers
  openZoomModal() {
    const modal = document.getElementById('avatarZoomModal');
    const viewport = document.getElementById('avatarZoomViewport');
    const levelText = document.getElementById('zoomLevelText');

    if (!modal || !viewport) return;

    this.currentZoom = 1;
    if (this.user.avatar) {
      viewport.innerHTML = `<img src="${this.user.avatar}" id="zoomedAvatarImg" alt="${this.user.name}">`;
    } else {
      const initials = this.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      viewport.innerHTML = initials || 'G';
    }

    if (levelText) levelText.innerText = '100%';
    modal.classList.add('active');
  },

  closeZoomModal() {
    const modal = document.getElementById('avatarZoomModal');
    if (modal) modal.classList.remove('active');
  },

  zoomIn() {
    if (this.currentZoom < 2.5) {
      this.currentZoom += 0.25;
      this.applyZoom();
    }
  },

  zoomOut() {
    if (this.currentZoom > 0.6) {
      this.currentZoom -= 0.25;
      this.applyZoom();
    }
  },

  resetZoom() {
    this.currentZoom = 1;
    this.applyZoom();
  },

  applyZoom() {
    const img = document.getElementById('zoomedAvatarImg');
    const levelText = document.getElementById('zoomLevelText');
    if (img) {
      img.style.transform = `scale(${this.currentZoom})`;
    }
    if (levelText) {
      levelText.innerText = `${Math.round(this.currentZoom * 100)}%`;
    }
  },

  // 4. Render Personal Info Form
  renderPersonalInfoForm() {
    const u = this.user;
    const nameInput = document.getElementById('profileInputName');
    const emailInput = document.getElementById('profileInputEmail');
    const phoneInput = document.getElementById('profileInputPhone');
    const addressInput = document.getElementById('profileInputAddress');

    if (nameInput) nameInput.value = u.name;
    if (emailInput) emailInput.value = u.email;
    if (phoneInput) phoneInput.value = u.phone;
    if (addressInput) addressInput.value = u.address;
  },

  // 5. Render Saved Addresses
  renderSavedAddresses() {
    const container = document.getElementById('profileAddressesList');
    if (!container) return;

    const addresses = this.user.savedAddresses || [
      { id: 1, type: "Home", text: this.user.address },
      { id: 2, type: "Work", text: "Tech Park, 5th Floor, Electronic City, Bengaluru" }
    ];

    container.innerHTML = addresses.map(addr => `
      <div class="address-item-card" id="addr-card-${addr.id}">
        <div>
          <div class="address-item-top">
            <span class="address-type-tag">
              <span>${addr.type === 'Home' ? '🏠' : '🏢'}</span>
              <span>${addr.type}</span>
            </span>
          </div>
          <p class="address-text" style="margin-top: 8px;">${addr.text}</p>
        </div>

        <div class="address-item-actions">
          <button class="btn btn-outline btn-sm" onclick="Profile.editAddress(${addr.id})">Edit</button>
          <button class="btn btn-ghost btn-sm" style="color: var(--color-error);" onclick="Profile.deleteAddress(${addr.id})">Delete</button>
        </div>
      </div>
    `).join('');
  },

  // 6. Tab Switching
  switchTab(tabName, btnElement) {
    this.activeTab = tabName;
    document.querySelectorAll('.profile-nav-item:not(.logout)').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    document.querySelectorAll('.profile-tab-section').forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(`tabSection-${tabName}`);
    if (targetSection) targetSection.classList.add('active');
  },

  // 7. Save Personal Info Changes (Simulating UserDAO.updateUser(User))
  savePersonalInfo(event) {
    event.preventDefault();

    const name = document.getElementById('profileInputName').value.trim();
    const email = document.getElementById('profileInputEmail').value.trim();
    const phone = document.getElementById('profileInputPhone').value.trim();
    const address = document.getElementById('profileInputAddress').value.trim();

    if (!name || !email || !phone) {
      UIComponents.showToast('Please fill all required fields', 'error');
      return;
    }

    this.user.name = name;
    this.user.email = email;
    this.user.phone = phone;
    this.user.address = address;

    this.saveUserData();
    this.renderSidebarOverview();
    UIComponents.showToast('Profile updated successfully! ✅', 'success');
  },

  // 8. Update Password
  updatePassword(event) {
    event.preventDefault();

    const currentPass = document.getElementById('currPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmNewPassword').value;

    if (!currentPass || !newPass) {
      UIComponents.showToast('Please enter your current and new password', 'error');
      return;
    }

    if (newPass.length < 6) {
      UIComponents.showToast('New password must be at least 6 characters', 'error');
      return;
    }

    if (newPass !== confirmPass) {
      UIComponents.showToast('New passwords do not match', 'error');
      return;
    }

    document.getElementById('passwordForm').reset();
    this.checkPasswordStrength('');
    UIComponents.showToast('Password updated successfully! 🔒', 'success');
  },

  // 8.1 Password Strength Check
  checkPasswordStrength(password) {
    const seg1 = document.getElementById('strengthSeg1');
    const seg2 = document.getElementById('strengthSeg2');
    const seg3 = document.getElementById('strengthSeg3');
    const label = document.getElementById('strengthLabel');

    if (!seg1 || !seg2 || !seg3 || !label) return;

    seg1.className = 'strength-segment';
    seg2.className = 'strength-segment';
    seg3.className = 'strength-segment';

    if (!password) {
      label.innerText = 'Enter new password';
      label.style.color = 'var(--color-text-muted)';
      return;
    }

    if (password.length < 6) {
      seg1.className = 'strength-segment active weak';
      label.innerText = 'Too short (min 6 chars)';
      label.style.color = 'var(--color-error)';
    } else if (password.length < 9) {
      seg1.className = 'strength-segment active medium';
      seg2.className = 'strength-segment active medium';
      label.innerText = 'Moderate strength';
      label.style.color = 'var(--color-warning)';
    } else {
      seg1.className = 'strength-segment active strong';
      seg2.className = 'strength-segment active strong';
      seg3.className = 'strength-segment active strong';
      label.innerText = 'Strong password ✓';
      label.style.color = 'var(--color-success)';
    }
  },

  // 9. Address Actions
  promptAddAddress() {
    const text = prompt('Enter delivery address:');
    if (text && text.trim().length > 5) {
      if (!this.user.savedAddresses) this.user.savedAddresses = [];
      this.user.savedAddresses.push({
        id: Date.now(),
        type: 'Other',
        text: text.trim()
      });
      this.saveUserData();
      this.renderSavedAddresses();
      UIComponents.showToast('New address saved', 'success');
    }
  },

  editAddress(id) {
    const addr = (this.user.savedAddresses || []).find(a => a.id === id);
    if (!addr) return;

    const newText = prompt('Update address:', addr.text);
    if (newText && newText.trim().length > 5) {
      addr.text = newText.trim();
      this.saveUserData();
      this.renderSavedAddresses();
      UIComponents.showToast('Address updated', 'success');
    }
  },

  deleteAddress(id) {
    if (confirm('Delete this address?')) {
      this.user.savedAddresses = (this.user.savedAddresses || []).filter(a => a.id !== id);
      this.saveUserData();
      this.renderSavedAddresses();
      UIComponents.showToast('Address deleted', 'normal');
    }
  },

  saveUserData() {
    try {
      localStorage.setItem('foodapp_user', JSON.stringify(this.user));
    } catch (e) {
      console.error(e);
    }
  },

  // 10. Theme Preference Selection
  selectTheme(theme) {
    if (typeof ThemeManager !== 'undefined') {
      ThemeManager.setTheme(theme);
    }
  },

  // 11. Logout Action
  logout() {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('foodapp_user');
      UIComponents.showToast('Logged out successfully', 'normal');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 700);
    }
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
  Profile.init();
});
