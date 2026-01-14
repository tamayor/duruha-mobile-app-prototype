"use client"
import React, { useState } from 'react';
import {
    Bell,
    Truck,
    TrendingUp,
    TrendingDown,
    CloudRain,
    Sun,
    Sprout,
    AlertTriangle,
    CheckCircle2,
    Package,
    Droplets,
    ArrowRight,
    Filter,
    MoreHorizontal,
    DollarSign,
    Leaf
} from 'lucide-react';

// --- Types ---
type ActivityType = 'logistics' | 'market' | 'weather' | 'operations' | 'finance' | 'alert';

interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
    metadata?: {
        priceChange?: string;
        location?: string;
        actionLabel?: string;
    };
}

// --- Mock Data ---
const ACTIVITIES: ActivityItem[] = [
    {
        id: '1',
        type: 'alert',
        title: 'Oversupply Warning: Red Onions',
        description: 'Market saturation in Metro Manila hubs reached 95%. Suggested: Hold harvest or redirect to Cebu hub.',
        timestamp: '10 mins ago',
        isRead: false,
        metadata: { actionLabel: 'View Alternative Routes' }
    },
    {
        id: '2',
        type: 'logistics',
        title: 'Shipment #402 Arrived',
        description: 'Your 500kg of Native Carrots has arrived at the Balintawak Consolidation Hub and is being graded.',
        timestamp: '2 hours ago',
        isRead: false,
        metadata: { location: 'Quezon City', actionLabel: 'View Receipt' }
    },
    {
        id: '3',
        type: 'weather',
        title: 'Heavy Rain Expected',
        description: 'Typhoon signal #1 raised in Benguet. heavy rainfall expected tomorrow afternoon. Secure greenhouses.',
        timestamp: '4 hours ago',
        isRead: true,
        metadata: { actionLabel: 'See Rainfall Forecast' }
    },
    {
        id: '4',
        type: 'operations',
        title: 'Harvest Notification',
        description: 'Your "Iceberg Lettuce" batch (Plot A-4) is scheduled for harvest in 2 days based on planting date.',
        timestamp: 'Yesterday',
        isRead: true,
        metadata: { actionLabel: 'Confirm Harvest' }
    },
    {
        id: '5',
        type: 'market',
        title: 'Input Price Drop: Urea',
        description: 'Local fertilizer prices for Urea 46-0-0 dropped by ₱150/bag at "Benguet Farm Supply".',
        timestamp: 'Yesterday',
        isRead: true,
        metadata: { priceChange: '-8%', actionLabel: 'Order Supplies' }
    },
    {
        id: '6',
        type: 'finance',
        title: 'Planting Suggestion: Bell Peppers',
        description: 'Demand for Bell Peppers is projected to rise +20% next month due to holiday surge.',
        timestamp: '2 days ago',
        isRead: true,
        metadata: { actionLabel: 'View Demand Chart' }
    },
];

// --- Helper Functions ---
const getIcon = (type: ActivityType) => {
    switch (type) {
        case 'logistics': return Truck;
        case 'market': return TrendingUp;
        case 'weather': return CloudRain; // or Sun
        case 'operations': return Sprout;
        case 'alert': return AlertTriangle;
        case 'finance': return DollarSign;
        default: return Bell;
    }
};

const getTheme = (type: ActivityType) => {
    switch (type) {
        case 'alert': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900';
        case 'logistics': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900';
        case 'market': return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900';
        case 'weather': return 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-900';
        case 'finance': return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900';
        default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
};

// --- Components ---

// 1. Briefing Widget (Sidebar/Top)
const DailyBriefing = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Weather Widget */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <CloudRain size={80} />
            </div>
            <div className="relative z-10">
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Farm Weather • La Trinidad</p>
                <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-bold">22°C</span>
                    <span className="text-lg font-medium opacity-90 mb-1">Heavy Rain</span>
                </div>
                <div className="flex gap-4 text-xs font-medium text-indigo-100/80">
                    <span className="flex items-center gap-1"><Droplets size={12} /> 85% Humidity</span>
                    <span className="flex items-center gap-1"><Truck size={12} /> Transport Risk: High</span>
                </div>
            </div>
        </div>

        {/* Market Mover Widget */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Top Market Mover</p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Native Garlic</h3>
                </div>
                <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <TrendingUp size={12} /> +12%
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price hit ₱120/kg in Metro Manila due to import delays.</p>
                <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    Check Prices <ArrowRight size={12} />
                </button>
            </div>
        </div>
    </div>
);

// 2. Activity Card
const ActivityCard = ({ item }: { item: ActivityItem }) => {
    const Icon = getIcon(item.type);
    const theme = getTheme(item.type);

    return (
        <div className={`relative pl-4 pr-5 py-5 bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group ${!item.isRead ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}`}>
            {/* Unread Indicator */}
            {!item.isRead && (
                <div className="absolute left-0 top-6 w-1 h-8 bg-blue-500 rounded-r-full" />
            )}

            <div className="flex gap-4">
                {/* Icon Box */}
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border ${theme}`}>
                    <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-bold ${!item.isRead ? 'text-gray-900 dark:text-gray-50' : 'text-gray-700 dark:text-gray-300'}`}>
                            {item.title}
                        </h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{item.timestamp}</span>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                        {item.description}
                    </p>

                    {/* Metadata / Actions */}
                    {item.metadata?.actionLabel && (
                        <div className="flex items-center gap-3">
                            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors">
                                {item.metadata.actionLabel}
                            </button>
                            {item.metadata.location && (
                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <Package size={12} /> {item.metadata.location}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Page ---
export default function ActivityFeedPage() {
    const [filter, setFilter] = useState<string>('all');

    const filteredActivities = filter === 'all'
        ? ACTIVITIES
        : ACTIVITIES.filter(a => a.type === filter || (filter === 'alerts' && a.type === 'alert'));

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Activity Feed</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your farm's pulse: Logistics, Market & Risks</p>
                    </div>
                    <div className="relative">
                        <button className="p-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800">
                            <MoreHorizontal size={20} />
                        </button>
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-neutral-950 rounded-full"></span>
                    </div>
                </div>

                {/* Widgets */}
                <DailyBriefing />

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'alert', label: 'Alerts', icon: AlertTriangle },
                        { id: 'logistics', label: 'Logistics', icon: Truck },
                        { id: 'market', label: 'Market', icon: TrendingUp },
                        { id: 'operations', label: 'Farm Ops', icon: Leaf },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === tab.id
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-neutral-900 dark:text-gray-400 dark:border-gray-800 dark:hover:bg-neutral-800'
                                }`}
                        >
                            {tab.icon && <tab.icon size={12} />}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Feed Container */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    {/* Date Divider (Simulated) */}
                    <div className="bg-gray-50 dark:bg-neutral-800/50 px-5 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                        Today
                    </div>

                    {filteredActivities.slice(0, 3).map((item) => (
                        <ActivityCard key={item.id} item={item} />
                    ))}

                    <div className="bg-gray-50 dark:bg-neutral-800/50 px-5 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800">
                        Yesterday
                    </div>

                    {filteredActivities.slice(3).map((item) => (
                        <ActivityCard key={item.id} item={item} />
                    ))}

                    {filteredActivities.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <CheckCircle2 size={32} />
                            </div>
                            <p className="text-gray-500 font-medium">No activity in this category.</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <button className="text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        View older activity
                    </button>
                </div>

            </div>
        </main>
    );
}