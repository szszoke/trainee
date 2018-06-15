import path from "path";
import webpack from "webpack";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import autoprefixer from "autoprefixer";
import common from "./config.client.common";
import srcDir from "./src-dir";

export default {
    ...common,
    mode: "production",
    module: {
        ...common.module,
        rules: [
            ...common.module.rules,
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [autoprefixer()],
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            includePaths: [
                                path.join(srcDir, "client", "style"),
                            ],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        ...common.plugins,
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[name]-[chunkhash].css",
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /node_modules/,
                    name: "vendors",
                    enforce: true,
                    chunks: "all",
                },
                styles: {
                    name: "styles",
                    test: /\.css$/,
                    chunks: "all",
                    enforce: true,
                },
            },
        },
        runtimeChunk: {
            name: "manifest",
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
};
