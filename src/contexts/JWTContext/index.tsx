import * as Axios from 'axios';
import * as React from 'react';

export interface JWTContextConstants {
  refreshUrl: string;
}

export interface JWTContextBaseState {
  accessToken?: string;
  refreshToken?: string;
}

export interface JWTContextDerivedState {
  username?: string;
  permissions?: string[];
  accessTokenExpiry?: Date;
  refreshTokenExpiry?: Date;
}

export interface JWTContextGetter {
  withAuthorization: (header: Axios.AxiosRequestConfig) => Promise<Axios.AxiosRequestConfig>;

  /**
   * @deprecated
   */
  loggedIn: () => boolean;

  /**
   * @deprecated
   */
  hasPermission: (requiredPermission: string) => boolean;

  /**
   * @deprecated
   */
  getUsername: () => string | undefined;
}

export interface JWTContextRefresher {
  getAccessToken: () => Promise<string | undefined>;
  setBaseState: (baseState: JWTContextBaseState) => void;
}

export type JWTContextProps = JWTContextBaseState & JWTContextDerivedState & JWTContextGetter & JWTContextRefresher;

const JWTContext = React.createContext<JWTContextProps>({} as JWTContextProps);

export * from './default-provider';

export default JWTContext;
