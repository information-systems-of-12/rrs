export default ( data = {}, documentTitle, path ) => {
  if ( typeof window !== 'undefined' ){
    history.pushState( data, documentTitle, path )
  }
}