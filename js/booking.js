/* booking.js — Appointment Booking Wizard */
const TIME_SLOTS = [
    { label: '9:00 AM - 10:00 AM', value: '9:00 AM - 10:00 AM' },
    { label: '10:30 AM - 11:30 AM', value: '10:30 AM - 11:30 AM' },
    { label: '12:00 PM - 1:00 PM', value: '12:00 PM - 1:00 PM' },
    { label: '1:30 PM - 2:30 PM', value: '1:30 PM - 2:30 PM' },
    { label: '3:00 PM - 4:00 PM', value: '3:00 PM - 4:00 PM' },
    { label: '4:30 PM - 5:30 PM', value: '4:30 PM - 5:30 PM' }
];

let currentStep = 1;
let selectedDate = null;
let selectedSlot = null;
let calendarDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
});

function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + step)?.classList.add('active');
    // Update progress bar
    document.querySelectorAll('.progress-step').forEach(ps => {
        const s = parseInt(ps.dataset.step);
        ps.classList.remove('active', 'completed');
        if (s === step) ps.classList.add('active');
        else if (s < step) ps.classList.add('completed');
    });
    // Nav buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navEl = document.getElementById('bookingNav');
    prevBtn.style.display = step > 1 && step < 5 ? 'inline-flex' : 'none';
    nextBtn.style.display = step < 5 ? 'inline-flex' : 'none';
    navEl.style.display = step === 5 ? 'none' : 'flex';
    nextBtn.textContent = step === 4 ? 'Confirm Booking ✓' : 'Next →';
}

function nextStep() {
    if (!validateStep(currentStep)) return;
    if (currentStep === 3) renderTimeSlots();
    if (currentStep === 4) { submitBooking(); return; }
    goToStep(currentStep + 1);
    if (currentStep === 3) renderTimeSlots();
}

function prevStep() {
    if (currentStep > 1) goToStep(currentStep - 1);
}

function validateStep(step) {
    switch (step) {
        case 1:
            const serviceType = document.querySelector('input[name="serviceType"]:checked');
            if (!serviceType) { showToast('Please select a service type', 'warning'); return false; }
            return true;
        case 2:
            if (!selectedDate) { showToast('Please select a date', 'warning'); return false; }
            return true;
        case 3:
            if (!selectedSlot) { showToast('Please select a time slot', 'warning'); return false; }
            return true;
        case 4:
            const name = document.getElementById('bkName').value.trim();
            const phone = document.getElementById('bkPhone').value.trim();
            const email = document.getElementById('bkEmail').value.trim();
            if (!name || name.length < 2) { showToast('Please enter your full name', 'warning'); return false; }
            if (!phone || !/^\d{10}$/.test(phone)) { showToast('Please enter a valid 10-digit phone number', 'warning'); return false; }
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email address', 'warning'); return false; }
            return true;
    }
    return true;
}

// ── Calendar ──
function renderCalendar() {
    const grid = document.getElementById('calGrid');
    const header = document.getElementById('calMonthYear');
    if (!grid || !header) return;

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const today = new Date(); today.setHours(0, 0, 0, 0);

    header.textContent = calendarDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = '';
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="cal-day empty"></div>';
    }
    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dateStr = formatDateStr(date);
        const isPast = date < today;
        const isSunday = date.getDay() === 0;
        const isToday = date.getTime() === today.getTime();
        const isSelected = selectedDate === dateStr;

        let classes = 'cal-day';
        if (isPast) classes += ' disabled';
        else if (isSunday) classes += ' sunday disabled';
        if (isToday) classes += ' today';
        if (isSelected) classes += ' selected';

        const onclick = (!isPast && !isSunday) ? `onclick="selectDate('${dateStr}', this)"` : '';
        const title = isSunday ? 'title="Sunday - Closed"' : '';
        html += `<div class="${classes}" ${onclick} ${title}>${d}</div>`;
    }
    grid.innerHTML = html;
}

