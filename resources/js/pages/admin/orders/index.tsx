import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    MapPin,
    Package,
    Phone,
    Search,
    ShoppingBag,
    ShoppingCart,
    Truck,
    User,
    X,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Product {
    id: number;
    name: string;
    image_url?: string | null;
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
    delivery_address: string;
    delivery_type: string;
    payment_method: string;
    subtotal?: string | number;
    delivery_fee?: string | number;
    total_amount: string | number;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    created_at: string;
    items: OrderItem[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    orders: {
        data: Order[];
        links: PaginationLink[];
        total: number;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
    };
    counts: {
        all: number;
        pending: number;
        processing: number;
        delivered: number;
        cancelled: number;
    };
    filters: {
        status: string;
        search: string;
    };
}

export default function OrdersIndex({ orders, counts, filters }: Props) {
    const { flash } = usePage().props as {
        flash?: { success?: string | null; error?: string | null };
    };

    const [status, setStatus] = useState(filters.status || 'all');
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleFilterChange = (newStatus: string, newSearch: string) => {
        const query: Record<string, string> = {};
        if (newStatus && newStatus !== 'all') query.status = newStatus;
        if (newSearch) query.search = newSearch;

        router.get('/admin/orders', query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusUpdate = (orderId: number, nextStatus: string) => {
        router.patch(
            `/admin/orders/${orderId}/status`,
            { status: nextStatus },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Customer Orders - Pharmacy Fulfillment" />

            <div className="flex flex-col gap-6 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                PRESCRIPTIONS & FULFILLMENT
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Total: {orders.total} orders
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Customer Orders
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage order fulfillment, delivery couriers, and dispatch status updates.
                        </p>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
                    {[
                        { id: 'all', label: 'All Orders', count: counts.all },
                        { id: 'pending', label: 'Pending', count: counts.pending },
                        { id: 'processing', label: 'Processing / Dispatch', count: counts.processing },
                        { id: 'delivered', label: 'Delivered', count: counts.delivered },
                        { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
                    ].map((tab) => {
                        const active = status === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setStatus(tab.id);
                                    handleFilterChange(tab.id, search);
                                }}
                                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                    active
                                        ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-slate-900'
                                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                                        active
                                            ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                                            : 'bg-muted-foreground/20 text-muted-foreground'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by order #, customer name, phone, or email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            handleFilterChange(status, e.target.value);
                        }}
                        className="pl-9"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                handleFilterChange(status, '');
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Orders List */}
                <div className="flex flex-col gap-4">
                    {orders.data.length === 0 ? (
                        <Card className="p-12 text-center text-muted-foreground">
                            <ShoppingCart className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
                            <p className="text-base font-semibold text-foreground">No orders found</p>
                            <p className="text-sm">There are no orders matching this filter.</p>
                        </Card>
                    ) : (
                        orders.data.map((order) => (
                            <Card key={order.id} className="border-border/80 shadow-sm overflow-hidden">
                                <div className="flex flex-col border-b border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-mono text-sm font-bold text-foreground">
                                            {order.order_number || `#${order.id}`}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(order.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                        <span className="rounded bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                                            {order.delivery_type?.replace('_', ' ') || 'Delivery'}
                                        </span>
                                        <span className="rounded bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                                            Payment: {order.payment_method?.replace('_', ' ') || 'Cash'}
                                        </span>
                                    </div>

                                    {/* Order Status Select */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Status:</span>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            className={`rounded-md border text-xs font-semibold px-2.5 py-1.5 shadow-sm transition-colors ${
                                                order.status === 'delivered'
                                                    ? 'border-emerald-500/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                    : order.status === 'processing'
                                                    ? 'border-blue-500/40 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                                    : order.status === 'cancelled'
                                                    ? 'border-rose-500/40 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                                                    : 'border-amber-500/40 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                            }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing / Dispatched</option>
                                            <option value="delivered">Delivered / Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <CardContent className="p-4 grid gap-6 sm:grid-cols-12">
                                    {/* Customer & Delivery Details (5 cols) */}
                                    <div className="sm:col-span-5 space-y-2 text-xs">
                                        <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                                            <User className="h-4 w-4 text-emerald-600" />
                                            {order.customer_name || 'Customer'}
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5" />
                                            {order.customer_phone || 'No phone recorded'}
                                        </div>
                                        {order.customer_email && (
                                            <div className="text-muted-foreground">
                                                Email: {order.customer_email}
                                            </div>
                                        )}
                                        <div className="text-muted-foreground flex items-start gap-1.5 pt-1">
                                            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground/80" />
                                            <span>{order.delivery_address || 'Counter Pickup'}</span>
                                        </div>
                                    </div>

                                    {/* Order Items (7 cols) */}
                                    <div className="sm:col-span-7 flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
                                        <div className="space-y-2">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Ordered Items ({order.items?.length || 0}):
                                            </span>
                                            <div className="divide-y divide-border/60">
                                                {order.items?.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between py-1.5 text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-emerald-600">
                                                                {item.quantity}x
                                                            </span>
                                                            <span className="text-foreground">
                                                                {item.product?.name || `Product #${item.product_id}`}
                                                            </span>
                                                        </div>
                                                        <span className="font-medium text-foreground">
                                                            K{Number(item.unit_price).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                                            <span>Order Total:</span>
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                K{Number(order.total_amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-border px-2 py-4 text-xs text-muted-foreground">
                        <div>
                            Showing <span className="font-semibold text-foreground">{orders.from}</span> to{' '}
                            <span className="font-semibold text-foreground">{orders.to}</span> of{' '}
                            <span className="font-semibold text-foreground">{orders.total}</span> orders
                        </div>

                        <div className="flex items-center gap-1">
                            {orders.links.map((link, idx) => {
                                if (!link.url) {
                                    return (
                                        <span
                                            key={idx}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="rounded px-2.5 py-1 text-muted-foreground/50 opacity-50"
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded px-2.5 py-1 transition ${
                                            link.active
                                                ? 'bg-slate-900 font-semibold text-white dark:bg-zinc-100 dark:text-slate-900'
                                                : 'hover:bg-muted text-foreground'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

OrdersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Customer Orders',
            href: '/admin/orders',
        },
    ],
};

