// ============================================================
//  TRINY MASAJES — Public data for the static web application
// ============================================================

const LOCAL_IMAGES = window.TRINY_CONFIG.carouselImages.map(image => image.src);
const getLocalImg = (idx) => LOCAL_IMAGES[idx % LOCAL_IMAGES.length];
const PICSUM = (seed, w=600, h=450) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

window.SERVICES_DATA = window.TRINY_CONFIG.services.map(service => ({
  ...service,
  price: `S/ ${service.priceNum}`,
  priceLabel: `S/ ${service.priceNum}`
}));
window.PACKAGES_DATA = window.TRINY_CONFIG.packages;

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
];

window.CUPONES_DATA = [];

// ── TrinyPoints Loyalty Rewards Program ──
window.TRINY_POINTS_NAME = "Puntos TrinyBienestar";
window.TRINY_POINTS_REWARDS = [
  { points: 50,  reward: "Aromaterapia Esencial Gratis en tu próxima cita", icon: "🌺" },
  { points: 100, reward: "Descuento de S/ 25 en cualquier servicio", icon: "🎟️" },
  { points: 150, reward: "Sesión de Maderoterapia Facial Gratis (45 min)", icon: "🪵" },
  { points: 250, reward: "Masaje Relajante o Shiatsu 60 min GRATIS", icon: "🎁" },
];

// ── Gallery Data ──
window.GALLERY_DATA = [
  { src: 'img/Imagen para galeria de triny 1.jpg', alt: 'Espacio de atención de Triny Masajes', category: 'instalaciones' },
  { src: 'img/Imagen para galeria de triny 2.jpg', alt: 'Sesión de masajes de Triny', category: 'servicios' },
  { src: 'img/Imagen para galeria de triny 3.jpg', alt: 'Atención de bienestar a domicilio', category: 'servicios' },
  { src: 'img/Imagen para galeria de triny 4.png', alt: 'Experiencia de masoterapia', category: 'servicios' },
  { src: 'img/Imagen para galeria de triny 5.png', alt: 'Servicio de masajes Triny', category: 'servicios' },
  { src: 'img/Imagen para galeria de triny 6.png', alt: 'Masaje y bienestar', category: 'servicios' },
  { src: 'img/Imagen para galeria de triny 7.png', alt: 'Sesión de masoterapia profesional', category: 'servicios' },
  { src: 'img/Imagen para galeria de triny 8.jpg', alt: 'Tratamiento de bienestar Triny', category: 'servicios' },
  ...window.TRINY_CONFIG.services.map(service => ({ src: service.img, alt: service.name, category: 'servicios' }))
].map((image, index) => ({ id: index + 1, tall: index % 3 === 1, ...image }));

window.BEFORE_AFTER_DATA = [];

// ── Testimonials ──
window.TESTIMONIALS_DATA = [
  { id:1,  name:'María García',     service:'Masaje Maderoterapia', rating:5, text:'La maderoterapia redujo medidas de mi cintura desde la 2da sesión. Triny es una experta absoluta.', avatarColor:'#FF6B00', initials:'MG' },
  { id:2,  name:'Carlos Rodríguez', service:'Masaje Shiatsu',       rating:5, text:'El Shiatsu me quitó los dolores de espalda causados por estrés. Una experiencia de energía renovada.', avatarColor:'#1E40AF', initials:'CR' },
  { id:3,  name:'Ana Flores',       service:'Reflexología Podal',   rating:5, text:'Salí flotando después de la reflexología podal. Muy recomendado para quienes están de pie todo el día.', avatarColor:'#7C3AED', initials:'AF' },
  { id:4,  name:'Roberto Sánchez',  service:'Drenaje Linfático',    rating:5, text:'Excelente atención. Me comuniqué al 986100444 y me reservaron al instante.', avatarColor:'#059669', initials:'RS' },
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
  { q:'¿Cómo puedo contactar a Atención al Cliente?', a:'Puedes comunicarte con cualquiera de nuestras dos centrales de WhatsApp desde los botones de contacto de esta página.' },
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
