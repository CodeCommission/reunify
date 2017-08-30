if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

import React from 'react'
import {Route, IndexRoute} from 'react-router'

export default (
  <Route
    path='/'
    getComponent={(location, cb) => {
      try {
        cb(null, require('../../pages/Layout').default)
      } catch(err) {
        if(err && err.message && err.message.indexOf('Cannot') !== -1) return cb(null, require('./pages/Layout').default)
        cb(err, require('./pages/Layout').default)
      }
    }}
    getChildRoutes={(location, cb) => {
      require.ensure([], require => {
        let pages = []

        if (!process.env.BROWSER) {
          const fs = require('fs')
          pages = fs.existsSync('../../pages') ? fs.readdirSync('../../pages') : fs.readdirSync('./pages')
        } else {
          try {
            pages = require.context('../../pages', true, /^(.*\.(js$))[^.]*$/igm).keys().map(x => x.replace('./', ''))
          } catch(err) {
            pages = require.context('./pages', true, /^(.*\.(js$))[^.]*$/igm).keys().map(x => x.replace('./', ''))
          }
        }

        cb(null, pages
          .map(x => x.replace('.js',''))
          .filter(x => x !== 'NotFound')
          .filter(x => x !== 'Error')
          .map(fileName => ({
            path: `${fileName.toLowerCase()}(/:param1)(/:param2)(/:param3)(/:param4)(/:param5)`,
            getComponent: (location, cb) => {
              try {
                cb(null, require(`../../pages/${fileName}`).default)
              } catch(err) {}
            },
          }))
          .concat([{
            path: '*',
            is404: true,
            getComponent: (location, cb) => {
              try {
                cb(null, require('../../pages/NotFound').default)
              } catch(err) {
                if(err && err.message && err.message.indexOf('Cannot') !== -1) return cb(null, require('./pages/NotFound').default)
                cb(err, require('./pages/NotFound').default)
              }
            },
          }])
        )
      })
    }}>
    <IndexRoute getComponent={(location, cb) => {
      try {
        cb(null, require('../../pages/Index').default)
      } catch(err) {
        if(err && err.message && err.message.indexOf('Cannot') !== -1) return cb(null, require('./pages/Index').default)
        cb(err, require('./pages/Index').default)
      }
    }} />
  </Route>
)