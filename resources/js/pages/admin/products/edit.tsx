import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Image as ImageIcon,
    Trash2,
    Upload,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description?: string | null;
    active_ingredient?: string | null;
    dosage?: string | null;
    category: string;
    category_id?: number | null;
    price: string | number;
    stock: number;
    prescription_type: 'otc' | 'rx';
    is_featured: boolean;
    badge?: string | null;
    manufacturer?: string | null;
    expiry_date?: string | null;
    image_url?: string | null;
    image?: string | null;
}

interface Props {
    product: Product;
    categories: Category[];
    sampleImages: Record<string, string>;
}

export default function EditProduct({ product, categories, sampleImages }: Props) {
    const { data, setData, processing, errors } = useForm({
        name: product.name,
        category: product.category,
        category_id: product.category_id || '',
        price: String(product.price),
        stock: String(product.stock),
        prescription_type: product.prescription_type,
        active_ingredient: product.active_ingredient || '',
        dosage: product.dosage || '',
        manufacturer: product.manufacturer || '',
        badge: product.badge || '',
        expiry_date: product.expiry_date ? product.expiry_date.substring(0, 10) : '',
        description: product.description || '',
        is_featured: Boolean(product.is_featured),
        image_file: null as File | null,
        image_url: product.image || '',
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(product.image_url || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image_file', file);
            setData('image_url', '');
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSelectSampleImage = (path: string) => {
        setData('image_file', null);
        setData('image_url', path);
        setPreviewUrl(path);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/admin/products/${product.id}`,
            {
                _method: 'PUT',
                ...data,
            },
            {
                forceFormData: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title={`Edit ${product.name} - Pharmacy Inventory`} />

            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6 md:p-8">
                {/* Back Link & Header */}
                <div className="flex items-center justify-between">
                    <Button asChild variant="ghost" size="sm" className="gap-1.5">
                        <Link href="/admin/products">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Products
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            EDIT CATALOG ITEM #{product.id}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Edit Product: {product.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Update medicine formulas, prices, stock levels, or replacement image.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Basic Info */}
                    <Card className="border-border/80 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Product Information</CardTitle>
                            <CardDescription>
                                Core information displayed across the pharmacy catalog
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            {/* Product Name */}
                            <div className="sm:col-span-2 space-y-1.5">
                                <Label htmlFor="name">
                                    Product Name <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-xs text-rose-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-1.5">
                                <Label htmlFor="category">
                                    Category <span className="text-rose-500">*</span>
                                </Label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => {
                                        const selected = categories.find((c) => c.name === e.target.value);
                                        setData({
                                            ...data,
                                            category: e.target.value,
                                            category_id: selected ? selected.id : '',
                                        });
                                    }}
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                    <option value="Pain Relief">Pain Relief</option>
                                    <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                                    <option value="Antibiotics">Antibiotics</option>
                                    <option value="Cold & Flu">Cold & Flu</option>
                                    <option value="First Aid">First Aid</option>
                                    <option value="Baby Care">Baby Care</option>
                                    <option value="Medical Devices">Medical Devices</option>
                                    <option value="Skincare">Skincare</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.category && (
                                    <p className="text-xs text-rose-500">{errors.category}</p>
                                )}
                            </div>

                            {/* Prescription Type */}
                            <div className="space-y-1.5">
                                <Label htmlFor="prescription_type">
                                    Dispensation Requirement <span className="text-rose-500">*</span>
                                </Label>
                                <select
                                    id="prescription_type"
                                    value={data.prescription_type}
                                    onChange={(e) => setData('prescription_type', e.target.value as 'otc' | 'rx')}
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    required
                                >
                                    <option value="otc">OTC - Over The Counter (No prescription needed)</option>
                                    <option value="rx">Rx - Prescription Only (Doctor prescription required)</option>
                                </select>
                                {errors.prescription_type && (
                                    <p className="text-xs text-rose-500">{errors.prescription_type}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="space-y-1.5">
                                <Label htmlFor="price">
                                    Price (ZMW / K) <span className="text-rose-500">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                                        K
                                    </span>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="pl-8"
                                        required
                                    />
                                </div>
                                {errors.price && (
                                    <p className="text-xs text-rose-500">{errors.price}</p>
                                )}
                            </div>

                            {/* Stock Quantity */}
                            <div className="space-y-1.5">
                                <Label htmlFor="stock">
                                    Warehouse Stock (Units) <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    required
                                />
                                {errors.stock && (
                                    <p className="text-xs text-rose-500">{errors.stock}</p>
                                )}
                            </div>

                            {/* Active Ingredient */}
                            <div className="space-y-1.5">
                                <Label htmlFor="active_ingredient">Active Ingredient</Label>
                                <Input
                                    id="active_ingredient"
                                    type="text"
                                    value={data.active_ingredient}
                                    onChange={(e) => setData('active_ingredient', e.target.value)}
                                />
                                {errors.active_ingredient && (
                                    <p className="text-xs text-rose-500">{errors.active_ingredient}</p>
                                )}
                            </div>

                            {/* Dosage / Packaging */}
                            <div className="space-y-1.5">
                                <Label htmlFor="dosage">Dosage / Pack Size</Label>
                                <Input
                                    id="dosage"
                                    type="text"
                                    value={data.dosage}
                                    onChange={(e) => setData('dosage', e.target.value)}
                                />
                                {errors.dosage && (
                                    <p className="text-xs text-rose-500">{errors.dosage}</p>
                                )}
                            </div>

                            {/* Manufacturer */}
                            <div className="space-y-1.5">
                                <Label htmlFor="manufacturer">Manufacturer / Pharmaceutical Brand</Label>
                                <Input
                                    id="manufacturer"
                                    type="text"
                                    value={data.manufacturer}
                                    onChange={(e) => setData('manufacturer', e.target.value)}
                                />
                                {errors.manufacturer && (
                                    <p className="text-xs text-rose-500">{errors.manufacturer}</p>
                                )}
                            </div>

                            {/* Expiry Date */}
                            <div className="space-y-1.5">
                                <Label htmlFor="expiry_date">Batch Expiry Date</Label>
                                <Input
                                    id="expiry_date"
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                />
                                {errors.expiry_date && (
                                    <p className="text-xs text-rose-500">{errors.expiry_date}</p>
                                )}
                            </div>

                            {/* Badge */}
                            <div className="space-y-1.5">
                                <Label htmlFor="badge">Promotional Badge</Label>
                                <Input
                                    id="badge"
                                    type="text"
                                    value={data.badge}
                                    onChange={(e) => setData('badge', e.target.value)}
                                />
                                {errors.badge && (
                                    <p className="text-xs text-rose-500">{errors.badge}</p>
                                )}
                            </div>

                            {/* Featured Checkbox */}
                            <div className="flex items-center gap-2 pt-6">
                                <input
                                    id="is_featured"
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
                                />
                                <Label htmlFor="is_featured" className="cursor-pointer font-medium">
                                    Feature this product prominently on storefront homepage
                                </Label>
                            </div>

                            {/* Description */}
                            <div className="sm:col-span-2 space-y-1.5">
                                <Label htmlFor="description">Medical & Usage Description</Label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                {errors.description && (
                                    <p className="text-xs text-rose-500">{errors.description}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Upload & Selection */}
                    <Card className="border-border/80 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Product Image</CardTitle>
                            <CardDescription>
                                Replace existing image with a new upload or select from bundled pharmacy images
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Upload Area */}
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-6 text-center transition hover:border-emerald-500/50 bg-muted/20">
                                {previewUrl ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="relative h-40 w-40 overflow-hidden rounded-xl border shadow-md bg-background">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Current image preview</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-600">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <p className="mt-2 text-sm font-medium text-foreground">
                                            Click to browse new image
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PNG, JPG or WebP up to 5MB
                                        </p>
                                    </div>
                                )}

                                <input
                                    id="image_file"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleFileChange}
                                    className="mt-3 block text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-700 cursor-pointer"
                                />
                                {errors.image_file && (
                                    <p className="mt-2 text-xs text-rose-500">{errors.image_file}</p>
                                )}
                            </div>

                            {/* Or Pick a Pre-bundled Image */}
                            <div>
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Or Choose from Pre-bundled Pharmacy Photos:
                                </Label>
                                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                    {Object.entries(sampleImages).map(([path, label]) => {
                                        const isSelected = data.image_url === path;
                                        return (
                                            <button
                                                key={path}
                                                type="button"
                                                onClick={() => handleSelectSampleImage(path)}
                                                className={`group relative flex flex-col items-center overflow-hidden rounded-lg border p-1 text-left transition-all ${
                                                    isSelected
                                                        ? 'border-emerald-600 ring-2 ring-emerald-600/30 bg-emerald-50/20'
                                                        : 'border-border/60 hover:border-emerald-500/40 bg-card'
                                                }`}
                                            >
                                                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                                                    <img
                                                        src={path}
                                                        alt={label}
                                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute right-1 top-1 rounded-full bg-emerald-600 p-0.5 text-white shadow">
                                                            <Check className="h-3 w-3" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="mt-1 line-clamp-1 w-full text-center text-[10px] font-medium text-foreground">
                                                    {label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pb-8">
                        <Button asChild variant="outline">
                            <Link href="/admin/products">Cancel</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-emerald-600 font-semibold text-white shadow hover:bg-emerald-700"
                        >
                            {processing ? 'Saving Changes...' : 'Update Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditProduct.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Products',
            href: '/admin/products',
        },
        {
            title: 'Edit Product',
            href: '/admin/products',
        },
    ],
};

