import React from 'react'
const noop = () => {
}

class Preload extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isResolved: !props.resolver,
      areConditionsMet: !props.conditions,
    }
  }

  checkConditions(componentProps, conditions) {
    let areConditionsMet = true
    conditions && Object.keys(conditions).forEach(propName => {
      const prop = componentProps[propName]
      areConditionsMet &= conditions[propName](prop)
    })
    this.setState({
      areConditionsMet: !!areConditionsMet,
    })
  }

  wrappedComponentProps() {
    const {
      component,
      conditions,
      resolver,
      ...wrappedProps
    } = this.props
    return wrappedProps
  }

  componentWillReceiveProps(props) {
    const { conditions, component } = props
    this.checkConditions({ ...component.props, ...props }, conditions)
  }

  componentWillMount() {
    const { component, resolver, conditions } = this.props
    if (resolver) {
      resolver.then(() => {
        this.setState({ isResolved: true })
      })
    }

    this.checkConditions(component.props, conditions)
  }

  render() {
    const { component } = this.props
    const { isResolved, areConditionsMet } = this.state
    if (!isResolved || !areConditionsMet) {
      return null
    }

    return React.cloneElement(component, this.wrappedComponentProps())
  }
}

export default({ init = noop, conditions } = {}) => {
  if (typeof init === 'function') {
    init()
    // return component => <Preload conditions={conditions} component={component} />
    return component =>
      <Preload conditions={conditions} component={component} />
  }
  else if (init instanceof Promise) {
    return component => <Preload conditions={conditions} component={component} resolver={init} />
  }
}
