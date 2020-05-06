import * as React from 'react';
import GlobalConfigContext from './GlobalConfigContext';
import axios from 'axios';
import * as Axios from 'axios';
import * as jsonwebtoken from 'jsonwebtoken';
import { useContext } from 'react';
import If from '../components/If/If';

const LOCAL_STORAGE_KEY = "JUDGE_AUTH";

export interface JWTContextState {
    accessToken?: string;
    refreshToken?: string;
    accessTokenData?: any;
    refreshTokenData?: any;
}

export interface JWTContextProps {
    set: (props: JWTContextState) => void;
    loggedIn: () => boolean;
    // Returns a valid access token that has not yet expired if possible.
    getAccessToken: () => Promise<string | undefined>;
    // Add authorization to header if possible.
    withAuthorization: (header: Axios.AxiosRequestConfig) => Promise<Axios.AxiosRequestConfig>;
    hasPermission: (requiredPermission: string) => boolean;
    getUsername: () => string;
}

const JWTContext = React.createContext({} as JWTContextProps);

export const JWTContextController = ({ children, ...props }: any) => {
    const [state, setState] = React.useState<JWTContextState>((() => {
        const localToken = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (localToken) {
            const localState = JSON.parse(localToken);
            const refreshTokenData = jsonwebtoken.decode(localState.refreshToken) as any;
            const refreshExpiry = new Date((refreshTokenData?.exp ?? 0) * 1000);
            const now = new Date();

            if (now < refreshExpiry) {
                console.log('Detected valid token from localStorage.');
                return transformedState(localState);
            }
        }

        return {};
    })());

    const globalConfig = React.useContext(GlobalConfigContext);

    async function getAccessToken(): Promise<string | undefined> {
        if (!state.accessToken) {
            return undefined;
        }

        // Check whether the current access token is expired, and refresh if needed
        const refreshUrl = new URL('auth/refresh', globalConfig.judgeServer).href;

        const now = new Date();
        const afterFiveMinutes = new Date(now.getTime() + 5 * 60 * 1000);
        const expiry = new Date(state.accessTokenData.exp * 1000);

        if (afterFiveMinutes > expiry) {
            const response = await axios.post(refreshUrl, {
                "refresh_token": state.refreshToken,
            });

            proxiedSetState({
                accessToken: response.data.data.access_token,
                refreshToken: response.data.data.refresh_token,
            });

            console.log('Updated.');
            return response.data.data.access_token;
        } else {
            return state.accessToken;
        }
    }

    function transformedState(newState: Partial<JWTContextState>): JWTContextState {
        return {
            ...newState,
            accessTokenData: jsonwebtoken.decode(newState.accessToken ?? state.accessToken ?? ''),
            refreshTokenData: jsonwebtoken.decode(newState.refreshToken ?? state.refreshToken ?? ''),
        };
    }

    function proxiedSetState(newState: Partial<JWTContextState>) {
        const stateDelta = { ...state, ...transformedState(newState) };

        setState(stateDelta);

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            accessToken: stateDelta.accessToken,
            refreshToken: stateDelta.refreshToken,
        }));
    }

    function loggedIn() {
        return typeof state.accessToken === 'string';
    }

    async function withAuthorization(requestConfig: Axios.AxiosRequestConfig) {
        if (!loggedIn())
            return requestConfig;

        return {
            ...requestConfig,
            headers: {
                ...requestConfig?.headers,
                Authorization: `Bearer ${await getAccessToken()}`,
            },
        };
    }

    function hasPermission(requiredPermission: string): boolean {
        return typeof state.accessToken === 'undefined'
            ? false
            : state.accessTokenData.permissions.some((permission: string) => permission === requiredPermission);
    }

    function getUsername(): string | null {
        return state?.accessTokenData?.username;
    }

    return (
        <JWTContext.Provider value={{
            ...state,
            set: proxiedSetState,
            getAccessToken,
            loggedIn,
            withAuthorization,
            hasPermission,
            getUsername,
        }} {...props}>
            {children}
        </JWTContext.Provider>
    );
};

export const IfAdmin = ({ children }: { children: React.ReactNode }) => {
    const jwtContext = useContext(JWTContext);
    return <If condition={jwtContext.hasPermission('admin')}>{children}</If>
};

export default JWTContext;
