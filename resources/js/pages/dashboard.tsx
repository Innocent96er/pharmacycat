import { Head, Link } from '@inertiajs/react';
import { LayoutGrid, Package, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    return (
        <>
            <Head title="Pharmacy Dashboard" />
            <div className="flex flex-col items-center justify-center gap-6 p-8 min-h-[60vh] text-center">
                <div className="rounded-full bg-emerald-500/10 p-4 text-emerald-600">
                    <LayoutGrid className="h-10 w-10" />
                </div>
                <div className="max-w-md">
                    <h1 className="text-2xl font-bold tracking-tight">Pharmacy Portal</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Access the administrative tools to upload inventory, manage prescription products, or view the online pharmacy.
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-700">
                        <Link href="/admin/dashboard">
                            Go to Admin Dashboard
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin/products">
                            <Package className="mr-1.5 h-4 w-4" />
                            Manage Products
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">
                            <Store className="mr-1.5 h-4 w-4" />
                            View Storefront
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
