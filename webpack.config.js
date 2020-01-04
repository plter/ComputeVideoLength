const path = require('path');

module.exports = {
    entry: path.join(__dirname, "source", "controllers", "MainApp.js"),
    output: {
        path: path.join(__dirname),
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            }
        ]
    }
};
