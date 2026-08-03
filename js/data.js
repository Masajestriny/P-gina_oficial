// ============================================================
//  TRINY MASAJES — Data Module
//  Using 100% local images from /img directory + PICSUM fallback
// ============================================================

const LOCAL_IMAGES = [
  'img/481167345_3881105415472060_5563772965849036966_n.jpg',
  'img/488873475_3916229425292992_1209196953871246027_n.jpg',
  'img/489702665_3919203694995565_8483964575785664527_n.jpg',
  'img/490901552_3929261660656435_3995812252580009694_n.jpg',
  'img/491791637_3930027970579804_1729639323855883877_n.jpg',
  'img/491848418_3929920933923841_6637045350661252133_n.jpg',
  'img/494072324_3943036845945583_4337052228856049629_n.jpg'
];

const getLocalImg = (idx) => LOCAL_IMAGES[idx % LOCAL_IMAGES.length];
const PICSUM = (seed, w=600, h=450) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

// ── Services Data ──
window.SERVICES_DATA = [
  { id:1,  category:'relajacion',    name:'Masaje Relajante',             icon:'🌿', duration:'60 min', price:'S/ 70',  priceNum:70,  img: getLocalImg(0), desc:'Técnicas suaves que liberan tensiones acumuladas. Ideal para desconectarte del estrés diario.', benefits:['Reduce estrés y ansiedad','Mejora calidad del sueño','Alivia tensiones musculares','Promueve la relajación profunda'] },
  { id:2,  category:'terapeutico',   name:'Masaje Descontracturante',    icon:'💪', duration:'60 min', price:'S/ 85',  priceNum:85,  img: getLocalImg(1), desc:'Trabaja en profundidad los nódulos de tensión y contracturas musculares crónicas.', benefits:['Elimina contracturas musculares','Aumenta la flexibilidad','Reduce dolor muscular','Mejora movilidad articular'] },
  { id:21, category:'maderoterapia', name:'Masaje Maderoterapia Corporal',icon:'🪵', duration:'75 min', price:'S/ 110', priceNum:110, img: getLocalImg(2), desc:'Técnica holística intensiva con utensilios anatómicos de madera para moldear, drenar y reafirmar la piel.', benefits:['Elimina grasa localizada','Remodela el contorno corporal','Combate la celulitis','Efecto reafirmante inmediato','Estimula la linfa'] },
  { id:22, category:'maderoterapia', name:'Maderoterapia Facial (Anti-Aging)',icon:'🪵',duration:'45 min',price:'S/ 85', priceNum:85,  img: getLocalImg(3), desc:'Tratamiento facial con elementos de madera natural para tonificar musculatura facial y drenar el rostro.', benefits:['Reafirma contorno facial','Estimula colágeno y elastina','Efecto lifting natural','Reduce papada y arrugas'] },
  { id:23, category:'oriental',      name:'Masaje Shiatsu Tradicional',   icon:'☯️', duration:'75 min', price:'S/ 120', priceNum:120, img: getLocalImg(4), desc:'Terapia japonesa milenaria basada en la presión con dedos y palmas en puntos meridianos de energía vital (Qi).', benefits:['Equilibra la energía corporal','Alivia dolores crónicos','Mejora digestión y respiración','Elimina bloqueos emocionales'] },
  { id:8,  category:'reflexologia',  name:'Reflexología Podal & Holística',icon:'🦶', duration:'50 min', price:'S/ 75',  priceNum:75,  img: getLocalImg(5), desc:'Estimulación de puntos reflejos específicos en pies y manos correspondientes a los órganos vitales.', benefits:['Equilibra el organismo integral','Estimula órganos internos','Activa la circulación','Deep relaxation'] },
  { id:3,  category:'terapeutico',   name:'Masaje Deportivo',            icon:'🏃', duration:'75 min', price:'S/ 95',  priceNum:95,  img: getLocalImg(6), desc:'Diseñado para atletas y personas activas. Optimiza el rendimiento y acelera la recuperación.', benefits:['Acelera recuperación muscular','Previene lesiones deportivas','Aumenta rendimiento'] },
  { id:4,  category:'estetico',      name:'Masaje Reductor',             icon:'✨', duration:'90 min', price:'S/ 110', priceNum:110, img: getLocalImg(0), desc:'Técnicas modeladoras que activan el metabolismo y favorecen la reducción de medidas.', benefits:['Activa metabolismo','Reduce medidas corporales','Elimina toxinas'] },
  { id:5,  category:'terapeutico',   name:'Drenaje Linfático',           icon:'💧', duration:'75 min', price:'S/ 100', priceNum:100, img: getLocalImg(1), desc:'Técnica suave que estimula el sistema linfático, eliminando líquidos y toxinas del cuerpo.', benefits:['Elimina retención de líquidos','Reduce inflamaciones','Fortalece defensas'] },
  { id:6,  category:'especial',      name:'Masaje Prenatal',             icon:'🤰', duration:'60 min', price:'S/ 90',  priceNum:90,  img: getLocalImg(2), desc:'Técnicas especialmente adaptadas para embarazadas, aliviando molestias del embarazo de forma segura.', benefits:['Alivia dolor lumbar','Reduce edemas','Disminuye ansiedad'] },
  { id:7,  category:'terapeutico',   name:'Masaje Terapéutico',          icon:'🏥', duration:'60 min', price:'S/ 85',  priceNum:85,  img: getLocalImg(3), desc:'Enfocado en el tratamiento de dolencias específicas, trabajando con técnicas clínicas especializadas.', benefits:['Trata dolores crónicos','Mejora movilidad','Alivio focalizado'] },
  { id:9,  category:'especial',      name:'Masaje con Piedras Calientes',icon:'🪨', duration:'90 min', price:'S/ 120', priceNum:120, img: getLocalImg(4), desc:'Piedras volcánicas a temperatura terapéutica que penetran el calor profundamente en los músculos.', benefits:['Relajación muscular profunda','Mejora circulación','Elimina toxinas'] },
  { id:10, category:'especial',      name:'Aromaterapia',                icon:'🌺', duration:'75 min', price:'S/ 95',  priceNum:95,  img: getLocalImg(5), desc:'Masaje combinado con aceites esenciales puros seleccionados según tus necesidades.', benefits:['Equilibra estado de ánimo','Reduce ansiedad y estrés','Armoniza mente'] },
  { id:11, category:'estetico',      name:'Masaje Anticelulítico',       icon:'💫', duration:'60 min', price:'S/ 100', priceNum:100, img: getLocalImg(6), desc:'Técnicas especiales que atacan la celulitis, mejorando la textura y firmeza de la piel.', benefits:['Reduce la celulitis','Mejora textura de piel','Activa circulación'] },
  { id:12, category:'estetico',      name:'Masaje Modelador',            icon:'⭐', duration:'90 min', price:'S/ 115', priceNum:115, img: getLocalImg(0), desc:'Tratamiento corporal integral que esculpe y modela la figura a través de técnicas específicas.', benefits:['Modela la figura','Reduce contornos','Afirma la piel'] },
  { id:13, category:'estetico',      name:'Masaje Facial',               icon:'😊', duration:'45 min', price:'S/ 75',  priceNum:75,  img: getLocalImg(1), desc:'Tratamiento facial rejuvenecedor que mejora la circulación, reduce tensiones faciales y revitaliza.', benefits:['Rejuvenece la piel','Reduce arrugas finas','Tonifica músculos'] },
  { id:14, category:'estetico',      name:'Limpieza Facial',             icon:'🧖', duration:'60 min', price:'S/ 85',  priceNum:85,  img: getLocalImg(2), desc:'Limpieza profunda con extracción de impurezas y aplicación de tratamientos hidratantes.', benefits:['Elimina impurezas','Hidrata profundamente','Previene acné'] },
  { id:15, category:'estetico',      name:'Exfoliación Corporal',        icon:'🫧', duration:'60 min', price:'S/ 90',  priceNum:90,  img: getLocalImg(3), desc:'Eliminación de células muertas con productos naturales, dejando la piel suave y luminosa.', benefits:['Elimina células muertas','Suaviza la piel','Estimula regeneración'] },
  { id:16, category:'especial',      name:'Spa para Parejas',            icon:'💑', duration:'120 min',price:'S/ 220',priceNum:220, img: getLocalImg(4), desc:'Experiencia mágica compartida con sesión de masaje simultáneo, aromaterapia y champagne.', benefits:['Experiencia compartida','Ambiente romántico','Tratamiento de lujo'] },
  { id:17, category:'relajacion',    name:'Masaje Antiestrés',           icon:'🧘', duration:'60 min', price:'S/ 80',  priceNum:80,  img: getLocalImg(5), desc:'Protocolo especial diseñado para combatir el estrés moderno con técnicas orientales y occidentales.', benefits:['Elimina el estrés','Libera endorfinas','Recupera la energía'] },
  { id:18, category:'terapeutico',   name:'Masaje Cervical',             icon:'🦴', duration:'30 min', price:'S/ 50',  priceNum:50,  img: getLocalImg(6), desc:'Trabajo específico en zona cervical y trapecios, ideal para trabajadores de escritorio.', benefits:['Alivia dolor cervical','Reduce cefaleas tensionales'] },
  { id:19, category:'terapeutico',   name:'Masaje Lumbar',               icon:'🏋️', duration:'30 min', price:'S/ 50',  priceNum:50,  img: getLocalImg(0), desc:'Tratamiento especializado en la zona lumbar para aliviar dolor de espalda baja.', benefits:['Alivia dolor lumbar','Reduce tensión muscular'] },
  { id:20, category:'relajacion',    name:'Masaje Piernas Cansadas',     icon:'🦵', duration:'45 min', price:'S/ 65',  priceNum:65,  img: getLocalImg(1), desc:'Técnicas específicas para mejorar la circulación y aliviar la sensación de pesadez.', benefits:['Alivia pesadez en piernas','Mejora circulación'] },
];

