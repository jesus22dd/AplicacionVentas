/* =================================================================
   MODULE: Gestión de Proveedores
   ================================================================= */

const SuppliersModule = {
  search: '',
  statusFilter: 'all',
  sortDesc: false,

  render() {
    const active = DB.suppliers.filter(s => s.status === 'active').length;
    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Gestión de Proveedores</h2>
        <p>${DB.suppliers.length} proveedores — ${active} activos</p>
      </div>
      <button class="btn btn-primary" onclick="SuppliersModule.openForm()">
        <i class="fas fa-plus"></i> Nuevo Proveedor
      </button>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
      <div class="stat-card" style="--stat-color:var(--primary)">
        <div class="stat-info"><div class="stat-label">Total Proveedores</div><div class="stat-value">${DB.suppliers.length}</div></div>
        <div class="stat-icon" style="background:var(--primary-l)"><i class="fas fa-truck" style="color:var(--primary)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--secondary)">
        <div class="stat-info"><div class="stat-label">Activos</div><div class="stat-value">${active}</div></div>
        <div class="stat-icon" style="background:var(--secondary-l)"><i class="fas fa-circle-check" style="color:var(--secondary)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--warning)">
        <div class="stat-info"><div class="stat-label">Categorías Abastecidas</div><div class="stat-value">${DB.categories.length}</div></div>
        <div class="stat-icon" style="background:var(--warning-l)"><i class="fas fa-tags" style="color:var(--warning)"></i></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-truck"></i> Lista de Proveedores</div>
        <div class="d-flex gap-8">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar proveedor..." oninput="SuppliersModule.applySearch(this.value)" />
          </div>
          <button class="btn btn-sm btn-secondary sort-toggle-btn" id="sortToggleBtn"
            onclick="SuppliersModule.toggleSort()"
            title="${this.sortDesc ? 'Más antiguo primero' : 'Más reciente primero'}">
            <i class="fas ${this.sortDesc ? 'fa-arrow-down-wide-short' : 'fa-arrow-up-wide-short'}"></i>
            <span class="sort-label">${this.sortDesc ? 'Más reciente' : 'Más antiguo'}</span>
          </button>
          <select class="filter-select" onchange="SuppliersModule.applyStatus(this.value)">
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table class="tbl-suppliers mobile-cards">
          <thead>
            <tr><th>Empresa</th><th>Contacto</th><th>Email / Teléfono</th><th>RUC</th><th>Categorías</th><th>Condición Pago</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody id="suppBody"></tbody>
        </table>
      </div>
    </div>`;
  },

  init() {
    this.search = '';
    this.statusFilter = 'all';
    this.renderTable();
  },

  toggleSort() {
    this.sortDesc = !this.sortDesc;
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
    let items = [...DB.suppliers];
    if (this.statusFilter !== 'all') items = items.filter(s => s.status === this.statusFilter);
    if (this.search) {
      const t = this.search.toLowerCase();
      items = items.filter(s => s.name.toLowerCase().includes(t) || s.contact.toLowerCase().includes(t) || s.email.toLowerCase().includes(t));
    }
    if (this.sortDesc) items.reverse();
    return items;
  },

  renderTable() {
    const items = this.getFiltered();
    const tbody = document.getElementById('suppBody');
    if (!tbody) return;
    const colors = ['#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#06b6d4','#f97316','#ec4899'];
    tbody.innerHTML = items.map((s,i) => {
      const color = colors[i % colors.length];
      const initial = s.name[0];
      const cats = (s.cats||[]).map(cid => {
        const cat = DB.getCat(cid);
        return cat ? `<span class="badge" style="background:${cat.bg};color:${cat.color}"><i class="fas ${cat.icon}"></i>${cat.name}</span>` : '';
      }).join('');
      const productCount = DB.products.filter(p => p.supId === s.id).length;
      return `
      <tr>
        <td data-label="Empresa">
          <div class="person-info">
            <div class="person-avatar" style="background:${color}">${initial}</div>
            <div>
              <div class="person-name">${s.name}</div>
              <div class="person-sub">${productCount} productos</div>
            </div>
          </div>
        </td>
        <td data-label="Contacto" style="font-size:12px">${s.contact}</td>
        <td data-label="Email/Tel">
          <div style="font-size:12px">${s.email}</div>
          <div style="font-size:11px;color:var(--text-3)">${s.phone}</div>
        </td>
        <td data-label="RUC" style="font-size:12px">${s.ruc}</td>
        <td data-label="Categorías">${cats||'—'}</td>
        <td data-label="Cond. Pago"><span class="badge badge-cyan">${s.terms}</span></td>
        <td data-label="Estado">${statusBadge(s.status)}</td>
        <td data-label="Acciones">
          <div class="d-flex gap-8">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="SuppliersModule.viewDetail('${s.id}')" title="Ver detalle"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-secondary btn-icon" onclick="SuppliersModule.openForm('${s.id}')" title="Editar"><i class="fas fa-pen"></i></button>
            <button class="btn btn-sm btn-outline-danger btn-icon" onclick="SuppliersModule.deleteSupplier('${s.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');
  },

  applySearch(val) { this.search = val; this.renderTable(); },
  applyStatus(val) { this.statusFilter = val; this.renderTable(); },

  viewDetail(sid) {
    const s = DB.getSupplier(sid);
    if (!s) return;
    const prods = DB.products.filter(p => p.supId === sid);
    const movs = DB.movements.filter(m => m.supId === sid);
    openModal(`Detalle Proveedor — ${s.name}`, `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      ${[
        ['Empresa', s.name, 'fa-building'],
        ['Contacto', s.contact, 'fa-user'],
        ['Email', s.email, 'fa-envelope'],
        ['Teléfono', s.phone, 'fa-phone'],
        ['RUC', s.ruc, 'fa-id-card'],
        ['Dirección', s.address, 'fa-location-dot'],
        ['Condición Pago', s.terms, 'fa-calendar-check'],
        ['Estado', s.status==='active'?'Activo':'Inactivo', 'fa-circle'],
      ].map(([label,val,icon])=>`
      <div style="background:var(--bg);padding:12px;border-radius:var(--radius-sm)">
        <div style="font-size:10px;color:var(--text-3);font-weight:600;text-transform:uppercase;margin-bottom:4px"><i class="fas ${icon}"></i> ${label}</div>
        <div style="font-weight:600;font-size:13px">${val}</div>
      </div>`).join('')}
    </div>
    <h4 style="font-size:13px;font-weight:700;margin-bottom:10px">Productos Suministrados (${prods.length})</h4>
    <div style="max-height:200px;overflow-y:auto">
      <table style="font-size:12px"><thead><tr><th>Código</th><th>Producto</th><th>Stock</th><th>P. Compra</th></tr></thead>
      <tbody>
        ${prods.map(p=>`<tr><td><span class="badge badge-gray">${p.code}</span></td><td>${p.name}</td><td>${stockBadge(p.stock,p.minStock)}</td><td>${fmt(p.buyP)}</td></tr>`).join('')}
      </tbody></table>
    </div>
    ${movs.length>0?`<h4 style="font-size:13px;font-weight:700;margin:16px 0 10px">Últimas Entregas</h4>
    <div style="max-height:120px;overflow-y:auto">
      ${movs.slice(-4).reverse().map(m=>`
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span>${fmtDatetime(m.date)} — ${m.prodName}</span>
        <span class="badge badge-success">+${m.qty}</span>
      </div>`).join('')}
    </div>`:''}
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cerrar</button>
      <button class="btn btn-primary" onclick="closeModalDirect();SuppliersModule.openForm('${s.id}')">Editar</button>
    </div>`, 'modal-lg');
  },

  openForm(sid = null) {
    const s = sid ? DB.getSupplier(sid) : null;
    const termOptions = ['7 días','15 días','30 días','45 días','60 días','Contado'];
    openModal(s ? 'Editar Proveedor' : 'Nuevo Proveedor', `
    <form onsubmit="SuppliersModule.saveSupplier(event,'${sid||''}')">
      <div class="form-grid form-grid-2">
        <div class="form-group full">
          <label>Nombre de la Empresa</label>
          <input class="form-control" name="name" value="${s?s.name:''}" required placeholder="Empresa S.A." />
        </div>
        <div class="form-group">
          <label>Persona de Contacto</label>
          <input class="form-control" name="contact" value="${s?s.contact:''}" placeholder="Juan Pérez" />
        </div>
        <div class="form-group">
          <label>RUC</label>
          <input class="form-control" name="ruc" value="${s?s.ruc:''}" placeholder="0912345678001" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input class="form-control" name="email" type="email" value="${s?s.email:''}" placeholder="ventas@empresa.com" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input class="form-control" name="phone" value="${s?s.phone:''}" placeholder="042-000-000" />
        </div>
        <div class="form-group">
          <label>Condición de Pago</label>
          <select class="form-control" name="terms">
            ${termOptions.map(t=>`<option ${s&&s.terms===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select class="form-control" name="status">
            <option value="active" ${!s||s.status==='active'?'selected':''}>Activo</option>
            <option value="inactive" ${s&&s.status==='inactive'?'selected':''}>Inactivo</option>
          </select>
        </div>
        <div class="form-group">
          <label>Categorías Abastecidas</label>
          <select class="form-control" name="catId">
            ${DB.categories.map(c=>`<option value="${c.id}" ${s&&s.cats&&s.cats.includes(c.id)?'selected':''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group full">
          <label>Dirección</label>
          <input class="form-control" name="address" value="${s?s.address:''}" placeholder="Dirección de la empresa" />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>
      </div>
    </form>`, 'modal-lg');
  },

  saveSupplier(e, sid) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    data.cats = data.catId ? [data.catId] : [];
    delete data.catId;

    if (sid) {
      const s = DB.getSupplier(sid);
      Object.assign(s, data);
      showToast('Proveedor actualizado', 'success');
    } else {
      data.id = 'S' + String(DB.nextSupplierId).padStart(2,'0');
      DB.nextSupplierId++;
      DB.suppliers.push(data);
      showToast('Proveedor registrado', 'success');
    }
    closeModalDirect();
    this.renderTable();
  },

  deleteSupplier(sid) {
    const s = DB.getSupplier(sid);
    openConfirm('Eliminar Proveedor', `¿Eliminar a ${s.name}?`, () => {
      DB.suppliers = DB.suppliers.filter(sp => sp.id !== sid);
      showToast('Proveedor eliminado', 'success');
      this.renderTable();
    });
  },
};
