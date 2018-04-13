import getPathParameters from './getPathParameters.mjs'
import * as internalConstants from './constants.mjs'

export default async parameters => {
  
  try {
    
    const {

      configuration,
      providerConfiguration,
      dataStateStorage,
      path,

      //
      pathParameters,
      pathSearchParameters,
      //

      routeObject,
      matchResult,
      sideActions
  
    } = parameters
  


    const preloadDataStateMethods = []
    
    for ( const c of routeObject.components ){

      if ( c && c.preloadDataState ){
        preloadDataStateMethods.push( c.preloadDataState )

      } else if ( c && c.WrappedComponent && c.WrappedComponent.preloadDataState && Object.prototype.toString.call( c.WrappedComponent.preloadDataState === internalConstants.OBJECT_PROTOTYPES.ASYNC_FUNCTION ) ){
        preloadDataStateMethods.push( c.WrappedComponent.preloadDataState )

      }

    }

    await Promise.all( preloadDataStateMethods.map( async method => await method( {
        configuration,
        providerConfiguration,
        dataStateStorage,
        routeObject,
        path,
        pathParameters,
        pathSearchParameters,
        sideActions
      } ) 
    ) )

    

  } catch ( error ) {
    throw error


  }

}