// ── Products Data ──
window.PRODUCTS_DATA = [
  { id:1, category:'aceites', name:'Aceite Esencial de Lavanda', desc:'100% puro, relajante y soporífero. Ideal para masajes y difusor.', price:45, priceLabel:'S/ 45', img: getLocalImg(0), tag:'Popular' },
  { id:2, category:'aceites', name:'Aceite de Almendras Dulces', desc:'Hidratante y suavizante. Perfecto como aceite base para masajes.', price:35, priceLabel:'S/ 35', img: getLocalImg(1), tag:'' },
  { id:3, category:'aceites', name:'Aceite de Argán Premium',    desc:'Oro líquido marroquí. Antiedad y nutritivo para piel y cabello.', price:65, priceLabel:'S/ 65', img: getLocalImg(2), tag:'Premium' },
  { id:4, category:'cremas',  name:'Crema Reductora Corporal',   desc:'Fórmula potente con cafeína y guaraná. Reduce medidas visiblemente.', price:55, priceLabel:'S/ 55', img: getLocalImg(3), tag:'Oferta' },
  { id:5, category:'cremas',  name:'Crema Hidratante Natural',   desc:'Con manteca de karité y aloe vera. 72h de hidratación intensa.', price:40, priceLabel:'S/ 40', img: getLocalImg(4), tag:'' },
  { id:6, category:'cremas',  name:'Crema Anticelulítica',       desc:'Con extracto de centella asiática y cafeína. Uso diario.', price:60, priceLabel:'S/ 60', img: getLocalImg(5), tag:'Popular' },
  { id:7, category:'sales',   name:'Sales de Baño Himalaya',     desc:'Minerales esenciales para relajar el cuerpo y revitalizar la piel.', price:30, priceLabel:'S/ 30', img: getLocalImg(6), tag:'' },
  { id:8, category:'sales',   name:'Exfoliante de Café y Coco',  desc:'Elimina células muertas y activa la circulación naturalmente.', price:35, priceLabel:'S/ 35', img: getLocalImg(0), tag:'Natural' },
  { id:9, category:'aromaterapia', name:'Difusor Ultrasónico',   desc:'Difusor de aroma con luces LED multicolor. 400ml de capacidad.', price:89, priceLabel:'S/ 89', img: getLocalImg(1), tag:'Premium' },
  { id:10, category:'aromaterapia', name:'Kit Aromaterapia Zen', desc:'Set de 6 aceites esenciales en caja de regalo.', price:125, priceLabel:'S/ 125', img: getLocalImg(2), tag:'Gift' },
  { id:11, category:'aromaterapia', name:'Velas de Soya Aromatizadas', desc:'100% soya natural. Perfume suave y duradero.', price:28, priceLabel:'S/ 28', img: getLocalImg(3), tag:'' },
  { id:12, category:'aceites', name:'Aceite de Rosa Mosqueta',   desc:'Regenerador y antiedad. Ideal para manchas y arrugas.', price:55, priceLabel:'S/ 55', img: getLocalImg(4), tag:'Anti-aging' },
];

