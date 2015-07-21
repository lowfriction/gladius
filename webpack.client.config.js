const path = require("path")
const webpack = require("webpack")

// Production flag, turned on with the command-line flag
const __PRODUCTION__ = process.argv.indexOf("--production") > -1

// -- Webpack configuration --

const config = {}

// Application entry point
config.entry = {
  gladius: "./src/client/js/index.js",
}

// Output files in the build/ folder
config.output = {
  path: path.join(__dirname, "build", "public"),
  filename: "[name].js",
  publicPath: "/",
  sourceMapFileName: "[file].map",
}

config.resolve = {
  extensions: [
    "",
    ".js",
    ".json",
  ],
}

config.module = {}

config.module.loaders = [

  // Use babel and eslint to build and validate JavaScript
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loaders: [
      "babel?{stage:0}",
      "eslint",
    ],
  },

  // Allow loading of JSON files
  {
    test: /\.json$/,
    loader: "json",
  },

  // Use cssnext to build CSS
  {
    test: /\.css$/,
    loader: "style!css!cssnext",
  },

  // Copy images
  {
    test: /\.(ico|jpe?g|png|gif)$/,
    loader: "file?name=[path][name].[ext]&context=./src/client",
  },

  // Copy web fonts
  {
    test: /\.(woff|ttf|otf|eot\?#.+|svg#.+)$/,
    loader: "file?name=[path][name].[ext]&context=./src/client",
  },

  // Copy HTML files
  {
    test: /\.html$/,
    loader: "file?name=[path][name].[ext]&context=./src/client",
  },
]

config.plugins = (
    []
)

// Optimize build in production
if (__PRODUCTION__) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    })
  )
}

// cssnext-specific configuration
config.cssnext = {
  sourcemap: !__PRODUCTION__,
  compress: __PRODUCTION__,
}

config.devtool = __PRODUCTION__ ? "source-map" : "cheap-module-source-map"

module.exports = config
