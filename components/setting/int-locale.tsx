'use client';
import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useApi } from '@/api/context';

export function IntLocaleProvider({ locale }: { locale: string }) {
    const userLocale = useLocale();
    const api = useApi();
    const intLocale = userLocale || locale;
    useEffect(() => {
        api.setLocale(intLocale);
    }, [intLocale, api]);
    return null;
}
