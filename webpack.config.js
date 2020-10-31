const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const isDEV = process.env.NODE_ENV == 'development'

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, 'docs'),
        publicPath: '/drive-blog'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            chunksSortMode: "none"
        }),
        new webpack.ProvidePlugin({
            h: ['jsx-pragma', 'h'],
            f: ['jsx-pragma', 'f']
        }),
        new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        })
    ],
    // devtool: isDEV ? 'inline-source-map': '(none)',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.css$/,
                // exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]'
                            },
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                  ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            }
        ]
    },
    devServer: {
        publicPath: '/drive-blog',
        contentBase: path.join(__dirname, 'docs'),
        compress: true,
        historyApiFallback: true
    }
}