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

window.TEAM_DATA = [
  { name: 'Betsy', image: 'img/Betsy.jpeg' },
  { name: 'Janet', image: 'img/Janet.jpg' },
  { name: 'Maria', image: 'img/Maria.jpeg' },
  { name: 'Ana', image: 'img/Ana.jpeg' },
  { name: 'Wendy', image: 'img/Wendy.jpg' },
  { name: 'Marleny', image: 'img/Marleny.jpg' },
  { name: 'talia', image: 'img/talia.jpeg' },
  { name: 'Yanina', image: 'img/Yanina.jpg' },
  { name: 'Fany', image: 'img/Fany.jpeg' },
  { name: 'Cielo', image: 'img/Cielo.jpeg' },
  { name: 'Evelyn', image: 'img/Evelyn.png' },
  { name: 'Melin', image: 'img/Melin.jpg' },
  { name: 'Mariangel', image: 'img/Mariangel.jpg' },
  { name: 'Naomi', image: 'img/Naomi.jpg' },
  { name: 'Charo', image: 'img/Charo.png' },
  { name: 'Vanessa', image: 'img/Vanessa.jpg' },
  { name: 'Abigail', image: 'img/Abigail.jpeg' },
  { name: 'Andrea', image: 'img/Andrea.jpeg' },
  { name: 'Jasmin', image: 'img/Jasmin.jpg' },
  { name: 'Carmen', image: 'img/Carmen.jpeg' },
  { name: 'Criss', image: 'img/Criss.jpg' },
  { name: 'Elsa', image: 'img/Elsa.jpeg' },
  { name: 'Danna', image: 'img/Danna.jpeg' },
  { name: 'Noemi', image: 'img/Noemi.png' }

  

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
  {
    src: 'img/LIMA.jpg',
    alt: 'Fotografía de la galería de Lima 1',
    category: 'lima'
  },
  ...[
    'img/LIMA 2.jpg',
    'img/LIMA 3.png',
    'img/LIMA 4.3.png',
    'img/LIMA 5.jpg',
    'img/LIMA 6.jpg',
    'img/LIMA 9.png',
    'img/LIMA 10.jpg',
    'img/LIMA 12.jpg',
    'img/LIMA 13.jpg',
    'img/LIMA 14.jpg',
    'img/LIMA 15.jpeg',
    'img/LIMA 16.jpeg',
    'img/LIMA 17.jpeg',
    'img/LIMA 18.jpeg',
    'img/LIMA 19.jpeg',
    'img/LIMA 20.jpg',
    'img/LIMA 21.jpg',
    'img/LIMA 23.jpg',
    'img/LIMA 24.png',
    'img/LIMA 25.jpg',
    'img/LIMA 26.jpg',
    'img/LIMA 27.jpg',
    'img/LIMA 28.jpg'
  ].map((src, index) => ({
    src,
    alt: `Fotografía de la galería de Lima ${index + 2}`,
    category: 'lima'
  })),
  {
    src: 'img/CORPORATIVO 1.png',
    alt: 'Fotografía corporativa de Triny Masajes 1',
    category: 'corporativa'
  },
  {
    src: 'img/CORPORATIVO 2.png',
    alt: 'Fotografía corporativa de Triny Masajes 2',
    category: 'corporativa'
  },
  {
    src: 'img/CORPORATIVO 3.jpg',
    alt: 'Fotografía corporativa de Triny Masajes 3',
    category: 'corporativa'
  },
  ...[
    'Foto para galeria de playa.jpg',
    'Fotos de playa para galeria.jpg',
    'Imagen para galeria de playa.jpg',
    'Imagen para galeria de playa 1.jpg',
    'Imagen para galeria de playa 2.jpg',
    'Imagen para galeria de playa 3.jpg',
    'Imagen para galeria de playa 6.jpg',
    'Imagen para galeria de playa 7.jpg',
    'Imagen para galeria de playa 8.png',
    'Imagen para galeria de playa 9.jpg',
    'Imagen para galeria de playa 10.png',
    'Imagen para playa  5.jpg'
  ].map((name, index) => ({
    src: `img/${name}`,
    alt: `Fotografía de playa ${index + 1}`,
    category: 'playas'
  }))
].map((image, index) => ({ id: index + 1, ...image }));

