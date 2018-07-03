// Main application
import path from 'path';
import React from 'react';
import {render, hydrate} from 'react-dom';
import {StaticRouter, BrowserRouter, Switch, Route, Link, withRouter} from 'react-router-dom';
import minimatch from 'minimatch';
import sortBy from 'lodash.sortby';

import Catch from './Catch';

const IS_CLIENT = typeof document !== 'undefined';
const req = require.context(DIRNAME, true, /\.(js|jsx)$/);
const routesPath = req.keys().find(key => key === './_routes.js');
const dynamicallyRoutes = routesPath ? req(routesPath).default || req(routesPath) : () => [];
const {filename, basename = ''} = OPTIONS;

const getComponents = async req =>
  req
    .keys()
    .filter(minimatch.filter('!node_modules'))
    .filter(key => !MATCH || minimatch(key.replace(/^\.\//, ''), MATCH))
    .filter(key => !/^_/.test(path.basename(key)))
    .map(key => ({
      key,
      name: path.basename(key, path.extname(key)),
      module: req(key),
      Component: req(key).default || req(key)
    }))
    .concat(await dynamicallyRoutes())
    .filter(component => typeof component.Component === 'function');

const DefaultApp = props => props.children;
const Router = IS_CLIENT ? BrowserRouter : StaticRouter;
const appPath = req.keys().find(key => key === './_app.js');
const App = appPath ? req(appPath).default || req(appPath) : DefaultApp;

export const getRoutes = async () => {
  const components = await getComponents(req);
  const promises = await components.map(async ({key, name, module, Component, props}) => {
    const exact = name === 'index';
    const dirname = path.dirname(key).replace(/^\./, '');
    const extname = path.extname(key);
    let pathname = dirname + (exact ? '/' : '/' + name);
    const href = pathname;
    const initialProps = Component.getInitialProps ? await Component.getInitialProps({path: pathname}) : {};
    const defaultProps = Component.defaultProps;
    const meta = module.frontMatter || {};
    const newProps = {...meta, ...initialProps, ...defaultProps, ...props};

    // for dynamic routing
    pathname = newProps.path || pathname;

    if (dirname && name === 'index') {
      name = path.basename(dirname);
    }

    return {
      key,
      name,
      extname,
      href,
      path: pathname,
      dirname,
      exact,
      module,
      Component,
      props: newProps
    };
  });
  const routes = await Promise.all(promises);
  const filtered = routes.filter(r => !r.props.ignore).filter(component => !/404/.test(component.name));
  let sorted = [...filtered];
  sorted = sortBy([...sorted], a => a.name);
  sorted = sortBy([...sorted], a => !a.exact);
  sorted = sortBy([...sorted], a => a.dirname);
  sorted.notfound = routes.find(component => /404/.test(component.name));
  return sorted;
};

const RouterState = withRouter(({render, ...props}) => {
  const {pathname} = props.location;
  const route = props.routes.find(r => r.path === pathname || r.href === pathname) || {props: {}};
  return render({...props, route});
});

export default class Root extends React.Component {
  static defaultProps = {
    path: '/',
    basename
  };
  state = {
    ...this.props,
    ...App.defaultProps
  };

  render() {
    const {routes, basename, path = '/'} = this.props;

    const NotFound = routes.notfound ? routes.notfound.Component : () => <h1>404 - not found</h1>;

    const render = appProps => (
      <Switch>
        {routes.map(({Component, ...route}) => (
          <Route
            {...route}
            render={props => (
              <Catch>
                <Component {...props} {...appProps} {...route.props} />
              </Catch>
            )}
          />
        ))}
        <Route render={props => <NotFound {...props} routes={routes} />} />
      </Switch>
    );

    return (
      <Router context={{}} basename={basename} location={path}>
        <React.Fragment>
          <Catch>
            <RouterState
              routes={routes}
              render={router => (
                <App {...router} routes={routes} render={render} Component={render} children={render(router)} />
              )}
            />
          </Catch>
        </React.Fragment>
      </Router>
    );
  }
}

if (IS_CLIENT) {
  const mount = DEV ? render : hydrate;
  const div = window.root || document.body.appendChild(document.createElement('div'));
  getRoutes().then(routes => {
    mount(<Root routes={routes} />, div);
  });
}

if (IS_CLIENT && module.hot) {
  module.hot.accept();
}
