const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

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
      chunks: [chunkName, 'jquery'],
      files: {
        js: ['src/shared/jquery.dev.js'],
        chunks: {
          head: {
            entry: 'src/shared/jquery.dev.js'
          }
        }
      }
    })
  )
}

module.exports = {
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',
  entry,
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all'
    },
    minimizer: dev
      ? []
      : [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin()
      ]
  },
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
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
              limit: 10000
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
      chunkFilename: '[contenthash].css'
    }),
    // new BundleAnalyzerPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    ...htmlPlugins
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  performance: {
    hints: dev ? false : 'warning'
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    port: 9000
  }
}
