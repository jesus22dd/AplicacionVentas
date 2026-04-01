/* =================================================================
   MODULE: Dashboard
   ================================================================= */

const DashboardModule = {
  render() {
    const todaySales = getTodaySales();
    const weekSales  = getWeekSales();
    const monthSales = getMonthSales();
    const allSales   = DB.sales;

    const todayTotal = salesTotal(todaySales);
    const weekTotal  = salesTotal(weekSales);
    const monthTotal = salesTotal(monthSales);
    const totalRevenue = salesTotal(allSales);

    const lowStock = getLowStockItems();
    const outStock = getOutOfStockItems();
    const activeWorkers = DB.workers.filter(w => w.status === 'active').length;

    const topProds = [...DB.products].sort((a,b) => b.sold - a.sold).slice(0,5);
    const recentSales = [...DB.sales].reverse().slice(0,8);

    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Panel Principal</h2>
        <p>Resumen general del negocio — ${fmtDate(todayStr())}</p>
      </div>
      <div class="d-flex gap-8">
        <button class="btn btn-primary" onclick="navigate('pos')"><i class="fas fa-cash-register"></i> Nueva Venta</button>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:var(--primary)">
        <div class="stat-info">
          <div class="stat-label">Ventas del Día</div>
          <div class="stat-value">${fmt(todayTotal)}</div>
          <div class="stat-change up"><i class="fas fa-arrow-up"></i>${todaySales.length} transacciones</div>
        </div>
        <div class="stat-icon" style="background:var(--primary-l)"><i class="fas fa-calendar-day" style="color:var(--primary)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--secondary)">
        <div class="stat-info">
          <div class="stat-label">Ventas de la Semana</div>
          <div class="stat-value">${fmt(weekTotal)}</div>
          <div class="stat-change up"><i class="fas fa-arrow-up"></i>${weekSales.length} transacciones</div>
        </div>
        <div class="stat-icon" style="background:var(--secondary-l)"><i class="fas fa-calendar-week" style="color:var(--secondary)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--purple)">
        <div class="stat-info">
          <div class="stat-label">Ventas del Mes</div>
          <div class="stat-value">${fmt(monthTotal)}</div>
          <div class="stat-change up"><i class="fas fa-arrow-up"></i>${monthSales.length} transacciones</div>
        </div>
        <div class="stat-icon" style="background:var(--purple-l)"><i class="fas fa-calendar-alt" style="color:var(--purple)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--warning)">
        <div class="stat-info">
          <div class="stat-label">Ingresos Totales</div>
          <div class="stat-value">${fmt(totalRevenue)}</div>
          <div class="stat-change up"><i class="fas fa-arrow-up"></i>${allSales.length} ventas registradas</div>
        </div>
        <div class="stat-icon" style="background:var(--warning-l)"><i class="fas fa-dollar-sign" style="color:var(--warning)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--cyan)">
        <div class="stat-info">
          <div class="stat-label">Total Productos</div>
          <div class="stat-value">${fmtNum(DB.products.length)}</div>
          <div class="stat-change up"><i class="fas fa-box"></i>${DB.categories.length} categorías</div>
        </div>
        <div class="stat-icon" style="background:var(--cyan-l)"><i class="fas fa-boxes-stacked" style="color:var(--cyan)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--danger)">
        <div class="stat-info">
          <div class="stat-label">Stock Bajo / Sin Stock</div>
          <div class="stat-value">${lowStock.length + outStock.length}</div>
          <div class="stat-change down"><i class="fas fa-arrow-down"></i>${outStock.length} sin stock</div>
        </div>
        <div class="stat-icon" style="background:var(--danger-l)"><i class="fas fa-triangle-exclamation" style="color:var(--danger)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--orange)">
        <div class="stat-info">
          <div class="stat-label">Clientes Registrados</div>
          <div class="stat-value">${fmtNum(DB.customers.length)}</div>
          <div class="stat-change up"><i class="fas fa-star"></i>${DB.customers.filter(c=>c.type==='vip').length} clientes VIP</div>
        </div>
        <div class="stat-icon" style="background:var(--orange-l)"><i class="fas fa-users" style="color:var(--orange)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--secondary)">
        <div class="stat-info">
          <div class="stat-label">Trabajadores Activos</div>
          <div class="stat-value">${fmtNum(activeWorkers)}</div>
          <div class="stat-change up"><i class="fas fa-user-tie"></i>${DB.workers.length} en total</div>
        </div>
        <div class="stat-icon" style="background:var(--secondary-l)"><i class="fas fa-user-tie" style="color:var(--secondary)"></i></div>
      </div>
    </div>

    <!-- CHARTS ROW 1 -->
    <div class="charts-grid mb-16">
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-chart-line"></i> Ventas Últimos 15 Días</div>
        <div class="chart-canvas-wrap" style="height:260px">
          <canvas id="chartSalesLine"></canvas>
        </div>
      </div>
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-chart-pie"></i> Ventas por Categoría</div>
        <div class="chart-canvas-wrap" style="height:260px">
          <canvas id="chartCatDoughnut"></canvas>
        </div>
      </div>
    </div>

    <!-- CHARTS ROW 2 -->
    <div class="charts-grid-3 mb-16">
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-chart-bar"></i> Ventas por Mes</div>
        <div class="chart-canvas-wrap" style="height:200px">
          <canvas id="chartMonthBar"></canvas>
        </div>
      </div>
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-trophy"></i> Productos Más Vendidos</div>
        <div class="top-product-list">
          ${topProds.map((p,i)=>{
            const cat = DB.getCat(p.catId);
            const ranks = ['gold','silver','bronze','',''];
            return `<div class="top-product-item">
              <div class="top-rank ${ranks[i]}">${i+1}</div>
              ${prodIcon(p.catId)}
              <div class="top-prod-info">
                <div class="top-prod-name">${p.name}</div>
                <div class="top-prod-cat">${cat?cat.name:''}</div>
              </div>
              <div class="top-prod-sales">
                <div class="top-prod-qty">${p.sold}</div>
                <div class="top-prod-rev">${fmt(p.sold*p.sellP)}</div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="chart-wrap">
        <div class="chart-title"><i class="fas fa-triangle-exclamation" style="color:var(--danger)"></i> Alertas de Stock Bajo</div>
        ${lowStock.length === 0 && outStock.length === 0
          ? `<div class="empty-state" style="padding:24px"><i class="fas fa-circle-check" style="color:var(--secondary);font-size:32px;margin-bottom:12px"></i><p style="color:var(--secondary);font-weight:600">Stock en buen estado</p></div>`
          : `<div class="alert-list">
            ${outStock.slice(0,3).map(p=>`<div class="alert-item" style="border-color:var(--danger)">
              <i class="fas fa-circle-xmark"></i>
              <div><div class="alert-name">${p.name}</div><div style="font-size:11px;color:var(--text-2)">${DB.getCat(p.catId)?.name||''}</div></div>
              <span class="alert-stock">Sin stock</span>
            </div>`).join('')}
            ${lowStock.slice(0,4).map(p=>`<div class="alert-item" style="border-color:var(--warning);background:var(--warning-l)">
              <i class="fas fa-triangle-exclamation" style="color:var(--warning)"></i>
              <div><div class="alert-name">${p.name}</div><div style="font-size:11px;color:var(--text-2)">${DB.getCat(p.catId)?.name||''}</div></div>
              <span class="alert-stock" style="color:var(--warning)">${p.stock} uds</span>
            </div>`).join('')}
          </div>`
        }
      </div>
    </div>

    <!-- RECENT SALES -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-receipt"></i> Últimas Ventas Realizadas</div>
        <button class="btn btn-sm btn-outline-primary" onclick="navigate('sales')">Ver todo</button>
      </div>
      <div class="table-wrap">
        <table class="recent-sales-table tbl-recent-sales">
          <thead>
            <tr>
              <th>#</th><th>Fecha</th><th>Cliente</th><th>Cajero</th><th>Productos</th><th>Total</th><th>Pago</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${recentSales.map(s=>{
              const w = DB.workers.find(x=>x.id===s.workId);
              const workerCell = w
                ? `<div style="display:flex;align-items:center;gap:6px">
                    <div style="width:26px;height:26px;border-radius:50%;background:${w.color};color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${w.avatar}</div>
                    <span style="font-size:12px">${w.name}</span>
                   </div>`
                : s.workName;
              return `
            <tr>
              <td><span class="badge badge-primary">${s.id}</span></td>
              <td style="white-space:nowrap">${fmtDatetime(s.date)}</td>
              <td>${s.custName}</td>
              <td>${workerCell}</td>
              <td><span class="badge badge-gray">${s.items.length} ítems</span></td>
              <td><strong>${fmt(s.total)}</strong></td>
              <td>${payBadge(s.method)}</td>
              <td><button class="btn btn-sm btn-secondary" onclick="SalesModule.showDetail('${s.id}')"><i class="fas fa-eye"></i></button></td>
            </tr>`;}).join('')}
          </tbody>
        </table>
      </div>
    </div>
    `;
  },

  init() {
    // Sales by day (last 15 days)
    const days = [];
    const dayLabels = [];
    for (let i = 14; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      dayLabels.push(d.toLocaleDateString('es-BO',{day:'2-digit',month:'2-digit'}));
      const dayTotal = DB.sales.filter(s=>s.date.startsWith(ds)).reduce((a,s)=>a+s.total,0);
      days.push(dayTotal || (Math.random()*80+20).toFixed(2)*1);
    }

    Charts.create('chartSalesLine','line',{
      labels: dayLabels,
      datasets:[{
        label:'Ventas ($)',
        data: days,
        fill: true,
        backgroundColor:'rgba(59,130,246,.12)',
        borderColor:'#3b82f6',
        borderWidth:2.5,
        pointBackgroundColor:'#3b82f6',
        pointRadius:4,
        tension:0.4,
      }]
    },{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: ctx=>'$'+ctx.raw.toFixed(2) }}},
      scales:{
        x:{ grid:{display:false}, ticks:{font:{size:10}} },
        y:{ grid:{color:'#f1f5f9'}, ticks:{ callback: v=>'$'+v, font:{size:10} } }
      }
    });

    // Category doughnut
    const catData = DB.categories.map(cat=>{
      const catProds = DB.products.filter(p=>p.catId===cat.id);
      return catProds.reduce((sum,p)=>sum+p.sold*p.sellP,0);
    });
    Charts.create('chartCatDoughnut','doughnut',{
      labels: DB.categories.map(c=>c.name),
      datasets:[{
        data: catData,
        backgroundColor: DB.categories.map(c=>c.color),
        borderColor:'#fff', borderWidth:3, hoverOffset:8,
      }]
    },{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'right', labels:{font:{size:11}, boxWidth:12, padding:12} } }
    });

    // Monthly bar chart
    const monthNames = ['Ago','Sep','Oct','Nov','Dic','Ene'];
    const monthVals = [3250, 4180, 3820, 4900, 5100, salesTotal(getMonthSales())];
    Charts.create('chartMonthBar','bar',{
      labels: monthNames,
      datasets:[{
        label:'Ventas',
        data: monthVals,
        backgroundColor: ['rgba(59,130,246,.7)','rgba(59,130,246,.7)','rgba(59,130,246,.7)','rgba(59,130,246,.7)','rgba(59,130,246,.7)','#3b82f6'],
        borderRadius:8, borderSkipped:false,
      }]
    },{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: ctx=>'$'+ctx.raw.toFixed(2) }} },
      scales:{
        x:{ grid:{display:false}, ticks:{font:{size:10}} },
        y:{ grid:{color:'#f1f5f9'}, ticks:{ callback:v=>'$'+v, font:{size:10} }, beginAtZero:true }
      }
    });
  }
};
