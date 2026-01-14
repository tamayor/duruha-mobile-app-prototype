'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ShoppingCart,
    Sprout,
    Activity,
    Heart,
    User2,
    ShieldAlert
} from 'lucide-react';

const navItems = [
    {
        href: '/farmer/demand',
        label: 'Demand',
        icon: ShoppingCart,
    },
    {
        href: '/farmer/programs',
        label: 'Programs',
        icon: Sprout,
    },
    {
        href: '/farmer/activity',
        label: 'Activity',
        icon: Activity,
    },
    {
        href: '/farmer/thankyou',
        label: 'Rewards',
        icon: Heart,
    },
    {
        href: '/farmer/profile',
        label: 'Profile',
        icon: User2,
    },
];

export default function FarmerBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 md:relative md:border-t-0 md:px-0 shadow-2xl md:shadow-none z-50">
            <div className="flex justify-around items-center max-w-lg mx-auto md:max-w-full ">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.includes(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 md:flex-row md:gap-3 md:py-2 md:px-3 ${isActive
                                ? 'text-emerald-700 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/40 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                }`}
                        >
                            <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-emerald-600 text-white dark:bg-emerald-700' : 'bg-transparent'
                                }`}>
                                <Icon size={isActive ? 20 : 22} />
                            </div>
                            <span className={`text-xs md:text-sm font-semibold transition-colors ${isActive ? 'text-emerald-700 dark:text-emerald-200' : 'text-gray-600 dark:text-gray-300'
                                }`}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
