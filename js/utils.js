/* =================================================================
   UTILS — Shared helper functions
   ================================================================= */

/* ---- Config persistence ---- */
function saveDBConfig() {
  try { localStorage.setItem('es_config', JSON.stringify(DB.config)); } catch(e) {}
}

/* ---- Currency ---- */
function formatPrice(usdAmount) {
  const cfg = DB.config;
  const n = Number(usdAmount) || 0;
  if ((cfg.displayCurrency || 'Bs.') === 'USD') {
    return '$' + n.toFixed(2);
  }
  const rate = cfg.exchangeRate || 9.35;
  const sym  = cfg.currencySymbol || 'Bs.';
  return sym + ' ' + (n * rate).toFixed(2);
}
const fmt = formatPrice; // backward-compat alias
const fmtNum = (n) => Number(n).toLocaleString('es-BO');

/* ---- Date ---- */
const fmtDate = (str) => {
  const d = new Date(str.replace(' ', 'T'));
  return d.toLocaleDateString('es-BO', { day:'2-digit', month:'2-digit', year:'numeric' });
};
const fmtDatetime = (str) => {
  const d = new Date(str.replace(' ', 'T'));
  return d.toLocaleDateString('es-BO', { day:'2-digit', month:'2-digit', year:'numeric' })
    + ' ' + d.toLocaleTimeString('es-BO', { hour:'2-digit', minute:'2-digit' });
};
const todayStr = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
};
const nowStr = () => {
  const d = new Date();
  return todayStr() + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
};

/* ---- Modal ---- */
function openModal(title, bodyHtml, size = '') {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  const box = document.getElementById('modalBox');
  box.className = 'modal-box' + (size ? ' ' + size : '');
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('open');
}
function closeModalDirect() {
  document.getElementById('modalOverlay').classList.remove('open');
}

/* ---- Confirm dialog ---- */
let _confirmCallback = null;
function openConfirm(title, msg, cb) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  _confirmCallback = cb;
  document.getElementById('confirmOverlay').classList.add('open');
}
function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
  _confirmCallback = null;
}
document.getElementById('confirmOkBtn').addEventListener('click', () => {
  if (_confirmCallback) _confirmCallback();
  closeConfirm();
});

