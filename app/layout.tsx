'use client';
import ApiProvider from '@/api/context';
import { StoreComponent } from '@/components/layout/store';
import store from '@/lib/store/store';
import { Provider } from 'react-redux';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ApiProvider>
            <Provider store={store}>
                <StoreComponent>{children}</StoreComponent>
            </Provider>
        </ApiProvider>
    );
}
