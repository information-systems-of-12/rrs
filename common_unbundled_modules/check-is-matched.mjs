export default ( routeObjectPathname, pathname ) => {
  if ( pathname.startsWith( routeObjectPathname ) || routeObjectPathname === pathname ) {
    return true;
  }
  return false;
};