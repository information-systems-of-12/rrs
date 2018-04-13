import getMatchResult from './getMatchResult.mjs'
import findRouteObject from './findRouteObject.mjs'

export default ( routesStructure, dataStateStorage, routeObject ) => {

  let redirectToPath = false

  if ( routeObject.redirects ){
    for ( const redirect of routeObject.redirects ){

      if ( Array.isArray( redirect ) ){
        for ( const ro of redirect ){
          /**
          @param { function } ro.if - callback - predicate
          @param { string } ro.toPath - redirection path
          **/
          if ( ro.if && Object.prototype.toString.call( ro.if ) == '[object Function]' ){
            const result = ro.if( dataStateStorage.getDataState() )
  
            if ( result === true ){
              redirectToPath = ro.toPath
              break
            }
  
          } else {
            redirectToPath = ro.toPath
            break
          }
        }
        
      } else {
        /**
        @param { function } redirect.if - callback - predicate
        @param { string } redirect.toPath - redirection path
        **/
        if ( redirect.if && Object.prototype.toString.call( redirect.if ) == '[object Function]' ){
          const result = redirect.if( dataStateStorage.getDataState() )

          if ( result === true ){
            redirectToPath = redirect.toPath
            break
          }

        } else {
          redirectToPath = redirect.toPath
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