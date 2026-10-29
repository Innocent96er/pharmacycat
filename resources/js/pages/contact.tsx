import { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    CheckCircle2,
    ArrowLeft,
    Pill,
    Sparkles,
    ShieldCheck,
    MessageCircle,
    Smartphone,
    LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { dashboard, login, logout, register } from '@/routes';

interface Props {
    status?: string;
}

export default function Contact({ status }: Props) {
    const { auth } = usePage().props as {
        auth?: { user?: { name: string; email: string } };
    };

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        subject: 'General Medicine Enquiry',
        message: '',
    });

    const [copiedPhone, setCopiedPhone] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopy = (text: string, type: 'phone' | 'email') => {
        void navigator.clipboard.writeText(text);
        if (type === 'phone') {
            setCopiedPhone(true);
            setTimeout(() => setCopiedPhone(false), 2000);
            toast.success('Phone number 0778744331 copied to clipboard!');
        } else {
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
            toast.success('Email pharmarcycat@gmail.com copied to clipboard!');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                reset('message');
                toast.success('Message Sent Successfully!', {
                    description:
                        'Our pharmacist will get back to you shortly at your email.',
                });
            },
            onError: () => {
                toast.error(
                    'Could not send message. Please review the form fields.',
                );
            },
        });
    };

    const QUICK_SUBJECTS = [
        'Medicine Availability',
        'Prescription Refill',
        'Order & Payment Enquiry',
        'Pharmacist Consultation',
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
            <Head title="Contact Us - PharmacyCat Certified Healthcare" />

            {/* TOP NAVIGATION BAR */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 transition active:scale-95"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                            <Pill className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                Pharmacy
                                <span className="text-emerald-600 dark:text-emerald-400">
                                    Cat
                                </span>
                            </span>
                            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                Certified Care & Dispensary
                            </span>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-1 sm:gap-2">
                        <Link
                            href="/"
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#catalog"
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
                            Catalog
                        </Link>
                        <Link
                            href="/#about"
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
                            About
                        </Link>
                        <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Contact
                        </span>

                        <div className="ml-2 flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-zinc-800">
                            {auth?.user ? (
                                <>
                                    <Link
                                        href={dashboard()}
                                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        onClick={() => router.flushAll()}
                                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                        Log out
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* MAIN CONTENT CONTAINER */}
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
                {/* Back to Home Link */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Pharmacy Home</span>
                    </Link>
                </div>

                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 text-white shadow-xl shadow-emerald-900/10 sm:p-12">
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
                            <span>Direct Pharmacist Support & Inquiries</span>
                        </div>
                        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                            We're Here For Your Health 24/7
                        </h1>
                        <p className="mt-4 text-sm leading-relaxed text-emerald-100 sm:text-base">
                            Have questions regarding a prescription, drug
                            dosage, or payment transfer? Reach out directly to
                            our licensed dispensary via phone call, WhatsApp, or
                            email.
                        </p>
                    </div>

                    {/* Decorative Background Pill Blur */}
                    <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                </div>

                {/* PRIMARY CONTACT CHANNELS (3 ACTION CARDS) */}
                <section className="mt-10 grid gap-6 sm:grid-cols-3">
                    {/* 1. Phone Hotline */}
                    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <Phone className="h-6 w-6" />
                            </div>
                            <span className="mt-4 block text-xs font-extrabold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                Direct Phone & Payments
                            </span>
                            <h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                                0778744331
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                Call for urgent drug availability, medical
                                inquiries, or sending mobile money payments to
                                our business line.
                            </p>
                        </div>
                        <div className="mt-6 flex flex-col gap-2">
                            <a
                                href="tel:0778744331"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95"
                            >
                                <Phone className="h-4 w-4" />
                                <span>Call 0778744331</span>
                            </a>
                            <button
                                type="button"
                                onClick={() =>
                                    handleCopy('0778744331', 'phone')
                                }
                                className="w-full rounded-xl border border-slate-200 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                {copiedPhone
                                    ? '✓ Copied Number'
                                    : 'Copy Number'}
                            </button>
                        </div>
                    </div>

                    {/* 2. WhatsApp Direct Chat */}
                    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <MessageCircle className="h-6 w-6" />
                            </div>
                            <span className="mt-4 block text-xs font-extrabold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                WhatsApp Prescription Chat
                            </span>
                            <h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                                0778744331
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                Send a photo of your doctor's prescription or
                                check brand availability instantly on WhatsApp.
                            </p>
                        </div>
                        <div className="mt-6">
                            <a
                                href="https://wa.me/260778744331"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95"
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span>Chat on WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* 3. Business Gmail */}
                    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <Mail className="h-6 w-6" />
                            </div>
                            <span className="mt-4 block text-xs font-extrabold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                Business Gmail
                            </span>
                            <h3 className="mt-1 text-lg font-black break-all text-slate-900 dark:text-white">
                                pharmarcycat@gmail.com
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                Reach our administration team for order
                                receipts, corporate supplies, or general
                                enquiries.
                            </p>
                        </div>
                        <div className="mt-6 flex flex-col gap-2">
                            <a
                                href="mailto:pharmarcycat@gmail.com"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95"
                            >
                                <Mail className="h-4 w-4" />
                                <span>Send Email</span>
                            </a>
                            <button
                                type="button"
                                onClick={() =>
                                    handleCopy(
                                        'pharmarcycat@gmail.com',
                                        'email',
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                {copiedEmail ? '✓ Copied Email' : 'Copy Email'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* FORM & LOCATION SECTION */}
                <section className="mt-12 grid gap-10 lg:grid-cols-12">
                    {/* LEFT: Contact & Prescription Form (7 Cols) */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                <Send className="h-4 w-4" />
                            </span>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                Send Us a Message
                            </h2>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
                            Fill out the form below. Messages are routed
                            straight to our verified pharmacist inbox (
                            <strong>pharmarcycat@gmail.com</strong>).
                        </p>

                        {/* Status alert */}
                        {(status || recentlySuccessful) && (
                            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                                <span>
                                    {status ||
                                        "Your message has been sent successfully! We'll reply shortly."}
                                </span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                        Your Full Name{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Innocent Mulima"
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-[11px] text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                        Email Address{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="yourname@gmail.com"
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-[11px] text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Quick Subject selector */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                    Subject / Topic{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {QUICK_SUBJECTS.map((subj) => (
                                        <button
                                            key={subj}
                                            type="button"
                                            onClick={() =>
                                                setData('subject', subj)
                                            }
                                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                                                data.subject === subj
                                                    ? 'bg-emerald-600 text-white shadow-sm'
                                                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                            }`}
                                        >
                                            {subj}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={data.subject}
                                    onChange={(e) =>
                                        setData('subject', e.target.value)
                                    }
                                    placeholder="Brief subject..."
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                />
                                {errors.subject && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {errors.subject}
                                    </p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                    Message Details{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={data.message}
                                    onChange={(e) =>
                                        setData('message', e.target.value)
                                    }
                                    placeholder="Please describe your medicine requirements, prescription notes, or any questions for our pharmacist..."
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-medium text-slate-900 shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                />
                                {errors.message && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Sending Message...</span>
                                    </span>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        <span>Send Message to Pharmacist</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT: Location, Operating Hours & Payment Details (5 Cols) */}
                    <div className="space-y-6 lg:col-span-5">
                        {/* Mobile Money Payment Info Card */}
                        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-50/50 p-6 dark:border-emerald-500/20 dark:bg-emerald-950/20">
                            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                                <Smartphone className="h-5 w-5" />
                                <h3 className="text-sm font-black tracking-wider uppercase">
                                    Mobile Money Payments
                                </h3>
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-zinc-300">
                                Paying for an order or counter pickup via Airtel
                                Money or MTN MoMo? Use our verified business
                                recipient number:
                            </p>
                            <div className="mt-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                                <span className="block text-[11px] font-bold text-slate-400 dark:text-zinc-400">
                                    PharmacyCat Recipient Line
                                </span>
                                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                                    0778744331
                                </span>
                                <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-zinc-400">
                                    Supported: Airtel Money • MTN MoMo • Zamtel
                                    Kwacha
                                </span>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <a
                                    href="tel:0778744331"
                                    className="flex-1 rounded-xl bg-emerald-600 py-2 text-center text-xs font-bold text-white transition hover:bg-emerald-700"
                                >
                                    Call 0778744331
                                </a>
                                <a
                                    href="https://wa.me/260778744331"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 rounded-xl border border-emerald-600 bg-white py-2 text-center text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 dark:bg-zinc-800 dark:text-emerald-300"
                                >
                                    WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Physical Dispensary & Hours */}
                        <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div>
                                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                    <MapPin className="h-5 w-5 text-emerald-600" />
                                    <h4 className="text-sm font-bold">
                                        Physical Dispensary
                                    </h4>
                                </div>
                                <p className="mt-1.5 pl-7 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                    Plot 482, Great East Road,
                                    <br />
                                    Lusaka, Zambia
                                </p>
                            </div>

                            <div className="border-t border-slate-100 pt-4 dark:border-zinc-800">
                                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Clock className="h-5 w-5 text-emerald-600" />
                                    <h4 className="text-sm font-bold">
                                        Operating Hours
                                    </h4>
                                </div>
                                <p className="mt-1.5 pl-7 text-xs text-slate-600 dark:text-zinc-400">
                                    Dispensary & Emergency Counter:{' '}
                                    <strong>Open 24/7</strong>
                                    <br />
                                    Same-Day Courier Dispatch:{' '}
                                    <strong>7:00 AM – 10:00 PM</strong>
                                </p>
                            </div>

                            <div className="border-t border-slate-100 pt-4 dark:border-zinc-800">
                                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                    <h4 className="text-sm font-bold">
                                        Licensed Medical Retailer
                                    </h4>
                                </div>
                                <p className="mt-1.5 pl-7 text-xs text-slate-600 dark:text-zinc-400">
                                    All products stored in climate-controlled
                                    conditions with certified pharmaceutical lot
                                    numbers.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="mt-20 border-t border-slate-200 bg-white py-10 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-500 sm:px-6 dark:text-zinc-400">
                    <p className="font-semibold">
                        PharmacyCat Healthcare Dispensary • Business Line:{' '}
                        <a
                            href="tel:0778744331"
                            className="font-bold text-emerald-600 hover:underline"
                        >
                            0778744331
                        </a>{' '}
                        • Email:{' '}
                        <a
                            href="mailto:pharmarcycat@gmail.com"
                            className="font-bold text-emerald-600 hover:underline"
                        >
                            pharmarcycat@gmail.com
                        </a>
                    </p>
                    <p className="mt-2 text-[11px] text-slate-400">
                        © {new Date().getFullYear()} PharmacyCat Healthcare.
                        Registered Dispensary. Always consult a certified
                        medical practitioner before starting any antibiotic or
                        prescription course.
                    </p>
                </div>
            </footer>
        </div>
    );
}
