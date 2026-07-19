import { Component } from 'react'

export default class HeroErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return null // silent fail, background tetap jalan
    }
    return this.props.children
  }
}
