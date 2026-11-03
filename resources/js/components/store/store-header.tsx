import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    LogOut,
    Menu,
    Phone,
    Pill,
    ShoppingBag,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { login, logout, register } from '@/routes';

interface StoreHeaderProps {
    cartCount: number;
    onOpenCart: () => void;
}

export function StoreHeader({ cartCount, onOpenCart }: StoreHeaderProps) {
    const { auth } = usePage().props as {
        auth?: { user?: { name: string; email: string; role?: string } };
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Show staff links to admins and pharmacists; route middleware remains authoritative.
    const isStaff =
        auth?.user?.role === 'admin' || auth?.user?.role === 'pharmacist';

    return (
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
            {/* Top Bar Banner */}
            <div className="bg-emerald-950 px-4 py-1.5 text-center text-xs font-medium text-emerald-200">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        Licensed Zambian Dispensary • Express 30-min Delivery via Yango & inDrive
                    </span>
                    <div className="hidden items-center gap-4 text-xs text-emerald-300 md:flex">
                        <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> Lusaka Helpline: +260 97 123 4567
                        </span>
                        <span>Free Lusaka Delivery Over K350</span>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                {/* Logo */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                            <Pill className="h-5 w-5 rotate-45" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold tracking-tight text-foreground font-sans">
                                Pharmacy<span className="text-emerald-600">Cat</span>
                            </span>
                            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase -mt-1">
                                Dispensary & Delivery
                            </span>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden items-center gap-1 lg:flex text-sm font-medium">
                        <Link
                            href="/"
                            className="rounded-lg px-3.5 py-1.5 font-semibold text-foreground transition hover:bg-muted"
                        >
                            Home
                        </Link>
                    </nav>
                </div>

                {/* Right Side Actions: Cart, Auth */}
                <div className="flex items-center gap-3">
                    {/* Cart Trigger */}
                    <button
                        type="button"
                        onClick={onOpenCart}
                        className="relative flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-bold text-foreground shadow-sm transition hover:border-emerald-500/50 hover:bg-muted/60"
                        aria-label="View shopping cart"
                    >
                        <ShoppingBag className="h-4 w-4 text-emerald-600" />
                        <span className="hidden sm:inline">Cart</span>
                        {cartCount > 0 && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-extrabold text-white animate-scale">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Auth Status */}
                    {auth?.user ? (
                        <div className="flex items-center gap-2">
                            {isStaff ? (
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-emerald-600 font-bold text-white shadow-sm hover:bg-emerald-700 text-xs"
                                >
                                    <Link href="/admin/dashboard">
                                        <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
                                        Admin Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1 text-xs">
                                    <User className="h-3.5 w-3.5 text-emerald-600" />
                                    <span className="font-medium text-foreground max-w-[100px] truncate">
                                        {auth.user.name.split(' ')[0]}
                                    </span>
                                </div>
                            )}

                            <Link
                                href={logout()}
                                method="post"
                                as="button"
                                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-rose-500"
                                title="Sign Out"
                            >
                                <LogOut className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Button asChild variant="ghost" size="sm" className="text-xs">
                                <Link href={login()}>Log in</Link>
                            </Button>
                            <Button
                                asChild
                                size="sm"
                                className="bg-emerald-600 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                            >
                                <Link href={register()}>Register</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="border-t border-border bg-background p-4 lg:hidden">
                    <nav className="flex flex-col gap-1 text-sm font-medium">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="rounded-lg px-3 py-2 font-semibold text-foreground hover:bg-muted"
                        >
                            Home
                        </Link>

                        {!auth?.user && (
                            <div className="mt-2 flex gap-2 border-t border-border pt-3">
                                <Button asChild variant="outline" size="sm" className="w-full">
                                    <Link href={login()}>Log in</Link>
                                </Button>
                                <Button asChild size="sm" className="w-full bg-emerald-600 text-white">
                                    <Link href={register()}>Register</Link>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
