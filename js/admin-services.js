/* admin-services.js */
let adminServices = [];
document.addEventListener('DOMContentLoaded', () => {
    renderAdminHeader('🔧 Services Management');
    loadServices();
});

function loadServices() {
    adminServices = JSON.parse(localStorage.getItem('btc_services') || '[]');
    renderServicesTable();
}

function renderServicesTable() {
    const tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;
    if (adminServices.length === 0) { tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;color:var(--text-muted)">No services found</td></tr>'; return; }
    tbody.innerHTML = adminServices.map(s => `<tr>
        <td style="font-size:1.5rem">${s.icon}</td>
        <td><strong>${s.name}</strong><br><span style="font-size:0.8rem;color:var(--text-muted)">${s.description.substring(0,60)}...</span></td>
        <td>${s.price}</td>
        <td class="actions">
            <button class="btn btn-sm btn-secondary" onclick="editService('${s.id}')">Edit</button>
            <button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteService('${s.id}')">Delete</button>
        </td></tr>`).join('');
}

function openServiceModal(service) {
    document.getElementById('svcModalTitle').textContent = service ? 'Edit Service' : 'Add Service';
    document.getElementById('svcEditId').value = service ? service.id : '';
    document.getElementById('svcIcon').value = service ? service.icon : '';
    document.getElementById('svcName').value = service ? service.name : '';
    document.getElementById('svcDesc').value = service ? service.description : '';
    document.getElementById('svcPrice').value = service ? service.price : '';
    document.getElementById('svcFeatures').value = service ? service.features.join(', ') : '';
    openAdminModal('serviceModal');
}

function editService(id) { const s = adminServices.find(x => x.id === id); if (s) openServiceModal(s); }

function saveService() {
    const id = document.getElementById('svcEditId').value;
    const name = document.getElementById('svcName').value.trim();
    if (!name) { adminShowToast('Please enter service name', 'warning'); return; }
    const data = { id: id || 'svc_' + Date.now(), icon: document.getElementById('svcIcon').value || '🔧', name, description: document.getElementById('svcDesc').value.trim(), price: document.getElementById('svcPrice').value.trim(), features: document.getElementById('svcFeatures').value.split(',').map(f => f.trim()).filter(f => f) };
    if (id) { const idx = adminServices.findIndex(s => s.id === id); if (idx >= 0) adminServices[idx] = data; }
    else adminServices.push(data);
    localStorage.setItem('btc_services', JSON.stringify(adminServices));
    closeAdminModal('serviceModal');
    renderServicesTable();
    adminShowToast(id ? 'Service updated!' : 'Service added!', 'success');
}

function deleteService(id) {
    if (!confirm('Delete this service?')) return;
    adminServices = adminServices.filter(s => s.id !== id);
    localStorage.setItem('btc_services', JSON.stringify(adminServices));
    renderServicesTable();
    adminShowToast('Service deleted', 'success');
}