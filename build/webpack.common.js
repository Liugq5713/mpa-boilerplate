const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const dev = process.env.NODE_ENV === 'development'

const glob = require('glob')
const entries = glob.sync('./src/**/index.js')
const entry = {}
const htmlPlugins = []
for (const entryPath of entries) {
  const template = entryPath.replace('index.js', 'index.html')
  const chunkName = entryPath.slice('./src/pages/'.length, -'/index.js'.length)
  entry[chunkName] = dev ? [entryPath, template] : entryPath
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
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all'
    }
  },
  node: {
    fs: 'empty'
  },
  output: {
    // 如果配置文件位置修改了的话，这里路径也要改
    path: path.resolve(__dirname, '..', 'dist'),
    filename: dev ? '[name].js' : '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: 'jQuery'
          },
          {
            loader: 'expose-loader',
            options: '$'
          }
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          dev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          dev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader' // 将 Less 编译为 CSS
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100,
              name: 'asset/[name][hash].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
      chunkFilename: '[contenthash].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.HashedModuleIdsPlugin(),
    ...htmlPlugins
  ],
  resolve: {
    alias: {
      // 如果配置文件位置修改了的话，这里路径也要改
      '@': path.resolve(__dirname, '..', 'src')
    }
  },
  performance: {
    hints: dev ? false : 'warning'
  }
}
