/* admin-pages.js — Page Content Editor */
let pageContent = {};

document.addEventListener('DOMContentLoaded', () => {
    renderAdminHeader('📄 Page Content Editor');
    loadPageContent();
});

function loadPageContent() {
    pageContent = JSON.parse(localStorage.getItem('btc_page_content') || '{}');
    // Populate Hero fields
    if (pageContent.hero) {
        document.getElementById('heroTitle').value = pageContent.hero.title || '';
        document.getElementById('heroSubtitle').value = pageContent.hero.subtitle || '';
        document.getElementById('heroDesc').value = pageContent.hero.description || '';
        document.getElementById('heroCta1').value = pageContent.hero.ctaPrimary || '';
        document.getElementById('heroCta2').value = pageContent.hero.ctaSecondary || '';
    }
    // Populate About fields
    if (pageContent.about) {
        document.getElementById('aboutStory').value = pageContent.about.story || '';
        document.getElementById('aboutMission').value = pageContent.about.mission || '';
        document.getElementById('aboutVision').value = pageContent.about.vision || '';
    }
    // Populate Stats fields
    if (pageContent.stats) {
        document.getElementById('statYears').value = pageContent.stats.years || 0;
        document.getElementById('statCustomers').value = pageContent.stats.customers || 0;
        document.getElementById('statBrands').value = pageContent.stats.brands || 0;
        document.getElementById('statServices').value = pageContent.stats.services || 0;
    }
    // Render Testimonials
    renderTestimonials();
}

function renderTestimonials() {
    const container = document.getElementById('testimonialsList');
    if (!container) return;
    const testimonials = pageContent.testimonials || [];
    if (testimonials.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">No testimonials yet. Click "Add Testimonial" to create one.</p>';
        return;
    }
    container.innerHTML = testimonials.map((t, i) => `
        <div style="background:var(--bg-glass);border:1px solid var(--border-glass);border-radius:var(--radius-sm);padding:16px;margin-bottom:12px;display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:start">
            <div class="form-group" style="margin:0"><label style="font-size:0.8rem">Name</label><input class="form-control" value="${t.name || ''}" onchange="updateTestimonial(${i},'name',this.value)"></div>
            <div class="form-group" style="margin:0"><label style="font-size:0.8rem">Rating (1-5)</label><input type="number" min="1" max="5" class="form-control" value="${t.rating || 5}" onchange="updateTestimonial(${i},'rating',parseInt(this.value))"></div>
            <button class="btn btn-sm" style="background:var(--danger);color:#fff;margin-top:22px" onclick="removeTestimonial(${i})">✕</button>
            <div class="form-group" style="margin:0;grid-column:1/4"><label style="font-size:0.8rem">Review Text</label><textarea class="form-control" rows="2" onchange="updateTestimonial(${i},'text',this.value)">${t.text || ''}</textarea></div>
        </div>
    `).join('');
}

function addTestimonial() {
    if (!pageContent.testimonials) pageContent.testimonials = [];
    pageContent.testimonials.push({ name: '', text: '', rating: 5 });
    renderTestimonials();
}

function updateTestimonial(index, field, value) {
    if (pageContent.testimonials && pageContent.testimonials[index]) {
        pageContent.testimonials[index][field] = value;
    }
}

function removeTestimonial(index) {
    if (!confirm('Remove this testimonial?')) return;
    pageContent.testimonials.splice(index, 1);
    renderTestimonials();
}

function switchPageTab(tab, btn) {
    document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab)?.classList.add('active');
    btn.classList.add('active');
}

function savePageContent() {
    pageContent.hero = {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        description: document.getElementById('heroDesc').value,
        ctaPrimary: document.getElementById('heroCta1').value,
        ctaSecondary: document.getElementById('heroCta2').value
    };
    pageContent.about = {
        title: 'About Us',
        story: document.getElementById('aboutStory').value,
        mission: document.getElementById('aboutMission').value,
        vision: document.getElementById('aboutVision').value
    };
    pageContent.stats = {
        years: parseInt(document.getElementById('statYears').value) || 0,
        customers: parseInt(document.getElementById('statCustomers').value) || 0,
        brands: parseInt(document.getElementById('statBrands').value) || 0,
        services: parseInt(document.getElementById('statServices').value) || 0
    };
    // testimonials already updated inline
    localStorage.setItem('btc_page_content', JSON.stringify(pageContent));
    adminShowToast('Page content saved! Changes will reflect on the website.', 'success');
}

function resetPageContent() {
    if (!confirm('Reset all page content to defaults? This will overwrite your changes.')) return;
    localStorage.removeItem('btc_page_content');
    localStorage.removeItem('btc_data_seeded');
    location.reload();
}