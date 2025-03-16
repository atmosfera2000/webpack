const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path')

module.exports = (env) => {

    const isDev = env.mode === 'development';

    return {
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
                        "css-loader",               
                        "sass-loader",
                    ],
                },
            ],
        },
    }
}