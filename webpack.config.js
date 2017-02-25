const webpack = require('webpack')
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
    },
    plugins: [
      new webpack.IgnorePlugin(/react\/addons/),
      new webpack.IgnorePlugin(/react\/lib\/ReactContext/),
      new webpack.IgnorePlugin(/react\/lib\/ExecutionEnvironment/)
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        }
      ]
    }
  }
}
