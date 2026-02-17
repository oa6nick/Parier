import axios, {AxiosInstance} from 'axios';
import {AdminApiFactory, AuthApiFactory, Configuration, MediaApiFactory, ParierApiFactory, ReferralApiFactory, WalletApiFactory} from './client';

export interface ApiInstance {
    axios: AxiosInstance;
    setGetAuthData: (fn?: string) => void;
    setLocale: (locale: string) => void;
    setOnAuthException: (fn: () => void) => void;
    MediaApi: ReturnType<typeof MediaApiFactory>;
    AuthApi: ReturnType<typeof AuthApiFactory>;
    ParierApi: ReturnType<typeof ParierApiFactory>;
    AdminApi: ReturnType<typeof AdminApiFactory>;
    WalletApi: ReturnType<typeof WalletApiFactory>;
    ReferralApi: ReturnType<typeof ReferralApiFactory>;
}

export function createApi(parameters: {baseUrl: string}): ApiInstance {
    const baseUrl =
        parameters.baseUrl.startsWith('http') || parameters.baseUrl.startsWith('https')
            ? parameters.baseUrl
            : undefined;
    const instance: AxiosInstance = axios.create({
        baseURL: baseUrl,
        withCredentials: true,
    });
    const configuration = new Configuration({
        basePath: parameters.baseUrl,
        accessToken: async (_name?: string, _scopes?: string[]): Promise<string> => {
            const authData = getAuthData();
            if (authData) {
                return authData;
            }
            return '';
        },
    });

    let getAuthData: () => string | undefined = () => undefined;
    let getLocale: () => string = () => 'en';
    let onAuthException: () => void = () => { };

    instance.interceptors.request.use((config) => {
        // Handle auth data
        config.headers.set('Accept-Language', getLocale());
        return config;
    });
    instance.interceptors.response.use(
        (response) => {
            // Handle successful responses
            return response;
        },
        (error) => {
            if (error.response && error.response.status === 401 && onAuthException) {
                onAuthException();
            }
            return Promise.reject(error);
        },
    );

    return {
        axios: instance,
        setGetAuthData: (fn?: string) => {
            getAuthData = () => fn;
        },
        setOnAuthException: (fn: () => void) => {
            onAuthException = fn;
        },
        setLocale: (locale: string) => {
            getLocale = () => locale;
        },
        MediaApi: MediaApiFactory(configuration, parameters.baseUrl, instance),
        AuthApi: AuthApiFactory(configuration, parameters.baseUrl, instance),
        ParierApi: ParierApiFactory(configuration, parameters.baseUrl, instance),
        AdminApi: AdminApiFactory(configuration, parameters.baseUrl, instance),
        WalletApi: WalletApiFactory(configuration, parameters.baseUrl, instance),
        ReferralApi: ReferralApiFactory(configuration, parameters.baseUrl, instance),
    };
}

// todo an actual implementation
export const api = createApi({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});
