import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit2, Trash2, Pill, CheckCircle2, XCircle, Calendar, Building, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    expiry_date?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    medicine: Medicine;
}

export default function MedicinesShow({ medicine }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${medicine.name}"?`)) {
            router.delete(`/medicines/${medicine.id}`);
        }
    };

    return (
        <>
            <Head title={`Medicine - ${medicine.name}`} />
            <div className="max-w-4xl p-6 flex flex-col gap-6">
                {/* Back and Action buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/medicines">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/medicines/${medicine.id}/edit`}>
                                <Edit2 className="mr-2 h-4 w-4 text-blue-600" /> Edit Medicine
                            </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8 flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                            <div className="flex items-start gap-4">
                                <div className="h-16 w-16 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 border border-emerald-200 dark:border-emerald-800 shrink-0">
                                    <Pill className="h-8 w-8" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                            {medicine.name}
                                        </h1>
                                        {medicine.badge && (
                                            <span className="rounded bg-amber-100 dark:bg-amber-950 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                                                {medicine.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-neutral-500 text-sm mt-1">
                                        {medicine.dosage || 'Standard dosage'}
                                    </p>
                                </div>
                            </div>

                            <div className="text-left md:text-right">
                                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                    K{Number(medicine.price).toFixed(2)}
                                </div>
                                <div className="text-xs text-neutral-500 mt-1">Inclusive of all local pharmacy taxes</div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                                <div className="text-xs text-neutral-500 flex items-center gap-1.5 mb-1">
                                    <Tag className="h-3.5 w-3.5" /> Category
                                </div>
                                <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {medicine.category}
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                                <div className="text-xs text-neutral-500 flex items-center gap-1.5 mb-1">
                                    Stock Status
                                </div>
                                <div>
                                    {medicine.in_stock && medicine.stock_quantity > 0 ? (
                                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                                            <CheckCircle2 className="h-4 w-4" /> In Stock ({medicine.stock_quantity} left)
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600">
                                            <XCircle className="h-4 w-4" /> Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                                <div className="text-xs text-neutral-500 flex items-center gap-1.5 mb-1">
                                    <Building className="h-3.5 w-3.5" /> Manufacturer
                                </div>
                                <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {medicine.manufacturer || 'Unspecified'}
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                                <div className="text-xs text-neutral-500 flex items-center gap-1.5 mb-1">
                                    <Calendar className="h-3.5 w-3.5" /> Expiry Date
                                </div>
                                <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {medicine.expiry_date || 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                Description & Instructions
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-line bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                {medicine.description || 'No description provided for this medicine.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

MedicinesShow.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Medicines',
            href: '/medicines',
        },
        {
            title: 'Medicine Details',
            href: '#',
        },
    ],
};
