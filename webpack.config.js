const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const devServer = require('webpack-dev-server')
module.exports = {
  entry: './src/index.js',
  mode: 'development',
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },

      {
        test: /\.html$/,
        use: 'html-loader'
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },

      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    port: 9000
  }

}
