"use client"
import React, { useState, useMemo } from 'react';
import {
    MoreHorizontal,
    ShoppingCart,
    MapPin,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    PauseCircle,
    Leaf,
    CalendarDays,
    BarChart3,
    DollarSign,
    Info,
    ExternalLink,
    X,
    Search,
    ChevronDown,
    ChevronUp,
    Globe
} from 'lucide-react';
import { ModeToggle } from '@/app/components/mode-toggle';

// --- Types ---
type DemandStatus = 'critical' | 'sustain' | 'pause';

interface LocationData {
    location: string;
    suggestedAmount: number; // User's specific target
    myPledge: number;
    pledgedAmount: number;   // Total pledged in this location
    totalDemand: number;     // Total demand in this location
    regionalDemand: number;
}

interface DemandItem {
    id: string;
    name: string;
    image: string;
    status: DemandStatus;
    nationwideDemand: number;
    locationData: LocationData[];
}

// --- Helper Components ---
const StatusBadge = ({ status }: { status: DemandStatus }) => {
    const config = {
        critical: { style: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-100 dark:border-red-800', icon: AlertCircle, label: 'Critical' },
        sustain: { style: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-100 dark:border-emerald-800', icon: CheckCircle2, label: 'Sustain' },
        pause: { style: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-800', icon: PauseCircle, label: 'Paused' },
    };
    const { style, icon: Icon, label } = config[status];

    return (
        <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
            <Icon size={14} className="mr-1" />
            {label}
        </span>
    );
};

// New Component: Progress Bar with Labels
const SaturationRow = ({ label, value, max, icon: Icon }: { label: string, value: number, max: number, icon: any }) => {
    const percent = Math.min(100, Math.round((value / max) * 100));
    const isFull = percent >= 100;

    // Color logic: Low fill (Green/Opportunity) -> High fill (Orange) -> Full (Red)
    const barColor = isFull
        ? 'bg-red-500'
        : percent > 80
            ? 'bg-amber-500'
            : 'bg-emerald-500';

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end text-xs">
                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 font-medium">
                    <Icon size={12} className="opacity-70" />
                    {label}
                </span>
                <span className="text-gray-900 dark:text-gray-100 font-bold">
                    {percent}% <span className="font-normal text-gray-400">Filled</span>
                </span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400">
                <span>0</span>
                <span>{max.toLocaleString()} kg</span>
            </div>
        </div>
    );
};

// --- Sub-Component: Demand Card ---
const DemandCard = ({
    item,
    serveLocation,
    isFuturePledge,
    onOpenAction
}: {
    item: DemandItem,
    serveLocation: string,
    isFuturePledge: boolean,
    onOpenAction: (item: DemandItem) => void
}) => {
    // 1. Resolve Location Data
    const locData = serveLocation === 'all'
        ? item.locationData[0]
        : item.locationData.find(loc => loc.location === serveLocation) || item.locationData[0];

    const highlightColor = isFuturePledge ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400';
    const highlightBg = isFuturePledge ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20';

    // Mocking Regional Pledged Data (since it wasn't in original mock)
    // We assume regional pledged is roughly 3x the local pledged for demo purposes
    const simulatedRegionalPledged = Math.floor(locData.pledgedAmount * 2.5);
    const simulatedNationwidePledged = Math.floor(locData.pledgedAmount * 8.5);

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300">
            {/* Image Header */}
            <div className="relative h-44">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><StatusBadge status={item.status} /></div>
                <button
                    onClick={() => onOpenAction(item)}
                    className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-900/80 p-1.5 rounded-full hover:bg-white transition-colors"
                >
                    <MoreHorizontal size={18} />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-1 text-xs text-gray-200 mb-0.5">
                            <MapPin size={12} /> {locData.location}
                        </div>
                        <h2 className="text-xl font-bold text-white leading-none">{item.name}</h2>
                    </div>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1 gap-6">

                {/* 1. HERO: My Pledge Emphasis */}
                <div className={`rounded-xl p-4 text-center border ${isFuturePledge ? 'border-blue-100 dark:border-blue-900' : 'border-emerald-100 dark:border-emerald-900'} ${highlightBg}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest opacity-80 mb-1 ${highlightColor}`}>
                        My Last Pledge
                    </p>
                    <div className={`text-4xl font-black tracking-tight ${highlightColor}`}>
                        {locData.myPledge} <span className="text-lg font-medium text-gray-500 dark:text-gray-400">kg</span>
                    </div>
                </div>

                {/* 2. MARKET SATURATION (The 3 Levels) */}
                <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Market Saturation</p>

                    {/* Level 1: Location */}
                    <SaturationRow
                        label={`${locData.location} Demand`} // Changed Label per request
                        value={locData.pledgedAmount}
                        max={locData.totalDemand}
                        icon={MapPin}
                    />

                    {/* Level 2: Regional */}
                    {/* <SaturationRow
                        label="Regional Demand"
                        value={simulatedRegionalPledged}
                        max={locData.regionalDemand}
                        icon={MapPin} // Or a specific Region icon
                    /> */}

                    {/* Level 3: Nationwide */}
                    {/* <SaturationRow
                        label="Nationwide Demand"
                        value={simulatedNationwidePledged}
                        max={item.nationwideDemand}
                        icon={Globe}
                    /> */}
                </div>

                {/* Action Button */}
                <div className="mt-auto pt-2">
                    {item.status === 'pause' ? (
                        <button disabled className="w-full py-3 bg-neutral-100 dark:bg-neutral-800 text-gray-400 font-medium rounded-xl cursor-not-allowed border border-gray-200 dark:border-gray-700">
                            Supply Paused
                        </button>
                    ) : (
                        <button
                            className={`w-full py-3 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${isFuturePledge
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                        >
                            {isFuturePledge ? <TrendingUp size={18} /> : <Leaf size={18} />}
                            {isFuturePledge ? 'Pledge Supply (Future)' : 'Make Offer (Now)'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Page ---
export default function DemandPage() {
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
    const [activeItem, setActiveItem] = useState<DemandItem | null>(null);
    const [searchInput, setSearchInput] = useState('');
    const [serveLocation, setServeLocation] = useState('all');
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const locations = ['all', 'Metro Manila', 'Cebu City', 'Baguio', 'Davao', 'Nueva Ecija', 'Iloilo', 'Bulacan'];

    const isFuturePledge = useMemo(() => {
        const today = new Date();
        const filterDate = new Date(selectedMonth);
        const diffDays = Math.ceil((filterDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays > 30;
    }, [selectedMonth]);

    const filteredData = useMemo(() => {
        const query = searchInput.trim().toLowerCase();
        if (!query) return MOCK_DATA;
        return MOCK_DATA.filter((item) =>
            item.name.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query) ||
            item.locationData.some(loc => loc.location.toLowerCase().includes(query))
        );
    }, [searchInput]);

    const handleFilterBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsFilterExpanded(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8 dark:text-gray-100">
            <div className="md:max-w-6xl md:mx-auto">

                {/* Page Header */}
                <header className="flex items-center gap-4 mb-8">
                    <div className="p-3.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
                        <ShoppingCart className="text-emerald-700 dark:text-emerald-500" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">Demand Board</h1>
                        <p className="text-gray-500 dark:text-gray-400">Monitor requirements and submit supplies</p>
                    </div>
                </header>

                {/* Expandable Filter Section */}
                <section
                    className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 mb-8 sticky top-4 z-30 transition-all"
                    onBlur={handleFilterBlur}
                >
                    <div
                        className="flex items-center justify-between gap-3 p-4 cursor-pointer"
                        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="bg-gray-100 dark:bg-neutral-800 p-2 rounded-lg text-gray-500 dark:text-gray-400">
                                <CalendarDays size={20} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-gray-900 dark:text-gray-100">Plan & Filter Demand</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {isFilterExpanded ? 'Refine your view below' : `Viewing ${serveLocation === 'all' ? 'All Locations' : serveLocation}`}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                                {isFilterExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </div>
                    </div>

                    {isFilterExpanded && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex flex-col lg:flex-row gap-4 mb-3">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={`${selectedMonth}-01`}
                                            onChange={(e) => setSelectedMonth(e.target.value.slice(0, 7))}
                                            className="w-full sm:w-48 rounded-xl border border-gray-300 dark:border-gray-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none dark:text-gray-100"
                                        />
                                    </div>
                                    <div className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center justify-center ${isFuturePledge
                                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800'
                                        }`}>
                                        {isFuturePledge ? 'Future Pledge Mode' : 'Instant Offer Mode'}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col sm:flex-row gap-3">

                                    <div className="relative sm:w-64">
                                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <select
                                            value={serveLocation}
                                            onChange={(e) => setServeLocation(e.target.value)}
                                            className="w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-700 bg-neutral-50 dark:bg-neutral-900 pl-10 pr-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none dark:text-gray-100"
                                        >
                                            {locations.map((loc) => (
                                                <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            placeholder="Search produce..."
                                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-neutral-50 dark:bg-neutral-900 pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.map((item) => (
                        <DemandCard
                            key={item.id}
                            item={item}
                            serveLocation={serveLocation}
                            isFuturePledge={isFuturePledge}
                            onOpenAction={setActiveItem}
                        />
                    ))}
                </div>
            </div>

            {/* Modal / Action Sheet */}
            {activeItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setActiveItem(null)}>
                    <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">{activeItem.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Quick Actions</p>
                            </div>
                            <button onClick={() => setActiveItem(null)} className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <ActionButton icon={Leaf} color="text-emerald-600" label={`View ${activeItem.name} Details`} sub="Listings & Specs" />
                            <ActionButton icon={BarChart3} color="text-amber-600" label="Demand Analytics" sub="Trends & History" />
                            <ActionButton icon={DollarSign} color="text-emerald-600" label="My Cost Analysis" sub="Margins & Inputs" />
                            <ActionButton icon={Info} color="text-blue-600" label="Sourcing Guide" sub="Buyer requirements" />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

// Simple Action Button for Modal
const ActionButton = ({ icon: Icon, color, label, sub }: { icon: any, color: string, label: string, sub: string }) => (
    <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:border-emerald-200 transition-all group text-left shadow-sm">
        <div className={`p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg group-hover:scale-110 transition-transform ${color}`}>
            <Icon size={20} />
        </div>
        <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{label}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
        </div>
        <ExternalLink size={16} className="text-gray-300 group-hover:text-gray-500" />
    </button>
);

// --- Data ---
const MOCK_DATA: DemandItem[] = [
    {
        id: '1',
        name: 'Native Carrots',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=600',
        status: 'critical',
        nationwideDemand: 8500,
        locationData: [
            { location: 'Metro Manila', suggestedAmount: 200, myPledge: 50, pledgedAmount: 3500, totalDemand: 3550, regionalDemand: 8000 },
            { location: 'Cebu City', suggestedAmount: 150, myPledge: 0, pledgedAmount: 1200, totalDemand: 1400, regionalDemand: 4000 },
        ],
    },
    {
        id: '2',
        name: 'Red Onions',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600',
        status: 'sustain',
        nationwideDemand: 12000,
        locationData: [
            { location: 'Metro Manila', suggestedAmount: 400, myPledge: 100, pledgedAmount: 1200, totalDemand: 1800, regionalDemand: 10000 },
        ],
    },
    {
        id: '3',
        name: 'Baguio Cabbage',
        image: 'https://images.unsplash.com/photo-1664337872260-c388d9fee71b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        status: 'pause',
        nationwideDemand: 5500,
        locationData: [
            { location: 'Metro Manila', suggestedAmount: 0, myPledge: 0, pledgedAmount: 600, totalDemand: 500, regionalDemand: 400 },
        ],
    },
    {
        id: '4',
        name: 'Cavendish Banana',
        image: 'https://plus.unsplash.com/premium_photo-1724250081102-cab0e5cb314c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        status: 'sustain',
        nationwideDemand: 15000,
        locationData: [
            { location: 'Metro Manila', suggestedAmount: 350, myPledge: 0, pledgedAmount: 900, totalDemand: 1800, regionalDemand: 12000 },
        ],
    },
];