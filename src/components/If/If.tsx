import * as React from 'react';

export const If = ({condition, children}: {condition: boolean, children: React.ReactNode}) => {
    return condition ? <>{children}</> : <></>;
}

export default If;
