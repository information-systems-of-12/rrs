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
    const routeStructureCheckingResult = typeof window !== 'undefined' ? this.props.checkCurrentPathOnClient( this.props.routesStructure, currentPath ) : null

    if ( routeStructureCheckingResult && routeStructureCheckingResult.matchResult ){
      const { pathParameters, pathSearchParameters } = getPathParameters( routeStructureCheckingResult.matchResult )
      nextState.pathParameters = pathParameters
      nextState.pathSearchParameters = pathSearchParameters
    }

    if ( this.props.type === CONSTANTS.ROUTE_COMPONENT_TYPES.LAYOUT ){
      // this.props.path, this.props.type
      // debugger
      const p = typeof window !== 'undefined' ? window.location.pathname : currentPath
      if ( p.includes( this.props.path ) ){
        nextState.matchResult = true
      } else if ( this.props.path === '' && this.props.currentPath.startsWith( '/' ) ){
        nextState.matchResult = true
      }
    }

    if ( routeStructureCheckingResult && routeStructureCheckingResult.routeObject.fullPath === this.props.path && this.props.type === CONSTANTS.ROUTE_COMPONENT_TYPES.VIEW ){
      nextState.matchResult = true
    }


    // if ( this.props.services && this.props.services.ISO12_RDMS && this.props.services.ISO12_RDMS.dataStateStorage ){
    //   // debugger
    //   const { currentPath: currentPathDS } = this.props.services.ISO12_RDMS.dataStateStorage.getDataState()
    //   if ( currentPathDS !== nextState.currentPath ){
    //     // debugger
    //     this.props.services.ISO12_RDMS.dataStateStorage.set( { currentPath: nextState.currentPath } )
    //   }
      
    // }
    // if ( this.props.alias === 'main-layout' ){
    //   debugger
    // }
    
    // this.props.path, this.props.alias, this.props.type
    // debugger
    this.setState( nextState )

  }


  static getDerivedStateFromProps( nextProps, prevState ){
    // debugger
    const nextState = {}
    nextState.matchResult = false
    
    const currentPath = typeof window === 'undefined' ? nextProps.currentPath : window.location.pathname + window.location.search
    nextState.currentPath = currentPath
    const routeStructureCheckingResult = typeof window !== 'undefined' ? nextProps.checkCurrentPathOnClient( nextProps.routesStructure, currentPath ) : null

    // debugger
    if ( routeStructureCheckingResult && routeStructureCheckingResult.matchResult ){
      const { pathParameters, pathSearchParameters } = getPathParameters( routeStructureCheckingResult.matchResult )
      nextState.pathParameters = pathParameters
      nextState.pathSearchParameters = pathSearchParameters
    }

    if ( nextProps.type === CONSTANTS.ROUTE_COMPONENT_TYPES.LAYOUT ){

      const p = typeof window !== 'undefined' ? window.location.pathname : currentPath
      if ( p.includes( nextProps.path ) ){
        // debugger
        nextState.matchResult = true
      } else if ( nextProps.path === '' && nextProps.currentPath.startsWith( '/' ) ){
        // debugger
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
    

    // if ( nextProps.alias === 'main-layout' ){
    //   debugger
    // }

    return nextState
  }


  shouldComponentUpdate( nextProps, nextState ){

    if ( this.props.type === CONSTANTS.ROUTE_COMPONENT_TYPES.LAYOUT && this.state.currentPath !== nextState.currentPath && this.props.shouldComponentUpdateOnCurrentPathChange === false ){
      return false
    }

    return true



    // debugger
    // if ( this.state.currentPath !== nextState.currentPath && this.state.shouldComponentUpdateOnCurrentPathChange === true ){
    //   // debugger
    //   return true
    // } else if ( this.state.currentPath !== nextState.currentPath && this.state.shouldComponentUpdateOnCurrentPathChange === false ){
    //   // debugger
    //   return false
    // }

    // return true
    // // if ( nextState.matchResult && this.state.matchResult && this.props.type === CONSTANTS.ROUTE_COMPONENT_TYPES.LAYOUT ){
    // if ( nextState.matchResult && this.state.matchResult && this.props.type === CONSTANTS.ROUTE_COMPONENT_TYPES.LAYOUT && this.props.shouldComponentUpdateOnCurrentPathChange === true ){
    //   // debugger
    //   // return false
    //   return true
    // }
    // // debugger
    // return true
  }


  render() {

    // if ( this.props.alias === 'main-layout' ){
    //   debugger
    // }

    // const mr = this.state.matchResult
    // const p = this.props.path
    // const type = this.props.type
    // debugger

    if ( this.state.matchResult ){
      if ( this.props.parentComponent ){
        // debugger
        return createElement( this.props.parentComponent, {
            path: this.props.path,
            currentPath: this.state.currentPath,
            pathParameters: this.state.pathParameters,
            pathSearchParameters: this.state.pathSearchParameters,
            redirect: this.props.pushHistoryObject,
            setDocumentTitle: this.props.setDocumentTitle,
            services: this.props.services,
            providerConfiguration: this.props.providerConfiguration
          }, 
            createElement( this.props.component, {
              path: this.props.path,
              currentPath: this.state.currentPath,
              pathParameters: this.state.pathParameters,
              pathSearchParameters: this.state.pathSearchParameters,
              redirect: this.props.pushHistoryObject,
              setDocumentTitle: this.props.setDocumentTitle,
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
          redirect: this.props.pushHistoryObject,
          setDocumentTitle: this.props.setDocumentTitle,
          services: this.props.services,
          providerConfiguration: this.props.providerConfiguration
        },
        this.props.children
      )
      }
    } else {
      return null
    }


  
  
  }

}