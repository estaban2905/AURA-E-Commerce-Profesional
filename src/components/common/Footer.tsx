import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, ShieldCheck, Truck, Clock, Award, CreditCard, ArrowRight } from 'lucide-react';
import { mockCategories } from '@/data/categories';
import { useToast } from '@/components/ui/toast-context';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Correo inválido', 'Por favor ingresa un email válido.');
      return;
    }
    toast.success('¡Suscripción exitosa!', 'Te hemos enviado un cupón de 10% de descuento a tu correo.');
    setEmail('');
  };

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      {/* Value Propositions Strip */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Envío Gratis</h4>
                <p className="text-xs text-muted-foreground mt-0.5">En todos los pedidos sobre $50.000 a todo Chile.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Garantía Oficial</h4>
                <p className="text-xs text-muted-foreground mt-0.5">24 meses de respaldo en toda nuestra gama técnica.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Despacho 24/48 Horas</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Embalaje reforzado con trazabilidad en vivo.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">30 Días de Prueba</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Satisfacción garantizada o reembolso total.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center font-black text-base tracking-tighter">
                A
              </div>
              <span className="font-display font-black text-xl tracking-tight text-foreground">
                AURA
              </span>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Diseño minimalista, ingeniería de vanguardia y hardware de precisión para creadores,
              desarrolladores y profesionales que exigen el máximo rendimiento diario.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-foreground mb-2">
                Suscríbete a nuestro newsletter y recibe 10% OFF en tu primera compra
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="tu.email@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                >
                  <span>Unirse</span>
                  <Send className="h-3 w-3" />
                </button>
              </form>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Categorías
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {mockCategories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/catalog?category=${cat.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/catalog" className="text-primary font-semibold hover:underline flex items-center gap-1">
                  <span>Ver todas ({mockCategories.length})</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Soporte & Ayuda
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link to="/tracking" className="hover:text-primary transition-colors">
                  Seguimiento de Envío
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Centro de Contacto
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="hover:text-primary transition-colors">
                  Políticas de Garantía
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary transition-colors">
                  Cambios y Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              AURA Studio
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Blog & Tech Reviews
                </Link>
              </li>
              <li>
                <Link to="/stores" className="hover:text-primary transition-colors">
                  Showrooms & Tiendas
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-primary font-medium hover:underline flex items-center gap-1">
                  <span>Panel Administrador</span>
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-muted-foreground block pt-2">
                  Atención: Lun a Vie 9:00 - 19:00 hrs
                </span>
                <span className="text-[11px] font-medium text-foreground">
                  soporte@aura-store.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Payment Icons */}
        <div className="mt-12 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 AURA Tech & Design S.A. Todos los derechos reservados.</p>

          {/* Payment Methods Badges */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-foreground mr-1">Pagos Seguros:</span>
            <span className="px-2 py-1 rounded bg-muted/60 text-[10px] font-bold border border-border">Webpay Plus</span>
            <span className="px-2 py-1 rounded bg-muted/60 text-[10px] font-bold border border-border">Mercado Pago</span>
            <span className="px-2 py-1 rounded bg-muted/60 text-[10px] font-bold border border-border">Transbank</span>
            <span className="px-2 py-1 rounded bg-muted/60 text-[10px] font-bold border border-border">Transferencia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
