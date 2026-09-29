/**
 * FoodApp - Authentication Page Logic (Login & Register)
 * Only Vanilla JavaScript
 * Direct mapping to UserDAO (addUser, getUser)
 */

const Auth = {
  selectedRole: 'CUSTOMER', // 'CUSTOMER' or 'ADMIN'

  init() {
    this.renderHeaderAndFooter();
    this.attachEventListeners();
    this.setupCartListener();
  },

  // 1. Render Header & Footer
  renderHeaderAndFooter() {
    const navPlaceholder = document.getElementById('navbarPlaceholder');
    if (navPlaceholder) {
      navPlaceholder.innerHTML = UIComponents.renderNavbar('auth');
    }

    const footerPlaceholder = document.getElementById('footerPlaceholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = UIComponents.renderFooter();
    }
  },

  // 2. Switch Role (Customer vs Partner/Admin)
  setRole(role, btnElement) {
    this.selectedRole = role;
    document.querySelectorAll('.role-tab-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    // Update demo credentials info if present
    const demoEmail = document.getElementById('demoEmail');
    if (demoEmail) {
      demoEmail.innerText = role === 'ADMIN' ? 'admin@foodapp.com' : 'mithun@foodapp.com';
    }
  },

  // 3. Toggle Password Visibility
  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.innerHTML = isPassword ? '🙈' : '👁️';
  },

  // 4. Handle Login Submit
  handleLogin(event) {
    event.preventDefault();
    this.clearErrors();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    let hasError = false;

    if (!email) {
      this.showFieldError('loginEmail', 'Please enter your email address');
      hasError = true;
    } else if (!this.isValidEmail(email)) {
      this.showFieldError('loginEmail', 'Please enter a valid email format');
      hasError = true;
    }

    if (!password) {
      this.showFieldError('loginPassword', 'Please enter your password');
      hasError = true;
    } else if (password.length < 6) {
      this.showFieldError('loginPassword', 'Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    const submitBtn = document.getElementById('loginSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Logging in...';
    }

    // Simulate UserDAO authentication
    setTimeout(() => {
      // Set logged in user state
      MockData.currentUser = {
        id: this.selectedRole === 'ADMIN' ? 99 : 1,
        name: this.selectedRole === 'ADMIN' ? 'Admin Manager' : 'Mithun',
        email: email,
        password: password,
        phone: '+91 98765 43210',
        role: this.selectedRole,
        address: 'BTM Layout 2nd Stage, Bengaluru'
      };

      try {
        localStorage.setItem('foodapp_user', JSON.stringify(MockData.currentUser));
      } catch (e) {
        console.error(e);
      }

      UIComponents.showToast(`Welcome back, ${MockData.currentUser.name}! 👋`, 'success');

      setTimeout(() => {
        if (this.selectedRole === 'ADMIN') {
          window.location.href = 'index.html'; // Or admin dashboard when built
        } else {
          window.location.href = 'index.html';
        }
      }, 1000);
    }, 600);
  },

  // 5. Handle Registration Submit
  handleRegister(event) {
    event.preventDefault();
    this.clearErrors();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const address = document.getElementById('regAddress').value.trim();
    let hasError = false;

    if (!name) {
      this.showFieldError('regName', 'Full name is required');
      hasError = true;
    }

    if (!email || !this.isValidEmail(email)) {
      this.showFieldError('regEmail', 'A valid email is required');
      hasError = true;
    }

    if (!phone || phone.length < 10) {
      this.showFieldError('regPhone', 'Enter a valid 10-digit mobile number');
      hasError = true;
    }

    if (!password || password.length < 6) {
      this.showFieldError('regPassword', 'Password must be at least 6 characters');
      hasError = true;
    }

    if (!address) {
      this.showFieldError('regAddress', 'Delivery address is required');
      hasError = true;
    }

    if (hasError) return;

    const submitBtn = document.getElementById('regSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Creating account...';
    }

    // Simulate UserDAO.addUser(User)
    setTimeout(() => {
      MockData.currentUser = {
        id: Math.floor(Math.random() * 900) + 100,
        name: name,
        email: email,
        phone: phone,
        role: this.selectedRole,
        address: address
      };

      try {
        localStorage.setItem('foodapp_user', JSON.stringify(MockData.currentUser));
      } catch (e) {
        console.error(e);
      }

      UIComponents.showToast(`Account created successfully! Welcome, ${name} 🎉`, 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }, 700);
  },

  // Helper: Fill Demo Credentials
  fillDemoCredentials() {
    const emailField = document.getElementById('loginEmail');
    const passField = document.getElementById('loginPassword');
    if (emailField && passField) {
      emailField.value = this.selectedRole === 'ADMIN' ? 'admin@foodapp.com' : 'mithun@foodapp.com';
      passField.value = 'Classy@0539';
      this.clearErrors();
      UIComponents.showToast('Demo credentials filled!', 'normal');
    }
  },

  // Helper: Field Error Display
  showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorMsg = document.getElementById(`${fieldId}Error`);
    if (input) input.classList.add('input-error');
    if (errorMsg) {
      errorMsg.innerText = message;
      errorMsg.classList.add('visible');
    }
  },

  clearErrors() {
    document.querySelectorAll('.form-input').forEach(input => input.classList.remove('input-error'));
    document.querySelectorAll('.field-error-message').forEach(el => el.classList.remove('visible'));
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  attachEventListeners() {
    // Input clear on typing
    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('input-error');
        const err = document.getElementById(`${input.id}Error`);
        if (err) err.classList.remove('visible');
      });
    });
  },

  setupCartListener() {
    window.addEventListener('cartUpdated', () => {
      const badge = document.getElementById('cartBadgeCount');
      if (badge) badge.innerText = CartService.getItemCount();
    });
  }
};

// Auto Boot
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});

