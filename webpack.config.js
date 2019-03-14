const path = require( "path" );

module.exports = {
  entry: path.resolve( __dirname, './views/src/index.js' ),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: [ "@babel/env" ] }
      },
      {
        test: /\.css$/,
        use: [ "style-loader", "css-loader" ]
      }
    ]
  },
  resolve: { extensions: [ "*", ".js", ".jsx" ] },
  output: {
    path: path.resolve( __dirname, "./views/build/" ),
    filename: 'index.js',
  }
};