// ── Promotions Data ──
window.PROMOS_DATA = [
  { id:1, name:'Pack Relajación Total', icon:'🧘', discount:'30%', featured:true, includes:['Masaje Relajante 60 min','Aromaterapia premium','Exfoliación corporal','Copa de té de hierbas'], priceNew:'S/ 180', priceOld:'S/ 260', desc:'La experiencia spa completa que necesitas' },
  { id:2, name:'Pack Detox & Maderoterapia', icon:'🪵', discount:'25%', featured:false, includes:['Maderoterapia Corporal 75 min','Drenaje linfático','Wrap detox','Té quemador'], priceNew:'S/ 210', priceOld:'S/ 280', desc:'Reducción y remodelación intensiva' },
  { id:3, name:'Pack Amor en Pareja', icon:'💑', discount:'20%', featured:false, includes:['Spa para parejas 2h','Masaje relajante simultáneo','Aromaterapia para dos','Champagne de bienvenida'], priceNew:'S/ 320', priceOld:'S/ 400', desc:'La experiencia romántica perfecta' },
  { id:4, name:'Pack Shiatsu & Equilibre', icon:'☯️', discount:'20%', featured:false, includes:['Masaje Shiatsu 75 min','Reflexología podal','Sesión de aromaterapia oriental'], priceNew:'S/ 195', priceOld:'S/ 245', desc:'Armonía energética oriental' },
];

