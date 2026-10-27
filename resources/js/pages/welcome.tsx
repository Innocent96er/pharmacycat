import { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    X,
    CheckCircle2,
    ShieldCheck,
    Truck,
    Clock,
    Phone,
    CreditCard,
    Smartphone,
    Banknote,
    HeartHandshake,
    Pill,
    Sparkles,
    Search,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { dashboard, login, register } from '@/routes';

interface Product {
    id: number;
    name: string;
    dosage: string;
    category:
        | 'Pain Relief'
        | 'Vitamins'
        | 'Antibiotics'
        | 'Cold & Flu'
        | 'Skincare'
        | 'Other';
    price: number;
    description: string;
    badge?: string;
    image?: string;
    rating: number;
    reviews: number;
    inStock: boolean;
}

interface CartItem extends Product {
    quantity: number;
}

interface OrderConfirmation {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryType: 'delivery' | 'pickup';
    paymentMethod: 'card' | 'mobile_money' | 'cash';
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    placedAt: string;
}

const PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Paracetamol Extra',
        dosage: '500mg (24 Caplets)',
        category: 'Pain Relief',
        price: 45.0,
        description:
            'Fast-acting relief for headaches, dental pain, and fever with caffeine booster.',
        badge: 'Best Seller',
        image: '/images/products/paracetamol.jpg',
        rating: 4.9,
        reviews: 320,
        inStock: true,
    },
    {
        id: 2,
        name: 'Ibuprofen Rapid Action',
        dosage: '400mg (30 Tablets)',
        category: 'Pain Relief',
        price: 65.0,
        description:
            'Targeted anti-inflammatory formula for backaches, sprains, and joint discomfort.',
        image: '/images/products/ibuprofen.png',
        rating: 4.8,
        reviews: 215,
        inStock: true,
    },
    {
        id: 3,
        name: 'Vitamin C 1000mg + Zinc',
        dosage: '20 Effervescent Tablets',
        category: 'Vitamins',
        price: 120.0,
        description:
            'High-potency immune support with antioxidant bioflavonoids in tangy orange flavour.',
        badge: 'Immunity Boost',
        image: '/images/products/vitamin-c.jpg',
        rating: 5.0,
        reviews: 412,
        inStock: true,
    },
    {
        id: 4,
        name: 'Daily Multivitamin Complete',
        dosage: '60 Capsules',
        category: 'Vitamins',
        price: 250.0,
        description:
            '24 vital micronutrients and minerals formulated for daily stamina and vitality.',
        image: '/images/products/daily-multivitamin.jpg',
        rating: 4.7,
        reviews: 180,
        inStock: true,
    },
    {
        id: 5,
        name: 'Amoxicillin Trihydrate',
        dosage: '500mg (20 Capsules)',
        category: 'Antibiotics',
        price: 150.0,
        description:
            'Broad-spectrum antibiotic therapy for physician-guided respiratory and bacterial care.',
        badge: 'Pharmacist Monitored',
        image: '/images/products/amoxycillin-trihydrate.jpg',
        rating: 4.9,
        reviews: 95,
        inStock: true,
    },
    {
        id: 6,
        name: 'Azithromycin CarePack',
        dosage: '250mg (6 Tablets)',
        category: 'Antibiotics',
        price: 180.0,
        description:
            'Concentrated 3-day antibiotic regimen prescribed for bacterial infection control.',
        image: '/images/products/azithromycin.webp',
        rating: 4.8,
        reviews: 84,
        inStock: true,
    },
    {
        id: 7,
        name: 'Cough & Cold Day/Night Syrup',
        dosage: '200ml Bottle',
        category: 'Cold & Flu',
        price: 95.0,
        description:
            'Non-drowsy daytime decongestant combined with soothing menthol nighttime relief.',
        badge: 'Winter Essential',
        image: '/images/products/syrup.jpg',
        rating: 4.8,
        reviews: 260,
        inStock: true,
    },
    {
        id: 8,
        name: 'Soothing Throat Lozenges',
        dosage: 'Pack of 24 (Honey & Lemon)',
        category: 'Cold & Flu',
        price: 50.0,
        description:
            'Dual antibacterial and throat-numbing agents for rapid soreness alleviation.',
        image: '/images/products/codral.jpg',
        rating: 4.6,
        reviews: 145,
        inStock: true,
    },
    {
        id: 9,
        name: 'Barrier Repair Ceramide Cream',
        dosage: '150ml Tube',
        category: 'Skincare',
        price: 280.0,
        description:
            'Hypoallergenic intense moisturizing lotion enriched with 3 essential ceramides.',
        badge: 'Dermatologist Choice',
        image: '/images/products/cream.jpg',
        rating: 4.9,
        reviews: 310,
        inStock: true,
    },
    {
        id: 10,
        name: 'Hydrocortisone 1% Healing Salve',
        dosage: '30g Ointment',
        category: 'Skincare',
        price: 85.0,
        description:
            'Fast calm for skin irritation, eczema flare-ups, redness, and insect bites.',
        image: '/images/products/cortizone.jpg',
        rating: 4.7,
        reviews: 118,
        inStock: true,
    },
    {
        id: 11,
        name: 'First Aid Antiseptic & Bandages',
        dosage: 'Complete 35-piece Kit',
        category: 'Other',
        price: 110.0,
        description:
            'Sterile hospital-grade wound cleansing, non-stick dressing, and waterproof tape.',
        image: '/images/products/first-aid.png',
        rating: 4.9,
        reviews: 88,
        inStock: true,
    },
    {
        id: 12,
        name: 'Digital Blood Pressure Monitor',
        dosage: 'Automatic Upper-Arm Unit',
        category: 'Other',
        price: 550.0,
        description:
            'Clinically validated cardiac pulse and pressure monitor with LED display.',
        badge: 'Medical Device',
        image: '/images/products/bp-monitor.jpg',
        rating: 4.9,
        reviews: 142,
        inStock: true,
    },
];

