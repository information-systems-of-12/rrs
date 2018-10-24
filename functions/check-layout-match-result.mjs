import getMatchResult from './get-match-result.mjs'

/*
18-10-18
parameters in layout paths
*/
export default ( { path, currentPath } ) => {
  
  const _SPLIT_CURRENT_PATH = currentPath !== undefined ? currentPath.split( '/' ) : []
  const _SPLIT_PATH = path !== undefined ? path.split( '/' ) : []

  const SPLIT_CURRENT_PATH = _SPLIT_CURRENT_PATH.filter( p => p !== '' )
  const SPLIT_PATH = _SPLIT_PATH.filter( p => p !== '' )


  const SPLIT_CURRENT_PATH_ITERATOR = SPLIT_CURRENT_PATH.entries()
  const SPLIT_PATH_ITERATOR = SPLIT_PATH.entries()
  
  const RESULT = []


  for ( const [ key, value ] of SPLIT_PATH_ITERATOR ){

    const PATTERN_MATCH_RESULT = getMatchResult( { routePathPattern: SPLIT_PATH[ key ], nowRoutePath: SPLIT_CURRENT_PATH[ key ] } )
    const PATTERN = SPLIT_PATH[ key ].startsWith( ':' ) && PATTERN_MATCH_RESULT === null ? true : false
 
    if (
      SPLIT_PATH[ key ] === SPLIT_CURRENT_PATH[ key ]
      ||
      PATTERN === true
    ){
      RESULT.push( true )
    } else {
      RESULT.push( false )
    }
  }


  const MATCH_RESULT = RESULT.some( r => r === false ) === true ? false : true
  
  return MATCH_RESULT


}