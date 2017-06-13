if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

import React from 'react'
import {Route, IndexRoute} from 'react-router'

export default (
  <Route
    path="/"
    getComponent={(location, cb) => {
      try {
        delete require.cache[require.resolve('../../pages/Layout')]
        cb(null, require('../../pages/Layout').default)
      } catch(err) {
        delete require.cache[require.resolve('./pages/Layout')]
        cb(null, require('./pages/Layout').default)
      }
    }}
    getChildRoutes={(location, cb) => {
      require.ensure([], require => {
        let pages
        if (!process.env.BROWSER) { // node context
          const fs = require('fs')
          pages = fs.existsSync('../../pages') ? fs.readdirSync('../../pages') : fs.readdirSync('./pages')
        } else { // browser context
          try {
            pages = require.context('../../pages', true, /^(.*\.(js$))[^.]*$/igm).keys().map(x => x.replace('./', ''))
          } catch(err) {
            pages = require.context('./pages', true, /^(.*\.(js$))[^.]*$/igm).keys().map(x => x.replace('./', ''))
          }
        }

        cb(null, pages
          .map(x => x.replace('.js',''))
          .filter(x => x !== 'Index')
          .filter(x => x !== 'Layout')
          .filter(x => x !== 'NotFound')
          .map(fileName => {
            try {
              delete require.cache[require.resolve(`../../pages/${fileName}`)]
            } catch(err){
              delete require.cache[require.resolve(`./pages/${fileName}`)]
            }
            return fileName
          })
          .map(fileName => ({
            path: fileName.toLowerCase(),
            getComponent: (location, cb) => {
              try {
                const modRef = require(`../../pages/${fileName}`).default
                cb(null, modRef)
              } catch(err) {
                const modRef = require(`./pages/${fileName}`).default
                cb(null, modRef)
              }
            }
          })).concat([{
            path: '*',
            component: require('./pages/NotFound').default,
          }])
        )

      })
    }}>
    <IndexRoute getComponent={(location, cb) => {
      try {
        delete require.cache[require.resolve('../../pages/Index')]
        cb(null, require('../../pages/Index').default)
      } catch(err) {
        delete require.cache[require.resolve('./pages/Index')]
        cb(null, require('./pages/Index').default)
      }
    }} />
  </Route>
)
