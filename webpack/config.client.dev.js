import path from "path";
import autoprefixer from "autoprefixer";
import common from "./config.client.common";
import srcDir from "./src-dir";

export default {
    ...common,
    devtool: "inline-source-map",
    mode: "development",
    module: {
        ...common.module,
        rules: [
            ...common.module.rules,
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
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
};
