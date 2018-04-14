import * as React from 'react'
const Component = React.default.Component
const createElement = React.default.createElement
import { changePathToContext, redirectToContext, changeDocumentTitleContext } from './contexts.mjs'
import {
  MESSAGES,
  PREVIOUSLY_REQUESTED_PATH_KEY,
  DEFAULT_OBJECT_ALIASES,
  DEFAULT_ROUTE_PATHS,
  DEFAULT_VIEW_ALIASES,
  CONSTRUCTOR_NAME_OF_OBJECT_PROTOTYPES
} from './constants.mjs'
import createRoutesStructure from './createRoutesStructure.mjs'
import getPathParameters from './getPathParameters.mjs'
import preloadDataState from './preloadDataState.mjs'
import _constructComponentsHierarchy from './Handler_constructComponentsHierarchy.mjs'
import _checkPathOnClient from './Handler_checkPathOnClient.mjs'
import _pushHistoryState from './Handler_pushHistoryState.mjs'
import _updateDocumentTitle from './Handler_updateDocumentTitle.mjs'

export default class Handler extends Component {

  constructor( props ){
    super( props )
    this.state = {}
    this.state.path = null
    this.state.documentTitle = null
    this.state.routeObject = null
    this.state.matchResult = null
    if ( typeof window !== 'undefined' ){
      /*
      april 13, 2018 - modifications for using with iso12-rcss
      */
      this.state.routesStructure = props.routesStructure !== undefined ? props.routesStructure : createRoutesStructure( props.configuration, props.providerConfiguration, props.createRoutesScheme )
    }
    this.redirectTo = this.redirectTo.bind( this )
    this.changeDocumentTitle = this.changeDocumentTitle.bind( this )
    this.changePath = this.changePath.bind( this )
    this.checkPath = this.checkPath.bind( this )
  }

  render(){
    const componentsHierarchy = _constructComponentsHierarchy( this.props, this.state, this.redirectTo, this.changeDocumentTitle )
    return createElement( changePathToContext.Provider, { value: this.changePath }, 
      createElement( redirectToContext.Provider, { value: this.redirectTo },
        componentsHierarchy
      )
    )
  }

  static getDerivedStateFromProps( nextProps, currentState ){
    if ( typeof window !== 'undefined' ){

      const { path, routeObject, matchResult, documentTitle } = _checkPathOnClient( nextProps, currentState )
      const { pathParameters, pathSearchParameters } = getPathParameters( matchResult )
      preloadDataState( {
        ...nextProps,
        ...currentState,
        routeObject,
        path,
        pathParameters,
        pathSearchParameters,
        documentTitle
      } )

      const newStateKeyValues = { path, routeObject, matchResult, documentTitle }
      if ( currentState.isConstructed === false ){
        newStateKeyValues.isConstructed = true
      }
      return newStateKeyValues

    } else {
      return nextProps

    }
    
  }





  componentDidMount(){
    document.title = this.state.documentTitle
    const path = window.location.pathname + window.location.search
    if ( this.props.useOnPathChangeCallbackWhenComponentDidMount && this.props.useOnPathChangeCallbackWhenComponentDidMount === true ){
      this.changePath()
    }
    window.addEventListener( 'popstate', ( e ) => {
      this.checkPath()
    } )
  }



  redirectTo( path ){
    const newPath = path
    const currentPath = window.location.pathname + window.location.search
    if ( currentPath !== newPath ){
      _pushHistoryState( {}, null, newPath )
    }

    this.changePath()
  }


  changeDocumentTitle( documentTitle ){
    _updateDocumentTitle( documentTitle )
    this.setState( { documentTitle } )
  }


  async changePath(){
    if ( this.props.onPathChange !== undefined ){
      const C = Object.getPrototypeOf( this.props.onPathChange ).constructor.name
      if ( C === CONSTRUCTOR_NAME_OF_OBJECT_PROTOTYPES.FUNCTION || C === CONSTRUCTOR_NAME_OF_OBJECT_PROTOTYPES.ASYNC_FUNCTION ){
        return this.props.onPathChange( { 
          dataStateStorage: this.props.dataStateStorage,
          checkPath: async () => await this.checkPath(),
          redirectTo: this.redirectTo,
          configuration: this.props.configuration,
          providerConfiguration: this.props.providerConfiguration,
          sideActions: this.props.sideActions
        } )
      }
    } else {
      await this.checkPath()

    }

  }



  async checkPath(){
    const { path, routeObject, matchResult, documentTitle, isRedirected } = _checkPathOnClient( this.props, this.state )

    if ( isRedirected === true ){
      _pushHistoryState( {}, null, path )
      /*
       april 14, 2018 - fix: set right document title when redirect ( chrome only? )
      */
      _updateDocumentTitle( path )
    }
    _updateDocumentTitle( documentTitle )
    const { pathParameters, pathSearchParameters } = getPathParameters( matchResult )
    await preloadDataState( {
      ...this.props,
      ...this.state,
      routeObject,
      path,
      pathParameters,
      pathSearchParameters,
      documentTitle
    } )

    this.setState( { path, routeObject, matchResult, documentTitle } )

  }





 
}