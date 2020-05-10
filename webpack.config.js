const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
// const cssLoader = require('css-loader');
  
let isDev = process.env.NODE_ENV === 'development';
const optimize = () => {
    const config = {
        splitChunks: {
            chunks: 'all',
        }
    }
    if(!isDev){
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config;
};

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: ['@babel/polyfill','./js/script.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    optimization: optimize(),
    
    devServer: {
        port: 3200,
        hot: isDev,
    },
    devtool: isDev ? 'source-map' : '',
    module: {
        rules: [
            {test: /\.s[ac]ss$/, use: [
                {loader: 'style-loader'},
                {loader: MiniCssExtractPlugin.loader,
                 options: {
                     hmr: isDev,
                     reloadAll: true,
                 }
                },  
                {loader: 'css-loader'},
                {loader: 'sass-loader'}

            ]
                
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'img',
                }
            },
            {
                test: /\.(ttf|woff|woff2|txt|otf)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'fonts',
                }
                },
            { 
                test: /\.js$/, exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                }
            }

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',    
        }),
        
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
              { from: 'img', to: 'img' }, 
            ]),
        new MiniCssExtractPlugin({
            exclude: '/\.map$/',
            filename: '[name].css'
        }),
            

    ]
};