window.BEFORE_AFTER_DATA = [];

// ── Testimonials ──
window.TESTIMONIALS_DATA = [];

// ── Blog Data ──
window.BLOG_DATA = [
  {
    id: 'elegir-masaje',
    category: 'Guía de servicios',
    title: '¿Qué masaje elegir? Una guía para conversar antes de tu sesión',
    excerpt: 'Las técnicas y la presión varían. Empieza por contar qué buscas y qué te resulta cómodo; ninguna modalidad sustituye una evaluación clínica.',
    readTime: '4 min',
    img: 'img/BLOG QUE MASAJE ELEGIR.png',
    sections: [
      {
        heading: 'Empieza por tu objetivo y tus preferencias',
        text: 'Un masaje de relajación suele priorizar un ritmo tranquilo y una presión cómoda. Shiatsu utiliza presiones manuales en distintas zonas; reflexología trabaja puntos de los pies o las manos como práctica de bienestar, sin diagnosticar enfermedades. La maderoterapia incorpora instrumentos de madera y puede sentirse más intensa. El nombre del servicio no garantiza un resultado: pregunta qué incluye y acuerda la presión antes de empezar.'
      },
      {
        heading: 'Cuéntanos lo importante para ti',
        text: 'Comenta si prefieres una presión ligera, si hay zonas que no deseas trabajar o si tienes una lesión, dolor persistente, embarazo u otra condición de salud relevante. Puedes pedir que se ajuste o se detenga la sesión en cualquier momento. Si buscas atención por un síntoma o una condición médica, consulta primero a un profesional sanitario.'
      },
      {
        heading: 'Consulta los servicios disponibles',
        text: 'Revisa la descripción de cada <a href="#servicios">servicio de Triny</a> y pregunta al equipo si tienes dudas sobre la técnica, duración o comodidad.'
      }
    ],
    sources: [
      { label: 'NCCIH: Masaje terapéutico: lo que debes saber', href: 'https://www.nccih.nih.gov/health/massage-therapy-what-you-need-to-know' }
    ]
  },
  {
    id: 'reflexologia-evidencia',
    category: 'Reflexología',
    title: 'Reflexología podal: qué puede ofrecer y qué no sabemos',
    excerpt: 'Una explicación clara de esta práctica de bienestar y de los límites de la evidencia disponible.',
    readTime: '4 min',
    img: 'img/BLOG 2.png',
    imgAlt: 'Lámina ilustrativa de zonas reflejas del pie; no es una herramienta de diagnóstico',
    sections: [
      {
        heading: 'Una práctica de presión en pies o manos',
        text: 'La reflexología aplica presión en puntos específicos, con frecuencia en los pies. Los mapas que asocian esos puntos con otras partes del cuerpo son parte de la práctica; no son una prueba diagnóstica ni muestran que presionar un punto trate un órgano.'
      },
      {
        heading: 'La evidencia tiene límites',
        text: 'El Centro Nacional de Salud Complementaria e Integral de Estados Unidos (NCCIH) señala que la investigación sobre reflexología es limitada y no confirma de forma concluyente que cure o trate enfermedades. Algunas personas la eligen como experiencia de relajación, pero no reemplaza la atención médica ni los tratamientos indicados.'
      },
      {
        heading: 'Si decides probarla',
        text: 'Avisa si tienes dolor, sensibilidad o una condición que afecte tus pies, acuerda una presión cómoda y detén la sesión si algo te causa dolor. Puedes consultar la descripción del <a href="#servicios">servicio de reflexología podal</a> antes de reservar.'
      }
    ],
    sources: [
      { label: 'NCCIH: Reflexología', href: 'https://www.nccih.nih.gov/health/reflexology' }
    ]
  },
  {
    id: 'drenaje-linfatico',
    category: 'Precauciones',
    title: 'Drenaje linfático: por qué conviene consultar antes',
    excerpt: 'No todo masaje suave es drenaje linfático. Si hay hinchazón o un diagnóstico, la orientación clínica debe marcar el camino.',
    readTime: '5 min',
    img: 'img/BLOG DRENAJE LINFÁTICO.png',
    sections: [
      {
        heading: 'Una técnica con un uso clínico específico',
        text: 'El drenaje linfático manual emplea movimientos suaves y forma parte del manejo del linfedema en algunas personas, generalmente junto con otras medidas indicadas por profesionales. No es un masaje genérico para “desintoxicar” ni una solución para cualquier hinchazón.'
      },
      {
        heading: 'Consulta si hay hinchazón o antecedentes médicos',
        text: 'Si notas hinchazón nueva, persistente o dolorosa, busca orientación sanitaria para conocer su causa antes de solicitar un masaje. Quienes tienen linfedema, han recibido tratamiento oncológico o siguen un plan de cuidado deben consultar al equipo que conoce su caso; la técnica puede no ser adecuada para todas las personas.'
      },
      {
        heading: 'Atención a señales de alarma',
        text: 'Solicita atención médica si la hinchazón aparece de forma repentina o se acompaña de enrojecimiento, calor, dolor importante o fiebre. No retrases una consulta por probar un servicio de bienestar. Revisa también los <a href="#servicios">servicios disponibles</a> y confirma con el equipo qué técnica ofrece cada uno.'
      }
    ],
    sources: [
      { label: 'NCI: Linfedema', href: 'https://www.cancer.gov/about-cancer/treatment/side-effects/lymphedema' },
      { label: 'NHS: Linfedema', href: 'https://www.nhs.uk/conditions/lymphoedema/' }
    ]
  },
  {
    id: 'maderoterapia-expectativas',
    category: 'Expectativas realistas',
    title: 'Maderoterapia y celulitis: expectativas sin promesas',
    excerpt: 'La apariencia de la piel puede variar, pero una sesión no permite prometer cambios permanentes ni resultados médicos.',
    readTime: '4 min',
    img: 'img/BLOG MADEROTERAPIA.png',
    sections: [
      {
        heading: 'Qué ocurre durante una sesión',
        text: 'La maderoterapia utiliza instrumentos de madera sobre el cuerpo. La presión y las sensaciones pueden variar según la zona y la persona; conversa con la terapeuta sobre comodidad, zonas sensibles y cuándo detenerse.'
      },
      {
        heading: 'Desconfía de resultados garantizados',
        text: 'La celulitis es común y su aspecto depende de varios factores. Una sesión no permite prometer eliminar celulitis, reducir grasa ni lograr cambios duraderos en medidas. Una sensación o cambio temporal en la piel no demuestra un efecto permanente.'
      },
      {
        heading: 'Prioriza la seguridad y la información',
        text: 'Pide que se explique la técnica, evita presiones que resulten dolorosas y suspende la sesión si aparece dolor o malestar. El masaje no sustituye una evaluación ni un tratamiento sanitario. Consulta la información del <a href="#servicios">servicio de maderoterapia</a> y habla con un profesional de salud si tienes una condición médica o dudas sobre su conveniencia.'
      }
    ],
    sources: [
      { label: 'NCCIH: Masaje terapéutico: lo que debes saber', href: 'https://www.nccih.nih.gov/health/massage-therapy-what-you-need-to-know' }
    ]
  },
  {
    id: 'estiramientos-suaves',
    category: 'Movimiento suave',
    title: 'Estiramientos suaves: escucha tus límites',
    excerpt: 'Una rutina sencilla debe sentirse cómoda. No hace falta rebotar ni forzar para que un estiramiento sea útil.',
    readTime: '3 min',
    img: 'img/BLOG1.jpg',
    imgAlt: 'Ilustración de estiramientos suaves para el tren inferior',
    sections: [
      {
        heading: 'Muévete dentro de un rango cómodo',
        text: 'Busca una tensión ligera, no dolor; respira con normalidad y evita rebotes o movimientos bruscos. Mantén el apoyo estable y no intentes copiar una postura que no se adapta a tu cuerpo.'
      },
      {
        heading: 'Detente si algo no se siente bien',
        text: 'Interrumpe el movimiento si sientes dolor agudo, mareo, entumecimiento o un empeoramiento de tus síntomas. Si tienes una lesión, dolor persistente, una condición de salud o no sabes qué movimientos son adecuados, pide orientación a un profesional antes de comenzar.'
      },
      {
        heading: 'Una guía, no una prescripción',
        text: 'La ilustración es orientativa y no reemplaza indicaciones personalizadas. El NHS ofrece ejemplos generales de ejercicios de flexibilidad; revisa sus recomendaciones y adapta la actividad a tus posibilidades.'
      }
    ],
    sources: [
      { label: 'NHS: Ejercicios de flexibilidad', href: 'https://www.nhs.uk/live-well/exercise/flexibility-exercises/' }
    ]
  },
  {
    id: 'preparar-cita-domicilio',
    category: 'Antes de tu cita',
    title: 'Cómo preparar tu espacio para una cita de masaje en casa',
    excerpt: 'Unos acuerdos simples ayudan a que la visita sea más cómoda: espacio despejado, preferencias claras y comunicación durante la sesión.',
    readTime: '3 min',
    img: 'img/BLOG PREPARATE PARA TU MASAJE.png',
    sections: [
      {
        heading: 'Deja listo un lugar tranquilo',
        text: 'Despeja un área con espacio suficiente para el trabajo y el equipo que se haya coordinado. Procura que haya una temperatura cómoda, buena ventilación y un acceso seguro. Confirma con anticipación los detalles prácticos de la visita.'
      },
      {
        heading: 'Habla de tus preferencias y límites',
        text: 'Antes de empezar, comenta la presión que prefieres, las zonas que quieres evitar y cualquier sensibilidad o situación de salud relevante. Puedes cambiar de opinión, pedir un ajuste o finalizar la sesión en cualquier momento.'
      },
      {
        heading: 'No necesitas una preparación especial',
        text: 'No hace falta seguir una dieta, “desintoxicarse” ni tomar suplementos para recibir un masaje. Si tienes síntomas o una condición médica, consulta a un profesional sanitario sobre si el masaje es adecuado para ti. Revisa los <a href="#servicios">detalles de los servicios</a> y coordina cualquier pregunta con el equipo.'
      }
    ],
    sources: [
      { label: 'NCCIH: Masaje terapéutico: lo que debes saber', href: 'https://www.nccih.nih.gov/health/massage-therapy-what-you-need-to-know' }
    ]
  }
];

// ── FAQ Data ──
window.FAQ_DATA = [
  { q:'¿Qué es la maderoterapia y cuáles son sus beneficios?', a:'Es una técnica de masaje que utiliza instrumentos de madera. La sesión y sus objetivos se coordinan con la terapeuta; los resultados pueden variar y no se garantizan efectos médicos o estéticos.' },
  { q:'¿En qué consiste el masaje Shiatsu?', a:'Es una técnica de masaje de origen japonés que utiliza presiones manuales en distintas zonas del cuerpo. Consulta con el equipo si tienes dudas sobre su adecuación a tus necesidades.' },
  { q:'¿Cómo funciona el programa de puntos TrinyBienestar?', a:'Las reglas de acumulación, consulta y canje deben confirmarse con Atención al Cliente antes de participar.' },
  { q:'¿Cómo puedo contactar a Atención al Cliente?', a:'Puedes comunicarte con cualquiera de las dos centrales mediante los enlaces de WhatsApp publicados en esta página.' },
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
