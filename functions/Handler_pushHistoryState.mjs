export default ( data = {}, documentTitle, path ) => {
  if ( typeof window !== 'undefined' ){
    window.history.pushState( data, documentTitle, path )
  }
}