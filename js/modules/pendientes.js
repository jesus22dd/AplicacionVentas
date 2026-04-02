/* =================================================================
   MODULE: Pendientes — Distribución de Ingresos
   ================================================================= */

const PendientesModule = {
  _viewId: null,

  render() {
    const pd  = DB.pendientes;
    const cfg = pd.config;
    // Current period = first item with closedAt === null
    const current = pd.history.find(h => !h.closedAt) || pd.history[0];
    const history = pd.history.filter(h => h.closedAt);
    const sym = DB.config.currencySymbol || 'Bs.';

    // Calculate gross income from current month sales if not manually set
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const monthlySales = DB.sales.filter(s => s.date.startsWith(monthKey));
    const grossFromSales = +monthlySales.reduce((sum, s) => sum + s.total * (DB.config.exchangeRate||9.35), 0).toFixed(2);
    const grossIncome = current?.grossIncome > 0 ? current.grossIncome : grossFromSales;

    const totalFixed = (cfg.ahorros||0) + (cfg.gastos||0) + (cfg.facturas||0) + (cfg.alquiler||0);
    const sobrante   = +(grossIncome - totalFixed).toFixed(2);
    const pct = grossIncome > 0 ? n => ((n/grossIncome)*100).toFixed(1) : () => '0.0';

    const items = [
      { label:'Ahorro Personal',    icon:'fa-piggy-bank',    color:'#3b82f6', key:'ahorros',  val: cfg.ahorros||0 },
      { label:'Gastos Operativos',  icon:'fa-receipt',       color:'#f59e0b', key:'gastos',   val: cfg.gastos||0  },
      { label:'Facturas / Servicios', icon:'fa-file-invoice',color:'#ef4444', key:'facturas', val: cfg.facturas||0},
      { label:'Alquiler del Local', icon:'fa-building',      color:'#8b5cf6', key:'alquiler', val: cfg.alquiler||0},
    ];

    const cards = items.map(item => {
      const pctVal = pct(item.val);
      return `
      <div class="card">
        <div class="card-body" style="text-align:center;padding:20px">
          <div style="width:48px;height:48px;border-radius:50%;background:${item.color}20;color:${item.color};
            font-size:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">
            <i class="fas ${item.icon}"></i>
          </div>
          <div style="font-size:12px;color:var(--text-2);margin-bottom:4px">${item.label}</div>
          <div style="font-size:20px;font-weight:800;color:${item.color}">${sym} ${item.val.toFixed(2)}</div>
          <div style="font-size:11px;color:var(--text-3);margin-top:2px">${pctVal}% del ingreso</div>
          <div style="height:4px;background:var(--border);border-radius:2px;margin-top:10px;overflow:hidden">
            <div style="height:100%;background:${item.color};width:${Math.min(100,parseFloat(pctVal))}%;border-radius:2px;transition:.3s"></div>
          </div>
        </div>
      </div>`;
    }).join('');

    const historyRows = history.slice().reverse().map(h => {
      const s2 = +(h.grossIncome - h.totalFixed).toFixed(2);
      return `<tr>
        <td data-label="Período"><strong>${h.label}</strong></td>
        <td data-label="Ingreso">${sym} ${h.grossIncome.toFixed(2)}</td>
        <td data-label="Fijos">${sym} ${h.totalFixed.toFixed(2)}</td>
        <td data-label="Sobrante"><strong style="color:${s2>=0?'var(--success)':'var(--danger)'}">${sym} ${s2.toFixed(2)}</strong></td>
        <td data-label="Cerrado">${h.closedAt ? fmtDate(h.closedAt) : '—'}</td>
        <td data-label="Notas">${h.notes ? `<span title="${h.notes}" style="cursor:help"><i class="fas fa-comment-dots"></i></span>` : '—'}</td>
      </tr>`;
    }).join('');

    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Pendientes</h2>
        <p>Distribución de ingresos y gastos fijos del período</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="PendientesModule.showConfig()">
          <i class="fas fa-sliders"></i> Configurar Montos
        </button>
        <button class="btn btn-primary" onclick="PendientesModule.closePeriod()">
          <i class="fas fa-lock"></i> Cerrar Período
        </button>
      </div>
    </div>

    <!-- Current period summary -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-calendar-check"></i> Período Actual — ${current?.label||monthKey}</div>
        <button class="btn btn-sm btn-secondary" onclick="PendientesModule.editIncome()">
          <i class="fas fa-pen"></i> Ajustar Ingreso
        </button>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:20px">
          <div style="text-align:center;padding:16px;background:var(--bg-2);border-radius:var(--radius)">
            <div style="font-size:11px;color:var(--text-2);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Ingreso Bruto</div>
            <div style="font-size:24px;font-weight:800;color:var(--primary)">${sym} ${grossIncome.toFixed(2)}</div>
            <div style="font-size:11px;color:var(--text-3);margin-top:2px">${monthlySales.length} ventas este mes</div>
          </div>
          <div style="text-align:center;padding:16px;background:var(--bg-2);border-radius:var(--radius)">
            <div style="font-size:11px;color:var(--text-2);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Total Fijos</div>
            <div style="font-size:24px;font-weight:800;color:var(--warning)">${sym} ${totalFixed.toFixed(2)}</div>
            <div style="font-size:11px;color:var(--text-3);margin-top:2px">${grossIncome>0?((totalFixed/grossIncome)*100).toFixed(1):0}% del ingreso</div>
          </div>
          <div style="text-align:center;padding:16px;background:${sobrante>=0?'#f0fdf4':'#fef2f2'};border-radius:var(--radius)">
            <div style="font-size:11px;color:var(--text-2);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Sobrante</div>
            <div style="font-size:24px;font-weight:800;color:${sobrante>=0?'var(--success)':'var(--danger)'}">${sym} ${sobrante.toFixed(2)}</div>
            <div style="font-size:11px;color:var(--text-3);margin-top:2px">${grossIncome>0?((sobrante/grossIncome)*100).toFixed(1):0}% disponible</div>
          </div>
        </div>

        <!-- Distribution bar -->
        ${grossIncome > 0 ? `
        <div style="margin-bottom:16px">
          <div style="font-size:12px;font-weight:600;margin-bottom:8px;color:var(--text-2)">Distribución del ingreso</div>
          <div style="height:20px;border-radius:10px;overflow:hidden;display:flex;background:var(--border)">
            ${items.map(item => {
              const w = grossIncome > 0 ? Math.min(100, (item.val/grossIncome)*100) : 0;
              return w > 0 ? `<div style="width:${w}%;background:${item.color};height:100%;position:relative;min-width:${w>3?'auto':'0'}" title="${item.label}: ${sym} ${item.val.toFixed(2)}"></div>` : '';
            }).join('')}
            ${sobrante > 0 ? `<div style="flex:1;background:#10b981;height:100%" title="Sobrante: ${sym} ${sobrante.toFixed(2)}"></div>` : ''}
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;font-size:11px">
            ${items.map(item => `<div style="display:flex;align-items:center;gap:4px"><div style="width:10px;height:10px;border-radius:50%;background:${item.color}"></div>${item.label}</div>`).join('')}
            <div style="display:flex;align-items:center;gap:4px"><div style="width:10px;height:10px;border-radius:50%;background:#10b981"></div>Sobrante</div>
          </div>
        </div>` : ''}

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px">
          ${cards}
        </div>
      </div>
    </div>

    <!-- History -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-history"></i> Historial de Períodos</div>
      </div>
      <div class="card-body">
        ${!history.length ? `<div class="empty-state"><i class="fas fa-history"></i><h4>Sin historial</h4><p>Los períodos cerrados aparecerán aquí</p></div>` :
        `<div class="table-responsive"><table class="table tbl-pendientes mobile-cards">
          <thead><tr><th>Período</th><th>Ingreso</th><th>Fijos</th><th>Sobrante</th><th>Cerrado</th><th>Notas</th></tr></thead>
          <tbody>${historyRows}</tbody>
        </table></div>`}
      </div>
    </div>`;
  },

  init() {},

  showConfig() {
    const cfg = DB.pendientes.config;
    const sym = DB.config.currencySymbol || 'Bs.';
    const html = `
    <form onsubmit="PendientesModule.saveConfig(event)">
      <p style="color:var(--text-2);font-size:13px;margin-bottom:16px">
        Configura los montos fijos que se deducen del ingreso bruto cada período.
      </p>
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label><i class="fas fa-piggy-bank" style="color:#3b82f6"></i> Ahorro Personal (${sym})</label>
          <input class="form-control" name="ahorros" type="number" min="0" step="0.01" value="${cfg.ahorros||0}" required />
        </div>
        <div class="form-group">
          <label><i class="fas fa-receipt" style="color:#f59e0b"></i> Gastos Operativos (${sym})</label>
          <input class="form-control" name="gastos" type="number" min="0" step="0.01" value="${cfg.gastos||0}" required />
        </div>
        <div class="form-group">
          <label><i class="fas fa-file-invoice" style="color:#ef4444"></i> Facturas / Servicios (${sym})</label>
          <input class="form-control" name="facturas" type="number" min="0" step="0.01" value="${cfg.facturas||0}" required />
        </div>
        <div class="form-group">
          <label><i class="fas fa-building" style="color:#8b5cf6"></i> Alquiler del Local (${sym})</label>
          <input class="form-control" name="alquiler" type="number" min="0" step="0.01" value="${cfg.alquiler||0}" required />
        </div>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar Montos</button>
      </div>
    </form>`;
    openModal('Configurar Montos Fijos', html, 'modal-md');
  },

  saveConfig(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    DB.pendientes.config.ahorros  = parseFloat(fd.get('ahorros'))  || 0;
    DB.pendientes.config.gastos   = parseFloat(fd.get('gastos'))   || 0;
    DB.pendientes.config.facturas = parseFloat(fd.get('facturas')) || 0;
    DB.pendientes.config.alquiler = parseFloat(fd.get('alquiler')) || 0;

    // Update current open period
    const current = DB.pendientes.history.find(h => !h.closedAt);
    if (current) {
      current.ahorros   = DB.pendientes.config.ahorros;
      current.gastos    = DB.pendientes.config.gastos;
      current.facturas  = DB.pendientes.config.facturas;
      current.alquiler  = DB.pendientes.config.alquiler;
      current.totalFixed = DB.pendientes.config.ahorros + DB.pendientes.config.gastos + DB.pendientes.config.facturas + DB.pendientes.config.alquiler;
    }
    showToast('Montos actualizados', 'success');
    closeModalDirect();
    navigate('pendientes');
  },

  editIncome() {
    const sym  = DB.config.currencySymbol || 'Bs.';
    const current = DB.pendientes.history.find(h => !h.closedAt);
    const html = `
    <form onsubmit="PendientesModule.saveIncome(event)">
      <p style="color:var(--text-2);font-size:13px;margin-bottom:16px">
        Ajusta el ingreso bruto del período actual manualmente. Deja en 0 para usar el total de ventas automáticamente.
      </p>
      <div class="form-group">
        <label>Ingreso Bruto (${sym})</label>
        <input class="form-control" name="grossIncome" type="number" min="0" step="0.01" value="${current?.grossIncome||0}" />
      </div>
      <div class="form-group">
        <label>Notas del período</label>
        <textarea class="form-control" name="notes" rows="2">${current?.notes||''}</textarea>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>
      </div>
    </form>`;
    openModal('Ajustar Ingreso del Período', html, 'modal-sm');
  },

  saveIncome(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const current = DB.pendientes.history.find(h => !h.closedAt);
    if (current) {
      current.grossIncome = parseFloat(fd.get('grossIncome')) || 0;
      current.notes = fd.get('notes') || '';
      const sobrante = +(current.grossIncome - current.totalFixed).toFixed(2);
      current.sobrante = sobrante;
      showToast('Ingreso actualizado', 'success');
    }
    closeModalDirect();
    navigate('pendientes');
  },

  closePeriod() {
    const current = DB.pendientes.history.find(h => !h.closedAt);
    if (!current) { showToast('No hay período abierto', 'warning'); return; }
    const sym  = DB.config.currencySymbol || 'Bs.';

    // Compute gross from sales if not set
    const d = new Date();
    const monthKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    if (!current.grossIncome) {
      const monthlySales = DB.sales.filter(s => s.date.startsWith(monthKey));
      current.grossIncome = +monthlySales.reduce((sum, s) => sum + s.total * (DB.config.exchangeRate||9.35), 0).toFixed(2);
    }
    const sobrante = +(current.grossIncome - current.totalFixed).toFixed(2);
    current.sobrante = sobrante;

    openConfirm(
      'Cerrar Período',
      `¿Cerrar el período "${current.label}"?\nIngreso: ${sym} ${current.grossIncome.toFixed(2)} · Sobrante: ${sym} ${sobrante.toFixed(2)}`,
      () => {
        current.closedAt = nowStr();
        current.sobrante = sobrante;

        // Create next period
        const now2 = new Date();
        now2.setMonth(now2.getMonth() + 1);
        const nextPeriod = `${now2.getFullYear()}-${String(now2.getMonth()+1).padStart(2,'0')}`;
        const nextLabel  = now2.toLocaleDateString('es-BO', { month:'long', year:'numeric' });
        const cfg = DB.pendientes.config;
        DB.pendientes.history.unshift({
          id: genId('PD', DB.pendientes.history.length + 1),
          period: nextPeriod,
          label: nextLabel.charAt(0).toUpperCase() + nextLabel.slice(1),
          grossIncome: 0,
          ahorros:   cfg.ahorros||0,
          gastos:    cfg.gastos||0,
          facturas:  cfg.facturas||0,
          alquiler:  cfg.alquiler||0,
          totalFixed: (cfg.ahorros||0)+(cfg.gastos||0)+(cfg.facturas||0)+(cfg.alquiler||0),
          sobrante: 0,
          notes: '',
          closedAt: null,
        });
        showToast(`Período "${current.label}" cerrado correctamente`, 'success');
        navigate('pendientes');
      }
    );
  },
};
