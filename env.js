const cloudinary = require('cloudinary').v2
const environment = {}

environment.dev = {
  DB_URL: 'mongodb+srv://brijesh_1116:mLab17@mycluster0-xnamd.mongodb.net/pollManagement?retryWrites=true&w=majority',
  PORT: '3000',
  JWT_KEY: 'secretKey',
  SALT_NUMBER: 10,
  CLOUDINARY_URL: 'cloudinary://786611446216667:mQu7l7wxU1VGdWxmTpIFXx_wWcg@yudiz-solutions'
}
environment.cloud = cloudinary.config({
  cloud_name: 'yudiz-solutions',
  api_key: '786611446216667',
  api_secret: 'mQu7l7wxU1VGdWxmTpIFXx_wWcg'
})

process.env.JWT_KEY = environment.dev.JWT_KEY
process.env.DB_URL = environment.dev.DB_URL
process.env.SALT_NUMBER = environment.dev.SALT_NUMBER
process.env.NODE_ENV = environment.dev.PORT
process.env.CLOUDINARY_URL = environment.dev.CLOUDINARY_URL

module.exports = environment
