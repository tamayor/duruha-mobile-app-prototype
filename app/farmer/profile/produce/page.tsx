"use client"
import React, { useState } from 'react';
import {
    Sprout,
    Truck,
    CheckCircle2,
    Clock,
    AlertCircle,
    Plus,
    ArrowRight,
    History,
    MoreHorizontal,
    TrendingUp,
    Droplets,
    Package
} from 'lucide-react';
import { ModeToggle } from '@/app/components/mode-toggle';

// --- Types ---
type ProduceStatus = 'growing' | 'plant_now' | 'in_transit' | 'sold' | 'idle';

interface ProduceItem {
    id: string;
    name: string;
    image: string;
    status: ProduceStatus;

    // Quantity Context
    currentAmount?: number; // kg (for growing/transit)
    totalYield?: number;    // kg (for sold)

    // Financial Context
    lastSalePrice?: number; // ₱/kg (Historical context)
    soldPrice?: number;     // ₱/kg (Final price for sold items)

    // Time Context
    daysUntilHarvest?: number;
    plantedDate?: string;
    soldDate?: string;
}

// --- Mock Data ---
const PRODUCE_DATA: ProduceItem[] = [
    {
        id: '1',
        name: 'Native Carrots',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=600',
        status: 'growing',
        currentAmount: 500,
        lastSalePrice: 85,
        daysUntilHarvest: 45,
        plantedDate: 'Oct 12'
    },
    {
        id: '2',
        name: 'Red Onions',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600',
        status: 'in_transit',
        currentAmount: 1200,
        lastSalePrice: 110, // Context
        plantedDate: 'Aug 15'
    },
    {
        id: '3',
        name: 'Plot C - Fallow',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600', // Empty field image
        status: 'plant_now',
        lastSalePrice: 0,
    },
    {
        id: '4',
        name: 'Iceberg Lettuce',
        image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&q=80&w=600',
        status: 'sold',
        totalYield: 350,
        soldPrice: 140,
        soldDate: 'Dec 20, 2025'
    },
    {
        id: '5',
        name: 'Bell Peppers',
        image: 'https://images.unsplash.com/photo-1563565375-f3fdf5d2e374?auto=format&fit=crop&q=80&w=600',
        status: 'idle',
        lastSalePrice: 220,
    }
];

// --- Helper Components ---

const StatusBadge = ({ status }: { status: ProduceStatus }) => {
    const config = {
        growing: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: Sprout, label: 'Growing' },
        plant_now: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', icon: AlertCircle, label: 'Plant Now' },
        in_transit: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', icon: Truck, label: 'In Transit' },
        sold: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: CheckCircle2, label: 'Sold' },
        idle: { color: 'bg-gray-50 text-gray-500 dark:bg-neutral-800 dark:text-gray-500', icon: Clock, label: 'Idle' },
    };
    const { color, icon: Icon, label } = config[status];

    return (
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-transparent ${color}`}>
            <Icon size={12} />
            {label}
        </span>
    );
};

const ProduceCard = ({ item }: { item: ProduceItem }) => {
    const isActionable = item.status === 'plant_now';

    return (
        <div className={`snap-center shrink-0 w-[280px] sm:w-[320px] bg-white dark:bg-neutral-900 rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${isActionable ? 'border-amber-300 dark:border-amber-700 ring-2 ring-amber-100 dark:ring-amber-900/20' : 'border-gray-200 dark:border-gray-800'}`}>

            {/* 1. Header Image */}
            <div className="relative h-40 group">
                <img src={item.image} alt={item.name} className={`w-full h-full object-cover transition-transform duration-700 ${item.status === 'idle' ? 'grayscale opacity-60' : 'group-hover:scale-105'}`} />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute top-3 left-3">
                    <StatusBadge status={item.status} />
                </div>

                <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-bold text-lg leading-none shadow-black drop-shadow-md">{item.name}</h3>
                </div>
            </div>

            {/* 2. Content Body */}
            <div className="p-5 flex flex-col flex-1 gap-4">

                {/* Stats Row */}
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Volume</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {item.status === 'sold' ? item.totalYield : (item.currentAmount || '--')} <span className="text-sm font-normal text-gray-400">kg</span>
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                            {item.status === 'sold' ? 'Sold Price' : 'Prev. Sale'}
                        </p>
                        <div className="flex items-center justify-end gap-1">
                            <span className="text-xs text-gray-400">₱</span>
                            <span className={`text-lg font-bold ${item.status === 'sold' ? 'text-emerald-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                {item.status === 'sold' ? item.soldPrice : (item.lastSalePrice || '--')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Specific Context */}
                {item.status === 'growing' && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-lg p-3 border border-emerald-100 dark:border-emerald-800/50">
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Harvest in {item.daysUntilHarvest} days</span>
                            <span className="text-emerald-600/70">Planted {item.plantedDate}</span>
                        </div>
                        <div className="h-1.5 w-full bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[65%]" />
                        </div>
                    </div>
                )}

                {item.status === 'in_transit' && (
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 border border-blue-100 dark:border-blue-800/50 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                            <Truck size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-blue-700 dark:text-blue-300">En Route to Manila</p>
                            <p className="text-[10px] text-blue-600/70">ETA: 4 Hours</p>
                        </div>
                    </div>
                )}

                {item.status === 'plant_now' && (
                    <button className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm shadow-sm shadow-amber-200 dark:shadow-none flex items-center justify-center gap-2 transition-colors">
                        <Sprout size={16} />
                        Start Planting
                    </button>
                )}

                {/* Secondary Action for others */}
                {item.status !== 'plant_now' && (
                    <a href='/farmer/profile/produce/manage'>
                        <button className="mt-auto w-full py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center justify-center gap-2 transition-colors">
                            Manage <MoreHorizontal size={14} />
                        </button>
                    </a>
                )}
            </div>
        </div>
    );
};


