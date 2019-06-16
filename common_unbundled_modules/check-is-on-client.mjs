export default () => {
  if ( typeof window !== 'undefined' ) {
    return true; 
  };
  return false;
};