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
    pathParameters,
    pathSearchParameters,
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
    pathParameters,
    pathSearchParameters,
    services,
    onPathChange,
    checkCurrentPathOnClient,
    routesStructure,
    pushHistoryObject,
    registerRouteComponentInstance,
    unregisterRouteComponentInstance,
    routeObject,
    configuration,
    providerConfiguration,
  }
  

  const formattedCurrentPath = path.replace( /[\/]+$/, '' )
  const _routesScheme = routesScheme ? routesScheme : createRoutesScheme( { configuration: Object.assign( {}, configuration, internalConstants ), providerConfiguration, services } )

  if ( !Array.isArray( _routesScheme ) && typeof _routesScheme === 'object' && _routesScheme.component !== undefined ){
    let routes = []
    const composition = recursive( formattedCurrentPath, _routesScheme, 0, '', additional )
    return composition
  }

}

const recursive = ( currentPath, root, _i, _path, additional, parentComponent ) => {

  if ( root !== undefined ){


    let _PATH = ''
    if ( root.path === '/' ){
      _PATH = _path
    } else if ( root.path ){
      _PATH = _path + '/' + root.path.replace( /^[\/]+/g, '' ).replace( /[\/]+$/g, '' )
      
    } else if ( !root.path ){
      _PATH = _path
    } else {
      _PATH = _path
    }
    
    
    
    // root.path === null

    // !root.routes
    // return root.component && ( root.routes || !root.routes ) && root.path !== null ? createElement( Route, {
    // // return root.component ? createElement( Route, {
    //     key: _i,
    //     alias: root.alias,
    //     component: root.component,
    //     path: _PATH,
    //     pathRegExp: _PATH_REG_EXP,
    //     currentPath,
    //     type: root.routes ? ROUTE_COMPONENT_TYPES.LAYOUT : ROUTE_COMPONENT_TYPES.VIEW,
    //     documentTitle: root.documentTitle,
    //     ...additional
    //   },

    //   root.routes ? root.routes.map( ( r, i ) => {
    //     return recursive( currentPath, r, _i + i, _PATH, additional )
    //   } ): null

    // ) : null



    // inside Route createElement( this.props.parentComponent, {},
    //  createElement( this.props.component )
    // )
    // createElement()




    // 2 not working
    // if ( root.component && root.path === null ){
    //   console.log( '1', root.alias )
    //   root.routes ? root.routes.map( ( r, i ) => {
    //     return recursive( currentPath, r, _i + i, _PATH, additional, root.component )
    //   } ) : null

    // } else if ( root.component && root.path !== null ){
    //     console.log( '2', root.alias )
    //     return createElement( Route, {
    //       // return root.component ? createElement( Route, {
    //       key: _i,
    //       alias: root.alias,
    //       parentComponent: parentComponent,
    //       component: root.component,
    //       path: _PATH,
    //       pathRegExp: _PATH_REG_EXP,
    //       currentPath,
    //       type: root.routes ? ROUTE_COMPONENT_TYPES.LAYOUT : ROUTE_COMPONENT_TYPES.VIEW,
    //       documentTitle: root.documentTitle,
    //       ...additional
    //     },

    //     root.routes ? root.routes.map( ( r, i ) => {
    //       return recursive( currentPath, r, _i + i, _PATH, additional )
    //     } ) : null
    //   )
      
    // } else {
    //   return null
    // }


      if ( root.component && ( root.path || !root.path ) ){
        
        return createElement( Route, {
          // return root.component ? createElement( Route, {
          key: _i,
          alias: root.alias,
          parentComponent: parentComponent,
          component: root.component,

          path: _PATH,
     
          fullPath: _PATH,
          fullPathRegularExpression: root.alias === '*' || root.path === '*' ? new URLPattern( _PATH ) : new URLPattern( _PATH + '(/)(?*)' ),

          currentPath,
          type: root.routes ? ROUTE_COMPONENT_TYPES.LAYOUT : ROUTE_COMPONENT_TYPES.VIEW,
          documentTitle: root.documentTitle,
          shouldComponentUpdateOnCurrentPathChange: root.shouldComponentUpdateOnCurrentPathChange === undefined || root.shouldComponentUpdateOnCurrentPathChange === null ? true : root.shouldComponentUpdateOnCurrentPathChange,
          ...additional
        },

        root.routes ? root.routes.map( ( r, i ) => {

          if ( r && !r.path && r.routes && r.component ) {
            return r.routes.map( ( dr, xi ) => {
              return recursive( currentPath, dr, _i + i + xi, _PATH, additional, r.component )
            } )
            
          } else {
            return recursive( currentPath, r, _i + i, _PATH, additional )
          }
          
        } ) : null
      )
      
    } else {
      return null
    }

  }
}