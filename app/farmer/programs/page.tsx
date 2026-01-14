"use client"
import React, { useState } from 'react';
import {
    Wallet,
    Users,
    Truck,
    ShieldCheck,
    Sprout,
    ArrowRight,
    Search,
    BadgePercent,
    GraduationCap,
    CheckCircle2,
    Clock,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

// --- Types ---
type ProgramCategory = 'finance' | 'logistics' | 'education' | 'protection';

interface Program {
    id: string;
    title: string;
    description: string;
    category: ProgramCategory;
    icon: any;
    color: string; // Tailwind color class snippet (e.g., 'emerald', 'blue')
    actionLabel: string;
    isPopular?: boolean;
    tags: string[];
}

// --- Mock Data: Conceptualized Programs ---
const PROGRAMS: Program[] = [
    {
        id: '1',
        title: 'Seed Capital & Micro-Loans',
        description: 'Low-interest financing for seeds, fertilizers, and equipment. Pay back only after you harvest.',
        category: 'finance',
        icon: Wallet,
        color: 'emerald',
        actionLabel: 'Check Eligibility',
        isPopular: true,
        tags: ['Low Interest', 'Pay Later'],
    },
    {
        id: '2',
        title: 'Talk with Agri-Experts',
        description: 'Book a 30-minute video call with agronomists to diagnose pests or improve yield strategies.',
        category: 'education',
        icon: Users,
        color: 'blue',
        actionLabel: 'Book Consultation',
        tags: ['Free for Members', 'Video Call'],
    },
    {
        id: '3',
        title: 'Duruha Logistics Pool',
        description: 'Share truck space with nearby farmers sending produce to the same city. Reduce transport costs by 40%.',
        category: 'logistics',
        icon: Truck,
        color: 'amber',
        actionLabel: 'Find Routes',
        isPopular: true,
        tags: ['Cost Saver', 'Daily Trips'],
    },
    {
        id: '4',
        title: 'Harvest Shield Insurance',
        description: 'Protect your crops against typhoons and droughts. Instant payout based on local weather data.',
        category: 'protection',
        icon: ShieldCheck,
        color: 'indigo',
        actionLabel: 'View Coverage',
        tags: ['Weather Index', 'Fast Payout'],
    },
    {
        id: '5',
        title: 'Bulk Input Group Buy',
        description: 'Join 500+ farmers buying organic fertilizers in bulk. Get wholesale prices delivered to your zone.',
        category: 'finance',
        icon: BadgePercent,
        color: 'rose',
        actionLabel: 'Join Group Buy',
        tags: ['Wholesale Price', 'Organic'],
    },
    {
        id: '6',
        title: 'GAP Certification Assist',
        description: 'Step-by-step guidance and paperwork assistance to get your Good Agricultural Practice (GAP) seal.',
        category: 'education',
        icon: GraduationCap,
        color: 'teal',
        actionLabel: 'Start Certification',
        tags: ['Premium Pricing', 'Export Ready'],
    },
];

// --- Components ---

// 1. Program Card
const ProgramCard = ({ program }: { program: Program }) => {
    // Dynamic color classes based on the 'color' prop
    const colorMap: Record<string, string> = {
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50',
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800/50',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/50',
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50',
        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-800/50',
        teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400 border-teal-100 dark:border-teal-800/50',
    };

    const themeClass = colorMap[program.color];
    const Icon = program.icon;

    return (
        <div className="group relative flex flex-col bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

            {/* Popular Badge */}
            {program.isPopular && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                    POPULAR
                </div>
            )}

            <div className="p-6 flex-1">
                {/* Icon Header */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border ${themeClass}`}>
                    <Icon size={28} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2 group-hover:text-emerald-600 transition-colors">
                    {program.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                    {program.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {program.tags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 text-[10px] font-medium uppercase tracking-wide border border-gray-100 dark:border-gray-700">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-neutral-900/50">
                <button className="w-full flex items-center justify-between text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {program.actionLabel}
                    <div className="bg-white dark:bg-neutral-800 p-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm group-hover:translate-x-1 transition-transform">
                        <ArrowRight size={14} />
                    </div>
                </button>
            </div>
        </div>
    );
};

// --- Main Component ---
export default function ProgramsPage() {
    const [filter, setFilter] = useState<string>('all');

    const filteredPrograms = filter === 'all'
        ? PROGRAMS
        : PROGRAMS.filter(p => p.category === filter);

    return (
        <section className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-12">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                            <Sprout size={20} />
                            <span className="uppercase tracking-widest text-xs">Growth & Support</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-50 tracking-tight">
                            Partner Programs
                        </h2>
                        <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl">
                            Tools to boost your yield, secure your capital, and connect you with the right experts. Designed for Dirikita partners.
                        </p>
                    </div>

                    {/* Simple Stats */}
                    <div className="flex gap-4 sm:gap-8">
                        <div>
                            <p className="text-3xl font-black text-gray-900 dark:text-gray-100">12k+</p>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Farmers Aided</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900 dark:text-gray-100">₱45M</p>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Loans Dispersed</p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {['all', 'finance', 'education', 'logistics', 'protection'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${filter === cat
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none'
                                : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-neutral-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map((program) => (
                        <ProgramCard key={program.id} program={program} />
                    ))}

                    {/* "Suggest a Program" Card - Always at the end or conditionally placed */}
                    <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all group cursor-pointer text-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ExternalLink size={20} className="text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Suggest a Program</h3>
                        <p className="text-sm text-gray-500 mb-4 max-w-xs">
                            Don't see what you need? Tell us how we can help your farm grow.
                        </p>
                        <span className="text-sm font-bold text-emerald-600 underline decoration-2 underline-offset-4">
                            Submit Idea
                        </span>
                    </div>
                </div>

                {/* Active Application Banner (Contextual) */}
                <div className="mt-12 bg-gray-900 dark:bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/30">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 className="text-white dark:text-gray-900 font-bold text-lg">Application in Progress</h4>
                            <p className="text-gray-400 dark:text-gray-500 text-sm">
                                You have a pending application for <span className="text-white dark:text-gray-900 font-semibold">Seed Capital Loan</span>.
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 dark:text-emerald-600">
                                    <CheckCircle2 size={14} /> Documents Submitted
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400 dark:text-amber-600">
                                    <Clock size={14} /> Reviewing (Est. 2 days)
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="whitespace-nowrap px-6 py-3 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        Track Status
                    </button>
                </div>

            </div>
        </section>
    );
}