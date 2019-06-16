export default ( routeObject, queryParameters ) => {
  window.document.title = getDocumentTitle( routeObject, queryParameters );
};