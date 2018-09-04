import URLPattern from 'url-pattern'
import * as internalConstants from './constants.mjs'

export default ( { configuration, providerConfiguration, services, routesScheme, createRoutesScheme } ) => {

  try {
    const _routesScheme = routesScheme ? routesScheme : createRoutesScheme( { configuration: Object.assign( {}, configuration, internalConstants ), providerConfiguration, services } )

    if ( !Array.isArray( _routesScheme ) && typeof _routesScheme === 'object' && _routesScheme.component !== undefined ){
  
      let routesStructure = []

      recursive( routesStructure, _routesScheme, 0, '', [], [], [] )
 
      const sortedRoutesStructure = routesStructure

      const mappedSortedRoutesStructure = sortedRoutesStructure.map( routeObject => ( {
        ...routeObject,
        redirects: routeObject.redirect ? [ routeObject.redirect, ...routeObject.parentRedirects ] : [ ...routeObject.parentRedirects ],
        components: routeObject.component ? [ routeObject.component, ...routeObject.parentComponents ] : [ ...routeObject.parentComponents ]
      } ) )

      return mappedSortedRoutesStructure



    } else {
      return false
    }
    
  } catch ( error ) {
    throw error
  }
}


const recursive = ( routesStructure, root, _i, _path, parentPaths, parentComponents, parentRedirects ) => {

  if ( root !== undefined ){
    let _PATH = ''
    if ( root.path === '/' ){
      _PATH = _path
    } else if ( root.path ){
      _PATH = _path + '/' + root.path.replace( /[\/]/g, '' )
    } else if ( !root.path ){
      _PATH = _path
   
    } else {
      _PATH = _path
    }
   


    // if ( !root.component && !root.path ){
    //   routesStructure.push( {
    //     alias: root.alias,

    //     path: root.path,
    //     fullPath: _PATH,
    //     fullPathRegularExpression: root.alias === '*' || root.path === '*' ? new URLPattern( _PATH ) : new URLPattern( _PATH + '(/)(?*)' ),
        
    //     component: root.component,
    //     documentTitle: root.documentTitle,
        
    //     parentPaths,
    //     parentComponents,
    //     parentRedirects: root.redirect ? [ ...parentRedirects, root.redirect ] : parentRedirects
    //   } )

    // }

    if ( !root.component && !root.routes ) {

      routesStructure.push( {
        alias: root.alias,

        path: root.path,
        fullPath: _PATH,
        fullPathRegularExpression: root.alias === '*' || root.path === '*' ? new URLPattern( _PATH ) : new URLPattern( _PATH + '(/)(?*)' ),
        
        component: root.component,
        documentTitle: root.documentTitle,
        
        // parentPaths,
        // parentComponents,
        parentPaths: root.path ? [ ...parentPaths, root.path ] : parentPaths,
        parentComponents: [ ...parentComponents, root.component ],
        parentRedirects: root.redirect ? [ ...parentRedirects, root.redirect ] : parentRedirects
      } )

    } else if ( root.component && !root.routes ) {

      routesStructure.push( {
        alias: root.alias,

        path: root.path,
        fullPath: _PATH,
        fullPathRegularExpression: root.alias === '*' || root.path === '*' ? new URLPattern( _PATH ) : new URLPattern( _PATH + '(/)(?*)' ),
        
        component: root.component,
        documentTitle: root.documentTitle,
        
        // parentPaths: [ ...parentPaths, root.path ],
        // parentComponents: [ ...parentComponents, root.component ],
        // parentRedirects: root.redirect ? [ ...parentRedirects, root.redirect ] : parentRedirects
        parentPaths: [ ...parentPaths ],
        parentComponents: [ ...parentComponents ],
        parentRedirects: root.redirect ? [ ...parentRedirects ] : parentRedirects
      } )



    } else if ( root.component && root.routes ) {

      root.routes.map( ( r, i ) => {
     

        const _parentPaths = root.path ? [ ...parentPaths, root.path ] : parentPaths
        const _parentComponents = [ ...parentComponents, root.component ]
        const _parentRedirects = root.redirect ? [ ...parentRedirects, root.redirect ] : parentRedirects
        
        return recursive( routesStructure, r, _i + i, _PATH, _parentPaths, _parentComponents, _parentRedirects )
      } )
      
    }


  }
}