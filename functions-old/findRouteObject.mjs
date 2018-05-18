import getMatchResult from './getMatchResult.mjs'

export default ( routesStructure, path ) => {
  
  let matchResult = false
  const routeObject = routesStructure.find( ( route, index ) => {
    matchResult = getMatchResult( { routePathPattern: route.fullPathRegularExpression, nowRoutePath: path } )
    if ( matchResult ){
      return true
    }
  } ) || false
  
  return { matchResult, routeObject }

}