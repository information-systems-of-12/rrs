import { ROUTE_COMPONENT_TYPES } from './constants.mjs'
import getPathParameters from './get-path-parameters.mjs'

export default parameters => {
  const { currentPath, path, pathRegexp, type, documentTitle } = parameters
  return true
}