/* =================================================================
   MODULE: Gestión de Inventario
   ================================================================= */

const InventoryModule = {
  page: 1,
  search: '',
  tab: 'stock',
  catFilter: 'all',

  render() {
    const lowStock = getLowStockItems();
    const outStock = getOutOfStockItems();
    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Gestión de Inventario</h2>
        <p>Control de stock y movimientos</p>
      </div>
      <div class="d-flex gap-8">
        <button class="btn btn-primary" onclick="InventoryModule.openMovement('entrada')">
          <i class="fas fa-arrow-down"></i> Entrada
        </button>
        <button class="btn btn-outline-danger" onclick="InventoryModule.openMovement('salida')">
          <i class="fas fa-arrow-up"></i> Salida
        </button>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--secondary)">
        <div class="stat-info">
          <div class="stat-label">Productos en Stock</div>
          <div class="stat-value">${DB.products.filter(p=>p.stock>p.minStock).length}</div>
          <div class="stat-change up"><i class="fas fa-circle-check"></i>Nivel óptimo</div>
        </div>
        <div class="stat-icon" style="background:var(--secondary-l)"><i class="fas fa-box-open" style="color:var(--secondary)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--warning)">
        <div class="stat-info">
          <div class="stat-label">Stock Bajo</div>
          <div class="stat-value">${lowStock.length}</div>
          <div class="stat-change down"><i class="fas fa-triangle-exclamation"></i>Requieren reposición</div>
        </div>
        <div class="stat-icon" style="background:var(--warning-l)"><i class="fas fa-triangle-exclamation" style="color:var(--warning)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--danger)">
        <div class="stat-info">
          <div class="stat-label">Sin Stock</div>
          <div class="stat-value">${outStock.length}</div>
          <div class="stat-change down"><i class="fas fa-circle-xmark"></i>Urgente</div>
        </div>
        <div class="stat-icon" style="background:var(--danger-l)"><i class="fas fa-circle-xmark" style="color:var(--danger)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--primary)">
        <div class="stat-info">
          <div class="stat-label">Valor del Inventario</div>
          <div class="stat-value">${fmt(DB.products.reduce((s,p)=>s+(p.stock*p.buyP),0))}</div>
          <div class="stat-change up"><i class="fas fa-dollar-sign"></i>Costo total</div>
        </div>
        <div class="stat-icon" style="background:var(--primary-l)"><i class="fas fa-dollar-sign" style="color:var(--primary)"></i></div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="report-tabs" style="margin-bottom:16px">
      <button class="report-tab active" id="tabStock" onclick="InventoryModule.switchTab('stock')">
        <i class="fas fa-warehouse"></i> Stock Actual
      </button>
      <button class="report-tab" id="tabAlerts" onclick="InventoryModule.switchTab('alerts')">
        <i class="fas fa-triangle-exclamation"></i> Alertas (${lowStock.length + outStock.length})
      </button>
      <button class="report-tab" id="tabMovements" onclick="InventoryModule.switchTab('movements')">
        <i class="fas fa-arrows-up-down"></i> Movimientos
      </button>
    </div>

    <!-- Tab content -->
    <div id="invTabContent"></div>`;
  },

  init() {
    this.tab = 'stock';
    this.page = 1;
    this.search = '';
    this.catFilter = 'all';
    this.renderTabContent();
  },

  setCat(catId) {
    this.catFilter = catId;
    this.page = 1;
    this.renderTabContent();
  },

  switchTab(tab) {
    this.tab = tab;
    this.page = 1;
    ['stock','alerts','movements'].forEach(t => {
      const el = document.getElementById('tab'+t.charAt(0).toUpperCase()+t.slice(1));
      if (el) el.classList.toggle('active', t===tab);
    });
    this.renderTabContent();
  },

  renderTabContent() {
    const el = document.getElementById('invTabContent');
    if (!el) return;
    if (this.tab === 'stock') el.innerHTML = this.renderStockTab();
    else if (this.tab === 'alerts') el.innerHTML = this.renderAlertsTab();
    else el.innerHTML = this.renderMovementsTab();
  },

  renderStockTab() {
    let items = [...DB.products];
    if (this.catFilter !== 'all') items = items.filter(p => p.catId === this.catFilter);
    if (this.search) {
      const t = this.search.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(t) || p.code.toLowerCase().includes(t));
    }
    const pag = paginate(items, this.page, 12);
    return `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-list"></i> Lista de Inventario</div>
        <div class="search-box" style="max-width:280px">
          <i class="fas fa-search"></i>
          <input type="text" value="${this.search}" placeholder="Buscar producto..." oninput="InventoryModule.searchStock(this.value)" />
        </div>
      </div>
      <div class="card-body" style="padding:12px 20px 4px">
        <div class="chip-bar">
          <button class="chip ${this.catFilter==='all'?'chip-active':''}" onclick="InventoryModule.setCat('all')">
            <i class="fas fa-th-large"></i> Todos <span class="chip-count">${DB.products.length}</span>
          </button>
          ${DB.categories.map(c => {
            const cnt = DB.products.filter(p=>p.catId===c.id).length;
            return `<button class="chip ${this.catFilter===c.id?'chip-active':''}" onclick="InventoryModule.setCat('${c.id}')">
              <i class="fas ${c.icon}" style="${this.catFilter===c.id?'':'color:'+c.color}"></i> ${c.name}
              <span class="chip-count">${cnt}</span>
            </button>`;
          }).join('')}
        </div>
      </div>
      <div class="table-wrap">
        <table class="tbl-stock">
          <thead>
            <tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Stock Actual</th><th>Stock Mín.</th><th>Estado</th><th>P. Compra</th><th>Valor</th><th>Ajustar</th></tr>
          </thead>
          <tbody>
            ${pag.items.map(p=>{
              const cat = DB.getCat(p.catId);
              const val = (p.stock*p.buyP).toFixed(2);
              const pct = Math.min(100, Math.round(p.stock/Math.max(p.minStock*3,1)*100));
              const color = p.stock<=0?'var(--danger)':p.stock<=p.minStock?'var(--warning)':'var(--secondary)';
              return `<tr>
                <td><span class="badge badge-gray">${p.code}</span></td>
                <td>
                  <div class="product-cell">
                    ${prodIcon(p.catId)}
                    <span style="font-weight:600">${p.name}</span>
                  </div>
                </td>
                <td><span style="font-size:12px;color:var(--text-2)">${cat?cat.name:'—'}</span></td>
                <td>
                  <div class="stock-bar-wrap" style="width:100px">
                    <div class="stock-bar"><div class="stock-bar-fill" style="width:${pct}%;background:${color}"></div></div>
                    <div class="stock-val"><strong>${p.stock}</strong> ${p.unit}</div>
                  </div>
                </td>
                <td>${p.minStock} ${p.unit}</td>
                <td>${stockBadge(p.stock, p.minStock)}</td>
                <td>${fmt(p.buyP)}</td>
                <td><strong>${fmt(val)}</strong></td>
                <td>
                  <div class="d-flex gap-8">
                    <button class="btn btn-sm btn-success btn-icon" onclick="InventoryModule.quickAdjust('${p.id}','+')" title="Agregar"><i class="fas fa-plus"></i></button>
                    <button class="btn btn-sm btn-outline-danger btn-icon" onclick="InventoryModule.quickAdjust('${p.id}','-')" title="Reducir"><i class="fas fa-minus"></i></button>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      ${paginationHTML(pag,'InventoryModule.goPage')}
    </div>`;
  },

  renderAlertsTab() {
    const low = getLowStockItems();
    const out = getOutOfStockItems();
    return `
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title" style="color:var(--danger)"><i class="fas fa-circle-xmark"></i> Sin Stock (${out.length})</div></div>
        <div class="card-body">
          ${out.length===0
            ? '<div class="empty-state"><i class="fas fa-circle-check" style="color:var(--secondary)"></i><h4>¡Sin agotados!</h4></div>'
            : `<div class="alert-list">
              ${out.map(p=>`<div class="alert-item">
                ${prodIcon(p.catId)}
                <div style="flex:1"><div class="alert-name">${p.name}</div><div style="font-size:11px">${p.code}</div></div>
                <button class="btn btn-sm btn-primary" onclick="InventoryModule.openMovement('entrada','${p.id}')"><i class="fas fa-arrow-down"></i> Reponer</button>
              </div>`).join('')}
            </div>`}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title" style="color:var(--warning)"><i class="fas fa-triangle-exclamation"></i> Stock Bajo (${low.length})</div></div>
        <div class="card-body">
          ${low.length===0
            ? '<div class="empty-state"><i class="fas fa-circle-check" style="color:var(--secondary)"></i><h4>Stock en buen nivel</h4></div>'
            : `<div class="alert-list">
              ${low.map(p=>`<div class="alert-item" style="border-color:var(--warning);background:var(--warning-l)">
                ${prodIcon(p.catId)}
                <div style="flex:1"><div class="alert-name">${p.name}</div><div style="font-size:11px">${p.stock} de mín. ${p.minStock}</div></div>
                <button class="btn btn-sm btn-warning" onclick="InventoryModule.openMovement('entrada','${p.id}')"><i class="fas fa-arrow-down"></i> Reponer</button>
              </div>`).join('')}
            </div>`}
        </div>
      </div>
    </div>`;
  },

  renderMovementsTab() {
    const movs = [...DB.movements].reverse();
    return `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-arrows-up-down"></i> Historial de Movimientos</div>
        <div class="d-flex gap-8">
          <button class="btn btn-sm btn-primary" onclick="InventoryModule.openMovement('entrada')"><i class="fas fa-plus"></i> Nueva Entrada</button>
          <button class="btn btn-sm btn-outline-danger" onclick="InventoryModule.openMovement('salida')"><i class="fas fa-minus"></i> Nueva Salida</button>
        </div>
      </div>
      <div class="table-wrap">
        <table class="tbl-movements">
          <thead>
            <tr><th>#</th><th>Fecha</th><th>Tipo</th><th>Producto</th><th>Cantidad</th><th>Motivo</th><th>Proveedor</th><th>Responsable</th></tr>
          </thead>
          <tbody>
            ${movs.map(m=>{
              const typeBadge = m.type==='entrada'
                ? `<span class="badge badge-success"><i class="fas fa-arrow-down"></i>Entrada</span>`
                : m.type==='salida'
                ? `<span class="badge badge-danger"><i class="fas fa-arrow-up"></i>Salida</span>`
                : `<span class="badge badge-warning"><i class="fas fa-rotate"></i>Ajuste</span>`;
              const sup = m.supId ? DB.getSupplier(m.supId) : null;
              return `<tr>
                <td><span class="badge badge-gray">${m.id}</span></td>
                <td style="white-space:nowrap">${fmtDatetime(m.date)}</td>
                <td>${typeBadge}</td>
                <td style="font-weight:600">${m.prodName}</td>
                <td><strong style="color:${m.qty>0?'var(--secondary)':'var(--danger)'}">${m.qty>0?'+':''}${m.qty}</strong></td>
                <td style="font-size:12px">${m.reason}</td>
                <td style="font-size:12px">${sup?sup.name:'—'}</td>
                <td style="font-size:12px">${m.workName}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  },

  searchStock(val) {
    this.search = val; this.page = 1;
    document.getElementById('invTabContent').innerHTML = this.renderStockTab();
  },

  goPage(p) { InventoryModule.page = p; InventoryModule.renderTabContent(); },

  quickAdjust(prodId, dir) {
    const p = DB.getProd(prodId);
    if (!p) return;
    const label = dir==='+' ? 'Cantidad a agregar' : 'Cantidad a reducir';
    openModal(`Ajuste de Stock — ${p.name}`, `
    <div style="text-align:center;margin-bottom:16px">
      ${prodIcon(p.catId,'lg')}
      <h3 style="margin-top:12px">${p.name}</h3>
      <p style="color:var(--text-2)">Stock actual: <strong>${p.stock} ${p.unit}</strong></p>
    </div>
    <div class="form-group">
      <label>${label}</label>
      <input class="form-control" type="number" min="1" id="adjustQty" value="1" />
    </div>
    <div class="form-group">
      <label>Motivo</label>
      <input class="form-control" id="adjustReason" placeholder="Ej: Reposición, Merma..." />
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
      <button class="btn btn-primary" onclick="InventoryModule.applyAdjust('${prodId}','${dir}')">
        <i class="fas fa-check"></i> Aplicar
      </button>
    </div>`, 'modal-sm');
  },

  applyAdjust(prodId, dir) {
    const p = DB.getProd(prodId);
    const qty = parseInt(document.getElementById('adjustQty').value)||1;
    const reason = document.getElementById('adjustReason').value || 'Ajuste manual';
    const delta = dir==='+' ? qty : -qty;
    if (dir==='-' && qty > p.stock) { showToast('No hay suficiente stock', 'error'); return; }
    p.stock += delta;
    DB.movements.push({
      id:'MOV'+String(DB.nextMovId).padStart(3,'0'),
      date: nowStr(), type:'ajuste',
      prodId, prodName:p.name, qty:delta,
      reason, supId:null, workId:'W01', workName:'Carlos Mendoza'
    });
    DB.nextMovId++;
    closeModalDirect();
    showToast(`Stock actualizado: ${p.name} = ${p.stock}`, 'success');
    this.renderTabContent();
  },

  openMovement(type, preselProdId = '') {
    openModal(`Registrar ${type==='entrada'?'Entrada':'Salida'} de Inventario`, `
    <form onsubmit="InventoryModule.saveMovement(event,'${type}')">
      <div class="form-grid form-grid-2">
        <div class="form-group full">
          <label>Producto</label>
          <select class="form-control" name="prodId" required>
            <option value="">Seleccionar producto...</option>
            ${DB.products.map(p=>`<option value="${p.id}" ${p.id===preselProdId?'selected':''}>${p.name} (Stock: ${p.stock})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Cantidad</label>
          <input class="form-control" name="qty" type="number" min="1" value="1" required />
        </div>
        <div class="form-group">
          <label>Fecha</label>
          <input class="form-control" name="date" type="date" value="${todayStr()}" required />
        </div>
        ${type==='entrada'?`<div class="form-group full">
          <label>Proveedor</label>
          <select class="form-control" name="supId">
            <option value="">Sin proveedor</option>
            ${DB.suppliers.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>`:''}
        <div class="form-group full">
          <label>Motivo</label>
          <input class="form-control" name="reason" placeholder="${type==='entrada'?'Ej: Pedido semanal, Reposición...':'Ej: Vencimiento, Merma, Devolución...'}" required />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Registrar</button>
      </div>
    </form>`, 'modal-lg');
  },

  saveMovement(e, type) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    const p = DB.getProd(data.prodId);
    if (!p) { showToast('Producto no válido', 'error'); return; }
    const qty = parseInt(data.qty);
    if (type==='salida' && qty > p.stock) { showToast('Stock insuficiente', 'error'); return; }

    const delta = type==='entrada' ? qty : -qty;
    p.stock += delta;

    DB.movements.push({
      id:'MOV'+String(DB.nextMovId).padStart(3,'0'),
      date: data.date + ' ' + new Date().toTimeString().slice(0,5),
      type, prodId:data.prodId, prodName:p.name,
      qty:delta, reason:data.reason,
      supId:data.supId||null, workId:'W01', workName:'Carlos Mendoza'
    });
    DB.nextMovId++;
    closeModalDirect();
    showToast(`Movimiento registrado: ${type==='entrada'?'+':'-'}${qty} ${p.unit} de ${p.name}`, 'success');
    this.renderTabContent();
  },
};
