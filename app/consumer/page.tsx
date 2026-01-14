"use client"
import React, { useState, useMemo } from 'react';
import {
    Search,
    ShoppingBag,
    Plus,
    Minus,
    X,
    ArrowUpDown,
    MapPin,
    Star,
    Trash2,
    ArrowRight,
    Info,
    ChevronDown,
    Store,
    Truck,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { ModeToggle } from '@/app/components/mode-toggle';

// --- Types & Interfaces ---
interface PriceBreakdown {
    farmer: number;
    logistics: number;
    packaging: number;
    platform: number;
}

interface Product {
    id: string;
    name: string;
    farmerName: string;
    location: string;
    image: string;
    price: number;
    rating: number;
    orders: number;
    category: 'root' | 'leafy' | 'fruit' | 'spice';
    breakdown: PriceBreakdown;
    isPopular?: boolean;
}

interface PickupPoint {
    id: string;
    name: string;
    distance: string;
    readyTime: string; // e.g., "4 hours"
    status: 'available' | 'full';
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Native Carrots',
        farmerName: 'Mang Jose',
        location: 'Benguet',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=600',
        price: 120,
        rating: 4.8,
        orders: 1540,
        category: 'root',
        isPopular: true,
        breakdown: { farmer: 85, logistics: 20, packaging: 10, platform: 5 }
    },
    {
        id: '2',
        name: 'Red Onions',
        farmerName: 'Aling Maria',
        location: 'Nueva Ecija',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600',
        price: 180,
        rating: 4.9,
        orders: 2300,
        category: 'root',
        breakdown: { farmer: 140, logistics: 25, packaging: 10, platform: 5 }
    },
    {
        id: '3',
        name: 'Romaine Lettuce',
        farmerName: 'Benguet Coop',
        location: 'La Trinidad',
        image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&q=80&w=600',
        price: 150,
        rating: 4.7,
        orders: 890,
        category: 'leafy',
        breakdown: { farmer: 100, logistics: 30, packaging: 15, platform: 5 }
    },
    {
        id: '4',
        name: 'Lakatan Banana',
        farmerName: 'Davao Farms',
        location: 'Davao',
        image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=600',
        price: 90,
        rating: 4.6,
        orders: 1200,
        category: 'fruit',
        breakdown: { farmer: 60, logistics: 20, packaging: 5, platform: 5 }
    },
];

const PICKUP_POINTS: PickupPoint[] = [
    { id: 'p1', name: 'Tubungan Plaza Hub', distance: '0.8 km', readyTime: '2 hours', status: 'available' },
    { id: 'p2', name: 'Igbaras Crossing', distance: '3.2 km', readyTime: '4 hours', status: 'available' },
    { id: 'p3', name: 'Guimbal Market Center', distance: '8.5 km', readyTime: 'Tomorrow', status: 'available' },
];

// --- Sub-Components ---

// 1. Price Breakdown Modal (Unchanged)
const PriceBreakdownModal = ({ product, onClose }: { product: Product, onClose: () => void }) => {
    const total = product.price;
    const getPercent = (val: number) => Math.round((val / total) * 100);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full max-w-xs bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 hover:bg-gray-200">
                    <X size={20} />
                </button>
                <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Price Breakdown</h3>
                    <p className="text-xs text-gray-500">Transparency for {product.name}</p>
                </div>
                <div className="flex items-end justify-center gap-2 mb-6 h-32">
                    <div className="w-12 flex flex-col items-center gap-1 group">
                        <span className="text-[10px] font-bold text-orange-600">{getPercent(product.breakdown.farmer)}%</span>
                        <div style={{ height: `${getPercent(product.breakdown.farmer)}%` }} className="w-full bg-orange-500 rounded-t-md relative" />
                        <span className="text-[10px] text-gray-400">Farmer</span>
                    </div>
                    {/* ... other bars ... */}
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center text-orange-700 dark:text-orange-200 font-bold">₱</div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Farmer's Net</p>
                            <p className="text-xs text-gray-500">Direct profit</p>
                        </div>
                    </div>
                    <span className="text-lg font-black text-orange-600 dark:text-orange-400">₱{product.breakdown.farmer}</span>
                </div>
            </div>
        </div>
    );
};

