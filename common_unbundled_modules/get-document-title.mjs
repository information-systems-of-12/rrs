export default ( routeObject, queryParameters ) => {
  if ( routeObject.setDocumentTitle ) {
    return routeObject.setDocumentTitle( queryParameters );
  }
  return routeObject.documentTitle;
};