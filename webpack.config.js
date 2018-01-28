const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const stylelint = require('stylelint');
const autoprefixer = require('autoprefixer');
const reporter = require('postcss-reporter');
const extractCss = new ExtractTextPlugin('app.min.css');

module.exports = {
    entry: [
        './src/app.js'
    ],

    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: [path.resolve(__dirname, '../../client')],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['es2015', { loose: true, modules: false }]
                            ]
                        }
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'src'),
                use: extractCss.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                                minimize: true,
                                sourceMap: true
                            }
                        },
                        'sass-loader',
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: [
                                    path.resolve(__dirname, './src/scss/_variables.scss')
                                ]
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer,
                                    stylelint({}),
                                    reporter({
                                        clearReportedMessages: true,
                                        throwError: true
                                    })
                                ]
                            }
                        },
                        'import-glob-loader'
                    ]
                })
            }
        ]
    },
    plugins: [
        extractCss
    ]
};
