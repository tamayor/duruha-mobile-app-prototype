'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Store,          // Shop
    PlusSquare,     // Post (Request/Content)
    Users,          // Join (Community Buying)
    User2           // Profile
} from 'lucide-react';

const navItems = [
    {
        href: '/consumer/shop',
        label: 'Shop',
        icon: Store,
    },
    {
        href: '/consumer/post',
        label: 'Post',
        icon: PlusSquare,
    },
    {
        href: '/consumer/join',
        label: 'Join',
        icon: Users,
    },
    {
        href: '/consumer/profile',
        label: 'Profile',
        icon: User2,
    },
];

export default function ConsumerBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 md:relative md:border-t-0 md:px-0 shadow-2xl md:shadow-none z-50">
            <div className="flex justify-around items-center max-w-lg mx-auto md:max-w-full">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    // Check active state
                    const isActive = pathname === item.href || pathname?.includes(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-all duration-200 md:flex-row md:gap-3 md:py-2 md:px-4 ${isActive
                                ? 'text-orange-700 dark:text-orange-200 bg-orange-50 dark:bg-orange-900/40 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                }`}
                        >
                            <div className={`p-2 rounded-lg transition-colors ${isActive
                                ? 'bg-orange-500 text-white dark:bg-orange-600'
                                : 'bg-transparent'
                                }`}>
                                <Icon size={isActive ? 20 : 22} />
                            </div>
                            <span className={`text-xs md:text-sm font-bold transition-colors ${isActive
                                ? 'text-orange-700 dark:text-orange-200'
                                : 'text-gray-600 dark:text-gray-300'
                                }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}