import { JWTContextDefaultProvider } from '@/contexts/JWTContext';
import '@fortawesome/fontawesome-free/scss/brands.scss';
import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
// import 'ace-builds/webpack-resolver';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import { GlobalConfigContextDefaultProvider } from './contexts/GlobalConfigContext';
import Router from './routers/Router';
import './style.scss';

ReactDOM.render(
  <GlobalConfigContextDefaultProvider>
    <JWTContextDefaultProvider>
      <Router>
        <App />
      </Router>
    </JWTContextDefaultProvider>
  </GlobalConfigContextDefaultProvider>,
  document.getElementById('root'),
);
