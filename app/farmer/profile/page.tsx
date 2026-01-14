"use client"
import React from 'react';
import Link from 'next/link'; // Added for navigation
import {
    MapPin,
    Calendar,
    Sprout,
    Star,
    MessageCircle,
    Phone,
    Clock,
    CheckCircle2,
    Leaf,
    ArrowRight,
    Award,
    MoreHorizontal,
    Share2,
    ChevronLeft
} from 'lucide-react';
import { ModeToggle } from '@/app/components/mode-toggle';

// --- Types ---
type CropStatus = 'growing' | 'harvesting' | 'completed';

interface ProduceItem {
    id: string;
    name: string;
    image: string;
    pledgedAmount: number;
    harvestDate: string;
    status: CropStatus;
    growthProgress: number; // 0 to 100
}

interface FarmerProfile {
    id: string;
    name: string;
    location: string;
    coverImage: string;
    avatar: string;
    yearsFarming: number;
    joinedDate: string;
    bio: string;
    rating: number;
    verified: boolean;
    activePledges: ProduceItem[];
}

// --- Mock Data ---
const FARMER_DATA: FarmerProfile = {
    id: 'f1',
    name: 'Mang Jose Rivera',
    location: 'La Trinidad, Benguet',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    yearsFarming: 15,
    joinedDate: 'August 2024',
    bio: 'Specializing in high-elevation organic root vegetables. We practice regenerative farming to ensure the soil stays healthy for the next generation.',
    rating: 4.9,
    verified: true,
    activePledges: [
        {
            id: 'p1',
            name: 'Native Carrots',
            image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=600',
            pledgedAmount: 500,
            harvestDate: 'Oct 15, 2026',
            status: 'growing',
            growthProgress: 65,
        },
        {
            id: 'p2',
            name: 'Iceberg Lettuce',
            image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&q=80&w=600',
            pledgedAmount: 200,
            harvestDate: 'Sep 28, 2026',
            status: 'harvesting',
            growthProgress: 95,
        },
        {
            id: 'p3',
            name: 'Red Onions',
            image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600',
            pledgedAmount: 1000,
            harvestDate: 'Nov 01, 2026',
            status: 'growing',
            growthProgress: 30,
        },
    ]
};

// --- Helper Components ---

const CropStatusBadge = ({ status }: { status: CropStatus }) => {
    const config = {
        growing: { color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200', label: 'Growing', icon: Sprout },
        harvesting: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200', label: 'Harvest Ready', icon: Leaf },
        completed: { color: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300', label: 'Fulfilled', icon: CheckCircle2 },
    };
    const { color, label, icon: Icon } = config[status];

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${color}`}>
            <Icon size={12} />
            {label}
        </span>
    );
};

const GrowthBar = ({ percent }: { percent: number }) => (
    <div className="w-full h-1.5 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
        />
    </div>
);

const StatBlock = ({ icon: Icon, label, value, sub }: { icon: any, label: string, value: string, sub?: string }) => (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
            {sub && <p className="text-xs text-gray-500">{sub}</p>}
        </div>
    </div>
);

// --- Main Page ---
export default function FarmerProfilePage() {
    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-12">

            {/* Top Navigation Overlay */}
            <nav className="fixed top-0 inset-x-0 z-50 p-4 pointer-events-none">
                <div className="max-w-5xl mx-auto flex justify-between items-start pointer-events-auto">
                    <button className="p-2.5 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full shadow-sm hover:bg-white dark:hover:bg-black transition-colors border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-200">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        <ModeToggle />
                        <button className="p-2.5 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full shadow-sm hover:bg-white dark:hover:bg-black transition-colors border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-200">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Cover Image */}
            <div className="h-64 md:h-80 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img
                    src={FARMER_DATA.coverImage}
                    alt="Farm Cover"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-20 -mt-20">

                {/* Farmer Identity Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-start">

                    {/* Avatar Group */}
                    <div className="flex flex-col items-center md:items-start -mt-20 md:-mt-24">
                        <div className="relative">
                            <img
                                src={FARMER_DATA.avatar}
                                alt={FARMER_DATA.name}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-neutral-900 object-cover shadow-lg"
                            />
                            {FARMER_DATA.verified && (
                                <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white dark:border-neutral-900" title="Verified Farmer">
                                    <Award size={16} fill="currentColor" />
                                </div>
                            )}
                        </div>

                        {/* Rating (Mobile only, moves for Desktop) */}
                        <div className="mt-4 flex items-center gap-1.5 md:hidden">
                            <Star size={16} className="text-amber-400 fill-amber-400" />
                            <span className="font-bold text-gray-900 dark:text-gray-100">{FARMER_DATA.rating}</span>
                            <span className="text-gray-400 text-sm">(120 reviews)</span>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center justify-center md:justify-start gap-2">
                                    {FARMER_DATA.name}
                                </h1>
                                <p className="flex items-center justify-center md:justify-start gap-1.5 text-gray-500 dark:text-gray-400 mt-1">
                                    <MapPin size={16} />
                                    {FARMER_DATA.location}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-center gap-3">
                                <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-sm text-sm">
                                    <MessageCircle size={18} />
                                    Message
                                </button>
                                <a href='/farmer'>
                                    <button className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </a>
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="mt-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-2xl mx-auto md:mx-0">
                            {FARMER_DATA.bio}
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

                    {/* Left Column: Stats & Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 px-1">Farmer Stats</h3>

                        <StatBlock
                            icon={Clock}
                            label="Experience"
                            value={`${FARMER_DATA.yearsFarming} Years`}
                            sub="Farming Since 2011"
                        />
                        <StatBlock
                            icon={Calendar}
                            label="Joined Dirikita"
                            value={FARMER_DATA.joinedDate}
                            sub="Verified Member"
                        />
                        <StatBlock
                            icon={Phone}
                            label="Contact"
                            value="Verified"
                            sub="+63 9XX XXX XXXX"
                        />
                    </div>

                    {/* Right Column: Pledged Produce List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">Active Pledges</h3>

                            {/* --- NAVIGATION LINK --- */}
                            <Link
                                href="/farmer/profile/produce"
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline underline-offset-4"
                            >
                                View All Produce <ArrowRight size={14} />
                            </Link>
                            {/* ----------------------- */}
                        </div>

                        {/* Produce Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {FARMER_DATA.activePledges.map((crop) => (
                                <Link
                                    href="/farmer/profile/produce"
                                    key={crop.id}
                                    className="group bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all hover:border-emerald-200 dark:hover:border-emerald-900 flex gap-4 cursor-pointer"
                                >

                                    {/* Crop Image */}
                                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
                                        <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between py-0.5">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-900 dark:text-gray-100">{crop.name}</h4>
                                                <CropStatusBadge status={crop.status} />
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                                                <Calendar size={12} /> Harvest: {crop.harvestDate}
                                            </p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-end text-xs">
                                                <span className="font-medium text-emerald-700 dark:text-emerald-400">{crop.pledgedAmount} kg</span>
                                                <span className="text-gray-400">{crop.growthProgress}% Grown</span>
                                            </div>
                                            <GrowthBar percent={crop.growthProgress} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}