window.CUPONES_DATA = [
  { code:'TRINY10', desc:'10% de descuento en tu primera visita', expires:'Válido todo agosto 2026' },
  { code:'MADERO20', desc:'20% en Maderoterapia corporal', expires:'Lunes a jueves' },
  { code:'SHIATSU15', desc:'15% en Masaje Shiatsu Tradicional', expires:'Promoción especial' },
  { code:'PAREJA30', desc:'30% en Spa para Parejas — martes y miércoles', expires:'Mar-Mié solamente' },
];

// ── TrinyPoints Loyalty Rewards Program ──
window.TRINY_POINTS_NAME = "Puntos TrinyBienestar";
window.TRINY_POINTS_REWARDS = [
  { points: 50,  reward: "Aromaterapia Esencial Gratis en tu próxima cita", icon: "🌺" },
  { points: 100, reward: "Descuento de S/ 25 en cualquier servicio", icon: "🎟️" },
  { points: 150, reward: "Sesión de Maderoterapia Facial Gratis (45 min)", icon: "🪵" },
  { points: 250, reward: "Masaje Relajante o Shiatsu 60 min GRATIS", icon: "🎁" },
];

// ── Gallery Data ──
window.GALLERY_DATA = LOCAL_IMAGES.map((src, i) => ({
  id: i+1,
  src,
  alt: `Triny Masajes — imagen real de masoterapia ${i+1}`,
  category: ['instalaciones','servicios','resultados','instalaciones','servicios','resultados','instalaciones'][i] || 'instalaciones',
  tall: [false,true,false,true,false,true,false][i],
}));

window.BEFORE_AFTER_DATA = [
  { id:1, title:'Maderoterapia Corporal', desc:'Resultado tras 4 sesiones de maderoterapia', img1: LOCAL_IMAGES[0], img2: LOCAL_IMAGES[1] },
  { id:2, title:'Drenaje Linfático',    desc:'Resultado después de 6 sesiones', img1: LOCAL_IMAGES[2], img2: LOCAL_IMAGES[3] },
  { id:3, title:'Limpieza & Maderoterapia Facial', desc:'Efecto tonificante en 3 sesiones', img1: LOCAL_IMAGES[4], img2: LOCAL_IMAGES[5] },
];

