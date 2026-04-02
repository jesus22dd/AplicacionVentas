/* =================================================================
   MODULE: Reportes
   ================================================================= */

const ReportsModule = {
  tab: 'sales',
  _period: 'month',

  _getSales() {
    const p = this._period;
    if (p === 'day')   return getTodaySales();
    if (p === 'week')  return getWeekSales();
    if (p === 'month') return getMonthSales();
    return DB.sales; // 'all'
  },

  _periodLabel() {
    return { day:'Hoy', week:'7 días', month:'Este mes', all:'Todo el tiempo' }[this._period] || 'Este mes';
  },

  setPeriod(p) {
    this._period = p;
    document.querySelectorAll('.rperiod-chip').forEach(c => {
      c.classList.toggle('chip-active', c.dataset.period === p);
    });
    Charts.destroyAll();
    this.renderTab();
  },

  render() {
    const pLabels = { day:'Hoy', week:'7 días', month:'Este mes', all:'Todo' };
    const chips = Object.entries(pLabels).map(([k,v]) => `
      <button class="chip rperiod-chip${this._period===k?' chip-active':''}" data-period="${k}" onclick="ReportsModule.setPeriod('${k}')">${v}</button>`
    ).join('');

    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Reportes y Análisis</h2>
        <p>Informes detallados del negocio</p>
      </div>
      <div class="d-flex gap-8">
        <button class="btn btn-success" onclick="ReportsModule.downloadCurrentPDF()"><i class="fas fa-file-pdf"></i> Exportar PDF</button>
        <button class="btn btn-secondary" onclick="ReportsModule.downloadCurrentCSV()"><i class="fas fa-file-csv"></i> Exportar CSV</button>
      </div>
    </div>

    <div class="chip-bar" style="margin-bottom:12px">${chips}</div>

    <div class="report-tabs">
      <button class="report-tab active" id="rTab-sales" onclick="ReportsModule.switchTab('sales')"><i class="fas fa-chart-line"></i> Ventas</button>
      <button class="report-tab" id="rTab-products" onclick="ReportsModule.switchTab('products')"><i class="fas fa-boxes-stacked"></i> Productos</button>
      <button class="report-tab" id="rTab-inventory" onclick="ReportsModule.switchTab('inventory')"><i class="fas fa-warehouse"></i> Inventario</button>
      <button class="report-tab" id="rTab-profit" onclick="ReportsModule.switchTab('profit')"><i class="fas fa-dollar-sign"></i> Ganancias</button>
      <button class="report-tab" id="rTab-cashiers" onclick="ReportsModule.switchTab('cashiers')"><i class="fas fa-user-tie"></i> Cajeros</button>
    </div>

    <div id="reportContent"></div>`;
  },

  init() {
    this.tab = 'sales';
    this.renderTab();
  },

  switchTab(tab) {
    this.tab = tab;
    document.querySelectorAll('.report-tab').forEach(btn => {
      btn.classList.toggle('active', btn.id === 'rTab-'+tab);
    });
    Charts.destroyAll();
    this.renderTab();
  },

  renderTab() {
    const el = document.getElementById('reportContent');
    if (!el) return;
    const map = { sales:'renderSales', products:'renderProducts', inventory:'renderInventory', profit:'renderProfit', cashiers:'renderCashiers' };
    el.innerHTML = this[map[this.tab]]();
    setTimeout(() => this[map[this.tab]+'Charts']?.(), 50);
  },

  /* ---- SALES REPORT ---- */
  renderSales() {
    const sales = this._getSales();
    const byMethod = {
      efectivo:      sales.filter(s=>s.method==='efectivo'),
      tarjeta:       sales.filter(s=>s.method==='tarjeta'),
      transferencia: sales.filter(s=>s.method==='transferencia'),
      qr:            sales.filter(s=>s.method==='qr'),
      delivery:      sales.filter(s=>s.method==='delivery'),
    };
    return `
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-bottom:16px">
      ${Object.entries(byMethod).filter(([,arr])=>arr.length>0).map(([m,arr])=>{
        const iconMap={efectivo:'money-bill-wave',tarjeta:'credit-card',transferencia:'building-columns',qr:'qrcode',delivery:'motorcycle'};
        return `<div class="stat-card">
          <div class="stat-info">
            <div class="stat-label">${m.charAt(0).toUpperCase()+m.slice(1)}</div>
            <div class="stat-value">${fmt(salesTotal(arr))}</div>
            <div class="stat-change up"><i class="fas fa-receipt"></i>${arr.length} ventas</div>
          </div>
          <div class="stat-icon" style="background:var(--primary-l)"><i class="fas fa-${iconMap[m]||'question'}" style="color:var(--primary)"></i></div>
        </div>`;
      }).join('')}
    </div>
    <div class="charts-grid mb-16">
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-chart-bar"></i> Ventas Diarias (Últimos 30 días)</div>
        <div style="height:280px"><canvas id="rChartDaily"></canvas></div>
      </div>
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-chart-pie"></i> Métodos de Pago</div>
        <div style="height:280px"><canvas id="rChartMethod"></canvas></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fas fa-calendar-week"></i> Ventas por Día de la Semana</div></div>
      <div class="card-body"><div style="height:200px"><canvas id="rChartWeekday"></canvas></div></div>
    </div>`;
  },

  renderSalesCharts() {
    const sales = this._getSales();
    // Daily sales (last 30 days)
    const dailyLabels = [], dailyVals = [];
    for (let i=29; i>=0; i--) {
      const d = new Date(); d.setDate(d.getDate()-i);
      const ds = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      dailyLabels.push(d.toLocaleDateString('es-BO',{day:'2-digit',month:'2-digit'}));
      const dayTotal = sales.filter(s=>s.date.startsWith(ds)).reduce((a,s)=>a+s.total,0);
      dailyVals.push(+(dayTotal || 0).toFixed(2));
    }
    Charts.create('rChartDaily','bar',{
      labels:dailyLabels,
      datasets:[{label:'Ventas (USD)',data:dailyVals,backgroundColor:'rgba(59,130,246,.7)',borderRadius:4,borderSkipped:false}]
    },{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>'$'+ctx.raw.toFixed(2)}}},scales:{x:{grid:{display:false},ticks:{font:{size:9},maxRotation:45}},y:{grid:{color:'#f1f5f9'},ticks:{callback:v=>'$'+v,font:{size:10}},beginAtZero:true}}});

    // Payment method doughnut
    const byMethod = [sales.filter(s=>s.method==='efectivo'),sales.filter(s=>s.method==='tarjeta'),sales.filter(s=>s.method==='transferencia'),sales.filter(s=>s.method==='qr'),sales.filter(s=>s.method==='delivery')];
    Charts.create('rChartMethod','doughnut',{
      labels:['Efectivo','Tarjeta','Transferencia','QR','Delivery'],
      datasets:[{data:byMethod.map(a=>salesTotal(a)),backgroundColor:['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444'],borderColor:'#fff',borderWidth:3,hoverOffset:8}]
    },{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11}}}}});

    // Weekday bar
    const wdays = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const wdayTotals = [0,1,2,3,4,5,6].map(d => {
      return sales.filter(s=>{const day=new Date(s.date.replace(' ','T')).getDay();return day===d;}).reduce((a,s)=>a+s.total,0) || 0;
    });
    Charts.create('rChartWeekday','bar',{
      labels:wdays,
      datasets:[{label:'Ventas ($)',data:wdayTotals.map(v=>+v.toFixed(2)),backgroundColor:wdays.map((_,i)=>i===5||i===6?'#8b5cf6':'#3b82f6'),borderRadius:6,borderSkipped:false}]
    },{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{color:'#f1f5f9'},ticks:{callback:v=>'$'+v},beginAtZero:true}}});
  },

  /* ---- PRODUCTS REPORT ---- */
  renderProducts() {
    const topSold = [...DB.products].sort((a,b)=>b.sold-a.sold).slice(0,10);
    const topRevenue = [...DB.products].sort((a,b)=>(b.sold*b.sellP)-(a.sold*a.sellP)).slice(0,8);
    return `
    <div class="charts-grid mb-16">
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-trophy"></i> Top 10 Productos Más Vendidos (unidades)</div>
        <div style="height:280px"><canvas id="rChartTopProd"></canvas></div>
      </div>
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-dollar-sign"></i> Top 8 por Ingresos</div>
        <div style="height:280px"><canvas id="rChartTopRev"></canvas></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fas fa-list"></i> Ranking Completo de Productos</div></div>
      <div class="table-wrap">
        <table class="tbl-rpt-products mobile-cards">
          <thead><tr><th>Rank</th><th>Producto</th><th>Categoría</th><th>Unidades Vendidas</th><th>P. Venta</th><th>Ingresos</th><th>Margen</th></tr></thead>
          <tbody>
            ${topSold.map((p,i)=>{
              const cat=DB.getCat(p.catId);
              const rev=p.sold*p.sellP;
              const margin=(((p.sellP-p.buyP)/p.buyP)*100).toFixed(1);
              const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
              return `<tr>
                <td data-label="Rank"><span class="badge badge-primary">${medal} #${i+1}</span></td>
                <td data-label="Producto"><div class="product-cell">${prodIcon(p.catId)}<span style="font-weight:600">${p.name}</span></div></td>
                <td data-label="Categoría"><span class="badge" style="background:${cat?cat.bg:'#f1f5f9'};color:${cat?cat.color:'#64748b'}">${cat?cat.name:'—'}</span></td>
                <td data-label="Unidades"><strong>${fmtNum(p.sold)}</strong> uds</td>
                <td data-label="P. Venta">${fmt(p.sellP)}</td>
                <td data-label="Ingresos"><strong>${fmt(rev)}</strong></td>
                <td data-label="Margen"><span class="badge ${parseFloat(margin)>=20?'badge-success':'badge-warning'}">${margin}%</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  },

  renderProductsCharts() {
    const top10 = [...DB.products].sort((a,b)=>b.sold-a.sold).slice(0,10);
    Charts.create('rChartTopProd','bar',{
      labels:top10.map(p=>p.name.length>18?p.name.substring(0,18)+'…':p.name),
      datasets:[{label:'Unidades',data:top10.map(p=>p.sold),backgroundColor:'#3b82f6',borderRadius:6,borderSkipped:false}]
    },{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{grid:{color:'#f1f5f9'}},y:{grid:{display:false},ticks:{font:{size:10}}}}});

    const top8rev = [...DB.products].sort((a,b)=>(b.sold*b.sellP)-(a.sold*a.sellP)).slice(0,8);
    Charts.create('rChartTopRev','bar',{
      labels:top8rev.map(p=>p.name.length>15?p.name.substring(0,15)+'…':p.name),
      datasets:[{label:'Ingresos ($)',data:top8rev.map(p=>+(p.sold*p.sellP).toFixed(2)),backgroundColor:DB.categories.map(c=>c.color),borderRadius:6,borderSkipped:false}]
    },{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>'$'+ctx.raw.toFixed(2)}}},scales:{x:{grid:{display:false},ticks:{font:{size:10},maxRotation:35}},y:{grid:{color:'#f1f5f9'},ticks:{callback:v=>'$'+v},beginAtZero:true}}});
  },

  /* ---- INVENTORY REPORT ---- */
  renderInventory() {
    const totalVal = DB.products.reduce((s,p)=>s+(p.stock*p.buyP),0);
    const totalSellVal = DB.products.reduce((s,p)=>s+(p.stock*p.sellP),0);
    const lowStock = getLowStockItems();
    const outStock = getOutOfStockItems();
    return `
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--primary)"><div class="stat-info"><div class="stat-label">Valor de Compra</div><div class="stat-value">${fmt(totalVal)}</div></div><div class="stat-icon" style="background:var(--primary-l)"><i class="fas fa-boxes-stacked" style="color:var(--primary)"></i></div></div>
      <div class="stat-card" style="--stat-color:var(--secondary)"><div class="stat-info"><div class="stat-label">Valor de Venta</div><div class="stat-value">${fmt(totalSellVal)}</div></div><div class="stat-icon" style="background:var(--secondary-l)"><i class="fas fa-tag" style="color:var(--secondary)"></i></div></div>
      <div class="stat-card" style="--stat-color:var(--warning)"><div class="stat-info"><div class="stat-label">Stock Bajo</div><div class="stat-value">${lowStock.length}</div></div><div class="stat-icon" style="background:var(--warning-l)"><i class="fas fa-triangle-exclamation" style="color:var(--warning)"></i></div></div>
      <div class="stat-card" style="--stat-color:var(--danger)"><div class="stat-info"><div class="stat-label">Sin Stock</div><div class="stat-value">${outStock.length}</div></div><div class="stat-icon" style="background:var(--danger-l)"><i class="fas fa-circle-xmark" style="color:var(--danger)"></i></div></div>
    </div>
    <div class="charts-grid mb-16">
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-chart-bar"></i> Stock por Categoría (unidades totales)</div>
        <div style="height:280px"><canvas id="rChartInvCat"></canvas></div>
      </div>
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-chart-pie"></i> Valor de Inventario por Categoría</div>
        <div style="height:280px"><canvas id="rChartInvVal"></canvas></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fas fa-list"></i> Resumen de Inventario por Categoría</div></div>
      <div class="table-wrap">
        <table class="tbl-rpt-categories mobile-cards">
          <thead><tr><th>Categoría</th><th>Productos</th><th>Stock Total</th><th>Valor Compra</th><th>Valor Venta</th><th>Ganancia Potencial</th></tr></thead>
          <tbody>
            ${DB.categories.map(cat=>{
              const prods=DB.products.filter(p=>p.catId===cat.id);
              const stock=prods.reduce((s,p)=>s+p.stock,0);
              const valC=prods.reduce((s,p)=>s+p.stock*p.buyP,0);
              const valV=prods.reduce((s,p)=>s+p.stock*p.sellP,0);
              const ganancia=valV-valC;
              return `<tr>
                <td data-label="Categoría"><span class="badge" style="background:${cat.bg};color:${cat.color}"><i class="fas ${cat.icon}"></i>${cat.name}</span></td>
                <td data-label="Productos">${prods.length}</td>
                <td data-label="Stock Total"><strong>${fmtNum(stock)}</strong> uds</td>
                <td data-label="Valor Compra">${fmt(valC)}</td>
                <td data-label="Valor Venta">${fmt(valV)}</td>
                <td data-label="Ganancia Potencial"><span class="badge badge-success">+${fmt(ganancia)}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  },

  renderInventoryCharts() {
    const catStocks = DB.categories.map(cat=>DB.products.filter(p=>p.catId===cat.id).reduce((s,p)=>s+p.stock,0));
    Charts.create('rChartInvCat','bar',{
      labels:DB.categories.map(c=>c.name),
      datasets:[{label:'Stock (uds)',data:catStocks,backgroundColor:DB.categories.map(c=>c.color),borderRadius:8,borderSkipped:false}]
    },{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10},maxRotation:35}},y:{grid:{color:'#f1f5f9'},beginAtZero:true}}});

    const catVals = DB.categories.map(cat=>DB.products.filter(p=>p.catId===cat.id).reduce((s,p)=>s+(p.stock*p.buyP),0));
    Charts.create('rChartInvVal','doughnut',{
      labels:DB.categories.map(c=>c.name),
      datasets:[{data:catVals,backgroundColor:DB.categories.map(c=>c.color),borderColor:'#fff',borderWidth:3,hoverOffset:8}]
    },{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:10},boxWidth:10}},tooltip:{callbacks:{label:ctx=>'$'+ctx.raw.toFixed(2)}}}});
  },

  /* ---- PROFIT REPORT ---- */
  renderProfit() {
    const sales = this._getSales();
    const totalRev = sales.reduce((s,sale)=>s+sale.total,0);
    const totalCost = sales.reduce((s,sale)=>{
      const cost=sale.items.reduce((cs,item)=>{
        const p=DB.getProd(item.pid);
        return cs+(p?p.buyP*item.qty:0);
      },0); return s+cost;
    },0);
    const totalProfit = totalRev - totalCost;
    const margin = totalRev>0 ? (totalProfit/totalRev*100).toFixed(1) : 0;
    return `
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px">
      <div class="stat-card" style="--stat-color:var(--primary)"><div class="stat-info"><div class="stat-label">Ingresos Totales</div><div class="stat-value">${fmt(totalRev)}</div></div><div class="stat-icon" style="background:var(--primary-l)"><i class="fas fa-arrow-trend-up" style="color:var(--primary)"></i></div></div>
      <div class="stat-card" style="--stat-color:var(--danger)"><div class="stat-info"><div class="stat-label">Costo de Ventas</div><div class="stat-value">${fmt(totalCost)}</div></div><div class="stat-icon" style="background:var(--danger-l)"><i class="fas fa-arrow-trend-down" style="color:var(--danger)"></i></div></div>
      <div class="stat-card" style="--stat-color:var(--secondary)"><div class="stat-info"><div class="stat-label">Ganancia Bruta</div><div class="stat-value">${fmt(totalProfit)}</div></div><div class="stat-icon" style="background:var(--secondary-l)"><i class="fas fa-dollar-sign" style="color:var(--secondary)"></i></div></div>
      <div class="stat-card" style="--stat-color:var(--purple)"><div class="stat-info"><div class="stat-label">Margen de Ganancia</div><div class="stat-value">${margin}%</div></div><div class="stat-icon" style="background:var(--purple-l)"><i class="fas fa-percent" style="color:var(--purple)"></i></div></div>
    </div>
    <div class="charts-grid mb-16">
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-chart-line"></i> Ingresos vs Costo vs Ganancia (mensual)</div>
        <div style="height:280px"><canvas id="rChartProfit"></canvas></div>
      </div>
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-chart-pie"></i> Ganancia por Categoría</div>
        <div style="height:280px"><canvas id="rChartProfitCat"></canvas></div>
      </div>
    </div>`;
  },

  renderProfitCharts() {
    const months = ['Ago','Sep','Oct','Nov','Dic','Ene'];
    const revenues = [3250,4180,3820,4900,5100,salesTotal(getMonthSales())];
    const costs = revenues.map(r=>(r*0.62).toFixed(2)*1);
    const profits = revenues.map((r,i)=>+(r-costs[i]).toFixed(2));
    Charts.create('rChartProfit','line',{
      labels:months,
      datasets:[
        {label:'Ingresos',data:revenues,borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,.1)',fill:true,tension:0.4,borderWidth:2},
        {label:'Costos',data:costs,borderColor:'#ef4444',backgroundColor:'rgba(239,68,68,.08)',fill:true,tension:0.4,borderWidth:2},
        {label:'Ganancia',data:profits,borderColor:'#10b981',backgroundColor:'rgba(16,185,129,.1)',fill:true,tension:0.4,borderWidth:2.5},
      ]
    },{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}},scales:{x:{grid:{display:false}},y:{grid:{color:'#f1f5f9'},ticks:{callback:v=>'$'+v}}}});

    const catProfit = DB.categories.map(cat=>{
      const prods=DB.products.filter(p=>p.catId===cat.id);
      return prods.reduce((s,p)=>(p.sellP-p.buyP)*p.sold+s,0);
    });
    Charts.create('rChartProfitCat','doughnut',{
      labels:DB.categories.map(c=>c.name),
      datasets:[{data:catProfit,backgroundColor:DB.categories.map(c=>c.color),borderColor:'#fff',borderWidth:3,hoverOffset:8}]
    },{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:10},boxWidth:10}},tooltip:{callbacks:{label:ctx=>'$'+ctx.raw.toFixed(2)}}}});
  },

  /* ---- CASHIERS REPORT ---- */
  renderCashiers() {
    const periodSales = this._getSales();
    const cashiers = DB.workers.filter(w => periodSales.some(s => s.workId === w.id || s.workName === w.name));
    if (!cashiers.length) {
      // fallback: show all workers with sales role
      const allCashiers = DB.workers.filter(w => w.status === 'active');
      return `<div class="empty-state"><i class="fas fa-user-tie"></i><h4>Sin ventas en el período</h4><p>Selecciona un período diferente</p></div>`;
    }
    return `
    <div class="stats-grid" style="grid-template-columns:repeat(${Math.min(cashiers.length,4)},1fr);margin-bottom:16px">
      ${cashiers.map((w,i)=>{
        const sales=periodSales.filter(s=>s.workId===w.id||s.workName===w.name);
        const total=salesTotal(sales);
        const colors=['primary','secondary','purple','warning','cyan'];
        const color=colors[i%colors.length];
        return `<div class="stat-card" style="--stat-color:var(--${color})">
          <div class="stat-info">
            <div class="stat-label">${w.name}</div>
            <div class="stat-value">${fmt(total)}</div>
            <div class="stat-change up"><i class="fas fa-receipt"></i>${sales.length} ventas</div>
          </div>
          <div class="stat-icon" style="background:var(--${color}-l)">
            <div style="width:36px;height:36px;background:var(--${color});border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700">${w.avatar}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div class="charts-grid mb-16">
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-chart-bar"></i> Ventas por Cajero</div>
        <div style="height:280px"><canvas id="rChartCashiers"></canvas></div>
      </div>
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-chart-pie"></i> Distribución de Ventas</div>
        <div style="height:280px"><canvas id="rChartCashiersPie"></canvas></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fas fa-table"></i> Detalle por Cajero</div></div>
      <div class="table-wrap">
        <table class="tbl-rpt-workers mobile-cards">
          <thead><tr><th>Cajero</th><th>Ventas</th><th>Total</th><th>Ticket Promedio</th><th>Efectivo</th><th>Tarjeta</th><th>Transferencia</th></tr></thead>
          <tbody>
            ${DB.workers.map(w=>{
              const sales=periodSales.filter(s=>s.workId===w.id||s.workName===w.name);
              if(sales.length===0) return '';
              const total=salesTotal(sales);
              const avg=total/sales.length;
              const ef=salesTotal(sales.filter(s=>s.method==='efectivo'));
              const ta=salesTotal(sales.filter(s=>s.method==='tarjeta'));
              const tr=salesTotal(sales.filter(s=>s.method==='transferencia'));
              return `<tr>
                <td data-label="Cajero"><div class="person-info"><div class="person-avatar" style="background:#3b82f6">${w.avatar}</div><div><div class="person-name">${w.name}</div><div class="person-sub">${w.role}</div></div></div></td>
                <td data-label="Ventas"><span class="badge badge-primary">${sales.length}</span></td>
                <td data-label="Total"><strong>${fmt(total)}</strong></td>
                <td data-label="Ticket Promedio">${fmt(avg)}</td>
                <td data-label="Efectivo">${fmt(ef)}</td>
                <td data-label="Tarjeta">${fmt(ta)}</td>
                <td data-label="Transferencia">${fmt(tr)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  },

  renderCashiersCharts() {
    const periodSales2 = this._getSales();
    const cashiers=DB.workers.filter(w=>periodSales2.some(s=>s.workId===w.id||s.workName===w.name));
    if (!cashiers.length) return;
    const totals=cashiers.map(w=>salesTotal(periodSales2.filter(s=>s.workId===w.id||s.workName===w.name)));
    const colors=['#3b82f6','#10b981','#8b5cf6','#f59e0b','#06b6d4'];
    Charts.create('rChartCashiers','bar',{
      labels:cashiers.map(w=>w.name.split(' ')[0]),
      datasets:[{label:'Total Ventas ($)',data:totals,backgroundColor:colors,borderRadius:8,borderSkipped:false}]
    },{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>'$'+ctx.raw.toFixed(2)}}},scales:{x:{grid:{display:false}},y:{grid:{color:'#f1f5f9'},ticks:{callback:v=>'$'+v},beginAtZero:true}}});
    Charts.create('rChartCashiersPie','doughnut',{
      labels:cashiers.map(w=>w.name.split(' ')[0]),
      datasets:[{data:totals,backgroundColor:colors,borderColor:'#fff',borderWidth:3,hoverOffset:8}]
    },{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11}}},tooltip:{callbacks:{label:ctx=>'$'+ctx.raw.toFixed(2)}}}});
  },

  /* ---- EXPORT ---- */
  downloadCurrentPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont('helvetica','bold');
    doc.text('SUPERMARKET POS', 105, 20, {align:'center'});
    doc.setFontSize(12);
    doc.setFont('helvetica','normal');
    doc.text('Reporte: ' + this.tab.charAt(0).toUpperCase()+this.tab.slice(1), 105, 30, {align:'center'});
    doc.text('Generado: ' + fmtDatetime(nowStr()), 105, 38, {align:'center'});
    doc.line(20, 42, 190, 42);

    const rows = this._getExportRows();
    if (rows.length > 0) {
      doc.autoTable({
        startY: 50,
        head: [rows[0]],
        body: rows.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [59,130,246] },
        styles: { fontSize:9 },
      });
    }
    doc.save(`reporte-${this.tab}-${todayStr()}.pdf`);
    showToast('PDF generado', 'success');
  },

  downloadCurrentCSV() {
    const rows = this._getExportRows();
    const csv = rows.map(r=>r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `reporte-${this.tab}-${todayStr()}.csv`;
    a.click();
    showToast('CSV exportado', 'success');
  },

  _getExportRows() {
    if (this.tab==='sales') {
      const rows=[['ID','Fecha','Cliente','Cajero','Ítems','Subtotal','Desc%','IVA','Total','Método']];
      this._getSales().forEach(s=>rows.push([s.id,s.date,s.custName,s.workName,s.items.length,s.subtotal,s.discount||0,s.tax,s.total,s.method]));
      return rows;
    }
    if (this.tab==='products') {
      const rows=[['Código','Producto','Categoría','Unidades Vendidas','P.Venta','Ingresos']];
      [...DB.products].sort((a,b)=>b.sold-a.sold).forEach(p=>{const cat=DB.getCat(p.catId);rows.push([p.code,p.name,cat?cat.name:'',p.sold,p.sellP,(p.sold*p.sellP).toFixed(2)]);});
      return rows;
    }
    if (this.tab==='inventory') {
      const rows=[['Código','Producto','Categoría','Stock','Stock Mín','Valor Compra','Valor Venta']];
      DB.products.forEach(p=>{const cat=DB.getCat(p.catId);rows.push([p.code,p.name,cat?cat.name:'',p.stock,p.minStock,(p.stock*p.buyP).toFixed(2),(p.stock*p.sellP).toFixed(2)]);});
      return rows;
    }
    return [['Sin datos']];
  },
};
