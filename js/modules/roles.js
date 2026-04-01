/* =================================================================
   MODULE: Roles y Permisos
   ================================================================= */

const RolesModule = {
  _MODULE_LABELS: {
    dashboard:  'Dashboard',
    pos:        'Punto de Venta',
    caja:       'Corte de Caja',
    products:   'Productos',
    inventory:  'Inventario',
    categories: 'Categorías',
    workers:    'Trabajadores',
    customers:  'Clientes',
    suppliers:  'Proveedores',
    purchases:  'Órdenes de Compra',
    returns:    'Devoluciones',
    sales:      'Historial Ventas',
    reports:    'Reportes',
    quotations: 'Cotizaciones',
    pendientes: 'Pendientes',
    roles:      'Roles',
    config:     'Configuración',
  },
  _ACTIONS: ['read','create','edit','delete'],
  _ACTION_LABELS: { read:'Leer', create:'Crear', edit:'Editar', delete:'Eliminar' },

  render() {
    const rows = DB.roles.map(role => {
      const workerCount = DB.workers.filter(w => w.roleId === role.id).length;
      const totalPerms  = Object.values(role.permissions).reduce((s, p) => s + Object.values(p).filter(v=>v).length, 0);
      return `<tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;border-radius:50%;background:${role.color}20;color:${role.color};
              display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0">
              ${role.name[0].toUpperCase()}
            </div>
            <div>
              <div style="font-weight:700">${role.name}</div>
              <div style="font-size:11px;color:var(--text-3)">${role.description||''}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-primary">${role.id}</span></td>
        <td>${workerCount} ${workerCount===1?'trabajador':'trabajadores'}</td>
        <td>${totalPerms} permisos activos</td>
        <td>
          ${role.isSystem?`<span class="badge badge-gray">Sistema</span>`:'<span class="badge badge-success">Personalizado</span>'}
        </td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-secondary" onclick="RolesModule.viewRole('${role.id}')" title="Ver permisos"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-primary" onclick="RolesModule.showForm('${role.id}')" title="Editar"><i class="fas fa-pen"></i></button>
            ${!role.isSystem?`<button class="btn btn-sm btn-outline-danger" onclick="RolesModule.deleteRole('${role.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>`:''}
          </div>
        </td>
      </tr>`;
    }).join('');

    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Roles y Permisos</h2>
        <p>Gestiona el control de acceso por rol de usuario</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="RolesModule.showForm()">
          <i class="fas fa-plus"></i> Nuevo Rol
        </button>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-shield-halved"></i> Roles del Sistema</div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table tbl-roles">
            <thead>
              <tr><th>Rol</th><th>ID</th><th>Asignados</th><th>Permisos</th><th>Tipo</th><th>Acciones</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Workers by role summary -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-user-tie"></i> Trabajadores por Rol</div>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
          ${DB.roles.map(role => {
            const workers = DB.workers.filter(w => w.roleId === role.id && w.status === 'active');
            return `<div style="background:var(--bg-2);border-radius:var(--radius);padding:14px;border-left:3px solid ${role.color}">
              <div style="font-weight:700;font-size:13px;margin-bottom:8px;color:${role.color}">${role.name}</div>
              ${!workers.length ? `<div style="font-size:12px;color:var(--text-3)">Sin trabajadores</div>` :
                workers.map(w => `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:12px">
                  <div style="width:24px;height:24px;border-radius:50%;background:${w.color};color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center">${w.avatar}</div>
                  ${w.name}
                </div>`).join('')}
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  },

  init() {},

  viewRole(id) {
    const role = DB.getRole(id);
    if (!role) return;
    const mods  = Object.keys(this._MODULE_LABELS);
    const acts  = this._ACTIONS;
    const aLbls = this._ACTION_LABELS;

    const tableRows = mods.map(mod => {
      const perms = role.permissions[mod] || {};
      const cells = acts.map(a => {
        const has = !!perms[a];
        return `<td style="text-align:center">
          <span style="color:${has?'var(--success)':'var(--border)'};font-size:14px">
            <i class="fas ${has?'fa-check-circle':'fa-times-circle'}"></i>
          </span>
        </td>`;
      }).join('');
      return `<tr>
        <td style="font-weight:500;font-size:13px">${this._MODULE_LABELS[mod]}</td>
        ${cells}
      </tr>`;
    }).join('');

    const html = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="width:48px;height:48px;border-radius:50%;background:${role.color}20;color:${role.color};
          font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center">
          ${role.name[0].toUpperCase()}
        </div>
        <div>
          <div style="font-size:18px;font-weight:800">${role.name}</div>
          <div style="font-size:12px;color:var(--text-2)">${role.description||''}</div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table" style="font-size:13px">
          <thead>
            <tr>
              <th>Módulo</th>
              ${acts.map(a=>`<th style="text-align:center">${aLbls[a]}</th>`).join('')}
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <div style="margin-top:12px;display:flex;justify-content:flex-end">
        <button class="btn btn-primary" onclick="closeModalDirect();RolesModule.showForm('${role.id}')">
          <i class="fas fa-pen"></i> Editar Permisos
        </button>
      </div>`;

    openModal(`Permisos — ${role.name}`, html, 'modal-lg');
  },

  showForm(id = null) {
    const role  = id ? DB.getRole(id) : null;
    const mods  = Object.keys(this._MODULE_LABELS);
    const acts  = this._ACTIONS;
    const aLbls = this._ACTION_LABELS;

    const tableRows = mods.map(mod => {
      const perms = role?.permissions[mod] || {};
      const checkboxes = acts.map(a => {
        const checked = perms[a] ? 'checked' : '';
        return `<td style="text-align:center">
          <input type="checkbox" class="perm-check" name="perm_${mod}_${a}" ${checked}
            style="width:16px;height:16px;cursor:pointer"
            onchange="RolesModule._syncRowCheck('${mod}')" />
        </td>`;
      }).join('');
      const allChecked = acts.every(a => !!perms[a]) ? 'checked' : '';
      return `<tr>
        <td style="font-weight:500;font-size:13px">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin:0">
            <input type="checkbox" class="row-check" id="rowCheck_${mod}" ${allChecked}
              onchange="RolesModule._toggleRow('${mod}', this.checked)"
              style="width:15px;height:15px;cursor:pointer" />
            ${this._MODULE_LABELS[mod]}
          </label>
        </td>
        ${checkboxes}
      </tr>`;
    }).join('');

    const html = `
    <form onsubmit="RolesModule.saveRole(event,'${id||''}')">
      <div class="form-grid form-grid-2" style="margin-bottom:16px">
        <div class="form-group">
          <label>Nombre del Rol *</label>
          <input class="form-control" name="name" value="${role?.name||''}" required placeholder="Ej. Gerente" />
        </div>
        <div class="form-group">
          <label>Color identificador</label>
          <input type="color" class="form-control" name="color" value="${role?.color||'#3b82f6'}" style="height:40px;padding:4px" />
        </div>
        <div class="form-group full">
          <label>Descripción</label>
          <input class="form-control" name="description" value="${role?.description||''}" placeholder="Describe brevemente este rol" />
        </div>
      </div>

      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-weight:700;font-size:14px"><i class="fas fa-lock"></i> Permisos por Módulo</span>
          <div style="display:flex;gap:8px">
            <button type="button" class="btn btn-sm btn-secondary" onclick="RolesModule._setAll(true)">Marcar todo</button>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="RolesModule._setAll(false)">Desmarcar todo</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table" style="font-size:12px">
            <thead>
              <tr>
                <th>Módulo</th>
                ${acts.map(a=>`<th style="text-align:center;width:80px">${aLbls[a]}</th>`).join('')}
              </tr>
            </thead>
            <tbody id="permsTable">${tableRows}</tbody>
          </table>
        </div>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-save"></i> ${id ? 'Actualizar' : 'Crear'} Rol
        </button>
      </div>
    </form>`;

    openModal(id ? `Editar Rol — ${role?.name}` : 'Nuevo Rol', html, 'modal-lg');
  },

  _toggleRow(mod, checked) {
    const acts = this._ACTIONS;
    acts.forEach(a => {
      const cb = document.querySelector(`input[name="perm_${mod}_${a}"]`);
      if (cb) cb.checked = checked;
    });
  },

  _syncRowCheck(mod) {
    const acts = this._ACTIONS;
    const allChecked = acts.every(a => {
      const cb = document.querySelector(`input[name="perm_${mod}_${a}"]`);
      return cb && cb.checked;
    });
    const rc = document.getElementById(`rowCheck_${mod}`);
    if (rc) rc.checked = allChecked;
  },

  _setAll(checked) {
    document.querySelectorAll('.perm-check, .row-check').forEach(cb => { cb.checked = checked; });
  },

  saveRole(e, id) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name  = fd.get('name')?.trim();
    if (!name) { showToast('Ingresa el nombre del rol', 'warning'); return; }

    const mods  = Object.keys(this._MODULE_LABELS);
    const acts  = this._ACTIONS;
    const permissions = {};
    mods.forEach(mod => {
      permissions[mod] = {};
      acts.forEach(a => {
        permissions[mod][a] = !!fd.get(`perm_${mod}_${a}`);
      });
    });

    if (id) {
      const role = DB.getRole(id);
      if (role) {
        role.name        = name;
        role.color       = fd.get('color') || role.color;
        role.description = fd.get('description') || '';
        role.permissions = permissions;
        showToast('Rol actualizado', 'success');
      }
    } else {
      const newId = genId('ROL', DB.roles.length + 1);
      DB.roles.push({
        id: newId,
        name,
        description: fd.get('description') || '',
        color: fd.get('color') || '#3b82f6',
        isSystem: false,
        permissions,
      });
      showToast('Rol creado correctamente', 'success');
    }
    closeModalDirect();
    navigate('roles');
  },

  deleteRole(id) {
    const role = DB.getRole(id);
    if (!role) return;
    if (role.isSystem) { showToast('Los roles del sistema no se pueden eliminar', 'warning'); return; }
    const inUse = DB.workers.filter(w => w.roleId === id).length;
    if (inUse > 0) {
      showToast(`Este rol está asignado a ${inUse} trabajador(es). Reasigna antes de eliminar.`, 'warning');
      return;
    }
    openConfirm('Eliminar Rol', `¿Eliminar el rol "${role.name}"?`, () => {
      const idx = DB.roles.findIndex(r => r.id === id);
      if (idx >= 0) { DB.roles.splice(idx, 1); showToast('Rol eliminado', 'info'); navigate('roles'); }
    });
  },
};
