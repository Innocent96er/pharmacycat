import { useEffect, useState } from 'react';

export interface CartProduct {
    id: number;
    name: string;
    dosage?: string | null;
    category: string;
    price: number | string;
    prescription_type?: 'otc' | 'rx' | string;
    image?: string | null;
    image_url?: string | null;
    stock?: number;
}

export interface CartItem {
    id: number;
    name: string;
    dosage?: string | null;
    category: string;
    price: number;
    prescription_type: 'otc' | 'rx' | string;
    image?: string | null;
    quantity: number;
}

export type DeliveryType = 'home_delivery' | 'yango' | 'indrive' | 'pickup';

export interface DeliveryOptionConfig {
    id: DeliveryType;
    name: string;
    subtitle: string;
    eta: string;
    fee: number;
    freeOverThreshold?: number;
    isCourier?: boolean;
}

export const DELIVERY_OPTIONS: Record<DeliveryType, DeliveryOptionConfig> = {
    home_delivery: {
        id: 'home_delivery',
        name: 'Home Delivery',
        subtitle: 'PharmacyCat rider',
        eta: '30 - 45 mins',
        fee: 50,
        freeOverThreshold: 350,
    },
    yango: {
        id: 'yango',
        name: 'Yango Delivery',
        subtitle: 'Express city courier',
        eta: '20 - 40 mins',
        fee: 60,
        isCourier: true,
    },
    indrive: {
        id: 'indrive',
        name: 'inDrive Delivery',
        subtitle: 'City dispatch driver',
        eta: '25 - 45 mins',
        fee: 55,
        isCourier: true,
    },
    pickup: {
        id: 'pickup',
        name: 'Dispensary Counter Pickup',
        subtitle: 'Great East Road pharmacy counter',
        eta: 'Ready in 15 mins',
        fee: 0,
    },
};

const STORAGE_KEY = 'pharmacycat_cart_v1';

export function useCart() {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType>('home_delivery');

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error('Failed to save cart to localStorage', e);
        }
    }, [items]);

    const addToCart = (product: CartProduct, quantity: number = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            const numPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
            const img = product.image_url || product.image || '/images/products/paracetamol.jpg';

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item,
                );
            }

            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    dosage: product.dosage,
                    category: product.category,
                    price: isNaN(numPrice) ? 0 : numPrice,
                    prescription_type: product.prescription_type || 'otc',
                    image: img,
                    quantity: Math.max(1, quantity),
                },
            ];
        });

        setIsCartOpen(true);
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item,
            ),
        );
    };

    const removeFromCart = (productId: number) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    const deliveryOption = DELIVERY_OPTIONS[selectedDelivery];
    const isFreeDelivery =
        deliveryOption.freeOverThreshold &&
        subtotal >= deliveryOption.freeOverThreshold;
    const deliveryFee = isFreeDelivery ? 0 : deliveryOption.fee;
    const totalAmount = subtotal + deliveryFee;

    return {
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        selectedDelivery,
        setSelectedDelivery,
        deliveryFee,
        totalAmount,
        isFreeDelivery,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
    };
}

