import { Link } from '@inertiajs/react';
import {
    Clock,
    CreditCard,
    HeartHandshake,
    Mail,
    MapPin,
    Phone,
    Pill,
    ShieldCheck,
    Truck,
} from 'lucide-react';

export function StoreFooter() {
    return (
        <footer className="border-t border-border bg-slate-950 text-slate-300">
            {/* Value Props Bar */}
            <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                                <Truck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Courier Dispatch</h4>
                                <p className="text-[11px] text-slate-400">30 - 45 min Lusaka citywide delivery</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Genuine Medicine</h4>
                                <p className="text-[11px] text-slate-400">Sourced directly from verified labs</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                                <HeartHandshake className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Licensed Pharmacists</h4>
                                <p className="text-[11px] text-slate-400">Expert dosage & drug advice</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">MoMo & Cash on Delivery</h4>
                                <p className="text-[11px] text-slate-400">Airtel, MTN, Card, or Cash</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Links */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold shadow">
                                <Pill className="h-5 w-5 rotate-45" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white font-sans">
                                Pharmacy<span className="text-emerald-400">Cat</span>
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
                            Your trusted on-demand digital dispensary in Lusaka. Delivering authentic prescription and over-the-counter pharmaceuticals straight to homes, offices, and clinics.
                        </p>
                        <div className="space-y-1.5 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                                <span>Great East Road Dispensary, Lusaka, Zambia</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                                <span>+260 97 123 4567 • +260 96 987 6543</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                                <span>Mon - Sun: 07:30 AM - 10:00 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Departments */}
                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Health Departments</h4>
                        <ul className="mt-4 space-y-2 text-xs">
                            <li><Link href="/catalog?category=Pain+Relief" className="hover:text-emerald-400">Pain & Fever Relief</Link></li>
                            <li><Link href="/catalog?category=Cold+%26+Flu" className="hover:text-emerald-400">Cold, Cough & Flu</Link></li>
                            <li><Link href="/catalog?category=Vitamins+%26+Supplements" className="hover:text-emerald-400">Vitamins & Immunity</Link></li>
                            <li><Link href="/catalog?category=Antibiotics" className="hover:text-emerald-400">Antibiotics (Rx)</Link></li>
                            <li><Link href="/catalog?category=First+Aid" className="hover:text-emerald-400">First Aid & Trauma Kits</Link></li>
                            <li><Link href="/catalog?category=Medical+Devices" className="hover:text-emerald-400">Blood Pressure & Monitors</Link></li>
                        </ul>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pharmacy Catalog</h4>
                        <ul className="mt-4 space-y-2 text-xs">
                            <li><Link href="/catalog" className="font-semibold text-emerald-400 hover:underline">Explore Full Catalog →</Link></li>
                            <li><Link href="/catalog?prescription=otc" className="hover:text-emerald-400">Over-the-Counter (OTC)</Link></li>
                            <li><Link href="/catalog?prescription=rx" className="hover:text-emerald-400">Prescription Meds (Rx)</Link></li>
                            <li><Link href="/contact" className="hover:text-emerald-400">Pharmacist Consultations</Link></li>
                            <li><Link href="/admin/dashboard" className="hover:text-emerald-400">Staff Portal & Inventory</Link></li>
                        </ul>
                    </div>

                    {/* Couriers & Verification */}
                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dispatch & Safety</h4>
                        <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                            Express dispatch powered by Yango Delivery, inDrive City courier, and dedicated PharmacyCat temperature-controlled riders.
                        </p>
                        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Zambian Licensed Pharmacy</span>
                            <p className="mt-0.5 text-[11px] text-slate-400">Registration #ZAM-PHARM-2026</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
                    <p>© {new Date().getFullYear()} PharmacyCat Zambia. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/catalog" className="hover:text-slate-400">Browse Catalog</Link>
                        <Link href="/contact" className="hover:text-slate-400">Support & Hours</Link>
                        <Link href="/login" className="hover:text-slate-400">Staff Login</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

