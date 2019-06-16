import getPath from './get-path.mjs';

// [
//   {
//     alias: undefined,
//     _pathname: 'stage-1',
//     pathname: '/stage-1',
//     component: [Function: component],
//     documentTitle: undefined,
//     setDocumentTitle: undefined,
//     parentRedirects: [],
//     parentPathnames: [ '/' ],
//     parentComponents: [ [Function: default] ],
//     redirects: [],
//     components: [ [Function: component], [Function: default] ]
//   }
// ]

/**
 * plain structure for redirection check
 */
export default ( routesScheme ) => {
  try {
    if ( !Array.isArray( routesScheme ) && typeof routesScheme === 'object' && routesScheme.component !== undefined ){
      let routesStructure = [];
      recursive( routesStructure, routesScheme, 0, '', [], [], [] );
      const sortedRoutesStructure = routesStructure;

      const mappedSortedRoutesStructure = sortedRoutesStructure.map( routeObject => {
        let _parentRedirects = null;
        if ( routeObject.redirect ){
          _parentRedirects = Array.isArray( routeObject.redirect ) ? [ ...routeObject.parentRedirects, ...routeObject.redirect ] : [ ...routeObject.parentRedirects, routeObject.redirect ];
        } else {
          _parentRedirects = routeObject.parentRedirects;
        };

        return {
          ...routeObject,
          redirects: _parentRedirects,
          components: routeObject.component ? [ routeObject.component, ...routeObject.parentComponents ] : [ ...routeObject.parentComponents ]
        };
      } );
      return mappedSortedRoutesStructure;

    } else {
      return false;
    };

  } catch ( error ) {
    throw error;
  };
};


const recursive = ( routesStructure, root, _i, _pathname, parentPathnames, parentComponents, parentRedirects ) => {
  if ( root !== undefined ){
    let _PATHNAME = getPath( root.pathname, _pathname );
    let _parentRedirects = null;

    if ( root.redirect ){
      _parentRedirects = Array.isArray( root.redirect )
        ? [ ...parentRedirects, ...root.redirect ]
        : [ ...parentRedirects, root.redirect ];
    } else {
      _parentRedirects = parentRedirects;
    };

    const element = {
      alias: root.alias,
      _pathname: root.pathname,
      pathname: _PATHNAME,
      component: root.component,
      documentTitle: root.documentTitle,
      setDocumentTitle: root.setDocumentTitle,
      parentRedirects: _parentRedirects
    };

    if ( !root.component && !root.routes ) {
      routesStructure.push( {
        ...element,
        parentPathnames: root.pathname ? [ ...parentPathnames, root.pathname ] : parentPathnames,
        parentComponents: [ ...parentComponents, root.component ]
      } );

    } else if ( root.component && !root.routes ) {
      routesStructure.push( {
        ...element,
        parentPathnames: [ ...parentPathnames ],
        parentComponents: [ ...parentComponents ]
      } );

    } else if ( root.component && root.routes ) {
      root.routes.map( ( r, i ) => {
        const _parentPathnames = root.pathname ? [ ...parentPathnames, root.pathname ] : parentPathnames;
        const _parentComponents = [ ...parentComponents, root.component ];
        return recursive( routesStructure, r, _i + i, _PATHNAME, _parentPathnames, _parentComponents, _parentRedirects );
      } );
    };

  };
};