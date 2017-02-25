import React from 'react'
import { shallow, render } from 'enzyme'
import { expect } from 'chai'
import Component from './Component'
import preload from '../src'

const component = <Component />

describe('preload', () => {
  it('should pass component as is when without args', () => {
    const wrapper = render(preload()(<Component />))
    expect(wrapper.html()).to.equal(render(component).html())
  })

  describe('init', () => {
    it('should be run before rendering component', () => {
      let counter = 0
      const init = () => counter++
      preload({ init })(component)
      expect(counter).to.equal(1)
    })

    it('should be resolved (if is a promise) before rendering component', (done) => {
      const init = new Promise(resolve => {
        setTimeout(resolve, 1)
      })
      const wrapper = shallow(preload({ init })(component))
      // assert that preload renders null before init is resolved
      expect(wrapper.html()).to.equal(null)

      init.then(() => {
        wrapper.update()
        try {
          // assert that preload renders component after init is resolved
          expect(wrapper.html()).to.equal(shallow(component).html())
          done()
        }
        catch (e) {
          done(e)
        }
      })
    })
  })

  describe('conditions', () => {
    it('should not render component if unmet', () => {
      const conditions = {
        foo: value => value !== undefined
      }
      const wrapper = shallow(preload({
        conditions,
      })(component))
      expect(wrapper.html()).to.equal(null)
    })

    it('should render immediately if conditions are met initially', () => {
      const conditions = {
        foo: value => value === 'bar'
      }
      const wrapper = shallow(preload({
        conditions,
      })(React.cloneElement(component, { foo: 'bar' })))
      expect(wrapper.html()).to.equal(shallow(component).html())
    })

    it('should check conditions when props change', () => {
      const conditions = {
        foo: value => value === 'bar'
      }

      // component is rendered with prop undefined
      const wrapper = shallow(preload({
        conditions,
      })(component))

      // prop is updated to meet condition
      wrapper.setProps({ foo: 'bar' })

      expect(wrapper.html()).to.equal(shallow(component).html())
    })
  })

})
