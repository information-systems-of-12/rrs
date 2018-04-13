import querystring from 'querystring'

export default matchResult => {

  if ( matchResult ){
    const pathParameters = Object.assign( {}, matchResult )
    delete pathParameters._
    const pathSearchParameters = matchResult._ ? querystring.parse( matchResult._.replace( /^\?/, '' ) ) : null
    return { pathParameters, pathSearchParameters }

  } else {
    return { pathParameters: false, pathSearchParameters: false }
    
  }

}