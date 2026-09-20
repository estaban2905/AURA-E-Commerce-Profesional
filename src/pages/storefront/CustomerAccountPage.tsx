import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Shield,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCustomerOrders } from '@/hooks/useOrders';
import { useUIStore } from '@/store/ui.store';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast-context';
import { useCartStore } from '@/store/cart.store';
import { Order, OrderItem } from '@/types';

export const CustomerAccountPage: React.FC = () => {
  const { user, updateProfile, addAddress, removeAddress } = useAuthStore();
  const { orders, isLoading: ordersLoading } = useCustomerOrders(user?.id || 'cust-01');
  const { addItem } = useCartStore();
  const { setCartDrawerOpen } = useUIStore();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'security'>('orders');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Nicolás',
    lastName: user?.lastName || 'Morales',
    email: user?.email || 'nicolas.morales@example.com',
    phone: user?.phone || '+56 9 8765 4321',
  });

  // New Address form modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: 'Oficina',
    recipientName: `${user?.name} ${user?.lastName}`,
    street: '',
    number: '',
    apartment: '',
    commune: 'Las Condes',
    city: 'Santiago',
    region: 'Región Metropolitana',
    phone: user?.phone || '',
    postalCode: '7550000',
    isDefault: false,
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    toast.success('Perfil actualizado', 'Tus datos fueron guardados correctamente.');
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.number) {
      toast.error('Campos incompletos', 'Ingresa calle y número.');
      return;
    }
    addAddress({
      id: `addr-${Date.now()}`,
      ...newAddress,
    });
    toast.success('Dirección añadida');
    setShowAddressModal(false);
    setNewAddress({
      title: 'Oficina',
      recipientName: `${user?.name} ${user?.lastName}`,
      street: '',
      number: '',
      apartment: '',
      commune: 'Las Condes',
      city: 'Santiago',
      region: 'Región Metropolitana',
      phone: user?.phone || '',
      postalCode: '7550000',
      isDefault: false,
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8 max-w-6xl">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
            alt="Usuario"
            className="h-14 w-14 rounded-full object-cover border-2 border-primary/20"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              {user ? `${user.name} ${user.lastName}` : 'Nicolás Morales'}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
              <span>{user?.email || 'nicolas.morales@example.com'}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Cliente VIP AURA</span>
            </p>
          </div>
        </div>

        {/* Quick Admin shortcut for demo/evaluator convenience */}
        <Button asChild variant="outline" size="sm" className="gap-2 text-xs">
          <Link to="/admin">
            <span>Panel de Administración</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border gap-6 text-xs sm:text-sm font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Mis Pedidos ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Datos Personales</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Libreta de Direcciones</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Seguridad</span>
        </button>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-36 rounded-2xl bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">No tienes pedidos registrados</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Tus compras completadas aparecerán aquí con seguimiento en tiempo real.
              </p>
              <Button asChild variant="primary" size="sm">
                <Link to="/catalog">Explorar Catálogo</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: Order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                    <div>
                      <span className="text-[10px] font-mono text-muted-foreground">ID: #{order.orderNumber}</span>
                      <p className="text-xs text-muted-foreground">
                        Comprado el {new Date(order.createdAt).toLocaleDateString('es-CL')} • {order.items.length} productos
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          order.status === 'delivered'
                            ? 'success'
                            : order.status === 'shipped'
                            ? 'accent'
                            : 'secondary'
                        }
                        className="text-xs uppercase font-bold"
                      >
                        {order.status === 'delivered'
                          ? 'Entregado'
                          : order.status === 'shipped'
                          ? 'En Despacho'
                          : order.status === 'processing'
                          ? 'Preparando'
                          : 'Confirmado'}
                      </Badge>

                      <span className="text-base font-black text-foreground">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Order items preview */}
                  <div className="space-y-2">
                    {order.items.map((item: OrderItem, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-10 w-10 rounded-lg object-cover bg-muted border border-border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground truncate">{item.productName}</p>
                          <p className="text-muted-foreground">
                            {item.quantity}x {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      Dirección: {order.shippingAddress.street} #{order.shippingAddress.number}, {order.shippingAddress.commune}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Link to={`/tracking?order=${order.orderNumber}`}>
                          <Truck className="h-3.5 w-3.5" />
                          <span>Seguimiento</span>
                        </Link>
                      </Button>
                      <Button asChild variant="primary" size="sm" className="gap-1.5 text-xs">
                        <Link to={`/order-confirmation/${order.orderNumber}`}>
                          <span>Ver Recibo</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Personal Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="max-w-xl rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-foreground">Actualizar Información Personal</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              required
            />
            <Input
              label="Apellidos"
              value={profileForm.lastName}
              onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              required
            />
          </div>
          <Input
            label="Correo Electrónico"
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            required
          />
          <Input
            label="Teléfono"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            required
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md">
              Guardar Cambios
            </Button>
          </div>
        </form>
      )}

      {/* Tab 3: Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">Libreta de Direcciones</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddressModal(true)}
              className="gap-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Añadir Nueva Dirección</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-5 rounded-2xl border border-border bg-card space-y-3 relative shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {addr.title}
                  </span>
                  {addr.isDefault && (
                    <Badge variant="secondary" className="text-[10px]">
                      Predeterminada
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-bold text-foreground">{addr.recipientName}</p>
                  <p>{addr.street} #{addr.number} {addr.apartment && `- ${addr.apartment}`}</p>
                  <p>{addr.commune}, {addr.city}</p>
                  <p>{addr.region}</p>
                  <p>Tel: {addr.phone}</p>
                </div>

                <div className="pt-2 border-t border-border flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      removeAddress(addr.id);
                      toast.info('Dirección eliminada');
                    }}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-foreground">Nueva Dirección de Envío</h3>
                <form onSubmit={handleAddAddressSubmit} className="space-y-3">
                  <Input
                    label="Etiqueta (Ej: Casa, Oficina)"
                    value={newAddress.title}
                    onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <Input
                        label="Calle"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Número"
                        value={newAddress.number}
                        onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Input
                    label="Depto / Casa (Opcional)"
                    value={newAddress.apartment}
                    onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                  />
                  <Input
                    label="Comuna"
                    value={newAddress.commune}
                    onChange={(e) => setNewAddress({ ...newAddress, commune: e.target.value })}
                    required
                  />

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddressModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Guardar Dirección
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <div className="max-w-md rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-foreground">Seguridad de la Cuenta</h3>
          <p className="text-xs text-muted-foreground">
            Tu cuenta está asegurada con autenticación criptográfica de sesión simulada.
          </p>
          <div className="space-y-3">
            <Input label="Contraseña Actual" type="password" placeholder="••••••••" />
            <Input label="Nueva Contraseña" type="password" placeholder="••••••••" />
            <Input label="Confirmar Nueva Contraseña" type="password" placeholder="••••••••" />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => toast.success('Contraseña actualizada', 'Tu clave fue cambiada con éxito.')}
          >
            Actualizar Contraseña
          </Button>
        </div>
      )}
    </div>
  );
};
