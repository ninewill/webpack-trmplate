var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('css/[name].css');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  context: path.resolve(__dirname,"./src"),
  entry: {
    index:  'index',
    about:  'about'
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: './js/[name].js?[hash:8]',
  },
  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('src/js'),
      path.resolve('src/js/object'),
      path.resolve('src/scss'),
      path.resolve('src/images'),
      path.resolve('src/assets'),
      path.resolve('node_modules')
    ],
    extensions: ['.js']
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true
        }
      }
    }
  },

  devServer: {
    compress: true,
    port: 3000,
    stats: {
      assets: true,
      cached: false,
      chunkModules: false,
      chunkOrigins: false,
      chunks: false,
      colors: true,
      hash: false,
      modules: false,
      reasons: false,
      source: false,
      version: false,
      warnings: false
    },
  },
  module:{
    rules: [
      {
        test: /\.(pug)$/,
        use: ['html-loader', 'pug-html-loader'],
        include: path.resolve('src/pug'),
        exclude: path.resolve('./node_modules'),
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]?[hash:8]'
        },
        include: path.resolve('src/assets'),
        exclude: path.resolve('./node_modules'),
      },
      {
        test: /\.css$/,
        use: extractCSS.extract(['css-loader', 'postcss-loader']),
        include: path.resolve('src/css'),
        exclude: path.resolve('./node_modules'),
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
        include: path.resolve('src/scss'),
        exclude: path.resolve('./node_modules'),
      },
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        include: path.resolve('.'),
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        include: path.resolve('src/images'),
        exclude: path.resolve('./node_modules'),
        use: [
            {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[path][name].[ext]?[hash:8]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              }
            }
          }
        ]
      }
    ]
  },
  plugins:[
    extractCSS,
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' }
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HtmlWebpackPlugin({
      title: 'Webpack前端自動化開發',
      filename: 'index.html',
      template: 'html/index.html',
      viewport: 'width=device-width, initial-scale=1.0',
      chunks: ['vendor', 'index'],
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new HtmlWebpackPlugin({
      title: 'about',
      filename: 'about.html',
      template: 'pug/about.pug',
      viewport: 'width=device-width, initial-scale=1.0',
      chunks: ['vendor', 'about'],
    }),
  ]
}
