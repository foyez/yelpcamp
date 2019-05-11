const env = process.env.NODE_ENV || 'development'

if (env === 'development') {
  process.env.PORT = 3000
  process.env.DATABASEURL = 'mongodb://localhost:27017/YelpCamp'
} else if (env === 'test') {
  process.env.PORT = 3000
  process.env.DATABASEURL = 'mongodb://localhost:27017/YelpCampTest'
}