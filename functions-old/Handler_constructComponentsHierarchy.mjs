import getPathParameters from './getPathParameters.mjs'
import Updater from './Updater.mjs'
import * as React from 'react'
const createElement = React.default.createElement

export default ( props, state, redirectTo, changeDocumentTitle ) => {

  if ( typeof window === 'undefined' ){

    if ( props.routeObject !== null ){
      const { pathParameters, pathSearchParameters } = getPathParameters( props.matchResult )
      const componentsHierarchy = createElement( Updater, { 
        ...props,
        pathParameters,
        pathSearchParameters,
        redirectTo,
        changeDocumentTitle
      } )
      return componentsHierarchy
    }

  } else {

    const { pathParameters, pathSearchParameters } = getPathParameters( state.matchResult )
    const componentsHierarchy = createElement( Updater, { 
      ...props,
      ...state,
      pathParameters,
      pathSearchParameters,
      redirectTo,
      changeDocumentTitle
    } )

    return componentsHierarchy

  }

}