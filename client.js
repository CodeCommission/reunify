import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory } from 'react-router'
import routes from './routes'

const { pathname, search, hash } = window.location
const location = `${pathname}${search}${hash}`

match({ routes, location }, () => {
  render(<Router routes={routes} history={browserHistory} createElement={handleCreateElement}/>, document.getElementById('app'))
})

function handleCreateElement (Component, props) {
  if (!Component.hasOwnProperty('getInitialProps')) return <Component {...props} />

  let initialPropsData = null
  let componentInitialPropsData = {}
  try {
    initialPropsData = JSON.parse(document.getElementById('initialPropsData').textContent)
    componentInitialPropsData = (initialPropsData.find(x => x.name === Component.name) || {}).componentInitialPropsData
  } catch(e) {}
  return <Component {...componentInitialPropsData} {...props}/>
}

if(process.env.NODE_ENV !== 'production') {
  console.log('Development environment: ServiceWorker is disabled.')
} else if (!('serviceWorker' in navigator)) {
  console.error('ServiceWorker is not supported.')
} else {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js')
  .then(registration => console.log('ServiceWorker registration successful with scope: ', registration.scope), err => console.log('ServiceWorker registration failed: ', err))
  .catch(console.error))
}