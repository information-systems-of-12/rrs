import getMatchResult from './get-match-result.mjs'
import findRouteObject from './find-route-object.mjs'

export default ( { configuration, providerConfiguration, routesStructure, routeObject, services } ) => {

  let redirectToPath = false


  if ( routeObject.redirects ){


    for ( const redirect of routeObject.redirects ){


      if ( Array.isArray( redirect ) ){
        for ( const ro of redirect ){

          /**
          @param { function } ro.if - callback - predicate
          @param { string } ro.path - redirection path
          **/
          if ( ro.if && Object.prototype.toString.call( ro.if ) == '[object Function]' ){
            
            const result = ro.if( { configuration, providerConfiguration, routesStructure, routeObject, services } )
            
            if ( result === true ){
              redirectToPath = ro.path
              break
            }
  
          } else {
            redirectToPath = ro.path
            break
          }
        }
        
      } else {


        /**
        @param { function } redirect.if - callback - predicate
        @param { string } redirect.path - redirection path
        **/
        if ( redirect.if && Object.prototype.toString.call( redirect.if ) == '[object Function]' ){

          const result = redirect.if( { configuration, providerConfiguration, routesStructure, routeObject, services } )

          if ( result === true ){
            redirectToPath = redirect.path
            break
          }

        } else {
          redirectToPath = redirect.path
          break
          
        }

      }

    }
  }


  if ( redirectToPath ){
    const findRouteObjectResult = findRouteObject( routesStructure, redirectToPath )
  
    const routeObject2 = findRouteObjectResult.routeObject
    if ( routeObject2 ){
      return findRouteObjectResult
      
    }

  } else {
    return false

  }



}