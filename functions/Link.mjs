import * as React from 'react'
const Component = React.default.Component
const createElement = React.default.createElement

import { changePathToContext } from './contexts.mjs'

export default class Link extends Component {

  constructor( props ){
    super( props )
    this.onClick = this.onClick.bind( this )
  }

  onClick( e, changePathTo ){
    const { path } = this.props
    e.preventDefault()
    if ( window.location.pathname + window.location.search !== path ){
      history.pushState( {}, null, path )
    }
    changePathTo( path )
  }

  render(){
    const { path, children } = this.props
    return createElement( changePathToContext.Consumer, {},
      changePathTo => createElement( 'a', { href: path, onClick: e => this.onClick( e, changePathTo ) }, 
        children
      )
    )

  }

}