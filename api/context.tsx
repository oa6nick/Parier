'use client';
import { createContext, ReactNode, useContext } from 'react';
import { api, ApiInstance } from './api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const ApiContext = createContext<ApiInstance>({} as ApiInstance);

const ApiProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ApiContext.Provider value={api}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ApiContext.Provider>
    );
};

export default ApiProvider;

export function useApi() {
    return useContext(ApiContext);
}
