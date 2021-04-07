module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx', 'scss'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|jsx|js)$/,
                exclude: /node_modules\/(?!proton-shared\/).*/,
                use: {
                    loader: 'babel-loader',
                    options: require('../babel.config'),
                },
            },
            {
                test: /\.(scss)$/,
                exclude: [/node_modules/],
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(svg)$/i,
                use: [
                    {
                        loader: 'svg-inline-loader',
                    },
                ],
            },
        ],
    },
};
