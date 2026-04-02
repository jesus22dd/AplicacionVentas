/* =================================================================
   MODULE: Punto de Venta (POS)
   ================================================================= */

const POSModule = {
  cart: [],
  selectedCatId: 'all',
  searchTerm: '',
  selectedCustomerId: 'CU20',
  paymentMethod: 'efectivo',
  discountPct: 0,
  lastSale: null,
  sortDesc: false,

  render() {
    return `
    <div class="page-header" style="margin-bottom:12px">
      <div class="page-title">
        <h2>Punto de Venta</h2>
        <p>Registra ventas rápidamente</p>
      </div>
      <div class="d-flex gap-8">
        <button class="btn btn-sm pos-currency-btn" id="currencyToggleBtn" onclick="POSModule.toggleCurrency()" title="Cambiar visualización de moneda">
          <i class="fas fa-exchange-alt"></i> <span id="currencyLabel">${DB.config.displayCurrency||'Bs.'}</span>
        </button>
        <button class="btn btn-secondary" onclick="navigate('sales')"><i class="fas fa-history"></i> Historial</button>
      </div>
    </div>

    <!-- Mobile tab switcher (only visible on small screens) -->
    <div class="pos-mobile-tabs" id="posMobileTabs">
      <button class="pos-mtab active" id="mtabCatalog" onclick="POSModule.setMobileTab('catalog')">
        <i class="fas fa-th"></i> Catálogo
      </button>
      <button class="pos-mtab" id="mtabCart" onclick="POSModule.setMobileTab('cart')">
        <i class="fas fa-shopping-cart"></i> Carrito
        <span class="pos-mtab-badge" id="mtabCartBadge" style="display:none">0</span>
      </button>
    </div>

    <div class="pos-layout">
      <!-- LEFT: Product Catalog -->
      <div class="pos-left">
        <div class="pos-search-bar">
          <i class="fas fa-magnifying-glass pos-search-icon"></i>
          <input type="text" class="pos-search-input" id="posSearch"
            placeholder="Buscar producto..." oninput="POSModule.onSearch(this.value)" />
          <button class="btn btn-sm pos-sort-btn" id="posSortBtn" onclick="POSModule.toggleSort()" title="Más antiguos primero">
            <i class="fas fa-arrow-down-wide-short"></i>
          </button>
          <button class="btn btn-sm pos-clear-btn" onclick="POSModule.clearSearch()" title="Limpiar búsqueda"><i class="fas fa-xmark"></i></button>
        </div>
        <div class="pos-cat-tabs" id="posCatTabs">
          <button class="pos-cat-tab active" onclick="POSModule.filterCat('all',this)">
            <i class="fas fa-th"></i> Todos
          </button>
          ${DB.categories.map(c=>`
          <button class="pos-cat-tab" onclick="POSModule.filterCat('${c.id}',this)" style="border-color:transparent">
            <i class="fas ${c.icon}" style="color:${c.color}"></i> ${c.name}
          </button>`).join('')}
        </div>
        <div class="pos-products-grid" id="posProductGrid">
          ${this._renderProducts()}
        </div>
      </div>

      <!-- RIGHT: Cart -->
      <div class="pos-right">
        <div class="cart-header">
          <div class="cart-title">
            <i class="fas fa-shopping-cart" style="color:var(--primary)"></i>
            Carrito
            <span class="cart-count" id="cartCount">0</span>
          </div>
          <button class="btn btn-sm btn-outline-danger" onclick="POSModule.clearCart()" title="Vaciar carrito">
            <i class="fas fa-trash"></i>
          </button>
        </div>

        <div class="cart-items" id="cartItems">
          <div class="cart-empty" id="cartEmpty">
            <i class="fas fa-shopping-cart"></i>
            <p>Carrito vacío</p>
            <span style="font-size:12px;color:var(--text-3)">Selecciona productos del catálogo</span>
          </div>
        </div>

        <div class="cart-footer">
          <!-- Discount -->
          <div class="discount-row">
            <input type="number" id="posDiscount" min="0" max="100" value="0"
              oninput="POSModule.onDiscount(this.value)" placeholder="Desc. %" />
            <span>% Descuento</span>
          </div>

          <!-- Totals -->
          <div class="cart-totals">
            <div class="cart-total-row"><span>Subtotal:</span><span id="cartSubtotal">${fmt(0)}</span></div>
            <div class="cart-total-row" style="color:var(--danger)"><span>Descuento:</span><span id="cartDiscount">-${fmt(0)}</span></div>
            <div class="cart-total-row"><span>IVA (${DB.config.iva}%):</span><span id="cartTax">${fmt(0)}</span></div>
            <div class="cart-total-row total"><span>TOTAL:</span><span id="cartTotal">${fmt(0)}</span></div>
          </div>

          <button class="btn btn-success w-100 btn-lg" onclick="POSModule.checkout()">
            <i class="fas fa-check-circle"></i> Registrar Venta
          </button>
        </div>
      </div>
    </div>

    <!-- FAB "Ver carrito" para móvil -->
    <button class="pos-cart-fab" id="posCartFab" onclick="POSModule.setMobileTab('cart')" style="display:none">
      <i class="fas fa-shopping-cart"></i>
      <span id="posFabCount">0</span> ítem(s) — Ver carrito
    </button>
    `;
  },

  init() {
    this.cart = [];
    this.selectedCatId = 'all';
    this.searchTerm = '';
    this.discountPct = 0;
    this.paymentMethod = 'efectivo';
    this.updateCartUI();
  },

  _renderProducts() {
    let prods = DB.products.filter(p => p.status === 'active');
    if (this.selectedCatId !== 'all') {
      prods = prods.filter(p => p.catId === this.selectedCatId);
    }
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term));
    }
    if (this.sortDesc) prods = prods.slice().reverse();
    if (prods.length === 0) {
      return `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-search"></i><h4>Sin resultados</h4><p>Intenta con otro término</p></div>`;
    }
    return prods.map(p => {
      const cat = DB.getCat(p.catId);
      const outOfStock = p.stock <= 0;
      return `
      <div class="pos-product-card${outOfStock?' out-of-stock':''}"
        onclick="${outOfStock?'':` POSModule.addToCart('${p.id}')`}">
        ${p.image
          ? `<div class="prod-icon lg" style="padding:0;overflow:hidden"><img src="${p.image}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm)" /></div>`
          : `<div class="prod-icon lg" style="background:${cat?cat.bg:'#f1f5f9'};color:${cat?cat.color:'#94a3b8'}"><i class="fas ${cat?cat.icon:'fa-box'}"></i></div>`
        }
        <div class="pos-prod-name">${p.name}</div>
        <div class="pos-prod-price">${fmt(p.sellP)}</div>
        <div class="pos-prod-stock">${outOfStock?'<span style="color:var(--danger)">Sin stock</span>':`Stock: ${p.stock}`}</div>
        ${!outOfStock?`<div style="font-size:10px;color:var(--text-3)">${p.code}</div>`:''}
      </div>`;
    }).join('');
  },

  filterCat(catId, btn) {
    this.selectedCatId = catId;
    document.querySelectorAll('.pos-cat-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('posProductGrid').innerHTML = this._renderProducts();
  },

  onSearch(val) {
    this.searchTerm = val;
    document.getElementById('posProductGrid').innerHTML = this._renderProducts();
  },

  clearSearch() {
    document.getElementById('posSearch').value = '';
    this.searchTerm = '';
    document.getElementById('posProductGrid').innerHTML = this._renderProducts();
  },

  toggleSort() {
    this.sortDesc = !this.sortDesc;
    const btn = document.getElementById('posSortBtn');
    if (btn) {
      btn.querySelector('i').className = this.sortDesc ? 'fas fa-arrow-up-wide-short' : 'fas fa-arrow-down-wide-short';
      btn.title = this.sortDesc ? 'Más recientes primero (activo)' : 'Más antiguos primero';
      btn.classList.toggle('active', this.sortDesc);
    }
    document.getElementById('posProductGrid').innerHTML = this._renderProducts();
  },

  toggleCurrency() {
    const cfg = DB.config;
    if (cfg.displayCurrency === 'USD') {
      cfg.displayCurrency = 'Bs.';
      cfg.currencySymbol  = 'Bs.';
    } else {
      cfg.displayCurrency = 'USD';
      cfg.currencySymbol  = '$';
    }
    saveDBConfig();
    this.updateTotals();
    document.getElementById('posProductGrid').innerHTML = this._renderProducts();
    const lbl = document.getElementById('currencyLabel');
    if (lbl) lbl.textContent = cfg.displayCurrency;
    const btn = document.getElementById('currencyToggleBtn');
    if (btn) btn.classList.toggle('active', cfg.displayCurrency === 'USD');
    showToast(`Precios en ${cfg.displayCurrency === 'USD' ? 'Dólares (USD)' : 'Bolivianos (Bs.)'}`, 'info');
  },

  addToCart(prodId) {
    const p = DB.getProd(prodId);
    if (!p || p.stock <= 0) return;
    const existing = this.cart.find(i => i.prodId === prodId);
    if (existing) {
      if (existing.qty >= p.stock) { showToast('No hay más stock disponible', 'warning'); return; }
      existing.qty++;
      existing.subtotal = +(existing.qty * existing.price).toFixed(2);
    } else {
      this.cart.push({ prodId, name:p.name, price:p.sellP, qty:1, subtotal:p.sellP, catId:p.catId });
    }
    this.updateCartUI();
    showToast(`${p.name} agregado`, 'success');
  },

  removeFromCart(prodId) {
    this.cart = this.cart.filter(i => i.prodId !== prodId);
    this.updateCartUI();
  },

  changeQty(prodId, delta) {
    const item = this.cart.find(i => i.prodId === prodId);
    if (!item) return;
    const p = DB.getProd(prodId);
    const newQty = item.qty + delta;
    if (newQty <= 0) { this.removeFromCart(prodId); return; }
    if (newQty > p.stock) { showToast('Stock insuficiente', 'warning'); return; }
    item.qty = newQty;
    item.subtotal = +(newQty * item.price).toFixed(2);
    this.updateCartUI();
  },

  selectCustomer(id) { this.selectedCustomerId = id; },

  setMobileTab(tab) {
    if (window.innerWidth > 768) return;
    const left  = document.querySelector('.pos-left');
    const right = document.querySelector('.pos-right');
    const tabCat  = document.getElementById('mtabCatalog');
    const tabCart = document.getElementById('mtabCart');
    if (!left || !right) return;
    if (tab === 'catalog') {
      left.style.display  = 'flex';
      right.style.display = 'none';
      tabCat?.classList.add('active');
      tabCart?.classList.remove('active');
    } else {
      left.style.display  = 'none';
      right.style.display = 'flex';
      tabCat?.classList.remove('active');
      tabCart?.classList.add('active');
      const fab = document.getElementById('posCartFab');
      if (fab) fab.style.display = 'none';
    }
  },

  onDiscount(val) {
    this.discountPct = Math.min(100, Math.max(0, parseFloat(val)||0));
    this.updateTotals();
  },

  _calcCashChange() {
    const total = this._calcTotal().total;
    const received = parseFloat(document.getElementById('chkCash')?.value) || 0;
    const change = Math.max(0, received - total);
    const el = document.getElementById('chkChange');
    if (el) el.textContent = fmt(change);
  },

  _calcTotal() {
    const subtotal = this.cart.reduce((s,i)=>s+i.subtotal, 0);
    const discountAmt = +(subtotal * this.discountPct / 100).toFixed(2);
    const afterDisc = +(subtotal - discountAmt).toFixed(2);
    const taxRate = (DB.config.iva || 12) / 100;
    const tax = +(afterDisc * taxRate).toFixed(2);
    const total = +(afterDisc + tax).toFixed(2);
    return { subtotal, discountAmt, tax, total };
  },

  updateTotals() {
    const { subtotal, discountAmt, tax, total } = this._calcTotal();
    document.getElementById('cartSubtotal').textContent = fmt(subtotal);
    document.getElementById('cartDiscount').textContent = '-'+fmt(discountAmt);
    document.getElementById('cartTax').textContent = fmt(tax);
    document.getElementById('cartTotal').textContent = fmt(total);
  },

  updateCartUI() {
    const count = this.cart.reduce((s,i)=>s+i.qty,0);
    document.getElementById('cartCount').textContent = count;

    // Mobile badge + FAB
    const badge = document.getElementById('mtabCartBadge');
    const fab   = document.getElementById('posCartFab');
    const fabCount = document.getElementById('posFabCount');
    if (badge) { badge.textContent = count; badge.style.display = count > 0 ? '' : 'none'; }
    const isMobile = window.innerWidth <= 768;
    const catalogVisible = isMobile && (!document.querySelector('.pos-right') || document.querySelector('.pos-right').style.display === 'none');
    if (fab && fabCount) {
      fabCount.textContent = count;
      fab.style.display = isMobile && count > 0 && catalogVisible ? 'flex' : 'none';
    }

    const itemsEl = document.getElementById('cartItems');
    if (this.cart.length === 0) {
      itemsEl.innerHTML = `<div class="cart-empty" id="cartEmpty"><i class="fas fa-shopping-cart"></i><p>Carrito vacío</p><span style="font-size:12px;color:var(--text-3)">Selecciona productos del catálogo</span></div>`;
      document.getElementById('cartSubtotal').textContent = fmt(0);
      document.getElementById('cartDiscount').textContent = '-' + fmt(0);
      document.getElementById('cartTax').textContent = fmt(0);
      document.getElementById('cartTotal').textContent = fmt(0);
      return;
    }

    itemsEl.innerHTML = this.cart.map(item => {
      const cat = DB.getCat(item.catId);
      return `
      <div class="cart-item">
        <div class="cart-item-icon" style="background:${cat?cat.bg:'#f1f5f9'};color:${cat?cat.color:'#94a3b8'}">
          <i class="fas ${cat?cat.icon:'fa-box'}"></i>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${fmt(item.price)} c/u</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="POSModule.changeQty('${item.prodId}',-1)"><i class="fas fa-minus"></i></button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="POSModule.changeQty('${item.prodId}',1)"><i class="fas fa-plus"></i></button>
        </div>
        <div class="cart-item-subtotal">${fmt(item.subtotal)}</div>
        <button class="cart-item-del" onclick="POSModule.removeFromCart('${item.prodId}')"><i class="fas fa-xmark"></i></button>
      </div>`;
    }).join('');

    this.updateTotals();
  },

  clearCart() {
    if (this.cart.length === 0) return;
    openConfirm('Vaciar carrito', '¿Deseas eliminar todos los productos del carrito?', ()=>{
      this.cart = [];
      this.updateCartUI();
    });
  },

  checkout() {
    if (this.cart.length === 0) { showToast('El carrito está vacío', 'warning'); return; }

    const { subtotal, discountAmt, tax, total } = this._calcTotal();
    const cfg = DB.config;

    openModal('Confirmar Venta', `
    <form onsubmit="POSModule.confirmSale(event)" autocomplete="off">

      <!-- ── PASO 1: RESUMEN ── -->
      <div style="margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <div style="width:24px;height:24px;border-radius:50%;background:var(--primary);color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center">1</div>
          <span style="font-weight:700;font-size:14px">Resumen del Pedido</span>
        </div>
        <div style="background:var(--bg);border-radius:var(--radius);overflow:hidden">
          <div style="max-height:160px;overflow-y:auto">
            ${this.cart.map(item => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;border-bottom:1px solid var(--border);font-size:13px">
              <span style="font-weight:500">${item.name} <span style="color:var(--text-3)">×${item.qty}</span></span>
              <span style="font-weight:700">${fmt(item.subtotal)}</span>
            </div>`).join('')}
          </div>
          <div style="padding:10px 14px;display:flex;flex-direction:column;gap:4px;border-top:2px solid var(--border)">
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-2)"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
            ${discountAmt > 0 ? `<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--danger)"><span>Descuento (${this.discountPct}%)</span><span>-${fmt(discountAmt)}</span></div>` : ''}
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-2)"><span>IVA (${cfg.iva}%)</span><span>${fmt(tax)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;color:var(--primary);padding-top:6px;border-top:1px solid var(--border);margin-top:4px"><span>TOTAL</span><span>${fmt(total)}</span></div>
          </div>
        </div>
      </div>

      <!-- ── PASO 2: CLIENTE ── -->
      <div style="margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <div style="width:24px;height:24px;border-radius:50%;background:var(--purple);color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center">2</div>
          <span style="font-weight:700;font-size:14px">Datos del Cliente</span>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <button type="button" class="chk-type-btn active" id="btnTypeFinal" onclick="POSModule._setClientType('final')">
            <i class="fas fa-user-slash"></i> Consumidor Final
          </button>
          <button type="button" class="chk-type-btn" id="btnTypeReg" onclick="POSModule._setClientType('registered')">
            <i class="fas fa-users"></i> Cliente Registrado
          </button>
          <button type="button" class="chk-type-btn" id="btnTypeManual" onclick="POSModule._setClientType('manual')">
            <i class="fas fa-user-pen"></i> Datos Manuales
          </button>
        </div>

        <!-- Consumidor final (por defecto, no muestra nada extra) -->
        <div id="clientFinalInfo" style="padding:10px 14px;background:var(--bg);border-radius:var(--radius-sm);font-size:13px;color:var(--text-2)">
          <i class="fas fa-info-circle"></i> La venta se registrará como <strong>Consumidor Final</strong> sin datos adicionales.
        </div>

        <!-- Cliente registrado -->
        <div id="clientRegInfo" style="display:none">
          <div style="position:relative">
            <input class="form-control" id="chkCustSearch" placeholder="Buscar cliente por nombre o CI..."
              oninput="POSModule._searchCustomer(this.value)"
              onblur="setTimeout(()=>{const r=document.getElementById('chkCustResults');if(r)r.style.display='none';},200)"
              autocomplete="off" />
            <div id="chkCustResults" style="position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid var(--border);border-radius:var(--radius-sm);max-height:160px;overflow-y:auto;z-index:9999;display:none;box-shadow:0 4px 12px rgba(0,0,0,.12)"></div>
            <input type="hidden" name="custId" id="chkCustId" value="" />
            <div id="chkCustSelected" style="display:none;margin-top:6px;background:var(--bg);border-radius:var(--radius-sm);padding:8px 12px;font-size:13px;color:var(--text-2)"></div>
          </div>
        </div>

        <!-- Datos manuales -->
        <div id="clientManualInfo" style="display:none">
          <div class="form-grid form-grid-2" style="gap:8px">
            <div class="form-group" style="margin:0">
              <label style="font-size:12px">Nombre Completo</label>
              <input class="form-control" name="manualName" id="chkManualName" placeholder="Juan Pérez" />
            </div>
            <div class="form-group" style="margin:0">
              <label style="font-size:12px">CI / NIT</label>
              <input class="form-control" name="manualRuc" id="chkManualRuc" placeholder="12345678" />
            </div>
          </div>
        </div>

        <input type="hidden" name="clientType" id="chkClientType" value="final" />
      </div>

      <!-- ── PASO 3: PAGO ── -->
      <div style="margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <div style="width:24px;height:24px;border-radius:50%;background:var(--secondary);color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center">3</div>
          <span style="font-weight:700;font-size:14px">Método de Pago</span>
        </div>
        <div class="payment-methods" style="margin-bottom:10px">
          <button type="button" class="pay-method active" id="pmEfectivo" onclick="POSModule._setChkPayment('efectivo')">
            <i class="fas fa-money-bill-wave"></i>Efectivo
          </button>
          <button type="button" class="pay-method" id="pmTarjeta" onclick="POSModule._setChkPayment('tarjeta')">
            <i class="fas fa-credit-card"></i>Tarjeta
          </button>
          <button type="button" class="pay-method" id="pmTransfer" onclick="POSModule._setChkPayment('transferencia')">
            <i class="fas fa-building-columns"></i>Transfer.
          </button>
          <button type="button" class="pay-method" id="pmQr" onclick="POSModule._setChkPayment('qr')">
            <i class="fas fa-qrcode"></i>QR
          </button>
          <button type="button" class="pay-method" id="pmDelivery" onclick="POSModule._setChkPayment('delivery')">
            <i class="fas fa-motorcycle"></i>Delivery
          </button>
        </div>
        <div id="chkDeliverySection" style="display:none;margin-bottom:8px">
          <input class="form-control" name="deliveryAddress" id="chkDeliveryAddr"
            placeholder="Dirección de entrega (requerido para delivery)..." />
        </div>
        <div id="chkCashSection">
          <div style="display:flex;align-items:center;gap:10px;background:var(--bg);border-radius:var(--radius-sm);padding:10px 14px">
            <div style="flex:1">
              <label style="font-size:12px;color:var(--text-2);font-weight:600">Monto recibido (USD)</label>
              <input class="form-control" type="number" name="cashReceived" id="chkCash" min="${total}" step="0.50"
                placeholder="${fmt(total)}" oninput="POSModule._calcCashChange()" style="margin-top:4px" />
            </div>
            <div style="text-align:right">
              <div style="font-size:11px;color:var(--text-3);font-weight:600">CAMBIO</div>
              <div style="font-size:20px;font-weight:800;color:var(--secondary)" id="chkChange">${fmt(0)}</div>
            </div>
          </div>
        </div>
        <input type="hidden" name="paymentMethod" id="chkPaymentMethod" value="efectivo" />
      </div>

      <div class="modal-footer" style="padding-top:0">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()"><i class="fas fa-xmark"></i> Cancelar</button>
        <button type="submit" class="btn btn-success btn-checkout-confirm">
          <i class="fas fa-check-circle" style="font-size:16px;flex-shrink:0"></i>
          <span class="checkout-btn-text">
            <span class="checkout-btn-label">Confirmar Venta</span>
            <span class="checkout-btn-total">${fmt(total)}</span>
          </span>
        </button>
      </div>
    </form>`, 'modal-lg');
  },

  _setClientType(type) {
    document.getElementById('chkClientType').value = type;
    ['final','reg','manual'].forEach(t => {
      document.getElementById('clientFinalInfo').style.display  = t === 'final'  ? (type==='final'  ? 'block':'none') : document.getElementById('clientFinalInfo').style.display;
      document.getElementById('clientRegInfo').style.display    = type === 'registered' ? 'block' : 'none';
      document.getElementById('clientManualInfo').style.display = type === 'manual'     ? 'block' : 'none';
      document.getElementById('clientFinalInfo').style.display  = type === 'final'      ? 'block' : 'none';
    });
    ['btnTypeFinal','btnTypeReg','btnTypeManual'].forEach(id => document.getElementById(id).classList.remove('active'));
    const map = { final:'btnTypeFinal', registered:'btnTypeReg', manual:'btnTypeManual' };
    document.getElementById(map[type]).classList.add('active');
  },

  _setChkPayment(method) {
    document.getElementById('chkPaymentMethod').value = method;
    ['pmEfectivo','pmTarjeta','pmTransfer','pmQr','pmDelivery'].forEach(id => document.getElementById(id).classList.remove('active'));
    const map = { efectivo:'pmEfectivo', tarjeta:'pmTarjeta', transferencia:'pmTransfer', qr:'pmQr', delivery:'pmDelivery' };
    document.getElementById(map[method]).classList.add('active');
    document.getElementById('chkCashSection').style.display     = method === 'efectivo' ? 'block' : 'none';
    document.getElementById('chkDeliverySection').style.display = method === 'delivery' ? 'block' : 'none';
  },

  _searchCustomer(val) {
    const results = document.getElementById('chkCustResults');
    if (!val.trim()) { results.style.display = 'none'; return; }
    const term = val.toLowerCase();
    const matches = DB.customers.filter(c =>
      c.id !== 'CU20' && (c.name.toLowerCase().includes(term) || (c.ruc||'').includes(term) || (c.phone||'').includes(term))
    );
    if (!matches.length) {
      results.innerHTML = `<div style="padding:10px 12px;font-size:13px;color:var(--text-3)">Sin resultados</div>`;
    } else {
      results.innerHTML = matches.slice(0, 8).map(c => `
        <div style="padding:8px 12px;font-size:13px;cursor:pointer;border-bottom:1px solid var(--border)"
          onmousedown="POSModule._selectCustomer('${c.id}')"
          onmouseover="this.style.background='var(--bg-2)'" onmouseout="this.style.background=''">
          <div style="font-weight:600">${c.name}</div>
          <div style="font-size:11px;color:var(--text-3)">${c.ruc||'Sin CI'} &nbsp;·&nbsp; ${c.phone||''}</div>
        </div>`).join('');
    }
    results.style.display = 'block';
  },

  _selectCustomer(id) {
    const c = DB.getCustomer(id);
    if (!c) return;
    document.getElementById('chkCustId').value      = id;
    document.getElementById('chkCustSearch').value  = c.name;
    document.getElementById('chkCustResults').style.display = 'none';
    const sel = document.getElementById('chkCustSelected');
    sel.innerHTML = `<i class="fas fa-user-check" style="color:var(--secondary)"></i>&nbsp; <b>${c.name}</b>${c.ruc?' &nbsp;·&nbsp; CI '+c.ruc:''}${c.phone?' &nbsp;·&nbsp; '+c.phone:''}`;
    sel.style.display = 'block';
  },

  confirmSale(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { subtotal, discountAmt, tax, total } = this._calcTotal();

    const clientType   = fd.get('clientType');
    const payMethod    = fd.get('paymentMethod');
    const cashReceived = parseFloat(fd.get('cashReceived')) || 0;

    let custId   = 'CU20';
    let custName = 'Consumidor Final';
    let custRuc  = '';

    if (clientType === 'registered') {
      custId = fd.get('custId') || 'CU20';
      const cust = DB.getCustomer(custId);
      custName = cust ? cust.name : 'Consumidor Final';
      custRuc  = cust ? (cust.ruc || '') : '';
    } else if (clientType === 'manual') {
      custId   = 'CU20';
      custName = fd.get('manualName')?.trim() || 'Consumidor Final';
      custRuc  = fd.get('manualRuc')?.trim() || '';
    }

    if (payMethod === 'efectivo' && cashReceived > 0 && cashReceived < total) {
      showToast('El monto recibido es menor al total', 'warning');
      return;
    }

    if (payMethod === 'delivery' && !fd.get('deliveryAddress')?.trim()) {
      showToast('Ingresa la dirección de entrega', 'warning');
      return;
    }

    const worker = currentUser
      ? (DB.getWorker(currentUser.id) || DB.workers[1])
      : DB.workers[1];

    const qrHash = Math.random().toString(36).substring(2, 14);
    const saleId = 'V' + String(DB.nextSaleId).padStart(3,'0');
    DB.nextSaleId++;

    const sale = {
      id: saleId,
      date: nowStr(),
      custId,
      custName,
      custRuc,
      cashReceived: payMethod === 'efectivo' ? cashReceived : 0,
      workId: worker.id,
      workName: worker.name,
      items: this.cart.map(i=>({ pid:i.prodId, name:i.name, qty:i.qty, price:i.price, subtotal:i.subtotal })),
      subtotal, discount: this.discountPct, tax, total,
      method: payMethod,
      deliveryAddress: payMethod === 'delivery' ? (fd.get('deliveryAddress') || '') : '',
      status: 'completed',
      qrHash,
    };

    // Reduce stock
    this.cart.forEach(item => {
      const p = DB.getProd(item.prodId);
      if (p) { p.stock -= item.qty; p.sold = (p.sold||0) + item.qty; }
    });

    // Update customer points
    if (clientType === 'registered') {
      const cust = DB.getCustomer(custId);
      if (cust && cust.id !== 'CU20') {
        cust.points += Math.floor(total);
        cust.purchases++;
        cust.spent = +(cust.spent + total).toFixed(2);
      }
    }

    DB.sales.push(sale);
    this.lastSale = sale;

    closeModalDirect();
    showToast(`Venta ${saleId} registrada exitosamente`, 'success');
    this.showReceipt(sale);
    this.cart = [];
    this.discountPct = 0;
    document.getElementById('posDiscount').value = 0;
    this.updateCartUI();
    document.getElementById('posProductGrid').innerHTML = this._renderProducts();
    updateNotifDot();
  },

  showReceipt(sale) {
    const cfg = DB.config;
    const discAmt = +(sale.subtotal * sale.discount / 100).toFixed(2);
    const received = sale.cashReceived || 0;
    const change = sale.method === 'efectivo' && received > 0 ? Math.max(0, received - sale.total) : 0;
    const rucLabel = sale.custRuc ? sale.custRuc : '—';
    const tpl = cfg.receiptTemplate || 'T1';

    // ── Shared helpers ────────────────────────────────────────────────
    const logoBig  = cfg.logoImg ? `<img src="${cfg.logoImg}" style="width:52px;height:52px;object-fit:contain;border-radius:6px;margin-bottom:6px;display:block;margin-left:auto;margin-right:auto" />` : '';
    const logoMd   = cfg.logoImg ? `<img src="${cfg.logoImg}" style="width:44px;height:44px;object-fit:contain;border-radius:5px;background:rgba(255,255,255,.15);padding:2px;display:block;margin-left:auto;margin-right:auto;margin-bottom:6px" />` : '';
    const logoSide = cfg.logoImg ? `<img src="${cfg.logoImg}" style="width:44px;height:44px;object-fit:contain;border-radius:5px;flex-shrink:0" />` : '';
    const pL = {efectivo:'Efectivo',tarjeta:'Tarjeta',transferencia:'Transferencia',qr:'QR',delivery:'Delivery'};
    const payRows = `
      <div style="display:flex;justify-content:space-between;padding:3px 0;font-size:11.5px"><span style="color:#64748b">Método:</span><span><b>${pL[sale.method]||sale.method}</b></span></div>
      ${sale.method==='efectivo'&&received>0?`<div style="display:flex;justify-content:space-between;padding:2px 0;font-size:11.5px"><span style="color:#64748b">Recibido:</span><span>${fmt(received)}</span></div><div style="display:flex;justify-content:space-between;padding:2px 0;font-size:11.5px"><span style="color:#64748b">Cambio:</span><span>${fmt(change)}</span></div>`:''}
      ${sale.method==='delivery'&&sale.deliveryAddress?`<div style="display:flex;justify-content:space-between;padding:2px 0;font-size:11.5px"><span style="color:#64748b">Dirección:</span><span style="text-align:right;max-width:55%">${sale.deliveryAddress}</span></div>`:''}`;
    // ── QR: placeholder div en el template; QRCode se renderiza en el canvas DOM después ──
    // html2canvas captura <canvas> nativamente — mucho más fiable que <img src="data:...">
    const qrSection = sale.qrHash ? `
      <div style="text-align:center;padding:18px 0 10px;border-top:1px solid #e2e8f0;margin-top:14px">
        <div style="font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:.8px;margin-bottom:10px">VERIFICAR DOCUMENTO</div>
        <div style="display:inline-block;padding:8px;border:1px solid #e2e8f0;border-radius:8px;background:#fff">
          <div id="_posQrTarget" style="width:96px;height:96px"></div>
        </div>
        <div style="font-size:9px;color:#cbd5e1;margin-top:8px">Escanea para verificar la autenticidad</div>
      </div>` : '';

    // ── T1: Clásico Corporativo (centrado, bleed oscuro, HR, totales doble borde) ──
    const _T1 = () => {
      const rows = sale.items.map((i,idx)=>`
        <tr style="background:${idx%2===0?'#f8fafc':'#fff'}">
          <td style="font-size:12px;padding:7px 10px;border-bottom:1px solid #e2e8f0;word-break:break-word;line-height:1.4">${i.name}</td>
          <td style="font-size:12px;padding:7px 8px;text-align:center;border-bottom:1px solid #e2e8f0;white-space:nowrap;color:#64748b">${i.qty}</td>
          <td style="font-size:12px;padding:7px 10px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;color:#64748b">${fmt(i.price)}</td>
          <td style="font-size:12px;padding:7px 10px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;font-weight:700">${fmt(i.subtotal)}</td>
        </tr>`).join('');
      return `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#0f172a">
        <div style="background:#0f172a;color:#fff;padding:18px 24px;text-align:center;margin:-24px -24px 16px;border-radius:8px 8px 0 0">
          ${logoMd}
          <div style="font-size:17px;font-weight:800;letter-spacing:1px">${cfg.name.toUpperCase()}</div>
          <div style="font-size:10px;opacity:.6;margin-top:3px">${cfg.legalName} · RUC: ${cfg.ruc}</div>
          <div style="font-size:10px;opacity:.5">${cfg.address}, ${cfg.city} · Tel: ${cfg.phone}</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:4px 0;margin-bottom:10px">
          <span style="color:#64748b">Factura: <b style="color:#0f172a">${sale.id}</b></span>
          <span style="color:#64748b">${fmtDatetime(sale.date)}</span>
          <span style="color:#64748b">Cajero: <b style="color:#0f172a">${sale.workName}</b></span>
        </div>
        <div style="border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:8px 12px;margin-bottom:12px">
          <div style="font-size:9px;font-weight:700;letter-spacing:.6px;color:#94a3b8;margin-bottom:3px">CLIENTE</div>
          <div style="font-size:13px;font-weight:700">${sale.custName}</div>
          ${rucLabel!=='—'?`<div style="font-size:11px;color:#64748b">CI/NIT: ${rucLabel}</div>`:''}
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
          <colgroup><col/><col style="width:32px"/><col style="width:72px"/><col style="width:72px"/></colgroup>
          <thead><tr style="background:#f1f5f9;border-bottom:2px solid #334155">
            <th style="text-align:left;padding:7px 10px;font-size:10px;font-weight:700;color:#475569;letter-spacing:.4px">PRODUCTO</th>
            <th style="text-align:center;padding:7px 8px;font-size:10px;font-weight:700;color:#475569">CANT</th>
            <th style="text-align:right;padding:7px 10px;font-size:10px;font-weight:700;color:#475569">P. UNIT.</th>
            <th style="text-align:right;padding:7px 10px;font-size:10px;font-weight:700;color:#475569">SUBT.</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="display:flex;justify-content:flex-end;margin-bottom:10px">
          <div style="min-width:220px">
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>Subtotal:</span><span>${fmt(sale.subtotal)}</span></div>
            ${discAmt>0?`<div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#475569"><span>Descuento (${sale.discount}%):</span><span>-${fmt(discAmt)}</span></div>`:''}
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>IVA (${cfg.iva}%):</span><span>${fmt(sale.tax)}</span></div>
            <div style="border-top:2px solid #0f172a;border-bottom:2px solid #0f172a;display:flex;justify-content:space-between;padding:7px 0;font-size:16px;font-weight:900;margin-top:6px">
              <span>TOTAL</span><span>${fmt(sale.total)}</span>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid #e2e8f0;padding-top:8px;margin-bottom:8px">${payRows}</div>
        <div style="text-align:center;font-size:11px;color:#64748b;border-top:1px dashed #e2e8f0;padding-top:10px;margin-top:4px">
          <div>${cfg.receiptMsg||''}</div>
          <div style="margin-top:2px;font-size:10px">${cfg.invoiceFooter||''}</div>
          <div style="margin-top:2px;font-size:10px">${cfg.website||''}</div>
        </div>
        ${qrSection}
      </div>`;
    };

    // ── T2: Ejecutivo Bilateral (logo izq + factura der, 2 tarjetas grises) ──
    const _T2 = () => {
      const rows = sale.items.map((i,idx)=>`
        <tr style="background:${idx%2===0?'#f8fafc':'#fff'}">
          <td style="font-size:12px;padding:7px 10px;border-bottom:1px solid #e2e8f0;word-break:break-word;line-height:1.4">${i.name}</td>
          <td style="font-size:12px;padding:7px 8px;text-align:center;border-bottom:1px solid #e2e8f0;white-space:nowrap;color:#64748b">${i.qty}</td>
          <td style="font-size:12px;padding:7px 10px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;color:#64748b">${fmt(i.price)}</td>
          <td style="font-size:12px;padding:7px 10px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;font-weight:700">${fmt(i.subtotal)}</td>
        </tr>`).join('');
      return `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#0f172a">
        <div style="background:#1e293b;color:#fff;padding:14px 20px;margin:-24px -24px 14px;border-radius:8px 8px 0 0;display:flex;align-items:center;gap:14px">
          ${logoSide}
          <div style="flex:1;min-width:0">
            <div style="font-size:15px;font-weight:800">${cfg.name.toUpperCase()}</div>
            <div style="font-size:10px;opacity:.6;margin-top:2px">${cfg.legalName}</div>
            <div style="font-size:10px;opacity:.5">${cfg.address}, ${cfg.city} · Tel: ${cfg.phone}</div>
          </div>
          <div style="text-align:right;flex-shrink:0;padding-left:14px;border-left:1px solid rgba(255,255,255,.15)">
            <div style="font-size:9px;opacity:.5;letter-spacing:.6px">FACTURA</div>
            <div style="font-size:18px;font-weight:900">${sale.id}</div>
            <div style="font-size:10px;opacity:.5;margin-top:2px">${fmtDatetime(sale.date)}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
          <div style="background:#f8fafc;border-radius:6px;padding:9px 12px;border-top:3px solid #334155">
            <div style="font-size:9px;font-weight:700;letter-spacing:.6px;color:#94a3b8;margin-bottom:3px">CAJERO</div>
            <div style="font-size:13px;font-weight:700">${sale.workName}</div>
            <div style="font-size:11px;color:#64748b">RUC: ${cfg.ruc}</div>
          </div>
          <div style="background:#f8fafc;border-radius:6px;padding:9px 12px;border-top:3px solid #334155">
            <div style="font-size:9px;font-weight:700;letter-spacing:.6px;color:#94a3b8;margin-bottom:3px">CLIENTE</div>
            <div style="font-size:13px;font-weight:700">${sale.custName}</div>
            ${rucLabel!=='—'?`<div style="font-size:11px;color:#64748b">CI: ${rucLabel}</div>`:'<div style="font-size:11px;color:#94a3b8">Sin CI</div>'}
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
          <colgroup><col/><col style="width:32px"/><col style="width:72px"/><col style="width:72px"/></colgroup>
          <thead><tr style="background:#1e293b">
            <th style="text-align:left;padding:8px 10px;font-size:10px;font-weight:600;color:#94a3b8;letter-spacing:.4px">PRODUCTO</th>
            <th style="text-align:center;padding:8px;font-size:10px;font-weight:600;color:#94a3b8">CANT</th>
            <th style="text-align:right;padding:8px 10px;font-size:10px;font-weight:600;color:#94a3b8">P. UNIT.</th>
            <th style="text-align:right;padding:8px 10px;font-size:10px;font-weight:600;color:#94a3b8">SUBT.</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="display:flex;justify-content:flex-end;margin-bottom:10px">
          <div style="min-width:220px">
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>Subtotal:</span><span>${fmt(sale.subtotal)}</span></div>
            ${discAmt>0?`<div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#475569"><span>Descuento (${sale.discount}%):</span><span>-${fmt(discAmt)}</span></div>`:''}
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>IVA (${cfg.iva}%):</span><span>${fmt(sale.tax)}</span></div>
            <div style="background:#1e293b;color:#fff;display:flex;justify-content:space-between;padding:10px 14px;border-radius:6px;font-size:16px;font-weight:800;margin-top:8px">
              <span>TOTAL</span><span>${fmt(sale.total)}</span>
            </div>
          </div>
        </div>
        <div style="background:#f8fafc;border-radius:6px;padding:8px 12px;margin-bottom:10px">${payRows}</div>
        <div style="text-align:center;font-size:11px;color:#64748b;border-top:1px dashed #e2e8f0;padding-top:10px">
          <div>${cfg.receiptMsg||''}</div>
          <div style="font-size:10px;margin-top:2px">${cfg.website||''}</div>
        </div>
        ${qrSection}
      </div>`;
    };

    // ── T3: Minimalista (tipografía grande, sin fondos de color, tabla limpia) ──
    const _T3 = () => {
      const rows = sale.items.map(i=>`
        <tr>
          <td style="font-size:12px;padding:7px 0;border-bottom:1px solid #f1f5f9;word-break:break-word;line-height:1.4">${i.name}</td>
          <td style="font-size:12px;padding:7px 8px;text-align:center;border-bottom:1px solid #f1f5f9;white-space:nowrap;color:#94a3b8">${i.qty}</td>
          <td style="font-size:12px;padding:7px 0;text-align:right;border-bottom:1px solid #f1f5f9;white-space:nowrap;color:#94a3b8">${fmt(i.price)}</td>
          <td style="font-size:12px;padding:7px 0 7px 10px;text-align:right;border-bottom:1px solid #f1f5f9;white-space:nowrap;font-weight:600">${fmt(i.subtotal)}</td>
        </tr>`).join('');
      return `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#0f172a">
        <div style="padding:18px 24px 14px;margin:-24px -24px 16px;border-bottom:3px solid #0f172a;display:flex;justify-content:space-between;align-items:flex-end">
          <div style="display:flex;align-items:center;gap:12px">
            ${logoSide}
            <div>
              <div style="font-size:19px;font-weight:900;letter-spacing:.5px">${cfg.name.toUpperCase()}</div>
              <div style="font-size:11px;color:#64748b;margin-top:2px">${cfg.legalName}</div>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:10px;color:#94a3b8;letter-spacing:.5px">FACTURA</div>
            <div style="font-size:21px;font-weight:900;color:#334155">${sale.id}</div>
            <div style="font-size:11px;color:#64748b">${fmtDatetime(sale.date)}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#64748b;margin-bottom:14px">
          <span>Cliente: <b style="color:#0f172a">${sale.custName}</b>${rucLabel!=='—'?' · CI: '+rucLabel:''}</span>
          <span>Cajero: <b style="color:#0f172a">${sale.workName}</b></span>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
          <colgroup><col/><col style="width:32px"/><col style="width:72px"/><col style="width:72px"/></colgroup>
          <thead><tr style="border-bottom:2px solid #0f172a">
            <th style="text-align:left;padding:5px 0;font-size:10px;font-weight:700;color:#475569;letter-spacing:.4px">PRODUCTO</th>
            <th style="text-align:center;padding:5px 8px;font-size:10px;font-weight:700;color:#475569">CANT</th>
            <th style="text-align:right;padding:5px 0;font-size:10px;font-weight:700;color:#475569">P. UNIT.</th>
            <th style="text-align:right;padding:5px 0 5px 10px;font-size:10px;font-weight:700;color:#475569">SUBT.</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>Subtotal:</span><span>${fmt(sale.subtotal)}</span></div>
        ${discAmt>0?`<div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#475569"><span>Descuento (${sale.discount}%):</span><span>-${fmt(discAmt)}</span></div>`:''}
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>IVA (${cfg.iva}%):</span><span>${fmt(sale.tax)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:22px;font-weight:900;padding:10px 0;border-top:3px solid #0f172a;margin-top:8px">
          <span>TOTAL</span><span>${fmt(sale.total)}</span>
        </div>
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid #f1f5f9">${payRows}</div>
        <div style="text-align:center;font-size:11px;color:#64748b;margin-top:12px;padding-top:8px;border-top:1px solid #f1f5f9">
          <div>${cfg.receiptMsg||''}</div>
          <div style="font-size:10px;margin-top:2px">${cfg.website||''}</div>
        </div>
        ${qrSection}
      </div>`;
    };

    // ── T4: Institucional (3-col header strip, tabla con bordes completos, firma) ──
    const _T4 = () => {
      const rows = sale.items.map(i=>`
        <tr>
          <td style="font-size:12px;padding:7px 10px;border:1px solid #e2e8f0;word-break:break-word;line-height:1.4">${i.name}</td>
          <td style="font-size:12px;padding:7px 8px;text-align:center;border:1px solid #e2e8f0;white-space:nowrap">${i.qty}</td>
          <td style="font-size:12px;padding:7px 10px;text-align:right;border:1px solid #e2e8f0;white-space:nowrap">${fmt(i.price)}</td>
          <td style="font-size:12px;padding:7px 10px;text-align:right;border:1px solid #e2e8f0;white-space:nowrap;font-weight:700">${fmt(i.subtotal)}</td>
        </tr>`).join('');
      return `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#0f172a">
        <div style="background:#1e293b;color:#fff;padding:14px 24px;margin:-24px -24px 0;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;gap:12px">
          ${logoMd}
          <div style="text-align:center">
            <div style="font-size:16px;font-weight:800">${cfg.name.toUpperCase()}</div>
            <div style="font-size:10px;opacity:.6;margin-top:2px">${cfg.legalName} · RUC: ${cfg.ruc}</div>
            <div style="font-size:10px;opacity:.5">${cfg.address}, ${cfg.city} · Tel: ${cfg.phone}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;border:1px solid #e2e8f0;border-top:none;margin:0 0 12px;border-radius:0 0 6px 6px;overflow:hidden">
          <div style="padding:9px 12px;border-right:1px solid #e2e8f0">
            <div style="font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:.6px;margin-bottom:3px">N° FACTURA</div>
            <div style="font-size:13px;font-weight:800">${sale.id}</div>
            <div style="font-size:10px;color:#64748b;margin-top:1px">${fmtDatetime(sale.date)}</div>
          </div>
          <div style="padding:9px 12px;border-right:1px solid #e2e8f0">
            <div style="font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:.6px;margin-bottom:3px">CLIENTE</div>
            <div style="font-size:13px;font-weight:700">${sale.custName}</div>
            <div style="font-size:10px;color:#64748b">${rucLabel!=='—'?'CI: '+rucLabel:'—'}</div>
          </div>
          <div style="padding:9px 12px">
            <div style="font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:.6px;margin-bottom:3px">ATENDIDO POR</div>
            <div style="font-size:13px;font-weight:700">${sale.workName}</div>
            <div style="font-size:10px;color:#64748b">${cfg.city}</div>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px;border:1px solid #e2e8f0">
          <colgroup><col/><col style="width:32px"/><col style="width:72px"/><col style="width:72px"/></colgroup>
          <thead><tr style="background:#334155;color:#fff">
            <th style="text-align:left;padding:7px 10px;font-size:10px;font-weight:600;letter-spacing:.4px">DESCRIPCIÓN</th>
            <th style="text-align:center;padding:7px 8px;font-size:10px;font-weight:600">CANT</th>
            <th style="text-align:right;padding:7px 10px;font-size:10px;font-weight:600">P. UNIT.</th>
            <th style="text-align:right;padding:7px 10px;font-size:10px;font-weight:600">SUBTOTAL</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start;margin-bottom:10px">
          <div>
            <div style="font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:.5px;margin-bottom:6px">PAGO</div>
            ${payRows}
          </div>
          <div style="min-width:200px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden">
            <div style="padding:6px 12px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:12px;color:#64748b"><span>Subtotal</span><span>${fmt(sale.subtotal)}</span></div>
            ${discAmt>0?`<div style="padding:6px 12px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:12px;color:#64748b"><span>Descuento (${sale.discount}%)</span><span>-${fmt(discAmt)}</span></div>`:''}
            <div style="padding:6px 12px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:12px;color:#64748b"><span>IVA (${cfg.iva}%)</span><span>${fmt(sale.tax)}</span></div>
            <div style="padding:8px 12px;display:flex;justify-content:space-between;font-size:15px;font-weight:900;background:#334155;color:#fff"><span>TOTAL</span><span>${fmt(sale.total)}</span></div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:14px;padding-top:12px;border-top:1px solid #e2e8f0">
          <div style="border-top:1px solid #94a3b8;padding-top:4px;text-align:center;font-size:10px;color:#94a3b8">Firma del Cliente</div>
          <div style="border-top:1px solid #94a3b8;padding-top:4px;text-align:center;font-size:10px;color:#94a3b8">Firma del Cajero</div>
        </div>
        <div style="text-align:center;font-size:11px;color:#64748b;margin-top:10px;padding-top:8px;border-top:1px dashed #e2e8f0">
          <div>${cfg.receiptMsg||''}</div><div style="font-size:10px;margin-top:2px">${cfg.website||''}</div>
        </div>
        ${qrSection}
      </div>`;
    };

    // ── T5: Formal (banda oscura con 3 columnas internas, tabla centrada) ────
    const _T5 = () => {
      const rows = sale.items.map((i,idx)=>`
        <tr style="background:${idx%2===0?'#f8fafc':'#fff'}">
          <td style="font-size:12px;padding:7px 10px;border-bottom:1px solid #e2e8f0;word-break:break-word;line-height:1.4">${i.name}</td>
          <td style="font-size:12px;padding:7px 8px;text-align:center;border-bottom:1px solid #e2e8f0;white-space:nowrap;color:#64748b">${i.qty}</td>
          <td style="font-size:12px;padding:7px 10px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;color:#64748b">${fmt(i.price)}</td>
          <td style="font-size:12px;padding:7px 10px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;font-weight:700">${fmt(i.subtotal)}</td>
        </tr>`).join('');
      return `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#0f172a">
        <div style="background:#334155;color:#fff;padding:14px 20px;margin:-24px -24px 14px;border-radius:8px 8px 0 0">
          <div style="display:flex;align-items:center;gap:14px;justify-content:center">
            ${logoSide}
            <div style="text-align:center">
              <div style="font-size:16px;font-weight:800;letter-spacing:.5px">${cfg.name.toUpperCase()}</div>
              <div style="font-size:10px;opacity:.65;margin-top:2px">${cfg.legalName} · RUC: ${cfg.ruc}</div>
              <div style="font-size:10px;opacity:.5">${cfg.address}, ${cfg.city} · Tel: ${cfg.phone}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;margin-top:10px;border-top:1px solid rgba(255,255,255,.15);padding-top:8px">
            <div style="text-align:center;padding:0 8px;border-right:1px solid rgba(255,255,255,.15)">
              <div style="font-size:9px;opacity:.5;letter-spacing:.5px">FACTURA N°</div>
              <div style="font-size:15px;font-weight:800">${sale.id}</div>
            </div>
            <div style="text-align:center;padding:0 8px;border-right:1px solid rgba(255,255,255,.15)">
              <div style="font-size:9px;opacity:.5;letter-spacing:.5px">FECHA</div>
              <div style="font-size:11px;font-weight:600">${fmtDatetime(sale.date)}</div>
            </div>
            <div style="text-align:center;padding:0 8px">
              <div style="font-size:9px;opacity:.5;letter-spacing:.5px">CAJERO</div>
              <div style="font-size:13px;font-weight:700">${sale.workName}</div>
            </div>
          </div>
        </div>
        <div style="background:#f8fafc;border-radius:6px;padding:9px 14px;margin-bottom:12px">
          <div style="font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:.6px;margin-bottom:3px">CLIENTE</div>
          <div style="font-size:14px;font-weight:700">${sale.custName}</div>
          ${rucLabel!=='—'?`<div style="font-size:11px;color:#64748b">CI/NIT: ${rucLabel}</div>`:''}
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
          <colgroup><col/><col style="width:32px"/><col style="width:72px"/><col style="width:72px"/></colgroup>
          <thead><tr style="background:#334155;color:#fff">
            <th style="text-align:left;padding:8px 10px;font-size:10px;font-weight:600;letter-spacing:.4px">PRODUCTO</th>
            <th style="text-align:center;padding:8px;font-size:10px;font-weight:600">CANT</th>
            <th style="text-align:right;padding:8px 10px;font-size:10px;font-weight:600">P. UNIT.</th>
            <th style="text-align:right;padding:8px 10px;font-size:10px;font-weight:600">SUBT.</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="display:flex;justify-content:flex-end;margin-bottom:10px">
          <div style="min-width:220px">
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>Subtotal:</span><span>${fmt(sale.subtotal)}</span></div>
            ${discAmt>0?`<div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#475569"><span>Descuento (${sale.discount}%):</span><span>-${fmt(discAmt)}</span></div>`:''}
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>IVA (${cfg.iva}%):</span><span>${fmt(sale.tax)}</span></div>
            <div style="background:#334155;color:#fff;display:flex;justify-content:space-between;padding:10px 14px;border-radius:6px;font-size:16px;font-weight:800;margin-top:8px">
              <span>TOTAL</span><span>${fmt(sale.total)}</span>
            </div>
          </div>
        </div>
        <div style="background:#f8fafc;border-radius:6px;padding:8px 12px;margin-bottom:10px">${payRows}</div>
        <div style="text-align:center;font-size:11px;color:#64748b;border-top:1px dashed #e2e8f0;padding-top:10px">
          <div>${cfg.receiptMsg||''}</div>
          <div style="font-size:10px;margin-top:2px">${cfg.website||''}</div>
        </div>
        ${qrSection}
      </div>`;
    };

    // ── T6: Acento Lateral (border-left en header y secciones, totales enmarcados) ──
    const _T6 = () => {
      const rows = sale.items.map((i,idx)=>`
        <tr style="background:${idx%2===0?'#f8fafc':'#fff'}">
          <td style="font-size:12px;padding:7px 10px;border-bottom:1px solid #e2e8f0;word-break:break-word;line-height:1.4">${i.name}</td>
          <td style="font-size:12px;padding:7px 8px;text-align:center;border-bottom:1px solid #e2e8f0;white-space:nowrap;color:#64748b">${i.qty}</td>
          <td style="font-size:12px;padding:7px 10px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;color:#64748b">${fmt(i.price)}</td>
          <td style="font-size:12px;padding:7px 10px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;font-weight:700">${fmt(i.subtotal)}</td>
        </tr>`).join('');
      return `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#0f172a">
        <div style="background:#f8fafc;padding:14px 20px;margin:-24px -24px 14px;border-radius:8px 8px 0 0;border-bottom:1px solid #e2e8f0;border-left:5px solid #475569;display:flex;align-items:center;justify-content:space-between;gap:12px">
          <div style="display:flex;align-items:center;gap:12px">
            ${logoSide}
            <div>
              <div style="font-size:15px;font-weight:800;color:#0f172a">${cfg.name.toUpperCase()}</div>
              <div style="font-size:10px;color:#64748b;margin-top:2px">${cfg.legalName}</div>
              <div style="font-size:10px;color:#64748b">${cfg.address}, ${cfg.city} · Tel: ${cfg.phone}</div>
            </div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:9px;color:#94a3b8;letter-spacing:.5px">FACTURA</div>
            <div style="font-size:17px;font-weight:900;color:#334155">${sale.id}</div>
            <div style="font-size:10px;color:#64748b">${fmtDatetime(sale.date)}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
          <div style="border-left:4px solid #475569;padding:8px 12px;background:#f8fafc;border-radius:0 6px 6px 0">
            <div style="font-size:9px;font-weight:700;letter-spacing:.6px;color:#94a3b8;margin-bottom:3px">CLIENTE</div>
            <div style="font-size:13px;font-weight:700">${sale.custName}</div>
            ${rucLabel!=='—'?`<div style="font-size:11px;color:#64748b">CI: ${rucLabel}</div>`:''}
          </div>
          <div style="border-left:4px solid #475569;padding:8px 12px;background:#f8fafc;border-radius:0 6px 6px 0">
            <div style="font-size:9px;font-weight:700;letter-spacing:.6px;color:#94a3b8;margin-bottom:3px">CAJERO / EMISIÓN</div>
            <div style="font-size:13px;font-weight:700">${sale.workName}</div>
            <div style="font-size:11px;color:#64748b">RUC: ${cfg.ruc}</div>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
          <colgroup><col/><col style="width:32px"/><col style="width:72px"/><col style="width:72px"/></colgroup>
          <thead><tr style="background:#f1f5f9;border-bottom:2px solid #475569">
            <th style="text-align:left;padding:8px 10px;font-size:10px;font-weight:700;color:#334155;letter-spacing:.4px">PRODUCTO</th>
            <th style="text-align:center;padding:8px;font-size:10px;font-weight:700;color:#334155">CANT</th>
            <th style="text-align:right;padding:8px 10px;font-size:10px;font-weight:700;color:#334155">P. UNIT.</th>
            <th style="text-align:right;padding:8px 10px;font-size:10px;font-weight:700;color:#334155">SUBT.</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="display:flex;justify-content:flex-end;margin-bottom:10px">
          <div style="min-width:220px;border-left:4px solid #475569;padding-left:14px">
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>Subtotal:</span><span>${fmt(sale.subtotal)}</span></div>
            ${discAmt>0?`<div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#475569"><span>Descuento (${sale.discount}%):</span><span>-${fmt(discAmt)}</span></div>`:''}
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>IVA (${cfg.iva}%):</span><span>${fmt(sale.tax)}</span></div>
            <div style="border-top:2px solid #334155;display:flex;justify-content:space-between;padding:8px 0 0;font-size:16px;font-weight:900;margin-top:6px">
              <span>TOTAL</span><span>${fmt(sale.total)}</span>
            </div>
          </div>
        </div>
        <div style="border-left:4px solid #475569;padding:8px 12px;background:#f8fafc;border-radius:0 6px 6px 0;margin-bottom:10px">${payRows}</div>
        <div style="text-align:center;font-size:11px;color:#64748b;border-top:1px dashed #e2e8f0;padding-top:10px">
          <div>${cfg.receiptMsg||''}</div>
          <div style="font-size:10px;margin-top:2px">${cfg.website||''}</div>
        </div>
        ${qrSection}
      </div>`;
    };

    const _builders = { T1:_T1, T2:_T2, T3:_T3, T4:_T4, T5:_T5, T6:_T6 };
    document.getElementById('receiptContent').innerHTML = (_builders[tpl] || _T1)();

    // Renderizar QRCode directamente en el div placeholder del DOM.
    // qrcodejs dibuja un <canvas> ahí mismo — html2canvas lo captura nativamente.
    if (sale.qrHash && window.QRCode) {
      const qrTarget = document.getElementById('_posQrTarget');
      if (qrTarget) {
        try {
          new QRCode(qrTarget, {
            text: `${location.origin}${location.pathname.replace('index.html','')}validar.html?id=${sale.id}&hash=${sale.qrHash}&tipo=venta`,
            width: 96, height: 96, colorDark: '#0f172a', colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M,
          });
        } catch(_) {}
      }
    }
    document.getElementById('receiptOverlay').classList.add('open');
  },
};

function closeReceipt() {
  document.getElementById('receiptOverlay').classList.remove('open');
}
function printReceipt() { window.print(); }
function sendReceiptWhatsApp() {
  const sale = POSModule.lastSale;
  if (!sale) { showToast('No hay venta activa', 'warning'); return; }
  const cust = DB.customers.find(c => c.id === sale.custId);
  const rawPhone = ((cust && (cust.phone || cust.mobile)) || '').replace(/[^0-9]/g, '');
  if (!rawPhone) { showToast('El cliente no tiene número registrado', 'warning'); return; }
  const cc = (DB.config.whatsappCountryCode || '591').replace(/[^0-9]/g, '');
  const phone = rawPhone.startsWith(cc) ? rawPhone : cc + rawPhone;
  const msg = (DB.config.whatsappMsg || 'Hola {cliente}, gracias por tu compra en {negocio}. Factura N° {numero} por {total}. ¡Gracias por elegirnos!')
    .replace(/\{cliente\}/g,    sale.custName)
    .replace(/\{nombre\}/g,     sale.custName)
    .replace(/\{usuario\}/g,    sale.workName || '')
    .replace(/\{negocio\}/g,    DB.config.name || 'ElectroShop')
    .replace(/\{numero\}/g,     sale.id)
    .replace(/\{id\}/g,         sale.id)
    .replace(/\{total\}/g,      fmt(sale.total))
    .replace(/\{vencimiento\}/g,'')
    .replace(/\{fecha\}/g,      sale.date ? sale.date.split(' ')[0] : '');
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}
function downloadReceiptPDF() {
  const sale = POSModule.lastSale;
  if (!sale) return;
  if (!window.html2canvas) { showToast('Error: dependencia no cargada', 'error'); return; }

  const overlay = document.getElementById('receiptOverlay');
  const wasOpen = overlay.classList.contains('open');
  if (!wasOpen) POSModule.showReceipt(sale);
  showToast('Generando PDF...', 'info');

  // ── Generar QR off-screen (EXACTAMENTE igual que quotations.js) ──
  // html2canvas no puede capturar canvas de terceros (qrcodejs) — usamos doc.addImage() directo
  let _qrDiv = null;
  if (sale.qrHash && window.QRCode) {
    _qrDiv = document.createElement('div');
    _qrDiv.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:128px;height:128px;';
    document.body.appendChild(_qrDiv);
    try {
      new QRCode(_qrDiv, {
        text: `${location.origin}${location.pathname.replace('index.html','')}validar.html?id=${sale.id}&hash=${sale.qrHash}&tipo=venta`,
        width: 128, height: 128, correctLevel: QRCode.CorrectLevel.M,
      });
    } catch(_) {}
  }

  // Esperar 260ms: QR off-screen renderizado + DOM listo (showReceipt es síncrono)
  setTimeout(() => {
    // Leer QR data URL del canvas off-screen (ya renderizado)
    let qrDataUrl = null;
    if (_qrDiv) {
      const qrCanvas = _qrDiv.querySelector('canvas');
      qrDataUrl = qrCanvas ? qrCanvas.toDataURL('image/png') : null;
      try { document.body.removeChild(_qrDiv); } catch(_) {}
    }

    const el = document.getElementById('receiptContent');
    if (!el) return;

    // Forzar 794px (A4 @ 96dpi) antes de captura
    const A4W_PX = 794;
    const savedStyle = el.getAttribute('style') || '';
    el.style.setProperty('width',     A4W_PX + 'px', 'important');
    el.style.setProperty('min-width', A4W_PX + 'px', 'important');
    el.style.setProperty('max-width', A4W_PX + 'px', 'important');
    void el.offsetHeight; // reflow a 794px

    // Medir posición exacta del placeholder QR en el layout a 794px
    let qrInfo = null;
    if (qrDataUrl) {
      const qrTarget = document.getElementById('_posQrTarget');
      if (qrTarget) {
        const elRect = el.getBoundingClientRect();
        const qrRect = qrTarget.getBoundingClientRect();
        qrInfo = {
          top:  qrRect.top  - elRect.top,   // relativo al top de #receiptContent
          left: qrRect.left - elRect.left,  // relativo al left de #receiptContent
          w:    qrRect.width  || 96,
          h:    qrRect.height || 96,
        };
      }
    }

    const captureH = el.scrollHeight;
    const restore = () => el.setAttribute('style', savedStyle);

    html2canvas(el, {
      scale: 3, backgroundColor: '#ffffff', useCORS: true, allowTaint: true,
      logging: false, width: A4W_PX, height: captureH, windowWidth: A4W_PX,
    }).then(canvas => {
      restore();
      const { jsPDF } = window.jspdf;
      const imgData = canvas.toDataURL('image/png');
      const ML = 14, MT = 10, CW = 182, A4H = 297;
      const imgHmm = (canvas.height / canvas.width) * CW;
      const pagesCount = Math.ceil((MT + imgHmm) / A4H);
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      for (let i = 0; i < pagesCount; i++) {
        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'PNG', ML, MT - i * A4H, CW, imgHmm);
      }

      // ── Añadir QR al PDF vía doc.addImage — igual que quotations.js ──
      // Posicionar en las coordenadas exactas del placeholder medido en el DOM
      if (qrDataUrl && qrInfo) {
        const scale = CW / A4W_PX;              // mm por pixel a 794px de ancho
        const qrX  = ML + qrInfo.left * scale;
        const qrW  = qrInfo.w * scale;
        const qrH  = qrInfo.h * scale;
        const absY = MT + qrInfo.top  * scale;  // Y desde top de página 1
        const pgIdx = Math.floor(absY / A4H);
        const qrY  = absY - pgIdx * A4H;
        if (pgIdx < pagesCount) {
          doc.setPage(pgIdx + 1);
          doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrW, qrH);
        }
      }

      doc.save(`Factura-${sale.id}.pdf`);
      if (!wasOpen) closeReceipt();
    }).catch(err => { restore(); console.error(err); showToast('Error al generar PDF', 'error'); });
  }, 260);
}
