/* admin-appointments.js — Appointment Management */
let allAppointments = [];

document.addEventListener('DOMContentLoaded', () => {
    renderAdminHeader('📅 Appointments');
    loadAppointments();
});

function loadAppointments() {
    allAppointments = JSON.parse(localStorage.getItem('btc_appointments') || '[]');
    filterAppointments();
}

function filterAppointments() {
    const status = document.getElementById('statusFilter')?.value || 'all';
    const dateVal = document.getElementById('dateFilter')?.value || '';
    let filtered = [...allAppointments];

    if (status !== 'all') filtered = filtered.filter(a => a.status === status);
    if (dateVal) filtered = filtered.filter(a => a.date === dateVal);

    filtered.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    renderAppointmentsTable(filtered);
}

function renderAppointmentsTable(appointments) {
    const tbody = document.getElementById('appointmentsBody');
    if (!tbody) return;
    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--text-muted)">No appointments found</td></tr>';
        return;
    }
    tbody.innerHTML = appointments.map(a => `
        <tr>
            <td style="font-size:0.8rem">${(a.id || '').substring(0, 12).toUpperCase()}</td>
            <td><strong>${a.customerName || a.name || '—'}</strong></td>
            <td>${a.phone || '—'}</td>
            <td>${a.date}</td>
            <td>${a.slot}</td>
            <td>${a.serviceType || '—'}</td>
            <td>
                <select class="form-control" style="width:auto;padding:4px 24px 4px 8px;font-size:0.8rem" onchange="changeStatus('${a.id}', this.value)">
                    <option value="Confirmed" ${a.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Completed" ${a.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${a.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick="viewAppointment('${a.id}')">View</button>
                <button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteAppointment('${a.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function changeStatus(id, newStatus) {
    const idx = allAppointments.findIndex(a => a.id === id);
    if (idx >= 0) {
        allAppointments[idx].status = newStatus;
        localStorage.setItem('btc_appointments', JSON.stringify(allAppointments));
        adminShowToast(`Status changed to ${newStatus}`, 'success');
    }
}

function viewAppointment(id) {
    const a = allAppointments.find(x => x.id === id);
    if (!a) return;
    document.getElementById('aptDetailContent').innerHTML = `
        <div style="display:grid;gap:12px">
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-glass)"><span style="color:var(--text-muted)">Booking ID</span><strong>${(a.id || '').toUpperCase()}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-glass)"><span style="color:var(--text-muted)">Customer</span><strong>${a.customerName || a.name || '—'}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-glass)"><span style="color:var(--text-muted)">Phone</span><strong>${a.phone || '—'}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-glass)"><span style="color:var(--text-muted)">Email</span><strong>${a.email || '—'}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-glass)"><span style="color:var(--text-muted)">Date</span><strong>${a.date}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-glass)"><span style="color:var(--text-muted)">Time Slot</span><strong>${a.slot}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-glass)"><span style="color:var(--text-muted)">Service Type</span><strong>${a.serviceType || '—'}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-glass)"><span style="color:var(--text-muted)">Machine</span><strong>${a.machineBrand || '—'} ${a.machineModel || ''}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-glass)"><span style="color:var(--text-muted)">Status</span><span class="status-${(a.status || 'confirmed').toLowerCase()}">${a.status}</span></div>
            ${a.issueDescription ? `<div style="padding:10px 0"><span style="color:var(--text-muted)">Issue Description</span><p style="margin-top:6px;font-size:0.9rem">${a.issueDescription}</p></div>` : ''}
        </div>
    `;
    openAdminModal('aptDetailModal');
}

function deleteAppointment(id) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    allAppointments = allAppointments.filter(a => a.id !== id);
    localStorage.setItem('btc_appointments', JSON.stringify(allAppointments));
    filterAppointments();
    adminShowToast('Appointment deleted', 'success');
}