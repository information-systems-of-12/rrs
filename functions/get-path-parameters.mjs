import querystring from 'querystring'

export default matchResult => {

  if ( matchResult ){
    const pathParameters = Object.assign( {}, matchResult )
    delete pathParameters._
    // const pathSearchParameters = matchResult._ && matchResult._.contains( '?' ) ? querystring.parse( matchResult._.replace( /^\?/, '' ) ) : null
    const pathSearchParameters = matchResult._ && matchResult._.includes( '?' ) ? querystring.parse( matchResult._.split( '?' )[ 2 ] ) : {}

    return { pathParameters, pathSearchParameters }

  } else {
    // return { pathParameters: false, pathSearchParameters: false }
    return { pathParameters: {}, pathSearchParameters: {} }
    
  }

}