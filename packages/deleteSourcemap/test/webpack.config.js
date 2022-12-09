
const path = require('path');
const DeleteSourcemap = require('../dist/index');
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './index.js'),
    output: {
        path: path.resolve(__dirname, './dist')
    },
    devtool: 'source-map',
    plugins: [
        new DeleteSourcemap(),
    ]
}