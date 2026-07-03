/* services.js */
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
});

function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    const services = getServices();
    grid.innerHTML = services.map(s => `
        <div class="service-card" data-animate="fade-up">
            <div class="svc-icon">${s.icon}</div>
            <h3>${s.name}</h3>
            <p>${s.description}</p>
            <div class="svc-price">${s.price}</div>
            <ul class="svc-features">${s.features.map(f => `<li>${f}</li>`).join('')}</ul>
            <a href="book-appointment.html" class="btn btn-primary btn-sm btn-block">Book Now</a>
        </div>
    `).join('');
    setTimeout(initScrollAnimations, 100);
}

function toggleFaq(el) {
    const item = el.closest('.faq-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
}