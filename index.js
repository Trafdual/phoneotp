const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const doanhnghiepRoutes = require('./routes/DoanhNghiepRoutes')
const countotpRoutes = require('./routes/CountOtpRoutes')

var app = express()
app.use(methodOverride('_method'))
const uri =
  'mongodb://admin:helloadmin@103.90.227.29:27017/webae8?authSource=admin'

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxPoolSize: 1000
  })
  .then(console.log('kết nối thành công'))

const mongoStoreOptions = {
  mongooseConnection: mongoose.connection,
  mongoUrl: uri,
  collection: 'sessions'
}

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreOptions),
    cookie: {
      secure: false
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(cors())

app.use('/', doanhnghiepRoutes)
app.use('/', countotpRoutes)

app.listen(4020, () => {
  try {
    console.log('kết nối thành công 4020')
  } catch (error) {
    console.log('kết nối thất bại 4020', error)
  }
})
