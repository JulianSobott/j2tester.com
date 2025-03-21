const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: ["./src/js/index.js", "./src/css/index.css"],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
            minify: {
                collapseWhitespace: true,
            },
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].min.css",
        }),
    ],
    devServer: {
        port: 8080,
        proxy: [
            {
                context: ["/api", "/healthz"],
                target: process.env.API_URL,
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                include: /\.js$/,
            }),
            new CssMinimizerPlugin(),
        ],
    },
    output: {
        path: resolve(__dirname, "dist"),
        filename: "js/[name].min.js",
    },
};
