const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

function generateHtmlTemplate(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map((item) => {
        const parts = item.split(".");
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebPackPlugin({
            filename: `view/${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
        });
    });
}
const htmlPlugins = generateHtmlTemplate("./src/view");

module.exports = {
    target: "web",
    mode: "production",
    entry: path.resolve(__dirname, "src", "app.js"),
    module: {
        rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "styles/bundle.css",
        }),
        new CopyWebpackPlugin({
            patterns: [{
                    from: path.resolve(__dirname, "src/images"),
                    to: "images/",
                },
                {
                    from: path.resolve(__dirname, "src/index.html"),
                    to: "index.html",
                },
            ],
        }),
    ].concat(htmlPlugins),
    devServer: {
        static: path.join(__dirname, "src"),
        compress: true,
        port: 9000,
        hot: true,
        open: true,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "scripts/bundle.js",
    },
};