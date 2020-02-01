module.exports = {
    entry: './client/index.js',
    output: {
        path: `${__dirname}/public/client`,
        publicPath: '/',
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: { limit: 8192, name: 'static/[hash].[ext]' },
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};
