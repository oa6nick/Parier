'use client';

import { useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;
        if (!isAuthenticated) {
            login();
        }
    }, [isAuthenticated, status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );
    }
    if (!isAuthenticated) return null;

    return <>{children}</>;
}
