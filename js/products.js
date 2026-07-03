/* products.js — Product Catalog Logic */
const BRANDS = ['Singer','Usha','Jack','Juki','Brother','Siruba','Merritt','Ranew','Revo'];
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    allProducts = getProducts();
    renderBrandFilters();
    applyURLFilters();
    applyFilters();
});

function renderBrandFilters() {
    const container = document.getElementById('brandFilters');
    if (!container) return;
    container.innerHTML = BRANDS.map(b =>
        `<label class="checkbox-item"><input type="checkbox" value="${b}" onchange="applyFilters()"> ${b}</label>`
    ).join('');
}

function applyURLFilters() {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get('brand');
    if (brand) {
        const cb = document.querySelector(`#brandFilters input[value="${brand}"]`);
        if (cb) cb.checked = true;
    }
    const cat = params.get('category');
    if (cat) {
        const r = document.querySelector(`input[name="category"][value="${cat}"]`);
        if (r) r.checked = true;
    }
}

function applyFilters() {
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const selectedBrands = [...document.querySelectorAll('#brandFilters input:checked')].map(i => i.value);
    const category = document.querySelector('input[name="category"]:checked')?.value || 'All';
    const priceRange = document.querySelector('input[name="price"]:checked')?.value || 'all';
    const inStockOnly = document.getElementById('stockFilter')?.checked || false;
    const sort = document.getElementById('sortSelect')?.value || 'featured';

    let filtered = allProducts.filter(p => {
        if (search && !p.name.toLowerCase().includes(search) && !p.brand.toLowerCase().includes(search)) return false;
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
        if (category !== 'All' && p.category !== category) return false;
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            if (p.price < min || p.price > max) return false;
        }
        if (inStockOnly && !p.inStock) return false;
        return true;
    });

    // Sort
    switch (sort) {
        case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
        case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
        default: filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    renderProducts(filtered);
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const empty = document.getElementById('emptyState');
    const count = document.getElementById('resultCount');
    if (!grid) return;

    count.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;

    if (products.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    grid.style.display = 'grid';
    empty.style.display = 'none';

    grid.innerHTML = products.map(p => {
        const discount = getDiscountPercent(p.originalPrice, p.price);
        return `
        <div class="product-card">
            <div class="product-card-img" onclick="openQuickView('${p.id}')">
                <div class="product-img-placeholder" style="background:linear-gradient(135deg, ${getBrandColor(p.brand)})">${p.brand.substring(0,2).toUpperCase()}</div>
                <div class="product-card-badges">
                    ${p.isNew ? '<span class="badge badge-success">New</span>' : ''}
                    ${discount > 0 ? `<span class="badge badge-accent">${discount}% OFF</span>` : ''}
                </div>
                <div class="product-card-quick"><button class="btn-icon" title="Quick View" onclick="event.stopPropagation();openQuickView('${p.id}')">👁</button></div>
            </div>
            <div class="product-card-body">
                <div class="product-card-brand">${p.brand}</div>
                <h3>${p.name}</h3>
                <div class="star-rating">${getStarHTML(4 + Math.round(Math.random()))}</div>
                <div class="product-card-price">
                    <span class="price-current">${formatPrice(p.price)}</span>
                    ${p.originalPrice ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ''}
                    ${discount > 0 ? `<span class="price-discount">${discount}% off</span>` : ''}
                </div>
                <ul class="product-card-features">${p.features.slice(0,2).map(f=>`<li>${f}</li>`).join('')}</ul>
                <div class="product-card-actions">
                    <a href="product-detail.html?id=${p.id}" class="btn btn-secondary btn-sm">Details</a>
                    <button class="btn btn-primary btn-sm" onclick="addToCart('${p.id}')">🛒 Add</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function getBrandColor(brand) {
    const c = { Singer:'#FF6B35,#FF8F65', Usha:'#E94560,#FF6B81', Jack:'#2196F3,#64B5F6', Juki:'#9C27B0,#CE93D8', Brother:'#00BCD4,#4DD0E1', Siruba:'#FF9800,#FFB74D', Merritt:'#4CAF50,#81C784', Ranew:'#795548,#A1887F', Revo:'#607D8B,#90A4AE' };
    return c[brand] || '#FF6B35,#E94560';
}

function openQuickView(id) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    document.getElementById('qvName').textContent = p.name;
    document.getElementById('qvBrand').textContent = p.brand;
    document.getElementById('qvImage').textContent = p.brand.substring(0,2).toUpperCase();
    document.getElementById('qvImage').style.background = `linear-gradient(135deg, ${getBrandColor(p.brand)})`;
    const discount = getDiscountPercent(p.originalPrice, p.price);
    document.getElementById('qvPrice').innerHTML = `
        <span class="price-current">${formatPrice(p.price)}</span>
        ${p.originalPrice ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ''}
        ${discount > 0 ? `<span class="price-discount">${discount}% off</span>` : ''}
    `;
    document.getElementById('qvDesc').textContent = p.description;
    document.getElementById('qvSpecs').innerHTML = `<table class="qv-specs-table">${Object.entries(p.specifications).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>`;
    document.getElementById('qvDetailLink').href = `product-detail.html?id=${p.id}`;
    document.getElementById('qvCartBtn').onclick = () => { addToCart(p.id); closeModal('quickViewModal'); };
    document.getElementById('quickViewModal').classList.add('active');
}

function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('#brandFilters input').forEach(i => i.checked = false);
    document.querySelector('input[name="category"][value="All"]').checked = true;
    document.querySelector('input[name="price"][value="all"]').checked = true;
    document.getElementById('stockFilter').checked = false;
    document.getElementById('sortSelect').value = 'featured';
    applyFilters();
}

function toggleSidebar() {
    document.getElementById('filterSidebar')?.classList.toggle('active');
}