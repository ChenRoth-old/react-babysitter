const path = require('path')

module.exports = (env = 'development') => {
  // eslint-disable-next-line no-console
  console.log(`running webpack in ${env}`)

  return {
    context: path.resolve(__dirname, 'src'),
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'preload.js'
    }
  }
}
