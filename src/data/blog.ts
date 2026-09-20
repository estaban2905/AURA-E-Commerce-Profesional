import { BlogPost, FAQItem } from '@/types';

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Guía Definitiva: Cómo diseñar un Setup Minimalista para Máxima Productividad',
    slug: 'guia-setup-minimalista-productividad',
    excerpt: 'Descubre los principios ergonómicos, gestión de cables invisible y elección de iluminación para evitar la fatiga visual tras 8 horas de trabajo.',
    category: 'Productividad',
    author: {
      name: 'Matías Silva',
      role: 'Diseñador Industrial & Arquitecto de Setups',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    publishedAt: '2026-03-12',
    readTime: '6 min de lectura',
    coverImage: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1200&auto=format&fit=crop&q=80',
    tags: ['Workspace', 'Ergonomía', 'Minimalismo', 'Tech'],
    content: `
      El espacio donde trabajas influye directamente en tu claridad mental y tu capacidad de concentración profunda. En esta guía analizamos los 4 pilares esenciales:
      
      1. **Gestión Lumínica Circadiana**: Las barras de luz sobre monitor eliminan los reflejos en pantalla y aportan luz cenital cálida que reduce en un 60% el estrés ocular nocturno.
      2. **La Regla del Escritorio Despejado**: Mantén sobre la superficie únicamente lo que tocas en un lapso de 15 minutos: teclado, mouse, libreta y taza de café.
      3. **Ergonomía Dinámica**: Alternar entre trabajar de pie y sentado cada 90 minutos reactiva la circulación y previene la lumbalgia crónica.
      4. **Acústica Controlada**: Los auriculares con cancelación de ruido activa crean una burbuja de aislamiento acústico indispensable en ambientes abiertos.
    `,
  },
  {
    id: 'post-2',
    title: 'Audio Hi-Fi vs Codecs Bluetooth: ¿Realmente se nota la diferencia?',
    slug: 'audio-hi-fi-codecs-bluetooth-diferencias',
    excerpt: 'Desmitificamos LDAC, aptX HD, LC3 y AAC. Todo lo que necesitas saber antes de invertir en audífonos audiófilos.',
    category: 'Audio',
    author: {
      name: 'Camila Valenzuela',
      role: 'Ingeniera de Sonido & Acústica',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    },
    publishedAt: '2026-03-05',
    readTime: '8 min de lectura',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    tags: ['Audio', 'Hi-Fi', 'Bluetooth', 'Reseñas'],
    content: `
      Durante años, la transmisión inalámbrica sacrificaba la dinámica musical para ahorrar ancho de banda. Hoy en día, codecs como LDAC permiten tasas de transferencia de hasta 990 kbps a 24-bit/96kHz, cerrando la brecha con el cable tradicional para el 99% de los oyentes.
    `,
  },
  {
    id: 'post-3',
    title: 'Teclados Mecánicos Custom: Guía de Switches Hall Effect y Rapid Trigger',
    slug: 'teclados-mecanicos-switches-hall-effect',
    excerpt: 'Por qué los switches magnéticos están desplazando a los switches mecánicos tradicionales tanto en gaming competitivo como en escritura profesional.',
    category: 'Gaming & Tech',
    author: {
      name: 'Sebastián Navarro',
      role: 'Especialista en Hardware',
      avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80',
    },
    publishedAt: '2026-02-24',
    readTime: '5 min de lectura',
    coverImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80',
    tags: ['Hardware', 'Periféricos', 'Gaming'],
    content: `
      La tecnología Hall Effect mide la distancia de pulsación mediante un campo magnético sin contacto físico entre láminas metálicas. Esto permite configurar el punto de actuación desde 0.1 mm hasta 4.0 mm con precisión milimétrica.
    `,
  },
];

export const mockFAQItems: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'pedidos',
    question: '¿Cómo puedo rastrear el estado de mi pedido?',
    answer: 'Una vez completada tu compra, recibirás un número de seguimiento por correo electrónico. También puedes consultar el estado en tiempo real desde la sección "Mi Cuenta > Pedidos", donde podrás ver cada hito: Confirmado, Preparando, Enviado y Entregado.',
  },
  {
    id: 'faq-2',
    category: 'pedidos',
    question: '¿Puedo modificar o cancelar mi pedido una vez realizado?',
    answer: 'Puedes cancelar tu orden sin costo siempre que no haya pasado al estado "Enviado". Dirígete a "Mis Pedidos", selecciona la orden correspondiente y pulsa "Solicitar Cancelación". Si ya está en tránsito, deberás tramitar una devolución al recibirlo.',
  },
  {
    id: 'faq-3',
    category: 'pagos',
    question: '¿Cuáles son los métodos de pago aceptados?',
    answer: 'Aceptamos Tarjetas de Crédito y Débito (Visa, Mastercard, American Express), Webpay Plus con hasta 12 cuotas sin interés, Mercado Pago, y Transferencia Bancaria Directa con confirmación automática.',
  },
  {
    id: 'faq-4',
    category: 'pagos',
    question: '¿Los precios incluyen IVA?',
    answer: 'Sí, todos los precios mostrados en el catálogo de AURA incluyen el 19% de IVA obligatorio. Al finalizar la compra puedes solicitar Boleta Electrónica o Factura comercial con tu RUT de empresa.',
  },
  {
    id: 'faq-5',
    category: 'envios',
    question: '¿Cuáles son los tiempos y costos de despacho?',
    answer: 'El envío Estándar demora de 24 a 48 horas hábiles en Región Metropolitana ($3.990) y de 2 a 4 días en regiones ($5.990). El envío Express en el mismo día está disponible para compras antes de las 13:00 hrs. El despacho es GRATUITO en compras sobre $50.000.',
  },
  {
    id: 'faq-6',
    category: 'envios',
    question: '¿Tienen retiro en tienda física o showroom?',
    answer: 'Sí, contamos con opción de Retiro en Tienda en nuestro Flagship Store de Las Condes, Santiago. Estará listo para retirar en 2 horas hábiles tras la confirmación de la compra sin costo alguno.',
  },
  {
    id: 'faq-7',
    category: 'devoluciones',
    question: '¿Cuál es la política de garantía y devoluciones?',
    answer: 'Ofrecemos 30 días de satisfacción garantizada: si el producto no cumple tus expectativas, puedes devolverlo en su empaque original para un reembolso total. Además, todos nuestros artículos cuentan con 12 meses de garantía oficial por fallas de fábrica.',
  },
  {
    id: 'faq-8',
    category: 'productos',
    question: '¿Los productos son 100% originales y cuentan con soporte oficial?',
    answer: 'Absolutamente. Somos distribuidores autorizados de todas las marcas presentes en nuestra plataforma. Todos los productos vienen sellados de fábrica con su respectivo número de serie y garantía homologada.',
  },
  {
    id: 'faq-9',
    category: 'cuenta',
    question: '¿Qué ventajas obtengo al crear una cuenta en AURA?',
    answer: 'Al registrarte acumulas puntos AURA Rewards canjeables por descuentos, accedes a ventas privadas antes del público general, guardas múltiples direcciones de entrega y gestionas tus garantías con un solo clic.',
  },
];
