const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASEURL, {  useNewUrlParser: true })
mongoose.set('useCreateIndex', true)

module.exports = { mongoose }