var express = require('express');
var router = express.Router();
var multer = require('multer');
var pg2 = require('./pgconn');

router.get('/overview',function(req,res,next){
    res.render('deviceOverview');
  })
  
module.exports = router;
