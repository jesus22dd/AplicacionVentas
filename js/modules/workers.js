/* =================================================================
   MODULE: Gestión de Trabajadores
   ================================================================= */

const WorkersModule = {
  search: '',
  statusFilter: 'all',

  render() {
    const active = DB.workers.filter(w => w.status === 'active').length;
    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Gestión de Trabajadores</h2>
        <p>${DB.workers.length} empleados — ${active} activos</p>
      </div>
      <button class="btn btn-primary" onclick="WorkersModule.openForm()">
        <i class="fas fa-user-plus"></i> Nuevo Trabajador
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      ${[
        {label:'Total Empleados', val:DB.workers.length, icon:'fa-users', color:'primary'},
        {label:'Activos', val:active, icon:'fa-circle-check', color:'secondary'},
        {label:'Inactivos', val:DB.workers.length-active, icon:'fa-circle-xmark', color:'danger'},
        {label:'Cajeros', val:DB.workers.filter(w=>w.role.toLowerCase().includes('caj')).length, icon:'fa-cash-register', color:'purple'},
      ].map(s=>`
      <div class="stat-card" style="--stat-color:var(--${s.color})">
        <div class="stat-info">
          <div class="stat-label">${s.label}</div>
          <div class="stat-value">${s.val}</div>
        </div>
        <div class="stat-icon" style="background:var(--${s.color}-l)"><i class="fas ${s.icon}" style="color:var(--${s.color})"></i></div>
      </div>`).join('')}
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-user-tie"></i> Equipo de Trabajo</div>
        <div class="d-flex gap-8">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar trabajador..." oninput="WorkersModule.applySearch(this.value)" />
          </div>
          <select class="filter-select" onchange="WorkersModule.applyStatus(this.value)">
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table class="tbl-workers">
          <thead>
            <tr><th>Trabajador</th><th>Cargo</th><th>Email</th><th>Teléfono</th><th>Fecha Ingreso</th><th>Salario</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody id="workersBody"></tbody>
        </table>
      </div>
    </div>`;
  },

  init() {
    this.search = '';
    this.statusFilter = 'all';
    this.renderTable();
  },

  getFiltered() {
    let items = [...DB.workers];
    if (this.statusFilter !== 'all') items = items.filter(w => w.status === this.statusFilter);
    if (this.search) {
      const t = this.search.toLowerCase();
      items = items.filter(w => w.name.toLowerCase().includes(t) || w.role.toLowerCase().includes(t) || w.email.toLowerCase().includes(t));
    }
    return items;
  },

  renderTable() {
    const items = this.getFiltered();
    const tbody = document.getElementById('workersBody');
    if (!tbody) return;
    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fas fa-users"></i><h4>Sin resultados</h4></div></td></tr>`;
      return;
    }

    const colors = ['#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#06b6d4','#f97316','#ec4899','#84cc16','#a855f7'];
    tbody.innerHTML = items.map((w,i) => {
      const color = colors[i % colors.length];
      const saleStat = w.sales > 0 ? `<span class="badge badge-primary">${w.sales} ventas</span>` : `<span class="badge badge-gray">—</span>`;
      return `
      <tr>
        <td>
          <div class="person-info">
            <div class="person-avatar" style="background:${color}">${w.avatar}</div>
            <div>
              <div class="person-name">${w.name}</div>
              <div class="person-sub">${w.address.split(',')[0]}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-purple"><i class="fas fa-briefcase"></i>${w.role}</span></td>
        <td style="font-size:12px">${w.email}</td>
        <td style="font-size:12px">${w.phone}</td>
        <td style="font-size:12px">${fmtDate(w.hireDate)}</td>
        <td><strong>${fmt(w.salary)}</strong><span style="font-size:10px;color:var(--text-3)">/mes</span></td>
        <td>${statusBadge(w.status)}</td>
        <td>
          <div class="d-flex gap-8">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="WorkersModule.viewDetail('${w.id}')" title="Ver detalle"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-secondary btn-icon" onclick="WorkersModule.openForm('${w.id}')" title="Editar"><i class="fas fa-pen"></i></button>
            <button class="btn btn-sm btn-outline-danger btn-icon" onclick="WorkersModule.deleteWorker('${w.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');
  },

  applySearch(val) { this.search = val; this.renderTable(); },
  applyStatus(val) { this.statusFilter = val; this.renderTable(); },

  viewDetail(wid) {
    const w = DB.getWorker(wid);
    if (!w) return;
    const workerSales = DB.sales.filter(s => s.workId === wid);
    const totalSales = salesTotal(workerSales);
    openModal(`Detalle — ${w.name}`, `
    <div style="text-align:center;margin-bottom:20px">
      <div class="person-avatar" style="background:#3b82f6;width:64px;height:64px;font-size:22px;margin:0 auto 10px">${w.avatar}</div>
      <h3>${w.name}</h3>
      <p style="color:var(--text-2)">${w.role}</p>
      ${statusBadge(w.status)}
    </div>
    <div class="form-grid form-grid-2" style="gap:12px">
      ${[
        ['Correo Electrónico', w.email, 'fa-envelope'],
        ['Teléfono', w.phone, 'fa-phone'],
        ['Dirección', w.address, 'fa-location-dot'],
        ['Fecha de Ingreso', fmtDate(w.hireDate), 'fa-calendar'],
        ['Salario Mensual', fmt(w.salary), 'fa-dollar-sign'],
        ['Ventas Realizadas', workerSales.length + ' transacciones', 'fa-receipt'],
        ['Total Vendido', fmt(totalSales), 'fa-chart-line'],
      ].map(([label, val, icon]) => `
      <div style="background:var(--bg);padding:12px;border-radius:var(--radius-sm)">
        <div style="font-size:10px;color:var(--text-3);font-weight:600;text-transform:uppercase;margin-bottom:4px"><i class="fas ${icon}"></i> ${label}</div>
        <div style="font-weight:600">${val}</div>
      </div>`).join('')}
    </div>
    ${workerSales.length > 0 ? `
    <div style="margin-top:16px">
      <h4 style="font-size:13px;font-weight:700;margin-bottom:10px">Últimas Ventas</h4>
      ${workerSales.slice(-5).reverse().map(s=>`
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span><span class="badge badge-primary">${s.id}</span> ${fmtDatetime(s.date)}</span>
        <strong>${fmt(s.total)}</strong>
      </div>`).join('')}
    </div>` : ''}
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cerrar</button>
      <button class="btn btn-primary" onclick="closeModalDirect();WorkersModule.openForm('${w.id}')">Editar</button>
    </div>`, 'modal-lg');
  },

  openForm(wid = null) {
    const w = wid ? DB.getWorker(wid) : null;
    const roles = ['Administrador','Cajero','Cajera','Supervisora','Supervisor','Bodeguero','Contadora','Contador','Asistente','Guardia'];
    openModal(w ? 'Editar Trabajador' : 'Nuevo Trabajador', `
    <form onsubmit="WorkersModule.saveWorker(event,'${wid||''}')">
      <div class="form-grid form-grid-2">
        <div class="form-group full">
          <label>Nombre Completo</label>
          <input class="form-control" name="name" value="${w?w.name:''}" required placeholder="Nombre y apellidos" />
        </div>
        <div class="form-group">
          <label>Cargo / Puesto</label>
          <input class="form-control" name="role" value="${w?w.role:'Cajero/a'}" placeholder="Cajero, Supervisor..." />
        </div>
        <div class="form-group">
          <label>Rol del Sistema (Permisos)</label>
          <select class="form-control" name="roleId">
            ${DB.roles.map(r=>`<option value="${r.id}" ${w&&w.roleId===r.id?'selected':''}>${r.name} — ${r.description||r.id}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select class="form-control" name="status">
            <option value="active" ${!w||w.status==='active'?'selected':''}>Activo</option>
            <option value="inactive" ${w&&w.status==='inactive'?'selected':''}>Inactivo</option>
          </select>
        </div>
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input class="form-control" name="email" type="email" value="${w?w.email:''}" placeholder="correo@empresa.com" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input class="form-control" name="phone" value="${w?w.phone:''}" placeholder="0999-000-000" />
        </div>
        <div class="form-group">
          <label>Salario Mensual ($)</label>
          <input class="form-control" name="salary" type="number" min="0" step="50" value="${w?w.salary:1500}" />
        </div>
        <div class="form-group">
          <label>Fecha de Ingreso</label>
          <input class="form-control" name="hireDate" type="date" value="${w?w.hireDate:todayStr()}" />
        </div>
        <div class="form-group full">
          <label>Dirección</label>
          <input class="form-control" name="address" value="${w?w.address:''}" placeholder="Calle, número, ciudad" />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>
      </div>
    </form>`, 'modal-lg');
  },

  saveWorker(e, wid) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    data.salary = parseFloat(data.salary);
    data.avatar = data.name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
    data.sales = 0;
    if (!wid) data.color = avatarColor(DB.workers.length);

    if (wid) {
      const w = DB.getWorker(wid);
      Object.assign(w, data);
      showToast('Trabajador actualizado', 'success');
    } else {
      data.id = 'W' + String(DB.nextWorkerId).padStart(2,'0');
      DB.nextWorkerId++;
      DB.workers.push(data);
      showToast('Trabajador registrado', 'success');
    }
    closeModalDirect();
    this.renderTable();
  },

  deleteWorker(wid) {
    const w = DB.getWorker(wid);
    openConfirm('Eliminar Trabajador', `¿Eliminar a ${w.name}?`, () => {
      DB.workers = DB.workers.filter(wk => wk.id !== wid);
      showToast('Trabajador eliminado', 'success');
      this.renderTable();
    });
  },
};
