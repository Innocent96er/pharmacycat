import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Product = {
    id: number;
    name: string;
    description: string | null;
    active_ingredient: string | null;
    category: string;
    price: string;
    prescription_type: 'otc' | 'rx';
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type Filters = {
    search: string;
    category: string;
    min_price: string;
    max_price: string;
    prescription: string;
};

const ALL = 'all';
const CATALOG_URL = '/catalog';

export default function Catalog({
    products,
    filters,
    categories,
}: {
    products: Paginated<Product>;
    filters: Filters;
    categories: string[];
}) {
    const [search, setSearch] = useState(filters.search);
    const [minPrice, setMinPrice] = useState(filters.min_price);
    const [maxPrice, setMaxPrice] = useState(filters.max_price);
    const firstRender = useRef(true);

    // Any change to search/filters drops `page`, so results restart on page 1.
    const apply = (next: Partial<Filters>) => {
        const merged = { ...filters, ...next };
        const query = Object.fromEntries(
            Object.entries(merged).filter(([, value]) => value !== ''),
        );

        router.get(CATALOG_URL, query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const goToPage = (page: number) => {
        const query = Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value !== ''),
        );

        router.get(
            CATALOG_URL,
            { ...query, page },
            { preserveState: true, preserveScroll: true },
        );
    };

    // Debounce the text inputs so we don't fire a request on every keystroke.
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;

            return;
        }

        const timer = setTimeout(() => {
            if (
                search !== filters.search ||
                minPrice !== filters.min_price ||
                maxPrice !== filters.max_price
            ) {
                apply({
                    search,
                    min_price: minPrice,
                    max_price: maxPrice,
                });
            }
        }, 350);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, minPrice, maxPrice]);

    const hasFilters = Object.values(filters).some((value) => value !== '');

    const clearAll = () => {
        setSearch('');
        setMinPrice('');
        setMaxPrice('');
        router.get(CATALOG_URL, {}, { preserveState: true, replace: true });
    };

    const pageNumbers = Array.from(
        { length: products.last_page },
        (_, i) => i + 1,
    );

    return (
        <>
            <Head title="Catalog" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Pharmacy &amp; Health Supplies
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Search the catalog and narrow it down by category, price
                        and prescription type.
                    </p>
                </div>

                {/* Search + filters */}
                <Card>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div className="grid gap-2 lg:col-span-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    className="pl-9"
                                    placeholder="Name, ingredient or description…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select
                                value={filters.category || ALL}
                                onValueChange={(value) =>
                                    apply({
                                        category: value === ALL ? '' : value,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>
                                        All categories
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Prescription type</Label>
                            <Select
                                value={filters.prescription || ALL}
                                onValueChange={(value) =>
                                    apply({
                                        prescription:
                                            value === ALL ? '' : value,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>All</SelectItem>
                                    <SelectItem value="otc">
                                        Over-the-counter (OTC)
                                    </SelectItem>
                                    <SelectItem value="rx">
                                        Prescription only (Rx)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Price range</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="Min"
                                    aria-label="Minimum price"
                                    value={minPrice}
                                    onChange={(e) =>
                                        setMinPrice(e.target.value)
                                    }
                                />
                                <span className="text-muted-foreground">–</span>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="Max"
                                    aria-label="Maximum price"
                                    value={maxPrice}
                                    onChange={(e) =>
                                        setMaxPrice(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Result summary */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        {products.total === 0
                            ? 'No results'
                            : `Showing ${products.from}–${products.to} of ${products.total} products`}
                    </span>
                    {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={clearAll}>
                            <X className="size-4" /> Clear filters
                        </Button>
                    )}
                </div>

                {/* Results */}
                {products.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No products found. Try a different search or clear
                            the filters.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-3">
                        {products.data.map((product) => (
                            <Card key={product.id}>
                                <CardContent className="flex items-start justify-between gap-4">
                                    <div className="grid gap-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="font-medium">
                                                {product.name}
                                            </h2>
                                            <Badge
                                                variant={
                                                    product.prescription_type ===
                                                    'rx'
                                                        ? 'destructive'
                                                        : 'secondary'
                                                }
                                            >
                                                {product.prescription_type ===
                                                'rx'
                                                    ? 'Rx'
                                                    : 'OTC'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {product.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {product.category}
                                            {product.active_ingredient &&
                                                ` · ${product.active_ingredient}`}
                                        </p>
                                    </div>
                                    <div className="font-semibold whitespace-nowrap">
                                        ${Number(product.price).toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination (5 per page) */}
                {products.last_page > 1 && (
                    <nav
                        aria-label="Pagination"
                        className="flex flex-wrap items-center justify-center gap-1"
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={products.current_page === 1}
                            onClick={() => goToPage(products.current_page - 1)}
                        >
                            <ChevronLeft className="size-4" /> Previous
                        </Button>

                        {pageNumbers.map((page) => (
                            <Button
                                key={page}
                                size="sm"
                                variant={
                                    page === products.current_page
                                        ? 'default'
                                        : 'outline'
                                }
                                aria-current={
                                    page === products.current_page
                                        ? 'page'
                                        : undefined
                                }
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={
                                products.current_page === products.last_page
                            }
                            onClick={() => goToPage(products.current_page + 1)}
                        >
                            Next <ChevronRight className="size-4" />
                        </Button>
                    </nav>
                )}
            </div>
        </>
    );
}

Catalog.layout = {
    breadcrumbs: [
        {
            title: 'Catalog',
            href: CATALOG_URL,
        },
    ],
};
