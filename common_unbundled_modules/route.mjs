import * as react from 'react';
const createElement = react.default.createElement;
const useState = react.default.useState;
const useEffect = react.default.useEffect;

import { ROUTE_COMPONENT_TYPES } from './constants.mjs';
import checkIsMatched from './check-is-matched.mjs';
import checkIsOnClient from './check-is-on-client.mjs';
import redirect from './--client-redirect.mjs';
import { getListenerId, addHandler, removeHandler } from './redirect-event-target.mjs';
import formatString from './format-string.mjs';

/**
 * 
 * @param {object} props
 * @param {object} props.routeObject
 * @param {string} props.path example - "/users?id=2"
 * @param {string} props.pathname example - "/users"
 */
const Route = ( props ) => {
  const isOnClient = checkIsOnClient();
  const [ path, setPath ] = useState( isOnClient ? window.location.pathname + window.location.search : props.path );
  const [ pathname, setPathname ] = useState( isOnClient ? formatString( window.location.pathname ) : props.pathname );
  const [ isMatched, setIsMatched ] = useState(
    props.type === ROUTE_COMPONENT_TYPES.LAYOUT
      ? props.pathname.startsWith( props._pathname )
      : checkIsMatched( props._pathname, pathname ) );
  const [ listenerId ] = useState( getListenerId() );

  useEffect( () => {
    addHandler( listenerId, ( __pathname ) => {
      // const isMatched = checkIsMatched( props._pathname, pathname )
      const isMatched = checkIsMatched( props._pathname, __pathname );;
      return setIsMatched( isMatched );
    } );
    return () => removeHandler( listenerId );
  }, [ isMatched ] );

  const options = {
    path,
    pathname,
    _pathname: props._pathname,
    queryParameters: props.queryParameters,
    redirect
  };
  return isMatched ? getElement( props, options ) : null;
};

export default Route;

const getElement = ( props, options ) => {
  const { parentComponent, component } = props;
  if ( parentComponent ) {
    return createElement( parentComponent, options,
      createElement( component, options,
        props.children
      )
    );
  };
  return createElement( component, options,
    props.children
  );
};