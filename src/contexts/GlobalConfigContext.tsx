import * as React from 'react';

const GlobalConfigContext = React.createContext({
  judgeServer: '',
});

export const GlobalConfigContextController = ({ children, ...props }: any) => (
  <GlobalConfigContext.Provider
    value={{
      judgeServer: process.env.JUDGE_SERVER as string,
    }}
    {...props}
  >
    {children}
  </GlobalConfigContext.Provider>
);

export default GlobalConfigContext;
