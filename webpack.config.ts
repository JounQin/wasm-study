import { resolve } from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Configuration } from 'webpack'

const DEV = 'development'

type NodeEnv = typeof DEV | 'production'

const NODE_ENV: NodeEnv = (process.env.NODE_ENV as NodeEnv) || DEV

const isDev = NODE_ENV === DEV

const config: Configuration = {
  mode: NODE_ENV,
  entry: {
    app: resolve('src/index.ts'),
  },
  output: {
    filename: `[name].[${isDev ? 'hash' : 'contenthash'}].js`,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  resolveLoader: {
    modules: [resolve('packages'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        oneOf: [
          {
            include: resolve('asms'),
            loader: 'asms-loader',
            type: 'webassembly/experimental',
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
}

export default config
