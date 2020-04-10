var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/customer', function(req, res, next) {
  res.render('index', { title: '用户' });
});
router.get('/admin', function(req, res, next) {
  res.render('index', { title: '管理员' });
});

module.exports = router;
