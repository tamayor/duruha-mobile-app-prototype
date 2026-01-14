"use client"
import React, { useState } from 'react';
import {
    Heart,
    MessageCircle,
    PlayCircle,
    Image as ImageIcon,
    Gift,
    Truck,
    Users,
    Star,
    Trophy,
    ArrowUpRight,
    MapPin,
    Calendar,
    ChevronDown,
    Share2,
    Leaf
} from 'lucide-react';
import { ModeToggle } from '@/app/components/mode-toggle';

// --- Types ---
type FeedbackType = 'video' | 'photo' | 'text';

interface FeedbackItem {
    id: string;
    type: FeedbackType;
    customerLocation: string; // "Quezon City" (Anonymized)
    mediaUrl?: string;
    message: string;
    productName: string;
    batchId: string; // The link between customer and farmer
    date: string;
    rating: number;
}

interface DonationCampaign {
    id: string;
    title: string;
    beneficiary: string;
    urgency: 'high' | 'normal';
    target: string;
    collected: number; // percentage
}

// --- Mock Data ---
const FEEDBACK_DATA: FeedbackItem[] = [
    {
        id: '1',
        type: 'video',
        customerLocation: 'Makati City',
        mediaUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800', // Thumbnail
        message: 'We used your organic carrots for our baby\'s first solid food! Thank you for growing such clean produce.',
        productName: 'Native Carrots',
        batchId: 'BATCH-8821',
        date: '2 days ago',
        rating: 5
    },
    {
        id: '2',
        type: 'photo',
        customerLocation: 'Cebu City',
        mediaUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
        message: 'Made a huge salad for the family reunion. The lettuce was incredibly crisp even after shipping!',
        productName: 'Iceberg Lettuce',
        batchId: 'BATCH-9001',
        date: '1 week ago',
        rating: 5
    },
    {
        id: '3',
        type: 'text',
        customerLocation: 'Taguig',
        message: 'Sarap ng onions! Very aromatic unlike the imported ones. Will buy again.',
        productName: 'Red Onions',
        batchId: 'BATCH-7723',
        date: '3 days ago',
        rating: 4
    }
];

const DONATION_CAMPAIGNS: DonationCampaign[] = [
    {
        id: 'd1',
        title: 'Soup Kitchen Drive',
        beneficiary: 'Tondo Community Center',
        urgency: 'high',
        target: 'Root Vegetables',
        collected: 65
    },
    {
        id: 'd2',
        title: 'School Feeding Program',
        beneficiary: 'Benguet Elementary',
        urgency: 'normal',
        target: 'Leafy Greens & Eggs',
        collected: 30
    }
];

// --- Helper Components ---

