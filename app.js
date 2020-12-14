var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

var indexRouter = require('./routes/index');
//USERS
var signupRouter = require('./routes/users/signup');
var loginRouter = require('./routes/users/login');
var profileRouter = require('./routes/users/profile');

//ADMIN
var adminRouter = require('./routes/admin/admin');
var userRouter = require('./routes/admin/user-lists');

//MIDDLEWARE

var verifyUser = require('./middleware/validateUser');
var verifyAdmin = require('./middleware/validateAdmin');

//logout
var logoutRouter = require('./routes/logout');


var bookRouter = require('./routes/book/bookRoute');
var bookAdminRouter = require('./routes/book/bookAdminRoute');

var categoryRouter = require('./routes/Category/category');
var categoryAdminRouter = require('./routes/Category/categoryAdmin');

var app = express();


var url = process.env.DB_URI;
var connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
}); // added

connect.then((db)=>{ //added
  console.log("Connection to MongoDB success");
}, (err)=>{
  console.log("Connection error: ", err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//admin
app.use('/admin', adminRouter);//login as admin
app.use('/users',verifyAdmin, userRouter);//view all users data

//user
app.use('/signup', signupRouter);//user signup
app.use('/login', loginRouter);//login as user
app.use('/profile',verifyUser, profileRouter)//user profile

//logout both admin and users
app.use('/logout', logoutRouter);

//transactions
// app.use('/pinjam',pinjamRouter);
// app.use('/balikin',balikinRouter);

//book
app.use('/buku', bookRouter);
app.use('/admin/buku', verifyAdmin, bookAdminRouter);

//category
app.use('/kategori',categoryRouter);
app.use('/admin/kategori',verifyAdmin, categoryAdminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
