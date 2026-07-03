/* product-detail.js */
let currentProduct = null;
let quantity = 1;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const products = getProducts();
    currentProduct = products.find(p => p.id === id);

    if (!currentProduct) {
        document.getElementById('productContent').innerHTML = `<div class="empty-state"><div class="empty-icon">😕</div><h3>Product Not Found</h3><p>The product you're looking for doesn't exist.</p><a href="products.html" class="btn btn-primary" style="margin-top:20px">Browse Products</a></div>`;
        return;
    }

    document.title = `${currentProduct.name} | Bharat Trading Corporation`;
    document.getElementById('bcProduct').textContent = currentProduct.name;
    const p = currentProduct;
    const discount = getDiscountPercent(p.originalPrice, p.price);
    const brandColors = { Singer:'#FF6B35,#FF8F65', Usha:'#E94560,#FF6B81', Jack:'#2196F3,#64B5F6', Juki:'#9C27B0,#CE93D8', Brother:'#00BCD4,#4DD0E1', Siruba:'#FF9800,#FFB74D' };
    const bgColor = brandColors[p.brand] || '#FF6B35,#E94560';

    // Related products
    const related = products.filter(r => r.id !== p.id && (r.brand === p.brand || r.category === p.category)).slice(0, 4);

    document.getElementById('productContent').innerHTML = `
        <div class="detail-layout">
            <div class="detail-image">
                <div class="product-img-placeholder" style="background:linear-gradient(135deg,${bgColor})">${p.brand.substring(0,2).toUpperCase()}</div>
            </div>
            <div class="detail-info">
                <span class="badge badge-primary">${p.brand}</span>
                ${p.category === 'Industrial' ? '<span class="badge badge-info" style="margin-left:6px">Industrial</span>' : ''}
                ${p.isNew ? '<span class="badge badge-success" style="margin-left:6px">New</span>' : ''}
                <h1>${p.name}</h1>
                <div class="star-rating">${getStarHTML(5)} <span style="color:var(--text-muted);font-size:0.85rem;margin-left:6px">(${Math.floor(Math.random()*50+10)} reviews)</span></div>
                <div class="detail-price">
                    <span class="price-current" style="font-size:2rem">${formatPrice(p.price)}</span>
                    ${p.originalPrice ? `<span class="price-original" style="font-size:1.1rem">${formatPrice(p.originalPrice)}</span>` : ''}
                    ${discount > 0 ? `<span class="price-discount">${discount}% off</span>` : ''}
                </div>
                <div class="stock-badge"><div class="stock-dot" style="background:${p.inStock?'var(--success)':'var(--danger)'}"></div>${p.inStock ? 'In Stock' : 'Out of Stock'}</div>
                <p class="detail-desc">${p.description}</p>
                <ul class="detail-features">${p.features.map(f=>`<li>${f}</li>`).join('')}</ul>
                <div class="qty-selector">
                    <button class="qty-btn" onclick="changeQty(-1)">−</button>
                    <div class="qty-value" id="qtyValue">1</div>
                    <button class="qty-btn" onclick="changeQty(1)">+</button>
                </div>
                <div class="detail-btns">
                    <button class="btn btn-primary btn-lg" onclick="addProductToCart()">🛒 Add to Cart</button>
                    <a href="https://wa.me/918778799127?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(p.name)}%20(${formatPrice(p.price)})" target="_blank" class="btn btn-secondary btn-lg" style="background:#25D366;color:#fff;border-color:#25D366">💬 Enquire on WhatsApp</a>
                </div>
            </div>
        </div>

        <div class="tabs">
            <button class="tab-btn active" onclick="switchTab('specs',this)">Specifications</button>
            <button class="tab-btn" onclick="switchTab('desc',this)">Description</button>
        </div>
        <div class="tab-content active" id="tab-specs">
            <table class="specs-table">${Object.entries(p.specifications).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
        </div>
        <div class="tab-content" id="tab-desc">
            <p style="line-height:1.8;font-size:0.95rem">${p.description}<br><br>Key Features:<br>${p.features.map(f=>`• ${f}`).join('<br>')}</p>
        </div>

        ${related.length > 0 ? `
        <div class="related-section">
            <h2 style="margin-bottom:24px">Related <span class="gradient-text">Products</span></h2>
            <div class="related-grid">
                ${related.map(r => {
                    const rd = getDiscountPercent(r.originalPrice, r.price);
                    const rc = brandColors[r.brand] || '#FF6B35,#E94560';
                    return `<div class="product-card">
                        <div class="product-card-img"><div class="product-img-placeholder" style="background:linear-gradient(135deg,${rc})">${r.brand.substring(0,2).toUpperCase()}</div>
                        ${rd > 0 ? `<div class="product-card-badges"><span class="badge badge-accent">${rd}% OFF</span></div>` : ''}</div>
                        <div class="product-card-body"><div class="product-card-brand">${r.brand}</div><h3 style="font-size:0.95rem">${r.name}</h3>
                        <div class="product-card-price"><span class="price-current" style="font-size:1.1rem">${formatPrice(r.price)}</span></div>
                        <a href="product-detail.html?id=${r.id}" class="btn btn-secondary btn-sm btn-block">View Details</a></div></div>`;
                }).join('')}
            </div>
        </div>` : ''}
    `;
});

function changeQty(delta) {
    quantity = Math.max(1, Math.min(10, quantity + delta));
    document.getElementById('qtyValue').textContent = quantity;
}

function addProductToCart() {
    if (!currentProduct) return;
    const cart = getCart();
    const existing = cart.find(i => i.productId === currentProduct.id);
    if (existing) { existing.quantity += quantity; } else { cart.push({ productId: currentProduct.id, quantity }); }
    saveCart(cart);
    showToast(`${currentProduct.name} added to cart!`, 'success');
}

function switchTab(tab, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab)?.classList.add('active');
    btn.classList.add('active');
}