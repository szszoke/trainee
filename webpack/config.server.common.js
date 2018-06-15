import path from "path";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";
import CleanWebpackPlugin from "clean-webpack-plugin";
import srcDir from "./src-dir";

export default {
    entry: ["babel-polyfill", "./src/server/index.ts"],
    output: {
        path: path.resolve(__dirname, "..", "bin"),
        filename: "index.js",
        libraryTarget: "commonjs",
    },
    target: "node",
    externals: [nodeExternals()],
    node: {
        __dirname: false,
        __filename: false,
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".ts", ".js"],
        alias: {
            "~": path.join(srcDir, "server"),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: [path.join(srcDir, "server")],
                use: ["babel-loader", "ts-loader"],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(["bin"], {
            root: path.resolve(__dirname, ".."),
            verbose: true,
        }),
    ],
};
