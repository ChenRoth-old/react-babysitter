import React from 'react'
import { shallow, render } from 'enzyme'
import { expect } from 'chai'
import Component from './Component'

describe('preload', () => {
  it('should pass-through component without args', () => {
    const component = render(<Component />)
    const passThrough = render(<Component />)
    expect(component.html()).to.equal(passThrough.html())
  })
})
