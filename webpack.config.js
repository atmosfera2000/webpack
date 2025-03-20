const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const autoprefixer = require('autoprefixer')
const CopyPlugin = require("copy-webpack-plugin")
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
const path = require('path')

module.exports = (env) => {

    const isDev = env.mode === 'development';

    const config = {
        mode: env.mode ?? 'development',
        entry: path.resolve(__dirname, 'src', 'index.js'),
        output: {
            filename: '[name].[contenthash].js',
            clean: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public', 'index.html')
            }),
            !isDev && new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'public', 'assets'),
                        to: path.resolve(__dirname, 'dist', 'assets'),                                             
                    },                    
                ],
            }),
        ],
        devtool: isDev ? 'inline-source-map' : false,
        devServer: {
            open: true,
        },
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [               
                        isDev ? "style-loader" : MiniCssExtractPlugin.loader,              
                        {
                            loader: "css-loader",
                        },  
                        !isDev && {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        autoprefixer
                                    ],
                                },
                            },
                        },             
                        {
                            loader: "sass-loader",
                        },
                    ],
                },
            ],
        },
        optimization: {
            minimizer: [             
                !isDev && new ImageMinimizerPlugin({
                    minimizer: {
                        implementation: ImageMinimizerPlugin.imageminMinify,
                        options: {
                            plugins: [
                                "imagemin-gifsicle",
                                "imagemin-jpegtran",
                                "imagemin-optipng",
                                "imagemin-svgo",
                            ],
                        },
                    },
                    generator: [
                        {
                            type: "asset",
                            implementation: ImageMinimizerPlugin.imageminGenerate,
                            options: {
                                plugins: ["imagemin-webp"],
                            },
                        },
                    ],
                }),
            ],
        },
    }

    return config
}