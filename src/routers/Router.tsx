import * as React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';

class Router extends React.PureComponent {
    public render() {
        return (
            <HashRouter>
                {this.props.children}
            </HashRouter>
        );
    }
}

export default Router;
