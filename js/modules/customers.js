/* =================================================================
   MODULE: Gestión de Clientes
   ================================================================= */

const CustomersModule = {
  search: '',
  typeFilter: 'all',
  sortDesc: false,

  render() {
    const vip = DB.customers.filter(c => c.type === 'vip').length;
    const frecuente = DB.customers.filter(c => c.type === 'frecuente').length;
    const totalSpent = DB.customers.reduce((s,c) => s+c.spent, 0);

    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Gestión de Clientes</h2>
        <p>${DB.customers.length} clientes registrados</p>
      </div>
      <button class="btn btn-primary" onclick="CustomersModule.openForm()">
        <i class="fas fa-user-plus"></i> Nuevo Cliente
      </button>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="stat-card" style="--stat-color:var(--primary)">
        <div class="stat-info"><div class="stat-label">Total Clientes</div><div class="stat-value">${DB.customers.length}</div><div class="stat-change up"><i class="fas fa-users"></i>Registrados</div></div>
        <div class="stat-icon" style="background:var(--primary-l)"><i class="fas fa-users" style="color:var(--primary)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--purple)">
        <div class="stat-info"><div class="stat-label">Clientes VIP</div><div class="stat-value">${vip}</div><div class="stat-change up"><i class="fas fa-crown"></i>Especiales</div></div>
        <div class="stat-icon" style="background:var(--purple-l)"><i class="fas fa-crown" style="color:var(--purple)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--warning)">
        <div class="stat-info"><div class="stat-label">Frecuentes</div><div class="stat-value">${frecuente}</div><div class="stat-change up"><i class="fas fa-star"></i>Leales</div></div>
        <div class="stat-icon" style="background:var(--warning-l)"><i class="fas fa-star" style="color:var(--warning)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--secondary)">
        <div class="stat-info"><div class="stat-label">Ingresos de Clientes</div><div class="stat-value">${fmt(totalSpent)}</div><div class="stat-change up"><i class="fas fa-dollar-sign"></i>Total histórico</div></div>
        <div class="stat-icon" style="background:var(--secondary-l)"><i class="fas fa-dollar-sign" style="color:var(--secondary)"></i></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-users"></i> Lista de Clientes</div>
        <div class="d-flex gap-8">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar por nombre, email..." oninput="CustomersModule.applySearch(this.value)" />
          </div>
          <button class="btn btn-sm btn-secondary sort-toggle-btn" id="sortToggleBtn"
            onclick="CustomersModule.toggleSort()"
            title="${this.sortDesc ? 'Más antiguo primero' : 'Más reciente primero'}">
            <i class="fas ${this.sortDesc ? 'fa-arrow-down-wide-short' : 'fa-arrow-up-wide-short'}"></i>
            <span class="sort-label">${this.sortDesc ? 'Más reciente' : 'Más antiguo'}</span>
          </button>
          <select class="filter-select" onchange="CustomersModule.applyType(this.value)">
            <option value="all">Todos los tipos</option>
            <option value="vip">VIP</option>
            <option value="frecuente">Frecuente</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table class="tbl-customers mobile-cards">
          <thead>
            <tr><th>Cliente</th><th>Contacto</th><th>RUC/CI</th><th>Tipo</th><th>Compras</th><th>Total Gastado</th><th>Puntos</th><th>Desde</th><th>Acciones</th></tr>
          </thead>
          <tbody id="custBody"></tbody>
        </table>
      </div>
    </div>`;
  },

  init() {
    this.search = '';
    this.typeFilter = 'all';
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
    let items = [...DB.customers];
    if (this.typeFilter !== 'all') items = items.filter(c => c.type === this.typeFilter);
    if (this.search) {
      const t = this.search.toLowerCase();
      items = items.filter(c => c.name.toLowerCase().includes(t) || c.email.toLowerCase().includes(t) || c.phone.includes(t) || c.ruc.includes(t));
    }
    if (this.sortDesc) items.reverse();
    return items;
  },

  renderTable() {
    const items = this.getFiltered();
    const tbody = document.getElementById('custBody');
    if (!tbody) return;
    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><i class="fas fa-users"></i><h4>Sin resultados</h4></div></td></tr>`;
      return;
    }
    const colors = ['#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#06b6d4','#f97316','#ec4899'];
    tbody.innerHTML = items.map((c,i) => {
      const initials = c.name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
      const color = colors[i % colors.length];
      return `
      <tr>
        <td data-label="Cliente">
          <div class="person-info">
            <div class="person-avatar" style="background:${color}">${initials}</div>
            <div><div class="person-name">${c.name}</div></div>
          </div>
        </td>
        <td data-label="Contacto">
          <div style="font-size:12px">${c.email||'—'}</div>
          <div style="font-size:11px;color:var(--text-3)">${c.phone||'—'}</div>
        </td>
        <td data-label="RUC/CI" style="font-size:12px">${c.ruc||'—'}</td>
        <td data-label="Tipo">${custTypeBadge(c.type)}</td>
        <td data-label="Compras"><span class="badge badge-gray">${c.purchases} compras</span></td>
        <td data-label="Total Gastado"><strong>${fmt(c.spent)}</strong></td>
        <td data-label="Puntos">
          <div style="display:flex;align-items:center;gap:6px">
            <i class="fas fa-star" style="color:var(--warning);font-size:11px"></i>
            <strong>${fmtNum(c.points)}</strong>
          </div>
        </td>
        <td data-label="Desde" style="font-size:12px">${fmtDate(c.since)}</td>
        <td data-label="Acciones">
          <div class="d-flex gap-8">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="CustomersModule.viewDetail('${c.id}')" title="Ver detalle"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-secondary btn-icon" onclick="CustomersModule.openForm('${c.id}')" title="Editar"><i class="fas fa-pen"></i></button>
            <button class="btn btn-sm btn-outline-danger btn-icon" onclick="CustomersModule.deleteCustomer('${c.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');
  },

  applySearch(val) { this.search = val; this.renderTable(); },
  applyType(val) { this.typeFilter = val; this.renderTable(); },

  viewDetail(cid) {
    const c = DB.getCustomer(cid);
    if (!c) return;
    const custSales = DB.sales.filter(s => s.custId === cid);
    const initials = c.name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
    openModal(`Perfil de Cliente — ${c.name}`, `
    <div style="text-align:center;margin-bottom:20px">
      <div class="person-avatar" style="background:#8b5cf6;width:64px;height:64px;font-size:22px;margin:0 auto 10px">${initials}</div>
      <h3>${c.name}</h3>
      ${custTypeBadge(c.type)}
    </div>
    <div class="form-grid form-grid-2" style="gap:12px;margin-bottom:16px">
      ${[
        ['Email', c.email||'—', 'fa-envelope'],
        ['Teléfono', c.phone||'—', 'fa-phone'],
        ['RUC/CI', c.ruc||'—', 'fa-id-card'],
        ['Cliente desde', fmtDate(c.since), 'fa-calendar'],
        ['Total compras', c.purchases + ' transacciones', 'fa-receipt'],
        ['Total gastado', fmt(c.spent), 'fa-dollar-sign'],
        ['Puntos acumulados', fmtNum(c.points) + ' pts', 'fa-star'],
        ['Dirección', c.address||'—', 'fa-location-dot'],
      ].map(([label,val,icon])=>`
      <div style="background:var(--bg);padding:12px;border-radius:var(--radius-sm)">
        <div style="font-size:10px;color:var(--text-3);font-weight:600;text-transform:uppercase;margin-bottom:4px"><i class="fas ${icon}"></i> ${label}</div>
        <div style="font-weight:600;font-size:13px">${val}</div>
      </div>`).join('')}
    </div>
    ${custSales.length > 0 ? `
    <h4 style="font-size:13px;font-weight:700;margin-bottom:10px">Historial de Compras</h4>
    <div style="max-height:180px;overflow-y:auto">
      ${custSales.slice(-6).reverse().map(s=>`
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div>
          <span class="badge badge-primary">${s.id}</span>
          <span style="margin-left:8px">${fmtDatetime(s.date)}</span>
        </div>
        <div>
          ${payBadge(s.method)}
          <strong style="margin-left:8px">${fmt(s.total)}</strong>
        </div>
      </div>`).join('')}
    </div>` : '<p style="text-align:center;color:var(--text-3);font-size:13px">Sin historial de compras</p>'}
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cerrar</button>
      <button class="btn btn-primary" onclick="closeModalDirect();CustomersModule.openForm('${c.id}')">Editar</button>
    </div>`, 'modal-lg');
  },

  openForm(cid = null) {
    const c = cid ? DB.getCustomer(cid) : null;
    openModal(c ? 'Editar Cliente' : 'Nuevo Cliente', `
    <form onsubmit="CustomersModule.saveCustomer(event,'${cid||''}')">
      <div class="form-grid form-grid-2">
        <div class="form-group full">
          <label>Nombre Completo</label>
          <input class="form-control" name="name" value="${c?c.name:''}" required placeholder="Nombre y apellidos" />
        </div>
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input class="form-control" name="email" type="email" value="${c?c.email:''}" placeholder="email@ejemplo.com" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input class="form-control" name="phone" value="${c?c.phone:''}" placeholder="0999-000-000" />
        </div>
        <div class="form-group">
          <label>RUC / Cédula</label>
          <input class="form-control" name="ruc" value="${c?c.ruc:''}" placeholder="0912345678" />
        </div>
        <div class="form-group">
          <label>Tipo de Cliente</label>
          <select class="form-control" name="type">
            <option value="normal" ${!c||c.type==='normal'?'selected':''}>Normal</option>
            <option value="frecuente" ${c&&c.type==='frecuente'?'selected':''}>Frecuente</option>
            <option value="vip" ${c&&c.type==='vip'?'selected':''}>VIP</option>
          </select>
        </div>
        <div class="form-group">
          <label>Puntos Iniciales</label>
          <input class="form-control" name="points" type="number" min="0" value="${c?c.points:0}" />
        </div>
        <div class="form-group full">
          <label>Dirección</label>
          <input class="form-control" name="address" value="${c?c.address:''}" placeholder="Calle, número, ciudad" />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>
      </div>
    </form>`, 'modal-lg');
  },

  saveCustomer(e, cid) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    data.points = parseInt(data.points)||0;
    data.purchases = 0;
    data.spent = 0;
    data.since = todayStr();

    if (cid) {
      const c = DB.getCustomer(cid);
      Object.assign(c, { name:data.name, email:data.email, phone:data.phone, ruc:data.ruc, type:data.type, points:data.points, address:data.address });
      showToast('Cliente actualizado', 'success');
    } else {
      data.id = 'CU' + String(DB.nextCustomerId).padStart(2,'0');
      DB.nextCustomerId++;
      DB.customers.push(data);
      showToast('Cliente registrado', 'success');
    }
    closeModalDirect();
    this.renderTable();
  },

  deleteCustomer(cid) {
    const c = DB.getCustomer(cid);
    openConfirm('Eliminar Cliente', `¿Eliminar a ${c.name}?`, () => {
      DB.customers = DB.customers.filter(cu => cu.id !== cid);
      showToast('Cliente eliminado', 'success');
      this.renderTable();
    });
  },
};
