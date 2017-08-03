process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
require('babel-polyfill')
require('isomorphic-fetch')

const IS_PROD = process.env.NODE_ENV === 'production'
const IS_BOWSER = process.env.BROWSER
const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const React = require('react')
const ReactDOM = require('react-dom/server')
const ReactRouter = require('react-router')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-middleware')
const webpackConfig = require('./webpack.config.js')
const {Helmet} = require('react-helmet')
const {ServerStyleSheet, StyleSheetManager} = require('styled-components')
const routes = require('./routes').default
const app = express()
const compiler = webpack(webpackConfig)

app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(compression())
app.use(webpackMiddleware(compiler, {noInfo: true, quiet: true}))
if(!IS_PROD) app.use(require('webpack-hot-middleware')(compiler, {noInfo: true, quiet: true}));
app.use(express.static('static'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript')
  fs.createReadStream(path.join(__dirname, 'sw.js')).pipe(res)
})

app.all('*', (req, res) => {
  const sheet = new ServerStyleSheet()

  ReactRouter.match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (redirectLocation) return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    if (err) return res.status(500).render('index', {title: '', description: '', name: '', IS_PROD, error: err, html: renderError(sheet, err), css: sheet.getStyleTags()})

    if (renderProps) {
      let statusCode = 200
      const promises = renderProps
        .components
        .filter(component => component.getInitialProps)
        .map(component => component.getInitialProps(req, res).then(x => ({name: component.name, componentInitialPropsData: x})))

      Promise.all(promises)
        .then(data => {
          if (res.headersSent) return
          if(!IS_BOWSER && !IS_PROD) Object.keys(require.cache).forEach(x => delete require.cache[x])

          const html = ReactDOM.renderToString(sheet.collectStyles(
              <ReactRouter.RouterContext
                {...renderProps}
                createElement={(Component, props) => {
                  statusCode = props.route.is404 ? 404 : 200
                  const componentInitialPropsData = (data.find(x => x.name === Component.name) || {}).componentInitialPropsData
                  return (<Component {...props} {...componentInitialPropsData} env={process.env} />)
                }}
              />
            )
          )
          const helmet = Helmet.renderStatic();
          return res.status(statusCode).render('index', Object.assign({
              helmet,
              html,
              IS_PROD,
              css: sheet.getStyleTags(),
              initialPropsData: data,
            })
          )
        })
        .catch(error => {
          error = error || new Error('Reunify - unknown server (e.g. getInitialProps) error.')
          console.error(`Reunify: ${error.message}\n${error.stack}`)
          return res.status(500).render('index', {title: '', description: '', name: '', IS_PROD, error: err, html: renderError(sheet, error), css: sheet.getStyleTags()})
        })
    } else {
      return res.status(404).render('index', {title: '', description: '', name: '', IS_PROD, html: renderNotFound(sheet), css: sheet.getStyleTags()})
    }
  })
})

function renderError(sheet, error) {
  let ErrorComponent = null
  try {
    ErrorComponent = require(`../../pages/Error`).default
  } catch(err) {
    ErrorComponent = require(`./pages/Error`).default
  }
  return ReactDOM.renderToString(sheet.collectStyles(<ErrorComponent error={error} />))
}

function renderNotFound(sheet) {
  let NotFoundComponent = null
  try {
    NotFoundComponent = require(`../../pages/NotFound`).default
  } catch(err) {
    NotFoundComponent = require(`./pages/NotFound`).default
  }
  return ReactDOM.renderToString(sheet.collectStyles(<NotFoundComponent />))
}

module.exports = () => {
  let server = {}

  return {
    start: ({port, host}) => new Promise(resolve => server = app.listen(port, host, () => resolve({url: `http://${host}:${server.address().port}`}))),
    stop: () => new Promise(resolve => server.close(() => resolve())),
  }
}
