process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
require('babel-polyfill')
require('isomorphic-fetch')

const path = require('path')
const fs = require('fs')
const express = require('express')
const React = require('react')
const ReactDOM = require('react-dom/server')
const ReactRouter = require('react-router')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-middleware')
const webpackConfig = require('./webpack.config.js')
const {ServerStyleSheet} = require('styled-components')
const routes = require('./routes').default

const app = express()
app.disable('x-powered-by')
app.use(webpackMiddleware(webpack(webpackConfig), {noInfo: true, stats: {warnings: false, chunks: false}}))
app.use(express.static('static'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript')
  fs.createReadStream(path.join(__dirname, 'sw.js')).pipe(res)
})

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

          const sheet = new ServerStyleSheet()
          const html = ReactDOM.renderToString(
            sheet.collectStyles(
              <ReactRouter.RouterContext
                {...renderProps}
                createElement={(Component, props) => {
                  const componentInitialPropsData = (data.find(x => x.name === Component.name) || {}).componentInitialPropsData
                  return (<Component {...props} {...componentInitialPropsData} />)
                }}
              />
            )
          )

          return res.render('index', Object.assign(
            {title: '', description: '', name: ''},
            data && data[0] && data[0].componentInitialPropsData,
            {
              html,
              css: sheet.getStyleTags(),
              initialPropsData: data,
            })
          )
        })
    } else {
      res.sendStatus(404)
    }
  })
})

module.exports = () => {
  let server = {}

  return {
    start: ({port, host}) => new Promise(resolve => server = app.listen(port, host, () => resolve({url: `http://${host}:${server.address().port}`}))),
    stop: () => new Promise(resolve => server.close(() => resolve())),
  }
}
