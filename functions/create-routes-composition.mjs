import URLPattern from 'url-pattern'
import * as internalConstants from './constants.mjs'

import * as React from 'react'
const createElement = React.default.createElement
const Component = React.default.Component

import Route from './route.mjs'


import { ROUTE_COMPONENT_TYPES } from './constants.mjs'

export default parameters => {

  const {
    configuration,
    providerConfiguration,
    routesScheme,
    createRoutesScheme,
    path,
    services,
    onPathChange,
    checkCurrentPathOnClient,
    pushHistoryObject,
    registerRouteComponentInstance,
    unregisterRouteComponentInstance,
    routesStructure,
    routeObject
  } = parameters


  
  const additional = {
    services,
    onPathChange,
    checkCurrentPathOnClient,
    routesStructure,
    pushHistoryObject,
    registerRouteComponentInstance,
    unregisterRouteComponentInstance,
    routeObject
  }

  const formattedCurrentPath = path.replace( /[\/]+$/, '' )
  const _routesScheme = routesScheme ? routesScheme : createRoutesScheme( Object.assign( {}, configuration, internalConstants ), providerConfiguration )

  if ( !Array.isArray( _routesScheme ) && typeof _routesScheme === 'object' && _routesScheme.component !== undefined ){
    let routes = []
    const composition = recursive( formattedCurrentPath, _routesScheme, 0, '', additional )
    return composition
  }

}

const recursive = ( currentPath, root, _i, _path, additional ) => {

  if ( root !== undefined ){
    let _PATH = ''
    if ( root.path === '/' ){
      _PATH = _path
    } else if ( root.path ){
      _PATH = _path + '/' + root.path.replace( /[\/]/g, '' )
    } else {
      _PATH = _path
    }
    

    const _PATH_REG_EXP = root.alias === '*' || root.path === '*' ? new URLPattern( _PATH ) : new URLPattern( _PATH + '(/)(?*)' )
    
    return root.component ? createElement( Route, {
        key: _i,
        alias: root.alias,
        component: root.component,
        path: _PATH,
        pathRegExp: _PATH_REG_EXP,
        currentPath,
        type: root.routes ? ROUTE_COMPONENT_TYPES.LAYOUT : ROUTE_COMPONENT_TYPES.VIEW,
        documentTitle: root.documentTitle,
        ...additional
      },

      root.routes ? root.routes.map( ( r, i ) => {
        return recursive( currentPath, r, _i + i, _PATH, additional )
      } ): null

    ) : null
  }
}