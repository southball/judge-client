import * as React from 'react';
import GlobalConfigContext from '../../contexts/GlobalConfigContext';
import JWTContext from '../../contexts/JWTContext';

const HomePage = () => {
    return (
        <div>
            <h1 className="title is-3">Home</h1>
            <hr />
            Welcome!
        </div>
    );
};

export default HomePage;