// --- Main Page Component ---
export default function MyProducePage() {
    const [viewMode, setViewMode] = useState<'active' | 'history'>('active');

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center justify-between w-full md:w-auto mb-2 md:mb-0">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">My Produce</h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your active crops, inventory, and field history.</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none transition-all active:scale-95">
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add New Crop</span>
                            <a href='/farmer/profile/produce/add'><span className="sm:hidden">Add</span></a>
                        </button>
                    </div>
                </div>

                {/* 1. Horizontal Snapping List (Active Crops) */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <Sprout size={18} className="text-emerald-600" />
                            Active & Growing
                        </h2>
                        <span className="text-xs font-medium text-gray-400">Swipe to view</span>
                    </div>

                    {/* Scroll Container */}
                    <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                        {PRODUCE_DATA.filter(i => i.status !== 'sold').map((item) => (
                            <ProduceCard key={item.id} item={item} />
                        ))}

                        {/* "View More" Card (Last Item) */}
                        <div className="snap-center shrink-0 w-[120px] flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-emerald-400 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 cursor-pointer transition-all group">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-gray-400 group-hover:text-emerald-600 mb-2 shadow-sm">
                                <ArrowRight size={20} />
                            </div>
                            <span className="text-xs font-bold text-gray-500 group-hover:text-emerald-700">View All</span>
                        </div>
                    </div>
                </section>

                {/* 2. Divider / Stats Area */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Active</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-gray-100">2,450 <span className="text-sm font-medium text-gray-400">kg</span></p>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Est. Value</p>
                        <p className="text-2xl font-black text-emerald-600">₱280k</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Harvest Ready</p>
                        <p className="text-2xl font-black text-amber-500">1 <span className="text-sm font-medium text-gray-400">Crop</span></p>
                    </div>
                </div>

                {/* 3. Recent History / Sold Items */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <History size={18} className="text-gray-400" />
                            Recently Sold
                        </h2>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        {PRODUCE_DATA.filter(i => i.status === 'sold').map((item, index) => (
                            <div key={item.id} className={`flex items-center p-4 gap-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors ${index !== 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}>
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">{item.name}</h4>
                                        <StatusBadge status="sold" />
                                    </div>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock size={12} /> Sold on {item.soldDate}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-bold text-emerald-600">₱{item.soldPrice}</p>
                                    <p className="text-xs text-gray-400 font-medium">per kg</p>
                                </div>
                            </div>
                        ))}

                        <button className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors border-t border-gray-100 dark:border-gray-800">
                            View Full History
                        </button>
                    </div>
                </section>

            </div>
        </main>
    );
}