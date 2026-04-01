/* =================================================================
   MODULE: Gestión de Categorías
   ================================================================= */

const CategoriesModule = {
  render() {
    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Gestión de Categorías</h2>
        <p>${DB.categories.length} categorías — ${DB.products.length} productos totales</p>
      </div>
      <button class="btn btn-primary" onclick="CategoriesModule.openForm()">
        <i class="fas fa-plus"></i> Nueva Categoría
      </button>
    </div>

    <!-- Category Cards -->
    <div class="category-cards-grid mb-24" id="catCardsGrid">
      ${this._renderCards()}
    </div>

    <!-- Products by category table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-table"></i> Productos por Categoría</div>
        <select class="filter-select" id="catDetailFilter" onchange="CategoriesModule.filterDetail(this.value)">
          <option value="all">Todas las categorías</option>
          ${DB.categories.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="table-wrap">
        <table class="tbl-categories">
          <thead>
            <tr><th>Categoría</th><th>Código</th><th>Producto</th><th>Stock</th><th>P. Venta</th><th>Ventas</th></tr>
          </thead>
          <tbody id="catDetailBody"></tbody>
        </table>
      </div>
    </div>`;
  },

  init() {
    this.renderDetail('all');
  },

  _renderCards() {
    return DB.categories.map(cat => {
      const prods = DB.products.filter(p => p.catId === cat.id);
      const active = prods.filter(p => p.status === 'active').length;
      const totalSold = prods.reduce((s,p) => s+p.sold, 0);
      return `
      <div class="category-card">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div class="cat-card-icon" style="background:${cat.bg};color:${cat.color}">
            <i class="fas ${cat.icon}"></i>
          </div>
          <div class="d-flex gap-8">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="CategoriesModule.openForm('${cat.id}')"><i class="fas fa-pen"></i></button>
            <button class="btn btn-sm btn-outline-danger btn-icon" onclick="CategoriesModule.deleteCategory('${cat.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div>
          <div class="cat-card-name">${cat.name}</div>
          <div class="cat-card-desc" style="font-size:11.5px;color:var(--text-2);margin:4px 0">${cat.desc}</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span class="badge badge-primary"><i class="fas fa-box"></i>${prods.length} productos</span>
          <span class="badge badge-success"><i class="fas fa-circle-check"></i>${active} activos</span>
          <span class="badge badge-gray"><i class="fas fa-arrow-trend-up"></i>${fmtNum(totalSold)} vendidos</span>
        </div>
      </div>`;
    }).join('');
  },

  renderDetail(catId) {
    const prods = catId === 'all' ? DB.products : DB.products.filter(p => p.catId === catId);
    const tbody = document.getElementById('catDetailBody');
    if (!tbody) return;
    tbody.innerHTML = prods.slice(0,30).map(p => {
      const cat = DB.getCat(p.catId);
      return `<tr>
        <td><span class="badge" style="background:${cat?cat.bg:'#f1f5f9'};color:${cat?cat.color:'#64748b'}">${cat?cat.name:'—'}</span></td>
        <td><span class="badge badge-gray">${p.code}</span></td>
        <td>
          <div class="product-cell">
            ${prodIcon(p.catId)}
            <span>${p.name}</span>
          </div>
        </td>
        <td>${stockBadge(p.stock, p.minStock)}</td>
        <td>${fmt(p.sellP)}</td>
        <td><span class="badge badge-primary">${fmtNum(p.sold)} uds</span></td>
      </tr>`;
    }).join('');
  },

  filterDetail(catId) {
    this.renderDetail(catId);
  },

  openForm(catId = null) {
    const cat = catId ? DB.getCat(catId) : null;
    const colorOptions = ['#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#06b6d4','#f97316','#ec4899','#84cc16','#a855f7'];
    const iconOptions = ['fa-droplet','fa-drumstick-bite','fa-apple-alt','fa-wine-glass','fa-bread-slice','fa-broom','fa-cookie-bite','fa-snowflake','fa-fish','fa-candy-cane','fa-blender','fa-jar'];

    openModal(cat ? 'Editar Categoría' : 'Nueva Categoría', `
    <form onsubmit="CategoriesModule.saveCategory(event,'${catId||''}')">
      <div class="form-grid form-grid-2">
        <div class="form-group full">
          <label>Nombre de la Categoría</label>
          <input class="form-control" name="name" value="${cat?cat.name:''}" placeholder="Ej: Lácteos, Bebidas..." required />
        </div>
        <div class="form-group full">
          <label>Descripción</label>
          <textarea class="form-control" name="desc" placeholder="Descripción breve de la categoría">${cat?cat.desc:''}</textarea>
        </div>
        <div class="form-group">
          <label>Ícono (Font Awesome)</label>
          <select class="form-control" name="icon">
            ${iconOptions.map(i=>`<option value="${i}" ${cat&&cat.icon===i?'selected':''}>${i.replace('fa-','')}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Color</label>
          <select class="form-control" name="color">
            ${colorOptions.map(c=>`<option value="${c}" ${cat&&cat.color===c?'selected':''}>${c}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>
      </div>
    </form>`);
  },

  saveCategory(e, catId) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    // compute bg (light version)
    data.bg = data.color + '22';

    if (catId) {
      const cat = DB.getCat(catId);
      Object.assign(cat, data);
      showToast('Categoría actualizada', 'success');
    } else {
      data.id = 'C' + String(DB.nextCategoryId).padStart(2,'0');
      DB.nextCategoryId++;
      DB.categories.push(data);
      showToast('Categoría creada', 'success');
    }
    closeModalDirect();
    document.getElementById('catCardsGrid').innerHTML = this._renderCards();
    this.renderDetail('all');
  },

  deleteCategory(catId) {
    const cat = DB.getCat(catId);
    const count = DB.products.filter(p => p.catId === catId).length;
    openConfirm('Eliminar Categoría', `¿Eliminar "${cat.name}"? Tiene ${count} productos asociados.`, () => {
      DB.categories = DB.categories.filter(c => c.id !== catId);
      showToast('Categoría eliminada', 'success');
      document.getElementById('catCardsGrid').innerHTML = this._renderCards();
      this.renderDetail('all');
    });
  },
};
