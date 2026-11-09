import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    CreditCard,
    DollarSign,
    Loader2,
    Lock,
    LogIn,
    MapPin,
    Phone,
    Receipt,
    ShieldCheck,
    Smartphone,
    Truck,
    User,
    UserPlus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    CartItem,
    DELIVERY_OPTIONS,
    DeliveryType,
} from '@/hooks/use-cart';

interface CheckoutDialogProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    selectedDelivery: DeliveryType;
    onSelectDelivery: (type: DeliveryType) => void;
    onOrderPlaced: () => void;
    initialCustomerName?: string;
    initialCustomerEmail?: string;
}

export function CheckoutDialog({
    isOpen,
    onClose,
    items,
    subtotal,
    deliveryFee,
    totalAmount,
    selectedDelivery,
    onSelectDelivery,
    onOrderPlaced,
    initialCustomerName = '',
    initialCustomerEmail = '',
}: CheckoutDialogProps) {
    const { auth } = usePage().props as {
        auth?: { user?: { name: string; email: string; id: number } };
    };

    const [customerName, setCustomerName] = useState(
        initialCustomerName || auth?.user?.name || ''
    );
    const [customerEmail, setCustomerEmail] = useState(
        initialCustomerEmail || auth?.user?.email || ''
    );
    const [customerPhone, setCustomerPhone] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card' | 'cash'>('mobile_money');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

    useEffect(() => {
        if (auth?.user) {
            if (!customerName && auth.user.name) setCustomerName(auth.user.name);
            if (!customerEmail && auth.user.email) setCustomerEmail(auth.user.email);
        }
    }, [auth?.user]);

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!auth?.user) {
            toast.error('You must be logged in or registered to place an order.');
            router.visit('/login');
            return;
        }

        if (items.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }

        if (!customerName || !customerPhone || !deliveryAddress) {
            toast.error('Please fill in your name, phone, and delivery address.');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            customer_name: customerName,
            customer_email: customerEmail || 'customer@pharmacycat.test',
            customer_phone: customerPhone,
            delivery_address: deliveryAddress,
            delivery_type: selectedDelivery,
            payment_method: paymentMethod,
            subtotal,
            delivery_fee: deliveryFee,
            total: totalAmount,
            items: items.map((i) => ({
                id: i.id,
                name: i.name,
                qty: i.quantity,
                price: i.price,
                image: i.image,
            })),
        };

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const res = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setConfirmedOrder(data.order);
                onOrderPlaced();
                toast.success('Your order was placed successfully!');
            } else {
                toast.error(data.message || 'Failed to place order. Please check inputs.');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            toast.error('An error occurred during checkout. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setConfirmedOrder(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                {!auth?.user ? (
                    /* Guest Sign-in Prompt Screen */
                    <div className="flex flex-col items-center p-3 text-center">
                        <div className="rounded-full bg-emerald-500/10 p-4 text-emerald-600 ring-8 ring-emerald-500/5">
                            <Lock className="h-10 w-10" />
                        </div>

                        <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                            Sign In to Complete Purchase
                        </h2>
                        <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                            You can browse medicines and fill your cart freely as a guest. To confirm delivery and process your order, please log in or create an account.
                        </p>

                        <div className="mt-4 w-full rounded-xl border border-border bg-muted/30 p-3.5 text-left text-xs space-y-2">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Cart Summary:</span>
                                <span className="font-semibold text-foreground">
                                    {items.reduce((s, i) => s + i.quantity, 0)} item(s)
                                </span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Total Payable:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    K{totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex w-full flex-col gap-2.5">
                            <Button asChild className="w-full bg-emerald-600 font-bold text-white hover:bg-emerald-700">
                                <Link href="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Log In to Checkout
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full font-semibold">
                                <Link href="/register">
                                    <UserPlus className="mr-2 h-4 w-4 text-emerald-600" />
                                    Create Free Account
                                </Link>
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleClose}
                                className="text-xs text-muted-foreground hover:text-foreground"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                ) : confirmedOrder ? (
                    /* Order Confirmation Screen */
                    <div className="flex flex-col items-center p-2 text-center">
                        <div className="rounded-full bg-emerald-500/10 p-3.5 text-emerald-600 ring-8 ring-emerald-500/5">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>

                        <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground">
                            Order Confirmed!
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Our licensed pharmacist is packaging your order for rapid dispatch.
                        </p>

                        <div className="mt-4 w-full rounded-xl border border-border bg-muted/30 p-4 text-left">
                            <div className="flex items-center justify-between border-b border-border pb-2.5">
                                <span className="text-xs text-muted-foreground">Order Reference:</span>
                                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                    {confirmedOrder.order_number}
                                </span>
                            </div>

                            <div className="divide-y divide-border/60 py-2 text-xs">
                                <div className="flex justify-between py-1 text-muted-foreground">
                                    <span>Recipient:</span>
                                    <span className="font-medium text-foreground">{confirmedOrder.customer_name}</span>
                                </div>
                                <div className="flex justify-between py-1 text-muted-foreground">
                                    <span>Phone:</span>
                                    <span className="font-medium text-foreground">{confirmedOrder.customer_phone}</span>
                                </div>
                                <div className="flex justify-between py-1 text-muted-foreground">
                                    <span>Courier:</span>
                                    <span className="font-medium text-foreground">{confirmedOrder.courier_name}</span>
                                </div>
                                <div className="flex justify-between py-1 text-muted-foreground">
                                    <span>Payment:</span>
                                    <span className="font-medium text-foreground">{confirmedOrder.payment_method}</span>
                                </div>
                                <div className="flex justify-between pt-2 text-sm font-bold text-foreground">
                                    <span>Amount Paid:</span>
                                    <span className="text-emerald-600 dark:text-emerald-400">{confirmedOrder.total}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex w-full flex-col gap-2">
                            <Button
                                onClick={handleClose}
                                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                Done & Return to Shop
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* Checkout Form Screen */
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                                <Receipt className="h-5 w-5 text-emerald-600" />
                                Express Pharmacy Checkout
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Fast delivery across Lusaka. Cash on delivery, Mobile Money, or Card.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmitOrder} className="mt-2 space-y-4">
                            {/* Contact Details */}
                            <div className="space-y-3 rounded-xl border border-border p-3.5 bg-card">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    1. Delivery & Contact Info
                                </h3>

                                <div className="space-y-1">
                                    <Label htmlFor="checkout-name" className="text-xs">
                                        Full Name <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="checkout-name"
                                        placeholder="e.g. Kelvin Banda"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        required
                                        className="h-9 text-xs"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="checkout-phone" className="text-xs">
                                            Phone Number <span className="text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="checkout-phone"
                                            placeholder="+260 97 123 4567"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            required
                                            className="h-9 text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="checkout-email" className="text-xs">
                                            Email (for receipt)
                                        </Label>
                                        <Input
                                            id="checkout-email"
                                            type="email"
                                            placeholder="you@email.com"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            className="h-9 text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="checkout-address" className="text-xs">
                                        Delivery Address / Area <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="checkout-address"
                                        placeholder="Plot / Street / Neighborhood, Lusaka"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        required
                                        className="h-9 text-xs"
                                    />
                                </div>
                            </div>

                            {/* Delivery Method */}
                            <div className="space-y-2 rounded-xl border border-border p-3.5 bg-card">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    2. Courier Dispatch
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {(Object.keys(DELIVERY_OPTIONS) as DeliveryType[]).map((key) => {
                                        const opt = DELIVERY_OPTIONS[key];
                                        const isSelected = selectedDelivery === key;
                                        const isFree = opt.freeOverThreshold && subtotal >= opt.freeOverThreshold;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => onSelectDelivery(key)}
                                                className={`rounded-lg border p-2 text-left text-xs transition ${
                                                    isSelected
                                                        ? 'border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600'
                                                        : 'border-border hover:border-emerald-500/40'
                                                }`}
                                            >
                                                <div className="font-bold text-foreground">{opt.name}</div>
                                                <div className="text-[10px] text-muted-foreground">{opt.eta}</div>
                                                <div className="mt-1 text-[11px] font-semibold text-emerald-600">
                                                    {isFree ? 'FREE' : opt.fee === 0 ? 'FREE' : `K${opt.fee}`}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-2 rounded-xl border border-border p-3.5 bg-card">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    3. Payment Method
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'mobile_money', label: 'Mobile Money', sub: 'Airtel / MTN', icon: Smartphone },
                                        { id: 'card', label: 'Bank Card', sub: 'Visa / Mastercard', icon: CreditCard },
                                        { id: 'cash', label: 'Cash', sub: 'On Delivery', icon: DollarSign },
                                    ].map((method) => {
                                        const isSelected = paymentMethod === method.id;
                                        const Icon = method.icon;
                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setPaymentMethod(method.id as any)}
                                                className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-center transition ${
                                                    isSelected
                                                        ? 'border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600'
                                                        : 'border-border hover:border-emerald-500/40'
                                                }`}
                                            >
                                                <Icon className={`h-4 w-4 ${isSelected ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                                                <span className="mt-1 text-xs font-bold text-foreground">{method.label}</span>
                                                <span className="text-[10px] text-muted-foreground">{method.sub}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Order Total & Submit */}
                            <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Items Subtotal:</span>
                                    <span>K{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                    <span>Courier Fee:</span>
                                    <span>{deliveryFee === 0 ? 'FREE' : `K${deliveryFee.toFixed(2)}`}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-border mt-2 pt-2 text-sm font-bold text-foreground">
                                    <span>Total Payable:</span>
                                    <span className="text-base text-emerald-600 dark:text-emerald-400">
                                        K{totalAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-emerald-600 py-5 text-sm font-bold text-white shadow-md hover:bg-emerald-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Placing Your Order...
                                    </>
                                ) : (
                                    <>
                                        Confirm & Place Order (K{totalAmount.toFixed(2)})
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