/* ---- Toast ---- */
function showToast(msg, type = 'success') {
  const icons = { success:'fa-circle-check', error:'fa-circle-xmark', warning:'fa-triangle-exclamation', info:'fa-circle-info' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icons[type]||icons.info}"></i><span>${msg}</span><button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-xmark"></i></button>`;
  document.getElementById('toastContainer').appendChild(t);

  let dismissed = false;
  function dismiss(dir) {
    if (dismissed) return;
    dismissed = true;
    t.style.transition = 'transform .25s ease, opacity .25s ease';
    t.style.transform  = `translateX(${dir > 0 ? '120%' : '-120%'})`;
    t.style.opacity    = '0';
    setTimeout(() => t.remove(), 270);
  }

  const autoTimer = setTimeout(() => dismiss(1), 3500);

  // Swipe to dismiss (left or right)
  let startX = 0, currentX = 0;
  t.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX; currentX = 0;
    t.style.transition = 'none';
  }, { passive: true });
  t.addEventListener('touchmove', e => {
    currentX = e.touches[0].clientX - startX;
    t.style.transform = `translateX(${currentX}px)`;
    t.style.opacity   = String(Math.max(0, 1 - Math.abs(currentX) / 150));
  }, { passive: true });
  t.addEventListener('touchend', () => {
    if (Math.abs(currentX) > 60) {
      clearTimeout(autoTimer);
      dismiss(currentX > 0 ? 1 : -1);
    } else {
      t.style.transition = 'transform .2s ease, opacity .2s ease';
      t.style.transform  = 'translateX(0)';
      t.style.opacity    = '1';
    }
    currentX = 0;
  });
}

/* ---- Product icon ---- */
function prodIcon(catId, size = '') {
  const cat = DB.getCat(catId);
  if (!cat) return `<div class="prod-icon ${size}" style="background:#f1f5f9;color:#94a3b8"><i class="fas fa-box"></i></div>`;
  return `<div class="prod-icon ${size}" style="background:${cat.bg};color:${cat.color}"><i class="fas ${cat.icon}"></i></div>`;
}

/* ---- Stock badge ---- */
function stockBadge(stock, minStock) {
  if (stock <= 0)             return `<span class="badge badge-danger"><i class="fas fa-circle-xmark"></i>Sin stock</span>`;
  if (stock <= minStock)      return `<span class="badge badge-warning"><i class="fas fa-triangle-exclamation"></i>${stock} uds</span>`;
  return `<span class="badge badge-success"><i class="fas fa-circle-check"></i>${stock} uds</span>`;
}

/* ---- Status badge ---- */
function statusBadge(status) {
  return status === 'active'
    ? `<span class="badge badge-success"><i class="fas fa-circle"></i> Activo</span>`
    : `<span class="badge badge-gray"><i class="fas fa-circle"></i> Inactivo</span>`;
}

/* ---- Payment badge ---- */
function payBadge(method) {
  const map = {
    efectivo:      ['badge-success', 'fa-money-bill-wave',   'Efectivo'],
    tarjeta:       ['badge-primary', 'fa-credit-card',       'Tarjeta'],
    transferencia: ['badge-purple',  'fa-building-columns',  'Transferencia'],
    qr:            ['badge-warning', 'fa-qrcode',            'QR'],
    delivery:      ['badge-orange',  'fa-motorcycle',        'Delivery'],
  };
  const [cls, icon, label] = map[method] || ['badge-gray','fa-question','Otro'];
  return `<span class="badge ${cls}"><i class="fas ${icon}"></i>${label}</span>`;
}

/* ---- Pagination ---- */
function paginate(items, page, perPage = 10) {
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    pages: Math.ceil(items.length / perPage),
    page,
  };
}
function paginationHTML(pag, onPageChange) {
  if (pag.pages <= 1) return '';
  let btns = '';
  for (let i = 1; i <= pag.pages; i++) {
    btns += `<button class="page-btn${i===pag.page?' active':''}" onclick="${onPageChange}(${i})">${i}</button>`;
  }
  return `<div class="pagination">
    <span class="page-info">Mostrando ${Math.min((pag.page-1)*10+1,pag.total)}–${Math.min(pag.page*10,pag.total)} de ${pag.total}</span>
    <button class="page-btn" onclick="${onPageChange}(${pag.page-1})" ${pag.page===1?'disabled':''}>‹</button>
    ${btns}
    <button class="page-btn" onclick="${onPageChange}(${pag.page+1})" ${pag.page===pag.pages?'disabled':''}>›</button>
  </div>`;
}

/* ---- Chart instances manager ---- */
const Charts = {
  _instances: {},
  create(id, type, data, options = {}) {
    if (this._instances[id]) { this._instances[id].destroy(); }
    const ctx = document.getElementById(id);
    if (!ctx) return;
    this._instances[id] = new Chart(ctx.getContext('2d'), { type, data, options });
    return this._instances[id];
  },
  destroy(id) {
    if (this._instances[id]) { this._instances[id].destroy(); delete this._instances[id]; }
  },
  destroyAll() {
    Object.keys(this._instances).forEach(id => this.destroy(id));
  }
};

/* ---- Generate ID ---- */
function genId(prefix, num) {
  return prefix + String(num).padStart(3, '0');
}

/* ---- Person avatar color ---- */
const AVATAR_COLORS = ['#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#06b6d4','#f97316','#ec4899'];
function avatarColor(idx) { return AVATAR_COLORS[idx % AVATAR_COLORS.length]; }

/* ---- Customer type badge ---- */
function custTypeBadge(type) {
  const map = { vip:['badge-purple','fa-crown','VIP'], frecuente:['badge-primary','fa-star','Frecuente'], normal:['badge-gray','fa-user','Normal'] };
  const [cls,icon,label] = map[type] || ['badge-gray','fa-user','Normal'];
  return `<span class="badge ${cls}"><i class="fas ${icon}"></i>${label}</span>`;
}

/* ---- Format money for receipt ---- */
function padRight(str, len) { return String(str).padEnd(len, ' '); }
function padLeft(str, len)  { return String(str).padStart(len, ' '); }

/* ================================================================
   PROFESSIONAL INVOICE PDF GENERATOR
   ================================================================ */
function generateInvoicePDF(sale, receivedCash = 0) {
  const { jsPDF } = window.jspdf;
  const cfg  = DB.config;
  const cust = DB.getCustomer(sale.custId);
  const doc  = new jsPDF({ unit: 'mm', format: 'a4' });

  const PW  = 210;   // page width
  const ML  = 14;    // margin left
  const MR  = 196;   // margin right edge
  const CW  = 182;   // content width

  // ── Color palette ──────────────────────────────────────────
  const C_PRIMARY   = [37,  99,  235];   // #2563eb
  const C_DARK      = [15,  23,  42 ];   // #0f172a
  const C_GRAY_BG   = [248, 250, 252];   // #f8fafc
  const C_GRAY_MID  = [241, 245, 249];   // #f1f5f9
  const C_BORDER    = [226, 232, 240];   // #e2e8f0
  const C_TEXT      = [30,  41,  59 ];   // #1e293b
  const C_MUTED     = [100, 116, 139];   // #64748b
  const C_WHITE     = [255, 255, 255];
  const C_GOLD      = [245, 158, 11 ];   // #f59e0b
  const C_GREEN     = [16,  185, 129];   // #10b981
  const C_RED       = [239, 68,  68 ];   // #ef4444

  // ── Helpers ─────────────────────────────────────────────────
  const setFill   = (c) => doc.setFillColor(...c);
  const setStroke = (c) => doc.setDrawColor(...c);
  const setColor  = (c) => doc.setTextColor(...c);
  const bold      = ()  => doc.setFont('helvetica','bold');
  const normal    = ()  => doc.setFont('helvetica','normal');
  const sz        = (s) => doc.setFontSize(s);
  const rect      = (x,y,w,h,s='F') => doc.rect(x,y,w,h,s);
  const line      = (x1,y1,x2,y2)   => doc.line(x1,y1,x2,y2);
  const txt       = (t,x,y,opts={}) => doc.text(String(t),x,y,opts);

  const discAmt   = +(sale.subtotal * (sale.discount||0) / 100).toFixed(2);
  const invoiceNum= `${cfg.invoicePrefix}-${String(sale.invoiceSeq || DB.config.invoiceSeq).padStart(9,'0')}`;
  const accessKey = `${fmtDate(sale.date).replace(/\//g,'')}01${cfg.ruc}0010011001002000${String(Math.floor(Math.random()*99999)).padStart(8,'0')}`;

  let y = 0;

  // ═══════════════════════════════════════════════════════════
  // HEADER BAND
  // ═══════════════════════════════════════════════════════════
  setFill(C_PRIMARY); rect(0, 0, PW, 42, 'F');

  // Store logo circle
  setFill([255,255,255,0.15]); doc.circle(ML+11, 18, 11, 'F');
  setFill([255,255,255,0.25]); doc.circle(ML+11, 18, 8, 'F');
  setColor(C_WHITE); bold(); sz(14);
  txt(cfg.logo || cfg.name[0], ML+11, 22, {align:'center'});

  // Store info
  setColor(C_WHITE);
  bold(); sz(17); txt(cfg.name.toUpperCase(), ML+27, 13);
  normal(); sz(8);
  txt(cfg.legalName,              ML+27, 19);
  txt(`${cfg.address}, ${cfg.city}`, ML+27, 24);
  txt(`Tel: ${cfg.phone}  ·  ${cfg.email}`, ML+27, 29);
  txt(`RUC: ${cfg.ruc}  ·  ${cfg.website}`, ML+27, 34);

  // FACTURA badge (right)
  setFill(C_GOLD); rect(138, 5, 58, 32, 'F');
  setColor(C_DARK);
  bold(); sz(15); txt('FACTURA', 167, 16, {align:'center'});
  sz(8); normal();
  txt('COMPROBANTE DE VENTA', 167, 22, {align:'center'});
  bold(); sz(9.5);
  txt(invoiceNum, 167, 30, {align:'center'});

  y = 47;

  // ═══════════════════════════════════════════════════════════
  // INFO ROW: Emission data + Client data (2 columns)
  // ═══════════════════════════════════════════════════════════
  // Left column (emission info)
  setFill(C_GRAY_MID); rect(ML, y, 85, 7, 'F');
  setFill(C_PRIMARY);  rect(ML, y, 3, 7, 'F');
  bold(); sz(7.5); setColor(C_PRIMARY);
  txt('DATOS DE EMISIÓN', ML+6, y+4.8);

  // Right column (client info)
  setFill(C_GRAY_MID); rect(ML+89, y, CW-89, 7, 'F');
  setFill(C_GREEN);    rect(ML+89, y, 3, 7, 'F');
  bold(); sz(7.5); setColor(C_GREEN);
  txt('DATOS DEL CLIENTE', ML+95, y+4.8);

  y += 9;
  const rowH = 5.2;

  // Left data
  const emitRows = [
    ['Fecha emisión:', fmtDatetime(sale.date)],
    ['Cajero:',        sale.workName],
    ['Método pago:',   sale.method.toUpperCase()],
    ['Ambiente:',      'PRODUCCIÓN'],
  ];
  emitRows.forEach(([label, val]) => {
    normal(); sz(7.5); setColor(C_MUTED); txt(label, ML+2, y);
    bold(); setColor(C_TEXT); txt(val, ML+32, y);
    y += rowH;
  });

  // Right data (reset y to column start)
  const ry = y - emitRows.length * rowH;
  const clientRows = [
    ['Razón social:', (cust?.name || sale.custName).substring(0,32)],
    ['RUC / CI:',     cust?.ruc || '9999999999'],
    ['Teléfono:',     cust?.phone || '—'],
    ['Dirección:',    (cust?.address || 'Guayaquil, Ecuador').substring(0,28)],
  ];
  let ry2 = ry;
  clientRows.forEach(([label, val]) => {
    normal(); sz(7.5); setColor(C_MUTED); txt(label, ML+91, ry2);
    bold(); setColor(C_TEXT); txt(val, ML+113, ry2);
    ry2 += rowH;
  });

  y += 2;

  // Horizontal rule
  setStroke(C_BORDER); doc.setLineWidth(0.3);
  line(ML, y, MR, y);
  y += 4;

  // ═══════════════════════════════════════════════════════════
  // ITEMS TABLE
  // ═══════════════════════════════════════════════════════════
  doc.autoTable({
    startY: y,
    margin: { left: ML, right: PW - MR },
    head: [['CANT', 'DESCRIPCIÓN DEL PRODUCTO / SERVICIO', 'P. UNITARIO', 'DTO', 'SUBTOTAL']],
    body: sale.items.map(item => [
      { content: item.qty, styles: { halign:'center' } },
      item.name,
      { content: `$${item.price.toFixed(2)}`, styles:{ halign:'right' } },
      { content: (sale.discount||0) > 0 ? `${sale.discount}%` : '—', styles:{ halign:'center' } },
      { content: `$${item.subtotal.toFixed(2)}`, styles:{ halign:'right' } },
    ]),
    headStyles: {
      fillColor: C_DARK,
      textColor: C_WHITE,
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 3,
    },
    bodyStyles: { fontSize: 8, cellPadding: 2.8, textColor: C_TEXT },
    columnStyles: {
      0: { cellWidth: 14 },
      1: { cellWidth: 92 },
      2: { cellWidth: 26 },
      3: { cellWidth: 18 },
      4: { cellWidth: 26 },
    },
    alternateRowStyles: { fillColor: C_GRAY_BG },
    tableLineColor: C_BORDER,
    tableLineWidth: 0.25,
    didDrawPage: () => {},
  });

  y = doc.lastAutoTable.finalY + 5;

  // ═══════════════════════════════════════════════════════════
  // TOTALS SECTION
  // ═══════════════════════════════════════════════════════════
  const TX = MR - 72;  // totals box x
  const TW = 72;       // totals box width

  setFill(C_GRAY_BG); setStroke(C_BORDER); doc.setLineWidth(0.3);
  rect(TX, y, TW, 42, 'FD');

  const totalsData = [
    ['Subtotal base 0%:',  '$0.00'],
    [`Subtotal base ${cfg.iva}%:`, `$${sale.subtotal.toFixed(2)}`],
    ['Descuento:',          discAmt > 0 ? `-$${discAmt.toFixed(2)}` : '$0.00'],
    [`IVA ${cfg.iva}%:`,    `$${sale.tax.toFixed(2)}`],
  ];

  let ty = y + 6;
  totalsData.forEach(([label, val]) => {
    normal(); sz(8); setColor(C_MUTED);
    txt(label, TX+3, ty);
    bold(); setColor(C_TEXT);
    txt(val, TX+TW-3, ty, { align:'right' });
    ty += 7;
  });

  // Separator line inside totals box
  setStroke(C_BORDER); line(TX+2, ty-2, TX+TW-2, ty-2);

  // TOTAL row (colored)
  setFill(C_PRIMARY); rect(TX, ty, TW, 10, 'F');
  bold(); sz(11); setColor(C_WHITE);
  txt('TOTAL:', TX+4, ty+7);
  txt(`$${sale.total.toFixed(2)}`, TX+TW-3, ty+7, { align:'right' });

  // Payment info (left of totals)
  setColor(C_PRIMARY); bold(); sz(8.5);
  txt('INFORMACIÓN DE PAGO', ML, y+5);

  const payRows = [
    ['Método:', sale.method.charAt(0).toUpperCase()+sale.method.slice(1)],
  ];
  if (sale.method === 'efectivo' && receivedCash > 0) {
    payRows.push(['Monto recibido:', `$${receivedCash.toFixed(2)}`]);
    payRows.push(['Cambio:', `$${Math.max(0, receivedCash - sale.total).toFixed(2)}`]);
  }
  let py = y + 12;
  payRows.forEach(([label, val]) => {
    normal(); sz(8); setColor(C_MUTED); txt(label, ML, py);
    bold(); setColor(C_TEXT); txt(val, ML+35, py);
    py += 6;
  });

  // Points earned
  if (sale.custId !== 'CU20') {
    const pts = Math.floor(sale.total);
    setFill([220, 252, 231]); setStroke(C_GREEN); doc.setLineWidth(0.3);
    rect(ML, py, 60, 9, 'FD');
    setColor(C_GREEN); bold(); sz(8);
    txt(`★  +${pts} puntos acumulados`, ML+3, py+6);
  }

  y += 52;

  // ═══════════════════════════════════════════════════════════
  // AUTHORIZATION + BARCODE AREA
  // ═══════════════════════════════════════════════════════════
  setFill(C_GRAY_MID); setStroke(C_BORDER); doc.setLineWidth(0.3);
  rect(ML, y, CW, 24, 'FD');

  setFill(C_PRIMARY); rect(ML, y, 3, 24, 'F');
  bold(); sz(7.5); setColor(C_PRIMARY);
  txt('CLAVE DE ACCESO (SRI)', ML+6, y+5);
  normal(); sz(6.8); setColor(C_TEXT);
  const displayKey = accessKey.substring(0,49);
  txt(displayKey, ML+6, y+10);

  // Simulated barcode (thin rectangles)
  const bcX = ML+6, bcY = y+13, bcH = 7;
  const bars = [2,1,3,1,2,1,1,3,2,1,2,1,3,1,2,1,1,2,3,1,2,1,3,1,2,1,1,3,2,1,2,1,3,1,2,1];
  let bx = bcX;
  bars.forEach((w, i) => {
    if (i % 2 === 0) { setFill(C_DARK); rect(bx, bcY, w*0.8, bcH, 'F'); }
    bx += w * 0.8 + 0.3;
  });

  // Authorized stamp
  setFill([220, 252, 231]); setStroke(C_GREEN); doc.setLineWidth(0.5);
  rect(MR-36, y+5, 34, 14, 'FD');
  setColor(C_GREEN); bold(); sz(7);
  txt('✓ AUTORIZADO', MR-19, y+11, {align:'center'});
  normal(); sz(6); setColor(C_MUTED);
  txt('AMBIENTE: PRODUCCIÓN', MR-19, y+17, {align:'center'});

  y += 30;

  // ═══════════════════════════════════════════════════════════
  // SIGNATURE LINES
  // ═══════════════════════════════════════════════════════════
  setStroke(C_BORDER); doc.setLineWidth(0.4);
  line(ML+5,  y+14, ML+76, y+14);
  line(ML+108, y+14, ML+178, y+14);

  normal(); sz(7.5); setColor(C_MUTED);
  txt('Firma y sello — Empresa', ML+5, y+19);
  txt('Nombre / Firma — Cliente', ML+108, y+19);
  sz(6.5);
  txt(cfg.legalName,    ML+5,   y+24);
  txt('C.I. / RUC: _______________', ML+108, y+24);

  y += 32;

  // ═══════════════════════════════════════════════════════════
  // FOOTER BAR
  // ═══════════════════════════════════════════════════════════
  setFill(C_DARK); rect(0, y, PW, 14, 'F');
  normal(); sz(7.5); setColor([148, 163, 184]);
  txt(cfg.invoiceFooter, PW/2, y+5.5, {align:'center'});
  sz(7); setColor([71, 85, 105]);
  txt(`${cfg.legalName}  ·  RUC: ${cfg.ruc}  ·  ${cfg.website}`, PW/2, y+11, {align:'center'});

  doc.save(`Factura-${invoiceNum}.pdf`);
  return doc;
}

/* ---- Low stock items ---- */
function getLowStockItems() {
  return DB.products.filter(p => p.stock > 0 && p.stock <= p.minStock);
}
function getOutOfStockItems() {
  return DB.products.filter(p => p.stock <= 0);
}

/* ---- Role-based permission helpers ---- */
function _hasPerm(mod, action) {
  if (!currentUser) return false;
  if (!currentUser.roleId) return true; // legacy: allow all
  const role = DB.getRole(currentUser.roleId);
  if (!role) return false;
  const perms = role.permissions[mod];
  return perms ? perms[action] === true : false;
}
function canRead(mod)   { return _hasPerm(mod, 'read');   }
function canCreate(mod) { return _hasPerm(mod, 'create'); }
function canEdit(mod)   { return _hasPerm(mod, 'edit');   }
function canDelete(mod) { return _hasPerm(mod, 'delete'); }

/* ---- Sales summary helpers ---- */
function getTodaySales() {
  const today = todayStr();
  return DB.sales.filter(s => s.date.startsWith(today));
}
function getWeekSales() {
  const d = new Date(); d.setDate(d.getDate() - 7);
  return DB.sales.filter(s => new Date(s.date.replace(' ','T')) >= d);
}
function getMonthSales() {
  const now = new Date();
  return DB.sales.filter(s => {
    const sd = new Date(s.date.replace(' ','T'));
    return sd.getMonth() === now.getMonth() && sd.getFullYear() === now.getFullYear();
  });
}
function salesTotal(arr) { return arr.reduce((sum, s) => sum + s.total, 0); }
