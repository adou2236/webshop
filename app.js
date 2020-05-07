var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose")
var {checkTokenA,checkTokenC} = require('./tools/checkToken')
const {normalRes} = require("./modules/normalRES")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');//用户相关
var adminRouter = require('./routes/admin');//管理员相关
var categories = require('./routes/categories');//商品类型
var products = require('./routes/products');//商品相关
var resiver = require('./routes/resiver');//收件地址相关
var order = require('./routes/order');//订单相关
var toolRouter = require('./routes/tools');//其他工具
var uploadRouter = require('./routes/imgUpload');

mongoose.connect("mongodb://localhost/webshop")
    .then(()=>{console.log("mongodb connect cuccessfully")})
    .catch((error)=>{console.log(error)})



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// request请求监听，判断token是否有效
app.use(function(req, res, next) {
  let url = req.url
  let token = req.headers.token
  if(url.indexOf("/admin")===-1){//客户端验证
    console.log("客户端")
    if(url!=='/users/login'){
      checkTokenC(token).then((data)=>{
        next()
      }).catch((err)=>{
        res.send(normalRes("tokenError",false))
      })
    }else{
      next()
    }
  }
  else if(url.indexOf("/admin")!==-1){//服务端验证
    console.log("服务端")
    if(url!=='/admin/login'){
      checkTokenA(token).then((data)=>{
        next()
      }).catch((err)=>{
        res.send(normalRes("tokenError",false))
      })
    }else{
      next()
    }  
  }
	
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',adminRouter)
app.use('/categories',categories)
app.use('/products',products)
app.use('/resiver',resiver)
app.use('/order',order)
app.use('/tools',toolRouter)
app.use('/imgUpload', uploadRouter);



// error handler
app.use(function(err, req, res, next) {
  console.log("能否执行")

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
