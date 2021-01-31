const path = require("path");
const BookmarkletPlugin = require('bookmarklet-webpack-plugin');

module.exports = {
    mode:'production',
    entry: {
      WS: "./js/WS.js",
      WSSettings : "./js/WSSettings.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new BookmarkletPlugin({
        input: 'WS.js',             // required (must match webpack output)
        output: 'WS.html',          // <- default
        linkName:'WS',        // <- default
        pageTitle: 'whatsapp summary Bookmarklet', // default -> 'Bookmarklet'
        author:'Abhishek Khurana',       // default -> '' (removed line)
      }),new BookmarkletPlugin({
        input: 'WSSettings.js',             // required (must match webpack output)
        output: 'WSSettings.html',          // <- default
        linkName:'WSS',        // <- default
        pageTitle: 'whatsapp summary Settings Bookmarklet', // default -> 'Bookmarklet'
        author:'Abhishek Khurana',       // default -> '' (removed line)
      }),
    ],
};