// 1. Media Card (The "Reward")
const FeedbackCard = ({ item }: { item: FeedbackItem }) => (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* Media Header (If Video/Photo) */}
        {item.type !== 'text' && (
            <div className="relative h-48 bg-gray-100">
                <img src={item.mediaUrl} alt="Customer Feedback" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    {item.type === 'video' ? (
                        <div className="bg-white/90 p-3 rounded-full text-emerald-600 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                            <PlayCircle size={32} fill="currentColor" className="text-emerald-600" />
                        </div>
                    ) : (
                        <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                            <ImageIcon size={12} /> Photo
                        </div>
                    )}
                </div>
            </div>
        )}

        <div className="p-5">
            {/* Context Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-xs text-gray-400">{item.date}</span>
            </div>

            {/* Message */}
            <div className="mb-4">
                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed italic">
                    "{item.message}"
                </p>
            </div>

            {/* Technical Link (The Mapping) */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <Leaf size={14} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{item.productName}</p>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wide">
                        Code: {item.batchId} • {item.customerLocation}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Page ---
export default function RewardsPage() {
    const [activeTab, setActiveTab] = useState<'feedback' | 'donate'>('feedback');

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8">
            <div className="max-w-5xl mx-auto">

                {/* 1. Header & Gamification Stats */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Impact & Rewards</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">See the lives you feed and share your harvest.</p>
                        </div>
                        <ModeToggle />
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Ani Points */}
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200 dark:shadow-none relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2 opacity-90">
                                    <Trophy size={18} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Ani Points</span>
                                </div>
                                <div className="text-4xl font-black mb-1">12,450</div>
                                <div className="text-xs opacity-80">Top 5% of Farmers in Benguet</div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <Leaf size={120} />
                            </div>
                        </div>

                        {/* People Fed */}
                        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                                <Users size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Community Impact</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-1">842 <span className="text-lg font-medium text-gray-400">Families</span></div>
                            <div className="text-xs text-gray-500">Fed through your produce sales.</div>
                        </div>

                        {/* Donation Stats */}
                        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400">
                                <Heart size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Donations</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-1">120 <span className="text-lg font-medium text-gray-400">kg</span></div>
                            <div className="text-xs text-gray-500">Surplus donated to soup kitchens.</div>
                        </div>
                    </div>
                </div>

                {/* 2. Navigation Tabs */}
                <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 mb-8">
                    <button
                        onClick={() => setActiveTab('feedback')}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 transition-colors relative ${activeTab === 'feedback'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
                            }`}
                    >
                        <MessageCircle size={18} />
                        Customer Love
                        {activeTab === 'feedback' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('donate')}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 transition-colors relative ${activeTab === 'donate'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
                            }`}
                    >
                        <Gift size={18} />
                        Donate Surplus
                        {activeTab === 'donate' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 dark:bg-rose-400 rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* 3. Content Area */}

                {/* VIEW A: CUSTOMER FEEDBACK */}
                {activeTab === 'feedback' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Mapped Feedback</h2>
                            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <Truck size={12} />
                                <span>Verified via Transaction Codes</span>
                            </div>
                        </div>

                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {FEEDBACK_DATA.map((item) => (
                                <div key={item.id} className="break-inside-avoid">
                                    <FeedbackCard item={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* VIEW B: DONATION HUB */}
                {activeTab === 'donate' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Donation Hero */}
                        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-3xl p-8 mb-8 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                                    Have excess harvest? Share the blessing.
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg leading-relaxed">
                                    Don't let good food go to waste. Pledge your surplus produce, and
                                    <strong className="text-rose-600 dark:text-rose-400"> Dirikita will handle the logistics </strong>
                                    to pick it up and deliver it to partner soup kitchens.
                                </p>
                                <button className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-200 dark:shadow-none transition-all flex items-center gap-2 mx-auto md:mx-0">
                                    <Gift size={18} />
                                    Pledge Surplus Donation
                                </button>
                            </div>
                            <div className="w-full md:w-1/3 aspect-video bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                                <div className="bg-rose-100 dark:bg-rose-900/40 p-3 rounded-full text-rose-600 dark:text-rose-400 mb-3">
                                    <Truck size={24} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">We Pick Up</h3>
                                <p className="text-xs text-gray-500 mt-1">Just set a time. No cost to you.</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Active Community Needs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {DONATION_CAMPAIGNS.map((campaign) => (
                                <div key={campaign.id} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl flex items-center gap-5">
                                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-xl text-center">
                                        <span className="text-lg font-bold text-rose-600">{campaign.collected}%</span>
                                        <span className="text-[10px] text-gray-400 uppercase">Filled</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-900 dark:text-gray-50">{campaign.title}</h4>
                                            {campaign.urgency === 'high' && (
                                                <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">URGENT</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Beneficiary: <span className="font-medium text-gray-700 dark:text-gray-300">{campaign.beneficiary}</span>
                                        </p>
                                        <p className="text-xs text-gray-400">Needed: {campaign.target}</p>
                                    </div>
                                    <button className="p-2 rounded-lg bg-gray-50 dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 hover:text-rose-600 transition-colors">
                                        <ArrowUpRight size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}