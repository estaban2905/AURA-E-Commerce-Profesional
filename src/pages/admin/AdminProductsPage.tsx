import React, { useState } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Package,
  Eye,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { productService } from '@/services/product.service';
import { mockCategories } from '@/data/categories';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast-context';

export const AdminProductsPage: React.FC = () => {
  const { products, total, isLoading, refetch, filters, updateFilter } = useProducts({ limit: 50 });
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: 'AURA',
    category: 'cat-audio',
    sku: '',
    price: 199990,
    compareAtPrice: 229990,
    stock: 25,
    shortDescription: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
    tags: 'audio, hi-fi, pro',
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'AURA',
      category: 'cat-audio',
      sku: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      price: 199990,
      compareAtPrice: 229990,
      stock: 25,
      shortDescription: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      tags: 'audio, hi-fi, pro',
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      brand: p.brand,
      category: p.category,
      sku: p.sku,
      price: p.price,
      compareAtPrice: p.compareAtPrice || 0,
      stock: p.stock,
      shortDescription: p.shortDescription,
      description: p.description || '',
      image: p.images[0] || '',
      tags: p.tags?.join(', ') || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      toast.error('Campos requeridos', 'Ingresa nombre y SKU del producto.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: formData.brand,
        category: formData.category,
        sku: formData.sku,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        stock: Number(formData.stock),
        shortDescription: formData.shortDescription,
        description: formData.description,
        images: [formData.image],
        tags: formData.tags.split(',').map((t) => t.trim()),
        attributes: [
          { name: 'Garantía', value: '24 Meses Oficial' },
          { name: 'Disponibilidad', value: 'Inmediata' },
        ],
        variants: [
          {
            id: `var-${Date.now()}-1`,
            name: 'Negro Titanio',
            sku: `${formData.sku}-BLK`,
            price: Number(formData.price),
            stock: Number(formData.stock),
            colorHex: '#18181b',
          },
        ],
        rating: 5.0,
        reviewsCount: 1,
        featured: true,
        new: true,
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        toast.success('Producto actualizado', `${formData.name} se modificó con éxito.`);
      } else {
        await productService.createProduct(payload as any);
        toast.success('Producto creado', `${formData.name} añadido al catálogo.`);
      }

      setModalOpen(false);
      refetch();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) {
      await productService.deleteProduct(id);
      toast.info('Producto eliminado', name);
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Catálogo de Productos ({total})
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Crea, edita, actualiza stock y administra variantes del catálogo comercial.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={openCreateModal} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Producto</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl border border-border bg-card">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o marca..."
            value={filters.searchQuery || ''}
            onChange={(e) => updateFilter({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <select
          value={filters.category || ''}
          onChange={(e) => updateFilter({ category: e.target.value || undefined })}
          className="text-xs rounded-xl border border-input bg-background px-3 py-2 text-foreground w-full sm:w-auto"
        >
          <option value="">Todas las categorías</option>
          {mockCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Producto</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold">Precio</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Cargando productos del catálogo...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No se encontraron productos con el filtro aplicado.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 flex items-center gap-3 min-w-[240px]">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-11 w-11 rounded-lg object-cover bg-muted border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {p.brand}
                        </span>
                        <p className="font-bold text-foreground truncate">{p.name}</p>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-muted-foreground">{p.sku}</td>

                    <td className="p-4 text-muted-foreground">
                      {mockCategories.find((c) => c.id === p.category)?.name || p.category}
                    </td>

                    <td className="p-4 font-black text-foreground">{formatCurrency(p.price)}</td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          p.stock > 10
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : p.stock > 0
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        }`}
                      >
                        {p.stock} unids.
                      </span>
                    </td>

                    <td className="p-4">
                      <Badge
                        variant={p.stock > 0 ? 'success' : 'destructive'}
                        className="text-[10px] uppercase font-bold"
                      >
                        {p.stock > 0 ? 'Activo' : 'Agotado'}
                      </Badge>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Editar producto"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Producto"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Marca"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 text-xs rounded-lg border border-input bg-background px-3 text-foreground"
                  >
                    {mockCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Código SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
                <Input
                  label="Stock Inicial"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Precio de Venta (CLP)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
                <Input
                  label="Precio Comparativo (Antes)"
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, compareAtPrice: Number(e.target.value) })
                  }
                />
              </div>

              <Input
                label="URL de Imagen Principal"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />

              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                  Descripción Corta
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full text-xs rounded-lg border border-input bg-background p-2.5 text-foreground"
                  placeholder="Resumen para tarjetas y meta descripciones..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                  Descripción Completa
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs rounded-lg border border-input bg-background p-2.5 text-foreground"
                  placeholder="Detalles de ingeniería, materiales, compatibilidad..."
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
