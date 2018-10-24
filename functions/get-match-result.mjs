export default ( { routePathPattern, nowRoutePath } ) => {
  try {
    return routePathPattern.match( nowRoutePath )
    
  } catch ( error ) {
    console.error( error )
  }
}