import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist.store';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { useToast } from '@/components/ui/toast-context';

export const WishlistPage: React.FC = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { setCartDrawerOpen } = useUIStore();
  const toast = useToast();

  const handleMoveToCart = (product: any) => {
    addItem(product, product.variants?.[0], 1);
    removeItem(product.id);
    toast.success('Movido al carrito', `${product.name} fue agregado.`);
    setCartDrawerOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
          <Heart className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Tu lista de deseos está vacía</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 mb-6">
          Guarda tus artículos favoritos para comprarlos más adelante o comparar especificaciones.
        </p>
        <Button asChild variant="primary" size="lg">
          <Link to="/catalog">Explorar Catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Lista de Deseos ({items.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Tus productos guardados para seguimiento de precio o futura compra.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearWishlist} className="text-xs text-rose-500 hover:text-rose-600">
          Vaciar lista
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div
            key={product.id}
            className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-xs"
          >
            <div className="relative aspect-square bg-muted/20">
              <Link to={`/product/${product.slug}`}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </Link>
              <button
                type="button"
                onClick={() => removeItem(product.id)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 backdrop-blur-xs text-muted-foreground hover:text-rose-500 shadow-xs transition-colors"
                title="Eliminar de favoritos"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  {product.brand}
                </span>
                <Link
                  to={`/product/${product.slug}`}
                  className="block text-sm font-bold text-foreground hover:text-primary line-clamp-1 mt-0.5"
                >
                  {product.name}
                </Link>
                <div className="mt-1">
                  <Rating value={product.rating} size="sm" showCount={false} />
                </div>
                <p className="text-base font-black text-foreground mt-2">
                  {formatCurrency(product.price)}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-border">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleMoveToCart(product)}
                  className="w-full gap-2 text-xs"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Mover al Carrito</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
