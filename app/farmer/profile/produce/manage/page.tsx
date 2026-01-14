"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    Sprout,
    Truck,
    CheckCircle2,
    AlertTriangle,
    Calendar,
    Users,
    ShoppingBag,
    Leaf,
    TrendingUp,
    Info,
    Droplets,
    Wind,
    DollarSign,
    BarChart3,
    ArrowRight,
    MapPin,
    Share2,
    ThermometerSun
} from 'lucide-react';
import { ModeToggle } from '@/app/components/mode-toggle';

// --- Types ---
type BatchStatus = 'growing' | 'harvest_ready' | 'harvested' | 'sold';
type HarvestReason = 'optimal' | 'market_high' | 'weather_risk' | 'disease_salvage';

// --- Mock Data ---
const PRODUCE_DETAILS = {
    id: 'p1',
    name: 'Native Carrots',
    variety: 'Benguet Kuroda',
    scientificName: 'Daucus carota subsp. sativus',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800',
    currentBatch: {
        id: 'B-2026-001',
        status: 'growing' as BatchStatus,
        plantedDate: 'Oct 12, 2025',
        estHarvestDate: 'Jan 15, 2026',
        plantedQty: 500, // kg
        personnel: {
            plantedBy: 'Mang Jose',
            supervisor: 'Elly Tamayor',
            harvestCrew: 'Team Alpha (Scheduled)'
        },
        inputs: {
            seedSource: 'Harbest Agrotech',
            seedType: 'F1 Hybrid Treated',
            fertilizer: 'Organic Chicken Manure'
        },
        harvestReason: 'optimal' as HarvestReason // Default
    },
    analytics: {
        salesTrend: [40, 65, 55, 80, 95, 110, 105], // Mock data points
        marketPriceVsMyPrice: [
            { month: 'Sep', market: 80, mine: 85 },
            { month: 'Oct', market: 75, mine: 85 },
            { month: 'Nov', market: 90, mine: 95 },
            { month: 'Dec', market: 110, mine: 105 },
            { month: 'Jan', market: 120, mine: 115 },
        ],
        expenses: {
            seeds: 30,
            labor: 40,
            fertilizer: 20,
            logistics: 10
        }
    },
    science: {
        soilPh: '6.0 - 6.8',
        temp: '15°C - 20°C',
        description: 'Carrots require deep, loose, sandy soil to develop straight roots. Kuroda variety is heat tolerant but thrives in highland cool weather. Rich in Beta-carotene.',
        tips: ['Avoid high nitrogen to prevent forking.', 'Keep soil consistently moist during germination.']
    }
};

// --- Helper Components ---

// 1. Chart Components (Zero-Dependency Custom SVGs/CSS)
const LineChart = ({ data, color = "stroke-emerald-500" }: { data: number[], color?: string }) => {
    const max = Math.max(...data);
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val / max) * 100);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 100 100" className="w-full h-24 overflow-visible" preserveAspectRatio="none">
            <polyline fill="none" strokeWidth="3" points={points} className={`${color} vector-effect-non-scaling-stroke`} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const ComparisonChart = ({ data }: { data: any[] }) => {
    // Simple mock scaling
    const max = 150;
    return (
        <div className="h-32 flex items-end justify-between gap-2">
            {data.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1 w-full">
                    <div className="relative w-full flex justify-center h-full items-end gap-1">
                        {/* Market Bar */}
                        <div style={{ height: `${(d.market / max) * 100}%` }} className="w-2 bg-gray-300 dark:bg-neutral-700 rounded-t-sm" />
                        {/* My Price Bar */}
                        <div style={{ height: `${(d.mine / max) * 100}%` }} className="w-2 bg-emerald-500 rounded-t-sm" />
                    </div>
                    <span className="text-[10px] text-gray-400">{d.month}</span>
                </div>
            ))}
        </div>
    );
};

const StackedBar = ({ data }: { data: any }) => (
    <div className="w-full h-6 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
        <div style={{ width: `${data.seeds}%` }} className="bg-emerald-500 h-full" />
        <div style={{ width: `${data.labor}%` }} className="bg-blue-500 h-full" />
        <div style={{ width: `${data.fertilizer}%` }} className="bg-amber-500 h-full" />
        <div style={{ width: `${data.logistics}%` }} className="bg-rose-500 h-full" />
    </div>
);

