import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    ArrowRight,
    Award,
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    Heart,
    HeartHandshake,
    Minus,
    Package,
    Phone,
    Pill,
    Plus,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Store,
    Truck,
    Upload,
    Users,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count: number;
}

interface Props {
    featuredProducts: Product[];
    categories: Category[];
    totalProductsCount: number;
}

export default function Welcome({
    featuredProducts = [],
    categories = [],
    totalProductsCount = 20,
}: Props) {
    const heroProduct = featuredProducts[0] || null;

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

    const [heroSearch, setHeroSearch] = useState('');

    const handleHeroSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (heroSearch.trim()) {
            router.get(`/catalog?search=${encodeURIComponent(heroSearch.trim())}`);
        } else {
            router.get('/catalog');
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
            <Head title="PharmacyCat - Modern Zambian Pharmacy & 30-Min Medicine Delivery" />

            {/* Navigation Header */}
            <StoreHeader
                cartCount={totalItems}
                onOpenCart={() => setIsCartOpen(true)}
            />

            {/* 1. HERO SECTION — CLEAN & FOCUSED */}
            <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 py-20 md:py-28 text-white">
                {/* Single soft ambient glow — not distracting */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[140px]" />
                </div>

                <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    {/* Status badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Licensed Zambian Dispensary — Open Now
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.1]">
                        Medicines delivered{' '}
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                            in 30 minutes.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mt-5 max-w-xl text-base text-slate-300/80 sm:text-lg leading-relaxed">
                        Prescription drugs, OTC medications, vitamins and first-aid essentials — sourced from certified labs and dispatched via Yango or inDrive across Lusaka.
                    </p>

                    {/* Search bar */}
                    <form
                        onSubmit={handleHeroSearch}
                        className="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-2xl border border-white/15 bg-white/8 p-2 backdrop-blur-md shadow-xl"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search Paracetamol, Amoxicillin, Vitamin C…"
                                value={heroSearch}
                                onChange={(e) => setHeroSearch(e.target.value)}
                                className="h-11 w-full rounded-xl bg-transparent pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="h-11 shrink-0 bg-emerald-500 px-6 font-bold text-slate-950 hover:bg-emerald-400 shadow-md"
                        >
                            Search
                        </Button>
                    </form>

                    {/* CTA row */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <Button
                            asChild
                            size="lg"
                            className="bg-emerald-600 font-bold text-white hover:bg-emerald-500 shadow-lg"
                        >
                            <Link href="/catalog">
                                Shop All Medicines
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <a
                            href="https://wa.me/260971234567?text=Hello%20PharmacyCat,%20I%20have%20a%20prescription%20to%20fill"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            <Phone className="h-4 w-4 text-emerald-400" />
                            WhatsApp Prescription
                        </a>
                    </div>

                    {/* Trust strip */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-current" />
                                ))}
                            </div>
                            <span className="text-white font-semibold">4.9 / 5</span>
                        </div>
                        <span>·</span>
                        <span><span className="text-white font-bold">2,400+</span> Lusaka deliveries</span>
                        <span>·</span>
                        <span><span className="text-white font-bold">100%</span> genuine medicines</span>
                        <span>·</span>
                        <span>Free delivery over <span className="text-white font-bold">K350</span></span>
                    </div>
                </div>
            </section>

            {/* 2. GUARANTEES / VALUE PROPOSITION GRID */}
            <section className="border-b border-border bg-card py-6 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
                        <div className="flex items-center gap-3.5 rounded-xl border border-border/60 p-3.5 bg-muted/20">
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                                <Truck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">30-Min Delivery</h4>
                                <p className="text-[11px] text-muted-foreground">Rapid citywide dispatch in Lusaka</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-xl border border-border/60 p-3.5 bg-muted/20">
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Authentic Drugs</h4>
                                <p className="text-[11px] text-muted-foreground">Direct from certified pharmaceutical labs</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-xl border border-border/60 p-3.5 bg-muted/20">
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                                <HeartHandshake className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Licensed Chemists</h4>
                                <p className="text-[11px] text-muted-foreground">Free dosage & interaction guidance</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-xl border border-border/60 p-3.5 bg-muted/20">
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">MoMo & Cash</h4>
                                <p className="text-[11px] text-muted-foreground">Airtel, MTN, Card, or Cash on delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SHOP BY HEALTH DEPARTMENT (STRUCTURED GRID) */}
            <section className="py-14 sm:py-20 bg-background">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
                        <div>
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                BROWSE DEPARTMENTS
                            </span>
                            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                                Shop by Health Category
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                Find targeted medications, wellness remedies, and essential first aid supplies.
                            </p>
                        </div>

                        <Link
                            href="/catalog"
                            className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400 self-start sm:self-auto"
                        >
                            View all categories →
                        </Link>
                    </div>

                    {/* Category Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                        {categories.map((cat) => {
                            const iconMap: Record<string, any> = {
                                'Pain Relief': Pill,
                                'Cold & Flu': Activity,
                                'Vitamins & Supplements': Zap,
                                'Antibiotics': ShieldCheck,
                                'First Aid': Heart,
                                'Medical Devices': Package,
                                'Skincare': Sparkles,
                                'Baby Care': Users,
                            };
                            const Icon = iconMap[cat.name] || Pill;

                            return (
                                <Link
                                    key={cat.id}
                                    href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                                    className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-500/50 hover:-translate-y-0.5"
                                >
                                    <div>
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-3.5 text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                                            {cat.name}
                                        </h3>
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                            {cat.products_count} product{cat.products_count === 1 ? '' : 's'} available
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                        <span>Shop Department</span>
                                        <span>→</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. CURATED FEATURED PRODUCTS (NOT EVERY SINGLE PRODUCT!) */}
            <section className="py-14 sm:py-20 border-t border-border bg-muted/20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
                        <div>
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                DISPENSARY PICKS
                            </span>
                            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                                Featured Medications & Essentials
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                Curated best sellers ready for immediate 30-min courier dispatch.
                            </p>
                        </div>

                        <Link
                            href="/catalog"
                            className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400 self-start sm:self-auto"
                        >
                            View all medicines →
                        </Link>
                    </div>

                    {/* Featured Products Grid (Max 6-8 items) */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {featuredProducts.slice(0, 8).map((product) => {
                            const cartItem = cartItems.find((i) => i.id === product.id);
                            const isRx = product.prescription_type === 'rx';

                            return (
                                <div
                                    key={product.id}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-500/40"
                                >
                                    <div>
                                        {/* Image Box */}
                                        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/60 bg-muted/30">
                                            <img
                                                src={product.image_url || product.image || '/images/products/paracetamol.jpg'}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
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
                                        </div>

                                        {/* Content */}
                                        <div className="mt-3.5 space-y-1">
                                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {product.category}
                                                </span>
                                                {product.manufacturer && (
                                                    <span className="truncate max-w-[100px]">
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
                                        </div>
                                    </div>

                                    {/* Price & Add to Cart Footer */}
                                    <div className="mt-4 border-t border-border/80 pt-3 flex items-center justify-between gap-2">
                                        <div>
                                            <div className="text-base font-extrabold text-foreground">
                                                K{Number(product.price).toFixed(2)}
                                            </div>
                                            <div className="text-[10px] text-emerald-600 font-semibold">
                                                In Stock
                                            </div>
                                        </div>

                                        {cartItem ? (
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
                                                Add
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Specialty Medications & Inquiries Callout */}
                    <div className="mt-10 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-900 to-teal-950 p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold sm:text-2xl">
                                Looking for a specific brand or specialty medication?
                            </h3>
                            <p className="mt-1 text-xs text-emerald-200/90 sm:text-sm">
                                Our registered pharmacists can source hard-to-find medications or prepare orders directly for you.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <Button asChild size="lg" className="bg-white font-bold text-slate-950 hover:bg-emerald-100">
                                <Link href="/catalog">
                                    Browse Medicines
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                                <Link href="/contact">
                                    Talk to Pharmacist
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. PRESCRIPTION UPLOAD & PHARMACIST CONSULTATION BANNER */}
            <section className="py-14 sm:py-20 bg-background border-t border-border">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="grid items-center gap-10 lg:grid-cols-12 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm">
                        <div className="space-y-4 lg:col-span-7">
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                PRESCRIPTIONS & DOCTOR ORDERS
                            </span>
                            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                                Have a Doctor's Prescription? Let Us Prepare It For You.
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Avoid waiting in dispensary queues. Simply snap a photo of your prescription slip and send it directly to our registered Zambian pharmacists via WhatsApp or phone.
                            </p>

                            {/* 3 Step Timeline */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
                                <div className="rounded-xl border border-border/60 p-3 bg-muted/20">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white mb-2">
                                        1
                                    </div>
                                    <h4 className="text-xs font-bold text-foreground">Snap Slip</h4>
                                    <p className="text-[11px] text-muted-foreground">Take a clear photo of doctor's note</p>
                                </div>
                                <div className="rounded-xl border border-border/60 p-3 bg-muted/20">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white mb-2">
                                        2
                                    </div>
                                    <h4 className="text-xs font-bold text-foreground">Pharmacist Review</h4>
                                    <p className="text-[11px] text-muted-foreground">We verify dosage and confirm total</p>
                                </div>
                                <div className="rounded-xl border border-border/60 p-3 bg-muted/20">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white mb-2">
                                        3
                                    </div>
                                    <h4 className="text-xs font-bold text-foreground">Doorstep Delivery</h4>
                                    <p className="text-[11px] text-muted-foreground">Dispatched in tamper-sealed pack</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-3">
                                <Button asChild className="bg-emerald-600 text-white font-bold hover:bg-emerald-700">
                                    <a
                                        href="https://wa.me/260971234567?text=Hello%20PharmacyCat,%20I%20have%20a%20doctor%20prescription%20I%20would%20like%20to%20fill"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Phone className="mr-2 h-4 w-4" />
                                        WhatsApp Prescription (+260 97 123 4567)
                                    </a>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/contact">
                                        Ask a Pharmacist
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Visual Right Side */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="w-full max-w-sm rounded-2xl border border-border bg-muted/40 p-5 shadow-sm text-center space-y-3">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                                    <FileText className="h-7 w-7" />
                                </div>
                                <h3 className="font-bold text-base text-foreground">Certified Zambian Dispensary</h3>
                                <p className="text-xs text-muted-foreground">
                                    All prescriptions are dispensed under strict regulatory oversight of licensed Zambian medical professionals.
                                </p>
                                <div className="rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground text-left space-y-1">
                                    <div className="flex items-center gap-1.5 text-foreground font-semibold">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        Dispensary Hours
                                    </div>
                                    <p className="text-[11px]">Monday to Sunday: 07:30 AM – 10:00 PM</p>
                                    <p className="text-[11px]">Emergency dispatch: Available on WhatsApp</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. HOW IT WORKS / DISPATCH TIMELINE (3-COLUMN GRID) */}
            <section className="py-14 sm:py-20 border-t border-border bg-muted/20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                        SIMPLE & FAST
                    </span>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                        How PharmacyCat Works
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm max-w-xl mx-auto">
                        Getting your medications in Lusaka has never been easier or more reliable.
                    </p>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-extrabold text-xl mb-4">
                                1
                            </div>
                            <h3 className="text-base font-bold text-foreground">Select Your Remedies</h3>
                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                Browse over 20+ verified medications in our catalog or upload your doctor’s prescription slip.
                            </p>
                        </div>

                        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-extrabold text-xl mb-4">
                                2
                            </div>
                            <h3 className="text-base font-bold text-foreground">Choose Courier Dispatch</h3>
                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                Pick PharmacyCat Rider, Yango express courier, or inDrive city dispatch with real-time tracking.
                            </p>
                        </div>

                        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-extrabold text-xl mb-4">
                                3
                            </div>
                            <h3 className="text-base font-bold text-foreground">Safe Contactless Delivery</h3>
                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                Receive tamper-sealed medications at your doorstep in 30 minutes. Pay via Airtel, MTN, Card, or Cash.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cart Drawer & Checkout Dialog */}
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
                onProceedToCheckout={() => setIsCheckoutOpen(true)}
            />

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
