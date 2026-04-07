/* =================================================================
   MODULE: Órdenes de Compra
   ================================================================= */

const PurchasesModule = {
  page: 1,
  search: '',
  statusFilter: 'all',
  sortDesc: true,

  render() {
    const total    = DB.purchases.reduce((a,p) => a + p.total, 0);
    const pending  = DB.purchases.filter(p => p.status === 'pending').length;
    const sent     = DB.purchases.filter(p => p.status === 'sent').length;
    const received = DB.purchases.filter(p => p.status === 'received').length;

    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Órdenes de Compra</h2>
        <p>${DB.purchases.length} órdenes registradas</p>
      </div>
      <button class="btn btn-primary" onclick="PurchasesModule.openForm()">
        <i class="fas fa-plus"></i> Nueva Orden
      </button>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="stat-card" style="--stat-color:var(--primary)">
        <div class="stat-info"><div class="stat-label">Total Compras</div><div class="stat-value">${fmt(total)}</div><div class="stat-change up"><i class="fas fa-cart-flatbed"></i>${DB.purchases.length} órdenes</div></div>
        <div class="stat-icon" style="background:var(--primary-l)"><i class="fas fa-dollar-sign" style="color:var(--primary)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--warning)">
        <div class="stat-info"><div class="stat-label">Pendientes</div><div class="stat-value">${pending}</div><div class="stat-change"><i class="fas fa-clock"></i>por enviar</div></div>
        <div class="stat-icon" style="background:var(--warning-l)"><i class="fas fa-hourglass-half" style="color:var(--warning)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--cyan)">
        <div class="stat-info"><div class="stat-label">Enviadas</div><div class="stat-value">${sent}</div><div class="stat-change up"><i class="fas fa-truck"></i>en camino</div></div>
        <div class="stat-icon" style="background:var(--cyan-l)"><i class="fas fa-truck" style="color:var(--cyan)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--secondary)">
        <div class="stat-info"><div class="stat-label">Recibidas</div><div class="stat-value">${received}</div><div class="stat-change up"><i class="fas fa-circle-check"></i>completadas</div></div>
        <div class="stat-icon" style="background:var(--secondary-l)"><i class="fas fa-circle-check" style="color:var(--secondary)"></i></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-cart-flatbed"></i> Listado de Órdenes</div>
        <div class="d-flex gap-8">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar por ID, proveedor..." oninput="PurchasesModule.applySearch(this.value)" />
          </div>
          <button class="btn btn-sm btn-secondary sort-toggle-btn" id="sortToggleBtn"
            onclick="PurchasesModule.toggleSort()"
            title="${this.sortDesc ? 'Más antiguo primero' : 'Más reciente primero'}">
            <i class="fas ${this.sortDesc ? 'fa-arrow-down-wide-short' : 'fa-arrow-up-wide-short'}"></i>
            <span class="sort-label">${this.sortDesc ? 'Más reciente' : 'Más antiguo'}</span>
          </button>
          <select class="filter-select" onchange="PurchasesModule.applyStatus(this.value)">
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="sent">Enviada</option>
            <option value="received">Recibida</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table class="tbl-purchases mobile-cards">
          <thead>
            <tr><th>ID</th><th>Fecha</th><th>Proveedor</th><th>Responsable</th><th>Ítems</th><th>Total</th><th>Fecha Esperada</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody id="purchasesBody"></tbody>
        </table>
      </div>
      <div id="purchasesPagination"></div>
    </div>`;
  },

  init() {
    this.page = 1;
    this.search = '';
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
    let items = [...DB.purchases];
    if (this.statusFilter !== 'all') items = items.filter(p => p.status === this.statusFilter);
    if (this.search) {
      const t = this.search.toLowerCase();
      items = items.filter(p => p.id.toLowerCase().includes(t) || p.supName.toLowerCase().includes(t) || p.workName.toLowerCase().includes(t));
    }
    if (this.sortDesc) items.reverse();
    return items;
  },

  renderTable() {
    const filtered = this.getFiltered();
    const pag      = paginate(filtered, this.page, 10);
    const tbody    = document.getElementById('purchasesBody');
    const pagEl    = document.getElementById('purchasesPagination');
    if (!tbody) return;

    if (pag.items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><i class="fas fa-cart-flatbed"></i><h4>Sin órdenes</h4><p>No se encontraron órdenes de compra</p></div></td></tr>`;
      if (pagEl) pagEl.innerHTML = '';
      return;
    }

    const statusInfo = {
      pending:  ['badge-warning', 'fa-hourglass-half', 'Pendiente'],
      sent:     ['badge-primary', 'fa-truck',          'Enviada'],
      received: ['badge-success', 'fa-circle-check',   'Recibida'],
    };

    tbody.innerHTML = pag.items.map(p => {
      const [cls, icon, label] = statusInfo[p.status] || ['badge-gray','fa-question','Otro'];
      return `
      <tr>
        <td data-label="ID"><span class="badge badge-primary">${p.id}</span></td>
        <td data-label="Fecha" style="font-size:12px">${fmtDate(p.date)}</td>
        <td data-label="Proveedor">
          <div style="font-size:13px;font-weight:600">${p.supName}</div>
        </td>
        <td data-label="Responsable" style="font-size:12px">${p.workName}</td>
        <td data-label="Ítems"><span class="badge badge-gray">${p.items.length} ítem${p.items.length!==1?'s':''}</span></td>
        <td data-label="Total"><strong>${fmt(p.total)}</strong></td>
        <td data-label="F. Esperada" style="font-size:12px">${fmtDate(p.expectedDate)}</td>
        <td data-label="Estado"><span class="badge ${cls}"><i class="fas ${icon}"></i>${label}</span></td>
        <td data-label="Acciones">
          <div class="d-flex gap-8">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="PurchasesModule.viewDetail('${p.id}')" title="Ver detalle"><i class="fas fa-eye"></i></button>
            ${p.status !== 'received' ? `<button class="btn btn-sm btn-outline-primary btn-icon" onclick="PurchasesModule.markReceived('${p.id}')" title="Marcar recibida"><i class="fas fa-circle-check"></i></button>` : ''}
            ${p.status === 'pending' ? `<button class="btn btn-sm btn-outline-danger btn-icon" onclick="PurchasesModule.deleteOrder('${p.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>` : ''}
          </div>
        </td>
      </tr>`;
    }).join('');

    if (pagEl) pagEl.innerHTML = paginationHTML(pag, 'PurchasesModule.goPage');
  },

  applySearch(val) { this.search = val; this.page = 1; this.renderTable(); },
  applyStatus(val) { this.statusFilter = val; this.page = 1; this.renderTable(); },
  goPage(p) { PurchasesModule.page = p; PurchasesModule.renderTable(); },

  viewDetail(pid) {
    const p = DB.purchases.find(x => x.id === pid);
    if (!p) return;
    const statusInfo = {pending:['badge-warning','fa-hourglass-half','Pendiente'],sent:['badge-primary','fa-truck','Enviada'],received:['badge-success','fa-circle-check','Recibida']};
    const [cls,icon,label] = statusInfo[p.status] || ['badge-gray','fa-question','Otro'];
    openModal(`Orden de Compra — ${p.id}`, `
    <div class="form-grid form-grid-2" style="margin-bottom:16px">
      ${[
        ['Número', p.id, 'fa-hashtag'],
        ['Fecha', fmtDate(p.date), 'fa-calendar'],
        ['Proveedor', p.supName, 'fa-truck'],
        ['Responsable', p.workName, 'fa-user-tie'],
        ['Fecha Esperada', fmtDate(p.expectedDate), 'fa-calendar-check'],
        ['Fecha Recibida', p.receivedDate ? fmtDate(p.receivedDate) : '—', 'fa-circle-check'],
      ].map(([lbl,val,ico]) => `
      <div style="background:var(--bg);padding:10px 12px;border-radius:var(--radius-sm)">
        <div style="font-size:10px;color:var(--text-3);font-weight:600;text-transform:uppercase;margin-bottom:3px"><i class="fas ${ico}"></i> ${lbl}</div>
        <div style="font-weight:600;font-size:13px">${val}</div>
      </div>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <h4 style="font-size:13px;font-weight:700">Productos</h4>
      <span class="badge ${cls}"><i class="fas ${icon}"></i>${label}</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Producto</th><th>Cantidad</th><th>Costo Unitario</th><th>Subtotal</th></tr></thead>
        <tbody>
          ${p.items.map(item => `
          <tr>
            <td>${item.prodName}</td>
            <td><span class="badge badge-gray">${item.qty}</span></td>
            <td>${fmt(item.unitCost)}</td>
            <td><strong>${fmt(item.sub)}</strong></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="margin-top:16px;padding:14px;background:var(--bg);border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:700">TOTAL ORDEN:</span>
      <span style="font-size:18px;font-weight:800;color:var(--primary)">${fmt(p.total)}</span>
    </div>
    ${p.notes ? `<div style="margin-top:10px;padding:10px 12px;background:var(--bg);border-radius:var(--radius-sm);font-size:13px"><i class="fas fa-note-sticky" style="color:var(--text-3)"></i> ${p.notes}</div>` : ''}
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cerrar</button>
      ${p.status !== 'received' ? `<button class="btn btn-primary" onclick="closeModalDirect();PurchasesModule.markReceived('${p.id}')"><i class="fas fa-circle-check"></i> Marcar Recibida</button>` : ''}
    </div>`, 'modal-lg');
  },

  markReceived(pid) {
    const p = DB.purchases.find(x => x.id === pid);
    if (!p || p.status === 'received') return;
    openConfirm('Marcar como Recibida', `¿Confirmar recepción de la orden ${pid}? Se actualizará el inventario.`, () => {
      p.status = 'received';
      p.receivedDate = todayStr();
      // Update inventory
      p.items.forEach(item => {
        const prod = DB.getProd(item.prodId);
        if (prod) prod.stock += item.qty;
      });
      // Add inventory movements
      p.items.forEach(item => {
        const movId = 'MOV' + String(DB.nextMovId).padStart(3,'0');
        DB.nextMovId++;
        DB.movements.push({
          id: movId, date: nowStr(), type: 'entrada',
          prodId: item.prodId, prodName: item.prodName,
          qty: item.qty, reason: `Orden de compra ${pid}`,
          supId: p.supId, workId: p.workId, workName: p.workName,
        });
      });
      showToast(`Orden ${pid} recibida — Inventario actualizado`, 'success');
      this.renderTable();
    });
  },

  deleteOrder(pid) {
    const p = DB.purchases.find(x => x.id === pid);
    if (!p) return;
    openConfirm('Eliminar Orden', `¿Eliminar la orden ${pid}?`, () => {
      DB.purchases = DB.purchases.filter(x => x.id !== pid);
      showToast('Orden eliminada', 'success');
      this.renderTable();
    });
  },

  openForm() {
    const suppliers = DB.suppliers.filter(s => s.status === 'active');
    const workers   = DB.workers.filter(w => w.status === 'active');
    openModal('Nueva Orden de Compra', `
    <form onsubmit="PurchasesModule.saveOrder(event)">
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label>Proveedor</label>
          <select class="form-control" name="supId" required onchange="PurchasesModule.loadSupplierProducts(this.value)">
            <option value="">Seleccionar proveedor...</option>
            ${suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Responsable</label>
          <select class="form-control" name="workId" required>
            ${workers.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Fecha Esperada</label>
          <input class="form-control" name="expectedDate" type="date" value="${todayStr()}" required />
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select class="form-control" name="status">
            <option value="pending">Pendiente</option>
            <option value="sent">Enviada</option>
          </select>
        </div>
        <div class="form-group full">
          <label>Notas</label>
          <input class="form-control" name="notes" placeholder="Observaciones..." />
        </div>
      </div>

      <h4 style="font-size:13px;font-weight:700;margin:14px 0 10px">Agregar Productos</h4>
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:flex-end;margin-bottom:10px">
        <select class="form-control" id="ocProdSelect">
          <option value="">Seleccionar producto...</option>
          ${DB.products.map(p => `<option value="${p.id}" data-cost="${p.buyP}">${p.name} — Costo: ${fmt(p.buyP)}</option>`).join('')}
        </select>
        <input class="form-control" type="number" min="1" value="1" id="ocQty" placeholder="Cantidad" style="width:90px" />
        <input class="form-control" type="number" min="0" step="0.01" id="ocCost" placeholder="Costo" style="width:100px" />
        <button type="button" class="btn btn-primary" onclick="PurchasesModule.addItem()"><i class="fas fa-plus"></i></button>
      </div>
      <div id="ocItemsList" style="margin-bottom:14px"></div>
      <input type="hidden" name="itemsJson" id="ocItemsJson" value="[]" />

      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:var(--bg);border-radius:var(--radius)">
        <span style="font-weight:700">Total Orden:</span>
        <span style="font-size:18px;font-weight:800;color:var(--primary)" id="ocTotal">$0.00</span>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Crear Orden</button>
      </div>
    </form>`, 'modal-lg');

    // auto-fill cost when product selected
    document.getElementById('ocProdSelect').addEventListener('change', function() {
      const opt = this.options[this.selectedIndex];
      const cost = opt.dataset.cost || '';
      document.getElementById('ocCost').value = cost;
    });

    PurchasesModule._ocItems = [];
    PurchasesModule._renderOcItems();
  },

  _ocItems: [],

  addItem() {
    const sel  = document.getElementById('ocProdSelect');
    const qty  = parseInt(document.getElementById('ocQty').value) || 0;
    const cost = parseFloat(document.getElementById('ocCost').value) || 0;
    const prodId = sel.value;
    if (!prodId || qty <= 0 || cost <= 0) { showToast('Selecciona producto, cantidad y costo', 'warning'); return; }
    const prod = DB.getProd(prodId);
    if (!prod) return;

    const existing = this._ocItems.find(i => i.prodId === prodId);
    if (existing) { existing.qty += qty; existing.sub = +(existing.qty * existing.unitCost).toFixed(2); }
    else          { this._ocItems.push({ prodId, prodName: prod.name, qty, unitCost: cost, sub: +(qty * cost).toFixed(2) }); }
    this._renderOcItems();
  },

  removeOcItem(idx) {
    this._ocItems.splice(idx, 1);
    this._renderOcItems();
  },

  _renderOcItems() {
    const el = document.getElementById('ocItemsList');
    const totalEl = document.getElementById('ocTotal');
    const jsonEl  = document.getElementById('ocItemsJson');
    if (!el) return;
    if (this._ocItems.length === 0) {
      el.innerHTML = `<div style="text-align:center;color:var(--text-3);font-size:13px;padding:10px">Sin productos agregados</div>`;
    } else {
      el.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Producto</th><th>Cant.</th><th>Costo Unit.</th><th>Subtotal</th><th></th></tr></thead><tbody>
        ${this._ocItems.map((item,i) => `<tr>
          <td>${item.prodName}</td>
          <td>${item.qty}</td>
          <td>${fmt(item.unitCost)}</td>
          <td><strong>${fmt(item.sub)}</strong></td>
          <td><button type="button" class="btn btn-sm btn-outline-danger btn-icon" onclick="PurchasesModule.removeOcItem(${i})"><i class="fas fa-trash"></i></button></td>
        </tr>`).join('')}
      </tbody></table></div>`;
    }
    const total = this._ocItems.reduce((a,i) => a + i.sub, 0);
    if (totalEl) totalEl.textContent = fmt(+total.toFixed(2));
    if (jsonEl)  jsonEl.value = JSON.stringify(this._ocItems);
  },

  saveOrder(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const items = JSON.parse(fd.get('itemsJson') || '[]');
    if (items.length === 0) { showToast('Agrega al menos un producto', 'warning'); return; }

    const supId  = fd.get('supId');
    const workId = fd.get('workId');
    const sup    = DB.getSupplier(supId);
    const work   = DB.getWorker(workId);

    const subtotal = items.reduce((a,i) => a + i.sub, 0);
    const id = 'OC' + String(DB.nextPurchaseId).padStart(3,'0');
    DB.nextPurchaseId++;

    DB.purchases.push({
      id, date: todayStr(),
      supId, supName: sup ? sup.name : '',
      workId, workName: work ? work.name : '',
      items, subtotal: +subtotal.toFixed(2), tax: 0, total: +subtotal.toFixed(2),
      status: fd.get('status'),
      expectedDate: fd.get('expectedDate'),
      receivedDate: null,
      notes: fd.get('notes'),
    });

    closeModalDirect();
    showToast(`Orden ${id} creada correctamente`, 'success');
    this.renderTable();
  },
};
