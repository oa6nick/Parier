'use client';
import { redirect, useSearchParams } from 'next/navigation';

import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect } from 'react';

export default function AuthPage() {
    const { loginWithCode } = useAuth();
    const searchParams = useSearchParams();

    const code = searchParams.get('code');
    useEffect(() => {
        if (code) {
            loginWithCode(code);
        } else {
            redirect('/');
        }
    }, [code]);
    return <div>Loading...</div>;
}
