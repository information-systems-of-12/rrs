import { dispatch } from './redirect-event-target.mjs';
import findRouteObject from './find-route-object.mjs';
import checkRedirection from './check-redirection.mjs';
import getDocumentTitle from './get-document-title.mjs';

export default async ( routesStructure, path, pathname, fromPopstateEventHandler = false ) => {
  const routeObject = findRouteObject( routesStructure, pathname );
  const redirectionResult = checkRedirection( routesStructure, routeObject );

  if ( redirectionResult ) {
    const documentTitle = getDocumentTitle( redirectionResult.routeObject );
    window.history.pushState( {}, documentTitle, redirectionResult.path );
    window.document.title = documentTitle;

// dispatch to route components
// await handleBeforePathChangeEvent();
    await dispatch( null, redirectionResult.pathname, false );
// await handleAfterPathChangeEvent();

  } else if ( routeObject ) {
    const documentTitle = getDocumentTitle( routeObject );
    window.document.title = documentTitle;

    if ( fromPopstateEventHandler === false ) {
      window.history.pushState( {}, documentTitle, path );
    }
// dispatch to route components
// await handleBeforePathChangeEvent();
    await dispatch( null, pathname, false );
// await handleAfterPathChangeEvent();

  };
  window.scrollTo( 0, 0 );
}