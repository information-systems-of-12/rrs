export default ( rootPath, _path ) => {
  if ( rootPath === '/' ){
    return _path;
  } else if ( rootPath ){
    return _path + '/' + rootPath.replace( /^[\/]+/g, '' ).replace( /[\/]+$/g, '' );
  } else if ( !rootPath ){
    return _path;
  };
  return _path || '';
};