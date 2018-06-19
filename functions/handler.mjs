import * as React from 'react'
const Component = React.default.Component
const createElement = React.default.createElement

import { MESSAGES, PREVIOUSLY_REQUESTED_PATH_KEY } from './constants.mjs'
import findRouteObject from './find-route-object.mjs'
import checkIfRedirect from './check-if-redirect.mjs'

import getPathParameters from './get-path-parameters.mjs'
import createRoutesComposition from './create-routes-composition.mjs'
import createRoutesStructure from './create-routes-structure.mjs'

export default class Handler extends Component {

  constructor( props ){
    super( props )
    this.routeComponentInstances = []

    this.registerRouteComponentInstance = this.registerRouteComponentInstance.bind( this )
    this.unregisterRouteComponentInstance = this.unregisterRouteComponentInstance.bind( this )

    this.checkCurrentPathOnClient = this.checkCurrentPathOnClient.bind( this )
    this.pushHistoryObject = this.pushHistoryObject.bind( this )

    this.handlePopState = this.handlePopState.bind( this )

    if ( typeof window !== 'undefined' ){
      this.routesStructure = props.routesStructure !== undefined
      ? props.routesStructure
      : createRoutesStructure( props.configuration, props.providerConfiguration, null, props.createRoutesScheme )
    }
    
  }

  render(){

    return typeof window !== 'undefined'
      ? createRoutesComposition( { 
        configuration: this.props.configuration,
        providerConfiguration: this.props.providerConfiguration, 
        routesScheme: null,
        createRoutesScheme: this.props.createRoutesScheme,
        path: this.props.path,
        services: this.props.services,
        onPathChange: this.props.onPathChange,
        checkCurrentPathOnClient: this.checkCurrentPathOnClient,
        routesStructure: this.routesStructure,
        registerRouteComponentInstance: this.registerRouteComponentInstance,
        unregisterRouteComponentInstance: this.unregisterRouteComponentInstance,
        pushHistoryObject: this.pushHistoryObject
      } )
      : this.props.children

  }


  setDocumentTitle( documentTitle ){
    window.document.title = documentTitle
  }

  registerRouteComponentInstance( instance ){
    this.routeComponentInstances.push( instance )
  }

  unregisterRouteComponentInstance( instance ){
    this.routeComponentInstances.splice( this.routeComponentInstances.indexOf( instance ), 1 )
  }


  async pushHistoryObject( path ){
    window.history.pushState( {}, null, path )

    if ( this.props.onPathChange ){
      const redirectPath = await this.props.onPathChange( { currentPath: window.location.pathname + window.location.search } )
      if ( redirectPath ){
        window.history.pushState( {}, null, redirectPath )
      }
    }

    this.routeComponentInstances.forEach( instance => instance.setState( { updated: true } ) )
  }


  checkCurrentPathOnClient( routesStructure, currentPath ){
    const findRouteObjectResult = findRouteObject( routesStructure, currentPath )
    const routeObject = findRouteObjectResult.routeObject
    const matchResult = findRouteObjectResult.matchResult
    
    /*
    current route
    */
    if ( routeObject ){
      const findRouteObjectResult2 = checkIfRedirect( routesStructure, routeObject, this.props.services )
      const routeObject2 = findRouteObjectResult2.routeObject
      const matchResult2 = findRouteObjectResult2.matchResult
      
      /*
      redirected route
      */
      if ( routeObject2 ){
        let previouslyRequestedURL = null
        const previouslyRequestedURLQueryFieldIndex = currentPath.indexOf( PREVIOUSLY_REQUESTED_PATH_KEY )
        if ( previouslyRequestedURLQueryFieldIndex != -1 ){
          previouslyRequestedURL = currentPath.slice( previouslyRequestedURLQueryFieldIndex + PREVIOUSLY_REQUESTED_PATH_KEY.length )
        }

        if ( previouslyRequestedURL ){
          const findRouteObjectResult3 = findRouteObject( state.routesStructure, previouslyRequestedURL )
          const routeObject3 = findRouteObjectResult3.routeObject
          const matchResult3 = findRouteObjectResult3.matchResult

          /*
          previously requested route before redirect
          */
          if ( routeObject3 ){
            return { path: previouslyRequestedURL, routeObject: routeObject3, matchResult: matchResult3, documentTitle: routeObject3.documentTitle, isRedirected: true }

          } else {
            return { path: routeObject2.fullPath, routeObject: routeObject2, matchResult: matchResult2, documentTitle: routeObject2.documentTitle, isRedirected: true }

          }

        } else {
          return { path: routeObject2.fullPath, routeObject: routeObject2, matchResult: matchResult2, documentTitle: routeObject2.documentTitle, isRedirected: true }

        }
      } else {
        return { path: routeObject.fullPath, routeObject: routeObject, matchResult: matchResult, documentTitle: routeObject.documentTitle, isRedirected: false }
  
      }

    } else {
      return { path: null, routeObject: null, matchResult: null, documentTitle: MESSAGES.COMPONENTS_NOT_FOUND, isRedirected: true }
      
    }


  }




  componentDidMount(){
    window.addEventListener( 'popstate', this.handlePopState )
  }


  async handlePopState(){

    if ( this.props.onPathChange ){
      const redirectPath = await this.props.onPathChange( { currentPath: window.location.pathname + window.location.search } )
      if ( redirectPath ){
        window.history.pushState( {}, null, redirectPath )
      }
    }

  }

}