"use client"
import React from 'react';
import Link from 'next/link';
import {
    Bell,
    CloudRain,
    ThermometerSun,
    Wind,
    TrendingUp,
    TrendingDown,
    Sprout,
    ShoppingCart,
    Truck,
    Gift,
    Plus,
    ChevronRight,
    MapPin,
    AlertTriangle,
    Leaf,
    Menu,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { ModeToggle } from '@/app/components/mode-toggle';

// --- Mock Data ---
const FARMER_NAME = "Mang Jose";
const LOCATION = "Tubungan, Iloilo";

const WEATHER_DATA = {
    temp: 24,
    condition: "Cloudy with scattered showers",
    precip: "60%",
    wind: "12 km/h",
    warning: "Typhoon Signal #1 (Tomorrow)"
};

const ALERTS = [
    {
        id: '1',
        type: 'critical',
        title: 'Typhoon Warning: Prep Harvest',
        desc: 'Heavy rains expected in 24hrs. Recommended: Harvest mature "Native Carrots" now to avoid waterlogging.',
        action: 'View Harvest Plan',
        link: '/farmer/profile/produce'
    },
    {
        id: '2',
        type: 'logistics',
        title: 'Truck Arriving Soon',
        desc: 'Logistics Partner #882 is 30 mins away for your "Red Onion" pickup.',
        action: 'Track Driver',
        link: '/logistics'
    },
    {
        id: '3',
        type: 'market',
        title: 'Price Surge: Bell Peppers',
        desc: 'Market demand up +15% in Iloilo City. Good time to check your inventory.',
        action: 'Check Demand',
        link: '/demand'
    }
];

const MARKET_PRICES = [
    { name: 'Native Carrots', price: 85, trend: 'up', change: '+5%' },
    { name: 'Red Onions', price: 110, trend: 'up', change: '+2%' },
    { name: 'Cabbage', price: 45, trend: 'down', change: '-8%' },
];

// --- Helper Components ---

const AlertCard = ({ alert }: { alert: any }) => {
    const styles = {
        critical: 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/50 text-rose-900 dark:text-rose-100',
        logistics: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50 text-blue-900 dark:text-blue-100',
        market: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/50 text-amber-900 dark:text-amber-100',
    };

    // @ts-ignore
    const theme = styles[alert.type] || styles.market;
    const Icon = alert.type === 'critical' ? AlertTriangle : alert.type === 'logistics' ? Truck : TrendingUp;
    const iconColor = alert.type === 'critical' ? 'text-rose-600' : alert.type === 'logistics' ? 'text-blue-600' : 'text-amber-600';

    return (
        <div className={`p-4 rounded-2xl border mb-3 relative overflow-hidden ${theme}`}>
            <div className="flex gap-3">
                <div className={`mt-0.5 ${iconColor}`}>
                    <Icon size={20} />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">{alert.title}</h3>
                    <p className="text-xs opacity-80 leading-relaxed mb-3">{alert.desc}</p>
                    <Link href={alert.link || '#'} className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${iconColor}`}>
                        {alert.action} <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
export default function FarmerHomePage() {
    // Dynamic Greeting based on time (Current time is ~7:42 PM)
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Maayong Buntag";
        if (hour < 18) return "Maayong Hapon";
        return "Maayong Gabii";
    };

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-24">

            {/* 1. Header & Context */}
            <header className="px-5 pt-8 pb-4 bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-gray-800 rounded-b-[2rem] shadow-sm relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 border-2 border-white dark:border-neutral-800 shadow-sm">
                            <span className="font-bold text-lg">MJ</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{getGreeting()},</p>
                            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100">{FARMER_NAME}</h1>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <ModeToggle />
                        <button className="p-2.5 bg-gray-50 dark:bg-neutral-800 rounded-full text-gray-600 dark:text-gray-300 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-neutral-800"></span>
                        </button>
                    </div>
                </div>

                {/* Weather Compact Widget */}
                <div className="flex items-center justify-between bg-neutral-900 dark:bg-neutral-800 text-white p-4 rounded-2xl shadow-lg shadow-neutral-200 dark:shadow-none">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
                            <MapPin size={12} /> {LOCATION}
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold">{WEATHER_DATA.temp}°C</span>
                            <span className="text-xs text-gray-400 mb-1">Feels like 26°</span>
                        </div>
                        <p className="text-xs font-medium text-indigo-300 mt-1">{WEATHER_DATA.warning}</p>
                    </div>
                    <div className="text-right">
                        <CloudRain size={32} className="text-gray-300 ml-auto mb-1" />
                        <p className="text-xs text-gray-400">{WEATHER_DATA.precip} Rain</p>
                    </div>
                </div>
            </header>

            <div className="px-5 mt-6 max-w-xl mx-auto space-y-8">

                {/* 2. Critical Alerts Section */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <AlertTriangle size={16} className="text-rose-500" />
                            Important Activity
                        </h2>
                    </div>

                    {ALERTS.map((alert) => (
                        <AlertCard key={alert.id} alert={alert} />
                    ))}
                </section>

                {/* 3. Quick Actions Grid */}
                <section>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Quick Access</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {/* My Produce */}
                        <Link href="/farmer/profile/produce" className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-emerald-500 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Sprout size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">My Produce</h3>
                            <p className="text-xs text-gray-500">Manage Crops</p>
                        </Link>

                        {/* Demand Board */}
                        <Link href="/demand" className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-blue-500 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <ShoppingCart size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Demand Board</h3>
                            <p className="text-xs text-gray-500">Find Buyers</p>
                        </Link>

                        {/* Rewards */}
                        <Link href="/rewards" className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-rose-500 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Gift size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Rewards</h3>
                            <p className="text-xs text-gray-500">Donations & Points</p>
                        </Link>

                        {/* Logistics (Placeholder) */}
                        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-amber-500 transition-colors group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Truck size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Logistics</h3>
                            <p className="text-xs text-gray-500">Truck Status</p>
                        </div>
                    </div>
                </section>

                {/* 4. Market Prices Ticker */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Market Prices (Tubungan)</h2>
                        <span className="text-xs text-gray-400">Updated 1h ago</span>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-neutral-800">
                        {MARKET_PRICES.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                        <Leaf size={16} className="text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{item.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">₱{item.price}/kg</p>
                                    <div className={`text-[10px] font-bold flex items-center justify-end gap-1 ${item.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {item.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                        {item.change}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            {/* 5. Floating Action Button (Add Batch) */}
            <Link href="/farmer/profile/produce/add-batch" className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-600/30 flex items-center justify-center hover:scale-110 transition-transform z-50">
                <Plus size={28} />
            </Link>

        </main>
    );
}