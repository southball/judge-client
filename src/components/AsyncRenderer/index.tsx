import useAsyncState from '@/hooks/use-async-state';
import * as React from 'react';
import AsyncDisplay from './AsyncDisplay';

interface AsyncRendererProps<T> {
  fetcher: () => Promise<T>;
  // The array passed as the second argument of React.useEffect.
  dependencies: any[];
  children: (state: T) => React.ReactNode;
}

/**
 * This class should be used together with useAsyncState to reduce boilerplate
 * code.
 */
const AsyncRenderer = <T extends {}>({ fetcher, dependencies, children }: AsyncRendererProps<T>) => {
  const [loaded, erred, state] = useAsyncState<T>(fetcher, dependencies);
  return (
    <AsyncDisplay loaded={loaded} erred={erred} state={state}>
      {children}
    </AsyncDisplay>
  );
};

export default AsyncRenderer;
