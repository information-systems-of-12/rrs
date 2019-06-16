let listenerIdCounter = 0;
const handlers = {};

export const getListenerId = () => {
  listenerIdCounter = listenerIdCounter + 1;
  return listenerIdCounter;
};

export const addHandler = ( listenerId, handle ) => {
  handlers[ listenerId ] = handle;
  return true;
};

export const removeHandler = ( listenerId ) => {
  delete handlers[ listenerId ];
  return true;
};

/**
 * with toHandler = true, if calling client redirection -> then handle event on Handler component (one times)

 */
export const dispatch = async ( path, pathname, toHandler ) => {
  // if ( ( window.location.pathname + window.location.search ) === path ) {
  //   return false;
  // };

  if ( toHandler ) {
    if ( handlers[ '0' ] ) {
      await handlers[ '0' ]( path, pathname );
    };

  } else {
    for ( const listenerId of Object.keys( handlers ).reverse() ) {
      if ( listenerId !== '0' ) {
        handlers[ listenerId ]( pathname );
      };
    };
  };

  return true;
};