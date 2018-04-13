import getPathParameters from './getPathParameters.mjs'
import Updater from './Updater.mjs'
import * as React from 'react'
const createElement = React.default.createElement

export default ( props, state, redirectTo, changeDocumentTitle ) => {
  if ( typeof window === 'undefined' ){
    const routeObject = props.routeObject
    if ( routeObject !== null ){
      const path = props.path
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
    const routeObject = state.routeObject
    const path = state.path
    const matchResult = state.matchResult
    const { pathParameters, pathSearchParameters } = getPathParameters( props.matchResult )

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