import axios from "axios";
import type { AxiosResponse } from 'axios';

// Alterado para exportação nomeada em vez de constante local
export const jwtAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_HOST_API, // YOUR_API_URL HERE
    headers: {
        'Content-Type': 'application/json',
    },
});

jwtAxios.interceptors.response.use(
    (res: AxiosResponse<any, any>) => res,
    (err: any) => {
        if (err.response && err.response.data.msg === 'Token is not valid') {
            console.log('Need to logout user');
            // store.dispatch({type: LOGOUT});
        }
        return Promise.reject(err);
    }
);

jwtAxios.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        config.headers['X-Frontend-host'] = window.location.hostname;

        const affiliateCode = localStorage.getItem('affiliateCode');
        if (affiliateCode) {
            config.headers['X-Affiliate-Code'] = affiliateCode;
        }
    }

    return config;
});

export const setAuthToken = (token?: string) => {
    if (token) {
        jwtAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    } else {
        delete jwtAxios.defaults.headers.common.Authorization;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    }
};

export const setSystem = (System?: string) => {
    if (System && typeof window !== 'undefined') {
        localStorage.setItem('System', System);
    } else if (typeof window !== 'undefined') {
        localStorage.removeItem('System');
    }
};

// Inicializar o token do localStorage (se existir)
if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }
}

// Ainda mantém a exportação default para compatibilidade
export default jwtAxios;
