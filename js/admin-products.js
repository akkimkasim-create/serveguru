/* admin-products.js */
let adminProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    renderAdminHeader('📦 Products Management');
    loadProducts();
});

function loadProducts() {
    adminProducts = JSON.parse(localStorage.getItem('btc_products') || '[]');
    renderProductsTable(adminProducts);
}

function renderProductsTable(products) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-muted)">No products found</td></tr>';
        return;
    }
    tbody.innerHTML = products.map(p => `
        <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.brand}</td>
            <td><span class="badge ${p.category==='Industrial'?'badge-info':'badge-primary'}">${p.category}</span></td>
            <td>₹${Number(p.price).toLocaleString('en-IN')}</td>
            <td>${p.inStock ? '<span class="badge badge-success">Yes</span>' : '<span class="badge badge-danger">No</span>'}</td>
            <td>${p.featured ? '⭐' : '—'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick="editProduct('${p.id}')">Edit</button>
                <button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="deleteProduct('${p.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function filterAdminProducts() {
    const q = document.getElementById('prodSearch').value.toLowerCase();
    const filtered = adminProducts.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    renderProductsTable(filtered);
}

function openProductModal(product) {
    document.getElementById('prodModalTitle').textContent = product ? 'Edit Product' : 'Add Product';
    document.getElementById('prodEditId').value = product ? product.id : '';
    document.getElementById('prodName').value = product ? product.name : '';
    document.getElementById('prodBrand').value = product ? product.brand : '';
    document.getElementById('prodCategory').value = product ? product.category : 'Domestic';
    document.getElementById('prodPrice').value = product ? product.price : '';
    document.getElementById('prodOrigPrice').value = product?.originalPrice || '';
    document.getElementById('prodDesc').value = product ? product.description : '';
    document.getElementById('prodFeatures').value = product ? product.features.join(', ') : '';
    document.getElementById('prodFeatured').checked = product ? product.featured : false;
    document.getElementById('prodInStock').checked = product ? product.inStock : true;
    document.getElementById('prodIsNew').checked = product ? product.isNew : false;
    openAdminModal('productModal');
}

function editProduct(id) {
    const product = adminProducts.find(p => p.id === id);
    if (product) openProductModal(product);
}

function saveProduct() {
    const id = document.getElementById('prodEditId').value;
    const name = document.getElementById('prodName').value.trim();
    const brand = document.getElementById('prodBrand').value;
    const price = parseFloat(document.getElementById('prodPrice').value);

    if (!name || !brand || !price) { adminShowToast('Please fill in required fields', 'warning'); return; }

    const data = {
        id: id || 'prod_' + Date.now(),
        name,
        brand,
        category: document.getElementById('prodCategory').value,
        price,
        originalPrice: parseFloat(document.getElementById('prodOrigPrice').value) || 0,
        description: document.getElementById('prodDesc').value.trim(),
        features: document.getElementById('prodFeatures').value.split(',').map(f => f.trim()).filter(f => f),
        specifications: {},
        featured: document.getElementById('prodFeatured').checked,
        inStock: document.getElementById('prodInStock').checked,
        isNew: document.getElementById('prodIsNew').checked
    };

    if (id) {
        const idx = adminProducts.findIndex(p => p.id === id);
        if (idx >= 0) { data.specifications = adminProducts[idx].specifications; adminProducts[idx] = data; }
    } else {
        adminProducts.push(data);
    }

    localStorage.setItem('btc_products', JSON.stringify(adminProducts));
    closeAdminModal('productModal');
    renderProductsTable(adminProducts);
    adminShowToast(id ? 'Product updated!' : 'Product added!', 'success');
}

function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    adminProducts = adminProducts.filter(p => p.id !== id);
    localStorage.setItem('btc_products', JSON.stringify(adminProducts));
    renderProductsTable(adminProducts);
    adminShowToast('Product deleted', 'success');
}