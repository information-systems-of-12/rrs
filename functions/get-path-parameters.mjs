import querystring from 'querystring'

export default matchResult => {

  if ( matchResult ){
    const pathParameters = Object.assign( {}, matchResult )
    delete pathParameters._
    // const pathSearchParameters = matchResult._ && matchResult._.contains( '?' ) ? querystring.parse( matchResult._.replace( /^\?/, '' ) ) : null
    // const string = matchResult._.split( '?' )[ 2 ]
    // const pathSearchParameters = matchResult._ && matchResult._.includes( '?' ) ? querystring.parse( string ) : {}
    const pathSearchParameters = matchResult._ ? querystring.parse( matchResult._ ) : {}
    // debugger
    return { pathParameters, pathSearchParameters }

  } else {
    // return { pathParameters: false, pathSearchParameters: false }
    return { pathParameters: {}, pathSearchParameters: {} }
    
  }

}