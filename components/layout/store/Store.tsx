'use client';

import { FC, memo } from 'react';

import { Session } from './Session';

export const StoreComponent: FC<{ children?: React.ReactNode }> = memo(({ children = null }) => {
    return (
        <>
            <Session />
            {children}
        </>
    );
});
