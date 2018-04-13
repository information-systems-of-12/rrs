import * as React from 'react'
const Component = React.default.Component
const createElement = React.default.createElement

import { redirectToContext } from './contexts.mjs'

export default class Updater extends Component {
  constructor( props ){
    super( props )
  }

  render(){
    const componentsHierarchy = this.props.routeObject.components.reduce( ( prev, comp, index ) => {

      return createElement( comp, {
  
        key: index,

        path: this.props.path,
        pathParameters: this.props.pathParameters,
        pathSearchParameters: this.props.pathSearchParameters,
        
        configuration: this.props.configuration,
        providerConfiguration: this.props.providerConfiguration,
        sideActions: this.props.sideActions,

        redirectTo: this.props.redirectTo,
        changeDocumentTitle: this.props.changeDocumentTitle,
        dataStateStorage: this.props.dataStateStorage,

        ...this.props.props
  
      },
  
      prev )
      
    }, null )

    return componentsHierarchy

  }
}