function changeMonth(delta) {
    calendarDate.setMonth(calendarDate.getMonth() + delta);
    renderCalendar();
}

function selectDate(dateStr, el) {
    selectedDate = dateStr;
    selectedSlot = null;
    document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
}

function formatDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// ── Time Slots ──
function renderTimeSlots() {
    const grid = document.getElementById('timeSlotsGrid');
    if (!grid) return;
    const appointments = getAppointments();
    const bookedSlots = appointments
        .filter(a => a.date === selectedDate && a.status !== 'Cancelled')
        .map(a => a.slot);

    grid.innerHTML = TIME_SLOTS.map(slot => {
        const isBooked = bookedSlots.includes(slot.value);
        const isSelected = selectedSlot === slot.value;
        let classes = 'time-slot';
        if (isBooked) classes += ' booked';
        if (isSelected) classes += ' selected';
        const onclick = isBooked ? '' : `onclick="selectSlot('${slot.value}', this)"`;
        return `<div class="${classes}" ${onclick}><h4>${slot.label}</h4><p>1 hour session</p></div>`;
    }).join('');
}

function selectSlot(slotValue, el) {
    selectedSlot = slotValue;
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
}

// ── Submit ──
function submitBooking() {
    const appointment = {
        id: generateId('apt'),
        date: selectedDate,
        slot: selectedSlot,
        serviceType: document.querySelector('input[name="serviceType"]:checked').value,
        customerName: document.getElementById('bkName').value.trim(),
        phone: document.getElementById('bkPhone').value.trim(),
        email: document.getElementById('bkEmail').value.trim(),
        machineBrand: document.getElementById('bkBrand').value,
        machineModel: document.getElementById('bkModel').value.trim(),
        issueDescription: document.getElementById('bkIssue').value.trim(),
        status: 'Confirmed',
        createdAt: new Date().toISOString()
    };

    const appointments = getAppointments();
    appointments.push(appointment);
    saveToStorage('btc_appointments', appointments);

    // Show confirmation
    document.getElementById('confirmRef').textContent = appointment.id.toUpperCase();
    document.getElementById('confirmSummary').innerHTML = `
        <div class="cs-row"><span class="cs-label">Service</span><span class="cs-value">${appointment.serviceType}</span></div>
        <div class="cs-row"><span class="cs-label">Date</span><span class="cs-value">${formatDate(appointment.date)}</span></div>
        <div class="cs-row"><span class="cs-label">Time</span><span class="cs-value">${appointment.slot}</span></div>
        <div class="cs-row"><span class="cs-label">Name</span><span class="cs-value">${appointment.customerName}</span></div>
        <div class="cs-row"><span class="cs-label">Phone</span><span class="cs-value">${appointment.phone}</span></div>
        ${appointment.email ? `<div class="cs-row"><span class="cs-label">Email</span><span class="cs-value">${appointment.email}</span></div>` : ''}
        ${appointment.machineBrand ? `<div class="cs-row"><span class="cs-label">Machine</span><span class="cs-value">${appointment.machineBrand} ${appointment.machineModel}</span></div>` : ''}
        <div class="cs-row"><span class="cs-label">Status</span><span class="cs-value"><span class="badge badge-success">Confirmed</span></span></div>
    `;

    goToStep(5);
    showToast('Appointment booked successfully!', 'success');
}

function resetBooking() {
    currentStep = 1;
    selectedDate = null;
    selectedSlot = null;
    document.querySelectorAll('input[name="serviceType"]').forEach(r => r.checked = false);
    document.getElementById('bkName').value = '';
    document.getElementById('bkPhone').value = '';
    document.getElementById('bkEmail').value = '';
    document.getElementById('bkBrand').value = '';
    document.getElementById('bkModel').value = '';
    document.getElementById('bkIssue').value = '';
    renderCalendar();
    goToStep(1);
}