import { useEffect, useState } from 'react';

export type IsLoadedType = boolean;
export type IsErredType = boolean;

const useAsyncState = <T extends any>(
  fetcher: () => Promise<T>,
  dependencies: any[],
): [IsLoadedType, IsErredType, T] => {
  const [isLoaded, setLoaded] = useState<IsLoadedType>(false);
  const [isErred, setErred] = useState<IsErredType>(false);
  const [state, setState] = useState<T>();

  useEffect(() => {
    fetcher()
      .then((value: T) => {
        // Make sure that setState happens before setLoaded to there
        // will be no invalid state returned.
        setState(value);
        setLoaded(true);
      })
      .catch((error: Error) => {
        console.error(error);
        setErred(true);
      });
  }, dependencies);

  return [isLoaded, isErred, state as T];
};

export default useAsyncState;
