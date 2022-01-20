const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  //entries是一个对象，key为目录名
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.ts')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      //收集多个目录下的入口文件（app.ts)，并引入一个热更新文件
      entries[dir] = ['webpack-hot-middleware/client', entry]
    }
    return entries
  }, {}),

  //根据不同的目录名称，打包生成目标JS，目录名和名称一致
  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader'
          }
        ]
      },
      {
        test: /.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', 'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NodeEnvironmentPlugin()
  ]
}
