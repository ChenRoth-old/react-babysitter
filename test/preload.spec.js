import React, { createElement } from 'react'
import { shallow, render } from 'enzyme'
import { expect } from 'chai'
import Component from './Component'
import preload from '../src'

const getShallowElement = (component, props) =>
  shallow(createElement(component, props))

const getRenderedElement = (component, props) =>
  render(createElement(component, props))

describe('preload', () => {
  it('should pass component as is when without args', () => {
    const wrapper = getRenderedElement(preload()(Component))
    expect(wrapper.html()).to.equal(render(<Component />).html())
  })

  describe('init', () => {
    it('should be run before rendering component', () => {
      let counter = 0
      const init = () => counter++
      getShallowElement(preload({ init })(Component))
      expect(counter).to.equal(1)
    })

    it('should be resolved (if is a promise) before rendering component', (done) => {
      const init = new Promise(resolve => {
        setTimeout(resolve, 1)
      })
      const wrapper = getShallowElement(preload({ init })(Component))
      // assert that preload renders null before init is resolved
      expect(wrapper.html()).to.equal(null)

      init.then(() => {
        wrapper.update()
        try {
          // assert that preload renders component after init is resolved
          expect(wrapper.html()).to.equal(shallow(<Component />).html())
          done()
        }
        catch (e) {
          done(e)
        }
      })
    })
  })

  describe('conditions', () => {
    it('should not render component if unmet (function version)', () => {
      const conditions = props =>
        props.foo !== undefined
      const wrapper = getShallowElement(preload({
        conditions,
      })(Component))
      expect(wrapper.html()).to.equal(null)
    })

    it('should not render component if unmet (object version)', () => {
      const conditions = {
        foo: value => value !== undefined
      }
      const wrapper = getShallowElement(preload({
        conditions,
      })(Component))
      expect(wrapper.html()).to.equal(null)
    })

    it('should render immediately if conditions are met initially', () => {
      const conditions = {
        foo: value => value === 'bar'
      }
      const wrapper = getShallowElement(preload({
        conditions,
      })(Component), { foo: 'bar' })
      expect(wrapper.html()).to.equal(shallow(<Component />).html())
    })

    it('should check conditions when props change', () => {
      const conditions = {
        foo: value => value === 'bar'
      }

      // component is rendered with prop undefined
      const wrapper = getShallowElement(preload({
        conditions,
      })(Component))

      // prop is updated to meet condition
      wrapper.setProps({ foo: 'bar' })

      expect(wrapper.html()).to.equal(shallow(<Component />).html())
    })
  })

  describe('fallback', () => {
    it('should render a fallback component', () => {
      const conditions = () => false
      const Fallback = () => <div>this is a fallback</div>
      const wrapper = getShallowElement(preload({
        conditions,
        fallback: Fallback,
      })(Component))

      expect(wrapper.html()).to.equal(shallow(<Fallback />).html())

    })
  })


})
