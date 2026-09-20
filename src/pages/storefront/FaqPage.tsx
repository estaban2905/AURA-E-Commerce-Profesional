import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Despachos & Envíos',
      q: '¿Cuáles son los tiempos de despacho y cobertura?',
      a: 'Despachamos a todo el territorio nacional mediante alianzas con Chilexpress y Starken. En la Región Metropolitana contamos con entrega en 24 a 48 horas hábiles, y opción Same-Day (mismo día) para compras realizadas antes de las 13:00 hrs. En regiones, el tiempo estimado oscila entre 2 y 4 días hábiles.',
    },
    {
      category: 'Despachos & Envíos',
      q: '¿Cómo funciona el envío gratuito?',
      a: 'Ofrecemos despacho 100% gratuito en todas las compras que igualen o superen los $50.000 CLP hacia cualquier comuna de Chile continental.',
    },
    {
      category: 'Garantía & Devoluciones',
      q: '¿Qué garantía tienen los productos AURA?',
      a: 'Todos los productos comercializados en AURA cuentan con 2 años de garantía legal y oficial del fabricante contra cualquier falla o defecto de fabricación. Además, ofrecemos 30 días corridos de garantía de satisfacción total.',
    },
    {
      category: 'Garantía & Devoluciones',
      q: '¿Cómo solicito una devolución o cambio?',
      a: 'Puedes solicitarlo directamente desde la sección "Mi Cuenta > Pedidos" o escribiéndonos a soporte@aura-tech.cl con tu número de orden. Nosotros gestionamos el retiro del producto sin costo adicional si está dentro de los 30 días.',
    },
    {
      category: 'Pagos & Facturación',
      q: '¿Qué medios de pago aceptan?',
      a: 'Aceptamos Webpay Plus (Tarjetas de Débito y Crédito con hasta 12 cuotas sin interés según tu banco), Mercado Pago, y Transferencia Electrónica Directa con confirmación automática.',
    },
    {
      category: 'Pagos & Facturación',
      q: '¿Puedo solicitar Factura con RUT de Empresa?',
      a: 'Sí, durante el checkout puedes seleccionar la opción "Deseo Factura" e ingresar la Razón Social, RUT de empresa y giro comercial para la emisión electrónica automática de tu DTE.',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Centro de Ayuda</span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Preguntas Frecuentes
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Encuentra respuestas inmediatas sobre despachos, garantías de fábrica, métodos de pago y políticas de satisfacción.
        </p>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
          <Truck className="h-5 w-5 text-primary mx-auto" />
          <p className="text-xs font-bold text-foreground">Envíos Rápidos</p>
          <p className="text-[11px] text-muted-foreground">Chilexpress & Starken</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
          <ShieldCheck className="h-5 w-5 text-emerald-600 mx-auto" />
          <p className="text-xs font-bold text-foreground">Garantía 2 Años</p>
          <p className="text-[11px] text-muted-foreground">Cobertura oficial</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
          <RotateCcw className="h-5 w-5 text-primary mx-auto" />
          <p className="text-xs font-bold text-foreground">30 Días de Prueba</p>
          <p className="text-[11px] text-muted-foreground">Satisfacción o cambio</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
          <CreditCard className="h-5 w-5 text-primary mx-auto" />
          <p className="text-xs font-bold text-foreground">12 Cuotas 0%</p>
          <p className="text-[11px] text-muted-foreground">Webpay & Mercado Pago</p>
        </div>
      </div>

      {/* Accordion FAQ items */}
      <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="p-5 transition-colors">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm text-foreground"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help CTA */}
      <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center space-y-3">
        <h3 className="text-base font-bold text-foreground">¿Tienes alguna pregunta adicional?</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Nuestro equipo de ingeniería de producto y soporte técnico está listo para resolver tus dudas de compatibilidad.
        </p>
        <Button variant="primary" size="sm" onClick={() => window.open('mailto:soporte@aura-tech.cl')}>
          Contactar con Soporte Técnico
        </Button>
      </div>
    </div>
  );
};
