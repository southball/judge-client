import * as React from 'react';

export interface LastUpdateContextProps {
  lastUpdate: number;
  update: () => void;
}

// This context handles the refresh event when creating problem.
export const LastUpdateContext = React.createContext<LastUpdateContextProps>({
  lastUpdate: 0,
  update: () => {
    throw new Error('Update function is not provided.');
  },
});

export * from './default-provider';

export default LastUpdateContext;
