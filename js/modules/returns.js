/* =================================================================
   MODULE: Devoluciones
   ================================================================= */

const ReturnsModule = {
  page: 1,
  search: '',
  statusFilter: 'all',

  render() {
    const totalReturned = DB.returns.reduce((a,r) => a + r.total, 0);
    const restock = DB.returns.filter(r => r.restock).length;
    const processed = DB.returns.filter(r => r.status === 'processed').length;

    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Devoluciones</h2>
        <p>${DB.returns.length} devoluciones registradas</p>
      </div>
      <button class="btn btn-primary" onclick="ReturnsModule.openForm()">
        <i class="fas fa-rotate-left"></i> Nueva Devolución
      </button>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="stat-card" style="--stat-color:var(--danger)">
        <div class="stat-info"><div class="stat-label">Total Devuelto</div><div class="stat-value">${fmt(totalReturned)}</div><div class="stat-change"><i class="fas fa-rotate-left"></i>${DB.returns.length} devoluciones</div></div>
        <div class="stat-icon" style="background:var(--danger-l)"><i class="fas fa-dollar-sign" style="color:var(--danger)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--secondary)">
        <div class="stat-info"><div class="stat-label">Procesadas</div><div class="stat-value">${processed}</div><div class="stat-change up"><i class="fas fa-circle-check"></i>completadas</div></div>
        <div class="stat-icon" style="background:var(--secondary-l)"><i class="fas fa-circle-check" style="color:var(--secondary)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--cyan)">
        <div class="stat-info"><div class="stat-label">Reingresadas</div><div class="stat-value">${restock}</div><div class="stat-change up"><i class="fas fa-boxes-stacked"></i>al inventario</div></div>
        <div class="stat-icon" style="background:var(--cyan-l)"><i class="fas fa-boxes-stacked" style="color:var(--cyan)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--purple)">
        <div class="stat-info"><div class="stat-label">Promedio</div><div class="stat-value">${DB.returns.length > 0 ? fmt(totalReturned/DB.returns.length) : '$0.00'}</div><div class="stat-change up"><i class="fas fa-chart-line"></i>por devolución</div></div>
        <div class="stat-icon" style="background:var(--purple-l)"><i class="fas fa-chart-line" style="color:var(--purple)"></i></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-rotate-left"></i> Registro de Devoluciones</div>
        <div class="d-flex gap-8">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar por ID, cliente, venta..." oninput="ReturnsModule.applySearch(this.value)" />
          </div>
          <select class="filter-select" onchange="ReturnsModule.applyStatus(this.value)">
            <option value="all">Todos los estados</option>
            <option value="processed">Procesadas</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table class="tbl-returns mobile-cards">
          <thead>
            <tr><th>ID</th><th>Fecha</th><th>Venta Orig.</th><th>Cliente</th><th>Cajero</th><th>Ítems</th><th>Total</th><th>Reembolso</th><th>Reingresar</th><th>Estado</th><th>Acción</th></tr>
          </thead>
          <tbody id="returnsBody"></tbody>
        </table>
      </div>
      <div id="returnsPagination"></div>
    </div>`;
  },

  init() {
    this.page = 1;
    this.search = '';
    this.statusFilter = 'all';
    this.renderTable();
  },

  getFiltered() {
    let items = [...DB.returns].reverse();
    if (this.statusFilter !== 'all') items = items.filter(r => r.status === this.statusFilter);
    if (this.search) {
      const t = this.search.toLowerCase();
      items = items.filter(r =>
        r.id.toLowerCase().includes(t) ||
        r.custName.toLowerCase().includes(t) ||
        r.saleId.toLowerCase().includes(t) ||
        r.workName.toLowerCase().includes(t)
      );
    }
    return items;
  },

  renderTable() {
    const filtered = this.getFiltered();
    const pag      = paginate(filtered, this.page, 10);
    const tbody    = document.getElementById('returnsBody');
    const pagEl    = document.getElementById('returnsPagination');
    if (!tbody) return;

    if (pag.items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="11"><div class="empty-state"><i class="fas fa-rotate-left"></i><h4>Sin devoluciones</h4><p>No se encontraron registros</p></div></td></tr>`;
      if (pagEl) pagEl.innerHTML = '';
      return;
    }

    tbody.innerHTML = pag.items.map(r => `
    <tr>
      <td data-label="ID"><span class="badge badge-danger">${r.id}</span></td>
      <td data-label="Fecha" style="font-size:12px">${fmtDatetime(r.date)}</td>
      <td data-label="Venta Orig."><span class="badge badge-primary">${r.saleId}</span></td>
      <td data-label="Cliente" style="font-size:13px;font-weight:600">${r.custName}</td>
      <td data-label="Cajero" style="font-size:12px">${r.workName}</td>
      <td data-label="Ítems"><span class="badge badge-gray">${r.items.length} ítem${r.items.length!==1?'s':''}</span></td>
      <td data-label="Total"><strong style="color:var(--danger)">${fmt(r.total)}</strong></td>
      <td data-label="Reembolso">${payBadge(r.refundMethod)}</td>
      <td data-label="Reingresar">${r.restock
        ? `<span class="badge badge-success"><i class="fas fa-circle-check"></i>Sí</span>`
        : `<span class="badge badge-gray"><i class="fas fa-circle-xmark"></i>No</span>`}</td>
      <td data-label="Estado">${r.status === 'processed'
        ? `<span class="badge badge-success"><i class="fas fa-circle-check"></i>Procesada</span>`
        : `<span class="badge badge-warning"><i class="fas fa-clock"></i>Pendiente</span>`}</td>
      <td data-label="Acción">
        <button class="btn btn-sm btn-secondary btn-icon" onclick="ReturnsModule.viewDetail('${r.id}')" title="Ver detalle"><i class="fas fa-eye"></i></button>
      </td>
    </tr>`).join('');

    if (pagEl) pagEl.innerHTML = paginationHTML(pag, 'ReturnsModule.goPage');
  },

  applySearch(val) { this.search = val; this.page = 1; this.renderTable(); },
  applyStatus(val) { this.statusFilter = val; this.page = 1; this.renderTable(); },
  goPage(p) { ReturnsModule.page = p; ReturnsModule.renderTable(); },

  viewDetail(rid) {
    const r = DB.returns.find(x => x.id === rid);
    if (!r) return;
    openModal(`Devolución — ${r.id}`, `
    <div class="form-grid form-grid-2" style="margin-bottom:16px">
      ${[
        ['ID Devolución', r.id, 'fa-hashtag'],
        ['Venta Original', r.saleId, 'fa-receipt'],
        ['Fecha', fmtDatetime(r.date), 'fa-calendar'],
        ['Cliente', r.custName, 'fa-user'],
        ['Cajero', r.workName, 'fa-user-tie'],
        ['Método Reembolso', r.refundMethod.toUpperCase(), 'fa-credit-card'],
        ['Reingresar Stock', r.restock ? 'Sí' : 'No', 'fa-boxes-stacked'],
        ['Estado', r.status === 'processed' ? 'Procesada' : 'Pendiente', 'fa-circle-check'],
      ].map(([lbl,val,ico]) => `
      <div style="background:var(--bg);padding:10px 12px;border-radius:var(--radius-sm)">
        <div style="font-size:10px;color:var(--text-3);font-weight:600;text-transform:uppercase;margin-bottom:3px"><i class="fas ${ico}"></i> ${lbl}</div>
        <div style="font-weight:600;font-size:13px">${val}</div>
      </div>`).join('')}
    </div>
    <h4 style="font-size:13px;font-weight:700;margin-bottom:10px">Productos Devueltos</h4>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th>Motivo</th></tr></thead>
        <tbody>
          ${r.items.map(item => `
          <tr>
            <td>${item.prodName}</td>
            <td><span class="badge badge-gray">${item.qty}</span></td>
            <td>${fmt(item.price)}</td>
            <td><strong>${fmt(item.sub)}</strong></td>
            <td><span style="font-size:11px;color:var(--text-2)">${item.reason}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="margin-top:16px;padding:14px;background:var(--danger-l);border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:700">TOTAL REEMBOLSADO:</span>
      <span style="font-size:18px;font-weight:800;color:var(--danger)">${fmt(r.total)}</span>
    </div>
    ${r.notes ? `<div style="margin-top:10px;padding:10px 12px;background:var(--bg);border-radius:var(--radius-sm);font-size:13px"><i class="fas fa-note-sticky" style="color:var(--text-3)"></i> ${r.notes}</div>` : ''}
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cerrar</button>
    </div>`, 'modal-lg');
  },

  openForm() {
    const sales    = [...DB.sales].reverse().slice(0, 50);
    const workers  = DB.workers.filter(w => w.status === 'active');
    const reasons  = ['Producto vencido','Producto en mal estado','Empaque dañado','Producto incorrecto','Cambio de decisión','Defecto de fábrica','Otro'];

    openModal('Nueva Devolución', `
    <form onsubmit="ReturnsModule.saveReturn(event)">
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label>Venta Original</label>
          <select class="form-control" name="saleId" required onchange="ReturnsModule.loadSaleItems(this.value)">
            <option value="">Seleccionar venta...</option>
            ${sales.map(s => `<option value="${s.id}">${s.id} — ${s.custName} — ${fmt(s.total)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Cajero Responsable</label>
          <select class="form-control" name="workId" required>
            ${workers.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Método de Reembolso</label>
          <select class="form-control" name="refundMethod">
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div class="form-group">
          <label>Reingresar al Inventario</label>
          <select class="form-control" name="restock">
            <option value="1">Sí — producto en buen estado</option>
            <option value="0">No — producto deteriorado</option>
          </select>
        </div>
        <div class="form-group full">
          <label>Notas</label>
          <input class="form-control" name="notes" placeholder="Observaciones de la devolución..." />
        </div>
      </div>

      <h4 style="font-size:13px;font-weight:700;margin:14px 0 10px">Agregar Producto a Devolver</h4>
      <div id="devSaleItems" style="margin-bottom:10px;color:var(--text-3);font-size:13px">Selecciona una venta para ver los productos.</div>
      <div id="devItemsChooser" style="display:none;margin-bottom:10px">
        <div style="display:grid;grid-template-columns:1fr auto auto auto auto;gap:8px;align-items:end">
          <select class="form-control" id="devProdSelect">
            <option value="">Seleccionar producto...</option>
          </select>
          <input class="form-control" type="number" min="1" value="1" id="devQty" placeholder="Cant." style="width:80px" />
          <select class="form-control" id="devReason" style="width:180px">
            ${reasons.map(r => `<option>${r}</option>`).join('')}
          </select>
          <button type="button" class="btn btn-primary" onclick="ReturnsModule.addDevItem()"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <div id="devItemsList" style="margin-bottom:14px"></div>
      <input type="hidden" name="itemsJson" id="devItemsJson" value="[]" />
      <input type="hidden" name="custId" id="devCustId" value="" />
      <input type="hidden" name="custName" id="devCustName" value="" />

      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:var(--danger-l);border-radius:var(--radius)">
        <span style="font-weight:700">Total Devolución:</span>
        <span style="font-size:18px;font-weight:800;color:var(--danger)" id="devTotal">$0.00</span>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-danger"><i class="fas fa-rotate-left"></i> Registrar Devolución</button>
      </div>
    </form>`, 'modal-lg');

    ReturnsModule._devItems = [];
    ReturnsModule._devSaleItems = [];
    ReturnsModule._renderDevItems();
  },

  _devItems: [],
  _devSaleItems: [],

  loadSaleItems(saleId) {
    const sale = DB.sales.find(s => s.id === saleId);
    const infoEl   = document.getElementById('devSaleItems');
    const chooser  = document.getElementById('devItemsChooser');
    const custId   = document.getElementById('devCustId');
    const custName = document.getElementById('devCustName');

    if (!sale) {
      infoEl.innerHTML = 'Selecciona una venta para ver los productos.';
      infoEl.style.color = 'var(--text-3)';
      chooser.style.display = 'none';
      return;
    }

    custId.value   = sale.custId;
    custName.value = sale.custName;
    this._devSaleItems = sale.items;
    this._devItems = [];
    this._renderDevItems();

    infoEl.innerHTML = `<span style="color:var(--text-2)">Cliente: <strong>${sale.custName}</strong> — Venta: <strong>${fmt(sale.total)}</strong></span>`;
    chooser.style.display = 'block';

    const sel = document.getElementById('devProdSelect');
    sel.innerHTML = `<option value="">Seleccionar producto...</option>` +
      sale.items.map(i => `<option value="${i.pid}" data-price="${i.price}" data-name="${i.name}" data-qty="${i.qty}">${i.name} (máx: ${i.qty})</option>`).join('');
  },

  addDevItem() {
    const sel = document.getElementById('devProdSelect');
    const qty = parseInt(document.getElementById('devQty').value) || 0;
    const reason = document.getElementById('devReason').value;
    const opt = sel.options[sel.selectedIndex];
    if (!sel.value || qty <= 0) { showToast('Selecciona producto y cantidad', 'warning'); return; }
    const maxQty = parseInt(opt.dataset.qty) || 999;
    if (qty > maxQty) { showToast(`Máximo ${maxQty} unidades`, 'warning'); return; }
    const price = parseFloat(opt.dataset.price) || 0;
    const existing = this._devItems.find(i => i.prodId === sel.value);
    if (existing) { existing.qty = Math.min(existing.qty + qty, maxQty); existing.sub = +(existing.qty * existing.price).toFixed(2); }
    else { this._devItems.push({ prodId: sel.value, prodName: opt.dataset.name, qty, price, sub: +(qty*price).toFixed(2), reason }); }
    this._renderDevItems();
  },

  removeDevItem(idx) {
    this._devItems.splice(idx, 1);
    this._renderDevItems();
  },

  _renderDevItems() {
    const el      = document.getElementById('devItemsList');
    const totalEl = document.getElementById('devTotal');
    const jsonEl  = document.getElementById('devItemsJson');
    if (!el) return;
    if (this._devItems.length === 0) {
      el.innerHTML = `<div style="text-align:center;color:var(--text-3);font-size:13px;padding:10px">Sin productos agregados</div>`;
    } else {
      el.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th>Motivo</th><th></th></tr></thead><tbody>
        ${this._devItems.map((item,i) => `<tr>
          <td>${item.prodName}</td>
          <td>${item.qty}</td>
          <td>${fmt(item.price)}</td>
          <td><strong style="color:var(--danger)">${fmt(item.sub)}</strong></td>
          <td style="font-size:11px">${item.reason}</td>
          <td><button type="button" class="btn btn-sm btn-outline-danger btn-icon" onclick="ReturnsModule.removeDevItem(${i})"><i class="fas fa-trash"></i></button></td>
        </tr>`).join('')}
      </tbody></table></div>`;
    }
    const total = this._devItems.reduce((a,i) => a + i.sub, 0);
    if (totalEl) totalEl.textContent = fmt(+total.toFixed(2));
    if (jsonEl)  jsonEl.value = JSON.stringify(this._devItems);
  },

  saveReturn(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const items = JSON.parse(fd.get('itemsJson') || '[]');
    if (items.length === 0) { showToast('Agrega al menos un producto a devolver', 'warning'); return; }

    const saleId = fd.get('saleId');
    const workId = fd.get('workId');
    const worker = DB.getWorker(workId);
    const restock = fd.get('restock') === '1';

    const total = +items.reduce((a,i) => a + i.sub, 0).toFixed(2);
    const id = 'DEV' + String(DB.nextReturnId).padStart(3,'0');
    DB.nextReturnId++;

    // Update inventory if restock
    if (restock) {
      items.forEach(item => {
        const prod = DB.getProd(item.prodId);
        if (prod) prod.stock += item.qty;
      });
    }

    DB.returns.push({
      id, date: nowStr(), saleId,
      custId: fd.get('custId'),
      custName: fd.get('custName'),
      workId, workName: worker ? worker.name : '',
      items, total,
      refundMethod: fd.get('refundMethod'),
      restock,
      status: 'processed',
      notes: fd.get('notes'),
    });

    closeModalDirect();
    showToast(`Devolución ${id} registrada`, 'success');
    this.renderTable();
  },
};
