'use client';

import { FC, memo, useEffect } from 'react';

import { useApi } from '@/api/context';
import { useQuery } from '@tanstack/react-query';

import { setSession } from '@/lib/store/Session/model/slice';

import { useAppDispatch } from '@/lib/hooks/useAppDispatch';

export const Session: FC<{ children?: React.ReactNode }> = memo(({ children = null }) => {
    const api = useApi();
    const dispatch = useAppDispatch();

    const { data, isLoading } = useQuery({
        queryKey: ['session'],
        queryFn: () => api.AuthApi.authProfilePost({}),
    });

    useEffect(() => {
        if (data && !isLoading) {
            dispatch(setSession(data.data));
        }
    }, [data, dispatch, isLoading]);

    return children;
});
