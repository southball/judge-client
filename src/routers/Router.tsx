import * as React from 'react';
import { HashRouter } from 'react-router-dom';

class Router extends React.PureComponent<{ children: React.ReactNode }> {
  public render() {
    return <HashRouter>{this.props.children}</HashRouter>;
  }
}

export default Router;
