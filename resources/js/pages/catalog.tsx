import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowUpDown,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Eye,
    Filter,
    Layers,
    Minus,
    Package,
    Pill,
    Plus,
    RotateCcw,
    Search,
    ShieldAlert,
    SlidersHorizontal,
    Sparkles,
    Star,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { CartDrawer } from '@/components/store/cart-drawer';
import { CheckoutDialog } from '@/components/store/checkout-dialog';
import { StoreFooter } from '@/components/store/store-footer';
import { StoreHeader } from '@/components/store/store-header';
import { useCart } from '@/hooks/use-cart';

interface Product {
    id: number;
    name: string;
    description?: string | null;
    active_ingredient?: string | null;
    dosage?: string | null;
    category: string;
    price: string | number;
    stock: number;
    prescription_type: 'otc' | 'rx';
    is_featured: boolean;
    badge?: string | null;
    manufacturer?: string | null;
    image_url?: string | null;
    image?: string | null;
}

interface CategoryWithCount {
    name: string;
    count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    products: {
        data: Product[];
        links: PaginationLink[];
        total: number;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
    };
    categories: CategoryWithCount[];
    priceBounds: {
        min: number;
        max: number;
    };
    filters: {
        search: string;
        category: string;
        min_price: string;
        max_price: string;
        prescription: string;
        in_stock: boolean;
        sort: string;
    };
}

