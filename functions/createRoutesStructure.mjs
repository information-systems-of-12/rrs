import URLPattern from 'url-pattern'
import * as internalConstants from './constants.mjs'

export default ( configuration, providerConfiguration, createRoutesScheme ) => {

  try {

    const routesScheme = createRoutesScheme( Object.assign( {}, configuration, internalConstants ), providerConfiguration )

    if ( !Array.isArray( routesScheme ) && typeof routesScheme === 'object' && routesScheme.component !== undefined ){

      let parentPaths = [ '/' ]
      let parentComponents = []
      let parentRedirects = []
      let routes = []
      recursive( routesScheme, parentPaths, parentComponents, parentRedirects, routes, internalConstants )

      let routesStructure = []

      const sortedRoutes = routes.slice( 0 ).sort( ( a, b ) => b.parentPaths.length - a.parentPaths.length )
      
      for ( const route of sortedRoutes ){
        
        let clearParentPaths = []
        for ( const layoutPath of route.parentPaths ){
          if ( layoutPath !== '/' && layoutPath !== '' ){
            clearParentPaths.push( layoutPath.replace( /(^[\/]|[\/]$)/g, '' ) )
          }
        }
  
        const fullPath = '/' + clearParentPaths.join( '/' )
  
        let replacedFullPath = ''
        
        if ( route.alias === '*'  || route.path === '*' ){
          replacedFullPath = fullPath === '/' ?  '/*' : fullPath + '/*'
          
  
        } else {
          
          const replacedPath = route.path !== undefined ? route.path.replace( /^[\/]/g, '' ) : ''
  
          if ( fullPath === '/' ){
            replacedFullPath = fullPath + replacedPath
  
          } else {
            
            
            if ( replacedPath === '' ){
              replacedFullPath = fullPath
  
            } else {
              replacedFullPath = fullPath + '/' + replacedPath

            }
      
          }
        
        }
  
        
  
        let fullPathRegularExpression = null
  
        if ( route.alias === '*' || route.path === '*' ){
          fullPathRegularExpression = new URLPattern( replacedFullPath )

        } else { 
          fullPathRegularExpression = new URLPattern( replacedFullPath + '(/)(?*)' )

        }
        

        
  
        const _route = Object.assign( {}, {
          alias: route.alias === undefined ? '' : route.alias,
          path: route.path === undefined ? '' : route.path,
          fullPath: replacedFullPath,
          fullPathRegularExpression,
          documentTitle: route.documentTitle,
          redirects: route.redirect ? [ route.redirect, ...route.parentRedirects ] : [ ...route.parentRedirects ]
        } )

        _route.components = route.component ? [ route.component, ...route.parentComponents.reverse() ] : [ ...route.parentComponents.reverse() ]
 
        routesStructure.push( _route )
  
  
      }

      return routesStructure



    } else {
      return false
    }
    
  } catch ( error ) {
    throw error
  }
}


const recursive = ( root, parentPaths, parentComponents, parentRedirects, routes, configuration ) => {

  if ( root !== undefined ){

    if ( root.path !== undefined ) {
      
      parentPaths.push( root.path )
    }
    if ( root.component !== undefined ){
      parentComponents.push( root.component )
    }
    if ( root.redirect !== undefined && root.redirect !== null ){
      parentRedirects.push( root.redirect )
    }
    if ( root.views !== undefined ){


      // down if path constains parameter
      const sortedViews = root.views.slice( 0 ).sort( ( a, b ) => {
        if ( a.path && ( a.path.indexOf( ':' ) !== -1 ) ){
          return 1
        } else if ( a.alias === undefined ){
          return -1
        } else {
          return -1
        }
      } )

      // down if alias constains any sign *
      const sortedViews2 = sortedViews.slice( 0 ).sort( ( a, b ) => {
        if ( a.alias && ( a.alias.indexOf( '*' ) !== -1 ) ){
          return 1
        } else {
          return -1
        }
      } )

      for ( const vo of sortedViews2 ){

        if ( ( vo.component !== undefined && vo.component !== null ) || ( vo.component === undefined && vo.redirect !== undefined ) ){


          if ( vo.path === undefined && ( vo.alias === '*' || vo.path === '*' ) ){
            vo.path = '*'
          }

          const route = Object.assign( {}, vo )

          route.parentPaths = parentPaths.slice( 0 )
          route.parentComponents = parentComponents.slice( 0 )
          route.parentRedirects = []


          for ( const redirect of parentRedirects ){
            if ( redirect.notForAliases ){

              const fr = redirect.notForAliases.find( r => r === route.alias )

              if ( !fr ){
                route.parentRedirects.push( redirect )
              }

            } else {
              route.parentRedirects.push( redirect )
            }
          }
          
          routes.push( route )
        }
      }
    }


    if ( root.layouts !== undefined ){
      for ( const lo of root.layouts ){
        recursive( lo, parentPaths, parentComponents, parentRedirects, routes, configuration )
      }
      
    }

    parentPaths.splice( -1, 1 )
    parentComponents.splice( -1, 1 )
    parentRedirects.splice( -1, 1 )


  }
  

}