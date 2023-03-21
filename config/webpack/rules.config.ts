import type webpack from 'webpack'
import { type WebpackOptionsInterface } from './types'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export function getRules ({
  isDev
}: WebpackOptionsInterface): webpack.RuleSetRule[] {
  const typescriptConfigLoader: webpack.RuleSetRule = {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/
  }

  const cssLoaders = {
    test: /\.s[ac]ss$/i,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: isDev,
          modules: {
            auto: (resPath: string) => resPath.includes('.module.'),
            localIdentName: isDev
              ? '[name]__[local]--[hash:base64:5]'
              : '[hash:base64:8]'
          }
        }
      },
      {
        loader: 'resolve-url-loader',
        options: {
          sourceMap: isDev
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: isDev
        }
      }
    ]
  }

  const svgrLoader = {
    test: /\.svg$/,
    use: ['@svgr/webpack']
  }

  const filesLoader = {
    test: /\.(png|json|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource'
  }

  return [typescriptConfigLoader, cssLoaders, svgrLoader, filesLoader]
}
