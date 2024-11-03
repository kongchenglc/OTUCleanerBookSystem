const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust this to your main file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  target: 'node', // Set target to Node.js for backend apps
  mode: 'production', // Use 'production' for optimized builds
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Optional if you use Babel
        },
      },
    ],
  },
};
