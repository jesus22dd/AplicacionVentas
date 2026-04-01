/* =================================================================
   MODULE: Configuración del Sistema
   ================================================================= */

const ConfigModule = {
  render() {
    const c = DB.config;
    return `
    <div class="page-header">
      <div class="page-title">
        <h2>Configuración del Sistema</h2>
        <p>Ajusta los parámetros generales de tu negocio</p>
      </div>
    </div>

    <div class="form-grid form-grid-2" style="gap:20px">

      <!-- Información del negocio -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fas fa-store"></i> Información del Negocio</div>
        </div>
        <div class="card-body">
          <form onsubmit="ConfigModule.saveGeneral(event)">
            <div class="form-group">
              <label>Nombre del Negocio</label>
              <input class="form-control" name="name" value="${c.name}" required />
            </div>
            <div class="form-group">
              <label>Razón Social</label>
              <input class="form-control" name="legalName" value="${c.legalName}" />
            </div>
            <div class="form-group">
              <label>RUC / Identificación</label>
              <input class="form-control" name="ruc" value="${c.ruc}" />
            </div>
            <div class="form-group">
              <label>Dirección</label>
              <input class="form-control" name="address" value="${c.address}" />
            </div>
            <div class="form-group">
              <label>Ciudad / Provincia</label>
              <input class="form-control" name="city" value="${c.city}" />
            </div>
            <div class="form-group">
              <label>País</label>
              <input class="form-control" name="country" value="${c.country}" />
            </div>
            <div class="form-group">
              <label>Teléfono Fijo</label>
              <input class="form-control" name="phone" value="${c.phone}" />
            </div>
            <div class="form-group">
              <label>Celular / Móvil</label>
              <input class="form-control" name="mobile" value="${c.mobile}" />
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input class="form-control" name="email" type="email" value="${c.email}" />
            </div>
            <div class="form-group">
              <label>Sitio Web</label>
              <input class="form-control" name="website" value="${c.website}" />
            </div>
            <div class="form-group">
              <label>Régimen Tributario</label>
              <input class="form-control" name="regime" value="${c.regime}" />
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%">
              <i class="fas fa-save"></i> Guardar Información
            </button>
          </form>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px">

        <!-- Logo del Negocio -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-image"></i> Logo del Negocio</div>
          </div>
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px">
              <div id="cfgLogoPreview" style="width:72px;height:72px;border-radius:14px;background:var(--primary);color:#fff;font-size:26px;font-weight:800;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0">
                ${c.logoImg ? `<img src="${c.logoImg}" style="width:100%;height:100%;object-fit:cover" />` : c.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style="font-weight:600;font-size:13px;margin-bottom:4px">Logo actual</div>
                <div style="font-size:12px;color:var(--text-3)">Aparece en recibos, cotizaciones y PDF</div>
              </div>
            </div>
            <input type="file" id="cfgLogoInput" accept="image/*" style="display:none" onchange="ConfigModule.onLogoFile(this)" />
            <div style="display:flex;gap:8px">
              <button type="button" class="btn btn-primary" onclick="document.getElementById('cfgLogoInput').click()">
                <i class="fas fa-upload"></i> Subir Logo
              </button>
              ${c.logoImg ? `<button type="button" class="btn btn-outline-danger" onclick="ConfigModule.removeLogo()">
                <i class="fas fa-trash"></i> Quitar
              </button>` : ''}
            </div>
            <div style="margin-top:8px;font-size:11px;color:var(--text-3)">PNG, JPG, WebP — se comprimirá automáticamente a ≤200 KB.</div>
          </div>
        </div>

        <!-- Tipo de Cambio y Moneda -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-dollar-sign"></i> Tipo de Cambio y Moneda</div>
          </div>
          <div class="card-body">
            <form onsubmit="ConfigModule.saveExchange(event)">
              <div class="form-grid form-grid-2">
                <div class="form-group">
                  <label>Tipo de Cambio (USD → Bs.)</label>
                  <input class="form-control" name="exchangeRate" type="number" min="1" step="0.01" value="${c.exchangeRate||9.35}" />
                </div>
                <div class="form-group">
                  <label>Mostrar precios en</label>
                  <select class="form-control" name="displayCurrency">
                    <option value="Bs." ${(c.displayCurrency||'Bs.')===',Bs.'?'selected':''} ${(c.displayCurrency||'Bs.')==='Bs.'?'selected':''}>Bolivianos (Bs.)</option>
                    <option value="USD" ${c.displayCurrency==='USD'?'selected':''}>Dólares (USD)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Símbolo de Moneda</label>
                  <input class="form-control" name="currencySymbol" value="${c.currencySymbol||'Bs.'}" style="width:70px" />
                </div>
                <div class="form-group">
                  <label>Moneda Base</label>
                  <input class="form-control" value="USD — Dólar Americano" disabled style="background:var(--bg-2);color:var(--text-3)" />
                </div>
              </div>
              <div style="background:var(--bg-2);border-radius:var(--radius);padding:10px;font-size:12px;color:var(--text-2);margin-bottom:12px">
                <i class="fas fa-info-circle" style="color:var(--primary)"></i>
                Los precios de compra/venta se almacenan en USD. El tipo de cambio convierte los totales a Bs. para mostrar al cliente.
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%">
                <i class="fas fa-save"></i> Guardar Tipo de Cambio
              </button>
            </form>
          </div>
        </div>

        <!-- Facturación e IVA -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-file-invoice"></i> Facturación e IVA</div>
          </div>
          <div class="card-body">
            <form onsubmit="ConfigModule.saveInvoice(event)">
              <div class="form-grid form-grid-2">
                <div class="form-group">
                  <label>IVA (%)</label>
                  <input class="form-control" name="iva" type="number" min="0" max="100" step="1" value="${c.iva}" />
                </div>
                <div class="form-group">
                  <label>Prefijo Factura</label>
                  <input class="form-control" name="invoicePrefix" value="${c.invoicePrefix}" />
                </div>
                <div class="form-group full">
                  <label>Secuencial Actual</label>
                  <input class="form-control" name="invoiceSeq" type="number" min="1" value="${c.invoiceSeq}" />
                </div>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%">
                <i class="fas fa-save"></i> Guardar Facturación
              </button>
            </form>
          </div>
        </div>

        <!-- Mensajes de recibo -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-receipt"></i> Mensajes de Recibo</div>
          </div>
          <div class="card-body">
            <form onsubmit="ConfigModule.saveReceipt(event)">
              <div class="form-group">
                <label>Mensaje de Agradecimiento</label>
                <textarea class="form-control" name="receiptMsg" rows="2">${c.receiptMsg}</textarea>
              </div>
              <div class="form-group">
                <label>Pie de Factura</label>
                <textarea class="form-control" name="invoiceFooter" rows="2">${c.invoiceFooter}</textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%">
                <i class="fas fa-save"></i> Guardar Mensajes
              </button>
            </form>
          </div>
        </div>

        <!-- Métodos de Pago -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-wallet"></i> Métodos de Pago</div>
          </div>
          <div class="card-body" style="padding-bottom:4px">
            ${(c.paymentMethods||[]).map(pm => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
              <i class="fas ${pm.icon}" style="width:18px;text-align:center;color:var(--primary);font-size:15px"></i>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:13px">${pm.label}</div>
                ${pm.extra?.bank ? `<div style="font-size:11px;color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${pm.extra.bank}</div>` : ''}
              </div>
              <label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer;flex-shrink:0">
                <input type="checkbox" ${pm.active?'checked':''} onchange="ConfigModule.togglePayMethod('${pm.id}',this.checked)" style="width:14px;height:14px" />
                <span style="color:${pm.active?'var(--secondary)':'var(--text-3)'}">${pm.active?'Activo':'Inactivo'}</span>
              </label>
              <button class="btn btn-sm btn-secondary" onclick="ConfigModule.editPayMethod('${pm.id}')" title="Editar datos">
                <i class="fas fa-pen"></i>
              </button>
            </div>`).join('')}
          </div>
        </div>

        <!-- Plantilla WhatsApp -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fab fa-whatsapp" style="color:#25d366"></i> WhatsApp</div>
          </div>
          <div class="card-body">
            <form onsubmit="ConfigModule.saveWhatsapp(event)">
              <div class="form-group">
                <label><i class="fas fa-globe" style="color:var(--primary)"></i> País (prefijo)</label>
                <select class="form-control filter-select" name="whatsappCountryCode" style="width:100%">
                  ${[
                    ['591','Bolivia (+591)'],['54','Argentina (+54)'],['56','Chile (+56)'],
                    ['57','Colombia (+57)'],['506','Costa Rica (+506)'],['53','Cuba (+53)'],
                    ['593','Ecuador (+593)'],['503','El Salvador (+503)'],['502','Guatemala (+502)'],
                    ['504','Honduras (+504)'],['52','México (+52)'],['505','Nicaragua (+505)'],
                    ['507','Panamá (+507)'],['595','Paraguay (+595)'],['51','Perú (+51)'],
                    ['1787','Puerto Rico (+1787)'],['1809','Rep. Dominicana (+1809)'],
                    ['598','Uruguay (+598)'],['58','Venezuela (+58)'],['34','España (+34)'],
                    ['1','USA/Canadá (+1)'],
                  ].map(([code,label])=>`<option value="${code}"${(c.whatsappCountryCode||'591')===code?' selected':''}>${label}</option>`).join('')}
                </select>
                <small style="color:var(--text-3);font-size:11px">Se añade automáticamente a números sin código de país</small>
              </div>
              <div class="form-group">
                <label>Mensaje para cotizaciones y recibos</label>
                <textarea class="form-control" name="whatsappMsg" id="cfgWaMsg" rows="4">${c.whatsappMsg||''}</textarea>
              </div>
              <div style="background:var(--bg-2);border-radius:var(--radius);padding:10px;font-size:12px;margin-bottom:12px">
                <div style="font-weight:600;margin-bottom:6px;color:var(--text-2)"><i class="fas fa-tag"></i> Tokens — clic para insertar:</div>
                <div style="display:flex;flex-wrap:wrap;gap:5px">
                  ${['{cliente}','{usuario}','{negocio}','{numero}','{total}','{vencimiento}','{fecha}'].map(t =>
                    `<span style="background:var(--primary);color:#fff;border-radius:4px;padding:2px 8px;font-size:11px;cursor:pointer;font-weight:600"
                      onclick="ConfigModule._insertToken('${t}')">${t}</span>`
                  ).join('')}
                </div>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%">
                <i class="fas fa-save"></i> Guardar Plantilla
              </button>
            </form>
          </div>
        </div>

        <!-- Plantillas visuales -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-receipt"></i> Plantilla de Recibo</div>
          </div>
          <div class="card-body">
            ${this._templateSelector('receipt', DB.config.receiptTemplate||'T1', [
              { id:'T1', name:'Clásico', desc:'Header oscuro centrado · doble borde en total',
                preview:`<div style="background:#0f172a;color:#fff;border-radius:3px 3px 0 0;padding:4px;text-align:center;font-size:9px;font-weight:800;margin-bottom:3px">ELECTROSHOP<br/><span style="font-size:7px;opacity:.6">RUC: 1234567</span></div><div style="display:flex;justify-content:space-between;font-size:7px;color:#64748b;margin-bottom:2px"><span>F-0043</span><span>Ana López</span></div><div style="background:#f1f5f9;display:flex;justify-content:space-between;font-size:7.5px;padding:2px 4px;border-bottom:2px solid #334155"><span style="font-weight:700;color:#475569">PRODUCTO</span><span style="font-weight:700;color:#475569">SUBT.</span></div><div style="background:#f8fafc;display:flex;justify-content:space-between;font-size:7px;padding:2px 4px"><span>Cable HDMI</span><span>Bs.45</span></div><div style="border-top:2px solid #0f172a;border-bottom:2px solid #0f172a;display:flex;justify-content:space-between;font-size:9px;font-weight:900;padding:2px 0;margin-top:3px"><span>TOTAL</span><span>Bs.83</span></div>` },
              { id:'T2', name:'Ejecutivo', desc:'Header split izq/der · 2 tarjetas grises · caja oscura',
                preview:`<div style="background:#1e293b;color:#fff;border-radius:3px 3px 0 0;padding:3px 5px;display:flex;justify-content:space-between;align-items:center;margin-bottom:3px"><span style="font-size:9px;font-weight:800">ELECTROSHOP</span><div style="text-align:right;border-left:1px solid rgba(255,255,255,.2);padding-left:4px"><div style="font-size:7px;opacity:.5">FACTURA</div><div style="font-size:9px;font-weight:900">F-0043</div></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:3px"><div style="background:#f8fafc;border-top:2px solid #334155;padding:2px 4px;font-size:7px"><b style="color:#94a3b8">CAJERO</b><br/>Ana</div><div style="background:#f8fafc;border-top:2px solid #334155;padding:2px 4px;font-size:7px"><b style="color:#94a3b8">CLIENTE</b><br/>Juan</div></div><div style="background:#f8fafc;display:flex;justify-content:space-between;font-size:7px;padding:2px 4px"><span>Cable HDMI</span><span>Bs.45</span></div><div style="background:#1e293b;color:#fff;border-radius:2px;padding:3px 5px;display:flex;justify-content:space-between;font-size:9px;font-weight:800;margin-top:3px"><span>TOTAL</span><span>Bs.83</span></div>` },
              { id:'T3', name:'Minimalista', desc:'Tipografía grande · sin fondos · total XXL',
                preview:`<div style="border-bottom:3px solid #0f172a;padding-bottom:3px;display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:3px"><div style="font-size:10px;font-weight:900">ELECTROSHOP</div><div style="text-align:right"><div style="font-size:7px;color:#94a3b8">FACTURA</div><div style="font-size:11px;font-weight:900;color:#334155">F-0043</div></div></div><div style="font-size:7px;color:#64748b;margin-bottom:3px">Cliente: <b style="color:#0f172a">Juan Pérez</b></div><div style="border-bottom:1px solid #f1f5f9;font-size:7.5px;display:flex;justify-content:space-between;padding-bottom:2px;margin-bottom:2px"><span>Cable HDMI</span><span style="font-weight:600">Bs.45</span></div><div style="border-top:3px solid #0f172a;display:flex;justify-content:space-between;font-size:11px;font-weight:900;padding-top:2px;margin-top:3px"><span>TOTAL</span><span>Bs.83</span></div>` },
              { id:'T4', name:'Institucional', desc:'3 columnas de info · tabla con bordes · líneas de firma',
                preview:`<div style="background:#1e293b;color:#fff;border-radius:3px 3px 0 0;padding:3px 5px;text-align:center;font-size:9px;font-weight:800;margin-bottom:0">ELECTROSHOP</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;border:1px solid #e2e8f0;border-top:none;font-size:7px;margin-bottom:3px"><div style="padding:2px 3px;border-right:1px solid #e2e8f0"><b style="color:#94a3b8;font-size:6px">FACTURA</b><br/><b>F-0043</b></div><div style="padding:2px 3px;border-right:1px solid #e2e8f0"><b style="color:#94a3b8;font-size:6px">CLIENTE</b><br/>Juan</div><div style="padding:2px 3px"><b style="color:#94a3b8;font-size:6px">CAJERO</b><br/>Ana</div></div><div style="background:#334155;color:#fff;font-size:7.5px;display:flex;justify-content:space-between;padding:2px 4px;border:1px solid #e2e8f0"><span>DESCRIPCIÓN</span><span>SUBT.</span></div><div style="border:1px solid #e2e8f0;border-top:none;display:flex;justify-content:space-between;font-size:7px;padding:2px 4px"><span>Cable HDMI</span><span>Bs.45</span></div><div style="background:#334155;color:#fff;display:flex;justify-content:space-between;font-size:9px;font-weight:800;padding:2px 4px;margin-top:2px"><span>TOTAL</span><span>Bs.83</span></div>` },
              { id:'T5', name:'Formal', desc:'Banda con 3 columnas · cliente destacado · caja oscura',
                preview:`<div style="background:#334155;color:#fff;border-radius:3px 3px 0 0;padding:3px 5px;margin-bottom:0"><div style="font-size:9px;font-weight:800;text-align:center">ELECTROSHOP</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;margin-top:3px;border-top:1px solid rgba(255,255,255,.2);padding-top:2px;font-size:7px;text-align:center"><div><div style="opacity:.5;font-size:6px">FACTURA</div><b>F-0043</b></div><div><div style="opacity:.5;font-size:6px">FECHA</div><span>Hoy</span></div><div><div style="opacity:.5;font-size:6px">CAJERO</div><b>Ana</b></div></div></div><div style="background:#f8fafc;padding:2px 5px;font-size:7px;margin-bottom:2px"><b>Juan Pérez</b></div><div style="background:#334155;color:#fff;font-size:7px;display:flex;justify-content:space-between;padding:2px 4px"><span>PRODUCTO</span><span>SUBT.</span></div><div style="background:#f8fafc;font-size:7px;display:flex;justify-content:space-between;padding:2px 4px"><span>Cable HDMI</span><span>Bs.45</span></div><div style="background:#334155;color:#fff;border-radius:2px;display:flex;justify-content:space-between;font-size:9px;font-weight:800;padding:2px 4px;margin-top:2px"><span>TOTAL</span><span>Bs.83</span></div>` },
              { id:'T6', name:'Acento Lateral', desc:'Borde izquierdo en header y secciones · total enmarcado',
                preview:`<div style="background:#f8fafc;border-left:4px solid #475569;border-bottom:1px solid #e2e8f0;padding:3px 5px;display:flex;justify-content:space-between;align-items:center;margin-bottom:3px"><div style="font-size:9px;font-weight:800">ELECTROSHOP<br/><span style="font-size:7px;font-weight:400;color:#64748b">Cochabamba</span></div><div style="text-align:right"><div style="font-size:8px;color:#94a3b8">FACTURA</div><div style="font-size:9px;font-weight:900;color:#334155">F-0043</div></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:3px"><div style="border-left:3px solid #475569;background:#f8fafc;padding:2px 4px;font-size:7px"><b style="color:#94a3b8">CLIENTE</b><br/>Juan</div><div style="border-left:3px solid #475569;background:#f8fafc;padding:2px 4px;font-size:7px"><b style="color:#94a3b8">CAJERO</b><br/>Ana</div></div><div style="background:#f1f5f9;border-bottom:2px solid #475569;display:flex;justify-content:space-between;font-size:7px;padding:2px 4px"><span style="font-weight:700">PRODUCTO</span><span style="font-weight:700">SUBT.</span></div><div style="background:#f8fafc;font-size:7px;display:flex;justify-content:space-between;padding:2px 4px"><span>Cable HDMI</span><span>Bs.45</span></div><div style="border-left:3px solid #475569;padding:2px 4px;margin-top:3px"><div style="border-top:2px solid #334155;display:flex;justify-content:space-between;font-size:9px;font-weight:900;padding-top:2px"><span>TOTAL</span><span>Bs.83</span></div></div>` },
            ])}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-file-invoice"></i> Plantilla de Cotización</div>
          </div>
          <div class="card-body">
            ${this._templateSelector('quotation', DB.config.quotationTemplate||'T1', [
              { id:'T1', name:'Formal', desc:'A4 · azul clásico + acento naranja',
                preview:`<div style="background:#2563eb;border-radius:3px 3px 0 0;padding:4px 6px;margin-bottom:3px;display:flex;justify-content:space-between;align-items:center"><div style="color:#fff;font-size:9px;font-weight:800">ELECTROSHOP</div><div style="background:#ea580c;color:#fff;border-radius:2px;padding:1px 5px;font-size:8px;font-weight:700">COT-00001</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:3px"><div style="background:#f1f5f9;border-left:2px solid #2563eb;padding:2px 4px;font-size:7px"><b>EMISIÓN</b><br/>Ana López</div><div style="background:#f1f5f9;border-left:2px solid #10b981;padding:2px 4px;font-size:7px"><b>CLIENTE</b><br/>Juan Pérez</div></div><div style="font-size:7px;background:#f8fafc;display:flex;justify-content:space-between;padding:2px 4px"><span>DJI Mini 4 Pro</span><span>$920</span></div><div style="background:#ea580c;color:#fff;border-radius:2px;padding:3px 5px;display:flex;justify-content:space-between;font-size:9px;font-weight:800;margin-top:3px"><span>TOTAL Bs.</span><span>Bs.12,355</span></div>` },
              { id:'T2', name:'Elegante Oscuro', desc:'A4 · slate + esmeralda premium',
                preview:`<div style="background:#1e293b;border-radius:3px 3px 0 0;padding:4px 6px;margin-bottom:3px;display:flex;justify-content:space-between;align-items:center"><div style="color:#fff;font-size:9px;font-weight:800">ELECTROSHOP</div><div style="background:#10b981;color:#fff;border-radius:2px;padding:1px 5px;font-size:8px;font-weight:700">COT-00001</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:3px"><div style="background:#f0fdf4;border-left:2px solid #10b981;padding:2px 4px;font-size:7px"><b style="color:#10b981">EMISIÓN</b><br/>Ana López</div><div style="background:#f8fafc;border-left:2px solid #1e293b;padding:2px 4px;font-size:7px"><b>CLIENTE</b><br/>Juan Pérez</div></div><div style="background:#ecfdf5;font-size:7px;display:flex;justify-content:space-between;padding:2px 4px"><span>DJI Mini 4 Pro</span><span style="color:#10b981;font-weight:700">$920</span></div><div style="background:#1e293b;color:#6ee7b7;border-radius:2px;padding:3px 5px;display:flex;justify-content:space-between;font-size:9px;font-weight:800;margin-top:3px"><span>TOTAL Bs.</span><span>Bs.12,355</span></div>` },
              { id:'T3', name:'Minimalista', desc:'A4 · limpio · solo lo esencial',
                preview:`<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:3px"><div style="font-size:9px;font-weight:800">Cotización — ElectroShop</div><div style="font-size:8px;font-weight:700;color:#2563eb">COT-00001</div></div><div style="font-size:7px;color:#64748b;margin-bottom:3px">Cliente: <b style="color:#0f172a">Juan Pérez</b></div><div style="border-bottom:2px solid #0f172a;display:flex;justify-content:space-between;font-size:7.5px;font-weight:700;padding-bottom:2px;margin-bottom:2px"><span>Cant.</span><span style="flex:1;padding:0 4px">Descripción</span><span>Precio</span></div><div style="font-size:7px;display:flex;justify-content:space-between"><span>1</span><span style="flex:1;padding:0 4px">DJI Mini 4 Pro</span><span>$920</span></div><div style="font-size:9px;font-weight:800;text-align:right;margin-top:3px;border-top:1px solid #ccc;padding-top:2px">USD $920.00</div>` },
              { id:'T4', name:'Coral Profesional', desc:'A4 · rojo/coral · limpio y formal',
                preview:`<div style="border-left:5px solid #dc2626;padding:3px 6px;margin-bottom:3px"><div style="font-size:9px;font-weight:800;color:#0f172a">ELECTROSHOP</div><div style="font-size:7px;color:#64748b">Cochabamba, Bolivia</div></div><div style="background:#fef2f2;border-radius:2px;padding:2px 5px;margin-bottom:3px;display:flex;justify-content:space-between;font-size:7.5px"><span>COT-00001</span><span style="color:#dc2626;font-weight:700">Juan Pérez</span></div><div style="background:#fff5f5;display:flex;justify-content:space-between;font-size:7px;padding:2px 4px"><span>DJI Mini 4 Pro</span><span>$920</span></div><div style="background:#dc2626;color:#fff;border-radius:2px;padding:3px 5px;display:flex;justify-content:space-between;font-size:9px;font-weight:800;margin-top:3px"><span>TOTAL</span><span>$920.00</span></div>` },
              { id:'T5', name:'Tech Pro', desc:'A4 · cian/azul oscuro · tech moderno',
                preview:`<div style="background:#0c4a6e;border-radius:3px 3px 0 0;padding:4px 6px;margin-bottom:3px;display:flex;justify-content:space-between;align-items:center"><div style="color:#fff;font-size:9px;font-weight:800">ELECTROSHOP</div><div style="background:#06b6d4;color:#fff;border-radius:2px;padding:1px 5px;font-size:8px;font-weight:700">COT-00001</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:3px"><div style="background:#ecfeff;border-left:2px solid #06b6d4;padding:2px 4px;font-size:7px"><b style="color:#06b6d4">EMISIÓN</b><br/>Ana López</div><div style="background:#f0f9ff;border-left:2px solid #0c4a6e;padding:2px 4px;font-size:7px"><b>CLIENTE</b><br/>Juan Pérez</div></div><div style="background:#ecfeff;font-size:7px;display:flex;justify-content:space-between;padding:2px 4px"><span>DJI Mini 4 Pro</span><span style="color:#06b6d4;font-weight:700">$920</span></div><div style="background:#0c4a6e;color:#67e8f9;border-radius:2px;padding:3px 5px;display:flex;justify-content:space-between;font-size:9px;font-weight:800;margin-top:3px"><span>TOTAL Bs.</span><span>Bs.8,600</span></div>` },
              { id:'T6', name:'Premium Dorado', desc:'A4 · ámbar/oro · presupuesto premium',
                preview:`<div style="background:linear-gradient(135deg,#92400e,#b45309);border-radius:3px 3px 0 0;padding:4px 6px;margin-bottom:3px;display:flex;justify-content:space-between;align-items:center"><div style="color:#fef3c7;font-size:9px;font-weight:800">ELECTROSHOP</div><div style="background:#fbbf24;color:#78350f;border-radius:2px;padding:1px 5px;font-size:8px;font-weight:800">COT-00001</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:3px"><div style="background:#fffbeb;border-left:2px solid #d97706;padding:2px 4px;font-size:7px"><b style="color:#d97706">EMISIÓN</b><br/>Ana López</div><div style="background:#fef9c3;border-left:2px solid #92400e;padding:2px 4px;font-size:7px"><b style="color:#92400e">CLIENTE</b><br/>Juan Pérez</div></div><div style="background:#fffbeb;font-size:7px;display:flex;justify-content:space-between;padding:2px 4px"><span>DJI Mini 4 Pro</span><span style="color:#b45309;font-weight:700">$920</span></div><div style="background:linear-gradient(90deg,#92400e,#b45309);color:#fef3c7;border-radius:2px;padding:3px 5px;display:flex;justify-content:space-between;font-size:9px;font-weight:800;margin-top:3px"><span>TOTAL</span><span>Bs.8,600</span></div>` },
            ])}
          </div>
        </div>

        <!-- Acciones del sistema -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-gear"></i> Acciones del Sistema</div>
          </div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:10px">
            <button class="btn btn-secondary" onclick="ConfigModule.exportData()">
              <i class="fas fa-download"></i> Exportar Datos (JSON)
            </button>
            <button class="btn btn-outline-danger" onclick="ConfigModule.resetData()">
              <i class="fas fa-rotate-left"></i> Restablecer Datos de Ejemplo
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Preview card -->
    <div class="card" style="margin-top:20px">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-id-card"></i> Vista Previa del Negocio</div>
      </div>
      <div class="card-body">
        <div id="configPreview"></div>
      </div>
    </div>`;
  },

  init() {
    this.renderPreview();
  },

  renderPreview() {
    const el = document.getElementById('configPreview');
    if (!el) return;
    const c = DB.config;
    el.innerHTML = `
    <div style="max-width:400px;margin:0 auto;border:1px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center">
      <div style="width:60px;height:60px;border-radius:50%;background:var(--primary);color:#fff;font-size:24px;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;overflow:hidden">
        ${c.logoImg ? `<img src="${c.logoImg}" style="width:100%;height:100%;object-fit:cover" />` : c.name.charAt(0).toUpperCase()}
      </div>
      <h3 style="font-size:18px;font-weight:800;margin-bottom:2px">${c.name}</h3>
      <p style="font-size:12px;color:var(--text-2);margin-bottom:4px">${c.legalName}</p>
      <p style="font-size:11px;color:var(--text-3)">RUC: ${c.ruc}</p>
      <hr style="border:none;border-top:1px solid var(--border);margin:10px 0" />
      <p style="font-size:12px;color:var(--text-2)">${c.address}<br/>${c.city} · ${c.country}</p>
      <p style="font-size:12px;color:var(--text-2)">${c.phone} · ${c.email}</p>
      <hr style="border:none;border-top:1px solid var(--border);margin:10px 0" />
      <p style="font-size:11px;color:var(--text-3)">${c.receiptMsg}</p>
    </div>`;
  },

  saveGeneral(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    ['name','legalName','ruc','address','city','country','phone','mobile','email','website','regime'].forEach(k => {
      DB.config[k] = fd.get(k);
    });
    DB.config.logo = DB.config.name.charAt(0).toUpperCase();
    saveDBConfig();
    showToast('Información del negocio guardada', 'success');
    this.renderPreview();
  },

  saveExchange(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const rate = parseFloat(fd.get('exchangeRate')) || 9.35;
    const prev = DB.config.exchangeRate || 9.35;
    DB.config.exchangeRate    = rate;
    DB.config.displayCurrency = fd.get('displayCurrency') || 'Bs.';
    DB.config.currencySymbol  = fd.get('currencySymbol') || 'Bs.';
    // Record exchange history
    if (rate !== prev) {
      if (!DB.config.exchangeHistory) DB.config.exchangeHistory = [];
      DB.config.exchangeHistory.push({ rate, prev, date: nowStr() });
    }
    saveDBConfig();
    showToast(`Tipo de cambio actualizado: 1 USD = ${DB.config.currencySymbol} ${rate}`, 'success');
  },

  saveInvoice(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    DB.config.iva           = parseFloat(fd.get('iva')) || 13;
    DB.config.invoicePrefix = fd.get('invoicePrefix');
    DB.config.invoiceSeq    = parseInt(fd.get('invoiceSeq')) || 1;
    saveDBConfig();
    showToast('Configuración de facturación guardada', 'success');
  },

  saveReceipt(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    DB.config.receiptMsg    = fd.get('receiptMsg');
    DB.config.invoiceFooter = fd.get('invoiceFooter');
    saveDBConfig();
    showToast('Mensajes de recibo guardados', 'success');
    this.renderPreview();
  },

  // ── Logo ──────────────────────────────────────────────────────────
  onLogoFile(input) {
    const file = input.files[0];
    if (!file) return;
    this._pendingLogoFile = file;
    const isPng = file.type === 'image/png';
    const warn = isPng ? '' : `
      <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:var(--radius);padding:10px 12px;margin-bottom:14px;font-size:12px;color:#92400e;display:flex;gap:8px;align-items:flex-start">
        <i class="fas fa-triangle-exclamation" style="color:#d97706;flex-shrink:0;margin-top:1px"></i>
        <div><b>Recomendado: PNG con fondo transparente.</b><br/>El archivo seleccionado es <b>${file.type||'desconocido'}</b>. Para mejor resultado en recibos y PDFs usa un PNG con fondo transparente.</div>
      </div>`;
    openModal('<i class="fas fa-image"></i> Configurar Logo', `<div>
      ${warn}
      <p style="font-size:13px;margin-bottom:14px;color:var(--text-2)">Elige la resolución:</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        ${[['80','Pequeño','80px · Recibos térmicos','fa-compress'],
           ['150','Mediano','150px · Uso general','fa-balance-scale'],
           ['220','Grande','220px · PDFs de alta calidad','fa-expand']].map(([px,label,desc,icon])=>`
        <div onclick="ConfigModule._processLogo(${px})"
          style="cursor:pointer;border:2px solid var(--border);border-radius:var(--radius);padding:12px 8px;text-align:center;transition:border-color .2s"
          onmouseover="this.style.borderColor='var(--primary)';this.style.background='var(--primary-l)'"
          onmouseout="this.style.borderColor='var(--border)';this.style.background=''">
          <i class="fas ${icon}" style="font-size:20px;color:var(--primary);margin-bottom:6px;display:block"></i>
          <div style="font-weight:700;font-size:13px">${label}</div>
          <div style="font-size:11px;color:var(--primary);font-weight:600">${px}px</div>
          <div style="font-size:10px;color:var(--text-3);margin-top:2px">${desc}</div>
        </div>`).join('')}
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:16px">
        <button class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
      </div>
    </div>`, 'modal-md');
  },

  _processLogo(maxSize) {
    closeModalDirect();
    const file = this._pendingLogoFile;
    if (!file) return;
    this._pendingLogoFile = null;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) {
          const ratio = Math.min(maxSize / w, maxSize / h);
          w = Math.round(w * ratio); h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/png');
        DB.config.logoImg = dataUrl;
        saveDBConfig();
        const prev = document.getElementById('cfgLogoPreview');
        if (prev) prev.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:contain" />`;
        showToast(`Logo actualizado (${w}×${h}px)`, 'success');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  },

  removeLogo() {
    DB.config.logoImg = null;
    saveDBConfig();
    const prev = document.getElementById('cfgLogoPreview');
    if (prev) prev.innerHTML = DB.config.name.charAt(0).toUpperCase();
    showToast('Logo eliminado', 'info');
    navigate('config');
  },

  // ── Payment Methods ───────────────────────────────────────────────
  togglePayMethod(id, active) {
    const pm = (DB.config.paymentMethods||[]).find(p => p.id === id);
    if (!pm) return;
    if (!active && DB.config.paymentMethods.filter(p=>p.active).length <= 1) {
      showToast('Debe haber al menos un método de pago activo', 'warning');
      navigate('config'); return;
    }
    pm.active = active;
    saveDBConfig();
    showToast(`${pm.label} ${active?'activado':'desactivado'}`, active?'success':'info');
  },

  editPayMethod(id) {
    const pm = (DB.config.paymentMethods||[]).find(p => p.id === id);
    if (!pm) return;
    let extraFields = '';
    if (pm.id === 'tarjeta' || pm.id === 'transferencia') {
      extraFields = `
        <div class="form-group"><label>Banco</label>
          <input class="form-control" name="bank" value="${pm.extra?.bank||''}" placeholder="Ej. Banco BCP Bolivia" /></div>
        <div class="form-group"><label>${pm.id==='tarjeta'?'Nombre de cuenta':'Titular de cuenta'}</label>
          <input class="form-control" name="accountName" value="${pm.extra?.accountName||pm.extra?.holder||''}" /></div>
        <div class="form-group"><label>Número de cuenta</label>
          <input class="form-control" name="account" value="${pm.extra?.account||''}" /></div>`;
    } else if (pm.id === 'qr') {
      extraFields = `
        <div class="form-group"><label>Imagen QR de pago (opcional)</label>
          <input type="file" id="pmQrFileInput" accept="image/*" class="form-control" style="padding:6px" onchange="ConfigModule._onQrImage(this)" /></div>
        ${pm.extra?.qrImage ? `<div style="text-align:center;margin-top:8px"><img src="${pm.extra.qrImage}" style="max-width:120px;border-radius:8px;border:1px solid var(--border)" /></div>` : ''}`;
    } else {
      extraFields = `<p style="color:var(--text-3);font-size:13px">No hay datos adicionales para este método.</p>`;
    }
    openModal(`Editar — ${pm.label}`, `
      <form onsubmit="ConfigModule.savePayMethod(event,'${id}')">
        ${extraFields}
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
          <button type="button" class="btn btn-secondary" onclick="closeModalDirect()">Cancelar</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>
        </div>
      </form>`, 'modal-md');
  },

  _onQrImage(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { ConfigModule._pendingQrImage = ev.target.result; };
    reader.readAsDataURL(file);
  },

  savePayMethod(e, id) {
    e.preventDefault();
    const pm = (DB.config.paymentMethods||[]).find(p => p.id === id);
    if (!pm) return;
    const fd = new FormData(e.target);
    if (pm.id === 'tarjeta') {
      pm.extra = { bank: fd.get('bank')||'', accountName: fd.get('accountName')||'', account: fd.get('account')||'' };
    } else if (pm.id === 'transferencia') {
      pm.extra = { bank: fd.get('bank')||'', holder: fd.get('accountName')||'', account: fd.get('account')||'' };
    } else if (pm.id === 'qr') {
      if (this._pendingQrImage) { pm.extra.qrImage = this._pendingQrImage; this._pendingQrImage = null; }
    }
    saveDBConfig();
    showToast('Método de pago actualizado', 'success');
    closeModalDirect();
  },

  // ── Templates ─────────────────────────────────────────────────────
  _templateSelector(type, current, options) {
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px">
      ${options.map(o => {
        const active = current === o.id;
        return `<div style="border:2px solid ${active?'var(--primary)':'var(--border)'};border-radius:var(--radius);overflow:hidden;transition:border-color .2s">
          <div onclick="ConfigModule.previewTemplate('${type}','${o.id}')"
            style="cursor:pointer;background:${active?'var(--primary-l)':'var(--bg-2)'};padding:8px;min-height:72px;display:flex;align-items:center;justify-content:center">
            <div style="background:#fff;border-radius:4px;padding:6px 8px;width:100%;box-shadow:0 1px 4px rgba(0,0,0,.08)">
              ${o.preview}
            </div>
          </div>
          <div style="padding:8px;text-align:center;border-top:1px solid var(--border)">
            <div style="font-weight:700;font-size:12px;color:${active?'var(--primary)':'var(--text-1)'}">${o.name}</div>
            <div style="font-size:10px;color:var(--text-3);margin-top:2px">${o.desc}</div>
            ${active?`<span style="display:inline-block;margin-top:4px;font-size:10px;background:var(--primary);color:#fff;border-radius:3px;padding:1px 8px">✓ Activa</span>`:''}
            <button class="btn btn-sm ${active?'btn-outline-primary':'btn-secondary'}"
              onclick="ConfigModule.previewTemplate('${type}','${o.id}')"
              style="margin-top:6px;width:100%;font-size:11px">
              <i class="fas fa-eye"></i> ${active?'Ver preview':'Ver y elegir'}
            </button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  },

  previewTemplate(type, id) {
    const cfg = DB.config;
    const typeLabel = type === 'receipt' ? 'Recibo de Venta' : 'Cotización';
    const receiptNames = { T1:'Clásico', T2:'Ejecutivo', T3:'Minimalista', T4:'Institucional', T5:'Formal', T6:'Acento Lateral' };
    const quotNames    = { T1:'Formal', T2:'Elegante Oscuro', T3:'Minimalista', T4:'Coral Profesional', T5:'Tech Pro', T6:'Premium Dorado' };
    const names = type === 'receipt' ? receiptNames : quotNames;
    const current = type === 'receipt' ? (cfg.receiptTemplate||'T1') : (cfg.quotationTemplate||'T1');
    const isActive = current === id;
    const preview = type === 'receipt' ? this._mockReceiptHtml(id) : this._mockQuotationHtml(id);
    openModal(`<i class="fas fa-eye"></i> ${typeLabel} — ${names[id]||id}`,
      `<div>
        <p style="font-size:12px;color:var(--text-3);margin:0 0 12px">Vista previa con datos de ejemplo</p>
        <div style="background:#f8fafc;border:1px solid var(--border);border-radius:var(--radius);padding:16px;max-height:58vh;overflow-y:auto">
          ${preview}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;flex-wrap:wrap;gap:8px">
          <span style="font-size:12px;${isActive?'color:var(--secondary);font-weight:600':'color:var(--text-3)'}">
            ${isActive?'<i class="fas fa-check-circle"></i> Plantilla actualmente activa':'No seleccionada'}
          </span>
          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary" onclick="closeModalDirect()">Cerrar</button>
            ${!isActive?`<button class="btn btn-primary" onclick="closeModalDirect();ConfigModule.setTemplate('${type}','${id}')">
              <i class="fas fa-check"></i> Seleccionar esta plantilla
            </button>`:''}
          </div>
        </div>
      </div>`, 'modal-lg');
  },

  _mockReceiptHtml(id) {
    const cfg = DB.config;
    const mockItems = [
      { name:'Cable HDMI 4K Ugreen 3m', qty:2, price:12.00, subtotal:24.00 },
      { name:'Auriculares JBL Tune 770NC', qty:1, price:128.00, subtotal:128.00 },
      { name:'Hub USB-C 7 en 1 Anker 555', qty:1, price:38.00, subtotal:38.00 },
    ];
    const subtotal=190.00, discount=5, discAmt=9.50;
    const tax=+((subtotal-discAmt)*((cfg.iva||13)/100)).toFixed(2);
    const total=+(subtotal-discAmt+tax).toFixed(2);
    const logoMd = cfg.logoImg?`<img src="${cfg.logoImg}" style="width:48px;height:48px;object-fit:contain;border-radius:6px;background:#fff;padding:2px;display:block;margin:0 auto 8px" />`:'';
    const logoSide = cfg.logoImg?`<img src="${cfg.logoImg}" style="width:44px;height:44px;object-fit:contain;border-radius:6px;flex-shrink:0" />`:'';

    const wide = (inner) => `<div style="max-width:440px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:12px">${inner}</div>`;
    const wTable = (thBg, thBorderBottom, rowFn) => mockItems.map((i,idx)=>`
      <tr style="background:${typeof rowFn==='function'?rowFn(idx):(idx%2===0?'#f8fafc':'#fff')}">
        <td style="font-size:12px;padding:6px 8px;border-bottom:1px solid #e2e8f0;word-break:break-word">${i.name}</td>
        <td style="font-size:12px;padding:6px;text-align:center;border-bottom:1px solid #e2e8f0;white-space:nowrap;color:#64748b">${i.qty}</td>
        <td style="font-size:12px;padding:6px 8px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;color:#64748b">${fmt(i.price)}</td>
        <td style="font-size:12px;padding:6px 8px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;font-weight:700">${fmt(i.subtotal)}</td>
      </tr>`).join('');

    // T1: Clásico — header oscuro centrado, meta row, doble borde total
    if (id === 'T1') return wide(`
      <div style="background:#0f172a;color:#fff;padding:16px;text-align:center">
        ${logoMd}
        <div style="font-size:16px;font-weight:800;letter-spacing:.8px">${cfg.name.toUpperCase()}</div>
        <div style="font-size:10px;opacity:.6;margin-top:2px">${cfg.legalName} · RUC: ${cfg.ruc}</div>
        <div style="font-size:10px;opacity:.5">${cfg.address}, ${cfg.city} · Tel: ${cfg.phone}</div>
      </div>
      <div style="padding:12px 14px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:10px">
          <span style="color:#64748b">Factura: <b style="color:#0f172a">F-001-0043</b></span>
          <span style="color:#64748b">Cajero: <b style="color:#0f172a">Ana López</b></span>
        </div>
        <div style="border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:7px 10px;margin-bottom:10px">
          <div style="font-size:9px;font-weight:700;color:#94a3b8;margin-bottom:2px">CLIENTE</div>
          <div style="font-size:13px;font-weight:700">Juan Pérez García</div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
          <colgroup><col/><col style="width:28px"/><col style="width:64px"/><col style="width:64px"/></colgroup>
          <thead><tr style="background:#f1f5f9;border-bottom:2px solid #334155">
            <th style="text-align:left;padding:6px 8px;font-size:10px;font-weight:700;color:#475569">PRODUCTO</th>
            <th style="text-align:center;padding:6px;font-size:10px;font-weight:700;color:#475569">CANT</th>
            <th style="text-align:right;padding:6px 8px;font-size:10px;font-weight:700;color:#475569">P.U.</th>
            <th style="text-align:right;padding:6px 8px;font-size:10px;font-weight:700;color:#475569">SUBT.</th>
          </tr></thead>
          <tbody>${wTable('#f1f5f9','#334155')}</tbody>
        </table>
        <div style="display:flex;justify-content:flex-end">
          <div style="min-width:200px">
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>Subtotal:</span><span>${fmt(subtotal)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#475569"><span>Descuento (${discount}%):</span><span>-${fmt(discAmt)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>IVA (${cfg.iva}%):</span><span>${fmt(tax)}</span></div>
            <div style="border-top:2px solid #0f172a;border-bottom:2px solid #0f172a;display:flex;justify-content:space-between;padding:7px 0;font-size:16px;font-weight:900;margin-top:6px">
              <span>TOTAL</span><span>${fmt(total)}</span>
            </div>
          </div>
        </div>
        <div style="margin-top:10px;font-size:11.5px;color:#64748b;padding-top:8px;border-top:1px solid #e2e8f0"><b>Método:</b> Efectivo</div>
        <div style="text-align:center;font-size:10px;color:#64748b;margin-top:8px">${cfg.receiptMsg||''}</div>
      </div>`);

    // T2: Ejecutivo — header split izq/der, 2 tarjetas grises, caja oscura
    if (id === 'T2') return wide(`
      <div style="background:#1e293b;color:#fff;padding:14px 18px;display:flex;align-items:center;gap:12px">
        ${logoSide}
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:800">${cfg.name.toUpperCase()}</div>
          <div style="font-size:10px;opacity:.55;margin-top:2px">${cfg.address}, ${cfg.city}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;padding-left:12px;border-left:1px solid rgba(255,255,255,.15)">
          <div style="font-size:9px;opacity:.5">FACTURA</div>
          <div style="font-size:16px;font-weight:900">F-001-0043</div>
          <div style="font-size:10px;opacity:.5">${todayStr()}</div>
        </div>
      </div>
      <div style="padding:12px 14px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
          <div style="background:#f8fafc;border-radius:5px;padding:7px 10px;border-top:3px solid #334155">
            <div style="font-size:9px;font-weight:700;color:#94a3b8;margin-bottom:2px">CAJERO</div>
            <div style="font-size:12px;font-weight:700">Ana López</div>
          </div>
          <div style="background:#f8fafc;border-radius:5px;padding:7px 10px;border-top:3px solid #334155">
            <div style="font-size:9px;font-weight:700;color:#94a3b8;margin-bottom:2px">CLIENTE</div>
            <div style="font-size:12px;font-weight:700">Juan Pérez</div>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
          <colgroup><col/><col style="width:28px"/><col style="width:64px"/><col style="width:64px"/></colgroup>
          <thead><tr style="background:#1e293b">
            <th style="text-align:left;padding:7px 8px;font-size:10px;font-weight:600;color:#94a3b8">PRODUCTO</th>
            <th style="text-align:center;padding:7px 6px;font-size:10px;font-weight:600;color:#94a3b8">CANT</th>
            <th style="text-align:right;padding:7px 8px;font-size:10px;font-weight:600;color:#94a3b8">P.U.</th>
            <th style="text-align:right;padding:7px 8px;font-size:10px;font-weight:600;color:#94a3b8">SUBT.</th>
          </tr></thead>
          <tbody>${wTable()}</tbody>
        </table>
        <div style="display:flex;justify-content:flex-end">
          <div style="min-width:200px">
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>Subtotal:</span><span>${fmt(subtotal)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#475569"><span>Descuento (${discount}%):</span><span>-${fmt(discAmt)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>IVA:</span><span>${fmt(tax)}</span></div>
            <div style="background:#1e293b;color:#fff;display:flex;justify-content:space-between;padding:10px 12px;border-radius:6px;font-size:16px;font-weight:800;margin-top:8px">
              <span>TOTAL</span><span>${fmt(total)}</span>
            </div>
          </div>
        </div>
        <div style="text-align:center;font-size:10px;color:#64748b;margin-top:10px">${cfg.receiptMsg||''}</div>
      </div>`);

    // T3: Minimalista — header con nombre grande + factura, tabla sin fondos, TOTAL XXL
    if (id === 'T3') return wide(`
      <div style="padding:16px 18px 12px;border-bottom:3px solid #0f172a;display:flex;justify-content:space-between;align-items:flex-end">
        <div style="display:flex;align-items:center;gap:10px">
          ${logoSide}
          <div>
            <div style="font-size:18px;font-weight:900;letter-spacing:.5px">${cfg.name.toUpperCase()}</div>
            <div style="font-size:10px;color:#64748b;margin-top:2px">${cfg.legalName}</div>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10px;color:#94a3b8">FACTURA</div>
          <div style="font-size:20px;font-weight:900;color:#334155">F-001-0043</div>
          <div style="font-size:10px;color:#64748b">${todayStr()}</div>
        </div>
      </div>
      <div style="padding:12px 18px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#64748b;margin-bottom:12px">
          <span>Cliente: <b style="color:#0f172a">Juan Pérez García</b></span>
          <span>Cajero: <b style="color:#0f172a">Ana López</b></span>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
          <colgroup><col/><col style="width:28px"/><col style="width:64px"/><col style="width:64px"/></colgroup>
          <thead><tr style="border-bottom:2px solid #0f172a">
            <th style="text-align:left;padding:5px 0;font-size:10px;font-weight:700;color:#475569">PRODUCTO</th>
            <th style="text-align:center;padding:5px 6px;font-size:10px;font-weight:700;color:#475569">CANT</th>
            <th style="text-align:right;padding:5px 0;font-size:10px;font-weight:700;color:#475569">P.U.</th>
            <th style="text-align:right;padding:5px 0 5px 8px;font-size:10px;font-weight:700;color:#475569">SUBT.</th>
          </tr></thead>
          <tbody>${mockItems.map(i=>`<tr><td style="font-size:12px;padding:6px 0;border-bottom:1px solid #f1f5f9;word-break:break-word">${i.name}</td><td style="font-size:12px;padding:6px;text-align:center;border-bottom:1px solid #f1f5f9;color:#94a3b8">${i.qty}</td><td style="font-size:12px;padding:6px 0;text-align:right;border-bottom:1px solid #f1f5f9;color:#94a3b8">${fmt(i.price)}</td><td style="font-size:12px;padding:6px 0 6px 8px;text-align:right;border-bottom:1px solid #f1f5f9;font-weight:600">${fmt(i.subtotal)}</td></tr>`).join('')}</tbody>
        </table>
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>Subtotal:</span><span>${fmt(subtotal)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#475569"><span>Descuento (${discount}%):</span><span>-${fmt(discAmt)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>IVA:</span><span>${fmt(tax)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:21px;font-weight:900;padding:9px 0;border-top:3px solid #0f172a;margin-top:8px">
          <span>TOTAL</span><span>${fmt(total)}</span>
        </div>
        <div style="text-align:center;font-size:10px;color:#64748b;margin-top:10px">${cfg.receiptMsg||''}</div>
      </div>`);

    // T4: Institucional — 3-col info strip, tabla con bordes, líneas de firma
    if (id === 'T4') return wide(`
      <div style="background:#1e293b;color:#fff;padding:14px 18px;text-align:center">
        ${logoMd}
        <div style="font-size:15px;font-weight:800">${cfg.name.toUpperCase()}</div>
        <div style="font-size:10px;opacity:.6;margin-top:2px">${cfg.legalName} · RUC: ${cfg.ruc}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid #e2e8f0">
        <div style="padding:8px 10px;border-right:1px solid #e2e8f0">
          <div style="font-size:9px;font-weight:700;color:#94a3b8;margin-bottom:2px">N° FACTURA</div>
          <div style="font-size:12px;font-weight:800">F-001-0043</div>
          <div style="font-size:10px;color:#64748b">${todayStr()}</div>
        </div>
        <div style="padding:8px 10px;border-right:1px solid #e2e8f0">
          <div style="font-size:9px;font-weight:700;color:#94a3b8;margin-bottom:2px">CLIENTE</div>
          <div style="font-size:12px;font-weight:700">Juan Pérez</div>
          <div style="font-size:10px;color:#64748b">CI: 7654321</div>
        </div>
        <div style="padding:8px 10px">
          <div style="font-size:9px;font-weight:700;color:#94a3b8;margin-bottom:2px">CAJERO</div>
          <div style="font-size:12px;font-weight:700">Ana López</div>
        </div>
      </div>
      <div style="padding:10px 14px">
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;margin-bottom:10px">
          <colgroup><col/><col style="width:28px"/><col style="width:64px"/><col style="width:64px"/></colgroup>
          <thead><tr style="background:#334155;color:#fff">
            <th style="text-align:left;padding:6px 8px;font-size:10px;font-weight:600">DESCRIPCIÓN</th>
            <th style="text-align:center;padding:6px;font-size:10px;font-weight:600">CANT</th>
            <th style="text-align:right;padding:6px 8px;font-size:10px;font-weight:600">P.U.</th>
            <th style="text-align:right;padding:6px 8px;font-size:10px;font-weight:600">SUBT.</th>
          </tr></thead>
          <tbody>${mockItems.map(i=>`<tr><td style="font-size:12px;padding:6px 8px;border:1px solid #e2e8f0;word-break:break-word">${i.name}</td><td style="font-size:12px;padding:6px;text-align:center;border:1px solid #e2e8f0">${i.qty}</td><td style="font-size:12px;padding:6px 8px;text-align:right;border:1px solid #e2e8f0">${fmt(i.price)}</td><td style="font-size:12px;padding:6px 8px;text-align:right;border:1px solid #e2e8f0;font-weight:700">${fmt(i.subtotal)}</td></tr>`).join('')}</tbody>
        </table>
        <div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:start">
          <div style="font-size:11.5px;color:#64748b;padding-top:4px"><b>Pago:</b> Efectivo</div>
          <div style="min-width:180px;border:1px solid #e2e8f0;border-radius:5px;overflow:hidden">
            <div style="padding:5px 10px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:11px;color:#64748b"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
            <div style="padding:5px 10px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:11px;color:#64748b"><span>Desc. (${discount}%)</span><span>-${fmt(discAmt)}</span></div>
            <div style="padding:5px 10px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:11px;color:#64748b"><span>IVA</span><span>${fmt(tax)}</span></div>
            <div style="padding:7px 10px;display:flex;justify-content:space-between;font-size:14px;font-weight:900;background:#334155;color:#fff"><span>TOTAL</span><span>${fmt(total)}</span></div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:14px;padding-top:10px;border-top:1px solid #e2e8f0">
          <div style="border-top:1px solid #94a3b8;padding-top:4px;text-align:center;font-size:10px;color:#94a3b8">Firma del Cliente</div>
          <div style="border-top:1px solid #94a3b8;padding-top:4px;text-align:center;font-size:10px;color:#94a3b8">Firma del Cajero</div>
        </div>
      </div>`);

    // T5: Formal — banda con 3 cols internas, cliente destacado, caja oscura
    if (id === 'T5') return wide(`
      <div style="background:#334155;color:#fff;padding:14px 18px">
        <div style="text-align:center;margin-bottom:8px">
          ${logoSide}
          <div style="font-size:15px;font-weight:800;margin-top:${cfg.logoImg?'6px':'0'}">${cfg.name.toUpperCase()}</div>
          <div style="font-size:10px;opacity:.6;margin-top:2px">${cfg.legalName} · RUC: ${cfg.ruc}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid rgba(255,255,255,.15);padding-top:7px;text-align:center">
          <div style="padding:0 6px;border-right:1px solid rgba(255,255,255,.15)">
            <div style="font-size:9px;opacity:.5">FACTURA N°</div>
            <div style="font-size:14px;font-weight:800">F-001-0043</div>
          </div>
          <div style="padding:0 6px;border-right:1px solid rgba(255,255,255,.15)">
            <div style="font-size:9px;opacity:.5">FECHA</div>
            <div style="font-size:11px;font-weight:600">${todayStr()}</div>
          </div>
          <div style="padding:0 6px">
            <div style="font-size:9px;opacity:.5">CAJERO</div>
            <div style="font-size:12px;font-weight:700">Ana López</div>
          </div>
        </div>
      </div>
      <div style="padding:12px 14px">
        <div style="background:#f8fafc;border-radius:5px;padding:8px 12px;margin-bottom:10px">
          <div style="font-size:9px;font-weight:700;color:#94a3b8;margin-bottom:2px">CLIENTE</div>
          <div style="font-size:13px;font-weight:700">Juan Pérez García</div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
          <colgroup><col/><col style="width:28px"/><col style="width:64px"/><col style="width:64px"/></colgroup>
          <thead><tr style="background:#334155;color:#fff">
            <th style="text-align:left;padding:7px 8px;font-size:10px;font-weight:600">PRODUCTO</th>
            <th style="text-align:center;padding:7px 6px;font-size:10px;font-weight:600">CANT</th>
            <th style="text-align:right;padding:7px 8px;font-size:10px;font-weight:600">P.U.</th>
            <th style="text-align:right;padding:7px 8px;font-size:10px;font-weight:600">SUBT.</th>
          </tr></thead>
          <tbody>${wTable()}</tbody>
        </table>
        <div style="display:flex;justify-content:flex-end">
          <div style="min-width:200px">
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>Subtotal:</span><span>${fmt(subtotal)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#475569"><span>Descuento (${discount}%):</span><span>-${fmt(discAmt)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>IVA:</span><span>${fmt(tax)}</span></div>
            <div style="background:#334155;color:#fff;display:flex;justify-content:space-between;padding:10px 12px;border-radius:6px;font-size:16px;font-weight:800;margin-top:8px">
              <span>TOTAL</span><span>${fmt(total)}</span>
            </div>
          </div>
        </div>
        <div style="text-align:center;font-size:10px;color:#64748b;margin-top:10px">${cfg.receiptMsg||''}</div>
      </div>`);

    // T6: Acento Lateral — border-left en header, secciones y totales
    return wide(`
      <div style="background:#f8fafc;padding:14px 18px;border-bottom:1px solid #e2e8f0;border-left:5px solid #475569;display:flex;align-items:center;justify-content:space-between;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          ${logoSide}
          <div>
            <div style="font-size:14px;font-weight:800;color:#0f172a">${cfg.name.toUpperCase()}</div>
            <div style="font-size:10px;color:#64748b">${cfg.legalName}</div>
            <div style="font-size:10px;color:#64748b">${cfg.address}, ${cfg.city}</div>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:9px;color:#94a3b8">FACTURA</div>
          <div style="font-size:15px;font-weight:900;color:#334155">F-001-0043</div>
          <div style="font-size:10px;color:#64748b">${todayStr()}</div>
        </div>
      </div>
      <div style="padding:12px 14px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
          <div style="border-left:4px solid #475569;padding:7px 10px;background:#f8fafc;border-radius:0 5px 5px 0">
            <div style="font-size:9px;font-weight:700;color:#94a3b8;margin-bottom:2px">CLIENTE</div>
            <div style="font-size:12px;font-weight:700">Juan Pérez García</div>
          </div>
          <div style="border-left:4px solid #475569;padding:7px 10px;background:#f8fafc;border-radius:0 5px 5px 0">
            <div style="font-size:9px;font-weight:700;color:#94a3b8;margin-bottom:2px">CAJERO</div>
            <div style="font-size:12px;font-weight:700">Ana López</div>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
          <colgroup><col/><col style="width:28px"/><col style="width:64px"/><col style="width:64px"/></colgroup>
          <thead><tr style="background:#f1f5f9;border-bottom:2px solid #475569">
            <th style="text-align:left;padding:7px 8px;font-size:10px;font-weight:700;color:#334155">PRODUCTO</th>
            <th style="text-align:center;padding:7px 6px;font-size:10px;font-weight:700;color:#334155">CANT</th>
            <th style="text-align:right;padding:7px 8px;font-size:10px;font-weight:700;color:#334155">P.U.</th>
            <th style="text-align:right;padding:7px 8px;font-size:10px;font-weight:700;color:#334155">SUBT.</th>
          </tr></thead>
          <tbody>${wTable()}</tbody>
        </table>
        <div style="display:flex;justify-content:flex-end">
          <div style="min-width:200px;border-left:4px solid #475569;padding-left:12px">
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>Subtotal:</span><span>${fmt(subtotal)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#475569"><span>Descuento (${discount}%):</span><span>-${fmt(discAmt)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0;color:#64748b"><span>IVA:</span><span>${fmt(tax)}</span></div>
            <div style="border-top:2px solid #334155;display:flex;justify-content:space-between;padding:7px 0 0;font-size:16px;font-weight:900;margin-top:6px">
              <span>TOTAL</span><span>${fmt(total)}</span>
            </div>
          </div>
        </div>
        <div style="text-align:center;font-size:10px;color:#64748b;margin-top:10px">${cfg.receiptMsg||''}</div>
      </div>`);
  },

  _mockQuotationHtml(id) {
    const cfg = DB.config;
    const mockItems = [
      { name:'DJI Mini 4 Pro Drone 4K/60fps', qty:1, unitPrice:920.00, discount:0, subtotal:920.00 },
      { name:'Batería Inteligente DJI Mini 4 Pro', qty:2, unitPrice:82.00, discount:0, subtotal:164.00 },
      { name:'Control Remoto DJI RC2 con Pantalla', qty:1, unitPrice:250.00, discount:5, subtotal:237.50 },
    ];
    const subtotal = 1321.50;
    const rate = cfg.exchangeRate || 9.35;
    const sym = cfg.currencySymbol || 'Bs.';
    const totalBs = (subtotal * rate).toFixed(2);

    const rowsHtml = (cols) => mockItems.map((i,idx) => `
      <tr style="background:${idx%2===0?'#f8fafc':'#fff'}">
        ${cols(i)}
      </tr>`).join('');

    if (id === 'T2') {
      return `<div style="font-family:sans-serif;font-size:12px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
        <div style="background:#2563eb;color:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div>
            ${cfg.logoImg?`<img src="${cfg.logoImg}" style="height:36px;object-fit:contain;background:#fff;padding:3px;border-radius:4px;margin-bottom:4px;display:block" />`:''}
            <div style="font-size:16px;font-weight:800">${cfg.name.toUpperCase()}</div>
            <div style="font-size:10px;opacity:.8">${cfg.address}, ${cfg.city} · ${cfg.phone}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:18px;font-weight:800">COT-00011</div>
            <div style="font-size:10px;opacity:.8">${todayStr()}</div>
          </div>
        </div>
        <div style="padding:16px 20px">
          <div style="background:#eff6ff;border-radius:6px;padding:10px 14px;margin-bottom:16px">
            <div style="font-size:10px;color:#64748b;margin-bottom:2px">CLIENTE</div>
            <div style="font-weight:700">Elena Flores Vásquez</div>
            <div style="font-size:11px;color:#64748b">+591 72-333-444 · eflores@hotmail.com</div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:11px">
            <thead><tr style="background:#f1f5f9">
              <th style="text-align:left;padding:6px 8px;border-bottom:1px solid #e2e8f0">Producto</th>
              <th style="text-align:center;padding:6px 8px;border-bottom:1px solid #e2e8f0">Cant.</th>
              <th style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0">P.U.</th>
              <th style="text-align:right;padding:6px 8px;border-bottom:1px solid #e2e8f0">Subtotal</th>
            </tr></thead>
            <tbody>${rowsHtml(i=>`
              <td style="padding:5px 8px;border-bottom:1px solid #f1f5f9">${i.name}</td>
              <td style="text-align:center;padding:5px 8px;border-bottom:1px solid #f1f5f9">${i.qty}</td>
              <td style="text-align:right;padding:5px 8px;border-bottom:1px solid #f1f5f9">$${i.unitPrice.toFixed(2)}</td>
              <td style="text-align:right;padding:5px 8px;border-bottom:1px solid #f1f5f9;color:#2563eb;font-weight:600">$${i.subtotal.toFixed(2)}</td>
            `)}</tbody>
          </table>
          <div style="display:flex;justify-content:flex-end;margin-top:12px">
            <div style="background:#2563eb;color:#fff;border-radius:6px;padding:10px 20px;text-align:right">
              <div style="font-size:10px;opacity:.8">TOTAL USD</div>
              <div style="font-size:18px;font-weight:800">$${subtotal.toFixed(2)}</div>
              <div style="font-size:11px;opacity:.9">${sym} ${totalBs}</div>
            </div>
          </div>
          <div style="margin-top:12px;font-size:10px;color:#64748b;text-align:center">Válido hasta: ${todayStr()} · ${cfg.website||''}</div>
        </div>
      </div>`;
    } else if (id === 'T3') {
      return `<div style="font-family:sans-serif;font-size:12px;padding:20px;border:1px solid #e2e8f0;border-radius:8px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #e2e8f0">
          <div style="font-size:16px;font-weight:700">Cotización — ${cfg.name}</div>
          <div style="text-align:right">
            <div style="font-size:14px;font-weight:700;color:#2563eb">COT-00011</div>
            <div style="font-size:10px;color:#64748b">${todayStr()}</div>
          </div>
        </div>
        <div style="font-size:11px;color:#64748b;margin-bottom:16px">
          Cliente: <b style="color:#0f172a">Elena Flores Vásquez</b>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:11px">
          <thead><tr style="border-bottom:2px solid #0f172a">
            <th style="text-align:left;padding:5px 4px">Cant.</th>
            <th style="text-align:left;padding:5px 4px">Descripción</th>
            <th style="text-align:right;padding:5px 4px">Precio</th>
          </tr></thead>
          <tbody>${rowsHtml(i=>`
            <td style="padding:4px">${i.qty}</td>
            <td style="padding:4px">${i.name}</td>
            <td style="text-align:right;padding:4px">$${i.subtotal.toFixed(2)}</td>
          `)}</tbody>
        </table>
        <div style="display:flex;justify-content:flex-end;margin-top:12px;padding-top:8px;border-top:2px solid #0f172a">
          <div style="text-align:right">
            <div style="font-size:16px;font-weight:800">TOTAL: $${subtotal.toFixed(2)}</div>
            <div style="font-size:11px;color:#64748b">${sym} ${totalBs}</div>
          </div>
        </div>
      </div>`;
    } else if (id === 'T4') {
      // ── T4 Coral Profesional ──
      return `<div style="font-family:sans-serif;font-size:12px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
        <div style="border-left:6px solid #dc2626;padding:16px 20px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;border-bottom:1px solid #fee2e2">
          <div>
            ${cfg.logoImg?`<img src="${cfg.logoImg}" style="height:38px;object-fit:contain;display:block;margin-bottom:6px" />`:''}
            <div style="font-size:16px;font-weight:800">${cfg.name.toUpperCase()}</div>
            <div style="font-size:10px;color:#64748b">${cfg.legalName}</div>
            <div style="font-size:10px;color:#64748b">${cfg.address}, ${cfg.city}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:10px;color:#64748b;letter-spacing:.5px;text-transform:uppercase">Cotización</div>
            <div style="font-size:18px;font-weight:800;color:#dc2626">COT-00011</div>
            <div style="font-size:10px;color:#64748b">${todayStr()}</div>
          </div>
        </div>
        <div style="padding:16px 20px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
            <div style="background:#fef2f2;border-radius:6px;padding:8px 12px">
              <div style="font-size:9px;font-weight:700;color:#dc2626;margin-bottom:4px;letter-spacing:.5px">EMISIÓN</div>
              <div style="font-size:11.5px">Válida: <b>${todayStr()}</b></div>
              <div style="font-size:11.5px">Ana López</div>
            </div>
            <div style="background:#f8fafc;border-radius:6px;padding:8px 12px">
              <div style="font-size:9px;font-weight:700;color:#64748b;margin-bottom:4px;letter-spacing:.5px">CLIENTE</div>
              <div style="font-size:12px;font-weight:700">Elena Flores Vásquez</div>
              <div style="font-size:11px;color:#64748b">+591 72-333-444</div>
            </div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:12px">
            <thead><tr style="background:#dc2626;color:#fff">
              <th style="text-align:left;padding:7px 10px">Producto</th>
              <th style="text-align:center;padding:7px 8px">Cant.</th>
              <th style="text-align:right;padding:7px 10px">P.U.</th>
              <th style="text-align:right;padding:7px 10px">Subtotal</th>
            </tr></thead>
            <tbody>${rowsHtml(i=>`
              <td style="padding:6px 10px;border-bottom:1px solid #fee2e2">${i.name}</td>
              <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #fee2e2">${i.qty}</td>
              <td style="text-align:right;padding:6px 10px;border-bottom:1px solid #fee2e2">$${i.unitPrice.toFixed(2)}</td>
              <td style="text-align:right;padding:6px 10px;border-bottom:1px solid #fee2e2;font-weight:600;color:#dc2626">$${i.subtotal.toFixed(2)}</td>
            `)}</tbody>
          </table>
          <div style="display:flex;justify-content:flex-end">
            <div style="min-width:200px">
              <div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;color:#64748b"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
              <div style="background:#dc2626;color:#fff;border-radius:6px;padding:10px 14px;display:flex;justify-content:space-between;font-size:15px;font-weight:800;margin-top:8px">
                <span>TOTAL USD</span><span>$${subtotal.toFixed(2)}</span>
              </div>
              <div style="text-align:right;font-size:10px;color:#64748b;margin-top:4px">${sym} ${totalBs}</div>
            </div>
          </div>
        </div>
        <div style="background:#fef2f2;padding:8px 20px;text-align:center;font-size:10px;color:#991b1b">${cfg.invoiceFooter||''}</div>
      </div>`;
    } else if (id === 'T5') {
      // ── T5 Tech Pro ──
      return `<div style="font-family:sans-serif;font-size:12px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
        <div style="background:#0c4a6e;color:#fff;padding:18px 20px;display:flex;justify-content:space-between;align-items:center;gap:12px">
          <div>
            ${cfg.logoImg?`<img src="${cfg.logoImg}" style="height:36px;object-fit:contain;background:#fff;padding:3px;border-radius:4px;display:block;margin-bottom:6px" />`:''}
            <div style="font-size:16px;font-weight:800">${cfg.name.toUpperCase()}</div>
            <div style="font-size:10px;opacity:.75;margin-top:2px">${cfg.address}, ${cfg.city}</div>
          </div>
          <div style="text-align:right">
            <div style="background:#06b6d4;border-radius:6px;padding:8px 14px">
              <div style="font-size:9px;opacity:.85;letter-spacing:.5px">COTIZACIÓN</div>
              <div style="font-size:16px;font-weight:800">COT-00011</div>
              <div style="font-size:10px;opacity:.8">${todayStr()}</div>
            </div>
          </div>
        </div>
        <div style="padding:16px 20px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
            <div style="background:#ecfeff;border-left:3px solid #06b6d4;padding:8px 12px;border-radius:0 6px 6px 0">
              <div style="font-size:9px;font-weight:700;color:#06b6d4;margin-bottom:4px">EMISIÓN</div>
              <div style="font-size:11.5px">Vendedor: <b>Ana López</b></div>
              <div style="font-size:11px;color:#64748b">Válida: ${todayStr()}</div>
            </div>
            <div style="background:#f0f9ff;border-left:3px solid #0c4a6e;padding:8px 12px;border-radius:0 6px 6px 0">
              <div style="font-size:9px;font-weight:700;color:#0c4a6e;margin-bottom:4px">CLIENTE</div>
              <div style="font-size:12px;font-weight:700">Elena Flores Vásquez</div>
              <div style="font-size:11px;color:#64748b">+591 72-333-444</div>
            </div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:12px">
            <thead><tr style="background:#0c4a6e;color:#fff">
              <th style="text-align:left;padding:7px 10px">Producto</th>
              <th style="text-align:center;padding:7px 8px">Cant.</th>
              <th style="text-align:right;padding:7px 10px">P.U.</th>
              <th style="text-align:right;padding:7px 10px">Subtotal</th>
            </tr></thead>
            <tbody>${rowsHtml(i=>`
              <td style="padding:6px 10px;border-bottom:1px solid #e0f2fe">${i.name}</td>
              <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #e0f2fe">${i.qty}</td>
              <td style="text-align:right;padding:6px 10px;border-bottom:1px solid #e0f2fe">$${i.unitPrice.toFixed(2)}</td>
              <td style="text-align:right;padding:6px 10px;border-bottom:1px solid #e0f2fe;font-weight:600;color:#06b6d4">$${i.subtotal.toFixed(2)}</td>
            `)}</tbody>
          </table>
          <div style="display:flex;justify-content:flex-end">
            <div style="min-width:200px">
              <div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;color:#64748b"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
              <div style="background:#0c4a6e;color:#67e8f9;border-radius:6px;padding:10px 14px;display:flex;justify-content:space-between;font-size:15px;font-weight:800;margin-top:8px">
                <span>TOTAL USD</span><span>$${subtotal.toFixed(2)}</span>
              </div>
              <div style="text-align:right;font-size:10px;color:#64748b;margin-top:4px">${sym} ${totalBs}</div>
            </div>
          </div>
        </div>
        <div style="background:#0c4a6e;padding:8px 20px;text-align:center;font-size:10px;color:#7dd3fc">${cfg.invoiceFooter||cfg.website||''}</div>
      </div>`;
    } else if (id === 'T6') {
      // ── T6 Premium Dorado ──
      return `<div style="font-family:sans-serif;font-size:12px;border:1px solid #fde68a;border-radius:8px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#92400e,#b45309);color:#fef3c7;padding:18px 20px;display:flex;justify-content:space-between;align-items:center;gap:12px">
          <div>
            ${cfg.logoImg?`<img src="${cfg.logoImg}" style="height:38px;object-fit:contain;background:rgba(255,255,255,.15);padding:3px;border-radius:4px;display:block;margin-bottom:6px" />`:''}
            <div style="font-size:16px;font-weight:800;letter-spacing:.5px">${cfg.name.toUpperCase()}</div>
            <div style="font-size:10px;opacity:.8;margin-top:2px">${cfg.address}, ${cfg.city}</div>
            <div style="font-size:10px;opacity:.7">Tel: ${cfg.phone}</div>
          </div>
          <div style="text-align:right">
            <div style="background:#fbbf24;color:#78350f;border-radius:6px;padding:8px 14px">
              <div style="font-size:9px;font-weight:700;letter-spacing:.5px">COTIZACIÓN</div>
              <div style="font-size:16px;font-weight:900">COT-00011</div>
              <div style="font-size:10px">${todayStr()}</div>
            </div>
          </div>
        </div>
        <div style="padding:16px 20px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
            <div style="background:#fffbeb;border-left:3px solid #d97706;padding:8px 12px;border-radius:0 6px 6px 0">
              <div style="font-size:9px;font-weight:700;color:#d97706;margin-bottom:4px">EMISIÓN</div>
              <div style="font-size:11.5px">Ana López</div>
              <div style="font-size:11px;color:#92400e">Válida: ${todayStr()}</div>
            </div>
            <div style="background:#fef9c3;border-left:3px solid #92400e;padding:8px 12px;border-radius:0 6px 6px 0">
              <div style="font-size:9px;font-weight:700;color:#92400e;margin-bottom:4px">CLIENTE</div>
              <div style="font-size:12px;font-weight:700">Elena Flores Vásquez</div>
              <div style="font-size:11px;color:#78350f">+591 72-333-444</div>
            </div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:12px">
            <thead><tr style="background:#92400e;color:#fef3c7">
              <th style="text-align:left;padding:7px 10px">Producto</th>
              <th style="text-align:center;padding:7px 8px">Cant.</th>
              <th style="text-align:right;padding:7px 10px">P.U.</th>
              <th style="text-align:right;padding:7px 10px">Subtotal</th>
            </tr></thead>
            <tbody>${rowsHtml(i=>`
              <td style="padding:6px 10px;border-bottom:1px solid #fef3c7">${i.name}</td>
              <td style="text-align:center;padding:6px 8px;border-bottom:1px solid #fef3c7">${i.qty}</td>
              <td style="text-align:right;padding:6px 10px;border-bottom:1px solid #fef3c7">$${i.unitPrice.toFixed(2)}</td>
              <td style="text-align:right;padding:6px 10px;border-bottom:1px solid #fef3c7;font-weight:600;color:#b45309">$${i.subtotal.toFixed(2)}</td>
            `)}</tbody>
          </table>
          <div style="display:flex;justify-content:flex-end">
            <div style="min-width:200px">
              <div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;color:#78350f"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
              <div style="background:linear-gradient(90deg,#92400e,#b45309);color:#fef3c7;border-radius:6px;padding:10px 14px;display:flex;justify-content:space-between;font-size:15px;font-weight:800;margin-top:8px">
                <span>TOTAL USD</span><span>$${subtotal.toFixed(2)}</span>
              </div>
              <div style="text-align:right;font-size:10px;color:#78350f;margin-top:4px">${sym} ${totalBs}</div>
            </div>
          </div>
        </div>
        <div style="background:linear-gradient(135deg,#92400e,#b45309);padding:8px 20px;text-align:center;font-size:10px;color:#fde68a">${cfg.invoiceFooter||cfg.website||''}</div>
      </div>`;
    } else {
      return `<div style="font-family:sans-serif;font-size:12px;padding:20px;border:1px solid #e2e8f0;border-radius:8px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
          <div>
            ${cfg.logoImg?`<img src="${cfg.logoImg}" style="max-height:40px;object-fit:contain;margin-bottom:6px;display:block" />`:''}
            <div style="font-size:16px;font-weight:800">${cfg.name.toUpperCase()}</div>
            <div style="font-size:11px;color:#64748b">${cfg.legalName}</div>
            <div style="font-size:11px;color:#64748b">${cfg.address}, ${cfg.city}</div>
            <div style="font-size:11px;color:#64748b">RUC: ${cfg.ruc} · Tel: ${cfg.phone}</div>
          </div>
          <div style="text-align:right;border:2px solid #2563eb;border-radius:8px;padding:10px 16px">
            <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Cotización</div>
            <div style="font-size:18px;font-weight:800;color:#2563eb">COT-00011</div>
            <div style="font-size:10px;color:#64748b">${todayStr()}</div>
          </div>
        </div>
        <div style="background:#f1f5f9;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:11px">
          <div style="font-weight:700;margin-bottom:4px">CLIENTE</div>
          <div>Elena Flores Vásquez · CI: 5432109</div>
          <div style="color:#64748b">+591 72-333-444 · eflores@hotmail.com</div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:12px">
          <thead><tr style="background:#2563eb;color:#fff">
            <th style="text-align:left;padding:7px 8px">Producto</th>
            <th style="text-align:center;padding:7px 8px">Cant.</th>
            <th style="text-align:right;padding:7px 8px">P.U.</th>
            <th style="text-align:right;padding:7px 8px">Desc.</th>
            <th style="text-align:right;padding:7px 8px">Subtotal</th>
          </tr></thead>
          <tbody>${rowsHtml(i=>`
            <td style="padding:5px 8px;border-bottom:1px solid #e2e8f0">${i.name}</td>
            <td style="text-align:center;padding:5px 8px;border-bottom:1px solid #e2e8f0">${i.qty}</td>
            <td style="text-align:right;padding:5px 8px;border-bottom:1px solid #e2e8f0">$${i.unitPrice.toFixed(2)}</td>
            <td style="text-align:center;padding:5px 8px;border-bottom:1px solid #e2e8f0">${i.discount||0}%</td>
            <td style="text-align:right;padding:5px 8px;border-bottom:1px solid #e2e8f0;font-weight:600">$${i.subtotal.toFixed(2)}</td>
          `)}</tbody>
        </table>
        <div style="display:flex;justify-content:flex-end">
          <table style="font-size:12px;min-width:220px">
            <tr><td style="padding:3px 8px;color:#64748b">Subtotal:</td><td style="text-align:right;padding:3px 8px">$${subtotal.toFixed(2)}</td></tr>
            <tr style="background:#2563eb;color:#fff;font-weight:800;font-size:14px">
              <td style="padding:8px">TOTAL USD</td><td style="text-align:right;padding:8px">$${subtotal.toFixed(2)}</td>
            </tr>
            <tr><td colspan="2" style="text-align:right;font-size:10px;color:#64748b;padding:4px 8px">${sym} ${totalBs}</td></tr>
          </table>
        </div>
        <div style="margin-top:16px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:10px;color:#64748b;text-align:center">
          ${cfg.invoiceFooter||cfg.receiptMsg||''} · Válida 7 días · ${cfg.website||''}
        </div>
      </div>`;
    }
  },

  setTemplate(type, id) {
    if (type === 'receipt')   DB.config.receiptTemplate   = id;
    if (type === 'quotation') DB.config.quotationTemplate = id;
    saveDBConfig();
    const rN={T1:'Clásico',T2:'Ejecutivo',T3:'Minimalista',T4:'Institucional',T5:'Formal',T6:'Acento Lateral'};
    const qN={T1:'Formal',T2:'Elegante Oscuro',T3:'Minimalista',T4:'Coral Profesional',T5:'Tech Pro',T6:'Premium Dorado'};
    const names = type==='receipt' ? rN : qN;
    showToast(`Plantilla ${type==='receipt'?'de recibo':'de cotización'} → ${names[id]||id}`, 'success');
    navigate('config');
  },

  saveWhatsapp(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    DB.config.whatsappMsg         = fd.get('whatsappMsg') || '';
    DB.config.whatsappCountryCode = fd.get('whatsappCountryCode') || '591';
    saveDBConfig();
    showToast('Configuración WhatsApp guardada', 'success');
  },

  _insertToken(token) {
    const ta = document.getElementById('cfgWaMsg');
    if (!ta) return;
    const pos = ta.selectionStart;
    ta.value = ta.value.slice(0, pos) + token + ta.value.slice(ta.selectionEnd);
    ta.selectionStart = ta.selectionEnd = pos + token.length;
    ta.focus();
  },

  exportData() {
    const data = {
      config: DB.config,
      products: DB.products,
      categories: DB.categories,
      workers: DB.workers,
      customers: DB.customers,
      suppliers: DB.suppliers,
      sales: DB.sales,
      returns: DB.returns,
      purchases: DB.purchases,
      exportedAt: nowStr(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `electroshop-backup-${todayStr()}.json`;
    a.click();
    showToast('Datos exportados correctamente', 'success');
  },

  resetData() {
    openConfirm(
      'Restablecer Datos',
      'Esta acción reiniciará todos los contadores y datos de sesión. Los datos del catálogo se mantendrán.',
      () => {
        DB.caja.current = null;
        DB.nextSaleId = DB.sales.length + 1;
        showToast('Sistema restablecido', 'info');
        navigate('config');
      }
    );
  },
};
