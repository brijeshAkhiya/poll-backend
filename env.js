const environment = {}

environment.dev = {
  DB_URL: 'mongodb+srv://brijesh_1116:mLab17@mycluster0-xnamd.mongodb.net/pollManagement?retryWrites=true&w=majority',
  PORT: '3000',
  JWT_KEY: 'secretKey',
  SALT_NUMBER: 10
}

process.env.JWT_KEY = environment.dev.JWT_KEY
process.env.DB_URL = environment.dev.DB_URL
process.env.SALT_NUMBER = environment.dev.SALT_NUMBER
process.env.NODE_ENV = environment.dev.PORT

module.exports = environment
