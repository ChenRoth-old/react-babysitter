import React from 'react'
const noop = () => {
}

export default({ init = noop, conditions, fallback } = {}) => {
  return Component => {
    class Preload extends React.Component {
      constructor(props) {
        super(props)

        this.state = {
          isResolved: !(init instanceof Promise),
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
            areConditionsMet: !!areConditionsMet,
          })
        }
      }

      componentWillReceiveProps(props) {
        this.checkConditions(props, conditions)
      }

      componentWillMount() {
        if (typeof init === 'function') {
          init(this.props)
        } else if (init instanceof Promise) {
          init.then(() => {
            this.setState({ isResolved: true })
          })
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
    return Preload
  }

// }
// else
// if (init instanceof Promise) {
//   return component => <Preload conditions={conditions} fallback={fallback} component={component}
//                                resolver={init} />
// }
}
