import React, { useState } from 'react';
import { Settings, Store, DollarSign, Truck, RotateCcw, Shield, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast-context';
import { resetMockData } from '@/mocks/api';

export const AdminSettingsPage: React.FC = () => {
  const toast = useToast();

  const [settings, setSettings] = useState({
    storeName: 'AURA TECH',
    contactEmail: 'contacto@aura-tech.cl',
    supportPhone: '+56 2 2987 6543',
    currency: 'CLP ($)',
    taxRate: 19,
    freeShippingThreshold: 50000,
    apiLatencyMs: 300,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuración guardada', 'Los parámetros del comercio fueron actualizados.');
  };

  const handleResetData = () => {
    if (confirm('¿Restablecer todos los datos mock (productos, pedidos, clientes) a su estado original?')) {
      resetMockData();
      toast.info('Datos restablecidos', 'El almacenamiento local ha vuelto a los valores iniciales.');
      setTimeout(() => {
        window.location.reload();
      }, 600);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Configuración General de la Tienda
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Ajustes globales de facturación, impuestos DTE, reglas de envío y motor mock.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store identity */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Store className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Identidad Comercial</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre de Fantasía"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              required
            />
            <Input
              label="Correo de Contacto Oficial"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              required
            />
          </div>
          <Input
            label="Teléfono de Soporte"
            value={settings.supportPhone}
            onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
          />
        </div>

        {/* Currency & Tax */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <DollarSign className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Moneda & Reglas de Envío</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Moneda del Sistema"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              disabled
            />
            <Input
              label="Impuesto IVA (%)"
              type="number"
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
            />
            <Input
              label="Umbral Envío Gratis (CLP)"
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) =>
                setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Mock API Latency config */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Info className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Configuración del Simulador Mock API</h3>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-foreground/80">
              Latencia Artificial de Red: {settings.apiLatencyMs}ms
            </label>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={settings.apiLatencyMs}
              onChange={(e) => setSettings({ ...settings, apiLatencyMs: Number(e.target.value) })}
              className="w-full accent-primary"
            />
            <p className="text-[11px] text-muted-foreground">
              Ajusta este deslizador para simular conexiones de red lentas (3G) o ultrarrápidas al responder promesas de productos y pedidos.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetData}
            className="text-rose-500 hover:text-rose-600 gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restablecer Datos Mock</span>
          </Button>

          <Button type="submit" variant="primary" size="md">
            Guardar Configuración
          </Button>
        </div>
      </form>
    </div>
  );
};
