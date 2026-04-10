/* =================================================================
   ELECTROSHOP POS — STATIC DATA (in-memory database)
   Nicho: Tecnología — cables, audio, drones, cámaras, gaming, redes
   ================================================================= */

const DB = {

  /* ---- CATEGORIES ---- */
  categories: [
    { id:'C01', name:'Cables y Adaptadores', icon:'fa-plug',          color:'#3b82f6', bg:'#dbeafe', desc:'Cables USB, HDMI, auxiliares, hubs y adaptadores' },
    { id:'C02', name:'Audio y Sonido',        icon:'fa-headphones',   color:'#8b5cf6', bg:'#ede9fe', desc:'Auriculares, parlantes bluetooth, micrófonos y soundbars' },
    { id:'C03', name:'Fotografía y Video',    icon:'fa-camera',       color:'#f97316', bg:'#ffedd5', desc:'Cámaras de acción, gimbals, trípodes, memorias SD y accesorios' },
    { id:'C04', name:'Drones',                icon:'fa-helicopter',   color:'#06b6d4', bg:'#cffafe', desc:'Drones DJI y Holy Stone, baterías, controles y accesorios de vuelo' },
    { id:'C05', name:'Smartphones y Acces.',  icon:'fa-mobile-screen',color:'#10b981', bg:'#d1fae5', desc:'Cargadores, power banks, fundas, soportes y accesorios móviles' },
    { id:'C06', name:'Cómputo y Periféricos', icon:'fa-laptop',       color:'#f59e0b', bg:'#fef3c7', desc:'Laptops, teclados, mouses, monitores, SSDs y RAM' },
    { id:'C07', name:'Gaming',                icon:'fa-gamepad',      color:'#ef4444', bg:'#fee2e2', desc:'Controles, auriculares gaming, teclados, mouses y accesorios gamer' },
    { id:'C08', name:'Redes y Streaming',     icon:'fa-wifi',         color:'#ec4899', bg:'#fce7f3', desc:'Routers WiFi 6, repetidores, switches, Chromecast y streaming' },
  ],

  /* ---- PRODUCTS (12 per category = 96 total) ---- */
  products: [
    // ===== CABLES Y ADAPTADORES (C01) =====
    { id:'P001',code:'CAB001',name:'Cable USB-C a USB-C Anker 240W 2m',        catId:'C01',buyP:8,   sellP:15,  stock:45, minStock:15, unit:'und',status:'active',supId:'S01',sold:280,image:'imagenes/CAB001.webp' },
    { id:'P002',code:'CAB002',name:'Cable HDMI 4K 60Hz Ugreen 3m',             catId:'C01',buyP:7,   sellP:12,  stock:60, minStock:20, unit:'und',status:'active',supId:'S01',sold:320,image:'imagenes/CAB002.webp' },
    { id:'P003',code:'CAB003',name:'Cable USB-A a Lightning iPhone 2m',         catId:'C01',buyP:6,   sellP:10,  stock:55, minStock:18, unit:'und',status:'active',supId:'S01',sold:290,image:'imagenes/CAB003.webp' },
    { id:'P004',code:'CAB004',name:'Hub USB-C 7 en 1 Anker 555',               catId:'C01',buyP:22,  sellP:38,  stock:28, minStock:10, unit:'und',status:'active',supId:'S01',sold:145,image:'imagenes/CAB004.webp' },
    { id:'P005',code:'CAB005',name:'Cable Auxiliar 3.5mm Trenzado 1.5m',       catId:'C01',buyP:3,   sellP:6,   stock:80, minStock:25, unit:'und',status:'active',supId:'S01',sold:420,image:'imagenes/CAB005.webp' },
    { id:'P006',code:'CAB006',name:'Adaptador HDMI a VGA Full HD',              catId:'C01',buyP:8,   sellP:14,  stock:35, minStock:12, unit:'und',status:'active',supId:'S01',sold:185,image:'imagenes/CAB006.webp' },
    { id:'P007',code:'CAB007',name:'Cable Micro-USB Trenzado 1m Ugreen',       catId:'C01',buyP:4,   sellP:7,   stock:70, minStock:20, unit:'und',status:'active',supId:'S01',sold:350,image:'imagenes/CAB007.webp' },
    { id:'P008',code:'CAB008',name:'Adaptador USB-C a Jack 3.5mm',             catId:'C01',buyP:5,   sellP:9,   stock:50, minStock:15, unit:'und',status:'active',supId:'S01',sold:260,image:'imagenes/CAB008.webp' },
    { id:'P009',code:'CAB009',name:'Cable DisplayPort 4K 144Hz 2m',            catId:'C01',buyP:12,  sellP:20,  stock:22, minStock:8,  unit:'und',status:'active',supId:'S01',sold:110,image:'imagenes/CAB009.webp' },
    { id:'P010',code:'CAB010',name:'Extensión USB 3.0 de 3m',                  catId:'C01',buyP:7,   sellP:12,  stock:38, minStock:12, unit:'und',status:'active',supId:'S01',sold:195,image:'imagenes/CAB010.webp' },
    { id:'P011',code:'CAB011',name:'Adaptador USB-C a HDMI 4K',               catId:'C01',buyP:10,  sellP:18,  stock:32, minStock:10, unit:'und',status:'active',supId:'S01',sold:168,image:'imagenes/CAB011.webp' },
    { id:'P012',code:'CAB012',name:'Cable Ethernet Cat6 5m RJ45',              catId:'C01',buyP:5,   sellP:9,   stock:42, minStock:12, unit:'und',status:'active',supId:'S01',sold:210,image:'imagenes/CAB012.webp' },

    // ===== AUDIO Y SONIDO (C02) =====
    { id:'P013',code:'AUD001',name:'Auriculares Sony WH-1000XM5 NC BT',        catId:'C02',buyP:280, sellP:385, stock:8,  minStock:3,  unit:'und',status:'active',supId:'S02',sold:42, image:'imagenes/AUD001.webp' },
    { id:'P014',code:'AUD002',name:'Auriculares JBL Tune 770NC Bluetooth',      catId:'C02',buyP:85,  sellP:128, stock:12, minStock:4,  unit:'und',status:'active',supId:'S02',sold:68, image:'imagenes/AUD002.webp' },
    { id:'P015',code:'AUD003',name:'TWS Samsung Galaxy Buds2 Pro',              catId:'C02',buyP:120, sellP:178, stock:10, minStock:3,  unit:'und',status:'active',supId:'S02',sold:55, image:'imagenes/AUD003.webp' },
    { id:'P016',code:'AUD004',name:'TWS Xiaomi Redmi Buds 4 Pro',               catId:'C02',buyP:45,  sellP:72,  stock:20, minStock:6,  unit:'und',status:'active',supId:'S02',sold:115,image:'imagenes/AUD004.webp' },
    { id:'P017',code:'AUD005',name:'Parlante Bluetooth JBL Charge 5',           catId:'C02',buyP:95,  sellP:148, stock:14, minStock:5,  unit:'und',status:'active',supId:'S02',sold:88, image:'imagenes/AUD005.webp' },
    { id:'P018',code:'AUD006',name:'Parlante Bluetooth Sony SRS-XB43',          catId:'C02',buyP:110, sellP:168, stock:10, minStock:3,  unit:'und',status:'active',supId:'S02',sold:62, image:'imagenes/AUD006.webp' },
    { id:'P019',code:'AUD007',name:'Micrófono USB Blue Snowball iCE',           catId:'C02',buyP:45,  sellP:72,  stock:8,  minStock:3,  unit:'und',status:'active',supId:'S02',sold:38, image:'imagenes/AUD007.webp' },
    { id:'P020',code:'AUD008',name:'Auriculares Gaming HyperX Cloud II',        catId:'C02',buyP:65,  sellP:98,  stock:12, minStock:4,  unit:'und',status:'active',supId:'S02',sold:72, image:'imagenes/AUD008.webp' },
    { id:'P021',code:'AUD009',name:'Parlante Portátil Anker SoundCore 3',       catId:'C02',buyP:38,  sellP:62,  stock:18, minStock:6,  unit:'und',status:'active',supId:'S02',sold:95, image:'imagenes/AUD009.webp' },
    { id:'P022',code:'AUD010',name:'Soundbar Xiaomi 2.0 80W BT',               catId:'C02',buyP:85,  sellP:132, stock:7,  minStock:2,  unit:'und',status:'active',supId:'S02',sold:45, image:'imagenes/AUD010.webp' },
    { id:'P023',code:'AUD011',name:'Auriculares In-Ear Jabra Elite 4 Active',   catId:'C02',buyP:58,  sellP:88,  stock:14, minStock:4,  unit:'und',status:'active',supId:'S02',sold:78, image:'imagenes/AUD011.webp' },
    { id:'P024',code:'AUD012',name:'Altavoz Portátil JBL Go 4',                catId:'C02',buyP:28,  sellP:45,  stock:22, minStock:7,  unit:'und',status:'active',supId:'S02',sold:125,image:'imagenes/AUD012.webp' },

    // ===== FOTOGRAFÍA Y VIDEO (C03) =====
    { id:'P025',code:'FOT001',name:'Cámara GoPro Hero 12 Black',               catId:'C03',buyP:320, sellP:428, stock:6,  minStock:2,  unit:'und',status:'active',supId:'S03',sold:28, image:'imagenes/FOT001.webp' },
    { id:'P026',code:'FOT002',name:'Cámara Sony ZV-E10 Mirrorless Kit 16-50',  catId:'C03',buyP:580, sellP:780, stock:4,  minStock:1,  unit:'und',status:'active',supId:'S03',sold:15, image:'imagenes/FOT002.webp' },
    { id:'P027',code:'FOT003',name:'Cámara de Acción AKASO V50 Elite 4K',      catId:'C03',buyP:75,  sellP:115, stock:10, minStock:3,  unit:'und',status:'active',supId:'S03',sold:52, image:'imagenes/FOT003.webp' },
    { id:'P028',code:'FOT004',name:'Gimbal Zhiyun Smooth 5S para Celular',     catId:'C03',buyP:95,  sellP:148, stock:8,  minStock:2,  unit:'und',status:'active',supId:'S03',sold:38, image:'imagenes/FOT004.webp' },
    { id:'P029',code:'FOT005',name:'Memoria SD SanDisk Extreme 128GB V30',     catId:'C03',buyP:18,  sellP:28,  stock:35, minStock:10, unit:'und',status:'active',supId:'S03',sold:195,image:'imagenes/FOT005.webp' },
    { id:'P030',code:'FOT006',name:'Memoria SD Samsung Pro Plus 256GB',        catId:'C03',buyP:28,  sellP:45,  stock:25, minStock:8,  unit:'und',status:'active',supId:'S03',sold:148,image:'imagenes/FOT006.webp' },
    { id:'P031',code:'FOT007',name:'Trípode Flexible Joby GorillaPod 3K',      catId:'C03',buyP:28,  sellP:45,  stock:18, minStock:5,  unit:'und',status:'active',supId:'S03',sold:95, image:'imagenes/FOT007.webp' },
    { id:'P032',code:'FOT008',name:'Ring Light LED 10" con Tripié y Soporte',  catId:'C03',buyP:22,  sellP:38,  stock:20, minStock:6,  unit:'und',status:'active',supId:'S03',sold:125,image:'imagenes/FOT008.webp' },
    { id:'P033',code:'FOT009',name:'Filtro ND Variable 58mm para Cámara',      catId:'C03',buyP:18,  sellP:30,  stock:14, minStock:4,  unit:'und',status:'active',supId:'S03',sold:68, image:'imagenes/FOT009.webp' },
    { id:'P034',code:'FOT010',name:'Batería Extra NP-FZ100 para Sony Alpha',   catId:'C03',buyP:22,  sellP:35,  stock:20, minStock:6,  unit:'und',status:'active',supId:'S03',sold:88, image:'imagenes/FOT010.webp' },
    { id:'P035',code:'FOT011',name:'Bolso Lowepro Fastpack BP 250 AW II',      catId:'C03',buyP:48,  sellP:75,  stock:8,  minStock:2,  unit:'und',status:'active',supId:'S03',sold:42, image:'imagenes/FOT011.webp' },
    { id:'P036',code:'FOT012',name:'Control Remoto Wi-Fi para GoPro Hero 12',  catId:'C03',buyP:25,  sellP:40,  stock:12, minStock:4,  unit:'und',status:'active',supId:'S03',sold:58, image:'imagenes/FOT012.webp' },

    // ===== DRONES (C04) =====
    { id:'P037',code:'DRO001',name:'DJI Mini 4 Pro Drone 4K/60fps',            catId:'C04',buyP:680, sellP:920, stock:5,  minStock:2,  unit:'und',status:'active',supId:'S04',sold:18, image:'imagenes/DRO001.webp' },
    { id:'P038',code:'DRO002',name:'DJI Air 3 Combo Fly More',                 catId:'C04',buyP:1050,sellP:1380,stock:3,  minStock:1,  unit:'und',status:'active',supId:'S04',sold:8,  image:'imagenes/DRO002.webp' },
    { id:'P039',code:'DRO003',name:'DJI Mini 3 Drone Solo',                    catId:'C04',buyP:480, sellP:650, stock:4,  minStock:1,  unit:'und',status:'active',supId:'S04',sold:14, image:'imagenes/DRO003.webp' },
    { id:'P040',code:'DRO004',name:'DJI Avata 2 FPV Combo',                    catId:'C04',buyP:750, sellP:980, stock:3,  minStock:1,  unit:'und',status:'active',supId:'S04',sold:10, image:'imagenes/DRO004.webp' },
    { id:'P041',code:'DRO005',name:'Holy Stone HS720E 4K GPS Drone',           catId:'C04',buyP:120, sellP:185, stock:8,  minStock:2,  unit:'und',status:'active',supId:'S04',sold:35, image:'imagenes/DRO005.webp' },
    { id:'P042',code:'DRO006',name:'Batería Inteligente DJI Mini 4 Pro',       catId:'C04',buyP:52,  sellP:82,  stock:15, minStock:5,  unit:'und',status:'active',supId:'S04',sold:55, image:'imagenes/DRO006.webp' },
    { id:'P043',code:'DRO007',name:'Control Remoto DJI RC2 con Pantalla',      catId:'C04',buyP:180, sellP:250, stock:6,  minStock:2,  unit:'und',status:'active',supId:'S04',sold:22, image:'imagenes/DRO007.webp' },
    { id:'P044',code:'DRO008',name:'Kit de Carga Múltiple DJI Mini 4 Pro',     catId:'C04',buyP:65,  sellP:98,  stock:8,  minStock:3,  unit:'und',status:'active',supId:'S04',sold:28, image:'imagenes/DRO008.webp' },
    { id:'P045',code:'DRO009',name:'Bolsa de Transporte Shoulder DJI',         catId:'C04',buyP:28,  sellP:45,  stock:12, minStock:4,  unit:'und',status:'active',supId:'S04',sold:42, image:'imagenes/DRO009.webp' },
    { id:'P046',code:'DRO010',name:'Protector de Hélices DJI Mini 4 Pro',     catId:'C04',buyP:8,   sellP:14,  stock:25, minStock:8,  unit:'und',status:'active',supId:'S04',sold:88, image:'imagenes/DRO010.webp' },
    { id:'P047',code:'DRO011',name:'Filtros ND DJI Mini 4 Pro Set x4',        catId:'C04',buyP:35,  sellP:55,  stock:14, minStock:4,  unit:'und',status:'active',supId:'S04',sold:48, image:'imagenes/DRO011.webp' },
    { id:'P048',code:'DRO012',name:'Potensic ATOM SE 4K GPS Drone',           catId:'C04',buyP:145, sellP:215, stock:6,  minStock:2,  unit:'und',status:'active',supId:'S04',sold:25, image:'imagenes/DRO012.webp' },

    // ===== SMARTPHONES Y ACCESORIOS (C05) =====
    { id:'P049',code:'SMT001',name:'Samsung Galaxy S23 FE 256GB',              catId:'C05',buyP:380, sellP:520, stock:6,  minStock:2,  unit:'und',status:'active',supId:'S05',sold:22, image:'imagenes/SMT001.webp' },
    { id:'P050',code:'SMT002',name:'Xiaomi 13T Pro 256GB',                     catId:'C05',buyP:320, sellP:440, stock:8,  minStock:3,  unit:'und',status:'active',supId:'S05',sold:28, image:'imagenes/SMT002.webp' },
    { id:'P051',code:'SMT003',name:'Cargador Inalámbrico 15W Qi MagSafe',      catId:'C05',buyP:18,  sellP:32,  stock:30, minStock:10, unit:'und',status:'active',supId:'S05',sold:148,image:'imagenes/SMT003.webp' },
    { id:'P052',code:'SMT004',name:'Cargador Rápido 65W GaN USB-C',            catId:'C05',buyP:22,  sellP:38,  stock:35, minStock:12, unit:'und',status:'active',supId:'S05',sold:195,image:'imagenes/SMT004.webp' },
    { id:'P053',code:'SMT005',name:'Power Bank Xiaomi 33W 20000mAh',           catId:'C05',buyP:28,  sellP:48,  stock:25, minStock:8,  unit:'und',status:'active',supId:'S05',sold:165,image:'imagenes/SMT005.webp' },
    { id:'P054',code:'SMT006',name:'Soporte Magnético para Auto Ventilación',  catId:'C05',buyP:10,  sellP:18,  stock:45, minStock:15, unit:'und',status:'active',supId:'S05',sold:280,image:'imagenes/SMT006.webp' },
    { id:'P055',code:'SMT007',name:'Funda Protectora Samsung S23 Ultra',       catId:'C05',buyP:8,   sellP:14,  stock:50, minStock:15, unit:'und',status:'active',supId:'S05',sold:320,image:'imagenes/SMT007.webp' },
    { id:'P056',code:'SMT008',name:'Vidrio Templado iPhone 15 Pro Max',        catId:'C05',buyP:5,   sellP:9,   stock:60, minStock:20, unit:'und',status:'active',supId:'S05',sold:380,image:'imagenes/SMT008.webp' },
    { id:'P057',code:'SMT009',name:'Anillo de Luz LED para Celular 26cm',      catId:'C05',buyP:15,  sellP:28,  stock:22, minStock:7,  unit:'und',status:'active',supId:'S05',sold:112,image:'imagenes/SMT009.webp' },
    { id:'P058',code:'SMT010',name:'Pop Socket MagSafe Premium',               catId:'C05',buyP:8,   sellP:15,  stock:40, minStock:12, unit:'und',status:'active',supId:'S05',sold:225,image:'imagenes/SMT010.webp' },
    { id:'P059',code:'SMT011',name:'Soporte Escritorio Ajustable para Celular',catId:'C05',buyP:12,  sellP:22,  stock:30, minStock:10, unit:'und',status:'active',supId:'S05',sold:155,image:'imagenes/SMT011.webp' },
    { id:'P060',code:'SMT012',name:'Funda Anti-Shock con Tapa iPhone 15',      catId:'C05',buyP:10,  sellP:18,  stock:35, minStock:10, unit:'und',status:'active',supId:'S05',sold:210,image:'imagenes/SMT012.webp' },

    // ===== CÓMPUTO Y PERIFÉRICOS (C06) =====
    { id:'P061',code:'COM001',name:'Laptop Lenovo IdeaPad 5i Core i5 15.6"',  catId:'C06',buyP:480, sellP:650, stock:5,  minStock:2,  unit:'und',status:'active',supId:'S06',sold:18, image:'imagenes/COM001.webp' },
    { id:'P062',code:'COM002',name:'Mouse Logitech MX Master 3S Inalámbrico', catId:'C06',buyP:55,  sellP:85,  stock:15, minStock:5,  unit:'und',status:'active',supId:'S06',sold:82, image:'imagenes/COM002.webp' },
    { id:'P063',code:'COM003',name:'Teclado Mecánico Keychron K6 Hot Swap',   catId:'C06',buyP:78,  sellP:120, stock:10, minStock:3,  unit:'und',status:'active',supId:'S06',sold:55, image:'imagenes/COM003.webp' },
    { id:'P064',code:'COM004',name:'Monitor LG 27" IPS 144Hz FHD',            catId:'C06',buyP:220, sellP:320, stock:6,  minStock:2,  unit:'und',status:'active',supId:'S06',sold:28, image:'imagenes/COM004.webp' },
    { id:'P065',code:'COM005',name:'Webcam Logitech C920 HD Pro 1080p',       catId:'C06',buyP:65,  sellP:98,  stock:10, minStock:3,  unit:'und',status:'active',supId:'S06',sold:48, image:'imagenes/COM005.webp' },
    { id:'P066',code:'COM006',name:'SSD Externo Samsung T7 1TB USB 3.2',      catId:'C06',buyP:85,  sellP:132, stock:12, minStock:4,  unit:'und',status:'active',supId:'S06',sold:62, image:'imagenes/COM006.webp' },
    { id:'P067',code:'COM007',name:'SSD Interno Kingston NV2 1TB NVMe',       catId:'C06',buyP:55,  sellP:82,  stock:14, minStock:4,  unit:'und',status:'active',supId:'S06',sold:75, image:'imagenes/COM007.webp' },
    { id:'P068',code:'COM008',name:'RAM DDR4 16GB 3200MHz Kingston Fury',     catId:'C06',buyP:42,  sellP:65,  stock:18, minStock:5,  unit:'und',status:'active',supId:'S06',sold:88, image:'imagenes/COM008.webp' },
    { id:'P069',code:'COM009',name:'Mousepad XXL RGB Redragon 900x400mm',     catId:'C06',buyP:18,  sellP:30,  stock:22, minStock:7,  unit:'und',status:'active',supId:'S06',sold:115,image:'imagenes/COM009.webp' },
    { id:'P070',code:'COM010',name:'Stand Ventilado para Laptop Ajustable',   catId:'C06',buyP:22,  sellP:38,  stock:15, minStock:5,  unit:'und',status:'active',supId:'S06',sold:78, image:'imagenes/COM010.webp' },
    { id:'P071',code:'COM011',name:'Tarjeta de Captura Elgato HD60 X',        catId:'C06',buyP:120, sellP:178, stock:6,  minStock:2,  unit:'und',status:'active',supId:'S06',sold:32, image:'imagenes/COM011.webp' },
    { id:'P072',code:'COM012',name:'Hub USB-C 4K HDMI Anker 555 8 en 1',     catId:'C06',buyP:38,  sellP:60,  stock:20, minStock:6,  unit:'und',status:'active',supId:'S06',sold:98, image:'imagenes/COM012.webp' },

    // ===== GAMING (C07) =====
    { id:'P073',code:'GAM001',name:'Control PS5 DualSense Blanco',             catId:'C07',buyP:68,  sellP:105, stock:12, minStock:4,  unit:'und',status:'active',supId:'S07',sold:75, image:'imagenes/GAM001.webp' },
    { id:'P074',code:'GAM002',name:'Control Xbox Series X Inalámbrico',        catId:'C07',buyP:58,  sellP:90,  stock:14, minStock:4,  unit:'und',status:'active',supId:'S07',sold:82, image:'imagenes/GAM002.webp' },
    { id:'P075',code:'GAM003',name:'Auriculares Razer BlackShark V2 Pro BT',   catId:'C07',buyP:110, sellP:165, stock:8,  minStock:2,  unit:'und',status:'active',supId:'S07',sold:45, image:'imagenes/GAM003.webp' },
    { id:'P076',code:'GAM004',name:'Mousepad Gaming SteelSeries QcK XXL',     catId:'C07',buyP:22,  sellP:38,  stock:18, minStock:5,  unit:'und',status:'active',supId:'S07',sold:98, image:'imagenes/GAM004.webp' },
    { id:'P077',code:'GAM005',name:'Teclado Gaming Razer Huntsman Mini',       catId:'C07',buyP:85,  sellP:128, stock:10, minStock:3,  unit:'und',status:'active',supId:'S07',sold:55, image:'imagenes/GAM005.webp' },
    { id:'P078',code:'GAM006',name:'Mouse Gaming Logitech G502 X Plus',       catId:'C07',buyP:52,  sellP:80,  stock:14, minStock:4,  unit:'und',status:'active',supId:'S07',sold:88, image:'imagenes/GAM006.webp' },
    { id:'P079',code:'GAM007',name:'Silla Gaming Secretlab Titan Evo Negro',   catId:'C07',buyP:185, sellP:280, stock:4,  minStock:1,  unit:'und',status:'active',supId:'S07',sold:18, image:'imagenes/GAM007.webp' },
    { id:'P080',code:'GAM008',name:'Control Nintendo Switch Pro Controller',   catId:'C07',buyP:58,  sellP:88,  stock:10, minStock:3,  unit:'und',status:'active',supId:'S07',sold:62, image:'imagenes/GAM008.webp' },
    { id:'P081',code:'GAM009',name:'Headset Gaming JBL Quantum 600 BT',       catId:'C07',buyP:78,  sellP:118, stock:8,  minStock:2,  unit:'und',status:'active',supId:'S07',sold:42, image:'imagenes/GAM009.webp' },
    { id:'P082',code:'GAM010',name:'Gamepad PC EasySMX X10 Hall Effect',      catId:'C07',buyP:35,  sellP:55,  stock:15, minStock:4,  unit:'und',status:'active',supId:'S07',sold:72, image:'imagenes/GAM010.webp' },
    { id:'P083',code:'GAM011',name:'Cooling Pad RGB para Laptops Gaming',      catId:'C07',buyP:22,  sellP:38,  stock:18, minStock:5,  unit:'und',status:'active',supId:'S07',sold:88, image:'imagenes/GAM011.webp' },
    { id:'P084',code:'GAM012',name:'Reposa Muñecas Gel para Teclado',          catId:'C07',buyP:12,  sellP:20,  stock:25, minStock:8,  unit:'und',status:'active',supId:'S07',sold:115,image:'imagenes/GAM012.webp' },

    // ===== REDES Y STREAMING (C08) =====
    { id:'P085',code:'RED001',name:'Router WiFi 6 TP-Link Archer AX3000',     catId:'C08',buyP:65,  sellP:98,  stock:10, minStock:3,  unit:'und',status:'active',supId:'S08',sold:52, image:'imagenes/RED001.webp' },
    { id:'P086',code:'RED002',name:'Chromecast con Google TV 4K',              catId:'C08',buyP:48,  sellP:75,  stock:14, minStock:4,  unit:'und',status:'active',supId:'S08',sold:78, image:'imagenes/RED002.webp' },
    { id:'P087',code:'RED003',name:'Amazon Fire TV Stick 4K Max Gen2',        catId:'C08',buyP:45,  sellP:70,  stock:12, minStock:4,  unit:'und',status:'active',supId:'S08',sold:65, image:'imagenes/RED003.webp' },
    { id:'P088',code:'RED004',name:'Repetidor WiFi TP-Link RE705X AX3000',    catId:'C08',buyP:38,  sellP:60,  stock:15, minStock:5,  unit:'und',status:'active',supId:'S08',sold:88, image:'imagenes/RED004.webp' },
    { id:'P089',code:'RED005',name:'Switch TP-Link TL-SG108E 8 Puertos',      catId:'C08',buyP:28,  sellP:45,  stock:12, minStock:4,  unit:'und',status:'active',supId:'S08',sold:62, image:'imagenes/RED005.webp' },
    { id:'P090',code:'RED006',name:'Router Mesh TP-Link Deco XE75 Pack x2',   catId:'C08',buyP:145, sellP:218, stock:6,  minStock:2,  unit:'und',status:'active',supId:'S08',sold:28, image:'imagenes/RED006.webp' },
    { id:'P091',code:'RED007',name:'Adaptador WiFi USB TP-Link Archer T3U',   catId:'C08',buyP:12,  sellP:20,  stock:22, minStock:7,  unit:'und',status:'active',supId:'S08',sold:115,image:'imagenes/RED007.webp' },
    { id:'P092',code:'RED008',name:'Cable Ethernet Cat7 10m Flat Ugreen',     catId:'C08',buyP:10,  sellP:17,  stock:30, minStock:10, unit:'und',status:'active',supId:'S08',sold:145,image:'imagenes/RED008.webp' },
    { id:'P093',code:'RED009',name:'Raspberry Pi 4 Model B 4GB',              catId:'C08',buyP:65,  sellP:98,  stock:8,  minStock:2,  unit:'und',status:'active',supId:'S08',sold:35, image:'imagenes/RED009.webp' },
    { id:'P094',code:'RED010',name:'Powerline Adapter TP-Link AV1000 x2',     catId:'C08',buyP:35,  sellP:55,  stock:10, minStock:3,  unit:'und',status:'active',supId:'S08',sold:48, image:'imagenes/RED010.webp' },
    { id:'P095',code:'RED011',name:'Antena WiFi Externa 9dBi RP-SMA',         catId:'C08',buyP:8,   sellP:14,  stock:28, minStock:8,  unit:'und',status:'active',supId:'S08',sold:88, image:'imagenes/RED011.webp' },
    { id:'P096',code:'RED012',name:'Access Point TP-Link EAP225 AC1350',      catId:'C08',buyP:45,  sellP:70,  stock:8,  minStock:2,  unit:'und',status:'active',supId:'S08',sold:42, image:'imagenes/RED012.webp' },
  ],

  /* ---- WORKERS ---- */
  workers: [
    { id:'W01', name:'Carlos Mendoza',    roleId:'ROL01', role:'Administrador',       email:'carlos.mendoza@electroshop.bo',    phone:'+591 70-123-456', address:'Av. América 234, Cochabamba',          status:'active',   hireDate:'2019-03-15', salary:6500, avatar:'CM', color:'#3b82f6', sales:0   },
    { id:'W02', name:'Ana López',         roleId:'ROL02', role:'Cajera',              email:'ana.lopez@electroshop.bo',         phone:'+591 70-234-567', address:'Calle Mayor Rocha 145, Cochabamba',    status:'active',   hireDate:'2020-07-01', salary:3800, avatar:'AL', color:'#10b981', sales:124 },
    { id:'W03', name:'Roberto García',    roleId:'ROL02', role:'Cajero',              email:'roberto.garcia@electroshop.bo',    phone:'+591 71-345-678', address:'Av. Pando 89, Cochabamba',             status:'active',   hireDate:'2021-01-10', salary:3800, avatar:'RG', color:'#f59e0b', sales:98  },
    { id:'W04', name:'María Torres',      roleId:'ROL03', role:'Supervisora',         email:'maria.torres@electroshop.bo',      phone:'+591 72-456-789', address:'Av. Heroínas 567, Cochabamba',         status:'active',   hireDate:'2019-11-20', salary:5200, avatar:'MT', color:'#8b5cf6', sales:0   },
    { id:'W05', name:'Luis Ramírez',      roleId:'ROL04', role:'Bodeguero',           email:'luis.ramirez@electroshop.bo',      phone:'+591 73-567-890', address:'Cdla. Bolivia 78, Cochabamba',         status:'active',   hireDate:'2020-04-15', salary:3200, avatar:'LR', color:'#06b6d4', sales:0   },
    { id:'W06', name:'Carmen Villalba',   roleId:'ROL02', role:'Cajera',              email:'carmen.villalba@electroshop.bo',   phone:'+591 74-678-901', address:'Av. Blanco Galindo Km 3, Cbba.',       status:'active',   hireDate:'2022-03-01', salary:3800, avatar:'CV', color:'#ec4899', sales:86  },
    { id:'W07', name:'Diego Morales',     roleId:'ROL04', role:'Asistente de Ventas', email:'diego.morales@electroshop.bo',     phone:'+591 75-789-012', address:'Calle Ladislao Cabrera 34, Cbba.',     status:'inactive', hireDate:'2021-09-01', salary:3000, avatar:'DM', color:'#94a3b8', sales:0   },
    { id:'W08', name:'Patricia Cevallos', roleId:'ROL05', role:'Contadora',           email:'patricia.cevallos@electroshop.bo', phone:'+591 76-890-123', address:'Av. Oquendo 456, Cochabamba',          status:'active',   hireDate:'2020-01-05', salary:5800, avatar:'PC', color:'#f97316', sales:0   },
    { id:'W09', name:'Fernando Salinas',  roleId:'ROL02', role:'Cajero',              email:'fernando.salinas@electroshop.bo',  phone:'+591 77-901-234', address:'Av. Aroma 789, Cochabamba',            status:'active',   hireDate:'2022-06-15', salary:3800, avatar:'FS', color:'#ef4444', sales:75  },
    { id:'W10', name:'Isabella Guzmán',   roleId:'ROL04', role:'Asistente',           email:'isabella.guzman@electroshop.bo',   phone:'+591 78-012-345', address:'Calle 25 de Mayo 23, Cbba.',           status:'active',   hireDate:'2023-02-01', salary:3000, avatar:'IG', color:'#6366f1', sales:0   },
  ],

  /* ---- CUSTOMERS ---- */
  customers: [
    { id:'CU01', name:'Patricia Soria Mendoza',   email:'patricia.soria@gmail.com',   phone:'+591 70-111-222', address:'Av. Blanco Galindo Km 5, Cbba.',    points:850,  purchases:18, spent:4850.80,  since:'2021-03-10', type:'vip',       ci:'7654321' },
    { id:'CU02', name:'José Condori Quispe',       email:'jcondori@gmail.com',         phone:'+591 71-222-333', address:'Av. América 456, Cbba.',            points:320,  purchases:8,  spent:1820.50,  since:'2021-08-22', type:'frecuente', ci:'6543210' },
    { id:'CU03', name:'Elena Flores Vásquez',      email:'eflores@hotmail.com',        phone:'+591 72-333-444', address:'Cdla. Los Andes 78, Cbba.',         points:1200, purchases:28, spent:8200.30,  since:'2020-11-05', type:'vip',       ci:'5432109' },
    { id:'CU04', name:'Antonio Mamani Cruz',        email:'amamani@gmail.com',          phone:'+591 73-444-555', address:'Av. Heroínas 234, Cbba.',           points:150,  purchases:4,  spent:680.40,   since:'2022-01-15', type:'normal',    ci:'4321098' },
    { id:'CU05', name:'Sofía Rojas Alvarado',       email:'srojas@gmail.com',           phone:'+591 74-555-666', address:'Calle Colombia 890, Cbba.',         points:690,  purchases:15, spent:3890.60,  since:'2021-06-18', type:'frecuente', ci:'3210987' },
    { id:'CU06', name:'Pedro Vargas Palacios',      email:'pvargas@outlook.com',        phone:'+591 75-666-777', address:'Av. Melchor Urquidi 344, Cbba.',    points:420,  purchases:10, spent:2460.20,  since:'2021-12-01', type:'frecuente', ci:'2109876' },
    { id:'CU07', name:'Lucía Choque Morales',       email:'lchoque@gmail.com',          phone:'+591 76-777-888', address:'Av. Uyuni 212, Cbba.',              points:75,   purchases:2,  spent:320.75,   since:'2022-05-20', type:'normal',    ci:'1098765' },
    { id:'CU08', name:'Carlos Jiménez Terán',       email:'cjimenez@gmail.com',         phone:'+591 77-888-999', address:'Calle Nataniel Aguirre 567, Cbba.', points:960,  purchases:22, spent:6480.90,  since:'2020-09-14', type:'vip',       ci:'9087654' },
    { id:'CU09', name:'Ana Reyes Gutiérrez',        email:'areyes@yahoo.com',           phone:'+591 78-999-000', address:'Av. Ayacucho 334, Cbba.',           points:280,  purchases:6,  spent:1390.30,  since:'2022-03-08', type:'normal',    ci:'8076543' },
    { id:'CU10', name:'Miguel Ángel Torrico',       email:'mtorrico@gmail.com',         phone:'+591 60-112-223', address:'Av. Circunvalación 678, Cbba.',     points:540,  purchases:12, spent:3720.50,  since:'2021-09-25', type:'frecuente', ci:'7065432' },
    { id:'CU11', name:'Laura Romero Ibáñez',        email:'lromero@hotmail.com',        phone:'+591 61-223-334', address:'Calle Sucre 445, Cbba.',            points:1450, purchases:32, spent:12850.70, since:'2020-05-30', type:'vip',       ci:'6054321' },
    { id:'CU12', name:'Francisco Guerrero Arana',   email:'fguerrero@gmail.com',        phone:'+591 62-334-445', address:'Cdla. Villa Adela, Cbba.',          points:190,  purchases:5,  spent:1265.40,  since:'2022-07-12', type:'normal',    ci:'5043210' },
    { id:'CU13', name:'Valentina Cruz Montaño',     email:'vcruz@gmail.com',            phone:'+591 63-445-556', address:'Av. República 123, Cbba.',          points:780,  purchases:16, spent:5120.60,  since:'2021-02-14', type:'frecuente', ci:'4032109' },
    { id:'CU14', name:'Roberto Pacheco Aguilar',    email:'rpacheco@gmail.com',         phone:'+591 64-556-667', address:'Calle Uruguay 56, Cbba.',           points:50,   purchases:1,  spent:380.80,   since:'2023-01-05', type:'normal',    ci:'3021098' },
    { id:'CU15', name:'Gabriela Muñoz Salvatierra', email:'gmunoz@outlook.com',         phone:'+591 65-667-778', address:'Av. Tadeo Haenke 234, Cbba.',       points:620,  purchases:14, spent:4890.30,  since:'2021-07-22', type:'frecuente', ci:'2010987' },
    { id:'CU16', name:'Andrés Castillo Salinas',    email:'acastillo@gmail.com',        phone:'+591 66-778-889', address:'Av. 6 de Agosto 578, Cbba.',        points:345,  purchases:9,  spent:2520.80,  since:'2022-04-10', type:'frecuente', ci:'1009876' },
    { id:'CU17', name:'Sandra Paredes Heredia',     email:'sparedes@gmail.com',         phone:'+591 67-889-000', address:'Av. Constitución 767, Cbba.',       points:120,  purchases:3,  spent:548.50,   since:'2022-09-18', type:'normal',    ci:'9998765' },
    { id:'CU18', name:'Javier Mora Villca',          email:'jmora@hotmail.com',          phone:'+591 68-900-011', address:'Calle Venezuela 223, Cbba.',        points:890,  purchases:20, spent:7380.60,  since:'2020-12-08', type:'vip',       ci:'8887654' },
    { id:'CU19', name:'Patricia León Balderrama',   email:'pleon@gmail.com',            phone:'+591 69-011-122', address:'Av. Melchor Pérez 889, Cbba.',      points:240,  purchases:5,  spent:1320.40,  since:'2022-06-15', type:'normal',    ci:'7776543' },
    { id:'CU20', name:'Consumidor Final',            email:'',                           phone:'',               address:'Cochabamba, Bolivia',               points:0,    purchases:0,  spent:0,        since:'2020-01-01', type:'normal',    ci:'9999999' },
  ],

  /* ---- SUPPLIERS ---- */
  suppliers: [
    { id:'S01', name:'CablesTech Bolivia Importaciones', contact:'Rodrigo Saavedra',  email:'ventas@cablestech.bo',      phone:'+591 4-452-3100', address:'Av. Blanco Galindo Km 4, Cbba.',    cats:['C01'],       ci:'1023456789', terms:'30 días', status:'active'   },
    { id:'S02', name:'Audio Premium Distribuciones',     contact:'Carolina Méndez',   email:'pedidos@audiopremium.bo',   phone:'+591 4-453-4200', address:'Av. Oquendo 567, Cbba.',            cats:['C02'],       ci:'2034567890', terms:'30 días', status:'active'   },
    { id:'S03', name:'FotoVideo Import Bolivia',         contact:'Ignacio Varela',     email:'ventas@fotovideo.bo',       phone:'+591 4-454-5300', address:'Calle Lanza 890, Cbba.',            cats:['C03'],       ci:'3045678901', terms:'15 días', status:'active'   },
    { id:'S04', name:'DJI Bolivia Distribuidor Oficial', contact:'Fernanda Arce',      email:'drones@djibolivia.bo',      phone:'+591 4-455-6400', address:'Av. América 234, Cbba.',            cats:['C04'],       ci:'4056789012', terms:'45 días', status:'active'   },
    { id:'S05', name:'TechMobile Bolivia SRL',           contact:'Luis Chang',          email:'pedidos@techmobile.bo',     phone:'+591 4-456-7500', address:'Av. Heroínas 456, Cbba.',           cats:['C05'],       ci:'5067890123', terms:'30 días', status:'active'   },
    { id:'S06', name:'CompuImport Perifériocs Bolivia',  contact:'Mercedes Quiroga',   email:'ventas@compuimport.bo',     phone:'+591 4-457-8600', address:'Av. Blanco Galindo Km 2, Cbba.',    cats:['C06'],       ci:'6078901234', terms:'30 días', status:'active'   },
    { id:'S07', name:'GameZone Distribuciones Bolivia',  contact:'Andrés Fuentes',     email:'pedidos@gamezone.bo',       phone:'+591 4-458-9700', address:'Calle España 789, Cbba.',           cats:['C07'],       ci:'7089012345', terms:'45 días', status:'active'   },
    { id:'S08', name:'NetConnect Bolivia Redes',         contact:'Valeria Cueto',       email:'ventas@netconnect.bo',      phone:'+591 4-459-0800', address:'Av. Tadeo Haenke 1011, Cbba.',      cats:['C08'],       ci:'8090123456', terms:'15 días', status:'active'   },
  ],

  /* ---- SALES (42 ventas — Marzo 2026) ---- */
  sales: [
    { id:'V001',date:'2026-04-01 09:12',custId:'CU20',custName:'Consumidor Final',        workId:'W02',workName:'Ana López',       items:[{pid:'P001',name:'Cable USB-C Anker 240W 2m',qty:2,price:15,subtotal:30},{pid:'P008',name:'Adaptador USB-C a 3.5mm',qty:1,price:9,subtotal:9},{pid:'P051',name:'Cargador Inalámbrico 15W',qty:1,price:32,subtotal:32}],             subtotal:71,  discount:0,  tax:9.23,   total:80.23,   method:'efectivo',      status:'completed' },
    { id:'V002',date:'2026-04-01 10:35',custId:'CU03',custName:'Elena Flores Vásquez',    workId:'W02',workName:'Ana López',       items:[{pid:'P037',name:'DJI Mini 4 Pro Drone 4K',qty:1,price:920,subtotal:920},{pid:'P042',name:'Batería DJI Mini 4 Pro',qty:2,price:82,subtotal:164}],                                                                           subtotal:1084,discount:5,  tax:133.87, total:1163.67, method:'tarjeta',       status:'completed' },
    { id:'V003',date:'2026-04-01 11:20',custId:'CU08',custName:'Carlos Jiménez Terán',    workId:'W03',workName:'Roberto García',  items:[{pid:'P013',name:'Auriculares Sony WH-1000XM5',qty:1,price:385,subtotal:385},{pid:'P024',name:'Altavoz JBL Go 4',qty:1,price:45,subtotal:45}],                                                                              subtotal:430, discount:0,  tax:55.90,  total:485.90,  method:'tarjeta',       status:'completed' },
    { id:'V004',date:'2026-04-01 12:08',custId:'CU05',custName:'Sofía Rojas Alvarado',    workId:'W06',workName:'Carmen Villalba', items:[{pid:'P073',name:'Control PS5 DualSense',qty:1,price:105,subtotal:105},{pid:'P078',name:'Mouse Logitech G502 X',qty:1,price:80,subtotal:80},{pid:'P076',name:'Mousepad SteelSeries QcK XXL',qty:1,price:38,subtotal:38}],    subtotal:223, discount:0,  tax:28.99,  total:251.99,  method:'efectivo',      status:'completed' },
    { id:'V005',date:'2026-04-01 13:45',custId:'CU20',custName:'Consumidor Final',        workId:'W09',workName:'Fernando Salinas',items:[{pid:'P005',name:'Cable Auxiliar 3.5mm Trenzado',qty:3,price:6,subtotal:18},{pid:'P056',name:'Vidrio Templado iPhone 15',qty:2,price:9,subtotal:18},{pid:'P055',name:'Funda Samsung S23 Ultra',qty:1,price:14,subtotal:14}],  subtotal:50,  discount:0,  tax:6.50,   total:56.50,   method:'efectivo',      status:'completed' },
    { id:'V006',date:'2026-04-01 14:22',custId:'CU11',custName:'Laura Romero Ibáñez',     workId:'W02',workName:'Ana López',       items:[{pid:'P025',name:'Cámara GoPro Hero 12 Black',qty:1,price:428,subtotal:428},{pid:'P029',name:'SD SanDisk Extreme 128GB',qty:2,price:28,subtotal:56},{pid:'P031',name:'Trípode GorillaPod 3K',qty:1,price:45,subtotal:45}],     subtotal:529, discount:0,  tax:68.77,  total:597.77,  method:'tarjeta',       status:'completed' },
    { id:'V007',date:'2026-04-01 15:10',custId:'CU02',custName:'José Condori Quispe',     workId:'W03',workName:'Roberto García',  items:[{pid:'P085',name:'Router WiFi 6 TP-Link AX3000',qty:1,price:98,subtotal:98},{pid:'P091',name:'Adaptador WiFi USB',qty:1,price:20,subtotal:20}],                                                                             subtotal:118, discount:0,  tax:15.34,  total:133.34,  method:'transferencia', status:'completed' },
    { id:'V008',date:'2026-03-31 09:00',custId:'CU13',custName:'Valentina Cruz Montaño',  workId:'W06',workName:'Carmen Villalba', items:[{pid:'P014',name:'Auriculares JBL Tune 770NC',qty:1,price:128,subtotal:128},{pid:'P016',name:'TWS Xiaomi Redmi Buds 4 Pro',qty:1,price:72,subtotal:72}],                                                                     subtotal:200, discount:0,  tax:26.00,  total:226.00,  method:'tarjeta',       status:'completed' },
    { id:'V009',date:'2026-03-31 10:30',custId:'CU06',custName:'Pedro Vargas Palacios',   workId:'W09',workName:'Fernando Salinas',items:[{pid:'P062',name:'Mouse Logitech MX Master 3S',qty:1,price:85,subtotal:85},{pid:'P063',name:'Teclado Mecánico Keychron K6',qty:1,price:120,subtotal:120},{pid:'P069',name:'Mousepad XXL RGB',qty:1,price:30,subtotal:30}],     subtotal:235, discount:0,  tax:30.55,  total:265.55,  method:'tarjeta',       status:'completed' },
    { id:'V010',date:'2026-03-31 14:15',custId:'CU20',custName:'Consumidor Final',        workId:'W02',workName:'Ana López',       items:[{pid:'P052',name:'Cargador Rápido 65W GaN',qty:2,price:38,subtotal:76},{pid:'P053',name:'Power Bank Xiaomi 20000mAh',qty:1,price:48,subtotal:48},{pid:'P054',name:'Soporte Magnético Auto',qty:2,price:18,subtotal:36}],       subtotal:160, discount:0,  tax:20.80,  total:180.80,  method:'efectivo',      status:'completed' },
    { id:'V011',date:'2026-03-30 09:45',custId:'CU18',custName:'Javier Mora Villca',      workId:'W03',workName:'Roberto García',  items:[{pid:'P042',name:'Batería DJI Mini 4 Pro',qty:3,price:82,subtotal:246},{pid:'P045',name:'Bolsa Transporte DJI',qty:1,price:45,subtotal:45},{pid:'P046',name:'Protector Hélices DJI',qty:2,price:14,subtotal:28}],             subtotal:319, discount:5,  tax:39.40,  total:342.45,  method:'tarjeta',       status:'completed' },
    { id:'V012',date:'2026-03-30 11:30',custId:'CU11',custName:'Laura Romero Ibáñez',     workId:'W06',workName:'Carmen Villalba', items:[{pid:'P026',name:'Cámara Sony ZV-E10 Mirrorless',qty:1,price:780,subtotal:780},{pid:'P034',name:'Batería NP-FZ100 Sony',qty:2,price:35,subtotal:70}],                                                                          subtotal:850, discount:10, tax:99.45,  total:864.45,  method:'tarjeta',       status:'completed' },
    { id:'V013',date:'2026-03-30 15:00',custId:'CU08',custName:'Carlos Jiménez Terán',    workId:'W09',workName:'Fernando Salinas',items:[{pid:'P075',name:'Auriculares Razer BlackShark V2 Pro',qty:1,price:165,subtotal:165},{pid:'P077',name:'Teclado Razer Huntsman Mini',qty:1,price:128,subtotal:128},{pid:'P083',name:'Cooling Pad RGB',qty:1,price:38,subtotal:38}],subtotal:331, discount:0,  tax:43.03,  total:374.03,  method:'tarjeta',       status:'completed' },
    { id:'V014',date:'2026-03-29 09:30',custId:'CU04',custName:'Antonio Mamani Cruz',     workId:'W02',workName:'Ana López',       items:[{pid:'P002',name:'Cable HDMI 4K Ugreen 3m',qty:2,price:12,subtotal:24},{pid:'P004',name:'Hub USB-C 7 en 1 Anker',qty:1,price:38,subtotal:38},{pid:'P007',name:'Cable Micro-USB Trenzado',qty:3,price:7,subtotal:21},{pid:'P011',name:'Adaptador USB-C a HDMI',qty:1,price:18,subtotal:18}],subtotal:101,discount:0,tax:13.13,total:114.13,method:'efectivo',status:'completed' },
    { id:'V015',date:'2026-03-29 11:15',custId:'CU20',custName:'Consumidor Final',        workId:'W03',workName:'Roberto García',  items:[{pid:'P086',name:'Chromecast con Google TV 4K',qty:1,price:75,subtotal:75},{pid:'P088',name:'Repetidor WiFi TP-Link',qty:1,price:60,subtotal:60}],                                                                             subtotal:135, discount:0,  tax:17.55,  total:152.55,  method:'efectivo',      status:'completed' },
    { id:'V016',date:'2026-03-29 14:00',custId:'CU01',custName:'Patricia Soria Mendoza',  workId:'W06',workName:'Carmen Villalba', items:[{pid:'P013',name:'Auriculares Sony WH-1000XM5',qty:1,price:385,subtotal:385},{pid:'P023',name:'Auriculares Jabra Elite 4',qty:1,price:88,subtotal:88}],                                                                         subtotal:473, discount:5,  tax:58.42,  total:507.77,  method:'tarjeta',       status:'completed' },
    { id:'V017',date:'2026-03-28 10:00',custId:'CU15',custName:'Gabriela Muñoz',          workId:'W09',workName:'Fernando Salinas',items:[{pid:'P049',name:'Samsung Galaxy S23 FE 256GB',qty:1,price:520,subtotal:520},{pid:'P051',name:'Cargador Inalámbrico 15W',qty:1,price:32,subtotal:32},{pid:'P056',name:'Vidrio Templado iPhone 15',qty:2,price:9,subtotal:18}], subtotal:570, discount:0,  tax:74.10,  total:644.10,  method:'tarjeta',       status:'completed' },
    { id:'V018',date:'2026-03-28 13:30',custId:'CU03',custName:'Elena Flores Vásquez',    workId:'W02',workName:'Ana López',       items:[{pid:'P038',name:'DJI Air 3 Combo Fly More',qty:1,price:1380,subtotal:1380},{pid:'P043',name:'Control DJI RC2 con Pantalla',qty:1,price:250,subtotal:250},{pid:'P047',name:'Filtros ND DJI Mini 4 Pro',qty:2,price:55,subtotal:110}],subtotal:1740,discount:5, tax:214.89, total:1867.89, method:'tarjeta',       status:'completed' },
    { id:'V019',date:'2026-03-27 09:15',custId:'CU05',custName:'Sofía Rojas Alvarado',    workId:'W03',workName:'Roberto García',  items:[{pid:'P073',name:'Control PS5 DualSense',qty:1,price:105,subtotal:105},{pid:'P074',name:'Control Xbox Series X',qty:1,price:90,subtotal:90},{pid:'P079',name:'Silla Gaming Secretlab Titan',qty:1,price:280,subtotal:280}],      subtotal:475, discount:0,  tax:61.75,  total:536.75,  method:'tarjeta',       status:'completed' },
    { id:'V020',date:'2026-03-27 12:00',custId:'CU20',custName:'Consumidor Final',        workId:'W06',workName:'Carmen Villalba', items:[{pid:'P001',name:'Cable USB-C Anker 240W',qty:3,price:15,subtotal:45},{pid:'P052',name:'Cargador Rápido 65W GaN',qty:2,price:38,subtotal:76},{pid:'P008',name:'Adaptador USB-C a 3.5mm',qty:2,price:9,subtotal:18}],           subtotal:139, discount:0,  tax:18.07,  total:157.07,  method:'efectivo',      status:'completed' },
    { id:'V021',date:'2026-03-26 10:00',custId:'CU10',custName:'Miguel Ángel Torrico',    workId:'W09',workName:'Fernando Salinas',items:[{pid:'P025',name:'Cámara GoPro Hero 12 Black',qty:1,price:428,subtotal:428},{pid:'P029',name:'SD SanDisk Extreme 128GB',qty:1,price:28,subtotal:28},{pid:'P036',name:'Control Remoto GoPro Wi-Fi',qty:1,price:40,subtotal:40}], subtotal:496, discount:0,  tax:64.48,  total:560.48,  method:'tarjeta',       status:'completed' },
    { id:'V022',date:'2026-03-26 14:30',custId:'CU08',custName:'Carlos Jiménez Terán',    workId:'W02',workName:'Ana López',       items:[{pid:'P090',name:'Router Mesh TP-Link Deco XE75',qty:1,price:218,subtotal:218},{pid:'P089',name:'Switch TP-Link 8 Puertos',qty:1,price:45,subtotal:45},{pid:'P092',name:'Cable Ethernet Cat7 10m',qty:3,price:17,subtotal:51}],  subtotal:314, discount:0,  tax:40.82,  total:354.82,  method:'transferencia', status:'completed' },
    { id:'V023',date:'2026-03-25 09:30',custId:'CU13',custName:'Valentina Cruz Montaño',  workId:'W03',workName:'Roberto García',  items:[{pid:'P017',name:'Parlante JBL Charge 5',qty:1,price:148,subtotal:148},{pid:'P024',name:'Altavoz JBL Go 4',qty:2,price:45,subtotal:90},{pid:'P019',name:'Micrófono USB Blue Snowball',qty:1,price:72,subtotal:72}],           subtotal:310, discount:0,  tax:40.30,  total:350.30,  method:'tarjeta',       status:'completed' },
    { id:'V024',date:'2026-03-25 13:45',custId:'CU11',custName:'Laura Romero Ibáñez',     workId:'W06',workName:'Carmen Villalba', items:[{pid:'P061',name:'Laptop Lenovo IdeaPad 5i',qty:1,price:650,subtotal:650},{pid:'P069',name:'Mousepad XXL RGB',qty:1,price:30,subtotal:30},{pid:'P070',name:'Stand Ventilado Laptop',qty:1,price:38,subtotal:38}],              subtotal:718, discount:5,  tax:88.67,  total:770.77,  method:'tarjeta',       status:'completed' },
    { id:'V025',date:'2026-03-24 10:30',custId:'CU20',custName:'Consumidor Final',        workId:'W09',workName:'Fernando Salinas',items:[{pid:'P005',name:'Cable Auxiliar 3.5mm',qty:5,price:6,subtotal:30},{pid:'P012',name:'Cable Ethernet Cat6 5m',qty:2,price:9,subtotal:18},{pid:'P007',name:'Cable Micro-USB 1m',qty:3,price:7,subtotal:21}],                     subtotal:69,  discount:0,  tax:8.97,   total:77.97,   method:'efectivo',      status:'completed' },
    { id:'V026',date:'2026-03-24 14:00',custId:'CU16',custName:'Andrés Castillo Salinas', workId:'W02',workName:'Ana López',       items:[{pid:'P087',name:'Amazon Fire TV Stick 4K Max',qty:2,price:70,subtotal:140},{pid:'P086',name:'Chromecast Google TV 4K',qty:1,price:75,subtotal:75}],                                                                            subtotal:215, discount:0,  tax:27.95,  total:242.95,  method:'efectivo',      status:'completed' },
    { id:'V027',date:'2026-03-23 09:45',custId:'CU07',custName:'Lucía Choque Morales',    workId:'W03',workName:'Roberto García',  items:[{pid:'P078',name:'Mouse Logitech G502 X Plus',qty:1,price:80,subtotal:80},{pid:'P076',name:'Mousepad SteelSeries QcK XXL',qty:1,price:38,subtotal:38},{pid:'P084',name:'Reposa Muñecas Gel',qty:1,price:20,subtotal:20}],       subtotal:138, discount:0,  tax:17.94,  total:155.94,  method:'efectivo',      status:'completed' },
    { id:'V028',date:'2026-03-23 13:15',custId:'CU18',custName:'Javier Mora Villca',      workId:'W06',workName:'Carmen Villalba', items:[{pid:'P015',name:'TWS Samsung Galaxy Buds2 Pro',qty:1,price:178,subtotal:178},{pid:'P018',name:'Parlante Sony SRS-XB43',qty:1,price:168,subtotal:168}],                                                                         subtotal:346, discount:0,  tax:44.98,  total:390.98,  method:'tarjeta',       status:'completed' },
    { id:'V029',date:'2026-03-22 10:00',custId:'CU08',custName:'Carlos Jiménez Terán',    workId:'W09',workName:'Fernando Salinas',items:[{pid:'P039',name:'DJI Mini 3 Drone Solo',qty:1,price:650,subtotal:650},{pid:'P042',name:'Batería DJI Mini 4 Pro',qty:3,price:82,subtotal:246},{pid:'P045',name:'Bolsa Transporte DJI',qty:1,price:45,subtotal:45}],            subtotal:941, discount:10, tax:110.10, total:957.00,  method:'tarjeta',       status:'completed' },
    { id:'V030',date:'2026-03-22 14:00',custId:'CU20',custName:'Consumidor Final',        workId:'W02',workName:'Ana López',       items:[{pid:'P001',name:'Cable USB-C Anker 240W',qty:4,price:15,subtotal:60},{pid:'P002',name:'Cable HDMI 4K Ugreen',qty:2,price:12,subtotal:24},{pid:'P010',name:'Extensión USB 3.0 3m',qty:3,price:12,subtotal:36}],               subtotal:120, discount:0,  tax:15.60,  total:135.60,  method:'efectivo',      status:'completed' },
    { id:'V031',date:'2026-03-21 09:30',custId:'CU04',custName:'Antonio Mamani Cruz',     workId:'W03',workName:'Roberto García',  items:[{pid:'P080',name:'Control Nintendo Switch Pro',qty:1,price:88,subtotal:88},{pid:'P082',name:'Gamepad PC EasySMX X10',qty:1,price:55,subtotal:55}],                                                                              subtotal:143, discount:0,  tax:18.59,  total:161.59,  method:'efectivo',      status:'completed' },
    { id:'V032',date:'2026-03-21 13:00',custId:'CU15',custName:'Gabriela Muñoz',          workId:'W06',workName:'Carmen Villalba', items:[{pid:'P028',name:'Gimbal Zhiyun Smooth 5S',qty:1,price:148,subtotal:148},{pid:'P030',name:'SD Samsung Pro Plus 256GB',qty:1,price:45,subtotal:45},{pid:'P033',name:'Filtro ND Variable 58mm',qty:1,price:30,subtotal:30}],      subtotal:223, discount:0,  tax:28.99,  total:251.99,  method:'tarjeta',       status:'completed' },
    { id:'V033',date:'2026-03-20 10:00',custId:'CU01',custName:'Patricia Soria Mendoza',  workId:'W09',workName:'Fernando Salinas',items:[{pid:'P050',name:'Xiaomi 13T Pro 256GB',qty:1,price:440,subtotal:440},{pid:'P052',name:'Cargador 65W GaN',qty:1,price:38,subtotal:38},{pid:'P055',name:'Funda Samsung S23',qty:1,price:14,subtotal:14},{pid:'P058',name:'Pop Socket MagSafe',qty:1,price:15,subtotal:15}],subtotal:507,discount:0,tax:65.91,total:572.91,method:'tarjeta',status:'completed' },
    { id:'V034',date:'2026-03-20 14:30',custId:'CU10',custName:'Miguel Ángel Torrico',    workId:'W02',workName:'Ana López',       items:[{pid:'P065',name:'Webcam Logitech C920 HD Pro',qty:1,price:98,subtotal:98},{pid:'P063',name:'Teclado Keychron K6',qty:1,price:120,subtotal:120},{pid:'P068',name:'RAM DDR4 16GB Kingston',qty:1,price:65,subtotal:65}],          subtotal:283, discount:0,  tax:36.79,  total:319.79,  method:'tarjeta',       status:'completed' },
    { id:'V035',date:'2026-03-19 09:15',custId:'CU02',custName:'José Condori Quispe',     workId:'W03',workName:'Roberto García',  items:[{pid:'P085',name:'Router WiFi 6 TP-Link',qty:1,price:98,subtotal:98},{pid:'P091',name:'Adaptador WiFi USB',qty:2,price:20,subtotal:40},{pid:'P094',name:'Powerline TP-Link AV1000',qty:1,price:55,subtotal:55}],               subtotal:193, discount:0,  tax:25.09,  total:218.09,  method:'efectivo',      status:'completed' },
    { id:'V036',date:'2026-03-19 13:30',custId:'CU20',custName:'Consumidor Final',        workId:'W06',workName:'Carmen Villalba', items:[{pid:'P021',name:'Parlante Anker SoundCore 3',qty:2,price:62,subtotal:124},{pid:'P016',name:'TWS Xiaomi Redmi Buds 4',qty:1,price:72,subtotal:72}],                                                                              subtotal:196, discount:0,  tax:25.48,  total:221.48,  method:'efectivo',      status:'completed' },
    { id:'V037',date:'2026-03-18 10:30',custId:'CU18',custName:'Javier Mora Villca',      workId:'W09',workName:'Fernando Salinas',items:[{pid:'P037',name:'DJI Mini 4 Pro Drone',qty:1,price:920,subtotal:920},{pid:'P044',name:'Kit Carga Múltiple DJI',qty:1,price:98,subtotal:98},{pid:'P047',name:'Filtros ND DJI Mini 4 Pro',qty:2,price:55,subtotal:110}],         subtotal:1128,discount:0,  tax:146.64, total:1274.64, method:'tarjeta',       status:'completed' },
    { id:'V038',date:'2026-03-17 11:00',custId:'CU09',custName:'Ana Reyes Gutiérrez',     workId:'W02',workName:'Ana López',       items:[{pid:'P086',name:'Chromecast Google TV 4K',qty:1,price:75,subtotal:75},{pid:'P001',name:'Cable USB-C Anker',qty:2,price:15,subtotal:30},{pid:'P011',name:'Adaptador USB-C a HDMI',qty:1,price:18,subtotal:18}],                  subtotal:123, discount:0,  tax:15.99,  total:138.99,  method:'efectivo',      status:'completed' },
    { id:'V039',date:'2026-03-16 14:00',custId:'CU20',custName:'Consumidor Final',        workId:'W03',workName:'Roberto García',  items:[{pid:'P027',name:'Cámara AKASO V50 Elite 4K',qty:1,price:115,subtotal:115},{pid:'P029',name:'SD SanDisk Extreme 128GB',qty:2,price:28,subtotal:56},{pid:'P032',name:'Ring Light LED 10"',qty:1,price:38,subtotal:38}],          subtotal:209, discount:0,  tax:27.17,  total:236.17,  method:'efectivo',      status:'completed' },
    { id:'V040',date:'2026-03-15 10:00',custId:'CU03',custName:'Elena Flores Vásquez',    workId:'W06',workName:'Carmen Villalba', items:[{pid:'P061',name:'Laptop Lenovo IdeaPad 5i',qty:1,price:650,subtotal:650},{pid:'P062',name:'Mouse Logitech MX Master 3S',qty:1,price:85,subtotal:85},{pid:'P066',name:'SSD Samsung T7 1TB',qty:1,price:132,subtotal:132}],        subtotal:867, discount:10, tax:101.44, total:881.74,  method:'tarjeta',       status:'completed' },
    { id:'V041',date:'2026-03-14 09:00',custId:'CU16',custName:'Andrés Castillo Salinas', workId:'W09',workName:'Fernando Salinas',items:[{pid:'P075',name:'Auriculares Razer BlackShark V2',qty:1,price:165,subtotal:165},{pid:'P077',name:'Teclado Razer Huntsman Mini',qty:1,price:128,subtotal:128},{pid:'P073',name:'Control PS5 DualSense',qty:1,price:105,subtotal:105}],subtotal:398,discount:0, tax:51.74,  total:449.74,  method:'tarjeta',       status:'completed' },
    { id:'V042',date:'2026-03-13 13:00',custId:'CU13',custName:'Valentina Cruz Montaño',  workId:'W02',workName:'Ana López',       items:[{pid:'P022',name:'Soundbar Xiaomi 2.0 80W',qty:1,price:132,subtotal:132},{pid:'P028',name:'Gimbal Zhiyun Smooth 5S',qty:1,price:148,subtotal:148},{pid:'P034',name:'Batería NP-FZ100 Sony',qty:2,price:35,subtotal:70}],          subtotal:350, discount:5,  tax:43.23,  total:375.73,  method:'tarjeta',       status:'completed' },
  ],

  /* ---- INVENTORY MOVEMENTS ---- */
  movements: [
    { id:'MOV001',date:'2026-03-31 08:00',type:'entrada', prodId:'P037',prodName:'DJI Mini 4 Pro Drone',         qty:10,  reason:'Reposición de stock',      supId:'S04',workId:'W05',workName:'Luis Ramírez'  },
    { id:'MOV002',date:'2026-03-30 08:30',type:'entrada', prodId:'P013',prodName:'Auriculares Sony WH-1000XM5', qty:15,  reason:'Pedido mensual audio',     supId:'S02',workId:'W05',workName:'Luis Ramírez'  },
    { id:'MOV003',date:'2026-03-29 09:00',type:'entrada', prodId:'P001',prodName:'Cable USB-C Anker 240W 2m',   qty:100, reason:'Reposición de stock',      supId:'S01',workId:'W05',workName:'Luis Ramírez'  },
    { id:'MOV004',date:'2026-03-28 08:00',type:'entrada', prodId:'P025',prodName:'Cámara GoPro Hero 12 Black',  qty:8,   reason:'Pedido fotografía',        supId:'S03',workId:'W05',workName:'Luis Ramírez'  },
    { id:'MOV005',date:'2026-03-27 08:30',type:'entrada', prodId:'P049',prodName:'Samsung Galaxy S23 FE',       qty:10,  reason:'Pedido smartphones',       supId:'S05',workId:'W05',workName:'Luis Ramírez'  },
    { id:'MOV006',date:'2026-03-26 07:30',type:'entrada', prodId:'P085',prodName:'Router WiFi 6 TP-Link',       qty:20,  reason:'Reposición redes',         supId:'S08',workId:'W05',workName:'Luis Ramírez'  },
    { id:'MOV007',date:'2026-03-25 10:00',type:'salida',  prodId:'P022',prodName:'Soundbar Xiaomi 2.0 80W',     qty:3,   reason:'Producto defectuoso',      supId:null, workId:'W04',workName:'María Torres'    },
    { id:'MOV008',date:'2026-03-24 08:00',type:'entrada', prodId:'P061',prodName:'Laptop Lenovo IdeaPad 5i',    qty:8,   reason:'Pedido cómputo',           supId:'S06',workId:'W05',workName:'Luis Ramírez'  },
    { id:'MOV009',date:'2026-03-23 08:30',type:'entrada', prodId:'P073',prodName:'Control PS5 DualSense',       qty:20,  reason:'Pedido gaming',            supId:'S07',workId:'W05',workName:'Luis Ramírez'  },
    { id:'MOV010',date:'2026-03-22 09:00',type:'salida',  prodId:'P031',prodName:'Trípode GorillaPod 3K',       qty:2,   reason:'Pérdida por daño en bodega',supId:null, workId:'W04',workName:'María Torres'    },
    { id:'MOV011',date:'2026-03-21 08:00',type:'entrada', prodId:'P014',prodName:'Auriculares JBL Tune 770NC',  qty:15,  reason:'Reposición audio',         supId:'S02',workId:'W05',workName:'Luis Ramírez'  },
    { id:'MOV012',date:'2026-03-20 07:30',type:'entrada', prodId:'P086',prodName:'Chromecast Google TV 4K',     qty:20,  reason:'Pedido streaming',         supId:'S08',workId:'W05',workName:'Luis Ramírez'  },
    { id:'MOV013',date:'2026-03-19 10:00',type:'ajuste',  prodId:'P059',prodName:'Soporte Escritorio Celular',  qty:-2,  reason:'Ajuste de inventario',     supId:null, workId:'W01',workName:'Carlos Mendoza'  },
    { id:'MOV014',date:'2026-03-18 08:00',type:'entrada', prodId:'P029',prodName:'SD SanDisk Extreme 128GB',    qty:50,  reason:'Reposición memorias',      supId:'S03',workId:'W05',workName:'Luis Ramírez'  },
    { id:'MOV015',date:'2026-03-17 09:00',type:'entrada', prodId:'P052',prodName:'Cargador Rápido 65W GaN',     qty:80,  reason:'Pedido cargadores',        supId:'S05',workId:'W05',workName:'Luis Ramírez'  },
  ],

  /* ---- CONFIGURATION ---- */
  config: {
    name:             'ElectroShop',
    legalName:        'ElectroShop Distribuidora SRL',
    ruc:              '8765432',
    address:          'Av. Blanco Galindo Km 4, Local 12',
    city:             'Cochabamba',
    country:          'Bolivia',
    phone:            '+591 4-452-3456',
    mobile:           '+591 70-012-345',
    email:            'ventas@electroshop.bo',
    website:          'www.electroshop.bo',
    regime:           'Régimen General',
    iva:              13,
    currency:         'USD',
    currencySymbol:   '$',
    invoicePrefix:    'F-001',
    invoiceSeq:       43,
    quoteSeq:         11,
    receiptMsg:       '¡Gracias por elegir ElectroShop! Todos nuestros productos tienen garantía oficial.',
    invoiceFooter:    'ElectroShop · Garantía incluida · Conserve su comprobante · www.electroshop.bo',
    logo:             null,
    exchangeRate:     9.35,
    displayCurrency:  'Bs.',
    logoImg:          null,
    receiptTemplate:  'T1',
    quotationTemplate:'T1',
    whatsappCountryCode: '591',
    whatsappMsg:      'Saludos {cliente}, te escribe {usuario} de {negocio}. Adjunto tu cotización #{numero} por un total de {total}. Oferta válida hasta el {vencimiento}. ¡Estamos para servirte!',
    digitalSignKey:   'ELECTRO-SHOP-KEY-2026',
    exchangeHistory:  [
      { date:'2026-04-01', rate:9.35, setBy:'W01' },
      { date:'2026-02-24', rate:9.30, setBy:'W01' },
      { date:'2026-01-19', rate:9.28, setBy:'W01' },
    ],
    paymentMethods: [
      { id:'efectivo',      label:'Efectivo',                  icon:'fa-money-bill',       active:true,  extra:{} },
      { id:'tarjeta',       label:'Tarjeta Débito / Crédito',  icon:'fa-credit-card',      active:true,  extra:{ bank:'Banco BCP Bolivia', accountName:'ElectroShop SRL', account:'1234567890' } },
      { id:'transferencia', label:'Transferencia Bancaria',    icon:'fa-building-columns', active:true,  extra:{ bank:'Banco Bisa Bolivia', account:'100123456789', holder:'ElectroShop Distribuidora SRL' } },
      { id:'qr',            label:'QR Pago Simple',            icon:'fa-qrcode',           active:true,  extra:{ qrImage:null } },
      { id:'delivery',      label:'Delivery (cobro al retirar)',icon:'fa-motorcycle',       active:true,  extra:{} },
    ],
    pendientesConfig: { ahorros:2000, gastos:1500, facturas:800, alquiler:2500 },
  },

  /* ---- CAJA SESSIONS ---- */
  caja: {
    current: null,
    sessions: [
      { id:'CAJ001', openedAt:'2026-03-31 08:00', closedAt:'2026-03-31 20:30', workerName:'Ana López',       workerId:'W02', openAmt:500.00, closingCount:{b200:3,b100:5,b50:8,b20:10,b10:12,c5:15,c2:20,c1:30}, closingAmt:2085.00, expectedAmt:2075.50, diff:9.50,  status:'closed', notes:'Diferencia a favor' },
      { id:'CAJ002', openedAt:'2026-03-30 08:00', closedAt:'2026-03-30 20:15', workerName:'Roberto García',  workerId:'W03', openAmt:300.00, closingCount:{b200:4,b100:3,b50:6,b20:8,b10:10,c5:12,c2:15,c1:20}, closingAmt:1835.00, expectedAmt:1835.00, diff:0.00,  status:'closed', notes:'Cierre exacto'    },
      { id:'CAJ003', openedAt:'2026-03-29 08:30', closedAt:'2026-03-29 19:45', workerName:'Carmen Villalba', workerId:'W06', openAmt:400.00, closingCount:{b200:2,b100:6,b50:5,b20:9,b10:8,c5:10,c2:18,c1:25}, closingAmt:1796.00, expectedAmt:1803.75, diff:-7.75, status:'closed', notes:'Faltante en monedas' },
    ],
    nextId: 4,
  },

  /* ---- PURCHASE ORDERS ---- */
  purchases: [
    { id:'OC001', date:'2026-03-31', supId:'S04', supName:'DJI Bolivia Distribuidor Oficial',   workId:'W01', workName:'Carlos Mendoza', items:[{prodId:'P037',prodName:'DJI Mini 4 Pro Drone',qty:5,unitCost:680,sub:3400},{prodId:'P042',prodName:'Batería DJI Mini 4 Pro',qty:20,unitCost:52,sub:1040},{prodId:'P044',prodName:'Kit Carga DJI Mini 4 Pro',qty:10,unitCost:65,sub:650}],  subtotal:5090, tax:0, total:5090, status:'received', expectedDate:'2026-03-25', receivedDate:'2026-03-25', notes:'Pedido drones mensual' },
    { id:'OC002', date:'2026-03-29', supId:'S02', supName:'Audio Premium Distribuciones',       workId:'W01', workName:'Carlos Mendoza', items:[{prodId:'P013',prodName:'Sony WH-1000XM5',qty:10,unitCost:280,sub:2800},{prodId:'P014',prodName:'JBL Tune 770NC',qty:15,unitCost:85,sub:1275},{prodId:'P017',prodName:'Parlante JBL Charge 5',qty:12,unitCost:95,sub:1140}],           subtotal:5215, tax:0, total:5215, status:'received', expectedDate:'2026-04-01', receivedDate:'2026-04-01', notes:'Pedido audio premium' },
    { id:'OC003', date:'2026-03-27', supId:'S06', supName:'CompuImport Periféricos Bolivia',    workId:'W01', workName:'Carlos Mendoza', items:[{prodId:'P061',prodName:'Laptop Lenovo IdeaPad 5i',qty:5,unitCost:480,sub:2400},{prodId:'P062',prodName:'Mouse Logitech MX Master 3S',qty:20,unitCost:55,sub:1100},{prodId:'P063',prodName:'Teclado Keychron K6',qty:10,unitCost:78,sub:780}],subtotal:4280, tax:0, total:4280, status:'received', expectedDate:'2026-03-30', receivedDate:'2026-03-30', notes:'Pedido cómputo y periféricos' },
    { id:'OC004', date:'2026-03-24', supId:'S01', supName:'CablesTech Bolivia Importaciones',   workId:'W01', workName:'Carlos Mendoza', items:[{prodId:'P001',prodName:'Cable USB-C Anker 240W',qty:100,unitCost:8,sub:800},{prodId:'P002',prodName:'Cable HDMI 4K Ugreen',qty:80,unitCost:7,sub:560},{prodId:'P004',prodName:'Hub USB-C 7 en 1 Anker',qty:30,unitCost:22,sub:660}],    subtotal:2020, tax:0, total:2020, status:'received', expectedDate:'2026-03-27', receivedDate:'2026-03-27', notes:'Reposición cables y hubs' },
    { id:'OC005', date:'2026-04-01', supId:'S03', supName:'FotoVideo Import Bolivia',           workId:'W01', workName:'Carlos Mendoza', items:[{prodId:'P025',prodName:'Cámara GoPro Hero 12 Black',qty:5,unitCost:320,sub:1600},{prodId:'P029',prodName:'SD SanDisk Extreme 128GB',qty:40,unitCost:18,sub:720},{prodId:'P035',prodName:'Bolso Lowepro BP 250 II',qty:8,unitCost:48,sub:384}], subtotal:2704, tax:0, total:2704, status:'pending',  expectedDate:'2026-03-28', receivedDate:null,         notes:'Urgente — reponer cámaras y accesorios' },
  ],

  /* ---- RETURNS ---- */
  returns: [
    { id:'DEV001', date:'2026-03-30 11:30', saleId:'V003', custId:'CU08', custName:'Carlos Jiménez Terán',   workId:'W02', workName:'Ana López',       items:[{prodId:'P013',prodName:'Auriculares Sony WH-1000XM5',qty:1,price:385,sub:385,reason:'Producto defectuoso — falla en driver izquierdo'}], total:385, refundMethod:'tarjeta', restock:false, status:'processed', notes:'Se envía a garantía con el proveedor' },
    { id:'DEV002', date:'2026-03-27 14:20', saleId:'V008', custId:'CU13', custName:'Valentina Cruz Montaño', workId:'W03', workName:'Roberto García',  items:[{prodId:'P014',prodName:'Auriculares JBL Tune 770NC',qty:1,price:128,sub:128,reason:'Color incorrecto — cliente pidió negro, se entregó blanco'}], total:128, refundMethod:'tarjeta', restock:true,  status:'processed', notes:'Se devuelve a stock, sin uso' },
    { id:'DEV003', date:'2026-03-24 10:00', saleId:'V015', custId:'CU20', custName:'Consumidor Final',        workId:'W06', workName:'Carmen Villalba', items:[{prodId:'P086',prodName:'Chromecast Google TV 4K',qty:1,price:75,sub:75,reason:'Incompatible con modelo de TV antiguo'}],                     total:75,  refundMethod:'efectivo', restock:true,  status:'processed', notes:'Producto en perfectas condiciones, vuelve a stock' },
  ],

  /* ---- QUOTATIONS ---- */
  quotations: [
    {
      id:'Q001', number:'COT-00001', clientId:'CU03',
      clientData:{ name:'Elena Flores Vásquez', ci:'5432109', phone:'+591 72-333-444', email:'eflores@hotmail.com' },
      items:[
        { productId:'P038', name:'DJI Air 3 Combo Fly More',      qty:1, unitPrice:1380, discount:0,  subtotal:1380 },
        { productId:'P042', name:'Batería Inteligente DJI Mini 4', qty:3, unitPrice:82,   discount:0,  subtotal:246  },
        { productId:'P047', name:'Filtros ND DJI Mini 4 Pro x4',  qty:2, unitPrice:55,   discount:0,  subtotal:110  },
      ],
      globalDiscount:0, subtotal:1736, discountAmount:0, total:1736, totalBs:16231.60, exchangeRate:9.35, currency:'Bs.',
      validDays:15, validUntil:'2026-04-07', notes:'Precio especial por compra de combo completo',
      status:'pending', createdAt:'2026-04-01T09:00:00', createdBy:'W01', template:'T1', qrHash:'a1b2c3d4e5f6',
    },
    {
      id:'Q002', number:'COT-00002', clientId:'CU08',
      clientData:{ name:'Carlos Jiménez Terán', ci:'9087654', phone:'+591 77-888-999', email:'cjimenez@gmail.com' },
      items:[
        { productId:'P026', name:'Cámara Sony ZV-E10 Mirrorless Kit', qty:1, unitPrice:780, discount:5, subtotal:741 },
        { productId:'P030', name:'SD Samsung Pro Plus 256GB',          qty:2, unitPrice:45,  discount:0, subtotal:90  },
        { productId:'P034', name:'Batería NP-FZ100 para Sony',         qty:2, unitPrice:35,  discount:0, subtotal:70  },
      ],
      globalDiscount:0, subtotal:901, discountAmount:0, total:901, totalBs:8424.35, exchangeRate:9.35, currency:'Bs.',
      validDays:7, validUntil:'2026-03-27', notes:'',
      status:'accepted', createdAt:'2026-03-29T10:30:00', createdBy:'W01', template:'T1', qrHash:'b2c3d4e5f6g7',
    },
    {
      id:'Q003', number:'COT-00003', clientId:'CU11',
      clientData:{ name:'Laura Romero Ibáñez', ci:'6054321', phone:'+591 61-223-334', email:'lromero@hotmail.com' },
      items:[
        { productId:'P061', name:'Laptop Lenovo IdeaPad 5i Core i5', qty:1, unitPrice:650, discount:0, subtotal:650 },
        { productId:'P062', name:'Mouse Logitech MX Master 3S',       qty:1, unitPrice:85,  discount:0, subtotal:85  },
        { productId:'P063', name:'Teclado Mecánico Keychron K6',       qty:1, unitPrice:120, discount:0, subtotal:120 },
        { productId:'P070', name:'Stand Ventilado para Laptop',        qty:1, unitPrice:38,  discount:0, subtotal:38  },
      ],
      globalDiscount:5, subtotal:893, discountAmount:44.65, total:848.35, totalBs:7931.87, exchangeRate:9.35, currency:'Bs.',
      validDays:30, validUntil:'2026-04-22', notes:'Setup completo para home office',
      status:'pending', createdAt:'2026-03-31T11:00:00', createdBy:'W01', template:'T1', qrHash:'c3d4e5f6g7h8',
    },
    {
      id:'Q004', number:'COT-00004', clientId:'CU18',
      clientData:{ name:'Javier Mora Villca', ci:'8887654', phone:'+591 68-900-011', email:'jmora@hotmail.com' },
      items:[
        { productId:'P037', name:'DJI Mini 4 Pro Drone 4K',        qty:1, unitPrice:920, discount:0, subtotal:920 },
        { productId:'P042', name:'Batería Inteligente DJI Mini 4',  qty:3, unitPrice:82,  discount:0, subtotal:246 },
        { productId:'P044', name:'Kit de Carga Múltiple DJI Mini 4',qty:1, unitPrice:98,  discount:0, subtotal:98  },
      ],
      globalDiscount:0, subtotal:1264, discountAmount:0, total:1264, totalBs:11818.40, exchangeRate:9.35, currency:'Bs.',
      validDays:7, validUntil:'2026-03-28', notes:'',
      status:'pending', createdAt:'2026-03-30T14:00:00', createdBy:'W02', template:'T1', qrHash:'d4e5f6g7h8i9',
    },
    {
      id:'Q005', number:'COT-00005', clientId:'CU05',
      clientData:{ name:'Sofía Rojas Alvarado', ci:'3210987', phone:'+591 74-555-666', email:'srojas@gmail.com' },
      items:[
        { productId:'P013', name:'Auriculares Sony WH-1000XM5', qty:2, unitPrice:385, discount:10, subtotal:693 },
        { productId:'P017', name:'Parlante JBL Charge 5',        qty:1, unitPrice:148, discount:0,  subtotal:148 },
      ],
      globalDiscount:0, subtotal:841, discountAmount:0, total:841, totalBs:7863.35, exchangeRate:9.35, currency:'Bs.',
      validDays:7, validUntil:'2026-03-31', notes:'Cliente solicita precio mayorista',
      status:'rejected', createdAt:'2026-03-24T09:30:00', createdBy:'W02', template:'T1', qrHash:'e5f6g7h8i9j0',
    },
    {
      id:'Q006', number:'COT-00006', clientId:'CU13',
      clientData:{ name:'Valentina Cruz Montaño', ci:'4032109', phone:'+591 63-445-556', email:'vcruz@gmail.com' },
      items:[
        { productId:'P073', name:'Control PS5 DualSense Blanco',       qty:2, unitPrice:105, discount:0, subtotal:210 },
        { productId:'P075', name:'Auriculares Razer BlackShark V2 Pro', qty:1, unitPrice:165, discount:0, subtotal:165 },
        { productId:'P077', name:'Teclado Razer Huntsman Mini',         qty:1, unitPrice:128, discount:0, subtotal:128 },
      ],
      globalDiscount:0, subtotal:503, discountAmount:0, total:503, totalBs:4703.05, exchangeRate:9.35, currency:'Bs.',
      validDays:7, validUntil:'2026-03-17', notes:'Setup gaming completo',
      status:'expired', createdAt:'2026-03-01T10:00:00', createdBy:'W01', template:'T1', qrHash:'f6g7h8i9j0k1',
    },
    {
      id:'Q007', number:'COT-00007', clientId:null,
      clientData:{ name:'Empresa Tecno SRL', ci:'12345678', phone:'+591 70-999-888', email:'compras@tecnosrl.com' },
      items:[
        { productId:'P085', name:'Router WiFi 6 TP-Link AX3000',    qty:3, unitPrice:98,  discount:0, subtotal:294 },
        { productId:'P088', name:'Repetidor WiFi TP-Link RE705X',    qty:3, unitPrice:60,  discount:0, subtotal:180 },
        { productId:'P090', name:'Router Mesh TP-Link Deco XE75 x2', qty:1, unitPrice:218, discount:0, subtotal:218 },
      ],
      globalDiscount:5, subtotal:692, discountAmount:34.60, total:657.40, totalBs:6146.69, exchangeRate:9.35, currency:'Bs.',
      validDays:15, validUntil:'2026-04-06', notes:'Cotización para red empresarial — 3 pisos',
      status:'pending', createdAt:'2026-03-31T16:00:00', createdBy:'W01', template:'T2', qrHash:'g7h8i9j0k1l2',
    },
    {
      id:'Q008', number:'COT-00008', clientId:'CU01',
      clientData:{ name:'Patricia Soria Mendoza', ci:'7654321', phone:'+591 70-111-222', email:'patricia.soria@gmail.com' },
      items:[
        { productId:'P025', name:'Cámara GoPro Hero 12 Black',    qty:1, unitPrice:428, discount:0, subtotal:428 },
        { productId:'P029', name:'SD SanDisk Extreme 128GB V30',  qty:2, unitPrice:28,  discount:0, subtotal:56  },
        { productId:'P036', name:'Control Remoto Wi-Fi GoPro 12', qty:1, unitPrice:40,  discount:0, subtotal:40  },
      ],
      globalDiscount:0, subtotal:524, discountAmount:0, total:524, totalBs:4899.40, exchangeRate:9.35, currency:'Bs.',
      validDays:7, validUntil:'2026-03-25', notes:'',
      status:'accepted', createdAt:'2026-03-27T11:00:00', createdBy:'W02', template:'T1', qrHash:'h8i9j0k1l2m3',
    },
    {
      id:'Q009', number:'COT-00009', clientId:'CU15',
      clientData:{ name:'Gabriela Muñoz Salvatierra', ci:'2010987', phone:'+591 65-667-778', email:'gmunoz@outlook.com' },
      items:[
        { productId:'P086', name:'Chromecast con Google TV 4K',    qty:2, unitPrice:75,  discount:0, subtotal:150 },
        { productId:'P087', name:'Amazon Fire TV Stick 4K Max',    qty:2, unitPrice:70,  discount:0, subtotal:140 },
        { productId:'P090', name:'Router Mesh TP-Link Deco XE75',  qty:1, unitPrice:218, discount:0, subtotal:218 },
      ],
      globalDiscount:0, subtotal:508, discountAmount:0, total:508, totalBs:4749.80, exchangeRate:9.35, currency:'Bs.',
      validDays:15, validUntil:'2026-04-07', notes:'Setup streaming para apartamento nuevo',
      status:'pending', createdAt:'2026-04-01T08:30:00', createdBy:'W02', template:'T1', qrHash:'i9j0k1l2m3n4',
    },
    {
      id:'Q010', number:'COT-00010', clientId:'CU06',
      clientData:{ name:'Pedro Vargas Palacios', ci:'2109876', phone:'+591 75-666-777', email:'pvargas@outlook.com' },
      items:[
        { productId:'P061', name:'Laptop Lenovo IdeaPad 5i Core i5', qty:1, unitPrice:650, discount:0, subtotal:650 },
        { productId:'P064', name:'Monitor LG 27" IPS 144Hz FHD',     qty:1, unitPrice:320, discount:0, subtotal:320 },
        { productId:'P067', name:'SSD Interno Kingston NV2 1TB',      qty:1, unitPrice:82,  discount:0, subtotal:82  },
      ],
      globalDiscount:10, subtotal:1052, discountAmount:105.20, total:946.80, totalBs:8852.58, exchangeRate:9.35, currency:'Bs.',
      validDays:30, validUntil:'2026-04-22', notes:'Upgrade completo workstation',
      status:'pending', createdAt:'2026-03-30T15:30:00', createdBy:'W01', template:'T1', qrHash:'j0k1l2m3n4o5',
    },
  ],

  /* ---- PENDIENTES (distribución de ganancias) ---- */
  pendientes: {
    config: { ahorros:2000, gastos:1500, facturas:800, alquiler:2500 },
    history: [
      { id:'PD001', period:'2026-03', label:'Marzo 2026',    grossIncome:0,        ahorros:2000, gastos:1500, facturas:800, alquiler:2500, totalFixed:6800, sobrante:0,        notes:'',                              closedAt:null           },
      { id:'PD002', period:'2026-02', label:'Febrero 2026',  grossIncome:42850.00, ahorros:2000, gastos:1500, facturas:800, alquiler:2500, totalFixed:6800, sobrante:36050.00, notes:'Buen mes — alto en drones y cómputo', closedAt:'2026-03-01' },
      { id:'PD003', period:'2026-01', label:'Enero 2026',    grossIncome:38200.00, ahorros:2000, gastos:1500, facturas:800, alquiler:2500, totalFixed:6800, sobrante:31400.00, notes:'',                              closedAt:'2026-02-01'   },
    ],
  },

  /* ---- ROLES ---- */
  roles: [
    {
      id:'ROL01', name:'Administrador', description:'Acceso total al sistema', color:'#3b82f6', isSystem:true,
      permissions:{
        dashboard:{read:true,create:false,edit:false,delete:false}, pos:{read:true,create:true,edit:false,delete:false},
        caja:{read:true,create:true,edit:false,delete:false}, products:{read:true,create:true,edit:true,delete:true},
        inventory:{read:true,create:false,edit:true,delete:false}, categories:{read:true,create:true,edit:true,delete:true},
        workers:{read:true,create:true,edit:true,delete:true}, customers:{read:true,create:true,edit:true,delete:true},
        suppliers:{read:true,create:true,edit:true,delete:true}, purchases:{read:true,create:true,edit:true,delete:true},
        sales:{read:true,create:false,edit:false,delete:false}, returns:{read:true,create:true,edit:false,delete:false},
        reports:{read:true,create:false,edit:false,delete:false}, quotations:{read:true,create:true,edit:true,delete:true},
        pendientes:{read:true,create:false,edit:true,delete:false}, roles:{read:true,create:true,edit:true,delete:true},
        config:{read:true,create:false,edit:true,delete:false},
      },
    },
    {
      id:'ROL02', name:'Cajero/a', description:'POS, ventas, clientes y cotizaciones', color:'#10b981', isSystem:true,
      permissions:{
        dashboard:{read:true,create:false,edit:false,delete:false}, pos:{read:true,create:true,edit:false,delete:false},
        caja:{read:true,create:true,edit:false,delete:false}, products:{read:true,create:false,edit:false,delete:false},
        inventory:{read:true,create:false,edit:false,delete:false}, categories:{read:true,create:false,edit:false,delete:false},
        workers:{read:false,create:false,edit:false,delete:false}, customers:{read:true,create:true,edit:true,delete:false},
        suppliers:{read:false,create:false,edit:false,delete:false}, purchases:{read:false,create:false,edit:false,delete:false},
        sales:{read:true,create:false,edit:false,delete:false}, returns:{read:true,create:true,edit:false,delete:false},
        reports:{read:false,create:false,edit:false,delete:false}, quotations:{read:true,create:true,edit:true,delete:false},
        pendientes:{read:false,create:false,edit:false,delete:false}, roles:{read:false,create:false,edit:false,delete:false},
        config:{read:false,create:false,edit:false,delete:false},
      },
    },
    {
      id:'ROL03', name:'Supervisor/a', description:'Acceso total excepto roles y configuración', color:'#8b5cf6', isSystem:true,
      permissions:{
        dashboard:{read:true,create:false,edit:false,delete:false}, pos:{read:true,create:true,edit:false,delete:false},
        caja:{read:true,create:true,edit:false,delete:false}, products:{read:true,create:true,edit:true,delete:false},
        inventory:{read:true,create:false,edit:true,delete:false}, categories:{read:true,create:true,edit:true,delete:false},
        workers:{read:true,create:false,edit:true,delete:false}, customers:{read:true,create:true,edit:true,delete:false},
        suppliers:{read:true,create:true,edit:true,delete:false}, purchases:{read:true,create:true,edit:true,delete:false},
        sales:{read:true,create:false,edit:false,delete:false}, returns:{read:true,create:true,edit:false,delete:false},
        reports:{read:true,create:false,edit:false,delete:false}, quotations:{read:true,create:true,edit:true,delete:false},
        pendientes:{read:true,create:false,edit:true,delete:false}, roles:{read:false,create:false,edit:false,delete:false},
        config:{read:true,create:false,edit:false,delete:false},
      },
    },
    {
      id:'ROL04', name:'Operativo', description:'Bodega, inventario y asistencia', color:'#f59e0b', isSystem:false,
      permissions:{
        dashboard:{read:true,create:false,edit:false,delete:false}, pos:{read:false,create:false,edit:false,delete:false},
        caja:{read:false,create:false,edit:false,delete:false}, products:{read:true,create:false,edit:false,delete:false},
        inventory:{read:true,create:false,edit:true,delete:false}, categories:{read:true,create:false,edit:false,delete:false},
        workers:{read:false,create:false,edit:false,delete:false}, customers:{read:false,create:false,edit:false,delete:false},
        suppliers:{read:true,create:false,edit:false,delete:false}, purchases:{read:true,create:true,edit:false,delete:false},
        sales:{read:false,create:false,edit:false,delete:false}, returns:{read:true,create:false,edit:false,delete:false},
        reports:{read:false,create:false,edit:false,delete:false}, quotations:{read:false,create:false,edit:false,delete:false},
        pendientes:{read:false,create:false,edit:false,delete:false}, roles:{read:false,create:false,edit:false,delete:false},
        config:{read:false,create:false,edit:false,delete:false},
      },
    },
    {
      id:'ROL05', name:'Contabilidad', description:'Reportes, finanzas y análisis', color:'#06b6d4', isSystem:false,
      permissions:{
        dashboard:{read:true,create:false,edit:false,delete:false}, pos:{read:false,create:false,edit:false,delete:false},
        caja:{read:true,create:false,edit:false,delete:false}, products:{read:true,create:false,edit:false,delete:false},
        inventory:{read:true,create:false,edit:false,delete:false}, categories:{read:true,create:false,edit:false,delete:false},
        workers:{read:true,create:false,edit:false,delete:false}, customers:{read:true,create:false,edit:false,delete:false},
        suppliers:{read:true,create:false,edit:false,delete:false}, purchases:{read:true,create:false,edit:false,delete:false},
        sales:{read:true,create:false,edit:false,delete:false}, returns:{read:true,create:false,edit:false,delete:false},
        reports:{read:true,create:false,edit:false,delete:false}, quotations:{read:true,create:false,edit:false,delete:false},
        pendientes:{read:true,create:false,edit:true,delete:false}, roles:{read:false,create:false,edit:false,delete:false},
        config:{read:true,create:false,edit:false,delete:false},
      },
    },
  ],

  /* ---- NEXT IDs ---- */
  nextSaleId:      43,
  nextProductId:   97,
  nextCategoryId:  9,
  nextWorkerId:    11,
  nextCustomerId:  21,
  nextSupplierId:  9,
  nextMovId:       16,
  nextPurchaseId:  6,
  nextReturnId:    4,
  nextQuoteId:     11,
};

/* ---- Helpers ---- */
DB.getCat      = id => DB.categories.find(c => c.id === id);
DB.getProd     = id => DB.products.find(p => p.id === id);
DB.getWorker   = id => DB.workers.find(w => w.id === id);
DB.getCustomer = id => DB.customers.find(c => c.id === id);
DB.getSupplier = id => DB.suppliers.find(s => s.id === id);
DB.getRole     = id => DB.roles.find(r => r.id === id);
DB.getCatCssClass = catId => 'cat-' + catId.toLowerCase();

/* ---- localStorage persistence ---- */
(function() {
  try {
    const saved = localStorage.getItem('es_config');
    if (saved) Object.assign(DB.config, JSON.parse(saved));
  } catch(e) {}
})();
