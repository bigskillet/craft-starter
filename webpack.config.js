const path = require('path');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
  entry: {
    main: './src/scripts/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: process.env.NODE_ENV == 'production'
      ? 'assets/[name].[contenthash:8].js'
      : 'assets/[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new BrowserSyncPlugin({
      proxy: 'http://craft-starter.valet',
      files: [
        'templates/**/*',
        'src/**/*'
      ],
      notify: false
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/assets'
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/**/*',
          to: 'assets/[name].[ext]',
          noErrorOnMissing: true,
          globOptions: {
            ignore: [
              '**/scripts',
              '**/styles'
            ]
          }
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: process.env.NODE_ENV == 'production'
        ? 'assets/[name].[contenthash:8].css'
        : 'assets/[name].css'
    }),
    new WebpackManifestPlugin({
      fileName: 'assets/manifest.json',
      map: f => ({ ...f, name: f.path.replace(/.[a-f0-9]{8}/, '') })
    })
  ],
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    },
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true
              }
            }
          ]
        }
      }),
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false
          }
        }
      })
    ]
  }
}
