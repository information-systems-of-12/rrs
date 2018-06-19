import * as React from 'react'
const createElement = React.default.createElement
const Component = React.default.Component

import * as CONSTANTS from './constants.mjs'
import getPathParameters from './get-path-parameters.mjs'


export default class Route extends Component {
  constructor( props ){
    super( props )
    this.state = {}
    this.handlePopState = this.handlePopState.bind( this )
  }

  componentDidMount(){
    this.props.registerRouteComponentInstance( this )
    window.addEventListener( 'popstate', this.handlePopState )
  }

  componentWillUnmount() {
    this.unregisterRouteComponentInstance( this )
    window.removeEventListener( 'popstate', this.handlePopState )
  }

  async handlePopState( e ){
    const nextState = {}
    nextState.matchResult = false

    const currentPath = typeof window === 'undefined' ? this.props.currentPath : window.location.pathname + window.location.search
    nextState.currentPath = currentPath
    const routeStructureCheckingResult = typeof window !== 'undefined' ? this.props.checkCurrentPathOnClient( this.props.routesStructure, currentPath ) : null

    if ( routeStructureCheckingResult && routeStructureCheckingResult.matchResult ){
      const { pathParameters, pathSearchParameters } = getPathParameters( routeStructureCheckingResult.matchResult )
      nextState.pathParameters = pathParameters
      nextState.pathSearchParameters = pathSearchParameters
    }

    if ( this.props.type === CONSTANTS.ROUTE_COMPONENT_TYPES.LAYOUT ){

      const p = typeof window !== 'undefined' ? window.location.pathname : currentPath
      if ( p.includes( this.props.path ) ){
        nextState.matchResult = true
      } else if ( nextProps.path === '' && nextProps.currentPath.startsWith( '/' ) ){
        nextState.matchResult = true
      }
    }

    if ( routeStructureCheckingResult && routeStructureCheckingResult.routeObject.fullPath === this.props.path && this.props.type === CONSTANTS.ROUTE_COMPONENT_TYPES.VIEW ){
      nextState.matchResult = true
    }
    this.setState( nextState )

  }


  static getDerivedStateFromProps( nextProps, prevState ){

    const nextState = {}
    nextState.matchResult = false
    
    const currentPath = typeof window === 'undefined' ? nextProps.currentPath : window.location.pathname + window.location.search
    nextState.currentPath = currentPath
    const routeStructureCheckingResult = typeof window !== 'undefined' ? nextProps.checkCurrentPathOnClient( nextProps.routesStructure, currentPath ) : null

   
    if ( routeStructureCheckingResult && routeStructureCheckingResult.matchResult ){
      const { pathParameters, pathSearchParameters } = getPathParameters( routeStructureCheckingResult.matchResult )
      nextState.pathParameters = pathParameters
      nextState.pathSearchParameters = pathSearchParameters
    }

    if ( nextProps.type === CONSTANTS.ROUTE_COMPONENT_TYPES.LAYOUT ){

      const p = typeof window !== 'undefined' ? window.location.pathname : currentPath
      if ( p.includes( nextProps.path ) ){
        nextState.matchResult = true
      } else if ( nextProps.path === '' && nextProps.currentPath.startsWith( '/' ) ){
        nextState.matchResult = true
      }
    } else {

      if ( typeof window === 'undefined' ){
        if ( nextProps.path === nextProps.routeObject.fullPath ){
          nextState.matchResult = true
        }
      }

    }

    if ( routeStructureCheckingResult && routeStructureCheckingResult.routeObject && routeStructureCheckingResult.routeObject.fullPath === nextProps.path && nextProps.type === CONSTANTS.ROUTE_COMPONENT_TYPES.VIEW ){
      nextState.matchResult = true
    }

    return nextState
  }


  shouldComponentUpdate( nextProps, nextState ){
    if ( nextState.matchResult && this.state.matchResult && this.props.type === CONSTANTS.ROUTE_COMPONENT_TYPES.LAYOUT ){
      return false
    }
    return true
  }


  render() {
    return this.state.matchResult
    
      ? createElement( this.props.component, {
          path: this.props.path,
          currentPath: this.state.currentPath,
          pathParameters: this.state.pathParameters,
          pathSearchParameters: this.state.pathSearchParameters,
          redirect: this.props.pushHistoryObject,
          setDocumentTitle: this.props.setDocumentTitle,
          services: this.props.services
        },
        this.props.children
      )

      : this.props.children
  }

}