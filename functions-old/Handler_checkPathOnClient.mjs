import { MESSAGES, PREVIOUSLY_REQUESTED_PATH_KEY } from './constants.mjs'
import findRouteObject from './findRouteObject.mjs'
import checkIfRedirect from './checkIfRedirect.mjs'

export default ( props, state, redirectTo ) => {
  const path = window.location.pathname + window.location.search
  const { onPathChange, dataStateStorage } = props

  /*
  april 13, 2018 - modifications for using with iso12-rcss
  */
  const findRouteObjectResult = state.isConstructed === false && props.routeObject && props.matchResult ? { routeObject: props.routeObject, matchResult: props.matchResult } : findRouteObject( state.routesStructure, path )

  const routeObject = findRouteObjectResult.routeObject
  const matchResult = findRouteObjectResult.matchResult

  // current route
  if ( routeObject ){
    const s = dataStateStorage.getDataState()
    const findRouteObjectResult2 = checkIfRedirect( state.routesStructure, dataStateStorage, routeObject )
    const routeObject2 = findRouteObjectResult2.routeObject
    const matchResult2 = findRouteObjectResult2.matchResult

    // redirected route
    if ( routeObject2 ){

      let previouslyRequestedURL = null
      const previouslyRequestedURLQueryFieldIndex = path.indexOf( PREVIOUSLY_REQUESTED_PATH_KEY )
      if ( previouslyRequestedURLQueryFieldIndex != -1 ){
        previouslyRequestedURL = path.slice( previouslyRequestedURLQueryFieldIndex + PREVIOUSLY_REQUESTED_PATH_KEY.length )
      }

      if ( previouslyRequestedURL ){
        const findRouteObjectResult3 = findRouteObject( state.routesStructure, previouslyRequestedURL )
        const routeObject3 = findRouteObjectResult3.routeObject
        const matchResult3 = findRouteObjectResult3.matchResult

        // previously requested route before redirect
        if ( routeObject3 ){
          return { path: previouslyRequestedURL, routeObject: routeObject3, matchResult: matchResult3, documentTitle: routeObject3.documentTitle, isRedirected: true }

        } else {
          return { path: routeObject2.fullPath, routeObject: routeObject2, matchResult: matchResult2, documentTitle: routeObject2.documentTitle, isRedirected: true }

        }

      } else {
        return { path: routeObject2.fullPath, routeObject: routeObject2, matchResult: matchResult2, documentTitle: routeObject2.documentTitle, isRedirected: true }

      }
    } else {
      return { path: path, routeObject: routeObject, matchResult: matchResult, documentTitle: routeObject.documentTitle, isRedirected: false }

    }
    
  } else {
    return { path: null, routeObject: null, matchResult: null, documentTitle: MESSAGES.COMPONENTS_NOT_FOUND, isRedirected: true }
    
  }

}