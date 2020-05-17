import * as React from 'react';
import GlobalConfigContext from '.';

export const GlobalConfigContextDefaultProvider = ({ children, ...props }: any) => (
  <GlobalConfigContext.Provider
    value={{
      judgeServer: process.env.JUDGE_SERVER as string,
    }}
    {...props}
  >
    {children}
  </GlobalConfigContext.Provider>
);

export default GlobalConfigContextDefaultProvider;
