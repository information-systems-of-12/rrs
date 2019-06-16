import checkIsMatched from './check-is-matched.mjs';
import findRouteObject from './find-route-object.mjs';

/**
 * todo - check recursive redirection
 * @returns { { path: string, pathname: string, routeObject: object } | null }
 */
const checkRedirection = ( routesStructure, routeObject ) => {
  if ( routeObject && routeObject.checkRedirection ) {
    const result = getRedirectionResult( routeObject.checkRedirection );
    if ( result !== null ) {
      /**
       * find if routeObject in structure
       */
      const _routeObject = findRouteObject( routesStructure, result.pathname );
      if ( _routeObject ){
        const _result = checkRedirection( routesStructure, _routeObject );
        if ( _result ) {
          return { ..._result, routeObject: _routeObject };
        };
        return { ...result, routeObject: _routeObject };
      };
    };
  };
  return null;
};
export default checkRedirection;

/**
 * @typedef Result
 * @type {object|null}
 * @property {string} path
 * @property {string} pathname
 */

 /**
  * 
  * @returns {Result}
  */
const getRedirectionResult = ( checkRedirection ) => {
  if ( Array.isArray( checkRedirection ) ) {
    for ( const _checkRedirection of checkRedirection ) {
      const result = _checkRedirection();
      if ( result ) {
        return result;
      };
    };
  };

  const result = checkRedirection();
  if ( result ) {
    return result;
  };

  return null;
};