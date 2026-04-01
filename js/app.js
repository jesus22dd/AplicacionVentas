/* =================================================================
   APP.JS — Auth + Main router + Initialization
   ================================================================= */

/* ================================================================
   AUTH — Usuarios del sistema
   ================================================================ */
const SYSTEM_USERS = [
  {
    id: 'W01',
    name: 'Administrador',
    fullName: 'Carlos Mendoza',
    role: 'Administrador',
    roleId: 'ROL01',
    avatar: 'CM',
    email: 'admin@electroshop.bo',
    password: 'admin123',
    color: '#3b82f6',
  },
  {
    id: 'W02',
    name: 'Ana López',
    fullName: 'Ana López',
    role: 'Cajera',
    roleId: 'ROL02',
    avatar: 'AL',
    email: 'cajera@electroshop.bo',
    password: 'cajera123',
    color: '#10b981',
  },
  {
    id: 'W04',
    name: 'María Torres',
    fullName: 'María Torres',
    role: 'Supervisora',
    roleId: 'ROL03',
    avatar: 'MT',
    email: 'supervisor@electroshop.bo',
    password: 'super123',
    color: '#8b5cf6',
  },
];

let currentUser = null;

const Auth = {
  /* ---- Render credential cards ---- */
  renderCredentials() {
    const modLabels = {
      dashboard:'Dashboard', pos:'POS/Ventas', caja:'Caja', products:'Productos',
      inventory:'Inventario', categories:'Categorías', workers:'Trabajadores',
      customers:'Clientes', suppliers:'Proveedores', purchases:'Compras',
      sales:'Historial Ventas', returns:'Devoluciones', reports:'Reportes',
      quotations:'Cotizaciones', pendientes:'Pendientes', roles:'Roles', config:'Configuración',
    };
    const roleIcons = { ROL01:'fa-shield-halved', ROL02:'fa-cash-register', ROL03:'fa-eye' };
    document.getElementById('loginCredentials').innerHTML = SYSTEM_USERS.map(u => {
      const role = DB.roles.find(r => r.id === u.roleId);
      let permHtml = '';
      if (role) {
        if (u.roleId === 'ROL01') {
          permHtml = `<div class="cred-perms"><span class="cred-perm-ok"><i class="fas fa-check-circle"></i> Acceso total al sistema</span></div>`;
        } else {
          const blocked = Object.entries(role.permissions).filter(([,p])=>!p.read).map(([m])=>modLabels[m]||m);
          const noCreate = Object.entries(role.permissions).filter(([,p])=>p.read&&!p.create&&!p.edit&&!p.delete).map(([m])=>modLabels[m]||m);
          permHtml = `<div class="cred-perms">
            ${blocked.length?`<div class="cred-perm-blocked"><i class="fas fa-ban"></i> Sin acceso: ${blocked.join(' · ')}</div>`:''}
            ${noCreate.length?`<div class="cred-perm-readonly"><i class="fas fa-eye"></i> Solo lectura: ${noCreate.join(' · ')}</div>`:''}
          </div>`;
        }
      }
      return `<div class="cred-card" onclick="Auth.fillCredentials('${u.email}','${u.password}')" style="--cred-color:${u.color}">
        <div class="cred-avatar" style="background:${u.color}">${u.avatar}</div>
        <div class="cred-info">
          <div class="cred-role"><i class="fas ${roleIcons[u.roleId]||'fa-user'}" style="color:${u.color};margin-right:5px"></i>${u.fullName} — <span style="opacity:.7">${u.role}</span></div>
          <div class="cred-email"><i class="fas fa-envelope" style="font-size:9px;margin-right:4px;opacity:.6"></i>${u.email}</div>
          <div class="cred-pass"><i class="fas fa-key" style="font-size:9px;margin-right:4px;opacity:.6"></i>${u.password}</div>
          ${permHtml}
        </div>
        <button class="cred-fill-btn" onclick="event.stopPropagation();Auth.fillCredentials('${u.email}','${u.password}')">
          <i class="fas fa-arrow-right-to-bracket"></i> Usar
        </button>
      </div>`;
    }).join('');
  },

  /* ---- Fill form with credentials ---- */
  fillCredentials(email, password) {
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = password;
    document.getElementById('loginError').classList.remove('show');
    // Small visual feedback
    document.getElementById('loginSubmitBtn').style.transform = 'scale(.98)';
    setTimeout(() => document.getElementById('loginSubmitBtn').style.transform = '', 150);
  },

  /* ---- Toggle password visibility ---- */
  togglePassword() {
    const input = document.getElementById('loginPassword');
    const icon  = document.getElementById('loginEyeIcon');
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fas fa-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'fas fa-eye';
    }
  },

  /* ---- Login ---- */
  login(e) {
    e.preventDefault();
    const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const errEl    = document.getElementById('loginError');
    const errMsg   = document.getElementById('loginErrorMsg');
    const btnText  = document.getElementById('loginBtnText');
    const btnLoad  = document.getElementById('loginBtnLoad');
    const submitBtn = document.getElementById('loginSubmitBtn');

    // Hide previous error
    errEl.classList.remove('show');

    // Show loading state
    btnText.style.display = 'none';
    btnLoad.style.display = 'inline-flex';
    submitBtn.disabled = true;

    // Simulate async check
    setTimeout(() => {
      const user = SYSTEM_USERS.find(u => u.email === email && u.password === password);

      if (!user) {
        errMsg.textContent = 'Correo o contraseña incorrectos. Usa las credenciales de abajo.';
        errEl.classList.add('show');
        btnText.style.display = 'inline-flex';
        btnLoad.style.display = 'none';
        submitBtn.disabled = false;
        // Shake animation
        document.getElementById('loginForm').style.animation = 'shake .4s ease';
        setTimeout(() => document.getElementById('loginForm').style.animation = '', 500);
        return;
      }

      // Success
      currentUser = user;
      this._applyUser(user);
      this._hideLoginScreen();
      showToast(`Bienvenido, ${user.fullName}`, 'success');

    }, 700);
  },

  /* ---- Apply logged-in user to UI ---- */
  _applyUser(user) {
    // Sidebar identity
    document.getElementById('sidebarAvatar').textContent      = user.avatar;
    document.getElementById('sidebarAvatar').style.background = user.color;
    document.getElementById('sidebarUserName').textContent    = user.fullName;
    document.getElementById('sidebarUserRole').textContent    = user.role;
    // Topbar
    document.getElementById('topbarAvatar').textContent      = user.avatar;
    document.getElementById('topbarAvatar').style.background = user.color;
    document.getElementById('topbarUserName').textContent    = user.role;

    // Apply role permissions to sidebar nav
    const role = DB.getRole(user.roleId);
    if (role) {
      document.querySelectorAll('.nav-item[data-module]').forEach(item => {
        const mod = item.dataset.module;
        const perm = role.permissions[mod];
        item.style.display = (!perm || perm.read) ? '' : 'none';
      });
      // Hide nav group labels whose items are all hidden
      document.querySelectorAll('.nav-group-label').forEach(label => {
        let el = label.nextElementSibling;
        let anyVisible = false;
        while (el && !el.classList.contains('nav-group-label')) {
          if (el.classList.contains('nav-item') && el.style.display !== 'none') anyVisible = true;
          el = el.nextElementSibling;
        }
        label.style.display = anyVisible ? '' : 'none';
      });
    }
  },

  /* ---- Hide login screen ---- */
  _hideLoginScreen() {
    const screen = document.getElementById('loginScreen');
    screen.classList.add('hidden');
    setTimeout(() => { screen.style.display = 'none'; }, 420);
    navigate('dashboard');
  },

  /* ---- Logout ---- */
  logout() {
    openConfirm(
      'Cerrar Sesión',
      `¿Deseas cerrar la sesión de ${currentUser?.fullName || 'usuario'}?`,
      () => {
        currentUser = null;
        Charts.destroyAll();
        // Restore all nav items
        document.querySelectorAll('.nav-item, .nav-group-label').forEach(i => { i.style.display = ''; });

        // Reset form
        document.getElementById('loginEmail').value    = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginError').classList.remove('show');
        document.getElementById('loginBtnText').style.display = 'inline-flex';
        document.getElementById('loginBtnLoad').style.display = 'none';
        document.getElementById('loginSubmitBtn').disabled = false;
        document.getElementById('loginPassword').type = 'password';
        document.getElementById('loginEyeIcon').className = 'fas fa-eye';

        // Show login screen
        const screen = document.getElementById('loginScreen');
        screen.style.display = 'flex';
        setTimeout(() => screen.classList.remove('hidden'), 10);

        showToast('Sesión cerrada correctamente', 'info');
      }
    );
  },
};

