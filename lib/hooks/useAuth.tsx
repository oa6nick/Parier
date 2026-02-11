'use client';

import { useApi } from '@/api/context';
import { v4 } from 'uuid';

import { clearSession, setSession } from '@/lib/store/Session/model/slice';

import { useAppDispatch } from '@/lib/hooks/useAppDispatch';
import { getSession, getSessionIsAuthenticated } from '../store/Session/model/selectors';
import { useSelector } from 'react-redux';
import { redirect } from 'next/navigation';

const ISSUER = process.env.OIDC_ISSUER;
const CLIENT_ID = process.env.OIDC_CLIENT_ID;

export const useAuth = () => {
    const api = useApi();
    const dispatch = useAppDispatch();
    const session = useSelector(getSession);
    const isAuthenticated = useSelector(getSessionIsAuthenticated);

    const login = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        localStorage.setItem('redirect_url', window.location.href);
        const REDIRECT_URI = `${window.location.origin}/auth`;
        window.location.href = `${ISSUER}/protocol/openid-connect/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid&state=${v4()}`;
    };

    const editProfile = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `${ISSUER}/account`;
    };

    const loginWithCode = async (code: string) => {
        const url = localStorage.getItem('redirect_url');
        const REDIRECT_URI = `${window.location.origin}/auth`;
        localStorage.removeItem('redirect_url');
        try {
            const response = await api.AuthApi.authLoginCodePut({
                code,
                iss: ISSUER as string,
                redirect_uri: REDIRECT_URI as string,
            });
            dispatch(setSession(response.data));
        } catch (error) {
            console.error(error);
        } finally {
            redirect(url || '/');
        }
    };

    const logout = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        await api.AuthApi.authLogoutPut({});
        dispatch(clearSession());
    };

    return { login, loginWithCode, logout, editProfile, session, isAuthenticated };
};
