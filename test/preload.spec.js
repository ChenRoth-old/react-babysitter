import React from 'react'
import { shallow, render } from 'enzyme'
import { expect } from 'chai'
import Component from './Component'
import preload from '../src'

describe('preload', () => {
  it('should pass-through component without args', () => {
    const component = <Component />
    const passThrough = preload()(<Component />)
    expect(render(passThrough).html()).to.equal(render(component).html())
  })
})