// --- Main Component ---
export default function ProduceDetailPage() {
    const [currentStatus, setCurrentStatus] = useState<BatchStatus>(PRODUCE_DETAILS.currentBatch.status);
    const [harvestReason, setHarvestReason] = useState<HarvestReason>('optimal');

    // Status Cards for the Swiper
    const statuses = [
        { id: 'growing', label: 'Growing', icon: Sprout, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
        { id: 'harvest_ready', label: 'Harvest Ready', icon: Leaf, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        { id: 'harvested', label: 'Harvested', icon: CheckCircle2, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
        { id: 'sold', label: 'Sold', icon: DollarSign, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
    ];

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-12">

            {/* 1. Header & Navigation */}
            <div className="relative h-64">
                <div className="absolute inset-0">
                    <img src={PRODUCE_DETAILS.image} className="w-full h-full object-cover" alt="Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 dark:from-neutral-950 to-transparent" />
                </div>
                <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start z-10">
                    <Link href="/farmer/profile/produce" className="p-2.5 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full shadow-sm text-gray-700 dark:text-gray-200">
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="flex gap-2">
                        <ModeToggle />
                        <button className="p-2.5 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full shadow-sm text-gray-700 dark:text-gray-200">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 px-4 pb-4">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 block">Batch: {PRODUCE_DETAILS.currentBatch.id}</span>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-gray-50 leading-none">{PRODUCE_DETAILS.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 italic">{PRODUCE_DETAILS.scientificName}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 space-y-8">

                {/* 2. Horizontal Snap Status Controller */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">Update Batch Status</h3>
                        <span className="text-xs text-gray-400">Swipe to change</span>
                    </div>

                    {/* The Swiper Container */}
                    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 scrollbar-hide">
                        {statuses.map((status) => {
                            const Icon = status.icon;
                            const isActive = currentStatus === status.id;
                            const isHarvestStage = status.id === 'harvest_ready';

                            return (
                                <div key={status.id} className={`snap-center shrink-0 w-[85vw] sm:w-[350px] p-5 rounded-2xl border-2 transition-all ${isActive ? 'border-emerald-500 ring-4 ring-emerald-500/10 bg-white dark:bg-neutral-900' : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900/50 opacity-60 grayscale'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-3 rounded-xl ${status.color}`}>
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">{status.label}</h4>
                                            <p className="text-xs text-gray-500">
                                                {isActive ? 'Current Stage' : 'Swipe & Click to Set'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Harvest Reason Selector (Only shows on Harvest Stage) */}
                                    {isHarvestStage && (
                                        <div className="mb-4 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                            <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase mb-2 block flex items-center gap-1">
                                                <AlertTriangle size={12} /> Reason for Harvest
                                            </label>
                                            <select
                                                value={harvestReason}
                                                onChange={(e) => setHarvestReason(e.target.value as HarvestReason)}
                                                className="w-full bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-800 rounded-lg p-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                                            >
                                                <option value="optimal">Perfect / Optimal Timing</option>
                                                <option value="market_high">Market Price High (Early)</option>
                                                <option value="weather_risk">Disaster Avoidance (Typhoon)</option>
                                                <option value="disease_salvage">Disease / Salvage</option>
                                            </select>
                                        </div>
                                    )}

                                    {!isActive ? (
                                        <button
                                            onClick={() => setCurrentStatus(status.id as BatchStatus)}
                                            className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm shadow-md"
                                        >
                                            Set as {status.label}
                                        </button>
                                    ) : (
                                        <div className="w-full py-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm flex items-center justify-center gap-2">
                                            <CheckCircle2 size={16} /> Status Active
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 3. Batch Details Grid */}
                <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                        <Leaf size={18} className="text-emerald-500" />
                        Batch Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dates */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg text-gray-500"><Calendar size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Planted Date</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100">{PRODUCE_DETAILS.currentBatch.plantedDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600"><Calendar size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Est. Harvest</p>
                                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{PRODUCE_DETAILS.currentBatch.estHarvestDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* People & Inputs */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600"><Users size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Planted By</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100">{PRODUCE_DETAILS.currentBatch.personnel.plantedBy}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-600"><ShoppingBag size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Seed Source ({PRODUCE_DETAILS.currentBatch.inputs.seedType})</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100">{PRODUCE_DETAILS.currentBatch.inputs.seedSource}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Financials & Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Sales Trend Line Chart */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <TrendingUp size={18} className="text-blue-500" /> Sales Trend
                            </h3>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+12% vs last batch</span>
                        </div>
                        <div className="h-32 flex items-end">
                            <LineChart data={PRODUCE_DETAILS.analytics.salesTrend} />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Planting</span>
                            <span>Harvest</span>
                            <span>Sold</span>
                        </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <DollarSign size={18} className="text-amber-500" /> Price Check
                            </h3>
                            <div className="flex gap-3 text-[10px] font-bold uppercase">
                                <span className="flex items-center gap-1 text-gray-400"><div className="w-2 h-2 bg-gray-300 rounded-full" /> Market</span>
                                <span className="flex items-center gap-1 text-emerald-500"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> My Price</span>
                            </div>
                        </div>
                        <ComparisonChart data={PRODUCE_DETAILS.analytics.marketPriceVsMyPrice} />
                    </div>

                    {/* Stacked Expenses */}
                    <div className="md:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <BarChart3 size={18} className="text-rose-500" /> Expenses Breakdown
                        </h3>
                        <StackedBar data={PRODUCE_DETAILS.analytics.expenses} />
                        <div className="flex flex-wrap gap-4 mt-4 justify-center">
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Seeds (30%)
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                <div className="w-3 h-3 rounded-full bg-blue-500" /> Labor (40%)
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                <div className="w-3 h-3 rounded-full bg-amber-500" /> Fert. (20%)
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                <div className="w-3 h-3 rounded-full bg-rose-500" /> Logistics (10%)
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Scientific Info / Knowledge Base */}
                <section className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 p-6">
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
                        <Info size={18} /> Scientific Data: {PRODUCE_DETAILS.name}
                    </h3>

                    <div className="flex gap-4 mb-4">
                        <div className="bg-white dark:bg-neutral-900 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            <Droplets size={14} /> pH: {PRODUCE_DETAILS.science.soilPh}
                        </div>
                        <div className="bg-white dark:bg-neutral-900 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            <ThermometerSun size={14} /> {PRODUCE_DETAILS.science.temp}
                        </div>
                    </div>

                    <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed mb-4">
                        {PRODUCE_DETAILS.science.description}
                    </p>

                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Pro Tips</p>
                        <ul className="space-y-2">
                            {PRODUCE_DETAILS.science.tips.map((tip, i) => (
                                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" /> {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* 6. Previous Batches (Simple List) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">Previous Batches</h3>
                        <button className="text-xs font-bold text-emerald-600">View Full History</button>
                    </div>
                    <div className="space-y-3">
                        {['B-2025-009', 'B-2025-008'].map((batch) => (
                            <div key={batch} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{batch}</p>
                                    <p className="text-xs text-gray-500">Harvested Nov 2025</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-emerald-600">₱45,000</p>
                                    <p className="text-xs text-gray-400">Net Profit</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}