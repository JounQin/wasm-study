import { resolve } from 'path'

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
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
  module: {
    rules: [
      {
        test: /\.ts$/,
        oneOf: [
          {
            include: resolve('asms'),
            loader: resolve('asms-loader'),
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
  plugins: [
    new HtmlWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      // ignore asms no name found error
      ignoreDiagnostics: [2304],
      tslint: true,
      workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
    }),
  ],
}

export default config