/* ================================================================
   ROUTER
   ================================================================ */
const MODULES = {
  dashboard:  { module: DashboardModule,   label: 'Dashboard',           icon: 'fa-chart-pie'      },
  pos:        { module: POSModule,         label: 'Punto de Venta',      icon: 'fa-cash-register'  },
  caja:       { module: CajaModule,        label: 'Corte de Caja',       icon: 'fa-vault'          },
  products:   { module: ProductsModule,    label: 'Productos',           icon: 'fa-boxes-stacked'  },
  inventory:  { module: InventoryModule,   label: 'Inventario',          icon: 'fa-warehouse'      },
  categories: { module: CategoriesModule,  label: 'Categorías',          icon: 'fa-tags'           },
  workers:    { module: WorkersModule,     label: 'Trabajadores',        icon: 'fa-user-tie'       },
  customers:  { module: CustomersModule,   label: 'Clientes',            icon: 'fa-users'          },
  suppliers:  { module: SuppliersModule,   label: 'Proveedores',         icon: 'fa-truck'          },
  purchases:  { module: PurchasesModule,   label: 'Órdenes de Compra',   icon: 'fa-cart-flatbed'   },
  returns:    { module: ReturnsModule,     label: 'Devoluciones',        icon: 'fa-rotate-left'    },
  sales:      { module: SalesModule,       label: 'Historial de Ventas', icon: 'fa-receipt'        },
  reports:    { module: ReportsModule,     label: 'Reportes',            icon: 'fa-chart-bar'      },
  quotations: { module: QuotationsModule,  label: 'Cotizaciones',        icon: 'fa-file-invoice'   },
  pendientes: { module: PendientesModule,  label: 'Pendientes',          icon: 'fa-piggy-bank'     },
  roles:      { module: RolesModule,       label: 'Roles y Permisos',    icon: 'fa-shield-halved'  },
  config:     { module: ConfigModule,      label: 'Configuración',       icon: 'fa-gear'           },
};

