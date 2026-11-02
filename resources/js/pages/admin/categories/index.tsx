import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Edit2, Plus, Tags, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    products_count: number;
}

interface Props {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: Props) {
    const { flash } = usePage().props as {
        flash?: { success?: string | null; error?: string | null };
    };

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
    });

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories', {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    };

    const handleStartEdit = (category: Category) => {
        setEditingCategory(category);
        setEditName(category.name);
        setEditDescription(category.description || '');
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        router.put(
            `/admin/categories/${editingCategory.id}`,
            {
                name: editName,
                description: editDescription,
            },
            {
                onSuccess: () => setEditingCategory(null),
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (category: Category) => {
        if (
            confirm(
                `Are you sure you want to remove category "${category.name}"?`,
            )
        ) {
            router.delete(`/admin/categories/${category.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Pharmacy Categories - Admin" />

            <div className="flex flex-col gap-6 p-6 md:p-8">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            INVENTORY TAXONOMY
                        </span>
                    </div>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Product Categories
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Organize medical items, prescription classes, and wellness collections.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Categories Table (8 cols) */}
                    <div className="lg:col-span-8">
                        <Card className="border-border/80 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Existing Categories ({categories.length})</CardTitle>
                                <CardDescription>
                                    Categories currently assigned to catalog products
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y divide-border">
                                    {categories.map((cat) => (
                                        <div
                                            key={cat.id}
                                            className="flex items-center justify-between py-3"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-foreground">
                                                        {cat.name}
                                                    </span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {cat.products_count} product(s)
                                                    </Badge>
                                                </div>
                                                {cat.description && (
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {cat.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleStartEdit(cat)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(cat)}
                                                    className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Create Category Form (4 cols) */}
                    <div className="lg:col-span-4">
                        <Card className="border-border/80 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Plus className="h-5 w-5 text-emerald-600" />
                                    Add New Category
                                </CardTitle>
                                <CardDescription>
                                    Create a new department for sorting products
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">Category Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Dental Care, Eye Drops"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-rose-500">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="description">Description (Optional)</Label>
                                        <textarea
                                            id="description"
                                            rows={3}
                                            placeholder="Brief notes about this department..."
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full rounded-md border border-input bg-background p-2.5 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                        {errors.description && (
                                            <p className="text-xs text-rose-500">{errors.description}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-emerald-600 text-white shadow hover:bg-emerald-700"
                                    >
                                        {processing ? 'Creating...' : 'Create Category'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog
                open={!!editingCategory}
                onOpenChange={(open) => !open && setEditingCategory(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category: {editingCategory?.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveEdit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="editName">Category Name</Label>
                            <Input
                                id="editName"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="editDescription">Description</Label>
                            <textarea
                                id="editDescription"
                                rows={3}
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full rounded-md border border-input bg-background p-2.5 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingCategory(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Categories',
            href: '/admin/categories',
        },
    ],
};

