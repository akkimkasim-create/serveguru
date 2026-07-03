/* admin.js — Shared Admin Logic */
(function () {
    // Skip auth check on login page
    const isLoginPage = window.location.pathname.includes('admin-login') || window.location.pathname.includes('login.html');
    if (!isLoginPage) {
        const session = JSON.parse(localStorage.getItem('btc_admin_session') || 'null');
        if (!session || !session.loggedIn) {
            window.location.href = 'admin-login.html';
            return;
        }
    }
})();

function renderAdminSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    if (!sidebar) return;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    sidebar.innerHTML = `
        <div class="sidebar-logo">
            <div class="logo-icon">SG</div>
            <div><h3>ServeGuru Admin</h3><span>Dashboard</span></div>
        </div>
        <nav class="sidebar-nav">
            <a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}"><span class="nav-icon">📊</span> Dashboard</a>
            <a href="admin-products.html" class="${currentPage === 'admin-products.html' ? 'active' : ''}"><span class="nav-icon">📦</span> Products</a>
            <a href="admin-services.html" class="${currentPage === 'admin-services.html' ? 'active' : ''}"><span class="nav-icon">🔧</span> Services</a>
            <a href="admin-appointments.html" class="${currentPage === 'admin-appointments.html' ? 'active' : ''}"><span class="nav-icon">📅</span> Appointments</a>
            <a href="admin-pages.html" class="${currentPage === 'admin-pages.html' ? 'active' : ''}"><span class="nav-icon">📄</span> Page Content</a>
            <a href="../index.html"><span class="nav-icon">←</span> Back to Website</a>
        </nav>
    `;
}

function renderAdminHeader(title) {
    const header = document.getElementById('admin-header');
    if (!header) return;
    header.innerHTML = `
        <div class="admin-breadcrumb">${title || 'Dashboard'}</div>
        <div class="admin-user">
            <span>👤 Admin</span>
            <button class="btn btn-sm btn-secondary" onclick="adminLogout()">Logout</button>
        </div>
    `;
}

function adminLogout() {
    localStorage.removeItem('btc_admin_session');
    window.location.href = 'admin-login.html';
}

function getAdminStats() {
    const products = JSON.parse(localStorage.getItem('btc_products') || '[]');
    const appointments = JSON.parse(localStorage.getItem('btc_appointments') || '[]');
    const today = new Date().toISOString().split('T')[0];
    return {
        totalProducts: products.length,
        totalAppointments: appointments.length,
        todayAppointments: appointments.filter(a => a.date === today).length,
        pending: appointments.filter(a => a.status === 'Confirmed').length,
        completed: appointments.filter(a => a.status === 'Completed').length,
        cancelled: appointments.filter(a => a.status === 'Cancelled').length
    };
}

function openAdminModal(id) { document.getElementById(id)?.classList.add('active'); }
function closeAdminModal(id) { document.getElementById(id)?.classList.remove('active'); }

function toggleAdminSidebar() {
    document.getElementById('admin-sidebar')?.classList.toggle('open');
}

function adminShowToast(msg, type) {
    if (typeof showToast === 'function') showToast(msg, type);
    else alert(msg);
}

document.addEventListener('DOMContentLoaded', () => {
    renderAdminSidebar();
    // Add mobile toggle button
    if (!document.querySelector('.sidebar-toggle')) {
        const btn = document.createElement('button');
        btn.className = 'sidebar-toggle';
        btn.innerHTML = '☰';
        btn.onclick = toggleAdminSidebar;
        document.body.appendChild(btn);
    }
});