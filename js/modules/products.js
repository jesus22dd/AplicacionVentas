/* =================================================================
   MODULE: Gestión de Productos
   ================================================================= */

const ProductsModule = {
  page: 1,
  search: '',
  catFilter: 'all',
  statusFilter: 'all',
  sortDesc: false,

  render() {
    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Gestión de Productos</h2>
        <p>${DB.products.length} productos registrados en el sistema</p>
      </div>
      <button class="btn btn-primary" onclick="ProductsModule.openForm()">
        <i class="fas fa-plus"></i> Nuevo Producto
      </button>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-boxes-stacked"></i> Catálogo de Productos</div>
        <div class="d-flex gap-8">
          <button class="btn btn-sm btn-secondary sort-toggle-btn" id="sortToggleBtn"
            onclick="ProductsModule.toggleSort()"
            title="${this.sortDesc ? 'Más antiguo primero' : 'Más reciente primero'}">
            <i class="fas ${this.sortDesc ? 'fa-arrow-down-wide-short' : 'fa-arrow-up-wide-short'}"></i>
            <span class="sort-label">${this.sortDesc ? 'Más reciente' : 'Más antiguo'}</span>
          </button>
          <select class="filter-select" id="prodStatusFilter" onchange="ProductsModule.applyFilter()">
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>
      <div class="card-body" style="padding:14px 20px">
        <div class="chip-bar" style="margin-bottom:12px">
          <button class="chip ${this.catFilter==='all'?'chip-active':''}" onclick="ProductsModule.setCat('all')">
            <i class="fas fa-th-large"></i> Todos
            <span class="chip-count">${DB.products.length}</span>
          </button>
          ${DB.categories.map(c => {
            const cnt = DB.products.filter(p=>p.catId===c.id).length;
            return `<button class="chip ${this.catFilter===c.id?'chip-active':''}" onclick="ProductsModule.setCat('${c.id}')"
              style="${this.catFilter===c.id?'':''}">
              <i class="fas ${c.icon}" style="${this.catFilter===c.id?'':'color:'+c.color}"></i> ${c.name}
              <span class="chip-count">${cnt}</span>
            </button>`;
          }).join('')}
        </div>
        <div class="filter-bar">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="prodSearch" value="${this.search}" placeholder="Buscar por nombre o código..." oninput="ProductsModule.applySearch(this.value)" />
          </div>
          <button class="btn btn-sm btn-secondary" onclick="ProductsModule.applyFilter()"><i class="fas fa-rotate"></i> Refrescar</button>
        </div>
      </div>
      <div class="table-wrap">
        <table class="tbl-products mobile-cards">
          <thead>
            <tr>
              <th>Código</th><th>Producto</th><th>Categoría</th>
              <th>P. Compra</th><th>P. Venta</th><th>Margen</th>
              <th>Stock</th><th>Proveedor</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody id="prodTableBody"></tbody>
        </table>
      </div>
      <div id="prodPagination"></div>
    </div>`;
  },

  init() {
    this.page = 1;
    this.search = '';
    this.catFilter = 'all';
    this.statusFilter = 'all';
    this.renderTable();
  },

  toggleSort() {
    this.sortDesc = !this.sortDesc;
    this.page = 1;
    const btn = document.getElementById('sortToggleBtn');
    if (btn) {
      btn.querySelector('i').className = `fas ${this.sortDesc ? 'fa-arrow-down-wide-short' : 'fa-arrow-up-wide-short'}`;
      const lbl = btn.querySelector('.sort-label');
      if (lbl) lbl.textContent = this.sortDesc ? 'Más reciente' : 'Más antiguo';
      btn.title = this.sortDesc ? 'Más antiguo primero' : 'Más reciente primero';
    }
    this.renderTable();
  },

  getFiltered() {
    let items = [...DB.products];
    if (this.catFilter !== 'all') items = items.filter(p => p.catId === this.catFilter);
    if (this.statusFilter !== 'all') items = items.filter(p => p.status === this.statusFilter);
    if (this.search) {
      const t = this.search.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(t) || p.code.toLowerCase().includes(t));
    }
    if (this.sortDesc) items.reverse();
    return items;
  },

  renderTable() {
    const filtered = this.getFiltered();
    const pag = paginate(filtered, this.page, 12);
    const tbody = document.getElementById('prodTableBody');
    const pagEl = document.getElementById('prodPagination');
    if (!tbody) return;

    if (pag.items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state"><i class="fas fa-box"></i><h4>Sin productos</h4><p>No se encontraron resultados</p></div></td></tr>`;
      if (pagEl) pagEl.innerHTML = '';
      return;
    }

    tbody.innerHTML = pag.items.map(p => {
      const cat = DB.getCat(p.catId);
      const sup = DB.getSupplier(p.supId);
      const margin = (((p.sellP - p.buyP) / p.buyP) * 100).toFixed(1);
      return `
      <tr>
        <td data-label="Código"><span class="badge badge-gray">${p.code}</span></td>
        <td data-label="Producto">
          <div class="product-cell">
            ${p.image
              ? `<div class="prod-icon" style="overflow:hidden;padding:0"><img src="${p.image}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm)" /></div>`
              : prodIcon(p.catId)}
            <div>
              <div style="font-weight:600">${p.name}</div>
              <div style="font-size:11px;color:var(--text-3)">${p.unit}</div>
            </div>
          </div>
        </td>
        <td data-label="Categoría"><span class="badge" style="background:${cat?cat.bg:'#f1f5f9'};color:${cat?cat.color:'#64748b'}"><i class="fas ${cat?cat.icon:'fa-box'}"></i>${cat?cat.name:'—'}</span></td>
        <td data-label="P. Compra">${fmt(p.buyP)}</td>
        <td data-label="P. Venta"><strong>${fmt(p.sellP)}</strong></td>
        <td data-label="Margen"><span class="badge ${parseFloat(margin)>=20?'badge-success':'badge-warning'}">${margin}%</span></td>
        <td data-label="Stock">${stockBadge(p.stock, p.minStock)}</td>
        <td data-label="Proveedor" style="font-size:12px">${sup?sup.name:'—'}</td>
        <td data-label="Estado">${statusBadge(p.status)}</td>
        <td data-label="Acciones">
          <div class="d-flex gap-8">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="ProductsModule.openForm('${p.id}')" title="Editar"><i class="fas fa-pen"></i></button>
            <button class="btn btn-sm btn-outline-danger btn-icon" onclick="ProductsModule.deleteProduct('${p.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');

    if (pagEl) pagEl.innerHTML = paginationHTML(pag, 'ProductsModule.goPage');
  },

  setCat(catId) {
    this.catFilter = catId;
    this.page = 1;
    navigate('products');
  },

  applyFilter() {
    this.statusFilter = document.getElementById('prodStatusFilter')?.value || 'all';
    this.page = 1;
    this.renderTable();
  },

  applySearch(val) {
    this.search = val;
    this.page = 1;
    this.renderTable();
  },

  goPage(p) {
    ProductsModule.page = p;
    ProductsModule.renderTable();
  },

  openForm(prodId = null) {
    const p = prodId ? DB.getProd(prodId) : null;
    const title = p ? 'Editar Producto' : 'Nuevo Producto';

    openModal(title, `
    <form onsubmit="ProductsModule.saveProduct(event,'${prodId||''}')">
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label>Código de Barras</label>
          <input class="form-control" name="code" value="${p?p.code:''}" placeholder="Ej: LAC001" required />
        </div>
        <div class="form-group">
          <label>Nombre del Producto</label>
          <input class="form-control" name="name" value="${p?p.name:''}" placeholder="Nombre del producto" required />
        </div>
        <div class="form-group">
          <label>Categoría</label>
          <select class="form-control" name="catId" required>
            ${DB.categories.map(c=>`<option value="${c.id}" ${p&&p.catId===c.id?'selected':''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Proveedor</label>
          <select class="form-control" name="supId">
            <option value="">Sin proveedor</option>
            ${DB.suppliers.map(s=>`<option value="${s.id}" ${p&&p.supId===s.id?'selected':''}>${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Precio de Compra ($)</label>
          <input class="form-control" name="buyP" type="number" step="0.01" min="0" value="${p?p.buyP:''}" required />
        </div>
        <div class="form-group">
          <label>Precio de Venta ($)</label>
          <input class="form-control" name="sellP" type="number" step="0.01" min="0" value="${p?p.sellP:''}" required />
        </div>
        <div class="form-group">
          <label>Stock Actual</label>
          <input class="form-control" name="stock" type="number" min="0" value="${p?p.stock:0}" required />
        </div>
        <div class="form-group">
          <label>Stock Mínimo (alerta)</label>
          <input class="form-control" name="minStock" type="number" min="0" value="${p?p.minStock:10}" required />
        </div>
        <div class="form-group">
          <label>Unidad</label>
          <select class="form-control" name="unit">
            <option value="und" ${!p||p.unit==='und'?'selected':''}>Unidad</option>
            <option value="kg" ${p&&p.unit==='kg'?'selected':''}>Kilogramo</option>
            <option value="lt" ${p&&p.unit==='lt'?'selected':''}>Litro</option>
            <option value="gr" ${p&&p.unit==='gr'?'selected':''}>Gramo</option>
          </select>
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select class="form-control" name="status">
            <option value="active" ${!p||p.status==='active'?'selected':''}>Activo</option>
            <option value="inactive" ${p&&p.status==='inactive'?'selected':''}>Inactivo</option>
          </select>
        </div>
        <div class="form-group full">
          <label>Imagen del Producto</label>
          <div style="display:flex;align-items:center;gap:12px">
            <div id="prodImgPreview" style="width:72px;height:72px;border-radius:10px;background:var(--bg-2);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;border:1px solid var(--border)">
              ${p?.image ? `<img src="${p.image}" style="width:100%;height:100%;object-fit:cover" />` : `<i class="fas fa-image" style="font-size:22px;color:var(--border)"></i>`}
            </div>
            <div style="flex:1">
              <input type="file" id="prodImgInput" accept="image/*" style="display:none" onchange="ProductsModule._onImgFile(this)" />
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('prodImgInput').click()">
                  <i class="fas fa-upload"></i> Subir imagen
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="ProductsModule._removeImg()">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <div style="font-size:11px;color:var(--text-3);margin-top:5px">PNG/JPG/WebP — se comprimirá a ≤180px</div>
            </div>
          </div>
          <input type="hidden" name="image" id="prodImgData" value="${p?.image||''}" />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>
      </div>
    </form>`, 'modal-lg');
  },

  _onImgFile(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const MAX = 180;
        let w = img.width, h = img.height;
        const ratio = Math.min(MAX / w, MAX / h, 1);
        w = Math.round(w * ratio); h = Math.round(h * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/webp', 0.80);
        document.getElementById('prodImgData').value = dataUrl;
        const prev = document.getElementById('prodImgPreview');
        if (prev) prev.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover" />`;
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  },

  _removeImg() {
    document.getElementById('prodImgData').value = '';
    const prev = document.getElementById('prodImgPreview');
    if (prev) prev.innerHTML = `<i class="fas fa-image" style="font-size:22px;color:var(--border)"></i>`;
  },

  saveProduct(e, prodId) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    data.buyP    = parseFloat(data.buyP);
    data.sellP   = parseFloat(data.sellP);
    data.stock   = parseInt(data.stock);
    data.minStock= parseInt(data.minStock);
    data.image   = fd.get('image') || null;

    if (prodId) {
      const p = DB.getProd(prodId);
      Object.assign(p, data);
      showToast('Producto actualizado correctamente', 'success');
    } else {
      data.id = 'P' + String(DB.nextProductId).padStart(3,'0');
      data.sold = 0;
      DB.nextProductId++;
      DB.products.push(data);
      showToast('Producto creado correctamente', 'success');
    }
    closeModalDirect();
    this.renderTable();
  },

  deleteProduct(prodId) {
    const p = DB.getProd(prodId);
    openConfirm('Eliminar Producto', `¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`, () => {
      DB.products = DB.products.filter(pr => pr.id !== prodId);
      showToast('Producto eliminado', 'success');
      this.renderTable();
    });
  },
};
