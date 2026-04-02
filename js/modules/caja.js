/* =================================================================
   MODULE: Corte de Caja
   ================================================================= */

const CajaModule = {
  render() {
    const session = DB.caja.current;
    const sessions = [...DB.caja.sessions].reverse();

    const totalVentasHoy = session
      ? DB.sales.filter(s => s.date >= session.openedAt && s.date <= nowStr()).reduce((a,s) => a + s.total, 0)
      : 0;
    const numVentasHoy = session
      ? DB.sales.filter(s => s.date >= session.openedAt && s.date <= nowStr()).length
      : 0;

    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Corte de Caja</h2>
        <p>${session ? 'Sesión activa en curso' : 'Sin sesión activa'}</p>
      </div>
      ${session
        ? `<button class="btn btn-danger" onclick="CajaModule.openCloseForm()"><i class="fas fa-cash-register"></i> Cerrar Caja</button>`
        : `<button class="btn btn-primary" onclick="CajaModule.openOpenForm()"><i class="fas fa-unlock"></i> Abrir Caja</button>`
      }
    </div>

    <!-- Session status card -->
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="stat-card" style="--stat-color:${session ? 'var(--secondary)' : 'var(--danger)'}">
        <div class="stat-info">
          <div class="stat-label">Estado</div>
          <div class="stat-value" style="font-size:18px">${session ? 'ABIERTA' : 'CERRADA'}</div>
          <div class="stat-change ${session ? 'up' : ''}">
            <i class="fas fa-${session ? 'circle-check' : 'circle-xmark'}"></i>
            ${session ? session.workerName : 'Sin cajero activo'}
          </div>
        </div>
        <div class="stat-icon" style="background:${session ? 'var(--secondary-l)' : 'var(--danger-l)'}">
          <i class="fas fa-vault" style="color:${session ? 'var(--secondary)' : 'var(--danger)'}"></i>
        </div>
      </div>
      <div class="stat-card" style="--stat-color:var(--primary)">
        <div class="stat-info">
          <div class="stat-label">Apertura</div>
          <div class="stat-value">${session ? fmt(session.openAmt) : '—'}</div>
          <div class="stat-change up"><i class="fas fa-clock"></i>${session ? fmtDatetime(session.openedAt) : 'Sin sesión'}</div>
        </div>
        <div class="stat-icon" style="background:var(--primary-l)"><i class="fas fa-dollar-sign" style="color:var(--primary)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--cyan)">
        <div class="stat-info">
          <div class="stat-label">Ventas en Sesión</div>
          <div class="stat-value">${session ? fmt(totalVentasHoy) : '—'}</div>
          <div class="stat-change up"><i class="fas fa-receipt"></i>${session ? numVentasHoy + ' transacciones' : 'Sin sesión'}</div>
        </div>
        <div class="stat-icon" style="background:var(--cyan-l)"><i class="fas fa-chart-line" style="color:var(--cyan)"></i></div>
      </div>
      <div class="stat-card" style="--stat-color:var(--purple)">
        <div class="stat-info">
          <div class="stat-label">Sesiones Totales</div>
          <div class="stat-value">${DB.caja.sessions.length}</div>
          <div class="stat-change up"><i class="fas fa-history"></i>historial registrado</div>
        </div>
        <div class="stat-icon" style="background:var(--purple-l)"><i class="fas fa-list-check" style="color:var(--purple)"></i></div>
      </div>
    </div>

    <!-- Session history -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-history"></i> Historial de Sesiones</div>
      </div>
      <div class="table-wrap">
        <table class="tbl-caja mobile-cards">
          <thead>
            <tr><th>ID</th><th>Apertura</th><th>Cierre</th><th>Cajero</th><th>Fondo Inicial</th><th>Conteo</th><th>Esperado</th><th>Diferencia</th><th>Estado</th><th>Acción</th></tr>
          </thead>
          <tbody>
            ${sessions.length === 0
              ? `<tr><td colspan="10"><div class="empty-state"><i class="fas fa-vault"></i><h4>Sin sesiones</h4><p>Abre la caja para comenzar</p></div></td></tr>`
              : sessions.map(s => {
                const diffClass = s.diff === 0 ? 'var(--secondary)' : s.diff > 0 ? 'var(--cyan)' : 'var(--danger)';
                const diffIcon  = s.diff === 0 ? 'fa-equals' : s.diff > 0 ? 'fa-arrow-up' : 'fa-arrow-down';
                return `
                <tr>
                  <td data-label="ID"><span class="badge badge-primary">${s.id}</span></td>
                  <td data-label="Apertura" style="font-size:12px">${fmtDatetime(s.openedAt)}</td>
                  <td data-label="Cierre" style="font-size:12px">${s.closedAt ? fmtDatetime(s.closedAt) : '—'}</td>
                  <td data-label="Cajero">
                    <div class="person-info">
                      <div class="person-avatar" style="background:#3b82f6;width:28px;height:28px;font-size:10px">${s.workerName.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                      <span style="font-size:13px">${s.workerName}</span>
                    </div>
                  </td>
                  <td data-label="Fondo Inicial">${fmt(s.openAmt)}</td>
                  <td data-label="Conteo"><strong>${fmt(s.closingAmt)}</strong></td>
                  <td data-label="Esperado">${fmt(s.expectedAmt)}</td>
                  <td data-label="Diferencia"><span style="color:${diffClass};font-weight:700"><i class="fas ${diffIcon}"></i> ${fmt(Math.abs(s.diff))}</span></td>
                  <td data-label="Estado">${s.status === 'closed'
                    ? `<span class="badge badge-gray"><i class="fas fa-lock"></i>Cerrada</span>`
                    : `<span class="badge badge-success"><i class="fas fa-lock-open"></i>Abierta</span>`}</td>
                  <td data-label="Acción">
                    <button class="btn btn-sm btn-secondary btn-icon" onclick="CajaModule.viewDetail('${s.id}')" title="Ver detalle"><i class="fas fa-eye"></i></button>
                  </td>
                </tr>`;
              }).join('')
            }
          </tbody>
        </table>
      </div>
    </div>`;
  },

  init() {},

  openOpenForm() {
    const workers = DB.workers.filter(w => w.status === 'active');
    openModal('Abrir Caja', `
    <form onsubmit="CajaModule.openSession(event)">
      <p style="color:var(--text-2);margin-bottom:16px">Registra el fondo inicial de caja para comenzar la sesión.</p>
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label>Cajero Responsable</label>
          <select class="form-control" name="workerId" required>
            <option value="">Seleccionar...</option>
            ${workers.map(w => `<option value="${w.id}">${w.name} — ${w.role}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Fondo Inicial ($)</label>
          <input class="form-control" name="openAmt" type="number" min="0" step="0.01" value="200.00" required />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-unlock"></i> Abrir Caja</button>
      </div>
    </form>`);
  },

  openSession(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const workerId = fd.get('workerId');
    const openAmt  = parseFloat(fd.get('openAmt'));
    const worker   = DB.getWorker(workerId);
    if (!worker) return;

    const id = 'CAJ' + String(DB.caja.nextId).padStart(3,'0');
    DB.caja.nextId++;

    DB.caja.current = {
      id, openedAt: nowStr(), closedAt: null,
      workerName: worker.name, workerId,
      openAmt, closingCount: {b100:0,b50:0,b20:0,b10:0,b5:0,b1:0,c50:0,c25:0,c10:0,c5:0,c1:0},
      closingAmt: 0, expectedAmt: 0, diff: 0, status: 'open', notes: '',
    };

    closeModalDirect();
    showToast(`Caja abierta — Fondo: ${fmt(openAmt)}`, 'success');
    navigate('caja');
  },

  openCloseForm() {
    const s = DB.caja.current;
    if (!s) return;

    const salesAmt = DB.sales.filter(sl => sl.date >= s.openedAt).reduce((a,sl) => a + sl.total, 0);
    const expected = +(s.openAmt + salesAmt).toFixed(2);

    const denoms = [
      { key:'b100', label:'$100', val:100 },
      { key:'b50',  label:'$50',  val:50  },
      { key:'b20',  label:'$20',  val:20  },
      { key:'b10',  label:'$10',  val:10  },
      { key:'b5',   label:'$5',   val:5   },
      { key:'b1',   label:'$1',   val:1   },
      { key:'c50',  label:'$0.50',val:0.5 },
      { key:'c25',  label:'$0.25',val:0.25},
      { key:'c10',  label:'$0.10',val:0.10},
      { key:'c5',   label:'$0.05',val:0.05},
      { key:'c1',   label:'$0.01',val:0.01},
    ];

    openModal('Cierre de Caja', `
    <form onsubmit="CajaModule.closeSession(event)">
      <div style="background:var(--bg);border-radius:var(--radius);padding:14px;margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px">
          <span style="color:var(--text-2)">Fondo inicial:</span><strong>${fmt(s.openAmt)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px">
          <span style="color:var(--text-2)">Ventas en sesión:</span><strong>${fmt(salesAmt)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:800;color:var(--primary)">
          <span>Total esperado:</span><span>${fmt(expected)}</span>
        </div>
      </div>
      <h4 style="font-size:13px;font-weight:700;margin-bottom:12px"><i class="fas fa-coins"></i> Conteo de Billetes y Monedas</h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:14px">
        ${denoms.map(d => `
        <div style="background:var(--bg);border-radius:var(--radius-sm);padding:8px 10px;display:flex;align-items:center;gap:8px">
          <span style="font-size:12px;font-weight:600;min-width:38px;color:var(--text-2)">${d.label}</span>
          <input class="form-control" type="number" min="0" step="1" value="0" name="${d.key}" style="width:60px;text-align:center"
            oninput="CajaModule.recalcTotal()" />
          <span style="font-size:10px;color:var(--text-3)" id="sub_${d.key}">= $0.00</span>
        </div>`).join('')}
      </div>
      <div style="background:var(--primary-l);border-radius:var(--radius);padding:12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:700">Total contado:</span>
        <span style="font-size:18px;font-weight:800;color:var(--primary)" id="cajaTotal">$0.00</span>
      </div>
      <div class="form-group">
        <label>Notas (opcional)</label>
        <textarea class="form-control" name="notes" rows="2" placeholder="Observaciones del cierre..."></textarea>
      </div>
      <input type="hidden" name="expectedAmt" value="${expected}" />
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-danger"><i class="fas fa-lock"></i> Confirmar Cierre</button>
      </div>
    </form>`, 'modal-lg');
  },

  recalcTotal() {
    const denoms = {b100:100,b50:50,b20:20,b10:10,b5:5,b1:1,c50:0.5,c25:0.25,c10:0.10,c5:0.05,c1:0.01};
    let total = 0;
    Object.entries(denoms).forEach(([key, val]) => {
      const input = document.querySelector(`[name="${key}"]`);
      if (!input) return;
      const qty = parseInt(input.value) || 0;
      const sub = +(qty * val).toFixed(2);
      total += sub;
      const subEl = document.getElementById('sub_' + key);
      if (subEl) subEl.textContent = '= $' + sub.toFixed(2);
    });
    const el = document.getElementById('cajaTotal');
    if (el) el.textContent = fmt(+total.toFixed(2));
  },

  closeSession(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const s  = DB.caja.current;
    if (!s) return;

    const denoms = {b100:100,b50:50,b20:20,b10:10,b5:5,b1:1,c50:0.5,c25:0.25,c10:0.10,c5:0.05,c1:0.01};
    const count = {};
    let closingAmt = 0;
    Object.entries(denoms).forEach(([key, val]) => {
      const qty = parseInt(fd.get(key)) || 0;
      count[key] = qty;
      closingAmt += qty * val;
    });
    closingAmt = +closingAmt.toFixed(2);

    const expectedAmt = parseFloat(fd.get('expectedAmt'));
    const diff = +(closingAmt - expectedAmt).toFixed(2);

    s.closedAt    = nowStr();
    s.closingCount= count;
    s.closingAmt  = closingAmt;
    s.expectedAmt = expectedAmt;
    s.diff        = diff;
    s.status      = 'closed';
    s.notes       = fd.get('notes');

    DB.caja.sessions.push(s);
    DB.caja.current = null;

    closeModalDirect();
    showToast(`Caja cerrada. Diferencia: ${fmt(Math.abs(diff))} ${diff < 0 ? '(faltante)' : diff > 0 ? '(sobrante)' : '(exacto)'}`, diff === 0 ? 'success' : 'warning');
    navigate('caja');
  },

  viewDetail(cid) {
    const s = DB.caja.sessions.find(x => x.id === cid);
    if (!s) return;
    const denoms = [
      {key:'b100',label:'Billetes $100',val:100},{key:'b50',label:'Billetes $50',val:50},
      {key:'b20',label:'Billetes $20',val:20},{key:'b10',label:'Billetes $10',val:10},
      {key:'b5',label:'Billetes $5',val:5},{key:'b1',label:'Billetes $1',val:1},
      {key:'c50',label:'Monedas $0.50',val:0.5},{key:'c25',label:'Monedas $0.25',val:0.25},
      {key:'c10',label:'Monedas $0.10',val:0.10},{key:'c5',label:'Monedas $0.05',val:0.05},
      {key:'c1',label:'Monedas $0.01',val:0.01},
    ];
    const diffColor = s.diff === 0 ? 'var(--secondary)' : s.diff > 0 ? 'var(--cyan)' : 'var(--danger)';
    const diffLabel = s.diff === 0 ? 'Exacto' : s.diff > 0 ? 'Sobrante' : 'Faltante';

    openModal(`Detalle Sesión — ${s.id}`, `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${[
        ['Sesión', s.id, 'fa-hashtag'],
        ['Cajero', s.workerName, 'fa-user-tie'],
        ['Apertura', fmtDatetime(s.openedAt), 'fa-lock-open'],
        ['Cierre', s.closedAt ? fmtDatetime(s.closedAt) : '—', 'fa-lock'],
        ['Fondo Inicial', fmt(s.openAmt), 'fa-dollar-sign'],
        ['Total Contado', fmt(s.closingAmt), 'fa-coins'],
        ['Total Esperado', fmt(s.expectedAmt), 'fa-calculator'],
      ].map(([label,val,icon]) => `
      <div style="background:var(--bg);padding:10px 12px;border-radius:var(--radius-sm)">
        <div style="font-size:10px;color:var(--text-3);font-weight:600;text-transform:uppercase;margin-bottom:3px"><i class="fas ${icon}"></i> ${label}</div>
        <div style="font-weight:600;font-size:13px">${val}</div>
      </div>`).join('')}
      <div style="background:var(--bg);padding:10px 12px;border-radius:var(--radius-sm)">
        <div style="font-size:10px;color:var(--text-3);font-weight:600;text-transform:uppercase;margin-bottom:3px"><i class="fas fa-scale-balanced"></i> Diferencia</div>
        <div style="font-weight:800;font-size:14px;color:${diffColor}">${diffLabel}: ${fmt(Math.abs(s.diff))}</div>
      </div>
    </div>
    <h4 style="font-size:13px;font-weight:700;margin-bottom:10px">Conteo de Efectivo</h4>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px;margin-bottom:14px">
      ${denoms.filter(d => s.closingCount[d.key] > 0).map(d => `
      <div style="background:var(--bg);border-radius:var(--radius-sm);padding:8px;font-size:12px">
        <span style="color:var(--text-2)">${d.label}:</span><br/>
        <strong>${s.closingCount[d.key]} × ${fmt(d.val)} = ${fmt(+(s.closingCount[d.key]*d.val).toFixed(2))}</strong>
      </div>`).join('') || `<div style="grid-column:span 3;color:var(--text-3);text-align:center;padding:8px">Sin conteo registrado</div>`}
    </div>
    ${s.notes ? `<div style="background:var(--bg);border-radius:var(--radius-sm);padding:10px 12px"><span style="font-size:11px;color:var(--text-3);font-weight:600">NOTAS:</span><br/><span style="font-size:13px">${s.notes}</span></div>` : ''}
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cerrar</button>
    </div>`, 'modal-lg');
  },
};
