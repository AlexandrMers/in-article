export type ModeWebpackType = 'production' | 'development'

export interface PathsForWebpackConfig {
  html: string
  entry: string
  output: string
  env: string
  src: string
  nodeModules: string
  public: string
}

export interface WebpackOptionsInterface {
  paths: PathsForWebpackConfig
  port: number
  isDev: boolean
}
