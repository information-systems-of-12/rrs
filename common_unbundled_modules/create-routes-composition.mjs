import * as react from 'react';
const createElement = react.default.createElement;

import { ROUTE_COMPONENT_TYPES } from './constants.mjs';

import Route from './route.mjs';
import getPath from './get-path.mjs';
import formatString from './format-string.mjs';

/**
 * @param {object} routesScheme
 * @param {object} options
 * @param {string} options.path
 * @param {string} options.pathname
 * @param {object} options.queryParameters
 * @param {object} options.routesStructure
 * @param {object} options.routesObject
 * @returns {object}
 */
export default ( routesScheme, options ) => {
  const {
    path, /* current path */
    pathname,
    queryParameters,

    onPathChange,
    checkCurrentPathOnClient,
    pushHistoryObject,
    registerRouteComponentInstance,
    unregisterRouteComponentInstance,

    routesStructure,
    routeObject

  } = options;

  const formattedCurrentPath = formatString( path );
  const formattedCurrentPathname = formatString( pathname );

  if ( !Array.isArray( routesScheme ) && typeof routesScheme === 'object' && routesScheme.component !== undefined ){
    let routes = [];
    const composition = recursive( formattedCurrentPath, routesScheme, 0, '', { 
      ...options, 
      path: formattedCurrentPath,
      pathname: formattedCurrentPathname
    } );
    return composition;
  };

};

const recursive = ( currentPath, root, _i, _path, additional, parentComponent ) => {
  if ( root !== undefined ){
    let _PATH = getPath( root.pathname, _path );
    if ( root.component && ( root.pathname || !root.pathname ) ){
      return createElement( Route, {
          key: _i,
          alias: root.alias,
          parentComponent: parentComponent,
          component: root.component,
          _pathname: _PATH,
          path: currentPath,
          pathname: additional.pathname,
          type: root.routes ? ROUTE_COMPONENT_TYPES.LAYOUT : ROUTE_COMPONENT_TYPES.VIEW,
          documentTitle: root.documentTitle,
          setDocumentTitle: root.setDocumentTitle,
          shouldComponentUpdateOnPathChange: root.shouldComponentUpdateOnPathChange === undefined || root.shouldComponentUpdateOnCurrentPathChange === null ? true : root.shouldComponentUpdateOnCurrentPathChange,
          ...additional
        },

        root.routes ? root.routes.map( ( r, i ) => {
          if ( r && !r.path && r.routes && r.component ) {
            return r.routes.map( ( dr, xi ) => {
              return recursive( currentPath, dr, _i + i + xi, _PATH, additional, r.component );
            } );
          } else {
            return recursive( currentPath, r, _i + i, _PATH, additional );
          };
        } ) : null
      );

    } else {
      return null;
    };

  };
};