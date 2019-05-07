const { SnakeNamingStrategy } = require('typeorm-naming-strategies')

/**
 * @type {import('typeorm').ConnectionOptions}
 */
const options = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  synchronize: false,
  logger: 'advanced-console',
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    migrationsDir: 'src/migration'
  }
}

if (process.env.NODE_ENV === 'test') {
  options.database = 'db_test'
} else {
  options.database = 'db_production'
}

if (!process.env.TYPEORM_CLI || process.env.NODE_ENV === 'test') {
  options.entities = [
    'src/**/*.entity.ts'
  ]
  options.logging = true
  options.migrations = [
    'src/migrations/*.ts'
  ]
} else {
  options.entities = [
    'dist/**/*.entity.js'
  ]
  options.logging = false
  options.migrations = [
    'dist/migrations/*.js'
  ]
}

module.exports = options
