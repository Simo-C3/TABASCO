const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TailwindCSS = require("tailwindcss");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    popup: path.join(srcDir, "popup.tsx"),
    options: path.join(srcDir, "options.tsx"),
    background: path.join(srcDir, "background.ts"),
    content_script: path.join(srcDir, "content_script.tsx"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "js/[name].js",
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks(chunk) {
        return chunk.name !== "background";
      },
    },
    minimizer: [new CssMinimizerPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(json | png)$/i,
        generator: {
          filename: `../[name][ext]`,
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./*.png", to: ".", context: "public" },
        { from: "./*.json", to: ".", context: "public" },
      ],
      options: {},
    }),
    new MiniCssExtractPlugin({
      filename: "./index.css",
    }),
    new HtmlWebpackPlugin({
      template: "./public/popup.html",
      filename: "./popup.html",
      chunks: ["vendor", "popup"],
    }),
    new HtmlWebpackPlugin({
      template: "./public/options.html",
      filename: "./options.html",
      chunks: ["vendor", "options"],
    }),
  ],
};
