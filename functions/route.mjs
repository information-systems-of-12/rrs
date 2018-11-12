import * as React from 'react'
const createElement = React.default.createElement
const Component = React.default.Component

import * as CONSTANTS from './constants.mjs'
import getPathParameters from './get-path-parameters.mjs'

import checkLayoutMatchResult from './check-layout-match-result.mjs'



export default class Route extends Component {
  constructor( props ){
    super( props )
    this.state = {}
    this.handlePopState = this.handlePopState.bind( this )
  }

  componentDidMount(){ 
    window.addEventListener( 'popstate', this.handlePopState )
    this.props.registerRouteComponentInstance( this )
  }

  componentWillUnmount() {
    this.props.unregisterRouteComponentInstance( this )
    window.removeEventListener( 'popstate', this.handlePopState )
  }

  async handlePopState( e ){
    const nextState = {}
    nextState.matchResult = false

    const currentPath = typeof window === 'undefined' ? this.props.currentPath : window.location.pathname + window.location.search
    nextState.currentPath = currentPath

    const thisRouteObject = {
      path: this.props.path,
      type: this.props.type
    }

    const routeStructureCheckingResult = typeof window !== 'undefined' ? this.props.checkCurrentPathOnClient( this.props.routesStructure, currentPath, thisRouteObject ) : null

    if ( routeStructureCheckingResult && routeStructureCheckingResult.isRedirected ){
      this.props.pushHistoryObject( routeStructureCheckingResult.path, thisRouteObject )

    } else if ( routeStructureCheckingResult && routeStructureCheckingResult.matchResult ){
      const { pathParameters, pathSearchParameters } = getPathParameters( routeStructureCheckingResult.matchResult )
      nextState.pathParameters = pathParameters
      nextState.pathSearchParameters = pathSearchParameters
    }

    if ( this.props.type === CONSTANTS.ROUTE_COMPONENT_TYPES.LAYOUT ){
      const LMR = checkLayoutMatchResult( { path: this.props.path, currentPath: currentPath } )
      nextState.matchResult = LMR

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

    const thisRouteObject = {
      path: nextProps.path,
      type: nextProps.type
    }

    const routeStructureCheckingResult = typeof window !== 'undefined' ? nextProps.checkCurrentPathOnClient( nextProps.routesStructure, currentPath, thisRouteObject ) : null
    
    if ( routeStructureCheckingResult && routeStructureCheckingResult.isRedirected ){
      nextProps.pushHistoryObject( routeStructureCheckingResult.path, thisRouteObject )

    } else if ( routeStructureCheckingResult && routeStructureCheckingResult.matchResult ){
      const { pathParameters, pathSearchParameters } = getPathParameters( routeStructureCheckingResult.matchResult )
      nextState.pathParameters = pathParameters
      nextState.pathSearchParameters = pathSearchParameters
      
    }

    if ( nextProps.type === CONSTANTS.ROUTE_COMPONENT_TYPES.LAYOUT ){
      const LMR = checkLayoutMatchResult( { path: nextProps.path, currentPath: currentPath } )
      nextState.matchResult = LMR


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
    if ( this.props.type === CONSTANTS.ROUTE_COMPONENT_TYPES.LAYOUT && this.state.currentPath !== nextState.currentPath && this.props.shouldComponentUpdateOnCurrentPathChange === false ){
      return false
    }

    return true

  }


  render() {

    const thisRouteObject = {
      path: this.props.path,
      type: this.props.type
    }

    if ( this.state.matchResult ){
      if ( this.props.parentComponent ){
        // debugger
        return createElement( this.props.parentComponent, {
            path: this.props.path,
            currentPath: this.state.currentPath,
            pathParameters: this.state.pathParameters,
            pathSearchParameters: this.state.pathSearchParameters,
            redirect: path => this.props.pushHistoryObject( path, thisRouteObject ),
            // setDocumentTitle: this.props.setDocumentTitle,
            services: this.props.services,
            providerConfiguration: this.props.providerConfiguration
          }, 
            createElement( this.props.component, {
              path: this.props.path,
              currentPath: this.state.currentPath,
              pathParameters: this.state.pathParameters,
              pathSearchParameters: this.state.pathSearchParameters,
              redirect: path => this.props.pushHistoryObject( path, thisRouteObject ),
              // setDocumentTitle: this.props.setDocumentTitle,
              services: this.props.services,
              providerConfiguration: this.props.providerConfiguration
            },
            this.props.children
          )
        )
      } else {

        // debugger
        return createElement( this.props.component, {
          path: this.props.path,
          currentPath: this.state.currentPath,
          pathParameters: this.state.pathParameters,
          pathSearchParameters: this.state.pathSearchParameters,
          redirect: path => this.props.pushHistoryObject( path, thisRouteObject ),
          // setDocumentTitle: this.props.setDocumentTitle,
          services: this.props.services,
          providerConfiguration: this.props.providerConfiguration
        },
        this.props.children
      )
      }
    } else {
      // debugger
      return null
    }


  
  
  }

}