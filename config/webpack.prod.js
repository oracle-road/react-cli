const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
// 单独提取css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩css
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
// 压缩js
const TerserWebpackPlugin = require('terser-webpack-plugin');
// 压缩图片
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin');

// copy public 静态资源
const CopyWebpackPlugin = require('copy-webpack-plugin');

function getStyle(pre) {
  return [
    MiniCssExtractPlugin.loader,
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
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'static/asset/[hash:8][ext][query]'
  },
  mode: 'production',
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
            '@babel/plugin-transform-runtime'
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
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].chunk.[contenthash:8].css',
    }),
    new ImageMinimizerWebpackPlugin({
      minimizer: {
        implementation: ImageMinimizerWebpackPlugin.imageminMinify,
        options: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
            // Svgo configuration here https://github.com/svg/svgo#configuration
            [
              "svgo",
              {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: {
                        removeViewBox: false,
                        addAttributesToSVGElement: {
                          params: {
                            attributes: [
                              { xmlns: "http://www.w3.org/2000/svg" },
                            ],
                          },
                        },
                      },
                    },
                  },
                ],
              },
            ],
          ],
        },
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    })
  ],
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    minimize: true,
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  },
  resolve: {
    extensions: ['.jsx', '.tsx', '.js', '.ts']
  }
};