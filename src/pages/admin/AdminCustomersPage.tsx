import React, { useState, useEffect } from 'react';
import { Search, Users, Mail, Phone, Calendar, ShoppingBag, DollarSign, X } from 'lucide-react';
import { customerService } from '@/services/customer.service';
import { Customer } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    customerService.getCustomers().then((data) => {
      setCustomers(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = customers.filter(
    (c) =>
      `${c.name} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Directorio de Clientes ({customers.length})
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Perfiles registrados, historial acumulado de compras y segmentación de valor.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Teléfono</th>
                <th className="p-4 font-semibold">Pedidos</th>
                <th className="p-4 font-semibold">Gasto Total</th>
                <th className="p-4 font-semibold">Segmento</th>
                <th className="p-4 font-semibold text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Cargando clientes...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No se encontraron clientes.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={c.name}
                        className="h-9 w-9 rounded-full object-cover border border-border"
                      />
                      <div>
                        <p className="font-bold text-foreground">{c.name} {c.lastName}</p>
                        <p className="text-[10px] text-muted-foreground">Registrado {c.createdAt}</p>
                      </div>
                    </td>

                    <td className="p-4 text-muted-foreground font-mono">{c.email}</td>
                    <td className="p-4 text-muted-foreground">{c.phone}</td>
                    <td className="p-4 font-semibold text-foreground">{c.ordersCount} órdenes</td>
                    <td className="p-4 font-black text-foreground">{formatCurrency(c.totalSpent)}</td>
                    <td className="p-4">
                      <Badge
                        variant={c.status === 'active' ? 'success' : c.status === 'inactive' ? 'secondary' : 'destructive'}
                        className="text-[10px] uppercase font-bold"
                      >
                        {c.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCustomer(c)}
                        className="text-xs"
                      >
                        Ver Perfil
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="h-12 w-12 rounded-full object-cover border border-border"
                />
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {selectedCustomer.name} {selectedCustomer.lastName}
                  </h3>
                  <Badge variant="accent" className="text-[10px] uppercase">
                    Cliente {selectedCustomer.status}
                  </Badge>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-semibold text-foreground">{selectedCustomer.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="font-semibold text-foreground">{selectedCustomer.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Total Compras:</span>
                <span className="font-black text-primary text-sm">
                  {formatCurrency(selectedCustomer.totalSpent)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Direcciones Registradas
              </h4>
              <div className="space-y-2">
                {selectedCustomer.addresses.map((addr) => (
                  <div key={addr.id} className="p-3 rounded-xl border border-border bg-muted/20 text-xs">
                    <p className="font-bold text-foreground">{addr.title}</p>
                    <p className="text-muted-foreground">{addr.street} #{addr.number} {addr.apartment}</p>
                    <p className="text-muted-foreground">{addr.commune}, {addr.city}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
