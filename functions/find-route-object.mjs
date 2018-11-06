import getMatchResult from './get-match-result.mjs'

export default ( routesStructure, currentPath ) => {

  const formattedCurrentPath = currentPath.replace( /[\/]+$/, '' )

  let matchResult = false
  const routeObject = routesStructure.find( ( route, index ) => {
    
    matchResult = getMatchResult( { routePathPattern: route.fullPathRegularExpression, nowRoutePath: formattedCurrentPath } )
 
    if ( matchResult ){
      return true
    }
  } ) || false
  
  return { matchResult, routeObject }

}