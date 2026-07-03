/* ============================================
   home.js — Home Page Logic
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedProducts();
    initCounters();
    initTestimonials();
    typewriterEffect();
});

// ── Featured Products ──
function renderFeaturedProducts() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    const products = getProducts().filter(p => p.featured).slice(0, 6);
    grid.innerHTML = products.map(p => {
        const discount = getDiscountPercent(p.originalPrice, p.price);
        return `
        <div class="product-card" data-animate="fade-up">
            <div class="product-card-img">
                <div class="product-img-placeholder" style="background:linear-gradient(135deg, ${getBrandColor(p.brand)})">
                    ${p.brand.substring(0,2).toUpperCase()}
                </div>
                <div class="product-card-badges">
                    ${p.isNew ? '<span class="badge badge-success">New</span>' : ''}
                    ${discount > 0 ? `<span class="badge badge-accent">${discount}% OFF</span>` : ''}
                </div>
            </div>
            <div class="product-card-body">
                <div class="product-card-brand">${p.brand}</div>
                <h3>${p.name}</h3>
                <div class="star-rating">${getStarHTML(4 + Math.round(Math.random()))}</div>
                <div class="product-card-price">
                    <span class="price-current">${formatPrice(p.price)}</span>
                    ${p.originalPrice ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ''}
                </div>
                <ul class="product-card-features">
                    ${p.features.slice(0, 3).map(f => `<li>${f}</li>`).join('')}
                </ul>
                <div class="product-card-actions">
                    <a href="product-detail.html?id=${p.id}" class="btn btn-secondary btn-sm">View Details</a>
                    <button class="btn btn-primary btn-sm" onclick="addToCart('${p.id}')">Add to Cart</button>
                </div>
            </div>
        </div>`;
    }).join('');
    // Re-init scroll animations for new elements
    setTimeout(initScrollAnimations, 100);
}

function getBrandColor(brand) {
    const colors = {
        'Singer': '#FF6B35, #FF8F65', 'Usha': '#E94560, #FF6B81',
        'Jack': '#2196F3, #64B5F6', 'Juki': '#9C27B0, #CE93D8',
        'Brother': '#00BCD4, #4DD0E1', 'Siruba': '#FF9800, #FFB74D',
        'Merritt': '#4CAF50, #81C784', 'Ranew': '#795548, #A1887F',
        'Revo': '#607D8B, #90A4AE'
    };
    return colors[brand] || '#FF6B35, #E94560';
}

// ── Counter Animation ──
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ── Testimonials Slider ──
function initTestimonials() {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    if (!track || !dotsContainer) return;
    const content = getPageContent();
    const testimonials = content.testimonials || [];
    if (!testimonials.length) return;

    track.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="star-rating">${getStarHTML(t.rating)}</div>
            <p class="testimonial-text">"${t.text}"</p>
            <div class="testimonial-author">— ${t.name}</div>
        </div>
    `).join('');

    dotsContainer.innerHTML = testimonials.map((_, i) =>
        `<button class="testimonial-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></button>`
    ).join('');

    let current = 0;
    window.goToSlide = function(index) {
        current = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        document.querySelectorAll('.testimonial-dot').forEach((d, i) => d.classList.toggle('active', i === index));
    };
    setInterval(() => { goToSlide((current + 1) % testimonials.length); }, 5000);
}

// ── Typewriter Effect ──
function typewriterEffect() {
    const el = document.getElementById('heroSubtitle');
    if (!el) return;
    const text = 'Your Trusted Sewing Machine Partner';
    let i = 0;
    el.style.borderRight = '2px solid var(--primary)';
    function type() {
        if (i <= text.length) {
            el.textContent = text.substring(0, i);
            i++;
            setTimeout(type, 60);
        } else {
            setTimeout(() => { el.style.borderRight = 'none'; }, 1000);
        }
    }
    setTimeout(type, 500);
}