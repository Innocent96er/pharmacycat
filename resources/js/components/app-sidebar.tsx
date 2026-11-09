import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Package,
    Pill,
    ShoppingCart,
    Tags,
    Store,
    BookOpen,
    FolderGit2,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    // Staff navigation is a convenience; protected routes enforce access independently.
    const isStaff =
        auth?.user?.role === 'admin' ||
        auth?.user?.role === 'pharmacist' ||
        auth?.can?.manageProducts;

    const staffNavItems: NavItem[] = [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Products (CRUD)',
            href: '/admin/products',
            icon: Package,
        },
        {
            title: 'Orders',
            href: '/admin/orders',
            icon: ShoppingCart,
        },
        {
            title: 'Categories',
            href: '/admin/categories',
            icon: Tags,
        },
        {
            title: 'Medicine Catalog',
            href: '/medicines',
            icon: Pill,
        },
        {
            title: 'View Storefront',
            href: '/',
            icon: Store,
        },
    ];

    const customerNavItems: NavItem[] = [
        {
            title: 'Storefront',
            href: '/',
            icon: Store,
        },
        {
            title: 'Medicine Catalog',
            href: '/catalog',
            icon: Package,
        },
    ];

    const navItems = isStaff ? staffNavItems : customerNavItems;

    const footerNavItems: NavItem[] = [
        {
            title: 'View Public Store',
            href: '/',
            icon: Store,
        },
        {
            title: 'Product Catalog',
            href: '/catalog',
            icon: Package,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isStaff ? '/admin/dashboard' : dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
