import * as react from 'react';
const useEffect = react.default.useEffect;

import createRoutesComposition from './create-routes-composition.mjs';
import checkIsOnClient from './check-is-on-client.mjs';
import { addHandler } from './redirect-event-target.mjs';

import handlePopstateEvent from './handle-popstate-event.mjs';
import handleRedirectEvent from './handle-redirect-event.mjs';

const listenerId = 0;

const Handler = ( props ) => {
  // https://stackoverflow.com/questions/55573728/how-to-destroy-popstate-event-listener
  const _handlePopstateEvent = ( event ) => handlePopstateEvent( event, props.routesStructure );

  useEffect( () => {
    window.addEventListener( 'popstate', _handlePopstateEvent );
    return () => window.removeEventListener( 'popstate', _handlePopstateEvent );
  } );

  useEffect( () => {
    addHandler( listenerId, ( path, pathname ) => {
      handleRedirectEvent( props.routesStructure, path, pathname );
    } );
    return () => removeHandler( listenerId );
  } );

  const isOnClient = checkIsOnClient();
  return isOnClient === true
    ? createRoutesComposition( props.routesScheme, {
        path: props.path,
        pathname: props.pathname,
        queryParameters: props.queryParameters,
        routesStructure: props.routesStructure,
        routeObject: props.routeObject
      } )
    : props.children;
};

export default Handler;