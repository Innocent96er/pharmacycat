import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowUpRight,
    Boxes,
    CheckCircle2,
    Clock,
    DollarSign,
    Package,
    PackagePlus,
    Plus,
    RefreshCw,
    Search,
    ShieldAlert,
    ShoppingCart,
    Store,
    Tags,
    Truck,
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Product {
    id: number;
    name: string;
    category: string;
    price: string | number;
    stock: number;
    prescription_type: 'otc' | 'rx';
    image_url?: string | null;
    is_featured: boolean;
    dosage?: string | null;
    created_at: string;
}

interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    unit_price: string | number;
    product?: Product;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_type: string;
    total_amount: string | number;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    created_at: string;
    items: OrderItem[];
}

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count: number;
}

interface DashboardProps {
    stats: {
        totalProducts: number;
        totalStockUnits: number;
        lowStockCount: number;
        outOfStockCount: number;
        totalOrders: number;
        pendingOrders: number;
        processingOrders: number;
        deliveredOrders: number;
        totalRevenue: number;
    };
    lowStockProducts: Product[];
    recentOrders: Order[];
    recentProducts: Product[];
    categories: Category[];
}

export default function AdminDashboard({
    stats,
    lowStockProducts,
    recentOrders,
    recentProducts,
    categories,
}: DashboardProps) {
    const { auth, flash } = usePage().props as {
        auth?: { user?: { name: string; role: string } };
        flash?: { success?: string | null; error?: string | null };
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleQuickRestock = (productId: number, currentStock: number) => {
        const amountStr = prompt('Enter restock quantity to add:', '20');
        if (!amountStr) return;
        const addAmount = parseInt(amountStr, 10);
        if (isNaN(addAmount) || addAmount <= 0) return;

        router.patch(
            `/admin/products/${productId}/stock`,
            { stock: currentStock + addAmount },
            { preserveScroll: true },
        );
    };

    const handleUpdateOrderStatus = (orderId: number, newStatus: string) => {
        router.patch(
            `/admin/orders/${orderId}/status`,
            { status: newStatus },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Pharmacy Admin Dashboard" />

            <div className="flex flex-col gap-8 p-6 md:p-8">
                {/* Header Banner */}
                <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white shadow-lg md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold tracking-wide text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                                {auth?.user?.role?.toUpperCase()} PORTAL
                            </span>
                            <span className="text-xs text-emerald-200/80">
                                Pharmacy Inventory & Sales System
                            </span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                            Welcome back, {auth?.user?.name || 'Administrator'}
                        </h1>
                        <p className="mt-1 text-sm text-emerald-100/80">
                            Manage pharmacy medicines, stock levels, sales catalog, and customer deliveries in one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            asChild
                            className="bg-emerald-500 font-semibold text-slate-950 shadow-md hover:bg-emerald-400"
                        >
                            <Link href="/admin/products/create">
                                <Plus className="mr-1.5 h-4 w-4" />
                                Upload Product
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                        >
                            <Link href="/admin/products">
                                <Package className="mr-1.5 h-4 w-4" />
                                Inventory List
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                        >
                            <Link href="/">
                                <Store className="mr-1.5 h-4 w-4" />
                                View Storefront
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Products */}
                    <Card className="border-border/80 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Active Catalog Products
                            </CardTitle>
                            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                <Package className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">
                                {stats.totalProducts}
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>{stats.totalStockUnits} units in warehouse</span>
                                <Link
                                    href="/admin/products"
                                    className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                >
                                    Manage →
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Low Stock Alerts */}
                    <Card className={`border-border/80 shadow-sm transition-all hover:shadow-md ${stats.lowStockCount > 0 ? 'border-amber-500/40 bg-amber-500/[0.02]' : ''}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Stock Alerts (&lt; 10 units)
                            </CardTitle>
                            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-bold tracking-tight ${stats.lowStockCount > 0 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                                    {stats.lowStockCount}
                                </span>
                                {stats.outOfStockCount > 0 && (
                                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                                        ({stats.outOfStockCount} out of stock)
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                                {stats.lowStockCount > 0
                                    ? 'Requires restocking soon'
                                    : 'All medicine stock healthy'}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Orders */}
                    <Card className="border-border/80 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Customer Orders
                            </CardTitle>
                            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold tracking-tight">
                                    {stats.totalOrders}
                                </span>
                                {stats.pendingOrders > 0 && (
                                    <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        {stats.pendingOrders} pending
                                    </Badge>
                                )}
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>{stats.deliveredOrders} delivered</span>
                                <Link
                                    href="/admin/orders"
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    View orders →
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue */}
                    <Card className="border-border/80 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Store Revenue
                            </CardTitle>
                            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                K{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                                Across all placed prescriptions & orders
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content: Low Stock Warnings & Recent Orders */}
                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Left Column: Stock Watch & Quick Actions (7 cols) */}
                    <div className="flex flex-col gap-6 lg:col-span-7">
                        {/* Low Stock Alerts Table */}
                        <Card className="border-border/80 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                                        Inventory Restock Alerts
                                    </CardTitle>
                                    <CardDescription>
                                        Medicines and products running low (&lt; 10 units)
                                    </CardDescription>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/admin/products?stock_status=low_stock">
                                        View All Low Stock
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {lowStockProducts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
                                        <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-500" />
                                        <p className="font-medium text-foreground">Stock levels are great!</p>
                                        <p>No products are currently under the 10 unit reorder threshold.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {lowStockProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center justify-between py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border bg-muted">
                                                        {product.image_url ? (
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-foreground">
                                                                {product.name}
                                                            </span>
                                                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                                                                {product.prescription_type}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {product.category} • K{Number(product.price).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            product.stock <= 0
                                                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                        }`}
                                                    >
                                                        {product.stock <= 0
                                                            ? 'Out of stock'
                                                            : `${product.stock} left`}
                                                    </span>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleQuickRestock(product.id, product.stock)}
                                                        title="Quick restock"
                                                        className="h-8 px-2 text-xs"
                                                    >
                                                        <Plus className="mr-1 h-3 w-3" />
                                                        Add Stock
                                                    </Button>

                                                    <Button asChild variant="outline" size="sm" className="h-8 px-2 text-xs">
                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Added Products */}
                        <Card className="border-border/80 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <div>
                                    <CardTitle className="text-lg font-semibold">
                                        Recently Uploaded Products
                                    </CardTitle>
                                    <CardDescription>
                                        Latest inventory items added to the sales system
                                    </CardDescription>
                                </div>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/admin/products">
                                        All Products →
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {recentProducts.map((p) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
                                                {p.image_url ? (
                                                    <img
                                                        src={p.image_url}
                                                        alt={p.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                        <Package className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate font-medium text-foreground">
                                                    {p.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                        K{Number(p.price).toFixed(2)}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{p.stock} in stock</span>
                                                </div>
                                            </div>
                                            <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                                                <Link href={`/admin/products/${p.id}/edit`}>
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Customer Orders & Categories (5 cols) */}
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        {/* Recent Orders Card */}
                        <Card className="border-border/80 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                        <Truck className="h-5 w-5 text-blue-500" />
                                        Recent Orders
                                    </CardTitle>
                                    <CardDescription>
                                        Latest customer prescriptions and sales orders
                                    </CardDescription>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/admin/orders">
                                        View All
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {recentOrders.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                        No orders placed yet.
                                    </p>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {recentOrders.map((order) => (
                                            <div key={order.id} className="py-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-foreground">
                                                            {order.order_number || `#${order.id}`}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            • {order.customer_name || 'Customer'}
                                                        </span>
                                                    </div>

                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                        className={`rounded-md border text-xs font-semibold px-2 py-1 transition-colors ${
                                                            order.status === 'delivered'
                                                                ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                                : order.status === 'processing'
                                                                ? 'border-blue-500/30 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                                                : order.status === 'cancelled'
                                                                ? 'border-rose-500/30 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                                                                : 'border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                                        }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>

                                                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>
                                                        {order.items?.length || 0} item(s) • {order.delivery_type || 'delivery'}
                                                    </span>
                                                    <span className="font-semibold text-foreground">
                                                        K{Number(order.total_amount).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Category Overview Card */}
                        <Card className="border-border/80 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                        <Tags className="h-5 w-5 text-emerald-500" />
                                        Categories & Departments
                                    </CardTitle>
                                    <CardDescription>
                                        Active product distribution by category
                                    </CardDescription>
                                </div>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/admin/categories">
                                        Manage
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {categories.map((c) => (
                                        <div
                                            key={c.id}
                                            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-muted/60"
                                        >
                                            <span className="font-medium text-foreground">{c.name}</span>
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                {c.products_count} products
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
    ],
};
