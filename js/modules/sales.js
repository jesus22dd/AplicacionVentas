/* =================================================================
   MODULE: Historial de Ventas
   ================================================================= */

const SalesModule = {
  page: 1,
  search: '',
  methodFilter: 'all',
  workerFilter: 'all',
  dateFrom: '',
  dateTo: '',

  render() {
    const total = salesTotal(DB.sales);
    const avgSale = DB.sales.length > 0 ? total / DB.sales.length : 0;
    const efectivo = DB.sales.filter(s=>s.method==='efectivo').length;
    const tarjeta  = DB.sales.filter(s=>s.method==='tarjeta').length;
    const qrDel    = DB.sales.filter(s=>s.method==='qr'||s.method==='delivery').length;

    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Historial de Ventas</h2>
        <p>${DB.sales.length} ventas registradas</p>
      </div>
      <div class="d-flex gap-8">
        <button class="btn btn-primary" onclick="navigate('pos')"><i class="fas fa-plus"></i> Nueva Venta</button>
        <button class="btn btn-secondary" onclick="SalesModule.exportCSV()"><i class="fas fa-download"></i> Exportar</button>
      </div>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin-bottom:20px">
      <div class="stat-card" style="--stat-color:var(--primary)">
        <div class="stat-info"><div class="stat-label">Total Ventas</div><div class="stat-value">${fmt(total)}</div><div class="stat-change up"><i class="fas fa-receipt"></i>${DB.sales.length} transacciones</div></div>
        <div class="stat-icon" style="background:var(--primary-l)"><i class="fas fa-dollar-sign" style="color:var(--primary)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--secondary)">
        <div class="stat-info"><div class="stat-label">Efectivo</div><div class="stat-value">${efectivo}</div><div class="stat-change up"><i class="fas fa-money-bill-wave"></i>transacciones</div></div>
        <div class="stat-icon" style="background:var(--secondary-l)"><i class="fas fa-money-bill-wave" style="color:var(--secondary)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--purple)">
        <div class="stat-info"><div class="stat-label">Tarjeta</div><div class="stat-value">${tarjeta}</div><div class="stat-change up"><i class="fas fa-credit-card"></i>transacciones</div></div>
        <div class="stat-icon" style="background:var(--purple-l)"><i class="fas fa-credit-card" style="color:var(--purple)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--warning)">
        <div class="stat-info"><div class="stat-label">QR / Delivery</div><div class="stat-value">${qrDel}</div><div class="stat-change up"><i class="fas fa-qrcode"></i>transacciones</div></div>
        <div class="stat-icon" style="background:#fef9c3"><i class="fas fa-qrcode" style="color:var(--warning)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--cyan)">
        <div class="stat-info"><div class="stat-label">Ticket Promedio</div><div class="stat-value">${fmt(avgSale)}</div><div class="stat-change up"><i class="fas fa-chart-line"></i>por venta</div></div>
        <div class="stat-icon" style="background:var(--cyan-l)"><i class="fas fa-chart-line" style="color:var(--cyan)"></i></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-receipt"></i> Registro de Ventas</div>
      </div>
      <div class="card-body" style="padding:14px 20px">
        <div class="filter-bar">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar por ID, cliente, cajero..." oninput="SalesModule.applySearch(this.value)" />
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <i class="fas fa-calendar" style="color:var(--text-3)"></i>
            <input type="date" class="filter-select" id="salesDateFrom" onchange="SalesModule.applyDate()" style="padding:8px 10px" />
            <span style="color:var(--text-3)">—</span>
            <input type="date" class="filter-select" id="salesDateTo" onchange="SalesModule.applyDate()" style="padding:8px 10px" />
          </div>
          <select class="filter-select" onchange="SalesModule.applyMethod(this.value)">
            <option value="all">Todos los métodos</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="qr">QR</option>
            <option value="delivery">Delivery</option>
          </select>
          <select class="filter-select" id="salesWorkerFilter" onchange="SalesModule.applyWorker(this.value)">
            <option value="all">Todos los cajeros</option>
            ${DB.workers.filter(w=>w.status==='active').map(w=>`<option value="${w.id}">${w.name}</option>`).join('')}
          </select>
          <button class="btn btn-sm btn-secondary" onclick="SalesModule.clearFilters()"><i class="fas fa-xmark"></i> Limpiar</button>
        </div>
      </div>
      <div class="table-wrap">
        <table class="tbl-sales mobile-cards">
          <thead>
            <tr><th>#</th><th>Fecha/Hora</th><th>Cliente</th><th>Cajero</th><th>Ítems</th><th>Subtotal</th><th>Descuento</th><th>Total</th><th>Método</th><th>Acción</th></tr>
          </thead>
          <tbody id="salesBody"></tbody>
        </table>
      </div>
      <div id="salesPagination"></div>
    </div>`;
  },

  init() {
    this.page = 1;
    this.search = '';
    this.methodFilter = 'all';
    this.workerFilter = 'all';
    this.dateFrom = '';
    this.dateTo = '';
    this.renderTable();
  },

  getFiltered() {
    let items = [...DB.sales].reverse();
    if (this.search) {
      const t = this.search.toLowerCase();
      items = items.filter(s => s.id.toLowerCase().includes(t) || s.custName.toLowerCase().includes(t) || s.workName.toLowerCase().includes(t));
    }
    if (this.methodFilter !== 'all') items = items.filter(s => s.method === this.methodFilter);
    if (this.workerFilter !== 'all') items = items.filter(s => s.workId === this.workerFilter);
    if (this.dateFrom) items = items.filter(s => s.date >= this.dateFrom);
    if (this.dateTo)   items = items.filter(s => s.date <= this.dateTo + ' 23:59');
    return items;
  },

  renderTable() {
    const filtered = this.getFiltered();
    const pag = paginate(filtered, this.page, 12);
    const tbody = document.getElementById('salesBody');
    const pagEl = document.getElementById('salesPagination');
    if (!tbody) return;

    if (pag.items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state"><i class="fas fa-receipt"></i><h4>Sin ventas</h4><p>No se encontraron registros</p></div></td></tr>`;
      if (pagEl) pagEl.innerHTML = '';
      return;
    }

    tbody.innerHTML = pag.items.map(s => {
      const discAmt = +(s.subtotal * (s.discount||0) / 100).toFixed(2);
      const w = DB.workers.find(x => x.id === s.workId);
      const workerCell = w
        ? `<div style="display:flex;align-items:center;gap:6px">
            <div style="width:26px;height:26px;border-radius:50%;background:${w.color};color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${w.avatar}</div>
            <span style="font-size:12px">${w.name}</span>
           </div>`
        : `<span style="font-size:12px">${s.workName}</span>`;
      return `
      <tr>
        <td data-label="#"><span class="badge badge-primary">${s.id}</span></td>
        <td data-label="Fecha" style="white-space:nowrap;font-size:12px">${fmtDatetime(s.date)}</td>
        <td data-label="Cliente">
          <div style="font-size:13px;font-weight:600">${s.custName}</div>
        </td>
        <td data-label="Cajero">${workerCell}</td>
        <td data-label="Ítems"><span class="badge badge-gray">${s.items.length} ítem${s.items.length!==1?'s':''}</span></td>
        <td data-label="Subtotal">${fmt(s.subtotal)}</td>
        <td data-label="Descuento">${discAmt>0?`<span style="color:var(--danger)">-${fmt(discAmt)} (${s.discount}%)</span>`:'—'}</td>
        <td data-label="Total"><strong style="font-size:14px">${fmt(s.total)}</strong></td>
        <td data-label="Método">${payBadge(s.method)}</td>
        <td data-label="Acción">
          <div class="d-flex gap-8">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="SalesModule.showDetail('${s.id}')" title="Ver detalle"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-outline-primary btn-icon" onclick="SalesModule.printSale('${s.id}')" title="Imprimir"><i class="fas fa-print"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');

    if (pagEl) pagEl.innerHTML = paginationHTML(pag, 'SalesModule.goPage');
  },

  applySearch(val) { this.search = val; this.page = 1; this.renderTable(); },
  applyMethod(val) { this.methodFilter = val; this.page = 1; this.renderTable(); },
  applyWorker(val) { this.workerFilter = val; this.page = 1; this.renderTable(); },
  applyDate() {
    this.dateFrom = document.getElementById('salesDateFrom')?.value || '';
    this.dateTo   = document.getElementById('salesDateTo')?.value || '';
    this.page = 1;
    this.renderTable();
  },
  clearFilters() {
    this.search = '';
    this.methodFilter = 'all';
    this.workerFilter = 'all';
    this.dateFrom = '';
    this.dateTo = '';
    this.page = 1;
    const sf = document.getElementById('salesDateFrom');
    const st = document.getElementById('salesDateTo');
    const sw = document.getElementById('salesWorkerFilter');
    if (sf) sf.value = '';
    if (st) st.value = '';
    if (sw) sw.value = 'all';
    this.renderTable();
  },
  goPage(p) { SalesModule.page = p; SalesModule.renderTable(); },

  showDetail(saleId) {
    const s = DB.sales.find(sl => sl.id === saleId);
    if (!s) return;
    const discAmt = +(s.subtotal * (s.discount||0) / 100).toFixed(2);
    openModal(`Detalle de Venta — ${s.id}`, `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${[
        ['Número', s.id, 'fa-hashtag'],
        ['Fecha', fmtDatetime(s.date), 'fa-calendar'],
        ['Cliente', s.custName, 'fa-user'],
        ['Cajero', s.workName, 'fa-user-tie'],
        ['Método de Pago', s.method.toUpperCase(), 'fa-credit-card'],
        ['Estado', 'Completada', 'fa-circle-check'],
      ].map(([label,val,icon])=>`
      <div style="background:var(--bg);padding:10px 12px;border-radius:var(--radius-sm)">
        <div style="font-size:10px;color:var(--text-3);font-weight:600;text-transform:uppercase;margin-bottom:3px"><i class="fas ${icon}"></i> ${label}</div>
        <div style="font-weight:600;font-size:13px">${val}</div>
      </div>`).join('')}
    </div>
    <h4 style="font-size:13px;font-weight:700;margin-bottom:10px">Productos Vendidos</h4>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Producto</th><th>Cantidad</th><th>P. Unitario</th><th>Subtotal</th></tr></thead>
        <tbody>
          ${s.items.map(item=>`
          <tr>
            <td>${item.name}</td>
            <td><span class="badge badge-gray">${item.qty}</span></td>
            <td>${fmt(item.price)}</td>
            <td><strong>${fmt(item.subtotal)}</strong></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="margin-top:16px;padding:16px;background:var(--bg);border-radius:var(--radius)">
      <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>Subtotal:</span><span>${fmt(s.subtotal)}</span></div>
      ${discAmt>0?`<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:var(--danger)"><span>Descuento (${s.discount}%):</span><span>-${fmt(discAmt)}</span></div>`:''}
      <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>IVA (12%):</span><span>${fmt(s.tax)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;padding-top:8px;border-top:2px solid var(--border);margin-top:6px"><span>TOTAL:</span><span style="color:var(--primary)">${fmt(s.total)}</span></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cerrar</button>
      <button class="btn btn-primary" onclick="closeModalDirect();SalesModule.printSale('${s.id}')"><i class="fas fa-print"></i> Ver Recibo</button>
      <button class="btn btn-success" onclick="closeModalDirect();SalesModule.downloadPDF('${s.id}')"><i class="fas fa-file-pdf"></i> PDF</button>
    </div>`, 'modal-lg');
  },

  printSale(saleId) {
    const s = DB.sales.find(sl => sl.id === saleId);
    if (!s) return;
    POSModule.lastSale = s;
    POSModule.showReceipt(s);
  },

  downloadPDF(saleId) {
    const s = DB.sales.find(sl => sl.id === saleId);
    if (!s) return;
    POSModule.lastSale = s;
    downloadReceiptPDF();
  },

  exportCSV() {
    const filtered = this.getFiltered();
    const rows = [['ID','Fecha','Cliente','Cajero','Ítems','Subtotal','Descuento%','IVA','Total','Método']];
    filtered.forEach(s => rows.push([s.id, s.date, s.custName, s.workName, s.items.length, s.subtotal, s.discount||0, s.tax, s.total, s.method]));
    const csv = rows.map(r=>r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `ventas-${todayStr()}.csv`;
    a.click();
    showToast('Exportación CSV descargada', 'success');
  },
};
