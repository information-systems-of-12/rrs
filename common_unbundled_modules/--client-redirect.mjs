import { dispatch } from './redirect-event-target.mjs';
import getPathnameAndQueryParameters from './--client-get-pathname-and-query-parameters.mjs';

/**
 * @param {string} path
 * @param {string} pathname
 */
export default async ( path ) => {
  const { pathname, queryParameters } = getPathnameAndQueryParameters( path );
  await dispatch( path, pathname, true );
};