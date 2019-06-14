const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')

const dev = process.env.NODE_ENV === 'development'

const glob = require('glob')
const entries = glob.sync('./src/**/index.js')
const entry = {}
const htmlPlugins = []
for (const path of entries) {
  const template = path.replace('index.js', 'index.html')
  const chunkName = path.slice('./src/pages/'.length, -'/index.js'.length)
  entry[chunkName] = dev ? [path, template] : path
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      template,
      filename: chunkName + '.html',
      chunksSortMode: 'none',
      chunks: [chunkName]
    })
  )
}
module.exports = {
  entry,
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
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new WebpackMd5Hash()
  ],

  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    port: 9000
  }
}