let currentModule = 'dashboard';

function navigate(moduleKey) {
  if (!MODULES[moduleKey]) return;
  // Permission check
  if (currentUser) {
    const role = DB.getRole(currentUser.roleId);
    if (role) {
      const perm = role.permissions[moduleKey];
      if (perm && !perm.read) {
        showToast('No tienes permiso para acceder a esta sección', 'warning');
        return;
      }
    }
  }
  Charts.destroyAll();
  currentModule = moduleKey;
  const { module, label, icon } = MODULES[moduleKey];

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.module === moduleKey);
  });

  document.getElementById('breadcrumbText').textContent = label;
  const bc = document.querySelector('.breadcrumb i');
  if (bc) bc.className = 'fas ' + icon;

  const contentArea = document.getElementById('contentArea');
  contentArea.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';

  // Close mobile sidebar on navigation
  if (window.innerWidth <= 768) closeSidebarMobile();

  setTimeout(() => {
    try {
      contentArea.innerHTML = module.render();
      if (module.init) module.init();
    } catch(err) {
      console.error('Module error:', err);
      contentArea.innerHTML = `<div class="empty-state"><i class="fas fa-triangle-exclamation"></i><h4>Error</h4><p>${err.message}</p></div>`;
    }
  }, 80);
}

/* ================================================================
   CLOCK
   ================================================================ */
function updateClock() {
  const now = new Date();
  const dateEl = document.getElementById('topbarDate');
  const timeEl = document.getElementById('topbarTime');
  if (dateEl) dateEl.textContent = now.toLocaleDateString('es-BO', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });
  if (timeEl) timeEl.textContent = now.toLocaleTimeString('es-BO', { hour:'2-digit', minute:'2-digit' });
}

/* ================================================================
   LOW STOCK BADGE
   ================================================================ */
function updateNotifDot() {
  const lowCount = getLowStockItems().length + getOutOfStockItems().length;
  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = lowCount > 0 ? 'block' : 'none';
}

/* ================================================================
   EVENT LISTENERS
   ================================================================ */

// Sidebar toggle
document.getElementById('btnToggleSidebar').addEventListener('click', () => {
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.toggle('mobile-open');
    document.getElementById('sidebarOverlay').classList.toggle('active');
  } else {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('mainWrapper').classList.toggle('sidebar-collapsed');
  }
});

function closeSidebarMobile() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

// Sidebar nav
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const mod = item.dataset.module;
    if (mod) navigate(mod);
  });
});

// ESC closes modals
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModalDirect();
    closeConfirm();
    closeReceipt();
  }
});

// Shake keyframe for login
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`;
document.head.appendChild(shakeStyle);


/* ================================================================
   INIT
   ================================================================ */
// Asegurar que todas las ventas tengan qrHash (las ventas demo no lo traen en data.js)
DB.sales.forEach(s => { if (!s.qrHash) s.qrHash = s.id.toLowerCase() + 'demo' + s.id.slice(-3); });

updateClock();
setInterval(updateClock, 60000);
updateNotifDot();
Auth.renderCredentials();

console.log('%cElectroShop POS v2.0', 'color:#3b82f6;font-size:18px;font-weight:bold');
console.log('%c' + DB.products.length + ' productos | ' + DB.workers.length + ' trabajadores | ' + DB.sales.length + ' ventas', 'color:#10b981');
