import checkIsMatched from './check-is-matched.mjs';

/**
 * @param routesStructure
 * @param path current path
 */
export default ( routesStructure, pathname ) => {
  const formattedPathname = pathname.replace( /[\/]+$/, '' );

  const routeObject = routesStructure.find( ( _routeObject, index ) => {
    const isMatched = checkIsMatched( _routeObject.pathname, formattedPathname );
    if ( isMatched ){
      return true;
    };
  } ) || null;

  return routeObject;
};