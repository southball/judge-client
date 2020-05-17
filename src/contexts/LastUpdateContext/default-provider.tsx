import * as React from 'react';
import LastUpdateContext from '.';
import type { LastUpdateContextProps } from '.';

interface LastUpdateContextDefaultProviderProps {
  children: React.ReactNode | ((context: LastUpdateContextProps) => React.ReactNode);
}

// This component provides a default implementation for
// LastUpdateContext.Provider.
export const LastUpdateContextDefaultProvider = ({ children }: LastUpdateContextDefaultProviderProps) => {
  const [lastUpdate, setLastUpdate] = React.useState(new Date().getTime());
  const update = () => {
    setLastUpdate(new Date().getTime());
  };

  const context = { lastUpdate, update };

  return (
    <LastUpdateContext.Provider value={context}>
      {typeof children === 'function' ? children(context) : children}
    </LastUpdateContext.Provider>
  );
};

export default LastUpdateContextDefaultProvider;
