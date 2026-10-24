import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
}

interface Props {
    medicine: Medicine;
    categories: string[];
}

export default function MedicinesEdit({ medicine, categories }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: medicine.name || '',
        dosage: medicine.dosage || '',
        category: medicine.category || categories[0] || 'Pain Relief',
        price: medicine.price || '',
        stock_quantity: medicine.stock_quantity ?? 10,
        in_stock: Boolean(medicine.in_stock),
        badge: medicine.badge || '',
        manufacturer: medicine.manufacturer || '',
        expiry_date: medicine.expiry_date || '',
        description: medicine.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/medicines/${medicine.id}`);
    };

    return (
        <>
            <Head title={`Edit Medicine - ${medicine.name}`} />
            <div className="max-w-4xl p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/medicines">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <Pill className="h-6 w-6 text-blue-600" />
                            Edit Medicine: {medicine.name}
                        </h1>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Medicine Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            {/* Dosage */}
                            <div className="space-y-2">
                                <Label htmlFor="dosage">Dosage / Pack Size</Label>
                                <Input
                                    id="dosage"
                                    type="text"
                                    value={data.dosage}
                                    onChange={(e) => setData('dosage', e.target.value)}
                                />
                                {errors.dosage && <p className="text-xs text-red-500">{errors.dosage}</p>}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (ZMW) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                />
                                {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                            </div>

                            {/* Stock Quantity */}
                            <div className="space-y-2">
                                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                                <Input
                                    id="stock_quantity"
                                    type="number"
                                    min="0"
                                    value={data.stock_quantity}
                                    onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                    required
                                />
                                {errors.stock_quantity && (
                                    <p className="text-xs text-red-500">{errors.stock_quantity}</p>
                                )}
                            </div>

                            {/* Badge */}
                            <div className="space-y-2">
                                <Label htmlFor="badge">Special Badge (Optional)</Label>
                                <Input
                                    id="badge"
                                    type="text"
                                    placeholder="e.g. Best Seller, Prescription Only"
                                    value={data.badge}
                                    onChange={(e) => setData('badge', e.target.value)}
                                />
                                {errors.badge && <p className="text-xs text-red-500">{errors.badge}</p>}
                            </div>

                            {/* Manufacturer */}
                            <div className="space-y-2">
                                <Label htmlFor="manufacturer">Manufacturer</Label>
                                <Input
                                    id="manufacturer"
                                    type="text"
                                    value={data.manufacturer}
                                    onChange={(e) => setData('manufacturer', e.target.value)}
                                />
                                {errors.manufacturer && (
                                    <p className="text-xs text-red-500">{errors.manufacturer}</p>
                                )}
                            </div>

                            {/* Expiry Date */}
                            <div className="space-y-2">
                                <Label htmlFor="expiry_date">Expiry Date</Label>
                                <Input
                                    id="expiry_date"
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                />
                                {errors.expiry_date && (
                                    <p className="text-xs text-red-500">{errors.expiry_date}</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Product Description</Label>
                            <textarea
                                id="description"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                        </div>

                        {/* In Stock Checkbox */}
                        <div className="flex items-center gap-2">
                            <input
                                id="in_stock"
                                type="checkbox"
                                checked={data.in_stock}
                                onChange={(e) => setData('in_stock', e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="in_stock" className="cursor-pointer">
                                Mark as Available in Stock
                            </Label>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <Button asChild variant="outline">
                                <Link href="/medicines">Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Updating...' : 'Update Medicine'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

MedicinesEdit.layout = {
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
            title: 'Edit Medicine',
            href: '#',
        },
    ],
};