export default function ProductsCatalog({
    products,
    categories,
    priceBounds,
    filters,
}: Props) {
    const { auth } = usePage().props as {
        auth?: { user?: { name: string; email: string; id: number } };
    };

    const {
        items: cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        selectedDelivery,
        setSelectedDelivery,
        deliveryFee,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
    } = useCart();

    const [search, setSearch] = useState(filters.search || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const applyFilters = (updates: Partial<typeof filters>) => {
        const merged = {
            search,
            category: filters.category,
            min_price: minPrice,
            max_price: maxPrice,
            prescription: filters.prescription,
            in_stock: filters.in_stock,
            sort: filters.sort,
            ...updates,
        };

        const query: Record<string, string> = {};
        if (merged.search) query.search = merged.search;
        if (merged.category && merged.category !== 'all') query.category = merged.category;
        if (merged.min_price) query.min_price = merged.min_price;
        if (merged.max_price) query.max_price = merged.max_price;
        if (merged.prescription && merged.prescription !== 'all') query.prescription = merged.prescription;
        if (merged.in_stock) query.in_stock = '1';
        if (merged.sort && merged.sort !== 'featured') query.sort = merged.sort;

        router.get('/catalog', query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleClearFilters = () => {
        setSearch('');
        setMinPrice('');
        setMaxPrice('');
        router.get('/catalog', {}, { preserveState: false, preserveScroll: true });
    };

    const hasActiveFilters =
        filters.search ||
        (filters.category && filters.category !== 'all') ||
        filters.min_price ||
        filters.max_price ||
        (filters.prescription && filters.prescription !== 'all') ||
        filters.in_stock;

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title="Medicines & Healthcare Store - PharmacyCat" />

            {/* Shared Store Header */}
            <StoreHeader
                cartCount={totalItems}
                onOpenCart={() => setIsCartOpen(true)}
            />

            {/* Breadcrumbs & Header Banner */}
            <div className="border-b border-border/80 bg-muted/20 py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Link href="/" className="hover:text-foreground">Home</Link>
                                <span>/</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Medicines</span>
                                {filters.category !== 'all' && (
                                    <>
                                        <span>/</span>
                                        <span className="font-medium text-foreground">{filters.category}</span>
                                    </>
                                )}
                            </div>
                            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                                Medicines & Healthcare Store
                            </h1>
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                Verified pharmaceuticals, over-the-counter remedies, and wellness essentials delivered within 30 minutes in Lusaka.
                            </p>
                        </div>

                        {/* Mobile Filter Trigger Button */}
                        <div className="flex items-center gap-2 lg:hidden mt-2 sm:mt-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="flex items-center gap-2 border-border font-semibold text-xs"
                            >
                                <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
                                Filters & Categories
                                {hasActiveFilters && (
                                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Catalog Section: Left Sidebar + Product Grid */}
            <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT SIDEBAR (Desktop) */}
                    <aside className="hidden lg:col-span-3 lg:block space-y-6">
                        <div className="sticky top-24 rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <h3 className="flex items-center gap-2 font-bold text-sm text-foreground">
                                    <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
                                    Filter Medications
                                </h3>
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="text-[11px] font-semibold text-rose-500 hover:underline"
                                    >
                                        Reset All
                                    </button>
                                )}
                            </div>

                            {/* Search Filter */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground">Search Keyword</Label>
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Name, ingredient..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-8 text-xs h-9"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch('');
                                                applyFilters({ search: '' });
                                            }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </form>
                            </div>

                            {/* Prescription Requirement */}
                            <div className="space-y-2 border-t border-border pt-4">
                                <Label className="text-xs font-semibold text-foreground">Prescription Type</Label>
                                <div className="space-y-1.5">
                                    {[
                                        { id: 'all', label: 'All Medications' },
                                        { id: 'otc', label: 'Over-The-Counter (OTC)' },
                                        { id: 'rx', label: 'Doctor Prescription (Rx)' },
                                    ].map((opt) => (
                                        <label
                                            key={opt.id}
                                            className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                                        >
                                            <input
                                                type="radio"
                                                name="prescription_type"
                                                checked={filters.prescription === opt.id}
                                                onChange={() => applyFilters({ prescription: opt.id })}
                                                className="h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500 border-border"
                                            />
                                            <span>{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Health Categories */}
                            <div className="space-y-2 border-t border-border pt-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-foreground">Categories</Label>
                                    <span className="text-[10px] text-muted-foreground">
                                        {categories.length} departments
                                    </span>
                                </div>

                                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                                    <button
                                        type="button"
                                        onClick={() => applyFilters({ category: 'all' })}
                                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                                            filters.category === 'all'
                                                ? 'bg-emerald-600 font-bold text-white'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                    >
                                        <span>All Categories</span>
                                        <span className={`text-[10px] ${filters.category === 'all' ? 'text-emerald-100' : 'text-muted-foreground'}`}>
                                            {products.total}
                                        </span>
                                    </button>

                                    {categories.map((cat) => {
                                        const isSelected = filters.category === cat.name;
                                        return (
                                            <button
                                                key={cat.name}
                                                type="button"
                                                onClick={() => applyFilters({ category: cat.name })}
                                                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                                                    isSelected
                                                        ? 'bg-emerald-600 font-bold text-white'
                                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                }`}
                                            >
                                                <span className="truncate">{cat.name}</span>
                                                <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-muted-foreground'}`}>
                                                    {cat.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div className="space-y-2 border-t border-border pt-4">
                                <Label className="text-xs font-semibold text-foreground">Price Range (K)</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="h-8 text-xs"
                                    />
                                    <span className="text-xs text-muted-foreground">-</span>
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="h-8 text-xs"
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => applyFilters({ min_price: minPrice, max_price: maxPrice })}
                                        className="h-8 px-2.5 text-xs font-semibold"
                                    >
                                        Go
                                    </Button>
                                </div>

                                {/* Quick Price Chips */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {[
                                        { label: '< K50', max: '50' },
                                        { label: 'K50 - K100', min: '50', max: '100' },
                                        { label: 'K100 - K200', min: '100', max: '200' },
                                        { label: 'K200+', min: '200' },
                                    ].map((chip, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setMinPrice(chip.min || '');
                                                setMaxPrice(chip.max || '');
                                                applyFilters({
                                                    min_price: chip.min || '',
                                                    max_price: chip.max || '',
                                                });
                                            }}
                                            className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
                                        >
                                            {chip.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Availability Filter */}
                            <div className="border-t border-border pt-4">
                                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                                    <input
                                        type="checkbox"
                                        checked={filters.in_stock}
                                        onChange={(e) => applyFilters({ in_stock: e.target.checked })}
                                        className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="font-medium">In-Stock Only</span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA (Products Grid) */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Toolbar: Count, Filter Chips, Sort Dropdown */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-foreground">
                                    Showing {products.from || 0}–{products.to || 0} of {products.total} products
                                </span>
                                {filters.category !== 'all' && (
                                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                                        {filters.category}
                                    </Badge>
                                )}
                            </div>

                            {/* Sorting */}
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">Sort By:</span>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => applyFilters({ sort: e.target.value })}
                                    className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="featured">Featured First</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="name_asc">Name: A to Z</option>
                                    <option value="latest">Newest Additions</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filter Chips */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs text-muted-foreground">Active filters:</span>
                                {filters.search && (
                                    <Badge variant="secondary" className="gap-1 text-xs">
                                        Search: "{filters.search}"
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => {
                                                setSearch('');
                                                applyFilters({ search: '' });
                                            }}
                                        />
                                    </Badge>
                                )}
                                {filters.category !== 'all' && (
                                    <Badge variant="secondary" className="gap-1 text-xs">
                                        Category: {filters.category}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => applyFilters({ category: 'all' })}
                                        />
                                    </Badge>
                                )}
                                {filters.prescription !== 'all' && (
                                    <Badge variant="secondary" className="gap-1 text-xs uppercase">
                                        {filters.prescription}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => applyFilters({ prescription: 'all' })}
                                        />
                                    </Badge>
                                )}
                                {(filters.min_price || filters.max_price) && (
                                    <Badge variant="secondary" className="gap-1 text-xs">
                                        Price: K{filters.min_price || '0'} - K{filters.max_price || '+'}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => {
                                                setMinPrice('');
                                                setMaxPrice('');
                                                applyFilters({ min_price: '', max_price: '' });
                                            }}
                                        />
                                    </Badge>
                                )}
                                {filters.in_stock && (
                                    <Badge variant="secondary" className="gap-1 text-xs">
                                        In Stock Only
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => applyFilters({ in_stock: false })}
                                        />
                                    </Badge>
                                )}

                                <button
                                    onClick={handleClearFilters}
                                    className="text-xs font-semibold text-rose-500 hover:underline ml-2"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Products Grid */}
                        {products.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card">
                                <div className="rounded-full bg-muted p-4 text-muted-foreground">
                                    <Package className="h-10 w-10 stroke-[1.5]" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-foreground">No medications match your filter</h3>
                                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                                    Try clearing selected categories, widening the price bounds, or searching for alternative medication keywords.
                                </p>
                                <Button
                                    onClick={handleClearFilters}
                                    className="mt-5 bg-emerald-600 text-white hover:bg-emerald-700"
                                    size="sm"
                                >
                                    Reset All Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
                                {products.data.map((product) => {
                                    const cartItem = cartItems.find((i) => i.id === product.id);
                                    const isRx = product.prescription_type === 'rx';

                                    return (
                                        <div
                                            key={product.id}
                                            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-500/40"
                                        >
                                            {/* Image & Badges */}
                                            <div>
                                                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/60 bg-muted/30">
                                                    <img
                                                        src={product.image_url || product.image || '/images/products/paracetamol.jpg'}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />

                                                    {/* Floating Badges */}
                                                    <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
                                                        <span
                                                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                                                                isRx
                                                                    ? 'bg-amber-500/90 text-slate-950 font-black'
                                                                    : 'bg-emerald-600/90 text-white'
                                                            }`}
                                                        >
                                                            {isRx ? 'Rx Required' : 'OTC'}
                                                        </span>
                                                        {product.badge && (
                                                            <span className="rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                                                                {product.badge}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {product.is_featured && (
                                                        <div className="absolute right-2.5 top-2.5 rounded-full bg-amber-400 p-1 text-slate-900 shadow">
                                                            <Star className="h-3 w-3 fill-current" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Meta Info */}
                                                <div className="mt-3.5 space-y-1">
                                                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                            {product.category}
                                                        </span>
                                                        {product.manufacturer && (
                                                            <span className="truncate max-w-[110px]">
                                                                {product.manufacturer}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="line-clamp-2 text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                                                        {product.name}
                                                    </h3>

                                                    {product.dosage && (
                                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                                            {product.dosage}
                                                        </p>
                                                    )}

                                                    {product.active_ingredient && (
                                                        <p className="text-[11px] italic text-muted-foreground/80 line-clamp-1">
                                                            Ingredient: {product.active_ingredient}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price & Add to Cart Footer */}
                                            <div className="mt-4 border-t border-border/80 pt-3 flex items-center justify-between gap-2">
                                                <div>
                                                    <div className="text-base font-extrabold text-foreground">
                                                        K{Number(product.price).toFixed(2)}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {product.stock <= 0 ? (
                                                            <span className="text-rose-500 font-bold">Out of stock</span>
                                                        ) : product.stock < 10 ? (
                                                            <span className="text-amber-600 font-semibold">{product.stock} left</span>
                                                        ) : (
                                                            <span className="text-emerald-600 font-semibold">In Stock</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cart Action */}
                                                {product.stock <= 0 ? (
                                                    <Button disabled size="sm" variant="outline" className="text-xs h-8">
                                                        Out of stock
                                                    </Button>
                                                ) : cartItem ? (
                                                    <div className="flex items-center rounded-lg border border-emerald-600 bg-emerald-500/10">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                                                            className="p-1.5 text-emerald-700 hover:bg-emerald-500/20 rounded-l-lg"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="px-2 text-xs font-bold text-emerald-700">
                                                            {cartItem.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                                                            className="p-1.5 text-emerald-700 hover:bg-emerald-500/20 rounded-r-lg"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={() => addToCart(product, 1)}
                                                        className="bg-emerald-600 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 h-8 px-3"
                                                    >
                                                        <Plus className="mr-1 h-3.5 w-3.5" />
                                                        Add to Cart
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination Bar */}
                        {products.last_page > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
                                <div>
                                    Showing <span className="font-bold text-foreground">{products.from}</span> to{' '}
                                    <span className="font-bold text-foreground">{products.to}</span> of{' '}
                                    <span className="font-bold text-foreground">{products.total}</span> products
                                </div>

                                <div className="flex items-center gap-1">
                                    {products.links.map((link, idx) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={idx}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    className="rounded px-3 py-1.5 text-muted-foreground/40"
                                                />
                                            );
                                        }
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                preserveScroll
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`rounded-lg px-3 py-1.5 transition font-semibold ${
                                                    link.active
                                                        ? 'bg-emerald-600 text-white shadow-sm'
                                                        : 'hover:bg-muted text-foreground'
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Filter Sheet */}
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetContent side="left" className="w-[300px] overflow-y-auto sm:w-[350px]">
                    <SheetHeader>
                        <SheetTitle className="text-base font-bold">Filter Products</SheetTitle>
                        <SheetDescription className="text-xs">
                            Narrow down medications and wellness catalog
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6">
                        {/* Prescription */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">Prescription Requirement</Label>
                            <div className="space-y-1.5">
                                {[
                                    { id: 'all', label: 'All Medications' },
                                    { id: 'otc', label: 'Over-The-Counter (OTC)' },
                                    { id: 'rx', label: 'Doctor Prescription (Rx)' },
                                ].map((opt) => (
                                    <label key={opt.id} className="flex items-center gap-2 text-xs">
                                        <input
                                            type="radio"
                                            name="m_prescription_type"
                                            checked={filters.prescription === opt.id}
                                            onChange={() => {
                                                applyFilters({ prescription: opt.id });
                                                setIsMobileFilterOpen(false);
                                            }}
                                            className="h-3.5 w-3.5 text-emerald-600"
                                        />
                                        <span>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">Categories</Label>
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                <button
                                    onClick={() => {
                                        applyFilters({ category: 'all' });
                                        setIsMobileFilterOpen(false);
                                    }}
                                    className={`w-full text-left text-xs p-2 rounded-md ${filters.category === 'all' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-muted'}`}
                                >
                                    All Categories
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => {
                                            applyFilters({ category: cat.name });
                                            setIsMobileFilterOpen(false);
                                        }}
                                        className={`w-full text-left text-xs p-2 rounded-md flex justify-between ${filters.category === cat.name ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-muted'}`}
                                    >
                                        <span>{cat.name}</span>
                                        <span className="opacity-70">{cat.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* In Stock */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium">
                                <input
                                    type="checkbox"
                                    checked={filters.in_stock}
                                    onChange={(e) => {
                                        applyFilters({ in_stock: e.target.checked });
                                        setIsMobileFilterOpen(false);
                                    }}
                                    className="h-4 w-4 rounded text-emerald-600"
                                />
                                <span>In Stock Only</span>
                            </label>
                        </div>

                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    handleClearFilters();
                                    setIsMobileFilterOpen(false);
                                }}
                                className="w-full text-rose-500 hover:text-rose-600 text-xs"
                            >
                                Reset All Filters
                            </Button>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                totalAmount={totalAmount}
                selectedDelivery={selectedDelivery}
                onSelectDelivery={setSelectedDelivery}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onProceedToCheckout={() => {
                    if (!auth?.user) {
                        router.visit('/login');
                        return;
                    }
                    setIsCheckoutOpen(true);
                }}
            />

            {/* Checkout Dialog */}
            <CheckoutDialog
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                items={cartItems}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                totalAmount={totalAmount}
                selectedDelivery={selectedDelivery}
                onSelectDelivery={setSelectedDelivery}
                onOrderPlaced={clearCart}
            />

            {/* Shared Store Footer */}
            <StoreFooter />
        </div>
    );
}
