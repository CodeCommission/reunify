'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof require.ensure !== 'function') require.ensure = function (d, c) {
  return c(require);
};

exports.default = _react2.default.createElement(
  _reactRouter.Route,
  {
    path: '/',
    getComponent: function getComponent(location, cb) {
      try {
        delete require.cache[require.resolve('../../pages/Layout')];
        cb(null, require('../../pages/Layout').default);
      } catch (err) {
        delete require.cache[require.resolve('./pages/Layout')];
        cb(null, require('./pages/Layout').default);
      }
    },
    getChildRoutes: function getChildRoutes(location, cb) {
      require.ensure([], function (require) {
        var pages = void 0;
        if (!process.env.BROWSER) {
          // node context
          var fs = require('fs');
          pages = fs.existsSync('../../pages') ? fs.readdirSync('../../pages') : fs.readdirSync('./pages');
        } else {
          // browser context
          try {
            pages = require.context('../../pages', true, /^(.*\.(js$))[^.]*$/igm).keys().map(function (x) {
              return x.replace('./', '');
            });
          } catch (err) {
            pages = require.context('./pages', true, /^(.*\.(js$))[^.]*$/igm).keys().map(function (x) {
              return x.replace('./', '');
            });
          }
        }

        cb(null, pages.map(function (x) {
          return x.replace('.js', '');
        }).filter(function (x) {
          return x !== 'Index';
        }).filter(function (x) {
          return x !== 'Layout';
        }).filter(function (x) {
          return x !== 'NotFound';
        }).map(function (fileName) {
          try {
            delete require.cache[require.resolve('../../pages/' + fileName)];
          } catch (err) {
            delete require.cache[require.resolve('./pages/' + fileName)];
          }
          return fileName;
        }).map(function (fileName) {
          return {
            path: fileName.toLowerCase(),
            getComponent: function getComponent(location, cb) {
              try {
                var modRef = require('../../pages/' + fileName).default;
                cb(null, modRef);
              } catch (err) {
                var _modRef = require('./pages/' + fileName).default;
                cb(null, _modRef);
              }
            }
          };
        }).concat([{
          path: '*',
          component: require('./pages/NotFound').default
        }]));
      });
    } },
  _react2.default.createElement(_reactRouter.IndexRoute, { getComponent: function getComponent(location, cb) {
      try {
        delete require.cache[require.resolve('../../pages/Index')];
        cb(null, require('../../pages/Index').default);
      } catch (err) {
        delete require.cache[require.resolve('./pages/Index')];
        cb(null, require('./pages/Index').default);
      }
    } })
);
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
require('babel-polyfill');
require('isomorphic-fetch');

var path = require('path');
var fs = require('fs');
var express = require('express');
var React = require('react');
var ReactDOM = require('react-dom/server');
var ReactRouter = require('react-router');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-middleware');
var webpackConfig = require('./webpack.config.js');

var _require = require('styled-components'),
    ServerStyleSheet = _require.ServerStyleSheet;

var routes = require('./routes').default;

var app = express();
app.disable('x-powered-by');
app.use(webpackMiddleware(webpack(webpackConfig), { noInfo: true, stats: { warnings: false, chunks: false } }));
app.use(express.static('static'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/sw.js', function (req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  fs.createReadStream(path.join(__dirname, 'sw.js')).pipe(res);
});

app.get('*', function (req, res) {
  ReactRouter.match({ routes: routes, location: req.url }, function (err, redirectLocation, renderProps) {
    if (err) return res.status(500).send(err.message);
    if (redirectLocation) return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    if (renderProps) {
      var promises = renderProps.components.filter(function (component) {
        return component.getInitialProps;
      }).map(function (component) {
        return component.getInitialProps({ query: req.query, params: req.params }).then(function (x) {
          return { name: component.name, componentInitialPropsData: x };
        });
      });

      Promise.all(promises).then(function (data) {

        var sheet = new ServerStyleSheet();
        var html = ReactDOM.renderToString(sheet.collectStyles(React.createElement(ReactRouter.RouterContext, _extends({}, renderProps, {
          createElement: function createElement(Component, props) {
            var componentInitialPropsData = (data.find(function (x) {
              return x.name === Component.name;
            }) || {}).componentInitialPropsData;
            return React.createElement(Component, _extends({}, props, componentInitialPropsData));
          }
        }))));

        return res.render('index', Object.assign({ title: '', description: '', name: '' }, data && data[0] && data[0].componentInitialPropsData, {
          html: html,
          css: sheet.getStyleTags(),
          initialPropsData: data
        }));
      });
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = function () {
  var server = {};

  return {
    start: function start(_ref) {
      var port = _ref.port,
          host = _ref.host;
      return new Promise(function (resolve) {
        return server = app.listen(port, host, function () {
          return resolve({ url: 'http://' + host + ':' + server.address().port });
        });
      });
    },
    stop: function stop() {
      return new Promise(function (resolve) {
        return server.close(function () {
          return resolve();
        });
      });
    }
  };
};
