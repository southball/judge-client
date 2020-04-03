import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App/App';
import { GlobalConfigContextController } from './contexts/GlobalConfigContext';
import { JWTContextController } from './contexts/JWTContext';
import Router from './routers/Router';

import './style.scss';

import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import '@fortawesome/fontawesome-free/scss/brands.scss';

ReactDOM.render(
    <GlobalConfigContextController>
        <JWTContextController>
            <Router>
                <App />
            </Router>
        </JWTContextController>
    </GlobalConfigContextController>,
    document.getElementById('root'),
);
