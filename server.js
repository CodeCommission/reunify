process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
require('babel-polyfill');
const path = require('path')
const express = require('express')
const React = require('react')
const ReactDOM = require('react-dom/server')
const ReactRouter = require('react-router')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-middleware')
const glamor = require('glamor/server')
const webpackConfig = require('./webpack.config.js')
const routes = require('./routes').default

const app = express()
app.use(webpackMiddleware(webpack(webpackConfig), {noInfo: true, stats: { warnings: false, chunks: false, }}))
app.use(express.static('static'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('*', (req, res) => {
  ReactRouter.match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) return res.status(500).send(err.message)
    if (redirectLocation) return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    if (renderProps) {

      const promises = renderProps
        .components
        .filter(component => component.getInitialProps)
        .map(component => component.getInitialProps({query: req.query, params: req.params}).then(x => ({name: component.name, componentInitialPropsData: x})))

      Promise.all(promises)
        .then(data => {
          const { html, css } = glamor.renderStatic(() => ReactDOM.renderToString(
            <ReactRouter.RouterContext
              {...renderProps}
              createElement={(Component, props) => {
                const componentInitialPropsData = (data.find(x => x.name === Component.name) || {}).componentInitialPropsData
                return (<Component {...props} {...componentInitialPropsData} />)
              }}/>))
          return res.render('index', { html:html, css: css, initialPropsData:data })
        })

    } else {
      res.sendStatus(404)
    }
  })
})

module.exports = function (argv) {
  let server = {};
  return {
    start: function start(port) {
      return new Promise(function (resolve, reject) {
        return server = app.listen(port, function () {
          return resolve(server);
        });
      });
    },
    stop: function stop() {
      return new Promise(function (resolve, reject) {
        return server.close(resolve);
      });
    }
  };
};
