import * as React from 'react';

export interface GlobalConfigContextProps {
  judgeServer: string;
}

export const GlobalConfigContext = React.createContext<GlobalConfigContextProps>({
  judgeServer: '',
});

export * from './default-provider';

export default GlobalConfigContext;