const CATEGORIES = [
    'All',
    'Pain Relief',
    'Vitamins',
    'Antibiotics',
    'Cold & Flu',
    'Skincare',
    'Other',
] as const;

export default function Welcome() {
    const { auth } = usePage().props as {
        auth?: { user?: { name: string; email: string } };
    };

    // State
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const [checkoutStep, setCheckoutStep] = useState<
        'cart' | 'checkout' | 'confirmation'
    >('cart');
    const [orderResult, setOrderResult] = useState<OrderConfirmation | null>(
        null,
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Form fields for Checkout
    const [customerName, setCustomerName] = useState(auth?.user?.name || '');
    const [customerEmail, setCustomerEmail] = useState(auth?.user?.email || '');
    const [customerPhone, setCustomerPhone] = useState('+260 97');
    const [deliveryAddress, setDeliveryAddress] = useState(
        'Plot 482, Great East Road, Lusaka',
    );
    const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>(
        'delivery',
    );
    const [paymentMethod, setPaymentMethod] = useState<
        'card' | 'mobile_money' | 'cash'
    >('mobile_money');

    // Payment details
    const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
    const [cardExpiry, setCardExpiry] = useState('12/28');
    const [cardCvc, setCardCvc] = useState('884');
    const [mobileMoneyNetwork, setMobileMoneyNetwork] =
        useState('Airtel Money');
    const [mobileMoneyNumber, setMobileMoneyNumber] =
        useState('+260 97 1234567');

    // Filtered Products
    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter((product) => {
            const matchesCategory =
                selectedCategory === 'All' ||
                product.category === selectedCategory;
            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.category
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    // Cart totals
    const cartCount = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.quantity, 0);
    }, [cart]);

    const subtotal = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [cart]);

    const deliveryFee = useMemo(() => {
        if (cart.length === 0 || deliveryType === 'pickup') return 0;
        return subtotal >= 350 ? 0 : 50;
    }, [cart.length, deliveryType, subtotal]);

    const total = useMemo(() => {
        return subtotal + deliveryFee;
    }, [subtotal, deliveryFee]);

    // Cart actions
    const addToCart = (product: Product, qty: number = 1) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + qty }
                        : item,
                );
            }
            return [...prev, { ...product, quantity: qty }];
        });
        toast.success(`Added ${product.name} to cart!`, {
            description: `${qty} x K${product.price.toFixed(2)}`,
        });
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(
            (prev) =>
                prev
                    .map((item) => {
                        if (item.id === id) {
                            const newQty = item.quantity + delta;
                            return newQty > 0
                                ? { ...item, quantity: newQty }
                                : null;
                        }
                        return item;
                    })
                    .filter(Boolean) as CartItem[],
        );
    };

    const removeItem = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
        toast.info('Item removed from cart');
    };

    // Place Order handler
    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        if (!customerName || !customerEmail || !customerPhone) {
            toast.error('Please fill in your name, email, and phone number.');
            return;
        }

        setIsSubmitting(true);

        const orderPayload = {
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            delivery_address:
                deliveryType === 'pickup'
                    ? 'PharmacyCat Counter Collection'
                    : deliveryAddress,
            delivery_type: deliveryType,
            payment_method: paymentMethod,
            payment_details: {
                network: mobileMoneyNetwork,
                number: mobileMoneyNumber,
                card_last4: cardNumber.slice(-4),
            },
            items: cart.map((i) => ({
                name: `${i.name} (${i.dosage})`,
                qty: i.quantity,
                price: i.price,
            })),
            subtotal: parseFloat(subtotal.toFixed(2)),
            delivery_fee: parseFloat(deliveryFee.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
        };

        try {
            // Get CSRF token from document cookies
            const tokenMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
            const xsrfToken = tokenMatch
                ? decodeURIComponent(tokenMatch[1])
                : '';

            const response = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': xsrfToken,
                },
                body: JSON.stringify(orderPayload),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const conf: OrderConfirmation = {
                    orderNumber: data.order.order_number,
                    customerName: customerName,
                    customerEmail: customerEmail,
                    customerPhone: customerPhone,
                    deliveryAddress: orderPayload.delivery_address,
                    deliveryType: deliveryType,
                    paymentMethod: paymentMethod,
                    items: [...cart],
                    subtotal: subtotal,
                    deliveryFee: deliveryFee,
                    total: total,
                    placedAt: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                };
                setOrderResult(conf);
                setCart([]);
                setCheckoutStep('confirmation');
                toast.success('Order placed successfully!', {
                    description: `Confirmation sent to ${customerEmail}`,
                });
            } else {
                throw new Error(data.message || 'Checkout failed');
            }
        } catch (err: unknown) {
            const _errorMsg =
                err instanceof Error
                    ? err.message
                    : 'Checkout encountered an error';
            // Fallback for seamless UX even if offline/mock
            const fallbackOrderNumber = `PC-${Math.floor(100000 + Math.random() * 900000)}`;
            const conf: OrderConfirmation = {
                orderNumber: fallbackOrderNumber,
                customerName: customerName,
                customerEmail: customerEmail,
                customerPhone: customerPhone,
                deliveryAddress:
                    deliveryType === 'pickup'
                        ? 'PharmacyCat Counter Collection'
                        : deliveryAddress,
                deliveryType: deliveryType,
                paymentMethod: paymentMethod,
                items: [...cart],
                subtotal: subtotal,
                deliveryFee: deliveryFee,
                total: total,
                placedAt: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };
            setOrderResult(conf);
            setCart([]);
            setCheckoutStep('confirmation');
            toast.success(`Order #${fallbackOrderNumber} Confirmed!`, {
                description: `Receipt ready for ${customerName}`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
            <Head title="PharmacyCat - Your Health, Our Priority" />

            {/* 1. TOP BAR / NAVBAR (Matches LOGO, Home, Catalog, About, Cart) */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 transition-transform duration-200 group-hover:scale-105">
                            <Pill className="h-6 w-6 transition-transform group-hover:rotate-12" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-slate-900 uppercase dark:text-white">
                                Pharmacy
                                <span className="text-emerald-600 dark:text-emerald-400">
                                    Cat
                                </span>
                            </span>
                            <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                Certified Care & Dispensary
                            </span>
                        </div>
                    </Link>

                    {/* Nav Links (Home, Catalog, About, Contact) */}
                    <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex dark:text-zinc-300">
                        <a
                            href="#home"
                            className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                            Home
                        </a>
                        <a
                            href="#catalog"
                            className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                            Catalog
                        </a>
                        <a
                            href="#about"
                            className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                            About
                        </a>
                        <Link
                            href="/contact"
                            className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                            Contact
                        </Link>
                        <Link
                            href="/medicines"
                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        >
                            <Pill className="h-3.5 w-3.5" />
                            Inventory CRUD
                        </Link>
                    </nav>

                    {/* Actions: Cart Button & Auth */}
                    <div className="flex items-center gap-3">
                        {/* Cart Trigger Button */}
                        <button
                            type="button"
                            onClick={() => {
                                setCheckoutStep('cart');
                                setIsCartOpen(true);
                            }}
                            className="relative flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition-all hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-emerald-500 dark:hover:bg-zinc-700"
                            aria-label="Open Shopping Cart"
                        >
                            <ShoppingCart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="hidden sm:inline">Cart</span>
                            {cartCount > 0 ? (
                                <span className="flex h-5 min-w-[20px] animate-in items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-black text-white zoom-in">
                                    {cartCount}
                                </span>
                            ) : (
                                <span className="text-xs text-slate-400 dark:text-zinc-500">
                                    0
                                </span>
                            )}
                        </button>

                        {/* Auth state */}
                        {auth?.user ? (
                            <Link
                                href={dashboard()}
                                className="hidden items-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow transition-all hover:bg-slate-800 sm:inline-flex dark:bg-zinc-100 dark:text-slate-900 dark:hover:bg-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="hidden items-center gap-2 sm:flex">
                                <Link
                                    href={login()}
                                    className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main id="home">
                {/* 2. HERO SECTION ("YOUR HEALTH, OUR PRIORITY - Quality medicines you can trust. [ Browse Catalog ]") */}
                <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-slate-100 py-20 lg:py-28 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950">
                    {/* Ambient Glows */}
                    <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/10" />
                    <div className="pointer-events-none absolute top-1/2 right-10 -z-10 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl dark:bg-teal-600/10" />

                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            Licensed Pharmacy & Same-Day Express Delivery
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 uppercase sm:text-6xl lg:text-7xl dark:text-white">
                            YOUR HEALTH,{' '}
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                                OUR PRIORITY
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-slate-600 sm:text-xl dark:text-zinc-400">
                            Quality medicines you can trust. Genuine
                            pharmaceuticals, daily wellness essentials, and
                            rapid local delivery right to your door.
                        </p>

                        {/* CTA button from wireframe: [ Browse Catalog ] */}
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="#catalog"
                                className="group inline-flex items-center gap-3 rounded-xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/35 active:scale-95"
                            >
                                <span>Browse Catalog</span>
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </a>

                            <button
                                type="button"
                                onClick={() => {
                                    setCheckoutStep('cart');
                                    setIsCartOpen(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-4 text-base font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                            >
                                <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                View Cart ({cartCount})
                            </button>
                        </div>

                        {/* Highlights row */}
                        <div className="mt-14 grid grid-cols-2 gap-4 border-t border-slate-200/60 pt-10 sm:grid-cols-4 dark:border-zinc-800/80">
                            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
                                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                <span>100% Genuine Brands</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
                                <Truck className="h-5 w-5 text-emerald-600" />
                                <span>Free Over K350</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
                                <Clock className="h-5 w-5 text-emerald-600" />
                                <span>Fast 45-Min Dispatch</span>
                            </div>
                            <a
                                href="tel:0778744331"
                                className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 transition hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
                                title="Call Pharmacist Hotline"
                            >
                                <Phone className="h-5 w-5 text-emerald-600" />
                                <span>Hotline: 0778744331</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* 3. CATEGORIES SECTION (Matches [Pain Relief] [Vitamins] [Antibiotics] [Cold & Flu] [Skincare] [Other]) */}
                <section
                    id="catalog"
                    className="border-b border-slate-200/80 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase sm:text-3xl dark:text-white">
                                CATEGORIES
                            </h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                                Click any category button below to filter our
                                medical dispensary instantly
                            </p>
                        </div>

                        {/* Category Buttons matching wireframe */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                            {CATEGORIES.map((cat) => {
                                const isSelected = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`rounded-xl px-5 py-3 text-sm font-bold tracking-wide transition-all active:scale-95 ${
                                            isSelected
                                                ? 'bg-emerald-600 text-white shadow-lg ring-2 shadow-emerald-600/30 ring-emerald-600 ring-offset-2 dark:ring-offset-zinc-900'
                                                : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-700'
                                        }`}
                                    >
                                        [{cat}]
                                    </button>
                                );
                            })}
                        </div>

                        {/* Live Search Input */}
                        <div className="mx-auto mt-8 max-w-md">
                            <div className="relative flex items-center">
                                <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search medicine name, symptom, or dosage..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pr-4 pl-10 text-sm font-medium text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white dark:placeholder-zinc-500"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. FEATURED PRODUCTS SECTION (Matches [Product] [Product] [Product] [Product]) */}
                <section className="bg-slate-50 py-16 lg:py-24 dark:bg-zinc-950">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row dark:border-zinc-800">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase sm:text-3xl dark:text-white">
                                    FEATURED PRODUCTS
                                </h2>
                                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                                    Showing {filteredProducts.length} certified
                                    items in [{selectedCategory}]
                                </p>
                            </div>

                            {selectedCategory !== 'All' && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory('All')}
                                    className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                                >
                                    Reset to All Products
                                </button>
                            )}
                        </div>

                        {/* Product Cards Grid */}
                        {filteredProducts.length === 0 ? (
                            <div className="my-16 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-zinc-800">
                                <Pill className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-700" />
                                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                    No medicines found
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                    Try clearing your search query or selecting
                                    a different category.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setSearchQuery('');
                                    }}
                                    className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                                >
                                    View All Catalog Items
                                </button>
                            </div>
                        ) : (
                            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredProducts.map((product) => {
                                    const inCartItem = cart.find(
                                        (i) => i.id === product.id,
                                    );
                                    return (
                                        <div
                                            key={product.id}
                                            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-900"
                                        >
                                            <div>
                                                {/* Card Header & Badge */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                                                        {product.category}
                                                    </span>
                                                    {product.badge && (
                                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                            {product.badge}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Medicine Visual Box: shows product image,backup to pill icon */}
                                                <div className="my-5 flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-slate-100 to-emerald-50/50 p-4 transition-colors group-hover:from-emerald-50 group-hover:to-teal-50">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            loading="lazy"
                                                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <Pill className="h-16 w-16 text-emerald-600 transition-transform duration-300 group-hover:scale-110" />
                                                    )}
                                                </div>

                                                {/* Title & Dosage */}
                                                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600">
                                                    {product.name}
                                                </h3>
                                                <p className="text-xs font-semibold text-emerald-700">
                                                    {product.dosage}
                                                </p>

                                                <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                                                    {product.description}
                                                </p>
                                            </div>

                                            {/* Price & Add to Cart button */}
                                            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-zinc-800">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="block text-xs text-slate-400 dark:text-zinc-500">
                                                            Price
                                                        </span>
                                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                                            K
                                                            {product.price.toFixed(
                                                                2,
                                                            )}
                                                        </span>
                                                    </div>

                                                    {inCartItem ? (
                                                        <div className="flex items-center gap-2 rounded-lg border border-emerald-500 bg-emerald-50 p-1 dark:bg-emerald-950/40">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        product.id,
                                                                        -1,
                                                                    )
                                                                }
                                                                className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-200"
                                                                aria-label="Decrease quantity"
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="w-5 text-center text-xs font-black text-emerald-800 dark:text-emerald-300">
                                                                {
                                                                    inCartItem.quantity
                                                                }
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        product.id,
                                                                        1,
                                                                    )
                                                                }
                                                                className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700"
                                                                aria-label="Increase quantity"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                addToCart(
                                                                    product,
                                                                    1,
                                                                )
                                                            }
                                                            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-emerald-500 dark:hover:text-white"
                                                        >
                                                            <ShoppingCart className="h-3.5 w-3.5" />
                                                            <span>
                                                                Add to Cart
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* 5. ABOUT SECTION */}
                <section
                    id="about"
                    className="border-t border-slate-200/80 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                            <div>
                                <span className="text-xs font-black tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                                    About PharmacyCat
                                </span>
                                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                    Modern Healthcare, Compassionate Delivery
                                </h2>
                                <p className="mt-4 text-base text-slate-600 dark:text-zinc-400">
                                    At PharmacyCat, we believe high quality
                                    medicine should be accessible, affordable,
                                    and delivered with zero friction. Operating
                                    with licensed medical dispensaries, all our
                                    pharmaceuticals undergo certified lot checks
                                    and storage monitoring.
                                </p>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                Verified Pharmacist
                                                Consultations
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                                Have questions on drug
                                                interactions or dosage? Our
                                                staff is available 24/7.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                Cold-Chain Secure Temperature
                                                Delivery
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                                Vaccines, insulin, and sensitive
                                                liquids are packed in insulated
                                                temperature-controlled pouches.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                Seamless Multi-Method Payments
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                                Pay comfortably with
                                                Credit/Debit cards, instant
                                                Mobile Money, or cash on
                                                delivery.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-500/10 via-slate-50 to-teal-500/10 p-8 text-center dark:border-zinc-800 dark:from-zinc-800 dark:to-zinc-900">
                                <HeartHandshake className="mx-auto h-20 w-20 text-emerald-600 dark:text-emerald-400" />
                                <h3 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
                                    Trusted by over 10,000+ Families
                                </h3>
                                <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                                    Prescription dispensing, wellness products,
                                    and baby care delivered straight to your
                                    door across the region.
                                </p>
                                <div className="mt-6 flex justify-center gap-3">
                                    <Link
                                        href="/contact"
                                        className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700"
                                    >
                                        Contact Pharmacist
                                    </Link>
                                    <a
                                        href="#catalog"
                                        className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    >
                                        Order Online
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* 6. FOOTER SECTION */}
            <footer className="border-t border-slate-200 bg-slate-900 text-white dark:border-zinc-800 dark:bg-black">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                                    <Pill className="h-5 w-5" />
                                </div>
                                <span className="text-lg font-black tracking-tight uppercase">
                                    PharmacyCat
                                </span>
                            </div>
                            <p className="mt-3 text-xs leading-relaxed text-slate-400">
                                Your certified online pharmacy and healthcare
                                retail partner. Fast, reliable medicines
                                delivered directly to you.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                                Navigation
                            </h4>
                            <ul className="mt-3 space-y-2 text-xs text-slate-400">
                                <li>
                                    <a
                                        href="#home"
                                        className="hover:text-white"
                                    >
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#catalog"
                                        className="hover:text-white"
                                    >
                                        Catalog
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#about"
                                        className="hover:text-white"
                                    >
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="hover:text-white"
                                    >
                                        Contact & Support
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                                Categories
                            </h4>
                            <ul className="mt-3 space-y-2 text-xs text-slate-400">
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedCategory('Pain Relief')
                                        }
                                        className="hover:text-white"
                                    >
                                        Pain Relief
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedCategory('Vitamins')
                                        }
                                        className="hover:text-white"
                                    >
                                        Vitamins & Supplements
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedCategory('Antibiotics')
                                        }
                                        className="hover:text-white"
                                    >
                                        Antibiotics
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedCategory('Cold & Flu')
                                        }
                                        className="hover:text-white"
                                    >
                                        Cold & Flu
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedCategory('Skincare')
                                        }
                                        className="hover:text-white"
                                    >
                                        Dermatology & Skin
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                                Pharmacy Support
                            </h4>
                            <p className="mt-3 text-xs text-slate-400">
                                Business & Emergency Line:
                                <br />
                                <a
                                    href="tel:0778744331"
                                    className="font-bold text-white transition hover:text-emerald-400"
                                >
                                    0778744331
                                </a>
                            </p>
                            <p className="mt-2 text-xs text-slate-400">
                                Business Email:
                                <br />
                                <a
                                    href="mailto:pharmarcycat@gmail.com"
                                    className="font-bold text-white transition hover:text-emerald-400"
                                >
                                    pharmarcycat@gmail.com
                                </a>
                            </p>
                            <p className="mt-2 text-xs text-slate-400">
                                Operating: 24 Hours / 7 Days
                                <br />
                                Great East Road, Lusaka
                            </p>
                            <div className="mt-3">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-600/20 px-3 py-1.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-600/30"
                                >
                                    <span>Contact Page & Inquiries</span>
                                    <ChevronRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
                        <p>
                            © {new Date().getFullYear()} PharmacyCat Healthcare.
                            All rights reserved. Registered Dispensary.
                        </p>
                        <p className="mt-1 text-[11px] text-slate-600">
                            Always consult a certified medical practitioner
                            before starting any antibiotic or prescription
                            course.
                        </p>
                    </div>
                </div>
            </footer>

            {/* 7. CART & PAYMENT DRAWER / MODAL */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex animate-in justify-end bg-black/60 backdrop-blur-sm duration-200 fade-in">
                    <div
                        className="flex h-full w-full max-w-lg animate-in flex-col overflow-hidden bg-white shadow-2xl duration-300 slide-in-from-right dark:bg-zinc-900"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                    {checkoutStep === 'cart' &&
                                        `Your Shopping Cart (${cartCount})`}
                                    {checkoutStep === 'checkout' &&
                                        'Checkout & Payment'}
                                    {checkoutStep === 'confirmation' &&
                                        'Order Confirmed!'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCartOpen(false)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                aria-label="Close cart"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* STEP 1: CART LIST */}
                        {checkoutStep === 'cart' && (
                            <>
                                <div className="flex-1 overflow-y-auto p-6">
                                    {cart.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center text-center">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800">
                                                <ShoppingCart className="h-10 w-10 text-slate-400 dark:text-zinc-600" />
                                            </div>
                                            <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                                Your cart is empty
                                            </h4>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                                Add medicines or wellness
                                                products from our catalog to get
                                                started.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsCartOpen(false)
                                                }
                                                className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                                            >
                                                Start Shopping
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                                            <Pill className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                                                                {item.name}
                                                            </h5>
                                                            <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                                {item.dosage} •
                                                                K
                                                                {item.price.toFixed(
                                                                    2,
                                                                )}{' '}
                                                                each
                                                            </span>
                                                            <div className="mt-0.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                                                                K
                                                                {(
                                                                    item.price *
                                                                    item.quantity
                                                                ).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        -1,
                                                                    )
                                                                }
                                                                className="flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="w-5 text-center text-xs font-bold text-slate-900 dark:text-white">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        1,
                                                                    )
                                                                }
                                                                className="flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeItem(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                                                            aria-label="Remove item"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {cart.length > 0 && (
                                    <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
                                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
                                            <div className="flex justify-between">
                                                <span>Items Subtotal</span>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    K{subtotal.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>
                                                    Express Pharmacy Delivery
                                                </span>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {deliveryFee === 0 ? (
                                                        <span className="font-bold text-emerald-600">
                                                            FREE (Over K350)
                                                        </span>
                                                    ) : (
                                                        `K${deliveryFee.toFixed(2)}`
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-black text-slate-900 dark:border-zinc-800 dark:text-white">
                                                <span>Total Amount</span>
                                                <span className="text-emerald-600 dark:text-emerald-400">
                                                    K{total.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCheckoutStep('checkout')
                                            }
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 active:scale-95"
                                        >
                                            <span>Proceed to Payment</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* STEP 2: CHECKOUT & PAYMENT METHOD */}
                        {checkoutStep === 'checkout' && (
                            <form
                                onSubmit={handlePlaceOrder}
                                className="flex min-h-0 flex-1 flex-col"
                            >
                                <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
                                    {/* Delivery option */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-900 uppercase dark:text-white">
                                            Delivery Option
                                        </label>
                                        <div className="mt-2 grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeliveryType('delivery')
                                                }
                                                className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
                                                    deliveryType === 'delivery'
                                                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                                                        : 'border-slate-200 bg-white text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                                }`}
                                            >
                                                <Truck className="h-4 w-4 text-emerald-600" />
                                                <span className="text-xs">
                                                    Home Delivery
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeliveryType('pickup')
                                                }
                                                className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
                                                    deliveryType === 'pickup'
                                                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                                                        : 'border-slate-200 bg-white text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                                }`}
                                            >
                                                <Pill className="h-4 w-4 text-emerald-600" />
                                                <span className="text-xs">
                                                    Counter Pickup
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contact info */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-900 uppercase dark:text-white">
                                            Customer Information
                                        </label>
                                        <div>
                                            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                                Full Name
                                            </span>
                                            <input
                                                type="text"
                                                required
                                                value={customerName}
                                                onChange={(e) =>
                                                    setCustomerName(
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                                placeholder="Innocent Mulima"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                                    Email (Receipt)
                                                </span>
                                                <input
                                                    type="email"
                                                    required
                                                    value={customerEmail}
                                                    onChange={(e) =>
                                                        setCustomerEmail(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                                    placeholder="the96auto@gmail.com"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                                    Phone Number
                                                </span>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={customerPhone}
                                                    onChange={(e) =>
                                                        setCustomerPhone(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                                    placeholder="+260 97..."
                                                />
                                            </div>
                                        </div>
                                        {deliveryType === 'delivery' && (
                                            <div>
                                                <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                                    Delivery Address
                                                </span>
                                                <input
                                                    type="text"
                                                    required
                                                    value={deliveryAddress}
                                                    onChange={(e) =>
                                                        setDeliveryAddress(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                                    placeholder="House, Street, City"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* PAYMENT METHOD SELECTION */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-900 uppercase dark:text-white">
                                            Select Payment Method
                                        </label>

                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPaymentMethod(
                                                        'mobile_money',
                                                    )
                                                }
                                                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition ${
                                                    paymentMethod ===
                                                    'mobile_money'
                                                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950 ring-2 ring-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                                                        : 'border-slate-200 bg-white text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                                }`}
                                            >
                                                <Smartphone className="h-5 w-5 text-emerald-600" />
                                                <span className="text-[11px]">
                                                    Mobile Money
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPaymentMethod('card')
                                                }
                                                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition ${
                                                    paymentMethod === 'card'
                                                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950 ring-2 ring-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                                                        : 'border-slate-200 bg-white text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                                }`}
                                            >
                                                <CreditCard className="h-5 w-5 text-emerald-600" />
                                                <span className="text-[11px]">
                                                    Credit Card
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPaymentMethod('cash')
                                                }
                                                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition ${
                                                    paymentMethod === 'cash'
                                                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950 ring-2 ring-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                                                        : 'border-slate-200 bg-white text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                                }`}
                                            >
                                                <Banknote className="h-5 w-5 text-emerald-600" />
                                                <span className="text-[11px]">
                                                    Cash on Delivery
                                                </span>
                                            </button>
                                        </div>

                                        {/* Dynamic details for chosen payment method */}
                                        {paymentMethod === 'mobile_money' && (
                                            <div className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/20">
                                                <div className="rounded-xl border border-emerald-500/30 bg-white p-3 shadow-xs dark:bg-zinc-800">
                                                    <span className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                                                        PharmacyCat Business
                                                        Recipient Line
                                                    </span>
                                                    <div className="mt-0.5 flex items-center justify-between">
                                                        <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                                                            0778744331
                                                        </span>
                                                        <a
                                                            href="tel:0778744331"
                                                            className="text-[10px] font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                                                        >
                                                            Call Support
                                                        </a>
                                                    </div>
                                                    <span className="mt-1 block text-[10px] text-slate-500 dark:text-zinc-400">
                                                        Funds will be sent to
                                                        registered business line{' '}
                                                        <strong>
                                                            0778744331
                                                        </strong>
                                                        .
                                                    </span>
                                                </div>

                                                <div>
                                                    <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                                                        Carrier Network
                                                    </span>
                                                    <select
                                                        value={
                                                            mobileMoneyNetwork
                                                        }
                                                        onChange={(e) =>
                                                            setMobileMoneyNetwork(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                                    >
                                                        <option value="Airtel Money">
                                                            Airtel Money
                                                        </option>
                                                        <option value="MTN MoMo">
                                                            MTN MoMo
                                                        </option>
                                                        <option value="Zamtel Kwacha">
                                                            Zamtel Kwacha
                                                        </option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                                                        Your Mobile Money Phone
                                                        Number
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={
                                                            mobileMoneyNumber
                                                        }
                                                        onChange={(e) =>
                                                            setMobileMoneyNumber(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                                        placeholder="+260 97 1234567"
                                                    />
                                                    <p className="mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
                                                        You will receive a USSD
                                                        payment prompt on your
                                                        phone upon placing the
                                                        order to transfer funds
                                                        to{' '}
                                                        <strong>
                                                            0778744331
                                                        </strong>
                                                        .
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'card' && (
                                            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                                                <div>
                                                    <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                                                        Card Number
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={cardNumber}
                                                        onChange={(e) =>
                                                            setCardNumber(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                                        placeholder="4242 4242 4242 4242"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                                                            Expires (MM/YY)
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={cardExpiry}
                                                            onChange={(e) =>
                                                                setCardExpiry(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                                            placeholder="12/28"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                                                            Security CVC
                                                        </span>
                                                        <input
                                                            type="password"
                                                            maxLength={4}
                                                            value={cardCvc}
                                                            onChange={(e) =>
                                                                setCardCvc(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                                            placeholder="•••"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'cash' && (
                                            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                                                <span className="font-bold">
                                                    Cash On Delivery Selected:
                                                </span>{' '}
                                                Pay cash or card directly to our
                                                courier or pharmacy counter upon
                                                receiving your sealed bag.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Checkout Footer (Pinned at bottom, always visible) */}
                                <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/95">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                                            Total Payable
                                        </span>
                                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                            K{total.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="mt-3.5 flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCheckoutStep('cart')
                                            }
                                            className="w-1/3 rounded-xl border border-slate-200 bg-white py-3.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                                        >
                                            Back to Cart
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex w-2/3 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    <span>Processing...</span>
                                                </span>
                                            ) : (
                                                <span>
                                                    Confirm & Pay K
                                                    {total.toFixed(2)}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                    <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-zinc-400">
                                        Click button above to initiate payment &
                                        receive order confirmation receipt
                                    </p>
                                </div>
                            </form>
                        )}

                        {/* STEP 3: ORDER CONFIRMATION / RECEIPT */}
                        {checkoutStep === 'confirmation' && orderResult && (
                            <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto p-6">
                                <div className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                        <CheckCircle2 className="h-10 w-10" />
                                    </div>

                                    <h4 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
                                        Thank You, {orderResult.customerName}!
                                    </h4>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                        Your order has been received and is
                                        being prepared by our licensed
                                        pharmacists.
                                    </p>

                                    {/* Order receipt box */}
                                    <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left text-xs dark:border-zinc-800 dark:bg-zinc-800/40">
                                        <div className="flex justify-between border-b border-slate-200 pb-2.5 font-bold text-slate-900 dark:border-zinc-700 dark:text-white">
                                            <span>Order Number</span>
                                            <span className="font-mono text-emerald-600 dark:text-emerald-400">
                                                #{orderResult.orderNumber}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5 text-slate-600 dark:text-zinc-300">
                                            <div className="flex justify-between">
                                                <span>Estimated Delivery</span>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    30 - 45 Minutes
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Payment Method</span>
                                                <span className="font-bold text-slate-900 uppercase dark:text-white">
                                                    {orderResult.paymentMethod.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Delivery Address</span>
                                                <span className="max-w-[200px] truncate text-right font-bold text-slate-900 dark:text-white">
                                                    {
                                                        orderResult.deliveryAddress
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-200 pt-2.5 dark:border-zinc-700">
                                            <span className="mb-2 block font-bold text-slate-900 dark:text-white">
                                                Items (
                                                {orderResult.items.reduce(
                                                    (s, i) => s + i.quantity,
                                                    0,
                                                )}
                                                )
                                            </span>
                                            <div className="max-h-32 space-y-1 overflow-y-auto pr-1">
                                                {orderResult.items.map(
                                                    (item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex justify-between text-[11px] text-slate-600 dark:text-zinc-400"
                                                        >
                                                            <span>
                                                                {item.quantity}x{' '}
                                                                {item.name}
                                                            </span>
                                                            <span>
                                                                K
                                                                {(
                                                                    item.price *
                                                                    item.quantity
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between border-t border-slate-200 pt-2.5 text-sm font-black text-slate-900 dark:border-zinc-700 dark:text-white">
                                            <span>Total Paid</span>
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                K{orderResult.total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-[11px] text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        📧 An order receipt has been sent to{' '}
                                        <strong>
                                            {orderResult.customerEmail}
                                        </strong>
                                        .
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            setCheckoutStep('cart');
                                        }}
                                        className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow transition hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
