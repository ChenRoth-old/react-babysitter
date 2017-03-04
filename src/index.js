import React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
const noop = () => {
}

export default({ init = noop, conditions, fallback } = {}) => {
  return Component => {
    class Preload extends React.Component {
      constructor(props) {
        super(props)

        this.state = {
          isResolved: !init,
          areConditionsMet: !conditions,
        }
      }

      checkConditions(componentProps, conditions) {
        if (typeof(conditions) === 'function') {
          this.setState({
            areConditionsMet: conditions(componentProps)
          })
        } else {
          let areConditionsMet = true
          conditions && Object.keys(conditions).forEach(propName => {
            const prop = componentProps[propName]
            areConditionsMet &= conditions[propName](prop)
          })
          this.setState({
            areConditionsMet,
          })
        }
      }

      componentWillReceiveProps(props) {
        this.checkConditions(props, conditions)
      }

      componentWillMount() {
        if (typeof init !== 'function') {
          return
        }
        const res = init(this.props)
        if (res instanceof Promise) {
          res.then(() => {
            this.setState({ isResolved: true })
          })
        } else {
          this.setState({ isResolved: true })
        }
        this.checkConditions(this.props, conditions)
      }

      render() {
        const { isResolved, areConditionsMet } = this.state
        if (!isResolved || !areConditionsMet) {
          return fallback ? React.createElement(fallback, this.props) : null
        }
        return React.createElement(Component, this.props)
      }
    }
    const getDisplayName = () => Component.displayName || Component.name || 'Component'
    Preload.displayName = `Preload(${getDisplayName()})`
    return hoistNonReactStatic(Preload, Component)
  }
}
