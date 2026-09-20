import React, { useState, useEffect } from 'react';
import { Plus, Tag, Calendar, Percent, DollarSign, Trash2, Check, X } from 'lucide-react';
import { promotionService } from '@/services/promotion.service';
import { Promotion } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast-context';

export const AdminPromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed_amount',
    value: 15,
    minOrderAmount: 30000,
    maxUsageLimit: 100,
    validUntil: '2026-12-31',
  });

  const loadPromos = async () => {
    const data = await promotionService.getPromotions();
    setPromotions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    await promotionService.createPromotion({
      code: formData.code.trim().toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      value: Number(formData.value),
      minOrderAmount: Number(formData.minOrderAmount),
      maxUsageLimit: Number(formData.maxUsageLimit),
      currentUsageCount: 0,
      active: true,
      validFrom: new Date().toISOString(),
      validUntil: new Date(formData.validUntil).toISOString(),
    });

    toast.success('Cupón creado', `Código ${formData.code.toUpperCase()} activo`);
    setModalOpen(false);
    loadPromos();
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await promotionService.updatePromotion(id, { active: !current });
    toast.info('Estado actualizado', !current ? 'Cupón activado' : 'Cupón pausado');
    loadPromos();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar cupón?')) {
      await promotionService.deletePromotion(id);
      toast.info('Cupón eliminado');
      loadPromos();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Cupones & Promociones ({promotions.length})
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Crea códigos de descuento por porcentaje o monto fijo con reglas de monto mínimo.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Crear Cupón</span>
        </Button>
      </div>

      {/* Promotions Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Código</th>
                <th className="p-4 font-semibold">Tipo</th>
                <th className="p-4 font-semibold">Beneficio</th>
                <th className="p-4 font-semibold">Monto Mínimo</th>
                <th className="p-4 font-semibold">Usos</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Cargando cupones...
                  </td>
                </tr>
              ) : promotions.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-black text-foreground text-sm bg-muted/60 px-2.5 py-1 rounded-lg">
                      {p.code}
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-1">{p.description}</p>
                  </td>
                  <td className="p-4 text-muted-foreground capitalize">
                    {p.discountType === 'percentage' ? 'Porcentaje' : 'Monto Fijo'}
                  </td>
                  <td className="p-4 font-black text-foreground">
                    {p.discountType === 'percentage' ? `${p.value}% OFF` : formatCurrency(p.value)}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatCurrency(p.minOrderAmount || p.minPurchase || 0)}
                  </td>
                  <td className="p-4 font-mono text-muted-foreground">
                    {p.currentUsageCount || p.usedCount || 0} / {p.maxUsageLimit || p.usageLimit || 100}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={p.active ? 'success' : 'secondary'}
                      className="text-[10px] uppercase font-bold"
                    >
                      {p.active ? 'Activo' : 'Pausado'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(p.id, p.active)}
                        className="text-xs"
                      >
                        {p.active ? 'Pausar' : 'Activar'}
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal New Coupon */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground">Crear Nuevo Cupón</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <Input
                label="Código del Cupón"
                placeholder="PROMO2026"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
              <Input
                label="Descripción interna"
                placeholder="Descuento para campaña de lanzamiento..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1.5">Tipo</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value as any })
                    }
                    className="w-full h-10 text-xs rounded-lg border border-input bg-background px-3 text-foreground"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed_amount">Monto Fijo (CLP)</option>
                  </select>
                </div>
                <Input
                  label={formData.discountType === 'percentage' ? 'Porcentaje (%)' : 'Monto ($)'}
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Monto Mínimo Compra"
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrderAmount: Number(e.target.value) })
                  }
                />
                <Input
                  label="Límite de Usos"
                  type="number"
                  value={formData.maxUsageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, maxUsageLimit: Number(e.target.value) })
                  }
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Guardar Cupón
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
