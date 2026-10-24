import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, Eye, Pill, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Medicine {
    id: number;
    name: string;
    dosage?: string;
    category: string;
    price: number | string;
    stock_quantity: number;
    in_stock: boolean;
    badge?: string;
    description?: string;
    manufacturer?: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    medicines: {
        data: Medicine[];
        links: PaginationLink[];
        total: number;
        current_page: number;
        last_page: number;
    };
    categories: string[];
    filters: {
        search: string;
        category: string;
    };
}

export default function MedicinesIndex({ medicines, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'All');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/medicines', { search, category: selectedCategory }, { preserveState: true });
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        router.get('/medicines', { search, category }, { preserveState: true });
    };

    const handleDelete = (medicine: Medicine) => {
        if (confirm(`Are you sure you want to delete "${medicine.name}"?`)) {
            router.delete(`/medicines/${medicine.id}`);
        }
    };

    return (
        <>
            <Head title="Medicine Catalog" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Pill className="h-7 w-7 text-emerald-600" />
                            Pharmacy Catalog (CRUD)
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Manage pharmaceutical inventory, prices, dosages, and stock levels. Total items: {medicines.total}
                        </p>
                    </div>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shadow">
                        <Link href="/medicines/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Medicine
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Input
                                type="text"
                                placeholder="Search by name, dosage or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                                    selectedCategory === cat
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs uppercase text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4">Medicine</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {medicines.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                            No medicines found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    medicines.data.map((med) => (
                                        <tr key={med.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 border border-emerald-200 dark:border-emerald-800/60">
                                                        <Pill className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                            {med.name}
                                                        </div>
                                                        <div className="text-xs text-neutral-500">
                                                            {med.dosage || 'Standard'} {med.manufacturer ? `• ${med.manufacturer}` : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                                                    {med.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-neutral-100">
                                                K{Number(med.price).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-700 dark:text-neutral-300">
                                                {med.stock_quantity} units
                                            </td>
                                            <td className="px-6 py-4">
                                                {med.in_stock && med.stock_quantity > 0 ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 className="h-3.5 w-3.5" /> In Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                                                        <XCircle className="h-3.5 w-3.5" /> Out of Stock
                                                    </span>
                                                )}
                                                {med.badge && (
                                                    <span className="ml-2 inline-block rounded bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                        {med.badge}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button asChild variant="ghost" size="sm" title="View Details">
                                                        <Link href={`/medicines/${med.id}`}>
                                                            <Eye className="h-4 w-4 text-neutral-500" />
                                                        </Link>
                                                    </Button>
                                                    <Button asChild variant="ghost" size="sm" title="Edit">
                                                        <Link href={`/medicines/${med.id}/edit`}>
                                                            <Edit2 className="h-4 w-4 text-blue-600" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(med)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {medicines.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 px-6 py-4">
                            <div className="text-xs text-neutral-500">
                                Page {medicines.current_page} of {medicines.last_page}
                            </div>
                            <div className="flex items-center gap-1">
                                {medicines.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 text-xs rounded transition-colors ${
                                            link.active
                                                ? 'bg-emerald-600 text-white font-semibold'
                                                : link.url
                                                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                                                : 'text-neutral-400 cursor-not-allowed opacity-50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

MedicinesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Medicines',
            href: '/medicines',
        },
    ],
};
