const path = require("path");
const BookmarkletPlugin = require('bookmarklet-webpack-plugin');

module.exports = {
    mode:'production',
    entry: {
      WS: "./js/WS.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname,"dist"),
    },
    plugins: [
      new BookmarkletPlugin({
        input: 'WS.js',
        output: 'index.html',
        linkName:'WS',
        pageTitle: 'whatsapp summary Bookmarklet',
        author:'Abhishek Khurana',
        repo: 'https://github.com/Kharon4/whatsapp-summary'
      })
    ],
};