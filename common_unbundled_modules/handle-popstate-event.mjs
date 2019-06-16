import handleRedirectEvent from './handle-redirect-event.mjs';

export default ( event, routesStructure ) => {
  // if (event.state) {
  //   // Without this - we'll loose titles on browser navigation
  //   window.document.title = event.state.title;
  // }
  const path = window.document.location.pathname + window.document.location.search;
  const pathname = window.document.location.pathname;
  handleRedirectEvent( routesStructure, path, pathname, true );
};