/* =================================================================
   MODULE: Cotizaciones
   ================================================================= */

const QuotationsModule = {
  _page: 1,
  _filter: 'all',
  _search: '',
  _qfItems: [],
  _qfClient: null,
  _editId: null,

  render() {
    const counts = { all: DB.quotations.length };
    ['pending','accepted','rejected','expired'].forEach(s => {
      counts[s] = DB.quotations.filter(q => q.status === s).length;
    });
    const statusNames = { pending:'Pendiente', accepted:'Aceptada', rejected:'Rechazada', expired:'Vencida' };
    const chips = ['all','pending','accepted','rejected','expired'].map(s => `
      <button class="chip${this._filter===s?' chip-active':''}" onclick="QuotationsModule.setFilter('${s}')">
        ${s==='all'?'Todas':statusNames[s]}
        <span class="chip-count">${counts[s]||0}</span>
      </button>`).join('');

    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Cotizaciones</h2>
        <p>Propuestas comerciales y presupuestos para clientes</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="QuotationsModule.showForm()">
          <i class="fas fa-plus"></i> Nueva Cotización
        </button>
      </div>
    </div>

    <div class="chip-bar" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      ${chips}
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-file-invoice"></i> Lista de Cotizaciones</div>
        <div>
          <input class="form-control" style="width:220px" placeholder="Buscar cliente o ID..."
            value="${this._search}" oninput="QuotationsModule._liveSearch(this.value)" />
        </div>
      </div>
      <div class="card-body" id="quotTableBody">${this._renderRows()}</div>
    </div>`;
  },

  init() {},

  setFilter(f) {
    this._filter = f; this._page = 1;
    document.querySelectorAll('.chip-bar .chip').forEach((c, i) => {
      const filters = ['all','pending','accepted','rejected','expired'];
      c.classList.toggle('chip-active', filters[i] === f);
    });
    const el = document.getElementById('quotTableBody');
    if (el) el.innerHTML = this._renderRows();
  },

  _liveSearch(v) {
    this._search = v; this._page = 1;
    const el = document.getElementById('quotTableBody');
    if (el) el.innerHTML = this._renderRows();
  },

  setPage(p) {
    this._page = p;
    const el = document.getElementById('quotTableBody');
    if (el) el.innerHTML = this._renderRows();
  },

  _filtered() {
    let list = [...DB.quotations].reverse();
    if (this._filter !== 'all') list = list.filter(q => q.status === this._filter);
    if (this._search) {
      const s = this._search.toLowerCase();
      list = list.filter(q =>
        q.clientData.name.toLowerCase().includes(s) ||
        q.id.toLowerCase().includes(s) ||
        (q.number||'').toLowerCase().includes(s)
      );
    }
    return list;
  },

  _renderRows() {
    const list = this._filtered();
    if (!list.length) return `<div class="empty-state"><i class="fas fa-file-invoice"></i><h4>Sin cotizaciones</h4><p>Crea tu primera cotización</p></div>`;
    const pag = paginate(list, this._page, 10);
    const sMap = {
      pending:  ['badge-warning','Pendiente'],
      accepted: ['badge-success','Aceptada'],
      rejected: ['badge-danger', 'Rechazada'],
      expired:  ['badge-gray',   'Vencida'],
    };
    const rows = pag.items.map(q => {
      const [cls, lbl] = sMap[q.status] || ['badge-gray','?'];
      const worker = DB.workers.find(w => w.id === q.createdBy);
      return `<tr>
        <td data-label="ID"><strong>${q.id}</strong><br/><span style="font-size:11px;color:var(--text-3)">${q.number||''}</span></td>
        <td data-label="Cliente">
          <div style="font-weight:600">${q.clientData.name}</div>
          <div style="font-size:11px;color:var(--text-3)">${q.clientData.phone||'—'}</div>
        </td>
        <td data-label="Fecha">${fmtDate(q.createdAt)}</td>
        <td data-label="Válido hasta">${fmtDate(q.validUntil)}</td>
        <td data-label="Items">${q.items.length} artículos</td>
        <td data-label="Total">
          <div style="font-weight:700">${DB.config.currencySymbol||'Bs.'} ${q.totalBs.toFixed(2)}</div>
          <div style="font-size:11px;color:var(--text-3)">$${q.total.toFixed(2)} USD</div>
        </td>
        <td data-label="Estado"><span class="badge ${cls}">${lbl}</span></td>
        <td data-label="Acciones">
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <button class="btn btn-sm btn-secondary" title="Ver" onclick="QuotationsModule.viewDetails('${q.id}')"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-primary" title="PDF" onclick="QuotationsModule.generatePDF('${q.id}')"><i class="fas fa-file-pdf"></i></button>
            <button class="btn btn-sm btn-success" title="WhatsApp" onclick="QuotationsModule.sendWhatsApp('${q.id}')"><i class="fab fa-whatsapp"></i></button>
            ${q.status==='pending'?`
            <button class="btn btn-sm btn-outline-success" title="Aceptar" onclick="QuotationsModule.changeStatus('${q.id}','accepted')"><i class="fas fa-check"></i></button>
            <button class="btn btn-sm btn-outline-danger" title="Rechazar" onclick="QuotationsModule.changeStatus('${q.id}','rejected')"><i class="fas fa-xmark"></i></button>`:''}
            <button class="btn btn-sm btn-outline-danger" title="Eliminar" onclick="QuotationsModule.deleteQuote('${q.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');

    return `<div class="table-responsive"><table class="table tbl-quotations mobile-cards">
      <thead><tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Válido hasta</th><th>Items</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${paginationHTML(pag,'QuotationsModule.setPage')}`;
  },

  /* ---- FORM ---- */
  showForm(id = null) {
    this._editId = id;
    const q = id ? DB.quotations.find(x => x.id === id) : null;
    this._qfItems = q ? q.items.map(i => ({...i})) : [];
    this._qfClient = q ? { ...q.clientData, id: q.clientId } : null;

    const html = `
    <div style="display:flex;flex-direction:column;gap:16px">

      <div class="card" style="padding:16px">
        <div style="font-weight:700;margin-bottom:10px;font-size:14px"><i class="fas fa-user"></i> Cliente</div>
        <div style="position:relative">
          <input class="form-control" id="qfClientSearch" placeholder="Buscar por nombre, CI o teléfono..."
            oninput="QuotationsModule._searchClient(this.value)"
            value="${q ? q.clientData.name : ''}" autocomplete="off" />
          <div id="qfClientSug" style="display:none;position:absolute;top:calc(100% + 2px);left:0;right:0;
            background:#fff;border:1px solid var(--border);border-radius:var(--radius);
            box-shadow:0 4px 20px rgba(0,0,0,.1);z-index:200;max-height:180px;overflow-y:auto"></div>
        </div>
        <div id="qfClientCard" style="margin-top:10px">${q ? this._clientCardHtml(q.clientData) : ''}</div>
        <input type="hidden" id="qfClientId" value="${q ? (q.clientId||'') : ''}" />
      </div>

      <div class="card" style="padding:16px">
        <div style="font-weight:700;margin-bottom:10px;font-size:14px"><i class="fas fa-boxes-stacked"></i> Productos</div>
        <div style="position:relative;margin-bottom:12px">
          <input class="form-control" id="qfProdSearch" placeholder="Buscar producto por nombre o código..."
            oninput="QuotationsModule._searchProduct(this.value)" autocomplete="off" />
          <div id="qfProdSug" style="display:none;position:absolute;top:calc(100% + 2px);left:0;right:0;
            background:#fff;border:1px solid var(--border);border-radius:var(--radius);
            box-shadow:0 4px 20px rgba(0,0,0,.1);z-index:200;max-height:220px;overflow-y:auto"></div>
        </div>
        <div id="qfItemsList"></div>
      </div>

      <div class="form-grid form-grid-2" style="grid-template-columns:1fr 260px">
        <div class="card" style="padding:16px">
          <div style="font-weight:700;margin-bottom:10px;font-size:14px"><i class="fas fa-sliders"></i> Configuración</div>
          <div class="form-grid form-grid-2">
            <div class="form-group">
              <label>Validez</label>
              <select class="form-control" id="qfValidDays">
                ${[7,15,30,60,90].map(d=>`<option value="${d}" ${(q?.validDays||30)===d?'selected':''}>${d} días</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Descuento Global (%)</label>
              <input type="number" class="form-control" id="qfGlobalDisc" min="0" max="100" step="0.5"
                value="${q?.globalDiscount||0}" oninput="QuotationsModule._recalc()" />
            </div>
          </div>
          <div class="form-group">
            <label>Notas / Observaciones</label>
            <textarea class="form-control" id="qfNotes" rows="3">${q?.notes||''}</textarea>
          </div>
        </div>
        <div class="card" style="padding:16px">
          <div style="font-weight:700;margin-bottom:12px;font-size:14px"><i class="fas fa-calculator"></i> Resumen</div>
          <div id="qfTotalsBox"></div>
        </div>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button class="btn btn-primary" onclick="QuotationsModule.saveQuote()">
          <i class="fas fa-save"></i> ${id ? 'Actualizar' : 'Crear'} Cotización
        </button>
      </div>
    </div>`;

    openModal(id ? `Editar Cotización ${id}` : 'Nueva Cotización', html, 'modal-xl');
    setTimeout(() => { this._renderQfItems(); this._recalc(); }, 50);
  },

  _clientCardHtml(cd) {
    if (!cd) return '';
    return `<div style="background:var(--bg-2);border-radius:var(--radius);padding:10px;font-size:13px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-weight:700">${cd.name}</div>
        <div style="color:var(--text-2);margin-top:2px">CI: ${cd.ci||'—'} · ${cd.phone||'—'} · ${cd.email||'—'}</div>
      </div>
      <button class="btn btn-sm btn-outline-danger" onclick="QuotationsModule._clearClient()"><i class="fas fa-xmark"></i></button>
    </div>`;
  },

  _clearClient() {
    this._qfClient = null;
    const card = document.getElementById('qfClientCard');
    if (card) card.innerHTML = '';
    const inp = document.getElementById('qfClientSearch');
    if (inp) { inp.value = ''; inp.focus(); }
    const cid = document.getElementById('qfClientId');
    if (cid) cid.value = '';
  },

  _searchClient(val) {
    const sug = document.getElementById('qfClientSug');
    if (!sug) return;
    if (!val || val.length < 1) { sug.style.display = 'none'; return; }
    const v = val.toLowerCase();
    const matches = DB.customers.filter(c =>
      c.name.toLowerCase().includes(v) || (c.ci||'').includes(v) || (c.phone||'').includes(v)
    ).slice(0, 8);

    const safeVal = val.replace(/'/g, "\\'");
    if (!matches.length) {
      sug.innerHTML = `<div style="padding:10px 12px;font-size:13px;color:var(--text-3)">
        Sin resultados. <a href="#" onclick="event.preventDefault();QuotationsModule._createClientInline('${safeVal}')">+ Crear "${val}"</a></div>`;
    } else {
      sug.innerHTML = matches.map(c => `
        <div style="padding:10px 12px;cursor:pointer;border-bottom:1px solid var(--border);font-size:13px"
          onmousedown="event.preventDefault();QuotationsModule._selectClient('${c.id}')">
          <strong>${c.name}</strong>
          <span style="color:var(--text-2);margin-left:8px">CI: ${c.ci||'—'} · ${c.phone||'—'}</span>
        </div>`).join('') + `
        <div style="padding:8px 12px;font-size:12px;color:var(--primary);cursor:pointer"
          onmousedown="event.preventDefault();QuotationsModule._createClientInline('${safeVal}')">
          + Crear nuevo cliente
        </div>`;
    }
    sug.style.display = 'block';
  },

  _selectClient(id) {
    const c = DB.getCustomer(id);
    if (!c) return;
    this._qfClient = { id: c.id, name: c.name, ci: c.ci||'', phone: c.phone||'', email: c.email||'', address: c.address||'' };
    const el = document.getElementById('qfClientCard');
    if (el) el.innerHTML = this._clientCardHtml(this._qfClient);
    const inp = document.getElementById('qfClientSearch');
    if (inp) inp.value = c.name;
    const cid = document.getElementById('qfClientId');
    if (cid) cid.value = c.id;
    const sug = document.getElementById('qfClientSug');
    if (sug) sug.style.display = 'none';
  },

  _createClientInline(name) {
    const sug = document.getElementById('qfClientSug');
    if (sug) sug.style.display = 'none';
    const card = document.getElementById('qfClientCard');
    if (!card) return;
    card.innerHTML = `
      <div style="background:var(--bg-2);border-radius:var(--radius);padding:12px">
        <div style="font-size:12px;font-weight:700;color:var(--primary);margin-bottom:8px"><i class="fas fa-user-plus"></i> Nuevo Cliente</div>
        <div class="form-grid form-grid-2">
          <div class="form-group"><label style="font-size:11px">Nombre *</label><input class="form-control" id="qfNcName" value="${name}" /></div>
          <div class="form-group"><label style="font-size:11px">CI</label><input class="form-control" id="qfNcCi" placeholder="12345678" /></div>
          <div class="form-group"><label style="font-size:11px">Teléfono</label><input class="form-control" id="qfNcPhone" placeholder="+591 7x-xxx-xxx" /></div>
          <div class="form-group"><label style="font-size:11px">Email</label><input class="form-control" id="qfNcEmail" placeholder="correo@ejemplo.com" /></div>
        </div>
        <button class="btn btn-sm btn-primary" onclick="QuotationsModule._confirmNewClient()"><i class="fas fa-check"></i> Confirmar cliente</button>
        <button class="btn btn-sm btn-secondary" onclick="QuotationsModule._clearClient()" style="margin-left:6px">Cancelar</button>
      </div>`;
  },

  _confirmNewClient() {
    const name = document.getElementById('qfNcName')?.value.trim();
    if (!name) { showToast('Ingresa el nombre del cliente', 'warning'); return; }
    const ci    = document.getElementById('qfNcCi')?.value.trim()    || '';
    const phone = document.getElementById('qfNcPhone')?.value.trim() || '';
    const email = document.getElementById('qfNcEmail')?.value.trim() || '';
    const newId = genId('CU', DB.customers.length + 1);
    DB.customers.push({ id: newId, name, ci, phone, email, address: '', type:'normal', status:'active', joinDate: todayStr(), purchases: 0, totalSpent: 0 });
    this._qfClient = { id: newId, name, ci, phone, email, address: '' };
    const card = document.getElementById('qfClientCard');
    if (card) card.innerHTML = this._clientCardHtml(this._qfClient);
    const inp = document.getElementById('qfClientSearch');
    if (inp) inp.value = name;
    const cid = document.getElementById('qfClientId');
    if (cid) cid.value = newId;
    showToast(`Cliente "${name}" creado`, 'success');
  },

  _searchProduct(val) {
    const sug = document.getElementById('qfProdSug');
    if (!sug) return;
    if (!val || val.length < 1) { sug.style.display = 'none'; return; }
    const v = val.toLowerCase();
    const matches = DB.products.filter(p =>
      p.status === 'active' &&
      (p.name.toLowerCase().includes(v) || p.code.toLowerCase().includes(v))
    ).slice(0, 8);

    if (!matches.length) {
      sug.innerHTML = `<div style="padding:10px 12px;font-size:13px;color:var(--text-3)">Sin resultados</div>`;
    } else {
      sug.innerHTML = matches.map(p => {
        const cat = DB.getCat(p.catId);
        return `<div style="padding:10px 12px;cursor:pointer;border-bottom:1px solid var(--border);font-size:13px;display:flex;justify-content:space-between;align-items:center"
          onmousedown="event.preventDefault();QuotationsModule._addItem('${p.id}')">
          <div>
            <strong>${p.name}</strong>
            <span style="color:var(--text-2);margin-left:6px;font-size:11px">${cat?.name||''}</span>
          </div>
          <span style="color:var(--primary);font-weight:700">${formatPrice(p.sellP)}</span>
        </div>`;
      }).join('');
    }
    sug.style.display = 'block';
  },

  _addItem(productId) {
    const p = DB.products.find(x => x.id === productId);
    if (!p) return;
    const existing = this._qfItems.find(i => i.productId === productId);
    if (existing) {
      existing.qty++;
      existing.subtotal = +(existing.qty * existing.unitPrice * (1 - existing.discount/100)).toFixed(2);
    } else {
      this._qfItems.push({ productId: p.id, name: p.name, unitPrice: p.sellP, qty: 1, discount: 0, subtotal: +p.sellP.toFixed(2) });
    }
    const sug = document.getElementById('qfProdSug');
    if (sug) sug.style.display = 'none';
    const inp = document.getElementById('qfProdSearch');
    if (inp) inp.value = '';
    this._renderQfItems();
    this._recalc();
  },

  _updateItemQty(idx, qty) {
    const item = this._qfItems[idx];
    if (!item) return;
    item.qty = Math.max(1, parseInt(qty) || 1);
    item.subtotal = +(item.qty * item.unitPrice * (1 - item.discount/100)).toFixed(2);
    this._renderQfItems();
    this._recalc();
  },

  _updateItemDisc(idx, disc) {
    const item = this._qfItems[idx];
    if (!item) return;
    item.discount = Math.min(100, Math.max(0, parseFloat(disc) || 0));
    item.subtotal = +(item.qty * item.unitPrice * (1 - item.discount/100)).toFixed(2);
    this._renderQfItems();
    this._recalc();
  },

  _removeItem(idx) {
    this._qfItems.splice(idx, 1);
    this._renderQfItems();
    this._recalc();
  },

  _renderQfItems() {
    const el = document.getElementById('qfItemsList');
    if (!el) return;
    if (!this._qfItems.length) {
      el.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-3);font-size:13px"><i class="fas fa-cart-plus" style="font-size:28px;margin-bottom:8px;display:block;opacity:.4"></i>Busca y agrega productos a la cotización</div>`;
      return;
    }
    el.innerHTML = `<div class="table-responsive"><table class="table" style="font-size:13px">
      <thead><tr><th>Producto</th><th>P. Unitario</th><th style="width:70px">Cant.</th><th style="width:80px">Desc %</th><th>Subtotal</th><th></th></tr></thead>
      <tbody>
      ${this._qfItems.map((item, i) => `
        <tr>
          <td>${item.name}</td>
          <td>${formatPrice(item.unitPrice)}</td>
          <td><input type="number" class="form-control" min="1" value="${item.qty}" style="width:60px;text-align:center"
            onchange="QuotationsModule._updateItemQty(${i},this.value)" /></td>
          <td><input type="number" class="form-control" min="0" max="100" step="0.5" value="${item.discount}" style="width:65px;text-align:center"
            onchange="QuotationsModule._updateItemDisc(${i},this.value)" /></td>
          <td><strong>${formatPrice(item.subtotal)}</strong></td>
          <td><button class="btn btn-sm btn-outline-danger" onclick="QuotationsModule._removeItem(${i})"><i class="fas fa-trash"></i></button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
  },

  _recalc() {
    const subtotal   = +this._qfItems.reduce((s, i) => s + i.subtotal, 0).toFixed(2);
    const gDisc      = parseFloat(document.getElementById('qfGlobalDisc')?.value || 0) || 0;
    const discAmt    = +(subtotal * gDisc / 100).toFixed(2);
    const total      = +(subtotal - discAmt).toFixed(2);
    const rate       = DB.config.exchangeRate || 9.35;
    const totalBs    = +(total * rate).toFixed(2);
    const sym        = DB.config.currencySymbol || 'Bs.';

    const box = document.getElementById('qfTotalsBox');
    if (!box) return;
    box.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:7px;font-size:13px">
        <div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Subtotal:</span><span>${formatPrice(subtotal)}</span></div>
        ${gDisc > 0 ? `<div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Desc. ${gDisc}%:</span><span style="color:var(--danger)">-${formatPrice(discAmt)}</span></div>` : ''}
        <hr style="border:none;border-top:1px solid var(--border);margin:2px 0"/>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:700;font-size:14px">TOTAL:</span>
          <div style="text-align:right">
            <div style="font-weight:800;font-size:16px;color:var(--primary)">${sym} ${totalBs.toFixed(2)}</div>
            <div style="font-size:11px;color:var(--text-3)">$${total.toFixed(2)} USD</div>
          </div>
        </div>
        <div style="font-size:11px;color:var(--text-3);text-align:right">T.C.: 1 USD = ${sym} ${rate}</div>
      </div>`;
  },

  async saveQuote() {
    if (!this._qfClient) { showToast('Selecciona un cliente', 'warning'); return; }
    if (!this._qfItems.length) { showToast('Agrega al menos un producto', 'warning'); return; }

    const gDisc    = parseFloat(document.getElementById('qfGlobalDisc')?.value || 0) || 0;
    const validDays = parseInt(document.getElementById('qfValidDays')?.value || 30);
    const notes    = document.getElementById('qfNotes')?.value.trim() || '';

    const subtotal   = +this._qfItems.reduce((s, i) => s + i.subtotal, 0).toFixed(2);
    const discAmt    = +(subtotal * gDisc / 100).toFixed(2);
    const total      = +(subtotal - discAmt).toFixed(2);
    const rate       = DB.config.exchangeRate || 9.35;
    const totalBs    = +(total * rate).toFixed(2);

    const d = new Date(); d.setDate(d.getDate() + validDays);
    const validUntil = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');

    const qId = this._editId || genId('Q', DB.nextQuoteId);
    let qrHash = Math.random().toString(36).substring(2, 18);
    try {
      const raw = `${qId}|${this._qfClient.name}|${total}|${todayStr()}`;
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw + (DB.config.digitalSignKey||'')));
      qrHash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('').substring(0, 16);
    } catch(_) {}

    const qNum = `COT-${String(this._editId ? parseInt(this._editId.replace('Q','')) : DB.nextQuoteId).padStart(5,'0')}`;

    const qData = {
      id: qId,
      number: qNum,
      clientId: this._qfClient.id || null,
      clientData: { name: this._qfClient.name, ci: this._qfClient.ci||'', phone: this._qfClient.phone||'', email: this._qfClient.email||'' },
      items: this._qfItems,
      globalDiscount: gDisc,
      subtotal,
      discountAmount: discAmt,
      total,
      totalBs,
      exchangeRate: rate,
      currency: DB.config.displayCurrency || 'Bs.',
      validDays,
      validUntil,
      notes,
      status: 'pending',
      createdAt: this._editId ? (DB.quotations.find(x=>x.id===this._editId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      createdBy: currentUser?.id || 'W01',
      template: 'T1',
      qrHash,
    };

    if (this._editId) {
      const idx = DB.quotations.findIndex(q => q.id === this._editId);
      if (idx >= 0) { DB.quotations[idx] = qData; showToast('Cotización actualizada', 'success'); }
    } else {
      DB.quotations.push(qData);
      DB.nextQuoteId++;
      showToast('Cotización creada correctamente', 'success');
    }
    closeModalDirect();
    navigate('quotations');
  },

  changeStatus(id, status) {
    const label = status === 'accepted' ? 'aceptar' : 'rechazar';
    openConfirm('Cambiar Estado', `¿Deseas ${label} la cotización ${id}?`, () => {
      const q = DB.quotations.find(x => x.id === id);
      if (q) {
        q.status = status;
        showToast(`Cotización ${status === 'accepted' ? 'aceptada' : 'rechazada'}`, 'success');
        navigate('quotations');
      }
    });
  },

  deleteQuote(id) {
    openConfirm('Eliminar Cotización', `¿Eliminar la cotización ${id}? Esta acción no se puede deshacer.`, () => {
      const idx = DB.quotations.findIndex(q => q.id === id);
      if (idx >= 0) { DB.quotations.splice(idx, 1); showToast('Cotización eliminada', 'info'); navigate('quotations'); }
    });
  },

  viewDetails(id) {
    const q = DB.quotations.find(x => x.id === id);
    if (!q) return;
    const sMap = { pending:['badge-warning','Pendiente'], accepted:['badge-success','Aceptada'], rejected:['badge-danger','Rechazada'], expired:['badge-gray','Vencida'] };
    const [cls, lbl] = sMap[q.status] || ['badge-gray','?'];
    const sym = DB.config.currencySymbol || 'Bs.';

    const html = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;flex-wrap:wrap;gap:12px">
        <div>
          <div style="font-size:12px;color:var(--text-2)">Cotización</div>
          <div style="font-size:22px;font-weight:800;margin-bottom:4px">${q.id} — ${q.number||''}</div>
          <span class="badge ${cls}">${lbl}</span>
        </div>
        <div style="text-align:right;font-size:13px;color:var(--text-2)">
          <div>Emitida: ${fmtDate(q.createdAt)}</div>
          <div>Válida hasta: <strong>${fmtDate(q.validUntil)}</strong></div>
          <div>Vendedor: ${DB.workers.find(w=>w.id===q.createdBy)?.name||q.createdBy}</div>
        </div>
      </div>

      <div style="background:var(--bg-2);border-radius:var(--radius);padding:12px;margin-bottom:16px">
        <div style="font-weight:700;margin-bottom:6px;font-size:13px"><i class="fas fa-user"></i> Cliente</div>
        <div style="font-size:13px">
          <strong>${q.clientData.name}</strong>
          <span style="color:var(--text-2);margin-left:8px">CI: ${q.clientData.ci||'—'}</span>
          <span style="color:var(--text-2);margin-left:8px">${q.clientData.phone||'—'}</span>
          <span style="color:var(--text-2);margin-left:8px">${q.clientData.email||'—'}</span>
        </div>
      </div>

      <div class="table-responsive"><table class="table" style="font-size:13px;margin-bottom:16px">
        <thead><tr><th>Producto</th><th>P. Unitario</th><th>Cant.</th><th>Desc %</th><th>Subtotal</th></tr></thead>
        <tbody>
          ${q.items.map(i=>`<tr>
            <td>${i.name}</td>
            <td>${formatPrice(i.unitPrice)}</td>
            <td>${i.qty}</td>
            <td>${i.discount||0}%</td>
            <td><strong>${formatPrice(i.subtotal)}</strong></td>
          </tr>`).join('')}
        </tbody>
      </table></div>

      <div style="display:flex;justify-content:flex-end">
        <div style="min-width:260px;display:flex;flex-direction:column;gap:6px;font-size:13px">
          <div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Subtotal:</span><span>${formatPrice(q.subtotal)}</span></div>
          ${q.globalDiscount>0?`<div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Desc. global ${q.globalDiscount}%:</span><span style="color:var(--danger)">-${formatPrice(q.discountAmount)}</span></div>`:''}
          <hr style="border:none;border-top:2px solid var(--border);margin:2px 0"/>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:15px">
            <strong>TOTAL:</strong>
            <div style="text-align:right">
              <div style="font-weight:800;color:var(--primary)">${sym} ${q.totalBs.toFixed(2)}</div>
              <div style="font-size:11px;color:var(--text-3)">$${q.total.toFixed(2)} USD · T.C. ${q.exchangeRate}</div>
            </div>
          </div>
        </div>
      </div>

      ${q.notes?`<div style="background:var(--bg-2);border-radius:var(--radius);padding:10px;margin-top:12px;font-size:13px"><strong>Notas:</strong> ${q.notes}</div>`:''}

      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="closeModalDirect();QuotationsModule.generatePDF('${q.id}')"><i class="fas fa-file-pdf"></i> PDF</button>
        <button class="btn btn-success" onclick="closeModalDirect();QuotationsModule.sendWhatsApp('${q.id}')"><i class="fab fa-whatsapp"></i> WhatsApp</button>
        <button class="btn btn-secondary" onclick="closeModalDirect();QuotationsModule.showForm('${q.id}')"><i class="fas fa-pen"></i> Editar</button>
        ${q.status==='pending'?`
        <button class="btn btn-outline-success" onclick="closeModalDirect();QuotationsModule.changeStatus('${q.id}','accepted')"><i class="fas fa-check"></i> Aceptar</button>
        <button class="btn btn-outline-danger" onclick="closeModalDirect();QuotationsModule.changeStatus('${q.id}','rejected')"><i class="fas fa-xmark"></i> Rechazar</button>`:''}
      </div>`;

    openModal(`Cotización — ${q.id}`, html, 'modal-lg');
  },

  /* ---- PDF ---- */
  generatePDF(id) {
    const q = DB.quotations.find(x => x.id === id);
    if (!q) return;

    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:128px;height:128px;';
    document.body.appendChild(tempDiv);
    try {
      new QRCode(tempDiv, {
        text: `${location.origin}${location.pathname.replace('index.html','')}validar.html?id=${q.id}&hash=${q.qrHash}&tipo=cotizacion`,
        width: 128, height: 128, correctLevel: QRCode.CorrectLevel.M,
      });
    } catch(_) {}

    setTimeout(() => {
      const canvas = tempDiv.querySelector('canvas');
      const qrDataUrl = canvas ? canvas.toDataURL('image/png') : null;
      try { document.body.removeChild(tempDiv); } catch(_) {}
      this._buildPDF(q, qrDataUrl);
    }, 250);
  },

  _buildPDF(q, qrDataUrl) {
    const tpl = DB.config.quotationTemplate || 'T1';
    if (tpl === 'T3') { this._buildPDFCompact(q, qrDataUrl); return; }
    if (tpl === 'T2') { this._buildPDF_T2(q, qrDataUrl); return; }
    if (tpl === 'T4') { this._buildPDF_T4(q, qrDataUrl); return; }
    if (tpl === 'T5') { this._buildPDF_T5(q, qrDataUrl); return; }
    if (tpl === 'T6') { this._buildPDF_T6(q, qrDataUrl); return; }

    // ─── T1: Azul clásico con acento naranja ─────────────────────────
    const { jsPDF } = window.jspdf;
    const cfg = DB.config;
    const doc = new jsPDF({ unit:'mm', format:'a4' });
    const PW=210, ML=14, MR=196, CW=182;
    const P=[37,99,235], DK=[15,23,42], GBG=[248,250,252], BRD=[226,232,240];
    const TXT=[30,41,59], MUT=[100,116,139], WHT=[255,255,255], GRN=[16,185,129];
    const ORG=[234,88,12];
    const logoFmt = cfg.logoImg && cfg.logoImg.startsWith('data:image/png') ? 'PNG' : 'WEBP';
    const sf=c=>doc.setFillColor(...c), ss=c=>doc.setDrawColor(...c), sc=c=>doc.setTextColor(...c);
    const bl=()=>doc.setFont('helvetica','bold'), nm=()=>doc.setFont('helvetica','normal');
    const sz=s=>doc.setFontSize(s), rc=(x,y,w,h,s='F')=>doc.rect(x,y,w,h,s);
    const tx=(t,x,y,o={})=>doc.text(String(t),x,y,o);

    sf(P); rc(0,0,PW,42);
    let logoX = ML+4;
    if (cfg.logoImg) {
      try { doc.addImage(cfg.logoImg,logoFmt,ML+4,6,28,28); logoX = ML+36; } catch(_) {}
    }
    sc(WHT); bl(); sz(16); tx((cfg.name||'ElectroShop').toUpperCase(), logoX, 14);
    nm(); sz(8);
    tx(cfg.legalName||'', logoX, 20);
    tx(`${cfg.address||''}, ${cfg.city||'Cochabamba'}, ${cfg.country||'Bolivia'}`, logoX, 25);
    tx(`Tel: ${cfg.phone||''}  ·  ${cfg.email||''}`, logoX, 30);
    tx(`RUC/NIT: ${cfg.ruc||''}`, logoX, 35);
    sf(ORG); rc(138,5,58,32);
    sc(WHT); bl(); sz(13); tx('COTIZACIÓN', 167,14,{align:'center'});
    nm(); sz(8); tx('PROPUESTA COMERCIAL', 167,20,{align:'center'});
    bl(); sz(9); tx(q.id, 167,27,{align:'center'});
    nm(); sz(7); tx(q.number||'', 167,33,{align:'center'});

    let y = 47;
    sf([241,245,249]); rc(ML,y,CW,7); sf(P); rc(ML,y,3,7);
    bl(); sz(7.5); sc(P); tx('DATOS DE EMISIÓN', ML+6, y+4.8);
    sf([241,245,249]); rc(ML+89,y,CW-89,7); sf(GRN); rc(ML+89,y,3,7);
    sc(GRN); tx('DATOS DEL CLIENTE', ML+95, y+4.8);

    y += 9; const rh = 5.2;
    const worker = DB.workers.find(w => w.id === q.createdBy);
    const emitRows=[['Fecha emisión:',fmtDate(q.createdAt)],['Válida hasta:',fmtDate(q.validUntil)],['Vendedor:',worker?.name||q.createdBy],['Tipo de cambio:',`1 USD = ${cfg.currencySymbol||'Bs.'} ${q.exchangeRate}`]];
    emitRows.forEach(([lb,val])=>{ nm();sz(7.5);sc(MUT);tx(lb,ML+2,y); bl();sc(TXT);tx(val,ML+32,y); y+=rh; });
    const ry=y-emitRows.length*rh;
    const clRows=[['Nombre:',q.clientData.name.substring(0,30)],['CI:',q.clientData.ci||'—'],['Teléfono:',q.clientData.phone||'—'],['Email:',q.clientData.email||'—']];
    let ry2=ry;
    clRows.forEach(([lb,val])=>{ nm();sz(7.5);sc(MUT);tx(lb,ML+91,ry2); bl();sc(TXT);tx(val,ML+110,ry2); ry2+=rh; });

    y += 4; ss(BRD); doc.setLineWidth(0.3); doc.line(ML,y,MR,y); y += 4;
    doc.autoTable({
      startY:y, margin:{left:ML,right:PW-MR},
      head:[['CANT','DESCRIPCIÓN','P. UNITARIO','DESC%','SUBTOTAL']],
      body:q.items.map(item=>[{content:item.qty,styles:{halign:'center'}},item.name,{content:`$${item.unitPrice.toFixed(2)}`,styles:{halign:'right'}},{content:(item.discount||0)>0?`${item.discount}%`:'—',styles:{halign:'center'}},{content:`$${item.subtotal.toFixed(2)}`,styles:{halign:'right'}}]),
      headStyles:{fillColor:DK,textColor:WHT,fontStyle:'bold',fontSize:8,cellPadding:3},
      bodyStyles:{fontSize:8,cellPadding:2.8,textColor:TXT},
      columnStyles:{0:{cellWidth:14},1:{cellWidth:92},2:{cellWidth:26},3:{cellWidth:18},4:{cellWidth:26}},
      alternateRowStyles:{fillColor:GBG}, tableLineColor:BRD, tableLineWidth:0.25,
    });
    y = doc.lastAutoTable.finalY + 5;

    const TX2=MR-70, TW=70;
    sf(GBG); ss(BRD); doc.setLineWidth(0.3); rc(TX2,y,TW,36+(q.globalDiscount>0?7:0),'FD');
    const totRows=[['Subtotal:',`$${q.subtotal.toFixed(2)}`],...(q.globalDiscount>0?[[`Desc. ${q.globalDiscount}%:`,`-$${q.discountAmount.toFixed(2)}`]]:[])];
    let ty=y+6;
    totRows.forEach(([lb,val])=>{ nm();sz(8);sc(MUT);tx(lb,TX2+3,ty); bl();sc(TXT);tx(val,TX2+TW-3,ty,{align:'right'}); ty+=7; });
    ss(BRD); doc.line(TX2+2,ty-2,TX2+TW-2,ty-2);
    sf(ORG); rc(TX2,ty,TW,12);
    const sym=cfg.currencySymbol||'Bs.';
    bl();sz(8.5);sc(WHT); tx(`TOTAL ${sym}:`,TX2+4,ty+5); tx(`${sym} ${q.totalBs.toFixed(2)}`,TX2+TW-3,ty+5,{align:'right'});
    nm();sz(7);sc([255,220,180]); tx(`= $${q.total.toFixed(2)} USD`,TX2+TW-3,ty+10,{align:'right'});
    y = ty + 18;

    if (q.notes) {
      sf([248,250,252]); ss(BRD); doc.setLineWidth(0.2);
      const nl=doc.splitTextToSize(`Notas: ${q.notes}`,120), nh=nl.length*5+8;
      rc(ML,y,125,nh,'FD'); nm();sz(7.5);sc(TXT); doc.text(nl,ML+3,y+6); y+=nh+5;
    }
    if (qrDataUrl) { try{doc.addImage(qrDataUrl,'PNG',ML,y,28,28);}catch(_){} nm();sz(6.5);sc(MUT);tx('Escanea para validar',ML+1,y+31); }
    bl();sz(8);sc(P); tx(`Válida hasta: ${fmtDate(q.validUntil)}`,ML+32,y+8);
    nm();sz(7.5);sc(MUT); tx('Esta cotización es una propuesta y no constituye un comprobante de venta.',ML+32,y+14);
    tx('Los precios están sujetos a cambio fuera del período de validez.',ML+32,y+20);
    y += 36;

    ss(BRD); doc.setLineWidth(0.4);
    doc.line(ML+5,y+14,ML+76,y+14); doc.line(ML+108,y+14,ML+178,y+14);
    nm();sz(7.5);sc(MUT); tx('Firma y sello — Empresa',ML+5,y+19); tx('Nombre / Firma — Cliente',ML+108,y+19);
    sz(6.5); tx(cfg.legalName||'',ML+5,y+24); tx('C.I.: _______________',ML+108,y+24);
    y += 32;
    sf(DK); rc(0,y,PW,14);
    nm();sz(7.5);sc([148,163,184]); tx(cfg.invoiceFooter||`Gracias por elegirnos — ${cfg.name||'ElectroShop'}`,PW/2,y+5.5,{align:'center'});
    sz(7);sc([71,85,105]); tx(`${cfg.name||'ElectroShop'}  ·  ${cfg.city||'Cochabamba'}  ·  ${cfg.phone||''}  ·  ${cfg.email||''}`,PW/2,y+11,{align:'center'});

    doc.save(`Cotizacion-${q.id}.pdf`);
    showToast('PDF descargado', 'success');
  },

  /* ─── T2: Elegante oscuro con acento esmeralda ──────────────────── */
  _buildPDF_T2(q, qrDataUrl) {
    const { jsPDF } = window.jspdf;
    const cfg = DB.config;
    const doc = new jsPDF({ unit:'mm', format:'a4' });
    const PW=210, ML=14, MR=196, CW=182;
    // Palette: dark slate + emerald
    const DK=[15,23,42], SL=[30,41,59], EM=[16,185,129], EMD=[4,120,87];
    const TXT=[30,41,59], MUT=[100,116,139], WHT=[255,255,255], BRD=[226,232,240];
    const GBG=[248,250,252], EMLT=[236,253,245];
    const logoFmt = cfg.logoImg && cfg.logoImg.startsWith('data:image/png') ? 'PNG' : 'WEBP';
    const sf=c=>doc.setFillColor(...c), ss=c=>doc.setDrawColor(...c), sc=c=>doc.setTextColor(...c);
    const bl=()=>doc.setFont('helvetica','bold'), nm=()=>doc.setFont('helvetica','normal');
    const sz=s=>doc.setFontSize(s), rc=(x,y,w,h,s='F')=>doc.rect(x,y,w,h,s);
    const tx=(t,x,y,o={})=>doc.text(String(t),x,y,o);

    // ── Header: dark slate full-width ──
    sf(SL); rc(0,0,PW,50);
    // Left: logo + company info
    let infoX = ML+4;
    if (cfg.logoImg) {
      try { doc.addImage(cfg.logoImg,logoFmt,ML+4,9,32,32); infoX = ML+40; } catch(_) {}
    }
    sc(WHT); bl(); sz(17); tx((cfg.name||'ElectroShop').toUpperCase(), infoX, 17);
    nm(); sz(7.5);
    sc([148,163,184]); tx(cfg.legalName||'', infoX, 24);
    tx(`${cfg.address||''}, ${cfg.city||'Cochabamba'}, ${cfg.country||'Bolivia'}`, infoX, 30);
    tx(`Tel: ${cfg.phone||''}`, infoX, 36);
    tx(`RUC/NIT: ${cfg.ruc||''}`, infoX, 42);

    // Right: emerald quotation ID panel
    sf(EMD); rc(145,0,65,50);
    sf(EM); rc(145,0,65,32);
    sc(WHT); bl(); sz(9); tx('COTIZACIÓN', 177,10,{align:'center'});
    nm(); sz(7); tx('PROPUESTA COMERCIAL', 177,16,{align:'center'});
    bl(); sz(11); tx(q.id, 177,25,{align:'center'});
    nm(); sz(7); sc([236,253,245]); tx(q.number||'', 177,31,{align:'center'});
    // Date area below EM strip
    sc(WHT); nm(); sz(7.5);
    tx('Fecha:', 150, 40); bl(); tx(fmtDate(q.createdAt), 165, 40);
    nm(); tx('Válida:', 150, 46); bl(); tx(fmtDate(q.validUntil), 165, 46);

    let y = 55;

    // ── Info section: two cards ──
    const halfW = CW/2 - 2;
    sf([241,245,249]); rc(ML,y,halfW,32);
    sf([241,245,249]); rc(ML+halfW+4,y,halfW,32);
    // Emit card accent bar
    sf(EM); rc(ML,y,3,32);
    // Client card accent bar
    sf(SL); rc(ML+halfW+4,y,3,32);

    // Emit card label
    bl(); sz(7); sc(EM); tx('DATOS DE EMISIÓN', ML+6, y+5.5);
    const worker = DB.workers.find(w => w.id === q.createdBy);
    const emitInfo = [
      ['Vendedor:', worker?.name||q.createdBy],
      ['Tipo cambio:', `1 USD = ${cfg.currencySymbol||'Bs.'} ${q.exchangeRate}`],
    ];
    let ey = y+11;
    emitInfo.forEach(([lb,val])=>{ nm();sz(7.5);sc(MUT);tx(lb,ML+6,ey); bl();sc(TXT);tx(val,ML+34,ey); ey+=6; });

    // Client card label
    bl(); sz(7); sc(SL); tx('DATOS DEL CLIENTE', ML+halfW+8, y+5.5);
    const clientInfo = [
      ['Nombre:', q.clientData.name.substring(0,26)],
      ['CI:', q.clientData.ci||'—'],
      ['Tel:', q.clientData.phone||'—'],
    ];
    let cy2 = y+11;
    clientInfo.forEach(([lb,val])=>{ nm();sz(7.5);sc(MUT);tx(lb,ML+halfW+8,cy2); bl();sc(TXT);tx(val,ML+halfW+22,cy2); cy2+=6; });

    y += 38;

    // ── Items table ──
    doc.autoTable({
      startY: y, margin:{left:ML,right:PW-MR},
      head:[['CANT','DESCRIPCIÓN','P. UNIT.','DESC%','SUBTOTAL']],
      body: q.items.map(item=>[
        {content:item.qty,styles:{halign:'center'}},
        item.name,
        {content:`$${item.unitPrice.toFixed(2)}`,styles:{halign:'right'}},
        {content:(item.discount||0)>0?`${item.discount}%`:'—',styles:{halign:'center'}},
        {content:`$${item.subtotal.toFixed(2)}`,styles:{halign:'right'}},
      ]),
      headStyles:{fillColor:SL,textColor:WHT,fontStyle:'bold',fontSize:8,cellPadding:3},
      bodyStyles:{fontSize:8,cellPadding:2.8,textColor:TXT},
      columnStyles:{0:{cellWidth:14},1:{cellWidth:92},2:{cellWidth:26},3:{cellWidth:18},4:{cellWidth:26}},
      alternateRowStyles:{fillColor:EMLT},
      tableLineColor:BRD, tableLineWidth:0.25,
    });
    y = doc.lastAutoTable.finalY + 5;

    // ── Totals ──
    const TX2=MR-80, TW=80;
    sf(GBG); ss(BRD); doc.setLineWidth(0.3); rc(TX2,y,TW,36+(q.globalDiscount>0?7:0),'FD');
    const totRows=[['Subtotal:',`$${q.subtotal.toFixed(2)}`],...(q.globalDiscount>0?[[`Desc. ${q.globalDiscount}%:`,`-$${q.discountAmount.toFixed(2)}`]]:[])];
    let ty=y+7;
    totRows.forEach(([lb,val])=>{ nm();sz(8.5);sc(MUT);tx(lb,TX2+4,ty); bl();sc(TXT);tx(val,TX2+TW-4,ty,{align:'right'}); ty+=7; });
    ss(EM); doc.setLineWidth(0.5); doc.line(TX2+2,ty-2,TX2+TW-2,ty-2);
    // Total box: dark slate
    sf(SL); rc(TX2,ty,TW,14);
    sf(EM); rc(TX2,ty,4,14); // emerald left accent
    const sym=cfg.currencySymbol||'Bs.';
    bl();sz(9.5);sc(WHT); tx(`TOTAL ${sym}`,TX2+8,ty+6); tx(`${sym} ${q.totalBs.toFixed(2)}`,TX2+TW-4,ty+6,{align:'right'});
    nm();sz(7);sc([167,243,208]); tx(`= $${q.total.toFixed(2)} USD`,TX2+TW-4,ty+12,{align:'right'});
    y = ty + 20;

    // ── Notes ──
    if (q.notes) {
      sf(EMLT); ss(EM); doc.setLineWidth(0.3);
      const nl=doc.splitTextToSize(`Notas: ${q.notes}`,120), nh=nl.length*5+8;
      rc(ML,y,125,nh,'FD'); sf(EM); rc(ML,y,3,nh);
      nm();sz(7.5);sc(TXT); doc.text(nl,ML+6,y+6); y+=nh+5;
    }

    // ── QR + legal ──
    if (qrDataUrl) { try{doc.addImage(qrDataUrl,'PNG',ML,y,28,28);}catch(_){} nm();sz(6.5);sc(MUT);tx('Escanea para validar',ML+1,y+31); }
    bl();sz(8);sc(EM); tx(`Válida hasta: ${fmtDate(q.validUntil)}`,ML+32,y+8);
    nm();sz(7.5);sc(MUT);
    tx('Esta cotización es una propuesta y no constituye un comprobante de venta.',ML+32,y+14);
    tx('Los precios están sujetos a cambio fuera del período de validez.',ML+32,y+20);
    y += 36;

    // ── Signatures ──
    ss([200,200,200]); doc.setLineWidth(0.4);
    doc.line(ML+5,y+14,ML+76,y+14); doc.line(ML+108,y+14,ML+178,y+14);
    nm();sz(7.5);sc(MUT); tx('Firma y sello — Empresa',ML+5,y+19); tx('Nombre / Firma — Cliente',ML+108,y+19);
    sz(6.5); tx(cfg.legalName||'',ML+5,y+24); tx('C.I.: _______________',ML+108,y+24);
    y += 32;

    // ── Footer ──
    sf(SL); rc(0,y,PW,5); // thin emerald stripe
    sf(EM); rc(0,y,PW,3);
    sf(DK); rc(0,y+3,PW,13);
    nm();sz(7.5);sc([148,163,184]); tx(cfg.invoiceFooter||`Gracias por elegirnos — ${cfg.name||'ElectroShop'}`,PW/2,y+9,{align:'center'});
    sz(7);sc([71,85,105]); tx(`${cfg.name||'ElectroShop'}  ·  ${cfg.city||'Cochabamba'}  ·  ${cfg.phone||''}  ·  ${cfg.email||''}`,PW/2,y+14,{align:'center'});

    doc.save(`Cotizacion-${q.id}.pdf`);
    showToast('PDF descargado', 'success');
  },

  /* ─── T4: Coral Profesional ──────────────────────────────────────── */
  _buildPDF_T4(q, qrDataUrl) {
    const { jsPDF } = window.jspdf;
    const cfg = DB.config;
    const doc = new jsPDF({ unit:'mm', format:'a4' });
    const PW=210, ML=14, MR=196, CW=182;
    const CR=[220,38,38], CRL=[254,226,226], CRM=[253,164,164];
    const DK=[15,23,42], TXT=[30,41,59], MUT=[100,116,139], WHT=[255,255,255], BRD=[226,232,240], GBG=[248,250,252];
    const logoFmt=cfg.logoImg&&cfg.logoImg.startsWith('data:image/png')?'PNG':'WEBP';
    const sf=c=>doc.setFillColor(...c), ss=c=>doc.setDrawColor(...c), sc=c=>doc.setTextColor(...c);
    const bl=()=>doc.setFont('helvetica','bold'), nm=()=>doc.setFont('helvetica','normal');
    const sz=s=>doc.setFontSize(s), rc=(x,y,w,h,s='F')=>doc.rect(x,y,w,h,s);
    const tx=(t,x,y,o={})=>doc.text(String(t),x,y,o);

    // Header: white bg with coral left border strip
    sf(CR); rc(0,0,6,52);
    sf([255,255,255]); rc(6,0,PW-6,52);
    // Company info
    let infoX = 12;
    if (cfg.logoImg) { try { doc.addImage(cfg.logoImg,logoFmt,10,8,30,30); infoX=44; } catch(_){} }
    bl(); sz(17); sc(DK); tx((cfg.name||'ElectroShop').toUpperCase(), infoX, 16);
    nm(); sz(8); sc(MUT); tx(cfg.legalName||'', infoX, 22); tx(`${cfg.address||''}, ${cfg.city||''}, ${cfg.country||''}`, infoX, 27);
    tx(`Tel: ${cfg.phone||''}  ·  ${cfg.email||''}  ·  RUC: ${cfg.ruc||''}`, infoX, 32);
    // Quotation ID box (coral, right)
    sf(CR); rc(140,8,56,36);
    sc(WHT); nm(); sz(8); tx('COTIZACIÓN', 168,17,{align:'center'});
    bl(); sz(14); tx(q.id, 168,27,{align:'center'});
    nm(); sz(7); tx(fmtDate(q.createdAt), 168,34,{align:'center'});
    tx(`Válida: ${fmtDate(q.validUntil)}`, 168,40,{align:'center'});

    let y = 57;
    // Info cards
    sf([254,242,242]); rc(ML,y,CW/2-2,28);
    sf(CR); rc(ML,y,3,28);
    bl(); sz(7); sc(CR); tx('EMISIÓN', ML+6, y+5.5);
    const worker=DB.workers.find(w=>w.id===q.createdBy);
    nm(); sz(7.5); sc(TXT);
    tx(`Fecha: ${fmtDate(q.createdAt)}`, ML+6, y+11.5);
    tx(`Vence: ${fmtDate(q.validUntil)}`, ML+6, y+17.5);
    tx(`Vendedor: ${worker?.name||q.createdBy}`, ML+6, y+23.5);

    sf(GBG); rc(ML+CW/2+2,y,CW/2-2,28);
    sf(MUT); rc(ML+CW/2+2,y,3,28);
    bl(); sz(7); sc(MUT); tx('CLIENTE', ML+CW/2+8, y+5.5);
    nm(); sz(7.5); sc(TXT);
    tx(q.clientData.name.substring(0,30), ML+CW/2+8, y+11.5);
    tx(`CI: ${q.clientData.ci||'—'}`, ML+CW/2+8, y+17.5);
    tx(`Tel: ${q.clientData.phone||'—'}`, ML+CW/2+8, y+23.5);

    y += 34;
    doc.autoTable({
      startY:y, margin:{left:ML,right:PW-MR},
      head:[['CANT','DESCRIPCIÓN','P. UNITARIO','SUBTOTAL']],
      body:q.items.map(item=>[
        {content:item.qty,styles:{halign:'center'}},
        item.name,
        {content:`$${item.unitPrice.toFixed(2)}`,styles:{halign:'right'}},
        {content:`$${item.subtotal.toFixed(2)}`,styles:{halign:'right'}},
      ]),
      headStyles:{fillColor:CR,textColor:WHT,fontStyle:'bold',fontSize:8,cellPadding:3},
      bodyStyles:{fontSize:8,cellPadding:2.8,textColor:TXT},
      columnStyles:{0:{cellWidth:14},1:{cellWidth:112},2:{cellWidth:30},3:{cellWidth:26}},
      alternateRowStyles:{fillColor:[255,241,241]},
      tableLineColor:CRL, tableLineWidth:0.2,
    });
    y = doc.lastAutoTable.finalY + 5;

    const TX2=MR-76, TW=76;
    sf(GBG); ss(BRD); doc.setLineWidth(0.3); rc(TX2,y,TW,36+(q.globalDiscount>0?7:0),'FD');
    const totRows=[['Subtotal:',`$${q.subtotal.toFixed(2)}`],...(q.globalDiscount>0?[[`Desc. ${q.globalDiscount}%:`,`-$${q.discountAmount.toFixed(2)}`]]:[])];
    let ty=y+6;
    totRows.forEach(([lb,val])=>{ nm();sz(8);sc(MUT);tx(lb,TX2+3,ty); bl();sc(TXT);tx(val,TX2+TW-3,ty,{align:'right'}); ty+=7; });
    ss(CR); doc.setLineWidth(0.5); doc.line(TX2+2,ty-2,TX2+TW-2,ty-2);
    sf(CR); rc(TX2,ty,TW,13);
    const sym=cfg.currencySymbol||'Bs.';
    bl();sz(9.5);sc(WHT); tx(`TOTAL ${sym}`,TX2+4,ty+6); tx(`${sym} ${q.totalBs.toFixed(2)}`,TX2+TW-3,ty+6,{align:'right'});
    nm();sz(7);sc([255,200,200]); tx(`= $${q.total.toFixed(2)} USD`,TX2+TW-3,ty+12,{align:'right'});
    y=ty+20;

    if(q.notes){sf(CRL);ss(CR);doc.setLineWidth(0.2);const nl=doc.splitTextToSize(`Notas: ${q.notes}`,120),nh=nl.length*5+8;rc(ML,y,125,nh,'FD');sf(CR);rc(ML,y,3,nh);nm();sz(7.5);sc(TXT);doc.text(nl,ML+6,y+6);y+=nh+5;}
    if(qrDataUrl){try{doc.addImage(qrDataUrl,'PNG',ML,y,26,26);}catch(_){} nm();sz(6.5);sc(MUT);tx('Verificar',ML+1,y+29);}
    bl();sz(8);sc(CR); tx(`Válida: ${fmtDate(q.validUntil)}`,ML+30,y+8);
    nm();sz(7.5);sc(MUT); tx('Esta cotización no constituye un comprobante de venta.',ML+30,y+14); tx('Los precios están sujetos a cambio fuera del período de validez.',ML+30,y+19);
    y+=34;
    ss([200,200,200]);doc.setLineWidth(0.4);
    doc.line(ML+5,y+14,ML+76,y+14);doc.line(ML+108,y+14,ML+178,y+14);
    nm();sz(7.5);sc(MUT);tx('Firma y sello — Empresa',ML+5,y+19);tx('Nombre / Firma — Cliente',ML+108,y+19);
    sz(6.5);tx(cfg.legalName||'',ML+5,y+24);tx('C.I.: _______________',ML+108,y+24);
    y+=32;
    sf(CRL);rc(0,y,PW,4);sf(CR);rc(0,y,PW,2);
    sf([15,23,42]);rc(0,y+2,PW,13);
    nm();sz(7.5);sc([148,163,184]);tx(cfg.invoiceFooter||`Gracias — ${cfg.name||'ElectroShop'}`,PW/2,y+8,{align:'center'});
    sz(7);sc([71,85,105]);tx(`${cfg.name||'ElectroShop'}  ·  ${cfg.city||''}  ·  ${cfg.phone||''}`,PW/2,y+13,{align:'center'});
    doc.save(`Cotizacion-${q.id}.pdf`);
    showToast('PDF descargado','success');
  },

  /* ─── T5: Tech Pro (cian/azul oscuro) ───────────────────────────── */
  _buildPDF_T5(q, qrDataUrl) {
    const { jsPDF } = window.jspdf;
    const cfg = DB.config;
    const doc = new jsPDF({ unit:'mm', format:'a4' });
    const PW=210, ML=14, MR=196, CW=182;
    const DB_=[12,74,110], CY=[6,182,212], CYL=[236,254,255], CYD=[8,145,178];
    const DK=[15,23,42], TXT=[30,41,59], MUT=[100,116,139], WHT=[255,255,255], BRD=[224,242,254];
    const logoFmt=cfg.logoImg&&cfg.logoImg.startsWith('data:image/png')?'PNG':'WEBP';
    const sf=c=>doc.setFillColor(...c), ss=c=>doc.setDrawColor(...c), sc=c=>doc.setTextColor(...c);
    const bl=()=>doc.setFont('helvetica','bold'), nm=()=>doc.setFont('helvetica','normal');
    const sz=s=>doc.setFontSize(s), rc=(x,y,w,h,s='F')=>doc.rect(x,y,w,h,s);
    const tx=(t,x,y,o={})=>doc.text(String(t),x,y,o);

    // Header: dark blue
    sf(DB_); rc(0,0,PW,52);
    let logoX=ML+4;
    if(cfg.logoImg){try{doc.addImage(cfg.logoImg,logoFmt,ML+4,8,30,30);logoX=ML+38;}catch(_){}}
    sc(WHT); bl(); sz(17); tx((cfg.name||'ElectroShop').toUpperCase(), logoX, 18);
    nm(); sz(8); sc([125,211,252]); tx(cfg.legalName||'', logoX, 24); tx(`${cfg.address||''}, ${cfg.city||''}`, logoX, 29); tx(`Tel: ${cfg.phone||''}  ·  ${cfg.email||''}`, logoX, 34);
    // Cyan quotation panel (right)
    sf(CY); rc(145,8,51,36);
    sc([15,23,42]); bl(); sz(9); tx('COTIZACIÓN', 170,17,{align:'center'});
    nm(); sz(7); tx('PROPUESTA', 170,22,{align:'center'});
    bl(); sz(12); sc(DK); tx(q.id, 170,31,{align:'center'});
    nm(); sz(7); tx(fmtDate(q.createdAt), 170,38,{align:'center'});

    let y=57;
    // Info cards (cyan)
    sf(CYL); rc(ML,y,CW/2-2,28); sf(CY); rc(ML,y,3,28);
    bl();sz(7);sc(CY); tx('EMISIÓN', ML+6, y+5.5);
    const worker=DB.workers.find(w=>w.id===q.createdBy);
    nm();sz(7.5);sc(TXT);
    tx(`Fecha: ${fmtDate(q.createdAt)}`, ML+6, y+11.5);
    tx(`Vence: ${fmtDate(q.validUntil)}`, ML+6, y+17.5);
    tx(`Vendedor: ${worker?.name||q.createdBy}`, ML+6, y+23.5);

    sf([240,249,255]); rc(ML+CW/2+2,y,CW/2-2,28); sf(DB_); rc(ML+CW/2+2,y,3,28);
    bl();sz(7);sc(DB_); tx('CLIENTE', ML+CW/2+8, y+5.5);
    nm();sz(7.5);sc(TXT);
    tx(q.clientData.name.substring(0,30), ML+CW/2+8, y+11.5);
    tx(`CI: ${q.clientData.ci||'—'}  ·  Tel: ${q.clientData.phone||'—'}`, ML+CW/2+8, y+17.5);
    tx(`Email: ${q.clientData.email||'—'}`, ML+CW/2+8, y+23.5);

    y+=34;
    doc.autoTable({
      startY:y, margin:{left:ML,right:PW-MR},
      head:[['CANT','DESCRIPCIÓN','P. UNITARIO','DESC%','SUBTOTAL']],
      body:q.items.map(item=>[
        {content:item.qty,styles:{halign:'center'}},
        item.name,
        {content:`$${item.unitPrice.toFixed(2)}`,styles:{halign:'right'}},
        {content:(item.discount||0)>0?`${item.discount}%`:'—',styles:{halign:'center'}},
        {content:`$${item.subtotal.toFixed(2)}`,styles:{halign:'right'}},
      ]),
      headStyles:{fillColor:DB_,textColor:WHT,fontStyle:'bold',fontSize:8,cellPadding:3},
      bodyStyles:{fontSize:8,cellPadding:2.8,textColor:TXT},
      columnStyles:{0:{cellWidth:14},1:{cellWidth:92},2:{cellWidth:26},3:{cellWidth:18},4:{cellWidth:26}},
      alternateRowStyles:{fillColor:CYL},
      tableLineColor:BRD, tableLineWidth:0.2,
    });
    y=doc.lastAutoTable.finalY+5;

    const TX2=MR-76, TW=76;
    sf([240,249,255]);ss([186,230,253]);doc.setLineWidth(0.3);rc(TX2,y,TW,36+(q.globalDiscount>0?7:0),'FD');
    const totRows=[['Subtotal:',`$${q.subtotal.toFixed(2)}`],...(q.globalDiscount>0?[[`Desc. ${q.globalDiscount}%:`,`-$${q.discountAmount.toFixed(2)}`]]:[])];
    let ty=y+6;
    totRows.forEach(([lb,val])=>{ nm();sz(8);sc(MUT);tx(lb,TX2+3,ty); bl();sc(TXT);tx(val,TX2+TW-3,ty,{align:'right'}); ty+=7; });
    ss(CY);doc.setLineWidth(0.5);doc.line(TX2+2,ty-2,TX2+TW-2,ty-2);
    sf(DB_);rc(TX2,ty,TW,13); sf(CY);rc(TX2,ty,4,13);
    const sym=cfg.currencySymbol||'Bs.';
    bl();sz(9.5);sc(WHT);tx(`TOTAL ${sym}`,TX2+8,ty+6);tx(`${sym} ${q.totalBs.toFixed(2)}`,TX2+TW-3,ty+6,{align:'right'});
    nm();sz(7);sc([103,232,249]);tx(`= $${q.total.toFixed(2)} USD`,TX2+TW-3,ty+12,{align:'right'});
    y=ty+20;

    if(q.notes){sf(CYL);ss(CY);doc.setLineWidth(0.2);const nl=doc.splitTextToSize(`Notas: ${q.notes}`,120),nh=nl.length*5+8;rc(ML,y,125,nh,'FD');sf(CY);rc(ML,y,3,nh);nm();sz(7.5);sc(TXT);doc.text(nl,ML+6,y+6);y+=nh+5;}
    if(qrDataUrl){try{doc.addImage(qrDataUrl,'PNG',ML,y,26,26);}catch(_){} nm();sz(6.5);sc(MUT);tx('Verificar',ML+1,y+29);}
    bl();sz(8);sc(CY);tx(`Válida: ${fmtDate(q.validUntil)}`,ML+30,y+8);
    nm();sz(7.5);sc(MUT);tx('Esta cotización no constituye un comprobante de venta.',ML+30,y+14);tx('Los precios están sujetos a cambio fuera del período de validez.',ML+30,y+19);
    y+=34;
    ss([200,200,200]);doc.setLineWidth(0.4);
    doc.line(ML+5,y+14,ML+76,y+14);doc.line(ML+108,y+14,ML+178,y+14);
    nm();sz(7.5);sc(MUT);tx('Firma y sello — Empresa',ML+5,y+19);tx('Nombre / Firma — Cliente',ML+108,y+19);
    sz(6.5);tx(cfg.legalName||'',ML+5,y+24);tx('C.I.: _______________',ML+108,y+24);
    y+=32;
    sf(CY);rc(0,y,PW,3);sf(DB_);rc(0,y+3,PW,13);
    nm();sz(7.5);sc([125,211,252]);tx(cfg.invoiceFooter||`Gracias — ${cfg.name||'ElectroShop'}`,PW/2,y+9,{align:'center'});
    sz(7);sc([71,130,180]);tx(`${cfg.name||'ElectroShop'}  ·  ${cfg.city||''}  ·  ${cfg.phone||''}`,PW/2,y+14,{align:'center'});
    doc.save(`Cotizacion-${q.id}.pdf`);
    showToast('PDF descargado','success');
  },

  /* ─── T6: Premium Dorado (ámbar/café) ───────────────────────────── */
  _buildPDF_T6(q, qrDataUrl) {
    const { jsPDF } = window.jspdf;
    const cfg = DB.config;
    const doc = new jsPDF({ unit:'mm', format:'a4' });
    const PW=210, ML=14, MR=196, CW=182;
    const BR=[146,64,14], GO=[217,119,6], GOL=[255,251,235], GOB=[253,230,138], GOD=[120,53,15];
    const DK=[15,23,42], TXT=[30,41,59], MUT=[100,116,139], WHT=[255,255,255], BRD=[253,230,138];
    const logoFmt=cfg.logoImg&&cfg.logoImg.startsWith('data:image/png')?'PNG':'WEBP';
    const sf=c=>doc.setFillColor(...c), ss=c=>doc.setDrawColor(...c), sc=c=>doc.setTextColor(...c);
    const bl=()=>doc.setFont('helvetica','bold'), nm=()=>doc.setFont('helvetica','normal');
    const sz=s=>doc.setFontSize(s), rc=(x,y,w,h,s='F')=>doc.rect(x,y,w,h,s);
    const tx=(t,x,y,o={})=>doc.text(String(t),x,y,o);

    // Header: warm brown gradient (left=dark, right=lighter)
    sf(BR);rc(0,0,PW/2,52); sf([180,83,9]);rc(PW/2,0,PW/2,52);
    let logoX=ML+4;
    if(cfg.logoImg){try{doc.addImage(cfg.logoImg,logoFmt,ML+4,9,30,30);logoX=ML+38;}catch(_){}}
    sc([254,243,199]);bl();sz(17);tx((cfg.name||'ElectroShop').toUpperCase(), logoX, 18);
    nm();sz(8);sc([253,230,138]);tx(cfg.legalName||'', logoX, 24);tx(`${cfg.address||''}, ${cfg.city||''}`, logoX, 29);tx(`Tel: ${cfg.phone||''}  ·  ${cfg.email||''}`, logoX, 34);
    // Gold quotation panel
    sf(GOB);rc(143,8,53,36);
    sc(GOD);bl();sz(9);tx('COTIZACIÓN', 169,17,{align:'center'});
    nm();sz(7);tx('PROPUESTA COMERCIAL', 169,22,{align:'center'});
    bl();sz(12);sc(BR);tx(q.id, 169,31,{align:'center'});
    nm();sz(7);tx(fmtDate(q.createdAt), 169,38,{align:'center'});

    let y=57;
    // Info cards (gold)
    sf(GOL);rc(ML,y,CW/2-2,28);sf(GO);rc(ML,y,3,28);
    bl();sz(7);sc(GO);tx('EMISIÓN',ML+6,y+5.5);
    const worker=DB.workers.find(w=>w.id===q.createdBy);
    nm();sz(7.5);sc(TXT);
    tx(`Fecha: ${fmtDate(q.createdAt)}`,ML+6,y+11.5);
    tx(`Vence: ${fmtDate(q.validUntil)}`,ML+6,y+17.5);
    tx(`Vendedor: ${worker?.name||q.createdBy}`,ML+6,y+23.5);

    sf([254,249,195]);rc(ML+CW/2+2,y,CW/2-2,28);sf(BR);rc(ML+CW/2+2,y,3,28);
    bl();sz(7);sc(BR);tx('CLIENTE',ML+CW/2+8,y+5.5);
    nm();sz(7.5);sc(TXT);
    tx(q.clientData.name.substring(0,30),ML+CW/2+8,y+11.5);
    tx(`CI: ${q.clientData.ci||'—'}  ·  Tel: ${q.clientData.phone||'—'}`,ML+CW/2+8,y+17.5);
    tx(`Email: ${q.clientData.email||'—'}`,ML+CW/2+8,y+23.5);

    y+=34;
    doc.autoTable({
      startY:y, margin:{left:ML,right:PW-MR},
      head:[['CANT','DESCRIPCIÓN','P. UNITARIO','DESC%','SUBTOTAL']],
      body:q.items.map(item=>[
        {content:item.qty,styles:{halign:'center'}},
        item.name,
        {content:`$${item.unitPrice.toFixed(2)}`,styles:{halign:'right'}},
        {content:(item.discount||0)>0?`${item.discount}%`:'—',styles:{halign:'center'}},
        {content:`$${item.subtotal.toFixed(2)}`,styles:{halign:'right'}},
      ]),
      headStyles:{fillColor:BR,textColor:[254,243,199],fontStyle:'bold',fontSize:8,cellPadding:3},
      bodyStyles:{fontSize:8,cellPadding:2.8,textColor:TXT},
      columnStyles:{0:{cellWidth:14},1:{cellWidth:92},2:{cellWidth:26},3:{cellWidth:18},4:{cellWidth:26}},
      alternateRowStyles:{fillColor:GOL},
      tableLineColor:GOB, tableLineWidth:0.2,
    });
    y=doc.lastAutoTable.finalY+5;

    const TX2=MR-76, TW=76;
    sf(GOL);ss(GOB);doc.setLineWidth(0.3);rc(TX2,y,TW,36+(q.globalDiscount>0?7:0),'FD');
    const totRows=[['Subtotal:',`$${q.subtotal.toFixed(2)}`],...(q.globalDiscount>0?[[`Desc. ${q.globalDiscount}%:`,`-$${q.discountAmount.toFixed(2)}`]]:[])];
    let ty=y+6;
    totRows.forEach(([lb,val])=>{ nm();sz(8);sc(MUT);tx(lb,TX2+3,ty); bl();sc(TXT);tx(val,TX2+TW-3,ty,{align:'right'}); ty+=7; });
    ss(GO);doc.setLineWidth(0.5);doc.line(TX2+2,ty-2,TX2+TW-2,ty-2);
    // Total: brown bg, gold accent strip
    sf(BR);rc(TX2,ty,TW,13);sf(GO);rc(TX2,ty,4,13);
    const sym=cfg.currencySymbol||'Bs.';
    bl();sz(9.5);sc([254,243,199]);tx(`TOTAL ${sym}`,TX2+8,ty+6);tx(`${sym} ${q.totalBs.toFixed(2)}`,TX2+TW-3,ty+6,{align:'right'});
    nm();sz(7);sc([253,230,138]);tx(`= $${q.total.toFixed(2)} USD`,TX2+TW-3,ty+12,{align:'right'});
    y=ty+20;

    if(q.notes){sf(GOL);ss(GO);doc.setLineWidth(0.2);const nl=doc.splitTextToSize(`Notas: ${q.notes}`,120),nh=nl.length*5+8;rc(ML,y,125,nh,'FD');sf(GO);rc(ML,y,3,nh);nm();sz(7.5);sc(TXT);doc.text(nl,ML+6,y+6);y+=nh+5;}
    if(qrDataUrl){try{doc.addImage(qrDataUrl,'PNG',ML,y,26,26);}catch(_){} nm();sz(6.5);sc(MUT);tx('Verificar',ML+1,y+29);}
    bl();sz(8);sc(GO);tx(`Válida: ${fmtDate(q.validUntil)}`,ML+30,y+8);
    nm();sz(7.5);sc(MUT);tx('Esta cotización no constituye un comprobante de venta.',ML+30,y+14);tx('Los precios están sujetos a cambio fuera del período de validez.',ML+30,y+19);
    y+=34;
    ss([200,200,200]);doc.setLineWidth(0.4);
    doc.line(ML+5,y+14,ML+76,y+14);doc.line(ML+108,y+14,ML+178,y+14);
    nm();sz(7.5);sc(MUT);tx('Firma y sello — Empresa',ML+5,y+19);tx('Nombre / Firma — Cliente',ML+108,y+19);
    sz(6.5);tx(cfg.legalName||'',ML+5,y+24);tx('C.I.: _______________',ML+108,y+24);
    y+=32;
    sf(GOB);rc(0,y,PW,4);sf(BR);rc(0,y+4,PW,13);
    nm();sz(7.5);sc([254,243,199]);tx(cfg.invoiceFooter||`Gracias — ${cfg.name||'ElectroShop'}`,PW/2,y+10,{align:'center'});
    sz(7);sc([253,186,116]);tx(`${cfg.name||'ElectroShop'}  ·  ${cfg.city||''}  ·  ${cfg.phone||''}`,PW/2,y+15,{align:'center'});
    doc.save(`Cotizacion-${q.id}.pdf`);
    showToast('PDF descargado','success');
  },

  /* ---- PDF T3 COMPACTO ---- */
  _buildPDFCompact(q, qrDataUrl) {
    const { jsPDF } = window.jspdf;
    const cfg = DB.config;
    const doc = new jsPDF({ unit:'mm', format:'a4' });
    const PW=210, ML=14, MR=196;
    const TXT=[30,41,59], MUT=[100,116,139], BRD=[226,232,240], WHT=[255,255,255], DK=[15,23,42];
    const sf=c=>doc.setFillColor(...c), sc=c=>doc.setTextColor(...c);
    const bl=()=>doc.setFont('helvetica','bold'), nm=()=>doc.setFont('helvetica','normal');
    const sz=s=>doc.setFontSize(s), tx=(t,x,y,o={})=>doc.text(String(t),x,y,o);

    const logoFmt = cfg.logoImg && cfg.logoImg.startsWith('data:image/png') ? 'PNG' : 'WEBP';
    let y = 14;
    // Minimal header
    if (cfg.logoImg) {
      try { doc.addImage(cfg.logoImg,logoFmt,ML,y-8,18,18); } catch(_) {}
      bl(); sz(14); sc(TXT); tx((cfg.name||'ElectroShop').toUpperCase(), ML+22, y);
      nm(); sz(8); sc(MUT); tx(`${cfg.address||''}, ${cfg.city||'Cochabamba'}`, ML+22, y+5);
    } else {
      bl(); sz(14); sc(TXT); tx((cfg.name||'ElectroShop').toUpperCase(), ML, y);
      nm(); sz(8); sc(MUT); tx(`${cfg.address||''}, ${cfg.city||'Cochabamba'}`, ML, y+5);
    }
    bl(); sz(10); sc([37,99,235]); tx(`COTIZACIÓN ${q.id}`, MR, y, {align:'right'});
    nm(); sz(8); sc(MUT); tx(fmtDate(q.createdAt), MR, y+5, {align:'right'});
    y += 16;

    doc.setDrawColor(...BRD); doc.setLineWidth(0.5); doc.line(ML,y,MR,y); y += 6;

    // Client
    bl(); sz(8.5); sc(TXT); tx(`Cliente:`, ML, y);
    nm(); sz(8.5); tx(`${q.clientData.name}   CI: ${q.clientData.ci||'—'}   Tel: ${q.clientData.phone||'—'}`, ML+20, y);
    y += 6;
    nm(); sz(8); sc(MUT); tx(`Válida hasta: ${fmtDate(q.validUntil)}`, ML, y);
    y += 6; doc.line(ML,y,MR,y); y += 4;

    // Items table
    doc.autoTable({
      startY: y, margin:{ left:ML, right:PW-MR },
      head:[['#','DESCRIPCIÓN','P. UNIT.','CANT.','SUBTOTAL']],
      body: q.items.map((item,i) => [
        { content: i+1, styles:{halign:'center'} },
        item.name,
        { content: `$${item.unitPrice.toFixed(2)}`, styles:{halign:'right'} },
        { content: item.qty, styles:{halign:'center'} },
        { content: `$${item.subtotal.toFixed(2)}`, styles:{halign:'right'} },
      ]),
      headStyles:{ fillColor:DK, textColor:WHT, fontStyle:'bold', fontSize:8, cellPadding:3 },
      bodyStyles:{ fontSize:8, cellPadding:2.5, textColor:TXT },
      columnStyles:{ 0:{cellWidth:10}, 1:{cellWidth:100}, 2:{cellWidth:24}, 3:{cellWidth:16}, 4:{cellWidth:26} },
      tableLineColor:BRD, tableLineWidth:0.25,
    });
    y = doc.lastAutoTable.finalY + 4;

    // Total
    const sym = cfg.currencySymbol||'Bs.';
    sf([239,246,255]); doc.setFillColor(239,246,255); doc.rect(MR-68,y,68,20,'F');
    nm(); sz(8); sc(MUT); tx('Subtotal:', MR-65, y+6); bl(); sc(TXT); tx(`$${q.subtotal.toFixed(2)}`, MR-2, y+6,{align:'right'});
    if (q.globalDiscount>0) { nm(); sz(8); sc(MUT); tx(`Desc. ${q.globalDiscount}%:`, MR-65, y+12); bl(); sc([220,38,38]); tx(`-$${q.discountAmount.toFixed(2)}`, MR-2, y+12,{align:'right'}); }
    sf([37,99,235]); doc.setFillColor(37,99,235); doc.rect(MR-68,y+14,68,10,'F');
    bl(); sz(9); sc(WHT); tx(`TOTAL ${sym}:`, MR-65, y+20); tx(`${sym} ${q.totalBs.toFixed(2)}`, MR-2, y+20,{align:'right'});
    y += 28;

    if (q.notes) { nm(); sz(7.5); sc(MUT); tx(`Notas: ${q.notes}`, ML, y); y += 7; }

    // QR
    if (qrDataUrl) {
      try { doc.addImage(qrDataUrl,'PNG',ML,y,22,22); } catch(_) {}
      nm(); sz(6.5); sc(MUT); tx('Verificar en:', ML, y+25); tx('validar.html', ML, y+29);
    }
    nm(); sz(7); sc(MUT);
    tx('Esta cotización no constituye un comprobante de venta.', ML+26, y+8);
    tx(`${cfg.name||'ElectroShop'} · ${cfg.phone||''} · ${cfg.email||''}`, ML+26, y+14);

    doc.save(`Cotizacion-${q.id}.pdf`);
    showToast('PDF descargado', 'success');
  },

  /* ---- WHATSAPP ---- */
  sendWhatsApp(id) {
    const q = DB.quotations.find(x => x.id === id);
    if (!q) return;
    const rawPhone = (q.clientData.phone||'').replace(/[^0-9]/g,'');
    const cc = (DB.config.whatsappCountryCode||'591').replace(/[^0-9]/g,'');
    const phone = rawPhone.startsWith(cc) ? rawPhone : cc + rawPhone;
    const sym   = DB.config.currencySymbol || 'Bs.';
    const worker = DB.workers.find(w => w.id === q.createdBy);
    const msg   = (DB.config.whatsappMsg || '¡Hola {cliente}! Te envío la cotización {numero} por un total de {total}. Válida hasta el {vencimiento}. Quedamos a tu disposición.')
      .replace(/\{cliente\}/g,     q.clientData.name)
      .replace(/\{nombre\}/g,      q.clientData.name)
      .replace(/\{usuario\}/g,     worker?.name || '')
      .replace(/\{negocio\}/g,     DB.config.name || 'ElectroShop')
      .replace(/\{numero\}/g,      q.number || q.id)
      .replace(/\{id\}/g,          q.id)
      .replace(/\{total\}/g,       `${sym} ${q.totalBs.toFixed(2)}`)
      .replace(/\{vencimiento\}/g, fmtDate(q.validUntil))
      .replace(/\{fecha\}/g,       fmtDate(q.createdAt));
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  },
};
