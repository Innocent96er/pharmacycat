import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Lock,
    LogIn,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    Truck,
    UserPlus,
    X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    CartItem,
    DELIVERY_OPTIONS,
    DeliveryType,
} from '@/hooks/use-cart';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    selectedDelivery: DeliveryType;
    onSelectDelivery: (type: DeliveryType) => void;
    onUpdateQuantity: (id: number, qty: number) => void;
    onRemoveItem: (id: number) => void;
    onProceedToCheckout: () => void;
}

export function CartDrawer({
    isOpen,
    onClose,
    items,
    subtotal,
    deliveryFee,
    totalAmount,
    selectedDelivery,
    onSelectDelivery,
    onUpdateQuantity,
    onRemoveItem,
    onProceedToCheckout,
}: CartDrawerProps) {
    const { auth } = usePage().props as {
        auth?: { user?: { name: string; email: string; id: number } };
    };

    const freeDeliveryThreshold = 350;
    const freeProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
    const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
                <SheetHeader className="border-b border-border p-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                            <ShoppingBag className="h-5 w-5 text-emerald-600" />
                            Your Prescription & Cart ({items.reduce((s, i) => s + i.quantity, 0)})
                        </SheetTitle>
                    </div>
                    <SheetDescription className="text-xs text-muted-foreground">
                        Dispatched from our licensed pharmacy in Lusaka
                    </SheetDescription>

                    {/* Free Delivery Bar */}
                    {subtotal > 0 && (
                        <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
                            <div className="flex items-center justify-between font-medium">
                                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                                    <Truck className="h-4 w-4" />
                                    {remainingForFree > 0 ? (
                                        <>Add <span className="font-bold">K{remainingForFree.toFixed(2)}</span> more for <span className="font-bold">FREE</span> Home Delivery</>
                                    ) : (
                                        <span className="font-bold text-emerald-600">You unlocked FREE Home Delivery!</span>
                                    )}
                                </span>
                                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                                    {freeProgress}%
                                </span>
                            </div>
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-950/10 dark:bg-emerald-100/10">
                                <div
                                    className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                                    style={{ width: `${freeProgress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </SheetHeader>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                            <div className="rounded-full bg-muted p-4 text-muted-foreground">
                                <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
                            </div>
                            <h3 className="mt-3 text-base font-semibold text-foreground">Your cart is empty</h3>
                            <p className="mt-1 text-xs max-w-[220px]">
                                Browse our medicine catalog to add medications or wellness items.
                            </p>
                            <Button
                                onClick={onClose}
                                className="mt-5 bg-emerald-600 text-white hover:bg-emerald-700"
                                size="sm"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3 py-3.5">
                                    {/* Thumbnail */}
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted">
                                        <img
                                            src={item.image || '/images/products/paracetamol.jpg'}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="line-clamp-1 text-xs font-semibold text-foreground">
                                                    {item.name}
                                                </h4>
                                                <button
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="text-muted-foreground hover:text-rose-500"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                {item.dosage && <span>{item.dosage}</span>}
                                                {item.prescription_type === 'rx' && (
                                                    <Badge variant="outline" className="h-4 border-amber-500/40 bg-amber-500/10 px-1 text-[9px] font-bold text-amber-600 uppercase">
                                                        Rx
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between">
                                            {/* Quantity Stepper */}
                                            <div className="flex items-center rounded-md border border-border">
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-7 text-center text-xs font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-xs font-bold text-foreground">
                                                    K{(item.price * item.quantity).toFixed(2)}
                                                </span>
                                                {item.quantity > 1 && (
                                                    <div className="text-[10px] text-muted-foreground">
                                                        K{item.price.toFixed(2)} each
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer with Delivery & Checkout */}
                {items.length > 0 && (
                    <div className="border-t border-border bg-muted/20 p-4">
                        {/* Courier Selection */}
                        <div className="mb-4">
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Delivery Dispatch Method:
                            </label>
                            <div className="mt-1.5 grid grid-cols-2 gap-2">
                                {(Object.keys(DELIVERY_OPTIONS) as DeliveryType[]).map((key) => {
                                    const opt = DELIVERY_OPTIONS[key];
                                    const isSelected = selectedDelivery === key;
                                    const isFree = opt.freeOverThreshold && subtotal >= opt.freeOverThreshold;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => onSelectDelivery(key)}
                                            className={`rounded-lg border p-2 text-left transition ${
                                                isSelected
                                                    ? 'border-emerald-600 bg-emerald-500/10 ring-1 ring-emerald-600'
                                                    : 'border-border bg-card hover:border-emerald-500/40'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-foreground">
                                                    {opt.name}
                                                </span>
                                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {isFree ? 'FREE' : opt.fee === 0 ? 'FREE' : `K${opt.fee}`}
                                                </span>
                                            </div>
                                            <div className="mt-0.5 text-[10px] text-muted-foreground">
                                                {opt.eta}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>K{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Delivery Fee</span>
                                <span className={deliveryFee === 0 ? 'font-semibold text-emerald-600' : ''}>
                                    {deliveryFee === 0 ? 'FREE' : `K${deliveryFee.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                                <span>Total Payable</span>
                                <span className="text-emerald-600 dark:text-emerald-400">
                                    K{totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Checkout CTA: Only authenticated customers can proceed */}
                        {!auth?.user ? (
                            <div className="mt-4 space-y-2">
                                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-center text-xs text-amber-900 dark:text-amber-200">
                                    <div className="flex items-center justify-center gap-1.5 font-bold">
                                        <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                        <span>Sign in required to check out</span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                                        Your cart is securely saved. Please log in or register an account to confirm delivery and place your order.
                                    </p>
                                </div>

                                <Button
                                    asChild
                                    className="w-full bg-emerald-600 py-5 text-sm font-bold text-white shadow-md hover:bg-emerald-700"
                                >
                                    <Link href="/login" onClick={onClose}>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Log In to Checkout (K{totalAmount.toFixed(2)})
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full text-xs font-semibold"
                                >
                                    <Link href="/register" onClick={onClose}>
                                        <UserPlus className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                                        New Customer? Register Here
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={() => {
                                    onClose();
                                    onProceedToCheckout();
                                }}
                                className="mt-4 w-full bg-emerald-600 py-5 text-sm font-bold text-white shadow-md hover:bg-emerald-700"
                            >
                                Proceed to Checkout (K{totalAmount.toFixed(2)})
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