// 2. Cart Review Modal (UPDATED with Pickup Logic)
const CartReviewModal = ({
    cart,
    products,
    onClose,
    onUpdateCart
}: {
    cart: Record<string, number>,
    products: Product[],
    onClose: () => void,
    onUpdateCart: (id: string, delta: number) => void
}) => {
    // Local State for Delivery Method
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
    const [selectedPickup, setSelectedPickup] = useState(PICKUP_POINTS[0]);

    // Calculations
    const cartItems = Object.entries(cart).map(([id, qty]) => {
        const product = products.find(p => p.id === id);
        return product ? { ...product, qty } : null;
    }).filter(Boolean) as (Product & { qty: number })[];

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const deliveryFee = deliveryMethod === 'pickup' ? 0 : 45;
    const total = subtotal + deliveryFee;

    if (cartItems.length === 0) {
        onClose();
        return null;
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="w-full md:max-w-md bg-white dark:bg-neutral-900 rounded-t-3xl md:rounded-3xl p-6 shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">Review Order</h2>
                        <p className="text-sm text-gray-500">{cartItems.length} items selected</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-neutral-700">
                        <X size={20} />
                    </button>
                </div>

                {/* --- DELIVERY METHOD TOGGLE --- */}
                <div className="bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl flex mb-6">
                    <button
                        onClick={() => setDeliveryMethod('delivery')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${deliveryMethod === 'delivery'
                            ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Truck size={16} /> Delivery
                    </button>
                    <button
                        onClick={() => setDeliveryMethod('pickup')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${deliveryMethod === 'pickup'
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Store size={16} /> Pickup (Free)
                    </button>
                </div>

                {/* --- PICKUP DETAILS (Conditional) --- */}
                {deliveryMethod === 'pickup' && (
                    <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block ml-1">Select Pickup Point</label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-3.5 text-orange-500" size={18} />
                            <select
                                value={selectedPickup.id}
                                onChange={(e) => setSelectedPickup(PICKUP_POINTS.find(p => p.id === e.target.value)!)}
                                className="w-full appearance-none bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl py-3 pl-10 pr-10 text-sm font-bold text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {PICKUP_POINTS.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.distance})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3.5 top-3.5 text-orange-400 pointer-events-none" size={18} />
                        </div>

                        {/* Dynamic Info Based on Selection */}
                        <div className="flex items-center gap-4 mt-3 px-1">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                <CheckCircle2 size={14} /> Available
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                <Clock size={14} /> Ready in {selectedPickup.readyTime}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- DELIVERY DETAILS (Conditional) --- */}
                {deliveryMethod === 'delivery' && (
                    <div className="mb-6 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex items-start gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full text-gray-500">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Deliver To</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Home • Tubungan Proper</p>
                            <p className="text-xs text-gray-400 mt-0.5">Note: Standard delivery rates apply.</p>
                        </div>
                    </div>
                )}

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto mb-6 pr-1 space-y-4 min-h-[150px]">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-gray-100">{item.name}</h4>
                                <p className="text-xs text-gray-500">{item.farmerName}</p>
                                <p className="text-sm font-bold text-orange-600 mt-1">₱{item.price * item.qty}</p>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 rounded-lg p-1 border border-gray-100 dark:border-gray-700">
                                <button onClick={() => onUpdateCart(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white dark:bg-neutral-700 rounded-md shadow-sm text-gray-600 dark:text-gray-300 hover:text-red-500">
                                    {item.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                                </button>
                                <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                <button onClick={() => onUpdateCart(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-orange-500 rounded-md shadow-sm text-white">
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2 mb-6">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>₱{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Logistics/Fee</span>
                        {deliveryFee === 0 ? (
                            <span className="text-emerald-600 font-bold uppercase text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">Free</span>
                        ) : (
                            <span>₱{deliveryFee.toLocaleString()}</span>
                        )}
                    </div>
                    <div className="flex justify-between text-xl font-black text-gray-900 dark:text-gray-100 pt-2">
                        <span>Total</span>
                        <span>₱{total.toLocaleString()}</span>
                    </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-200 dark:shadow-none flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                    {deliveryMethod === 'pickup' ? 'Confirm Pickup' : 'Place Delivery Order'}
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

// --- Main Page ---
export default function ConsumerShopPage() {
    const [cart, setCart] = useState<Record<string, number>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high'>('popular');
    const [activeFilter, setActiveFilter] = useState<string>('all');

    // Modal States
    const [activeBreakdown, setActiveBreakdown] = useState<string | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Derived State
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const totalPrice = Object.entries(cart).reduce((total, [id, qty]) => {
        const product = PRODUCTS.find(p => p.id === id);
        return total + (product ? product.price * qty : 0);
    }, 0);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        let result = PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (activeFilter !== 'all') result = result.filter(p => p.category === activeFilter);
        if (sortBy === 'price_low') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price_high') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'popular') result.sort((a, b) => b.orders - a.orders);
        return result;
    }, [searchQuery, sortBy, activeFilter]);

    // Cart Handler
    const updateCart = (id: string, delta: number) => {
        setCart(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            if (next === 0) {
                const { [id]: _, ...rest } = prev;
                if (Object.keys(rest).length === 0) setIsCartOpen(false);
                return rest;
            }
            return { ...prev, [id]: next };
        });
    };

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-32">

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-black text-gray-900 dark:text-gray-50 flex items-center gap-2">
                        <ShoppingBag className="text-orange-500 fill-orange-500" /> Fresh Market
                    </h1>
                    <ModeToggle />
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search produce..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-100 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <button className="h-11 w-11 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                        <ArrowUpDown size={20} />
                    </button>
                </div>

                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                    {['all', 'root', 'leafy', 'fruit', 'spice'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-colors ${activeFilter === cat ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-gray-400'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* Grid */}
            <div className="max-w-4xl mx-auto px-4 mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map(product => {
                        const qty = cart[product.id] || 0;
                        return (
                            <div key={product.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                <div className="relative h-32 md:h-40">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    {product.isPopular && <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">BESTSELLER</span>}
                                </div>
                                <div className="p-3 md:p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm md:text-base leading-tight">{product.name}</h3>
                                        <div className="flex items-center gap-0.5 text-[10px] font-bold bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-md text-gray-600 dark:text-gray-300">
                                            <Star size={8} className="fill-orange-400 text-orange-400" /> {product.rating}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1"><MapPin size={10} /> {product.farmerName}</p>
                                    <div className="mt-auto flex items-end justify-between">
                                        <div onClick={() => setActiveBreakdown(product.id)} className="cursor-pointer group">
                                            <div className="flex items-center gap-1"><p className="font-black text-orange-600 text-lg">₱{product.price}</p><Info size={14} className="text-gray-300 group-hover:text-orange-400" /></div>
                                            <p className="text-[10px] text-gray-400 font-medium">per kg</p>
                                        </div>
                                        {qty === 0 ? (
                                            <button onClick={() => updateCart(product.id, 1)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-orange-500 hover:text-white transition-colors flex items-center justify-center"><Plus size={18} /></button>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-neutral-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
                                                <button onClick={() => updateCart(product.id, -1)} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white dark:bg-neutral-700 shadow-sm flex items-center justify-center text-gray-700 dark:text-gray-200"><Minus size={14} /></button>
                                                <span className="text-xs font-bold w-3 text-center">{qty}</span>
                                                <button onClick={() => updateCart(product.id, 1)} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-orange-500 text-white shadow-sm flex items-center justify-center"><Plus size={14} /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* FAB */}
            {totalItems > 0 && !isCartOpen && (
                <div className="fixed bottom-20 md:bottom-24 inset-x-0 px-4 z-40 animate-in slide-in-from-bottom-4 duration-300">
                    <div onClick={() => setIsCartOpen(true)} className="max-w-lg mx-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl p-4 shadow-2xl shadow-gray-900/20 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform active:scale-95">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white shadow-md border-2 border-gray-900 dark:border-white">{totalItems}</div>
                            <div><p className="text-xs font-medium opacity-70 uppercase tracking-wider">Total Order</p><p className="text-lg font-black leading-none">₱{totalPrice.toLocaleString()}</p></div>
                        </div>
                        <button className="flex items-center gap-2 font-bold text-sm bg-white/10 dark:bg-gray-200/50 px-4 py-2 rounded-xl">Review Cart <ChevronDown className="rotate-[-90deg]" size={16} /></button>
                    </div>
                </div>
            )}

            {/* Modals */}
            {activeBreakdown && <PriceBreakdownModal product={PRODUCTS.find(p => p.id === activeBreakdown)!} onClose={() => setActiveBreakdown(null)} />}
            {isCartOpen && <CartReviewModal cart={cart} products={PRODUCTS} onClose={() => setIsCartOpen(false)} onUpdateCart={updateCart} />}
        </main>
    );
}