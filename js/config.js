window.TRINY_CONFIG = {
  contacts: {
    central1: {
      label: 'Central 1',
      phone: '51986100444',
      display: '+51 986 100 444'
    },
    central2: {
      label: 'Central 2',
      phone: '51994138981',
      display: '+51 994 138 981'
    }
  },
  social: [
    { label: 'Facebook', url: 'https://www.facebook.com/masajes.triny.delivery.peru?locale=es_LA' },
    { label: 'Instagram', url: 'https://www.instagram.com/triny_massajes/' },
    { label: 'TikTok', url: 'https://www.tiktok.com/@trinymasajesdelivery' }
  ],
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbwnMHC4PUn8r074K29n7YuGUJm_E2p5eg0pUY-USSDJMpRpboJhFkImgJLlnz8EQoR-Dg/exec',
  carouselIntervalSeconds: 5,
  carouselImages: [
    { src: 'img/Imagen para carrousel 1.png', alt: 'Masaje profesional a domicilio de Triny' },
    { src: 'img/Imagen para carrousel 2.png', alt: 'Servicio de bienestar de Triny Masajes' },
    { src: 'img/Imagen para carrousel 3.jpg', alt: 'Experiencia de masoterapia Triny' },
    { src: 'img/imagen para carrousel 4.jpg', alt: 'Atención de masajes Triny' },
    { src: 'img/Imagen para carrousel 5.png', alt: 'Masaje y bienestar a domicilio' },
    { src: 'img/Imagen para carrousel 6.jfif', alt: 'Servicios de Triny Masajes Delivery' }
  ],
  services: [
    { id: 1, category: 'estetico', name: 'Masaje reductor manual', duration: '60 min', priceNum: 120, img: 'img/Imagen para  paquetes de masajes reductores.png', desc: 'Masaje manual orientado al cuidado corporal y al bienestar.', benefits: ['Atención personalizada', 'Sesión de una hora'] },
    { id: 2, category: 'maderoterapia', name: 'Masaje reductor + maderoterapia', duration: '60 min', priceNum: 120, img: 'img/Masaje de maderoterapia.png', desc: 'Sesión reductora combinada con accesorios de maderoterapia.', benefits: ['Incluye técnicas de maderoterapia', 'Sesión de una hora'] },
    { id: 3, category: 'terapeutico', name: 'Masaje de descarga muscular', duration: '60 min', priceNum: 100, img: 'img/Masaje para descarga muscular.png', desc: 'Masaje para acompañar la recuperación y aliviar la tensión muscular.', benefits: ['Trabajo muscular personalizado', 'Sesión de una hora'] },
    { id: 4, category: 'terapeutico', name: 'Masaje de drenaje linfático', duration: '60 min', priceNum: 120, img: 'img/Masaje drenaje linfático.png', desc: 'Técnica manual suave enfocada en el drenaje linfático.', benefits: ['Técnica manual suave', 'Sesión de una hora'] },
    { id: 5, category: 'oriental', name: 'Masaje Shiatsu tradicional', duration: '60 min', priceNum: 100, img: 'img/Masaje Shiatsu.png', desc: 'Masaje tradicional japonés con presión manual en puntos específicos.', benefits: ['Presión manual adaptada', 'Sesión de una hora'] },
    { id: 6, category: 'reflexologia', name: 'Masaje de reflexología', duration: '60 min', priceNum: 100, img: 'img/Masaje de Refloxología.png', desc: 'Sesión de reflexología enfocada en puntos reflejos de los pies.', benefits: ['Atención podal personalizada', 'Sesión de una hora'] },
    { id: 7, category: 'maderoterapia', name: 'Masaje de maderoterapia', duration: '60 min', priceNum: 120, img: 'img/Masaje de maderoterapia.png', desc: 'Técnica corporal que utiliza accesorios anatómicos de madera.', benefits: ['Accesorios de madera', 'Sesión de una hora'] },
    { id: 8, category: 'estetico', name: 'Masaje anticelulítico', duration: '60 min', priceNum: 120, img: 'img/Masaje anticelulitico.png', desc: 'Masaje corporal enfocado en el cuidado de la piel y la circulación.', benefits: ['Técnica corporal personalizada', 'Sesión de una hora'] },
    { id: 9, category: 'terapeutico', name: 'Masaje descontracturante', duration: '60 min', priceNum: 100, img: 'img/Masaje descontracturante.png', desc: 'Masaje focalizado en zonas con tensión y contracturas musculares.', benefits: ['Trabajo focalizado', 'Sesión de una hora'] },
    { id: 10, category: 'relajacion', name: 'Masaje relajante', duration: '60 min', priceNum: 100, img: 'img/Masaje relajante.png', desc: 'Técnicas suaves orientadas a la relajación y el bienestar.', benefits: ['Ritmo suave personalizado', 'Sesión de una hora'] }
  ],
  packages: [
    {
      id: 'reductor-10',
      name: 'Paquete reductor + maderoterapia',
      priceNum: 1000,
      sessions: 10,
      duration: '1 hora por sesión',
      details: ['10 sesiones', 'Incluye crema reductora', 'Masoterapeuta', 'Accesorios de maderoterapia', 'Masaje general y reflexología'],
      singleSessionPrice: 120
    },
    {
      id: 'paquete-10-general',
      name: 'Paquete de 10 sesiones',
      priceNum: 900,
      sessions: 10,
      duration: 'Consultar duración por sesión',
      details: ['S/ 90 por sesión', 'No incluye domingos ni feriados', 'Incluye camilla portátil', 'Una terapeuta masoterapeuta', 'Cremas o aceite de masaje'],
      holidayPrice: 100,
      terms: 'La tarifa de S/ 100 para domingos y feriados requiere confirmación de la modalidad a la que corresponde.'
    }
  ],
  coverage: {
    lima: [
      { label: 'La Molina', apiDistrict: 'La Molina' },
      { label: 'Santiago de Surco', apiDistrict: 'Surco' },
      { label: 'Surquillo', apiDistrict: 'Surquillo' },
      { label: 'Barranco', apiDistrict: 'Barranco' },
      { label: 'Miraflores', apiDistrict: 'Miraflores' },
      { label: 'San Isidro', apiDistrict: 'San Isidro' },
      { label: 'Magdalena del Mar', apiDistrict: 'Magdalena del Mar' },
      { label: 'Pueblo Libre', apiDistrict: 'Pueblo Libre' }
    ],
    playas: {
      'Arica y zonas cercanas': ['Playa Arica', 'Playa San Pedro', 'Playa Los Pulpos'],
      'Punta Hermosa': ['Playa El Silencio', 'Playa Señoritas', 'Playa Caballeros', 'Playa Norte', 'Playa Negra o Playa Central', 'Playa Blanca', 'Playa Kontiki', 'Playa La Isla', 'Playa Escondida'],
      'Punta Negra': ['Playa Punta Rocas', 'Playa Santa Rosa', 'Playa La Pocita', 'Playa El Puerto', 'Playa El Revés', 'Playa La Bikini'],
      'San Bartolo': ['Playa San Bartolo Norte', 'Playa San Bartolo Sur', 'Playa Balevona', 'Playa Curayacu'],
      'Santa María del Mar': ['Playa Santa María', 'Playa Embajadores'],
      'Pucusana': ['Playa Naplo'],
      'Ubicación pendiente de validar': ['Lapa Lapa'],
      'Asia y condominios': ['Las Gramas', 'Costa del Campo', 'Las Totoritas', 'Las Palmas', 'Los Cocos', 'Unión Bíblica', 'Bujama', 'Cala del Mar', 'Chocalla', 'Farallones', 'Las Lagunas de Puerto Viejo', 'Las Lagunas', 'Las Arenas', 'Coral', 'Lobo Blanco', 'Chupikalla', 'Playa del Golf', 'Bora Bora', 'Playa del Sol', 'Playa Blanca', 'Los Flamencos', 'Puerto Madero', 'La Isla', 'Las Brisas', 'Mar Azul', 'Cayma', 'Kapala', 'Sol y Mar', 'Playa Bonita', 'Costa del Sol', 'Palabritas', 'Cocoa', 'Gaviotas', 'La Jolla', 'El Mirador de Asia', 'Rosario de Asia', 'Pasamayito', 'Sarapampa', 'Asia Azul', 'Asia Bonita', 'Asia del Mar', 'Asia del Sol', 'Asia del Sur', 'Vista Pacífico', 'Las Terrazas', 'Rincón de Asia', 'Riviera Norte', 'Riviera Sur', 'Villasur Norte', 'Villasur Centro', 'Villasur Sur', 'El Tigre', 'Huaycamp', 'Palillo', 'Asia Golf Club', 'El Misterio', 'Playa La Encontrada', 'Playa Honda', 'Canarias', 'Puerto Nuevo', 'Herencia', 'Lomas de Mar', 'Positano']
    },
    appsScriptDistricts: ['La Molina', 'Surco', 'Barranco', 'Miraflores', 'San Isidro']
  }
};
