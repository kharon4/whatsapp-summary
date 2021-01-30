const path = require("path");
const BookmarkletPlugin = require('bookmarklet-webpack-plugin');

module.exports = {
    mode:'production',
    entry: {
      main: "./js/index.js",
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new BookmarkletPlugin({
          input: 'main.js',             // required (must match webpack output)
          output: 'index.html',          // <- default
          linkName:'WS',        // <- default
          pageTitle: 'whatsapp summary Bookmarklet', // default -> 'Bookmarklet'
          author:'Abhishek Khurana',       // default -> '' (removed line)
        }),
    ],
};