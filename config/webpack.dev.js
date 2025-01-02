const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

function getStyle(pre) {
  return [
    'style-loader',
    'css-loader',
    {
      // 处理css兼容性，需要package.json中的browserslist配合
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env']
        }
      }
    },
    pre
  ].filter(Boolean);
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: undefined,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/asset/[hash:8][ext][query]'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: getStyle()
      },
      {
        test: /\.less$/,
        use: getStyle('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyle('sass-loader')
      },
      {
        test: /\.styl$/,
        use: getStyle('stylus-loader')
      },
      {
        test: /\.(jpeg?|gif|png|webp|svg)$/,
        type: 'asset',
        parser: {
          // 小于10kb的要缩成base64
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        }
      },
      {
        test: /\.(woff2?|ttf)$/,
        type: 'asset/resource'
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: true,
          plugins: [
            '@babel/plugin-transform-runtime',
            'react-refresh/babel'
          ]
        }
      }
    ]
  },
  plugins: [
    new EslintWebpackPlugin({
      configType: 'flat',
      exclude: 'node_modules',
      cache: true
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new ReactRefreshWebpackPlugin()
  ],
  devtool: 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    }
  },
  resolve: {
    extensions: ['.jsx', '.tsx', '.js', '.ts']
  },
  devServer: {
    host: 'localhost',
    port: 3000,
    open: false,
    hot: true,
    historyApiFallback: true
  }
};