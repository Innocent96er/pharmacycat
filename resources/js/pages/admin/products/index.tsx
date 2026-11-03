import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Check,
    CheckCircle2,
    Edit2,
    Eye,
    Filter,
    Minus,
    Package,
    Pill,
    Plus,
    Search,
    Star,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Auth } from '@/types/auth';

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
    expiry_date?: string | null;
    image_url?: string | null;
    created_at: string;
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
    categories: string[];
    filters: {
        search: string;
        category: string;
        prescription_type: string;
        stock_status: string;
        sort: string;
    };
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    const { auth, flash } = usePage().props as {
        auth: Auth;
        flash?: { success?: string | null; error?: string | null };
    };

    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [prescriptionType, setPrescriptionType] = useState(
        filters.prescription_type || 'all',
    );
    const [stockStatus, setStockStatus] = useState(
        filters.stock_status || 'all',
    );
    const [sort, setSort] = useState(filters.sort || 'latest');

    // Delete modal state
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleFilterChange = (updates: Partial<typeof filters>) => {
        const next = {
            search,
            category,
            prescription_type: prescriptionType,
            stock_status: stockStatus,
            sort,
            ...updates,
        };

        const query = Object.fromEntries(
            Object.entries(next).filter(([, val]) => val && val !== 'all'),
        );

        router.get('/admin/products', query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange({ search });
    };

    const handleQuickStock = (product: Product, delta: number) => {
        const newStock = Math.max(0, product.stock + delta);
        router.patch(
            `/admin/products/${product.id}/stock`,
            { stock: newStock },
            { preserveScroll: true },
        );
    };

    const handleToggleFeatured = (product: Product) => {
        router.patch(
            `/admin/products/${product.id}/toggle-featured`,
            {},
            { preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        router.delete(`/admin/products/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <>
            <Head title="Manage Products - Pharmacy Catalog" />

            <div className="flex flex-col gap-6 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                INVENTORY & SALES
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Total: {products.total} products
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Products Management (CRUD)
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Upload new medications, modify pricing, update stock levels, and organize categories.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            className="bg-emerald-600 font-semibold text-white shadow hover:bg-emerald-700"
                        >
                            <Link href="/admin/products/create">
                                <Plus className="mr-1.5 h-4 w-4" />
                                Upload New Product
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <Card className="border-border/80 p-4 shadow-sm">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col gap-3 lg:flex-row lg:items-center"
                    >
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by product name, ingredient, dosage, or brand..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        handleFilterChange({ search: '' });
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Category Filter */}
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    handleFilterChange({ category: e.target.value });
                                }}
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            {/* Prescription Type Filter */}
                            <select
                                value={prescriptionType}
                                onChange={(e) => {
                                    setPrescriptionType(e.target.value);
                                    handleFilterChange({ prescription_type: e.target.value });
                                }}
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                <option value="all">All Types</option>
                                <option value="otc">OTC (Over the Counter)</option>
                                <option value="rx">Rx (Prescription)</option>
                            </select>

                            {/* Stock Filter */}
                            <select
                                value={stockStatus}
                                onChange={(e) => {
                                    setStockStatus(e.target.value);
                                    handleFilterChange({ stock_status: e.target.value });
                                }}
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                <option value="all">All Stock Levels</option>
                                <option value="in_stock">In Stock (&ge; 10)</option>
                                <option value="low_stock">Low Stock (&lt; 10)</option>
                                <option value="out_of_stock">Out of Stock (0)</option>
                            </select>

                            {/* Sort Filter */}
                            <select
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    handleFilterChange({ sort: e.target.value });
                                }}
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                <option value="latest">Latest First</option>
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="price_asc">Price (Low to High)</option>
                                <option value="price_desc">Price (High to Low)</option>
                                <option value="stock_asc">Stock (Low to High)</option>
                                <option value="stock_desc">Stock (High to Low)</option>
                            </select>

                            <Button type="submit" size="sm" variant="secondary" className="h-9">
                                Filter
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Products Table */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Stock Level</th>
                                    <th className="px-4 py-3 text-center">Featured</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                            <Package className="mx-auto mb-2 h-8 w-8 text-muted-foreground/60" />
                                            <p className="font-medium text-foreground">No products found</p>
                                            <p className="text-xs">Try adjusting your filters or upload a new product.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="transition-colors hover:bg-muted/40"
                                        >
                                            {/* Product column */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
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
                                                            <span className="font-semibold text-foreground">
                                                                {product.name}
                                                            </span>
                                                            {product.badge && (
                                                                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                                    {product.badge}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {product.dosage && <span className="mr-2">{product.dosage}</span>}
                                                            {product.active_ingredient && (
                                                                <span className="italic text-muted-foreground/80">
                                                                    ({product.active_ingredient})
                                                                </span>
                                                            )}
                                                        </div>
                                                        {product.manufacturer && (
                                                            <div className="text-[11px] text-muted-foreground/70">
                                                                Mfr: {product.manufacturer}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-4 py-3 whitespace-nowrap text-xs text-foreground">
                                                <span className="rounded-md border border-border/80 bg-muted/30 px-2 py-1">
                                                    {product.category}
                                                </span>
                                            </td>

                                            {/* Prescription Type */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                                                        product.prescription_type === 'rx'
                                                            ? 'border border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                                            : 'border border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                    }`}
                                                >
                                                    {product.prescription_type === 'rx' ? 'Rx Only' : 'OTC'}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="px-4 py-3 whitespace-nowrap font-semibold text-foreground">
                                                K{Number(product.price).toFixed(2)}
                                            </td>

                                            {/* Stock */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                                                            product.stock <= 0
                                                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                                : product.stock < 10
                                                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                        }`}
                                                    >
                                                        {product.stock <= 0
                                                            ? '0 (Out of stock)'
                                                            : `${product.stock} units`}
                                                    </span>

                                                    {/* Quick stock stepper */}
                                                    <div className="flex items-center rounded-md border border-border">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQuickStock(product, -1)}
                                                            disabled={product.stock <= 0}
                                                            className="px-1.5 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                                                            title="Decrease stock by 1"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQuickStock(product, 5)}
                                                            className="px-1.5 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            title="Add 5 units"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Featured Toggle */}
                                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleFeatured(product)}
                                                    className={`rounded-full p-1.5 transition-colors ${
                                                        product.is_featured
                                                            ? 'text-amber-500 hover:bg-amber-500/10'
                                                            : 'text-muted-foreground/40 hover:bg-muted hover:text-muted-foreground'
                                                    }`}
                                                    title={product.is_featured ? 'Featured on storefront' : 'Not featured'}
                                                >
                                                    <Star
                                                        className={`h-4 w-4 ${product.is_featured ? 'fill-current' : ''}`}
                                                    />
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        title="Edit Product"
                                                    >
                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                            <Edit2 className="h-4 w-4" />
                                                        </Link>
                                                    </Button>

                                                    {auth.can.deleteProducts && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteTarget(product)}
                                                            className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                                                            title="Delete Product"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
                            <div>
                                Showing <span className="font-semibold text-foreground">{products.from}</span> to{' '}
                                <span className="font-semibold text-foreground">{products.to}</span> of{' '}
                                <span className="font-semibold text-foreground">{products.total}</span> products
                            </div>

                            <div className="flex items-center gap-1">
                                {products.links.map((link, idx) => {
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
                                                    ? 'bg-emerald-600 font-semibold text-white'
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={auth.can.deleteProducts && !!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-600">
                            <Trash2 className="h-5 w-5" />
                            Delete Product
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete{' '}
                            <span className="font-bold text-foreground">
                                "{deleteTarget?.name}"
                            </span>{' '}
                            from the pharmacy inventory? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Product'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Products (CRUD)',
            href: '/admin/products',
        },
    ],
};