// ── Testimonials ──
window.TESTIMONIALS_DATA = [
  { id:1,  name:'María García',     service:'Masaje Maderoterapia', rating:5, text:'La maderoterapia redujo medidas de mi cintura desde la 2da sesión. Triny es una experta absoluta.', avatarColor:'#FF6B00', initials:'MG' },
  { id:2,  name:'Carlos Rodríguez', service:'Masaje Shiatsu',       rating:5, text:'El Shiatsu me quitó los dolores de espalda causados por estrés. Una experiencia de energía renovada.', avatarColor:'#1E40AF', initials:'CR' },
  { id:3,  name:'Ana Flores',       service:'Reflexología Podal',   rating:5, text:'Salí flotando después de la reflexología podal. Muy recomendado para quienes están de pie todo el día.', avatarColor:'#7C3AED', initials:'AF' },
  { id:4,  name:'Roberto Sánchez',  service:'Drenaje Linfático',    rating:5, text:'Excelente atención. Me comuniqué al 986820428 y me reservaron al instante.', avatarColor:'#059669', initials:'RS' },
];

// ── Blog Data ──
window.BLOG_DATA = [
  { id:1, category:'Maderoterapia', title:'Maderoterapia: La Técnica Holística para Moldear tu Cuerpo', excerpt:'Conoce cómo la maderoterapia elimina celulitis y tonifica la piel sin cirugías.', img: LOCAL_IMAGES[0], author:'Triny Flores', date:'01 Ago 2026', readTime:'6 min' },
  { id:2, category:'Salud Oriental', title:'Beneficios del Shiatsu para la Mente y la Espalda', excerpt:'El poder de la digitopuntura japonesa para desatar nudos de tensión profunda.', img: LOCAL_IMAGES[1], author:'Equipo Triny', date:'25 Jul 2026', readTime:'5 min' },
  { id:3, category:'Reflexología', title:'Puntos Reflejos de los Pies que Alivian el Estrés Orgánico', excerpt:'Aprende cómo la reflexología estimula el sistema nervioso y digestivo.', img: LOCAL_IMAGES[2], author:'Triny Flores', date:'18 Jul 2026', readTime:'4 min' },
];

// ── FAQ Data ──
window.FAQ_DATA = [
  { q:'¿Qué es la Maderoterapia y cuáles son sus beneficios?', a:'Es un tratamiento corporal con utensilios de madera diseñados anatómicamente. Ayuda a reafirmar, reducir grasa localizada, eliminar la celulitis y estimular el drenaje linfático.' },
  { q:'¿En qué consiste el Masaje Shiatsu?', a:'Es una terapia japonesa que utiliza la presión de pulgares y palmas sobre los meridianos energéticos para equilibrar el cuerpo, aliviar el insomnio y quitar dolores musculares.' },
  { q:'¿Cómo funciona el programa de Puntos TrinyBienestar?', a:'Acumulas 10 Puntos TrinyBienestar por cada S/ 10 de consumo. Puedes canjearlos por masajes gratis, maderoterapia o descuentos especiales en tu cuenta.' },
  { q:'¿Cómo puedo contactar a Atención al Cliente?', a:'Puedes llamar o escribir al WhatsApp +51 986 820 428 o usar nuestro formulario oficial de Soporte en la web. Los mensajes son procesados en tiempo real vía n8n.' },
];

window.BOOKING_SERVICES = window.SERVICES_DATA.map(s => ({
  id: s.id,
  name: s.name,
  price: s.priceLabel,
  priceNum: s.priceNum,
  duration: s.duration,
  category: s.category
}));

window.WHEEL_PRIZES = [
  { label:'10% Descuento',      color:'#FF6B00', bg:'#FF6B00', prob:'común'   },
  { label:'20% Descuento',      color:'#1E40AF', bg:'#1E40AF', prob:'frecuente' },
  { label:'Maderoterapia',      color:'#7C3AED', bg:'#7C3AED', prob:'raro'    },
  { label:'50 Puntos Triny',    color:'#059669', bg:'#059669', prob:'común'   },
  { label:'Masaje Shiatsu',     color:'#DB2777', bg:'#DB2777', prob:'raro'    },
  { label:'Reflexología Podal', color:'#D97706', bg:'#D97706', prob:'frecuente' },
  { label:'Aceite Relajante',   color:'#0891B2', bg:'#0891B2', prob:'común'   },
  { label:'Masaje de Cuello',   color:'#16A34A', bg:'#16A34A', prob:'frecuente' },
];

console.log('[Triny Masajes] 100% Local Images & Data module updated ✓');
