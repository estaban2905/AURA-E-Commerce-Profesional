import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  Shield,
  LogOut,
  ChevronDown,
  ArrowUpRight,
  PackageCheck,
} from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useAuthStore } from '@/store/auth.store';
import { mockCategories } from '@/data/categories';

export const Header: React.FC = () => {
  const { theme, toggleTheme, setCartDrawerOpen, setSearchModalOpen, mobileMenuOpen, setMobileMenuOpen } =
    useUIStore();
  const { getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md transition-colors">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <div className="container mx-auto flex items-center justify-between">
          <span className="hidden sm:inline-block">📦 Despacho express gratis en compras sobre $50.000</span>
          <span className="mx-auto sm:mx-0">
            AURA Studio • Usa el cupón <strong className="underline uppercase">BIENVENIDO10</strong> para 10% OFF
          </span>
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/tracking" className="hover:underline opacity-90">Seguimiento</Link>
            <span>•</span>
            <Link to="/faq" className="hover:underline opacity-90">Ayuda</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-foreground hover:bg-muted"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center font-black text-base tracking-tighter">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-foreground leading-none">
                  AURA
                </span>
                <span className="text-[9px] font-semibold tracking-widest text-muted-foreground uppercase leading-tight">
                  TECH & DESIGN
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary font-semibold' : 'text-foreground/80'
              }`}
            >
              Inicio
            </Link>

            {/* Categories Mega Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1 transition-colors hover:text-primary ${
                  location.pathname.startsWith('/catalog') ? 'text-primary font-semibold' : 'text-foreground/80'
                }`}
                onClick={() => navigate('/catalog')}
              >
                <span>Catálogo</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {/* Dropdown Menu */}
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50">
                  <div className="rounded-xl border border-border bg-card p-2 shadow-xl">
                    <Link
                      to="/catalog"
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs font-bold text-primary hover:bg-muted rounded-lg"
                    >
                      <span>Ver Todo el Catálogo</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <div className="h-px bg-border/60 my-1" />
                    {mockCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/catalog?category=${cat.id}`}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-xs text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-muted-foreground">{cat.itemCount}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/catalog?filter=offers"
              className={`transition-colors hover:text-primary flex items-center gap-1 ${
                location.search.includes('offers') ? 'text-primary font-semibold' : 'text-foreground/80'
              }`}
            >
              <span className="text-rose-500 font-semibold">•</span>
              <span>Ofertas</span>
            </Link>

            <Link
              to="/blog"
              className={`transition-colors hover:text-primary ${
                isActive('/blog') ? 'text-primary font-semibold' : 'text-foreground/80'
              }`}
            >
              Blog & Reviews
            </Link>

            <Link
              to="/tracking"
              className={`transition-colors hover:text-primary ${
                isActive('/tracking') ? 'text-primary font-semibold' : 'text-foreground/80'
              }`}
            >
              Seguimiento
            </Link>
          </nav>

          {/* Right Actions: Search trigger, Theme switch, Wishlist, Cart, Account, Admin Mode */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Search Button (Opens Modal) */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 rounded-full border border-input bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
              aria-label="Buscar productos"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Buscar...</span>
              <kbd className="hidden md:inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full p-2 text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative rounded-full p-2 text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Lista de deseos"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex items-center gap-1.5 rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity"
              aria-label="Ver carrito"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Carrito</span>
              {cartCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1 rounded-full p-1.5 hover:bg-muted text-foreground transition-colors border border-border/40"
                aria-label="Mi Cuenta"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl z-50 text-xs"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-3 py-2 border-b border-border/60">
                        <p className="font-semibold text-foreground">{user.name} {user.lastName}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-foreground"
                        >
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Mi Perfil</span>
                        </Link>
                        <Link
                          to="/account/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-foreground"
                        >
                          <PackageCheck className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Mis Pedidos</span>
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-foreground"
                        >
                          <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Lista de Deseos</span>
                        </Link>
                      </div>

                      <div className="h-px bg-border/60 my-1" />

                      {/* Admin Portal Link */}
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="h-3.5 w-3.5" />
                          <span>Panel Admin</span>
                        </div>
                        <Shield className="h-3 w-3" />
                      </Link>

                      <div className="h-px bg-border/60 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-2 space-y-2">
                      <p className="text-center font-semibold text-foreground">Bienvenido a AURA</p>
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block w-full text-center py-2 px-3 bg-primary text-primary-foreground font-semibold rounded-lg"
                      >
                        Iniciar Sesión
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block w-full text-center py-2 px-3 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80"
                      >
                        Crear Cuenta
                      </Link>
                      <div className="h-px bg-border my-1" />
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-center gap-1.5 text-[11px] text-primary hover:underline"
                      >
                        <Shield className="h-3 w-3" />
                        <span>Demo Panel Administrador</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-muted"
            >
              Inicio
            </Link>
            <Link
              to="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-muted"
            >
              Catálogo Completo
            </Link>
            <Link
              to="/catalog?filter=offers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-muted text-rose-500 font-semibold"
            >
              Ofertas Especiales
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-muted"
            >
              Blog & Guías
            </Link>
            <Link
              to="/tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-muted"
            >
              Rastrear Pedido
            </Link>
            <div className="h-px bg-border my-1" />
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg bg-primary/10 text-primary font-semibold flex items-center justify-between"
            >
              <span>Acceder a Panel Administrador</span>
              <Shield className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
