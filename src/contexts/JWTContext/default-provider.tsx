import axios, * as Axios from 'axios';
import * as jsonwebtoken from 'jsonwebtoken';
import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import JWTContext, {
  JWTContextBaseState,
  JWTContextConstants,
  JWTContextDerivedState,
  JWTContextGetter,
  JWTContextProps,
  JWTContextRefresher,
} from '.';
import GlobalConfigContext, { GlobalConfigContextProps } from '../GlobalConfigContext';

const LOCAL_STORAGE_KEY = 'JUDGE_AUTH';

// Return a refresh token that has not yet expired, if available, from
// localStorage.
const getLocalStorageRefreshToken = (): string | undefined => {
  const localToken = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (localToken) {
    const localTokenData = jsonwebtoken.decode(localToken) as any;
    const expiryDate = new Date((localTokenData?.exp ?? 0) * 1000);
    const now = new Date();

    if (now < expiryDate) {
      // The token has not yet expired; return the token.
      return localToken;
    } else {
      // The token has expired; remove the token from localStorage.
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return;
    }
  } else {
    return;
  }
};

/**
 * Generate a new access token from refreshToken.
 */
async function generateAccessToken(this: JWTContextConstants, refreshToken: string): Promise<string | undefined> {
  // TODO check whether refresh token has expired.
  const response = await axios.post(this.refreshUrl, {
    refresh_token: refreshToken,
  });

  return response.data.data.access_token;
}

/**
 * Initialize the base state asynchronously.
 */
async function initBaseState(
  this: JWTContextConstants,
  setBaseState: (baseState: JWTContextBaseState) => void,
): Promise<void> {
  const refreshToken = getLocalStorageRefreshToken();

  if (refreshToken) {
    const accessToken = await generateAccessToken.call(this, refreshToken);
    setBaseState({ refreshToken, accessToken });
  }
}

/**
 * Return the derived state from the base state.
 */
const deriveState = (baseState: JWTContextBaseState): JWTContextDerivedState => {
  if (!baseState.accessToken || !baseState.refreshToken) {
    return {
      // ensure that all admin requirements are not satisfied
      permissions: [],
    };
  }

  const accessTokenData = jsonwebtoken.decode(baseState.accessToken) as any;
  const refreshTokenData = jsonwebtoken.decode(baseState.refreshToken) as any;

  console.log(!baseState.accessToken, baseState.accessToken);
  console.table(accessTokenData);
  console.log(!baseState.refreshToken, baseState.refreshToken);
  console.table(refreshTokenData);

  return {
    accessTokenExpiry: new Date(accessTokenData.exp * 1000),
    refreshTokenExpiry: new Date(refreshTokenData.exp * 1000),
    permissions: accessTokenData.permissions as string[],
    username: accessTokenData.username as string,
  };
};

/**
 * Attach a bearer token to the axios request.
 */
async function withAuthorization(
  this: JWTContextBaseState & JWTContextRefresher,
  requestConfig: Axios.AxiosRequestConfig,
): Promise<Axios.AxiosRequestConfig> {
  if (!this.refreshToken) {
    return requestConfig;
  }

  return {
    ...requestConfig,
    headers: {
      ...requestConfig?.headers,
      Authorization: `Bearer ${await this.getAccessToken()}`,
    },
  };
}

// Return a valid access token if possible.
async function getAccessToken(
  this: JWTContextBaseState & JWTContextDerivedState & { setBaseState: (baseState: JWTContextBaseState) => void },
): Promise<string | undefined> {
  if (!this.refreshToken) {
    return;
  }

  const expiryTime = this.accessTokenExpiry?.getTime() ?? 0;
  const timeUntilExpiry = expiryTime - new Date().getTime();

  // Less than 1 minute before expiry; refresh the token.
  if (timeUntilExpiry < 60000) {
    const newAccessToken: string | undefined = await generateAccessToken.call(this, this.refreshToken);

    this.setBaseState({
      refreshToken: this.refreshToken,
      accessToken: newAccessToken,
    });

    return newAccessToken;
  } else {
    return this.accessToken;
  }
}

function generateConstants(globalConfigContext: GlobalConfigContextProps): JWTContextConstants {
  return {
    refreshUrl: new URL('auth/refresh', globalConfigContext.judgeServer).href,
  };
}

export const JWTContextDefaultProvider = ({ children }: { children: React.ReactNode }) => {
  const globalContext = useContext(GlobalConfigContext);
  const constants = useMemo(() => generateConstants(globalContext), []);

  const [baseState, internalSetBaseState] = useState<JWTContextBaseState>({});
  const setBaseState = (baseState: JWTContextBaseState): void => {
    if (baseState.refreshToken) {
      localStorage.setItem(LOCAL_STORAGE_KEY, baseState.refreshToken);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    internalSetBaseState(baseState);
  };

  useEffect(() => {
    initBaseState.call(constants, setBaseState);
  }, []);

  const derivedState = useMemo<JWTContextDerivedState>(() => deriveState(baseState), [baseState]);

  const refresherEnv = { ...constants, ...baseState, ...derivedState, setBaseState };
  const refresher: JWTContextRefresher = {
    getAccessToken: getAccessToken.bind(refresherEnv),
    setBaseState,
  };

  const getterEnv = { ...baseState, ...derivedState, ...refresher };
  const getters: JWTContextGetter = {
    withAuthorization: withAuthorization.bind(getterEnv),
    getUsername: () => derivedState.username,
    hasPermission: (permission: string) => derivedState.permissions?.includes(permission) ?? false,
    loggedIn: () => typeof baseState.refreshToken !== 'undefined',
  };

  const props: JWTContextProps = { ...getterEnv, ...getters };
  return <JWTContext.Provider value={props}>{children}</JWTContext.Provider>;
};

export default JWTContextDefaultProvider;
