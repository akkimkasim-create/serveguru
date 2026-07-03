/* ============================================
   app.js — Shared Utilities for SERVEGURU Website
   ============================================ */

// ── LocalStorage Helpers ──
function getFromStorage(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
function getProducts() { return getFromStorage('btc_products') || []; }
function getServices() { return getFromStorage('btc_services') || []; }
function getAppointments() { return getFromStorage('btc_appointments') || []; }
function getPageContent() { return getFromStorage('btc_page_content') || {}; }
function getCart() { return getFromStorage('btc_cart') || []; }
function saveCart(cart) { saveToStorage('btc_cart', cart); updateCartBadge(); }

function addToCart(productId) {
    const cart = getCart();
    const existing = cart.find(i => i.productId === productId);
    if (existing) { existing.quantity++; } else { cart.push({ productId, quantity: 1 }); }
    saveCart(cart);
    showToast('Product added to cart!', 'success');
}
function removeFromCart(productId) {
    let cart = getCart().filter(i => i.productId !== productId);
    saveCart(cart);
}
function getCartCount() {
    return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

// ── Utility Functions ──
function formatPrice(num) {
    return '₹' + Number(num).toLocaleString('en-IN');
}
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}
function generateId(prefix) {
    return prefix + '_' + Date.now();
}
function debounce(fn, delay) {
    let timer;
    return function (...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); };
}
function getDiscountPercent(original, current) {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
}

// ── Navigation Renderer ──
function renderNav() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = [
        { href: 'index.html', label: 'Home' },
        { href: 'products.html', label: 'Products' },
        { href: 'services.html', label: 'Services' },
        { href: 'book-appointment.html', label: 'Book Appointment' },
        { href: 'about.html', label: 'About' },
        { href: 'contact.html', label: 'Contact' }
    ];
    const cartCount = getCartCount();
    nav.className = 'main-nav';
    nav.innerHTML = `
        <div class="nav-container">
            <a href="index.html" class="nav-logo">
                <img src="assets/logo.png" alt="ServeGuru" style="width:44px;height:44px;border-radius:var(--radius-sm);object-fit:contain;">
                <div class="nav-logo-text">
                    <h3>SERVEGURU</h3>
                    <span>Bharat Trading Corporation</span>
                </div>
            </a>
            <div class="nav-links" id="navLinks">
                ${links.map(l => `<a href="${l.href}" class="${currentPage === l.href ? 'active' : ''}">${l.label}</a>`).join('')}
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
                <button class="nav-cart" onclick="window.location.href='products.html'" title="Cart">
                    🛒 ${cartCount > 0 ? `<span class="cart-badge" id="cartBadge">${cartCount}</span>` : ''}
                </button>
                <button class="nav-hamburger" id="hamburger" onclick="toggleMobileMenu()">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    `;
    // Scroll detection
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
    if (window.scrollY > 50) nav.classList.add('scrolled');
}

function toggleMobileMenu() {
    const links = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    links.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const count = getCartCount();
    if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }
}

// ── Footer Renderer ──
function renderFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;
    footer.className = 'main-footer';
    footer.innerHTML = `
        <div class="footer-grid">
            <div class="footer-col">
                <img src="assets/logo.png" alt="ServeGuru" style="width:60px;height:60px;margin-bottom:12px;border-radius:8px;">
                <h4>SERVEGURU</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px">Bharat Trading Corporation</p>
                <p>Your trusted partner for premium sewing machines and expert service in Coimbatore. Authorized dealer for 9+ leading brands.</p>
                <div class="footer-social">
                    <a href="#" title="Facebook">📘</a>
                    <a href="#" title="Instagram">📸</a>
                    <a href="https://wa.me/918778799127" title="WhatsApp" target="_blank">💬</a>
                    <a href="#" title="YouTube">▶️</a>
                </div>
            </div>
            <div class="footer-col">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="products.html">Products</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="book-appointment.html">Book Appointment</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Our Services</h4>
                <ul>
                    <li><a href="services.html">Machine Repair</a></li>
                    <li><a href="services.html">Annual Maintenance</a></li>
                    <li><a href="services.html">Installation</a></li>
                    <li><a href="services.html">Training & Demo</a></li>
                    <li><a href="services.html">Spare Parts</a></li>
                    <li><a href="services.html">Wholesale Supply</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Contact Info</h4>
                <div class="footer-contact-item"><span>📍</span> Singanallur, Coimbatore, TN 641005</div>
                <div class="footer-contact-item"><span>📞</span> <a href="tel:+918778799127" style="color:var(--text-secondary)">+91-8778799127</a></div>
                <div class="footer-contact-item"><span>📧</span> <a href="mailto:btc.kovai@gmail.com" style="color:var(--text-secondary)">btc.kovai@gmail.com</a></div>
                <div class="footer-contact-item"><span>🕐</span> Mon-Sat: 9AM–6PM | Sun: Closed</div>
                <div class="footer-newsletter">
                    <input type="email" placeholder="Enter your email..." id="footerEmail">
                    <button class="btn btn-primary btn-sm btn-block" onclick="showToast('Thanks for subscribing!','success')">Subscribe</button>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} SERVEGURU / Bharat Trading Corporation. All rights reserved.</span>
            <a href="admin/admin-login.html">Admin Panel</a>
        </div>
    `;
}

// ── Scroll Animation Observer ──
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => { entry.target.classList.add('animate-visible'); }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// ── Back To Top ──
function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(btn);
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });
}

// ── Toast Notification ──
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || '✅'}</span>${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ── WhatsApp Float ──
function initWhatsApp() {
    if (document.querySelector('.whatsapp-float')) return;
    const wa = document.createElement('a');
    wa.href = 'https://wa.me/918778799127?text=Hi%2C%20I%20am%20interested%20in%20your%20sewing%20machines.';
    wa.target = '_blank';
    wa.className = 'whatsapp-float';
    wa.innerHTML = '💬';
    wa.title = 'Chat on WhatsApp';
    document.body.appendChild(wa);
}

// ── Star Rating HTML ──
function getStarHTML(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="${i <= rating ? '' : 'star-empty'}">★</span>`;
    }
    return html;
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
    renderNav();
    renderFooter();
    initScrollAnimations();
    initBackToTop();
    initWhatsApp();
    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', () => {
            document.getElementById('navLinks')?.classList.remove('active');
            document.getElementById('hamburger')?.classList.remove('active');
        });
    });
});