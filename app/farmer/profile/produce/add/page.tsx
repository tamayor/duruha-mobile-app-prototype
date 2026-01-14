"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    Calendar,
    Sprout,
    MapPin,
    Package,
    Users,
    ShoppingBag,
    Save,
    Info,
    Check,
    Leaf,
    FlaskConical,
    Ruler,
    LocateFixed
} from 'lucide-react';
import { ModeToggle } from '@/app/components/mode-toggle';

// --- Mock Data ---
const FARMER_DEFAULT_LOCATION = "Tubungan, Iloilo, Philippines";

const CROP_OPTIONS = [
    { id: 'c1', name: 'Native Carrots', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=200', daysToHarvest: 90 },
    { id: 'c2', name: 'Red Onions', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=200', daysToHarvest: 120 },
    { id: 'c3', name: 'Iceberg Lettuce', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&q=80&w=200', daysToHarvest: 45 },
    { id: 'c4', name: 'Bell Peppers', image: 'https://images.unsplash.com/photo-1563565375-f3fdf5d2e374?auto=format&fit=crop&q=80&w=200', daysToHarvest: 75 },
];

export default function AddBatchPage() {
    // --- State ---
    const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        // Location
        location: FARMER_DEFAULT_LOCATION,
        plotName: '',
        landArea: '',

        // Seeds
        seedVariety: '',
        seedSource: '',
        seedQuantity: '',
        seedUnit: 'grams', // cans, packets, kg, grams

        // Inputs
        baseFertilizer: '',

        // Timeline
        plantedDate: '',
        estHarvestDate: '',

        // Labor
        personnel: ''
    });

    // --- Handlers ---
    const handleCropSelect = (id: string, days: number) => {
        setSelectedCrop(id);
        if (formData.plantedDate) {
            updateHarvestDate(formData.plantedDate, days);
        }
    };

    const updateHarvestDate = (startDate: string, days: number) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + days);
        setFormData(prev => ({
            ...prev,
            estHarvestDate: date.toISOString().split('T')[0]
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        const crop = CROP_OPTIONS.find(c => c.id === selectedCrop);

        setFormData(prev => ({ ...prev, plantedDate: newDate }));

        if (crop) {
            updateHarvestDate(newDate, crop.daysToHarvest);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-24">

            {/* 1. Sticky Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/farmer/profile/produce" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                        <ChevronLeft size={24} className="text-gray-700 dark:text-gray-200" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">Register Planting</h1>
                        <p className="text-xs text-gray-500">New Batch Entry</p>
                    </div>
                </div>
                <ModeToggle />
            </header>

            <div className="max-w-2xl mx-auto px-4 mt-6 space-y-8">

                {/* 2. Crop Selector */}
                <section>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        1. Select Produce <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                        {CROP_OPTIONS.map((crop) => (
                            <div
                                key={crop.id}
                                onClick={() => handleCropSelect(crop.id, crop.daysToHarvest)}
                                className={`flex-shrink-0 relative w-28 h-32 rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${selectedCrop === crop.id ? 'border-emerald-500 ring-4 ring-emerald-500/20' : 'border-transparent opacity-80 hover:opacity-100'}`}
                            >
                                <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                                    <p className="text-white text-xs font-bold leading-tight">{crop.name}</p>
                                </div>
                                {selectedCrop === crop.id && (
                                    <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Location Details (Defaulted) */}
                <section className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <MapPin size={18} className="text-rose-500" />
                        2. Location & Area
                    </h3>

                    <div className="space-y-4">
                        {/* Default Location Display */}
                        <div className="p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-100 dark:bg-rose-900/20 text-rose-600 rounded-full">
                                    <LocateFixed size={16} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Registered Farm Address</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formData.location}</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Change</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Plot Name */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Specific Plot / Site Name</label>
                                <input
                                    type="text"
                                    value={formData.plotName}
                                    onChange={(e) => setFormData({ ...formData, plotName: e.target.value })}
                                    placeholder="e.g. Upper Terrace, Greenhouse A"
                                    className="w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-gray-100 text-sm"
                                />
                            </div>
                            {/* Land Area */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Area Size (sqm/ha)</label>
                                <div className="relative">
                                    <Ruler size={16} className="absolute left-3.5 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.landArea}
                                        onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                                        placeholder="e.g. 500 sqm"
                                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-gray-100 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Seed & Input Details */}
                <section className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Package size={18} className="text-amber-500" />
                        3. Seeds & Inputs
                    </h3>

                    <div className="space-y-4">
                        {/* Seed Variety & Brand */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Seed Variety / Brand</label>
                            <input
                                type="text"
                                value={formData.seedVariety}
                                onChange={(e) => setFormData({ ...formData, seedVariety: e.target.value })}
                                placeholder="e.g. Kuroda Improved (Condor)"
                                className="w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-gray-100 text-sm"
                            />
                        </div>

                        {/* Seed Quantity */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Seed Quantity Used</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={formData.seedQuantity}
                                    onChange={(e) => setFormData({ ...formData, seedQuantity: e.target.value })}
                                    placeholder="0"
                                    className="flex-1 h-11 px-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-gray-100 font-bold"
                                />
                                <select
                                    value={formData.seedUnit}
                                    onChange={(e) => setFormData({ ...formData, seedUnit: e.target.value })}
                                    className="h-11 px-3 rounded-xl bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 text-sm font-bold outline-none"
                                >
                                    <option value="cans">Cans</option>
                                    <option value="packets">Packets</option>
                                    <option value="grams">Grams</option>
                                    <option value="kg">Kg</option>
                                </select>
                            </div>
                        </div>

                        {/* Source */}
                        <div className="relative">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Seed Source (Shop/Supplier)</label>
                            <ShoppingBag className="absolute left-3.5 top-8 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={formData.seedSource}
                                onChange={(e) => setFormData({ ...formData, seedSource: e.target.value })}
                                placeholder="e.g. Harbest Agrotech"
                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-gray-100 text-sm"
                            />
                        </div>

                        {/* Base Fertilizer */}
                        <div className="relative">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Base Fertilizer / Soil Prep</label>
                            <FlaskConical className="absolute left-3.5 top-8 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={formData.baseFertilizer}
                                onChange={(e) => setFormData({ ...formData, baseFertilizer: e.target.value })}
                                placeholder="e.g. Chicken Manure, 14-14-14"
                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-gray-100 text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* 5. Timeline */}
                <section className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-blue-500" />
                        4. Timeline
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Date Planted</label>
                            <input
                                type="date"
                                value={formData.plantedDate}
                                onChange={handleDateChange}
                                className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>

                        <div className="relative">
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block flex justify-between">
                                Est. Harvest
                                {selectedCrop && <span className="text-emerald-500 text-[10px] flex items-center gap-1"><Sprout size={10} /> AI Estimated</span>}
                            </label>
                            <input
                                type="date"
                                value={formData.estHarvestDate}
                                readOnly
                                className="w-full h-12 px-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 text-gray-900 dark:text-gray-100 font-medium cursor-not-allowed"
                            />
                        </div>
                    </div>
                </section>

                {/* 6. Personnel */}
                <section className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Users size={18} className="text-purple-500" />
                        5. Labor Details
                    </h3>
                    <div className="relative">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Planted By / Supervisor</label>
                        <Users className="absolute left-3.5 top-8 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={formData.personnel}
                            onChange={(e) => setFormData({ ...formData, personnel: e.target.value })}
                            placeholder="e.g. Mang Jose, Team A"
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-gray-100 text-sm"
                        />
                    </div>
                </section>
            </div>

            {/* 7. Sticky Footer Action */}
            <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-gray-800 p-4 z-40 safe-area-bottom">
                <div className="max-w-2xl mx-auto flex gap-4">
                    <Link href="/farmer/profile/produce" className="flex-1 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-center hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                        Cancel
                    </Link>
                    <button className="flex-[2] py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none transition-transform active:scale-95">
                        <Save size={20} />
                        Save Planting Record
                    </button>
                </div>
            </div>

        </main>
    );
}