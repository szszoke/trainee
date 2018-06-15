import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import srcDir from "./src-dir";

export default {
    entry: ["babel-polyfill", "./src/client/index.ts"],
    output: {
        path: path.resolve(__dirname, "..", "dist"),
        filename: "[name]-[chunkhash].js",
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
            "~": path.join(srcDir, "client"),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [path.join(srcDir, "client")],
                use: ["babel-loader", "ts-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "HiQ Trainee program",
            template: "src/client/assets/index.html",
        }),
        new CleanWebpackPlugin(["dist"], {
            root: path.resolve(__dirname, ".."),
            verbose: true,
        }),
    ],
};
