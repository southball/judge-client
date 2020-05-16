import NotFound from '@/components/NotFound';
import NowLoading from '@/components/NowLoading';
import type { IsErredType, IsLoadedType } from '@/hooks/use-async-state';
import * as React from 'react';

interface AsyncDisplayProps<T> {
  loaded: IsLoadedType;
  erred: IsErredType;
  state: T;
  children: (state: T) => React.ReactNode;
}

const AsyncDisplay = <T extends {}>({ loaded, erred, state, children }: AsyncDisplayProps<T>) => (
  <>{erred ? <NotFound /> : !loaded ? <NowLoading /> : children(state)}</>
);

export default AsyncDisplay;
